/*!
 * Knockout JavaScript library v3.2.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

+function(){
var DEBUG=true;
(function(undefined){
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        jQueryInstance = window["jQuery"],
        JSON = window["JSON"];
(function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target, require);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports', 'require'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports, require){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
window.ko = ko;
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
    // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
ko.version = "3.2.0";

ko.exportSymbol('version', ko.version);
ko.utils = (function () {
    function objectForEach(obj, action) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                action(prop, obj[prop]);
            }
        }
    }

    function extend(target, source) {
        if (source) {
            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    function setPrototypeOf(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }

    var canSetPrototype = ({ __proto__: [] } instanceof Array);

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    objectForEach(knownEvents, function(eventType, knownEventsForType) {
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    });
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
    // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
    // If there is a future need to detect specific versions of IE10+, we will amend this.
    var ieVersion = document && (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        ) {}
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i], i);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i], i))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index > 0) {
                array.splice(index, 1);
            }
            else if (index === 0) {
                array.shift();
            }
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i], i));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i], i))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        addOrRemoveItem: function(array, value, included) {
            var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
            if (existingEntryIndex < 0) {
                if (included)
                    array.push(value);
            } else {
                if (!included)
                    array.splice(existingEntryIndex, 1);
            }
        },

        canSetPrototype: canSetPrototype,

        extend: extend,

        setPrototypeOf: setPrototypeOf,

        setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,

        objectForEach: objectForEach,

        objectMap: function(source, mapping) {
            if (!source)
                return source;
            var target = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = mapping(source[prop], prop, source);
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);

            var container = document.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                container.appendChild(ko.cleanNode(nodesArray[i]));
            }
            return container;
        },

        cloneNodes: function (nodesArray, shouldCleanNodes) {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {
            // Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
            // them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
            // new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
            // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
            // So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
            //
            // Rules:
            //   [A] Any leading nodes that have been removed should be ignored
            //       These most likely correspond to memoization nodes that were already removed during binding
            //       See https://github.com/SteveSanderson/knockout/pull/440
            //   [B] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
            //       and include any nodes that have been inserted among the previous collection

            if (continuousNodeArray.length) {
                // The parent node can be a virtual element; so get the real parent node
                parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

                // Rule [A]
                while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
                    continuousNodeArray.shift();

                // Rule [B]
                if (continuousNodeArray.length > 1) {
                    var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
                    // Replace with the actual new continuous node set
                    continuousNodeArray.length = 0;
                    while (current !== last) {
                        continuousNodeArray.push(current);
                        current = current.nextSibling;
                        if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                            return;
                    }
                    continuousNodeArray.push(last);
                }
            }
            return continuousNodeArray;
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (ieVersion < 7)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (node === containedByNode)
                return true;
            if (node.nodeType === 11)
                return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
            if (containedByNode.contains)
                return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node && node != containedByNode) {
                node = node.parentNode;
            }
            return !!node;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
        },

        anyDomNodeIsAttachedToDocument: function(nodes) {
            return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        registerEventHandler: function (element, eventType, handler) {
            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!mustUseAttachEvent && jQueryInstance) {
                jQueryInstance(element)['bind'](eventType, handler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined") {
                var attachEventHandler = function (event) { handler.call(element, event); },
                    attachEventName = "on" + eventType;
                element.attachEvent(attachEventName, attachEventHandler);

                // IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
                // so to avoid leaks, we have to remove them manually. See bug #856
                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    element.detachEvent(attachEventName, attachEventHandler);
                });
            } else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            // For click events on checkboxes and radio buttons, jQuery toggles the element checked state *after* the
            // event handler runs instead of *before*. (This was fixed in 1.9 for checkboxes but not for radio buttons.)
            // IE doesn't change the checked state when you trigger the click event using "fireEvent".
            // In both cases, we'll use the click method instead.
            var useClickWorkaround = isClickOnCheckableElement(element, eventType);

            if (jQueryInstance && !useClickWorkaround) {
                jQueryInstance(element)['trigger'](eventType);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (useClickWorkaround && element.click) {
                element.click();
            } else if (typeof element.fireEvent != "undefined") {
                element.fireEvent("on" + eventType);
            } else {
                throw new Error("Browser doesn't support triggering events");
            }
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        peekObservable: function (value) {
            return ko.isObservable(value) ? value.peek() : value;
        },

        toggleDomNodeCssClass: function (node, classNames, shouldHaveClass) {
            if (classNames) {
                var cssClassNameRegex = /\S+/g,
                    currentClassNames = node.className.match(cssClassNameRegex) || [];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
                });
                node.className = currentClassNames.join(" ");
            }
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            // We need there to be exactly one child: a text node.
            // If there are no children, more than one, or if it's not a text node,
            // we'll clear everything and create a single text node.
            var innerTextNode = ko.virtualElements.firstChild(element);
            if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
            } else {
                innerTextNode.data = value;
            }

            ko.utils.forceRefresh(element);
        },

        setElementName: function(element, name) {
            element.name = name;

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ieVersion <= 7) {
                try {
                    element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                }
                catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
            }
        },

        forceRefresh: function(node) {
            // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
            if (ieVersion >= 9) {
                // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                var elem = node.nodeType == 1 ? node : node.parentNode;
                if (elem.style)
                    elem.style.zoom = elem.style.zoom;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            // Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
            if (ieVersion) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (JSON && JSON.parse) // Use native parsing where available
                        return JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if (!JSON || !JSON.stringify)
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                // Since 'data' this is a model object, we include all properties including those inherited from its prototype
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            objectForEach(params, function(key, value) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
}());

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};

    function getAll(node, createIfNotFound) {
        var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
        var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
        if (!hasExistingDataStore) {
            if (!createIfNotFound)
                return undefined;
            dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
            dataStore[dataStoreKey] = {};
        }
        return dataStore[dataStoreKey];
    }

    return {
        get: function (node, key) {
            var allDataForNode = getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = getAll(node, true);
            allDataForNode[key] = value;
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        },

        nextKey: function () {
            return (uniqueId++) + dataStoreKeyExpandoPropertyName;
        }
    };
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = ko.utils.domData.nextKey();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Erase the DOM data
        ko.utils.domData.clear(node);

        // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
        ko.utils.domNodeDisposal["cleanExternalData"](node);

        // Clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        },

        "cleanExternalData" : function (node) {
            // Special support for jQuery here because it's so commonly used.
            // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
            // so notify it to tear down any resources associated with the node & descendants here.
            if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                jQueryInstance['cleanData']([node]);
        }
    }
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html) {
        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /* anything else */                                 [0, "", ""];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof window['innerShiv'] == "function") {
            div.appendChild(window['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // Move to the right depth
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html) {
        // jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
        if (jQueryInstance['parseHTML']) {
            return jQueryInstance['parseHTML'](html) || []; // Ensure we always return an array and never null
        } else {
            // For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
            var elems = jQueryInstance['clean']([html]);

            // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
            // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
            // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
            if (elems && elems[0]) {
                // Find the top-most parent element that's a direct child of a document fragment
                var elem = elems[0];
                while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                    elem = elem.parentNode;
                // ... then detach it
                if (elem.parentNode)
                    elem.parentNode.removeChild(elem);
            }

            return elems;
        }
    }

    ko.utils.parseHtmlFragment = function(html) {
        return jQueryInstance ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                              : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (jQueryInstance) {
                jQueryInstance(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'rateLimit': function(target, options) {
        var timeout, method, limitFunction;

        if (typeof options == 'number') {
            timeout = options;
        } else {
            timeout = options['timeout'];
            method = options['method'];
        }

        limitFunction = method == 'notifyWhenChangesStop' ?  debounce : throttle;
        target.limit(function(callback) {
            return limitFunction(callback, timeout);
        });
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always" ?
            null :  // null equalityComparer means to always notify
            valuesArePrimitiveAndEqual;
    }
};

var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
function valuesArePrimitiveAndEqual(a, b) {
    var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
    return oldValueIsPrimitive ? (a === b) : false;
}

function throttle(callback, timeout) {
    var timeoutInstance;
    return function () {
        if (!timeoutInstance) {
            timeoutInstance = setTimeout(function() {
                timeoutInstance = undefined;
                callback();
            }, timeout);
        }
    };
}

function debounce(callback, timeout) {
    var timeoutInstance;
    return function () {
        clearTimeout(timeoutInstance);
        timeoutInstance = setTimeout(callback, timeout);
    };
}

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        ko.utils.objectForEach(requestedExtenders, function(key, value) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, value) || target;
            }
        });
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    this.isDisposed = false;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    ko.utils.setPrototypeOfOrExtend(this, ko.subscribable['fn']);
    this._subscriptions = {};
}

var defaultEvent = "change";

var ko_subscribable_fn = {
    subscribe: function (callback, callbackTarget, event) {
        var self = this;

        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(self, boundCallback, function () {
            ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
            if (self.afterSubscriptionRemove)
                self.afterSubscriptionRemove(event);
        });

        if (self.beforeSubscriptionAdd)
            self.beforeSubscriptionAdd(event);

        if (!self._subscriptions[event])
            self._subscriptions[event] = [];
        self._subscriptions[event].push(subscription);

        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (this.hasSubscriptionsForEvent(event)) {
            try {
                ko.dependencyDetection.begin(); // Begin suppressing dependency detection (by setting the top frame to undefined)
                for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
                    // In case a subscription was disposed during the arrayForEach cycle, check
                    // for isDisposed on each subscription before invoking its callback
                    if (!subscription.isDisposed)
                        subscription.callback(valueToNotify);
                }
            } finally {
                ko.dependencyDetection.end(); // End suppressing dependency detection
            }
        }
    },

    limit: function(limitFunction) {
        var self = this, selfIsObservable = ko.isObservable(self),
            isPending, previousValue, pendingValue, beforeChange = 'beforeChange';

        if (!self._origNotifySubscribers) {
            self._origNotifySubscribers = self["notifySubscribers"];
            self["notifySubscribers"] = function(value, event) {
                if (!event || event === defaultEvent) {
                    self._rateLimitedChange(value);
                } else if (event === beforeChange) {
                    self._rateLimitedBeforeChange(value);
                } else {
                    self._origNotifySubscribers(value, event);
                }
            };
        }

        var finish = limitFunction(function() {
            // If an observable provided a reference to itself, access it to get the latest value.
            // This allows computed observables to delay calculating their value until needed.
            if (selfIsObservable && pendingValue === self) {
                pendingValue = self();
            }
            isPending = false;
            if (self.isDifferent(previousValue, pendingValue)) {
                self._origNotifySubscribers(previousValue = pendingValue);
            }
        });

        self._rateLimitedChange = function(value) {
            isPending = true;
            pendingValue = value;
            finish();
        };
        self._rateLimitedBeforeChange = function(value) {
            if (!isPending) {
                previousValue = value;
                self._origNotifySubscribers(value, beforeChange);
            }
        };
    },

    hasSubscriptionsForEvent: function(event) {
        return this._subscriptions[event] && this._subscriptions[event].length;
    },

    getSubscriptionsCount: function () {
        var total = 0;
        ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
            total += subscriptions.length;
        });
        return total;
    },

    isDifferent: function(oldValue, newValue) {
        return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
    },

    extend: applyExtenders
};

ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);

// For browsers that support proto assignment, we overwrite the prototype of each
// observable instance. Since observables are functions, we need Function.prototype
// to still be in the prototype chain.
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
}

ko.subscribable['fn'] = ko_subscribable_fn;


ko.isSubscribable = function (instance) {
    return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.computedContext = ko.dependencyDetection = (function () {
    var outerFrames = [],
        currentFrame,
        lastId = 0;

    // Return a unique ID that can be assigned to an observable for dependency tracking.
    // Theoretically, you could eventually overflow the number storage size, resulting
    // in duplicate IDs. But in JavaScript, the largest exact integral value is 2^53
    // or 9,007,199,254,740,992. If you created 1,000,000 IDs per second, it would
    // take over 285 years to reach that number.
    // Reference http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html
    function getId() {
        return ++lastId;
    }

    function begin(options) {
        outerFrames.push(currentFrame);
        currentFrame = options;
    }

    function end() {
        currentFrame = outerFrames.pop();
    }

    return {
        begin: begin,

        end: end,

        registerDependency: function (subscribable) {
            if (currentFrame) {
                if (!ko.isSubscribable(subscribable))
                    throw new Error("Only subscribable things can act as dependencies");
                currentFrame.callback(subscribable, subscribable._id || (subscribable._id = getId()));
            }
        },

        ignore: function (callback, callbackTarget, callbackArgs) {
            try {
                begin();
                return callback.apply(callbackTarget, callbackArgs || []);
            } finally {
                end();
            }
        },

        getDependenciesCount: function () {
            if (currentFrame)
                return currentFrame.computed.getDependenciesCount();
        },

        isInitial: function() {
            if (currentFrame)
                return currentFrame.isInitial;
        }
    };
})();

ko.exportSymbol('computedContext', ko.computedContext);
ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);
ko.exportSymbol('computedContext.isSleeping', ko.computedContext.isSleeping);
ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if (observable.isDifferent(_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
                if (DEBUG) observable._latestValue = _latestValue;
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return _latestValue;
        }
    }
    ko.subscribable.call(observable);
    ko.utils.setPrototypeOfOrExtend(observable, ko.observable['fn']);

    if (DEBUG) observable._latestValue = _latestValue;
    observable.peek = function() { return _latestValue };
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }

    ko.exportProperty(observable, 'peek', observable.peek);
    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

    return observable;
}

ko.observable['fn'] = {
    "equalityComparer": valuesArePrimitiveAndEqual
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observable['fn'], ko.subscribable['fn']);
}

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    initialValues = initialValues || [];

    if (typeof initialValues != 'object' || !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
    return result.extend({'trackArrayChanges':true});
};

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this.peek();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this.peek()[index] = newItem;
            this.valueHasMutated();
        }
    }
};

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observableArray constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
}

ko.exportSymbol('observableArray', ko.observableArray);
var arrayChangeEventName = 'arrayChange';
ko.extenders['trackArrayChanges'] = function(target) {
    // Only modify the target observable once
    if (target.cacheDiffForKnownOperation) {
        return;
    }
    var trackingChanges = false,
        cachedDiff = null,
        pendingNotifications = 0,
        underlyingSubscribeFunction = target.subscribe;

    // Intercept "subscribe" calls, and for array change events, ensure change tracking is enabled
    target.subscribe = target['subscribe'] = function(callback, callbackTarget, event) {
        if (event === arrayChangeEventName) {
            trackChanges();
        }
        return underlyingSubscribeFunction.apply(this, arguments);
    };

    function trackChanges() {
        // Calling 'trackChanges' multiple times is the same as calling it once
        if (trackingChanges) {
            return;
        }

        trackingChanges = true;

        // Intercept "notifySubscribers" to track how many times it was called.
        var underlyingNotifySubscribersFunction = target['notifySubscribers'];
        target['notifySubscribers'] = function(valueToNotify, event) {
            if (!event || event === defaultEvent) {
                ++pendingNotifications;
            }
            return underlyingNotifySubscribersFunction.apply(this, arguments);
        };

        // Each time the array changes value, capture a clone so that on the next
        // change it's possible to produce a diff
        var previousContents = [].concat(target.peek() || []);
        cachedDiff = null;
        target.subscribe(function(currentContents) {
            // Make a copy of the current contents and ensure it's an array
            currentContents = [].concat(currentContents || []);

            // Compute the diff and issue notifications, but only if someone is listening
            if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                var changes = getChanges(previousContents, currentContents);
                if (changes.length) {
                    target['notifySubscribers'](changes, arrayChangeEventName);
                }
            }

            // Eliminate references to the old, removed items, so they can be GCed
            previousContents = currentContents;
            cachedDiff = null;
            pendingNotifications = 0;
        });
    }

    function getChanges(previousContents, currentContents) {
        // We try to re-use cached diffs.
        // The scenarios where pendingNotifications > 1 are when using rate-limiting or the Deferred Updates
        // plugin, which without this check would not be compatible with arrayChange notifications. Normally,
        // notifications are issued immediately so we wouldn't be queueing up more than one.
        if (!cachedDiff || pendingNotifications > 1) {
            cachedDiff = ko.utils.compareArrays(previousContents, currentContents, { 'sparse': true });
        }

        return cachedDiff;
    }

    target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
        // Only run if we're currently tracking changes for this observable array
        // and there aren't any pending deferred notifications.
        if (!trackingChanges || pendingNotifications) {
            return;
        }
        var diff = [],
            arrayLength = rawArray.length,
            argsLength = args.length,
            offset = 0;

        function pushDiff(status, value, index) {
            return diff[diff.length] = { 'status': status, 'value': value, 'index': index };
        }
        switch (operationName) {
            case 'push':
                offset = arrayLength;
            case 'unshift':
                for (var index = 0; index < argsLength; index++) {
                    pushDiff('added', args[index], offset + index);
                }
                break;

            case 'pop':
                offset = arrayLength - 1;
            case 'shift':
                if (arrayLength) {
                    pushDiff('deleted', rawArray[offset], offset);
                }
                break;

            case 'splice':
                // Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                    endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                    endAddIndex = startIndex + argsLength - 2,
                    endIndex = Math.max(endDeleteIndex, endAddIndex),
                    additions = [], deletions = [];
                for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                    if (index < endDeleteIndex)
                        deletions.push(pushDiff('deleted', rawArray[index], index));
                    if (index < endAddIndex)
                        additions.push(pushDiff('added', args[argsIndex], index));
                }
                ko.utils.findMovesInArrayComparison(deletions, additions);
                break;

            default:
                return;
        }
        cachedDiff = diff;
    };
};
ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue,
        _needsEvaluation = true,
        _isBeingEvaluated = false,
        _suppressDisposalUntilDisposeWhenReturnsFalse = false,
        _isDisposed = false,
        readFunction = evaluatorFunctionOrOptions,
        pure = false,
        isSleeping = false;

    if (readFunction && typeof readFunction == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = readFunction;
        readFunction = options["read"];
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (!readFunction)
            readFunction = options["read"];
    }
    if (typeof readFunction != "function")
        throw new Error("Pass a function that returns the value of the ko.computed");

    function addSubscriptionToDependency(subscribable, id) {
        if (!_subscriptionsToDependencies[id]) {
            _subscriptionsToDependencies[id] = subscribable.subscribe(evaluatePossiblyAsync);
            ++_dependenciesCount;
        }
    }

    function disposeAllSubscriptionsToDependencies() {
        ko.utils.objectForEach(_subscriptionsToDependencies, function (id, subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = {};
    }

    function disposeComputed() {
        disposeAllSubscriptionsToDependencies();
        _dependenciesCount = 0;
        _isDisposed = true;
        _needsEvaluation = false;
    }

    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else if (dependentObservable._evalRateLimited) {
            dependentObservable._evalRateLimited();
        } else {
            evaluateImmediate();
        }
    }

    function evaluateImmediate(suppressChangeNotification) {
        if (_isBeingEvaluated) {
            if (pure) {
                throw Error("A 'pure' computed must not be called recursively");
            }
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Do not evaluate (and possibly capture new dependencies) if disposed
        if (_isDisposed) {
            return;
        }

        if (disposeWhen && disposeWhen()) {
            // See comment below about _suppressDisposalUntilDisposeWhenReturnsFalse
            if (!_suppressDisposalUntilDisposeWhenReturnsFalse) {
                dispose();
                return;
            }
        } else {
            // It just did return false, so we can stop suppressing now
            _suppressDisposalUntilDisposeWhenReturnsFalse = false;
        }

        _isBeingEvaluated = true;

        // When sleeping, recalculate the value and return.
        if (isSleeping) {
            try {
                var dependencyTracking = {};
                ko.dependencyDetection.begin({
                    callback: function (subscribable, id) {
                        if (!dependencyTracking[id]) {
                            dependencyTracking[id] = 1;
                            ++_dependenciesCount;
                        }
                    },
                    computed: dependentObservable,
                    isInitial: undefined
                });
                _dependenciesCount = 0;
                _latestValue = readFunction.call(evaluatorFunctionTarget);
            } finally {
                ko.dependencyDetection.end();
                _isBeingEvaluated = false;
            }
        } else {
            try {
                // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
                // Then, during evaluation, we cross off any that are in fact still being used.
                var disposalCandidates = _subscriptionsToDependencies, disposalCount = _dependenciesCount;
                ko.dependencyDetection.begin({
                    callback: function(subscribable, id) {
                        if (!_isDisposed) {
                            if (disposalCount && disposalCandidates[id]) {
                                // Don't want to dispose this subscription, as it's still being used
                                _subscriptionsToDependencies[id] = disposalCandidates[id];
                                ++_dependenciesCount;
                                delete disposalCandidates[id];
                                --disposalCount;
                            } else {
                                // Brand new subscription - add it
                                addSubscriptionToDependency(subscribable, id);
                            }
                        }
                    },
                    computed: dependentObservable,
                    isInitial: pure ? undefined : !_dependenciesCount        // If we're evaluating when there are no previous dependencies, it must be the first time
                });

                _subscriptionsToDependencies = {};
                _dependenciesCount = 0;

                try {
                    var newValue = evaluatorFunctionTarget ? readFunction.call(evaluatorFunctionTarget) : readFunction();

                } finally {
                    ko.dependencyDetection.end();

                    // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
                    if (disposalCount) {
                        ko.utils.objectForEach(disposalCandidates, function(id, toDispose) {
                            toDispose.dispose();
                        });
                    }

                    _needsEvaluation = false;
                }

                if (dependentObservable.isDifferent(_latestValue, newValue)) {
                    dependentObservable["notifySubscribers"](_latestValue, "beforeChange");

                    _latestValue = newValue;
                    if (DEBUG) dependentObservable._latestValue = _latestValue;

                    if (suppressChangeNotification !== true) {  // Check for strict true value since setTimeout in Firefox passes a numeric value to the function
                        dependentObservable["notifySubscribers"](_latestValue);
                    }
                }
            } finally {
                _isBeingEvaluated = false;
            }
        }

        if (!_dependenciesCount)
            dispose();
    }

    function dependentObservable() {
        if (arguments.length > 0) {
            if (typeof writeFunction === "function") {
                // Writing a value
                writeFunction.apply(evaluatorFunctionTarget, arguments);
            } else {
                throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
            }
            return this; // Permits chained assignments
        } else {
            // Reading the value
            ko.dependencyDetection.registerDependency(dependentObservable);
            if (_needsEvaluation)
                evaluateImmediate(true /* suppressChangeNotification */);
            return _latestValue;
        }
    }

    function peek() {
        // Peek won't re-evaluate, except to get the initial value when "deferEvaluation" is set, or while the computed is sleeping.
        // Those are the only times that both of these conditions will be satisfied.
        if (_needsEvaluation && !_dependenciesCount)
            evaluateImmediate(true /* suppressChangeNotification */);
        return _latestValue;
    }

    function isActive() {
        return _needsEvaluation || _dependenciesCount > 0;
    }

    // By here, "options" is always non-null
    var writeFunction = options["write"],
        disposeWhenNodeIsRemoved = options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
        disposeWhenOption = options["disposeWhen"] || options.disposeWhen,
        disposeWhen = disposeWhenOption,
        dispose = disposeComputed,
        _subscriptionsToDependencies = {},
        _dependenciesCount = 0,
        evaluationTimeoutInstance = null;

    if (!evaluatorFunctionTarget)
        evaluatorFunctionTarget = options["owner"];

    ko.subscribable.call(dependentObservable);
    ko.utils.setPrototypeOfOrExtend(dependentObservable, ko.dependentObservable['fn']);

    dependentObservable.peek = peek;
    dependentObservable.getDependenciesCount = function () { return _dependenciesCount; };
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () { dispose(); };
    dependentObservable.isActive = isActive;

    // Replace the limit function with one that delays evaluation as well.
    var originalLimit = dependentObservable.limit;
    dependentObservable.limit = function(limitFunction) {
        originalLimit.call(dependentObservable, limitFunction);
        dependentObservable._evalRateLimited = function() {
            dependentObservable._rateLimitedBeforeChange(_latestValue);

            _needsEvaluation = true;    // Mark as dirty

            // Pass the observable to the rate-limit code, which will access it when
            // it's time to do the notification.
            dependentObservable._rateLimitedChange(dependentObservable);
        }
    };

    if (options['pure']) {
        pure = true;
        isSleeping = true;     // Starts off sleeping; will awake on the first subscription
        dependentObservable.beforeSubscriptionAdd = function () {
            // If asleep, wake up the computed and evaluate to register any dependencies.
            if (isSleeping) {
                isSleeping = false;
                evaluateImmediate(true /* suppressChangeNotification */);
            }
        }
        dependentObservable.afterSubscriptionRemove = function () {
            if (!dependentObservable.getSubscriptionsCount()) {
                disposeAllSubscriptionsToDependencies();
                isSleeping = _needsEvaluation = true;
            }
        }
    } else if (options['deferEvaluation']) {
        // This will force a computed with deferEvaluation to evaluate when the first subscriptions is registered.
        dependentObservable.beforeSubscriptionAdd = function () {
            peek();
            delete dependentObservable.beforeSubscriptionAdd;
        }
    }

    ko.exportProperty(dependentObservable, 'peek', dependentObservable.peek);
    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'isActive', dependentObservable.isActive);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

    // Add a "disposeWhen" callback that, on each evaluation, disposes if the node was removed without using ko.removeNode.
    if (disposeWhenNodeIsRemoved) {
        // Since this computed is associated with a DOM node, and we don't want to dispose the computed
        // until the DOM node is *removed* from the document (as opposed to never having been in the document),
        // we'll prevent disposal until "disposeWhen" first returns false.
        _suppressDisposalUntilDisposeWhenReturnsFalse = true;

        // Only watch for the node's disposal if the value really is a node. It might not be,
        // e.g., { disposeWhenNodeIsRemoved: true } can be used to opt into the "only dispose
        // after first false result" behaviour even if there's no specific node to watch. This
        // technique is intended for KO's internal use only and shouldn't be documented or used
        // by application code, as it's likely to change in a future version of KO.
        if (disposeWhenNodeIsRemoved.nodeType) {
            disposeWhen = function () {
                return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || (disposeWhenOption && disposeWhenOption());
            };
        }
    }

    // Evaluate, unless sleeping or deferEvaluation is true
    if (!isSleeping && !options['deferEvaluation'])
        evaluateImmediate();

    // Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
    // removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
    if (disposeWhenNodeIsRemoved && isActive() && disposeWhenNodeIsRemoved.nodeType) {
        dispose = function() {
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, dispose);
            disposeComputed();
        };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
    }

    return dependentObservable;
};

ko.isComputed = function(instance) {
    return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {
    "equalityComparer": valuesArePrimitiveAndEqual
};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.dependentObservable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.dependentObservable['fn'], ko.subscribable['fn']);
}

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
ko.exportSymbol('isComputed', ko.isComputed);

ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
    if (typeof evaluatorFunctionOrOptions === 'function') {
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, {'pure':true});
    } else {
        evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);   // make a copy of the parameter object
        evaluatorFunctionOrOptions['pure'] = true;
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
    }
}
ko.exportSymbol('pureComputed', ko.pureComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject) {
                visitorCallback(propertyName);
            }
        }
    };

    function objectLookup() {
        this.keys = [];
        this.values = [];
    };

    objectLookup.prototype = {
        constructor: objectLookup,
        save: function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            if (existingIndex >= 0)
                this.values[existingIndex] = value;
            else {
                this.keys.push(key);
                this.values.push(value);
            }
        },
        get: function(key) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
        }
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7
                        ? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
                        : element.value;
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value, allowUnset) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    if (value === "" || value === null)       // A blank string or null value will select the caption
                        value = undefined;
                    var selection = -1;
                    for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                        optionValue = ko.selectExtensions.readValue(element.options[i]);
                        // Include special check to handle selecting a caption with a blank string value
                        if (optionValue == value || (optionValue == "" && value === undefined)) {
                            selection = i;
                            break;
                        }
                    }
                    if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
                        element.selectedIndex = selection;
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
    var javaScriptReservedWords = ["true", "false", "null", "undefined"];

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
    var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

    function getWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
            return false;
        var match = expression.match(javaScriptAssignmentTarget);
        return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
    }

    // The following regular expressions will be used to split an object-literal string into tokens

        // These two match strings, either with double quotes or single quotes
    var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
        stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
        // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
        // as a regular expression (this is handled by the parsing loop below).
        stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
        // These characters have special meaning to the parser and must not appear in the middle of a
        // token, except as part of a string.
        specials = ',"\'{}()/:[\\]',
        // Match text (at least two characters) that does not contain any of the above special characters,
        // although some of the special characters are allowed to start it (all but the colon and comma).
        // The text can contain spaces, but leading or trailing spaces are skipped.
        everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
        // Match any non-space character not matched already. This will match colons and commas, since they're
        // not matched by "everyThingElse", but will also match any other single character that wasn't already
        // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
        oneNotSpace = '[^\\s]',

        // Create the actual regular expression by or-ing the above strings. The order is important.
        bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

        // Match end of previous token to determine whether a slash is a division or regex.
        divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
        keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

    function parseObjectLiteral(objectLiteralString) {
        // Trim leading and trailing spaces from the string
        var str = ko.utils.stringTrim(objectLiteralString);

        // Trim braces '{' surrounding the whole object literal
        if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

        // Split into tokens
        var result = [], toks = str.match(bindingToken), key, values, depth = 0;

        if (toks) {
            // Append a comma so that we don't need a separate code block to deal with the last item
            toks.push(',');

            for (var i = 0, tok; tok = toks[i]; ++i) {
                var c = tok.charCodeAt(0);
                // A comma signals the end of a key/value pair if depth is zero
                if (c === 44) { // ","
                    if (depth <= 0) {
                        if (key)
                            result.push(values ? {key: key, value: values.join('')} : {'unknown': key});
                        key = values = depth = 0;
                        continue;
                    }
                // Simply skip the colon that separates the name and value
                } else if (c === 58) { // ":"
                    if (!values)
                        continue;
                // A set of slashes is initially matched as a regular expression, but could be division
                } else if (c === 47 && i && tok.length > 1) {  // "/"
                    // Look at the end of the previous token to determine if the slash is actually division
                    var match = toks[i-1].match(divisionLookBehind);
                    if (match && !keywordRegexLookBehind[match[0]]) {
                        // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                        str = str.substr(str.indexOf(tok) + 1);
                        toks = str.match(bindingToken);
                        toks.push(',');
                        i = -1;
                        // Continue with just the slash
                        tok = '/';
                    }
                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                    ++depth;
                } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                    --depth;
                // The key must be a single token; if it's a string, trim the quotes
                } else if (!key && !values) {
                    key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
                    continue;
                }
                if (values)
                    values.push(tok);
                else
                    values = [tok];
            }
        }
        return result;
    }

    // Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
    var twoWayBindings = {};

    function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
        bindingOptions = bindingOptions || {};

        function processKeyValue(key, val) {
            var writableVal;
            function callPreprocessHook(obj) {
                return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
            }
            if (!bindingParams) {
                if (!callPreprocessHook(ko['getBindingHandler'](key)))
                    return;

                if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                    // For two-way bindings, provide a write method in case the value
                    // isn't a writable observable.
                    propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
                }
            }
            // Values are wrapped in a function so that each value can be accessed independently
            if (makeValueAccessors) {
                val = 'function(){return ' + val + ' }';
            }
            resultStrings.push("'" + key + "':" + val);
        }

        var resultStrings = [],
            propertyAccessorResultStrings = [],
            makeValueAccessors = bindingOptions['valueAccessors'],
            bindingParams = bindingOptions['bindingParams'],
            keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
                parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

        ko.utils.arrayForEach(keyValueArray, function(keyValue) {
            processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
        });

        if (propertyAccessorResultStrings.length)
            processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");

        return resultStrings.join(",");
    }

    return {
        bindingRewriteValidators: [],

        twoWayBindings: twoWayBindings,

        parseObjectLiteral: parseObjectLiteral,

        preProcessBindings: preProcessBindings,

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (keyValueArray[i]['key'] == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindings:         An object with a get method to retrieve bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
            if (!property || !ko.isObservable(property)) {
                var propWriters = allBindings.get('_ko_property_writers');
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!insertAfterNode) {
                ko.virtualElements.prepend(containerNode, nodeToInsert);
            } else if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        hasBindingValue: isStartComment,

        virtualNodeBindingValue: function(node) {
            var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: // Element
                    return node.getAttribute(defaultBindingAttributeName) != null
                        || ko.components['getComponentNameForNode'](node);
                case 8: // Comment node
                    return ko.virtualElements.hasBindingValue(node);
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ false);
        },

        'getBindingAccessors': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ true);
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext, node, options) {
            try {
                var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                return bindingFunction(bindingContext, node);
            } catch (ex) {
                ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                throw ex;
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
        var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
    }

    function createBindingsStringEvaluator(bindingsString, options) {
        // Build the source for a function that evaluates "expression"
        // For each scope variable, add an extra level of "with" nesting
        // Example result: with(sc1) { with(sc0) { return (expression) } }
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
            functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
        return new Function("$context", "$element", functionBody);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    // The following element types will not be recursed into during binding. In the future, we
    // may consider adding <template> to this list, because such elements' contents are always
    // intended to be bound in a different context from where they appear in the document.
    var bindingDoesNotRecurseIntoElementTypes = {
        // Don't want bindings that operate on text nodes to mutate <script> contents,
        // because it's unexpected and a potential XSS issue
        'script': true
    };

    // Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
    ko['getBindingHandler'] = function(bindingKey) {
        return ko.bindingHandlers[bindingKey];
    };

    // The ko.bindingContext constructor is only called directly to create the root context. For child
    // contexts, use bindingContext.createChildContext or bindingContext.extend.
    ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback) {

        // The binding context object includes static properties for the current, parent, and root view models.
        // If a view model is actually stored in an observable, the corresponding binding context object, and
        // any child contexts, must be updated when the view model is changed.
        function updateContext() {
            // Most of the time, the context will directly get a view model object, but if a function is given,
            // we call the function to retrieve the view model. If the function accesses any obsevables or returns
            // an observable, the dependency is tracked, and those observables can later cause the binding
            // context to be updated.
            var dataItemOrObservable = isFunc ? dataItemOrAccessor() : dataItemOrAccessor,
                dataItem = ko.utils.unwrapObservable(dataItemOrObservable);

            if (parentContext) {
                // When a "parent" context is given, register a dependency on the parent context. Thus whenever the
                // parent context is updated, this context will also be updated.
                if (parentContext._subscribable)
                    parentContext._subscribable();

                // Copy $root and any custom properties from the parent context
                ko.utils.extend(self, parentContext);

                // Because the above copy overwrites our own properties, we need to reset them.
                // During the first execution, "subscribable" isn't set, so don't bother doing the update then.
                if (subscribable) {
                    self._subscribable = subscribable;
                }
            } else {
                self['$parents'] = [];
                self['$root'] = dataItem;

                // Export 'ko' in the binding context so it will be available in bindings and templates
                // even if 'ko' isn't exported as a global, such as when using an AMD loader.
                // See https://github.com/SteveSanderson/knockout/issues/490
                self['ko'] = ko;
            }
            self['$rawData'] = dataItemOrObservable;
            self['$data'] = dataItem;
            if (dataItemAlias)
                self[dataItemAlias] = dataItem;

            // The extendCallback function is provided when creating a child context or extending a context.
            // It handles the specific actions needed to finish setting up the binding context. Actions in this
            // function could also add dependencies to this binding context.
            if (extendCallback)
                extendCallback(self, parentContext, dataItem);

            return self['$data'];
        }
        function disposeWhen() {
            return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
        }

        var self = this,
            isFunc = typeof(dataItemOrAccessor) == "function" && !ko.isObservable(dataItemOrAccessor),
            nodes,
            subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

        // At this point, the binding context has been initialized, and the "subscribable" computed observable is
        // subscribed to any observables that were accessed in the process. If there is nothing to track, the
        // computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
        // the context object.
        if (subscribable.isActive()) {
            self._subscribable = subscribable;

            // Always notify because even if the model ($data) hasn't changed, other context properties might have changed
            subscribable['equalityComparer'] = null;

            // We need to be able to dispose of this computed observable when it's no longer needed. This would be
            // easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
            // we cannot assume that those nodes have any relation to each other. So instead we track any node that
            // the context is attached to, and dispose the computed when all of those nodes have been cleaned.

            // Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
            nodes = [];
            subscribable._addNode = function(node) {
                nodes.push(node);
                ko.utils.domNodeDisposal.addDisposeCallback(node, function(node) {
                    ko.utils.arrayRemoveItem(nodes, node);
                    if (!nodes.length) {
                        subscribable.dispose();
                        self._subscribable = subscribable = undefined;
                    }
                });
            };
        }
    }

    // Extend the binding context hierarchy with a new view model object. If the parent context is watching
    // any obsevables, the new child context will automatically get a dependency on the parent context.
    // But this does not mean that the $data value of the child context will also get updated. If the child
    // view model also depends on the parent view model, you must provide a function that returns the correct
    // view model on each update.
    ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback) {
        return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
            // Extend the context hierarchy by setting the appropriate pointers
            self['$parentContext'] = parentContext;
            self['$parent'] = parentContext['$data'];
            self['$parents'] = (parentContext['$parents'] || []).slice(0);
            self['$parents'].unshift(self['$parent']);
            if (extendCallback)
                extendCallback(self);
        });
    };

    // Extend the binding context with new custom properties. This doesn't change the context hierarchy.
    // Similarly to "child" contexts, provide a function here to make sure that the correct values are set
    // when an observable view model is updated.
    ko.bindingContext.prototype['extend'] = function(properties) {
        // If the parent context references an observable view model, "_subscribable" will always be the
        // latest view model object. If not, "_subscribable" isn't set, and we can use the static "$data" value.
        return new ko.bindingContext(this._subscribable || this['$data'], this, null, function(self, parentContext) {
            // This "child" context doesn't directly track a parent observable view model,
            // so we need to manually set the $rawData value to match the parent.
            self['$rawData'] = parentContext['$rawData'];
            ko.utils.extend(self, typeof(properties) == "function" ? properties() : properties);
        });
    };

    // Returns the valueAccesor function for a binding value
    function makeValueAccessor(value) {
        return function() {
            return value;
        };
    }

    // Returns the value of a valueAccessor function
    function evaluateValueAccessor(valueAccessor) {
        return valueAccessor();
    }

    // Given a function that returns bindings, create and return a new object that contains
    // binding value-accessors functions. Each accessor function calls the original function
    // so that it always gets the latest value and all dependencies are captured. This is used
    // by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
    function makeAccessorsFromFunction(callback) {
        return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
            return function() {
                return callback()[key];
            };
        });
    }

    // Given a bindings function or object, create and return a new object that contains
    // binding value-accessors functions. This is used by ko.applyBindingsToNode.
    function makeBindingAccessors(bindings, context, node) {
        if (typeof bindings === 'function') {
            return makeAccessorsFromFunction(bindings.bind(null, context, node));
        } else {
            return ko.utils.objectMap(bindings, makeValueAccessor);
        }
    }

    // This function is used if the binding provider doesn't include a getBindingAccessors function.
    // It must be called with 'this' set to the provider instance.
    function getBindingsAndMakeAccessors(node, context) {
        return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
    }

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild,
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
            provider = ko.bindingProvider['instance'],
            preprocessNode = provider['preprocessNode'];

        // Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
        // possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
        // implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
        // trigger insertion of <template> contents at that point in the document.
        if (preprocessNode) {
            while (currentChild = nextInQueue) {
                nextInQueue = ko.virtualElements.nextSibling(currentChild);
                preprocessNode.call(provider, currentChild);
            }
            // Reset nextInQueue for the next loop
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        }

        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

        if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    var boundElementDomDataKey = ko.utils.domData.nextKey();


    function topologicalSortBindings(bindings) {
        // Depth-first sort
        var result = [],                // The list of key/handler pairs that we will return
            bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
            cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
        ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
            if (!bindingsConsidered[bindingKey]) {
                var binding = ko['getBindingHandler'](bindingKey);
                if (binding) {
                    // First add dependencies (if any) of the current binding
                    if (binding['after']) {
                        cyclicDependencyStack.push(bindingKey);
                        ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
                            if (bindings[bindingDependencyKey]) {
                                if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                                    throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                                } else {
                                    pushBinding(bindingDependencyKey);
                                }
                            }
                        });
                        cyclicDependencyStack.length--;
                    }
                    // Next add the current binding
                    result.push({ key: bindingKey, handler: binding });
                }
                bindingsConsidered[bindingKey] = true;
            }
        });

        return result;
    }

    function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
        // Prevent multiple applyBindings calls for the same node, except when a binding value is specified
        var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
        if (!sourceBindings) {
            if (alreadyBound) {
                throw Error("You cannot apply bindings multiple times to the same element.");
            }
            ko.utils.domData.set(node, boundElementDomDataKey, true);
        }

        // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
        // we can easily recover it just by scanning up the node's ancestors in the DOM
        // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
        if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
            ko.storedBindingContextForNode(node, bindingContext);

        // Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
        var bindings;
        if (sourceBindings && typeof sourceBindings !== 'function') {
            bindings = sourceBindings;
        } else {
            var provider = ko.bindingProvider['instance'],
                getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

            // Get the binding from the provider within a computed observable so that we can update the bindings whenever
            // the binding context is updated or if the binding provider accesses observables.
            var bindingsUpdater = ko.dependentObservable(
                function() {
                    bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                    // Register a dependency on the binding context to support obsevable view models.
                    if (bindings && bindingContext._subscribable)
                        bindingContext._subscribable();
                    return bindings;
                },
                null, { disposeWhenNodeIsRemoved: node }
            );

            if (!bindings || !bindingsUpdater.isActive())
                bindingsUpdater = null;
        }

        var bindingHandlerThatControlsDescendantBindings;
        if (bindings) {
            // Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
            // context update), just return the value accessor from the binding. Otherwise, return a function that always gets
            // the latest binding value and registers a dependency on the binding updater.
            var getValueAccessor = bindingsUpdater
                ? function(bindingKey) {
                    return function() {
                        return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                    };
                } : function(bindingKey) {
                    return bindings[bindingKey];
                };

            // Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
            function allBindings() {
                return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
            }
            // The following is the 3.x allBindings API
            allBindings['get'] = function(key) {
                return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
            };
            allBindings['has'] = function(key) {
                return key in bindings;
            };

            // First put the bindings into the right order
            var orderedBindings = topologicalSortBindings(bindings);

            // Go through the sorted bindings, calling init and update for each
            ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
                // Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
                // so bindingKeyAndHandler.handler will always be nonnull.
                var handlerInitFn = bindingKeyAndHandler.handler["init"],
                    handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                    bindingKey = bindingKeyAndHandler.key;

                if (node.nodeType === 8) {
                    validateThatBindingIsAllowedForVirtualElements(bindingKey);
                }

                try {
                    // Run init, ignoring any dependencies
                    if (typeof handlerInitFn == "function") {
                        ko.dependencyDetection.ignore(function() {
                            var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

                            // If this binding handler claims to control descendant bindings, make a note of this
                            if (initResult && initResult['controlsDescendantBindings']) {
                                if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                    throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                bindingHandlerThatControlsDescendantBindings = bindingKey;
                            }
                        });
                    }

                    // Run update in its own computed wrapper
                    if (typeof handlerUpdateFn == "function") {
                        ko.dependentObservable(
                            function() {
                                handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                            },
                            null,
                            { disposeWhenNodeIsRemoved: node }
                        );
                    }
                } catch (ex) {
                    ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                    throw ex;
                }
            });
        }

        return {
            'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2) {
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
            if (bindingContext._subscribable)
                bindingContext._subscribable._addNode(node);
        } else {
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
        }
    }

    function getBindingContext(viewModelOrBindingContext) {
        return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
            ? viewModelOrBindingContext
            : new ko.bindingContext(viewModelOrBindingContext);
    }

    ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
    };

    ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
        var context = getBindingContext(viewModelOrBindingContext);
        return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
    };

    ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
        // If jQuery is loaded after Knockout, we won't initially have access to it. So save it here.
        if (!jQueryInstance && window['jQuery']) {
            jQueryInstance = window['jQuery'];
        }

        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
(function(undefined) {
    var loadingSubscribablesCache = {}, // Tracks component loads that are currently in flight
        loadedDefinitionsCache = {};    // Tracks component loads that have already completed

    ko.components = {
        get: function(componentName, callback) {
            var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
            if (cachedDefinition) {
                // It's already loaded and cached. Reuse the same definition object.
                // Note that for API consistency, even cache hits complete asynchronously.
                setTimeout(function() { callback(cachedDefinition) }, 0);
            } else {
                // Join the loading process that is already underway, or start a new one.
                loadComponentAndNotify(componentName, callback);
            }
        },

        clearCachedDefinition: function(componentName) {
            delete loadedDefinitionsCache[componentName];
        },

        _getFirstResultFromLoaders: getFirstResultFromLoaders
    };

    function getObjectOwnProperty(obj, propName) {
        return obj.hasOwnProperty(propName) ? obj[propName] : undefined;
    }

    function loadComponentAndNotify(componentName, callback) {
        var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
            completedAsync;
        if (!subscribable) {
            // It's not started loading yet. Start loading, and when it's done, move it to loadedDefinitionsCache.
            subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
            beginLoadingComponent(componentName, function(definition) {
                loadedDefinitionsCache[componentName] = definition;
                delete loadingSubscribablesCache[componentName];

                // For API consistency, all loads complete asynchronously. However we want to avoid
                // adding an extra setTimeout if it's unnecessary (i.e., the completion is already
                // async) since setTimeout(..., 0) still takes about 16ms or more on most browsers.
                if (completedAsync) {
                    subscribable['notifySubscribers'](definition);
                } else {
                    setTimeout(function() {
                        subscribable['notifySubscribers'](definition);
                    }, 0);
                }
            });
            completedAsync = true;
        }
        subscribable.subscribe(callback);
    }

    function beginLoadingComponent(componentName, callback) {
        getFirstResultFromLoaders('getConfig', [componentName], function(config) {
            if (config) {
                // We have a config, so now load its definition
                getFirstResultFromLoaders('loadComponent', [componentName, config], function(definition) {
                    callback(definition);
                });
            } else {
                // The component has no config - it's unknown to all the loaders.
                // Note that this is not an error (e.g., a module loading error) - that would abort the
                // process and this callback would not run. For this callback to run, all loaders must
                // have confirmed they don't know about this component.
                callback(null);
            }
        });
    }

    function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
        // On the first call in the stack, start with the full set of loaders
        if (!candidateLoaders) {
            candidateLoaders = ko.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
        }

        // Try the next candidate
        var currentCandidateLoader = candidateLoaders.shift();
        if (currentCandidateLoader) {
            var methodInstance = currentCandidateLoader[methodName];
            if (methodInstance) {
                var wasAborted = false,
                    synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
                        if (wasAborted) {
                            callback(null);
                        } else if (result !== null) {
                            // This candidate returned a value. Use it.
                            callback(result);
                        } else {
                            // Try the next candidate
                            getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                        }
                    }));

                // Currently, loaders may not return anything synchronously. This leaves open the possibility
                // that we'll extend the API to support synchronous return values in the future. It won't be
                // a breaking change, because currently no loader is allowed to return anything except undefined.
                if (synchronousReturnValue !== undefined) {
                    wasAborted = true;

                    // Method to suppress exceptions will remain undocumented. This is only to keep
                    // KO's specs running tidily, since we can observe the loading got aborted without
                    // having exceptions cluttering up the console too.
                    if (!currentCandidateLoader['suppressLoaderExceptions']) {
                        throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                    }
                }
            } else {
                // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
                getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
            }
        } else {
            // No candidates returned a value
            callback(null);
        }
    }

    // Reference the loaders via string name so it's possible for developers
    // to replace the whole array by assigning to ko.components.loaders
    ko.components['loaders'] = [];

    ko.exportSymbol('components', ko.components);
    ko.exportSymbol('components.get', ko.components.get);
    ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
})();
(function(undefined) {

    // The default loader is responsible for two things:
    // 1. Maintaining the default in-memory registry of component configuration objects
    //    (i.e., the thing you're writing to when you call ko.components.register(someName, ...))
    // 2. Answering requests for components by fetching configuration objects
    //    from that default in-memory registry and resolving them into standard
    //    component definition objects (of the form { createViewModel: ..., template: ... })
    // Custom loaders may override either of these facilities, i.e.,
    // 1. To supply configuration objects from some other source (e.g., conventions)
    // 2. Or, to resolve configuration objects by loading viewmodels/templates via arbitrary logic.

    var defaultConfigRegistry = {};

    ko.components.register = function(componentName, config) {
        if (!config) {
            throw new Error('Invalid configuration for ' + componentName);
        }

        if (ko.components.isRegistered(componentName)) {
            throw new Error('Component ' + componentName + ' is already registered');
        }

        defaultConfigRegistry[componentName] = config;
    }

    ko.components.isRegistered = function(componentName) {
        return componentName in defaultConfigRegistry;
    }

    ko.components.unregister = function(componentName) {
        delete defaultConfigRegistry[componentName];
        ko.components.clearCachedDefinition(componentName);
    }

    ko.components.defaultLoader = {
        'getConfig': function(componentName, callback) {
            var result = defaultConfigRegistry.hasOwnProperty(componentName)
                ? defaultConfigRegistry[componentName]
                : null;
            callback(result);
        },

        'loadComponent': function(componentName, config, callback) {
            var errorCallback = makeErrorCallback(componentName);
            possiblyGetConfigFromAmd(errorCallback, config, function(loadedConfig) {
                resolveConfig(componentName, errorCallback, loadedConfig, callback);
            });
        },

        'loadTemplate': function(componentName, templateConfig, callback) {
            resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
        },

        'loadViewModel': function(componentName, viewModelConfig, callback) {
            resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
        }
    };

    var createViewModelKey = 'createViewModel';

    // Takes a config object of the form { template: ..., viewModel: ... }, and asynchronously convert it
    // into the standard component definition format:
    //    { template: <ArrayOfDomNodes>, createViewModel: function(params, componentInfo) { ... } }.
    // Since both template and viewModel may need to be resolved asynchronously, both tasks are performed
    // in parallel, and the results joined when both are ready. We don't depend on any promises infrastructure,
    // so this is implemented manually below.
    function resolveConfig(componentName, errorCallback, config, callback) {
        var result = {},
            makeCallBackWhenZero = 2,
            tryIssueCallback = function() {
                if (--makeCallBackWhenZero === 0) {
                    callback(result);
                }
            },
            templateConfig = config['template'],
            viewModelConfig = config['viewModel'];

        if (templateConfig) {
            possiblyGetConfigFromAmd(errorCallback, templateConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
                    result['template'] = resolvedTemplate;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }

        if (viewModelConfig) {
            possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
                    result[createViewModelKey] = resolvedViewModel;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }
    }

    function resolveTemplate(errorCallback, templateConfig, callback) {
        if (typeof templateConfig === 'string') {
            // Markup - parse it
            callback(ko.utils.parseHtmlFragment(templateConfig));
        } else if (templateConfig instanceof Array) {
            // Assume already an array of DOM nodes - pass through unchanged
            callback(templateConfig);
        } else if (isDocumentFragment(templateConfig)) {
            // Document fragment - use its child nodes
            callback(ko.utils.makeArray(templateConfig.childNodes));
        } else if (templateConfig['element']) {
            var element = templateConfig['element'];
            if (isDomElement(element)) {
                // Element instance - copy its child nodes
                callback(cloneNodesFromTemplateSourceElement(element));
            } else if (typeof element === 'string') {
                // Element ID - find it, then copy its child nodes
                var elemInstance = document.getElementById(element);
                if (elemInstance) {
                    callback(cloneNodesFromTemplateSourceElement(elemInstance));
                } else {
                    errorCallback('Cannot find element with ID ' + element);
                }
            } else {
                errorCallback('Unknown element type: ' + element);
            }
        } else {
            errorCallback('Unknown template value: ' + templateConfig);
        }
    }

    function resolveViewModel(errorCallback, viewModelConfig, callback) {
        if (typeof viewModelConfig === 'function') {
            // Constructor - convert to standard factory function format
            // By design, this does *not* supply componentInfo to the constructor, as the intent is that
            // componentInfo contains non-viewmodel data (e.g., the component's element) that should only
            // be used in factory functions, not viewmodel constructors.
            callback(function (params /*, componentInfo */) {
                return new viewModelConfig(params);
            });
        } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
            // Already a factory function - use it as-is
            callback(viewModelConfig[createViewModelKey]);
        } else if ('instance' in viewModelConfig) {
            // Fixed object instance - promote to createViewModel format for API consistency
            var fixedInstance = viewModelConfig['instance'];
            callback(function (params, componentInfo) {
                return fixedInstance;
            });
        } else if ('viewModel' in viewModelConfig) {
            // Resolved AMD module whose value is of the form { viewModel: ... }
            resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
        } else {
            errorCallback('Unknown viewModel value: ' + viewModelConfig);
        }
    }

    function cloneNodesFromTemplateSourceElement(elemInstance) {
        switch (ko.utils.tagNameLower(elemInstance)) {
            case 'script':
                return ko.utils.parseHtmlFragment(elemInstance.text);
            case 'textarea':
                return ko.utils.parseHtmlFragment(elemInstance.value);
            case 'template':
                // For browsers with proper <template> element support (i.e., where the .content property
                // gives a document fragment), use that document fragment.
                if (isDocumentFragment(elemInstance.content)) {
                    return ko.utils.cloneNodes(elemInstance.content.childNodes);
                }
        }

        // Regular elements such as <div>, and <template> elements on old browsers that don't really
        // understand <template> and just treat it as a regular container
        return ko.utils.cloneNodes(elemInstance.childNodes);
    }

    function isDomElement(obj) {
        if (window['HTMLElement']) {
            return obj instanceof HTMLElement;
        } else {
            return obj && obj.tagName && obj.nodeType === 1;
        }
    }

    function isDocumentFragment(obj) {
        if (window['DocumentFragment']) {
            return obj instanceof DocumentFragment;
        } else {
            return obj && obj.nodeType === 11;
        }
    }

    function possiblyGetConfigFromAmd(errorCallback, config, callback) {
        if (typeof config['require'] === 'string') {
            // The config is the value of an AMD module
            if (require || window['require']) {
                (require || window['require'])([config['require']], callback);
            } else {
                errorCallback('Uses require, but no AMD loader is present');
            }
        } else {
            callback(config);
        }
    }

    function makeErrorCallback(componentName) {
        return function (message) {
            throw new Error('Component \'' + componentName + '\': ' + message);
        };
    }

    ko.exportSymbol('components.register', ko.components.register);
    ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
    ko.exportSymbol('components.unregister', ko.components.unregister);

    // Expose the default loader so that developers can directly ask it for configuration
    // or to resolve configuration
    ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);

    // By default, the default loader is the only registered component loader
    ko.components['loaders'].push(ko.components.defaultLoader);

    // Privately expose the underlying config registry for use in old-IE shim
    ko.components._allRegisteredComponents = defaultConfigRegistry;
})();
(function (undefined) {
    // Overridable API for determining which component name applies to a given node. By overriding this,
    // you can for example map specific tagNames to components that are not preregistered.
    ko.components['getComponentNameForNode'] = function(node) {
        var tagNameLower = ko.utils.tagNameLower(node);
        return ko.components.isRegistered(tagNameLower) && tagNameLower;
    };

    ko.components.addBindingsForCustomElement = function(allBindings, node, bindingContext, valueAccessors) {
        // Determine if it's really a custom element matching a component
        if (node.nodeType === 1) {
            var componentName = ko.components['getComponentNameForNode'](node);
            if (componentName) {
                // It does represent a component, so add a component binding for it
                allBindings = allBindings || {};

                if (allBindings['component']) {
                    // Avoid silently overwriting some other 'component' binding that may already be on the element
                    throw new Error('Cannot use the "component" binding on a custom element matching a component');
                }

                var componentBindingValue = { 'name': componentName, 'params': getComponentParamsFromCustomElement(node, bindingContext) };

                allBindings['component'] = valueAccessors
                    ? function() { return componentBindingValue; }
                    : componentBindingValue;
            }
        }

        return allBindings;
    }

    var nativeBindingProviderInstance = new ko.bindingProvider();

    function getComponentParamsFromCustomElement(elem, bindingContext) {
        var paramsAttribute = elem.getAttribute('params');

        if (paramsAttribute) {
            var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true }),
                rawParamComputedValues = ko.utils.objectMap(params, function(paramValue, paramName) {
                    return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                }),
                result = ko.utils.objectMap(rawParamComputedValues, function(paramValueComputed, paramName) {
                    // Does the evaluation of the parameter value unwrap any observables?
                    if (!paramValueComputed.isActive()) {
                        // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
                        // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
                        return paramValueComputed.peek();
                    } else {
                        // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
                        // level of observability, and any inner (resulting model value) level of observability.
                        // This means the component doesn't have to worry about multiple unwrapping.
                        return ko.computed(function() {
                            return ko.utils.unwrapObservable(paramValueComputed());
                        }, null, { disposeWhenNodeIsRemoved: elem });
                    }
                });

            // Give access to the raw computeds, as long as that wouldn't overwrite any custom param also called '$raw'
            // This is in case the developer wants to react to outer (binding) observability separately from inner
            // (model value) observability, or in case the model value observable has subobservables.
            if (!result.hasOwnProperty('$raw')) {
                result['$raw'] = rawParamComputedValues;
            }

            return result;
        } else {
            // For consistency, absence of a "params" attribute is treated the same as the presence of
            // any empty one. Otherwise component viewmodels need special code to check whether or not
            // 'params' or 'params.$raw' is null/undefined before reading subproperties, which is annoying.
            return { '$raw': {} };
        }
    }

    // --------------------------------------------------------------------------------
    // Compatibility code for older (pre-HTML5) IE browsers

    if (ko.utils.ieVersion < 9) {
        // Whenever you preregister a component, enable it as a custom element in the current document
        ko.components['register'] = (function(originalFunction) {
            return function(componentName) {
                document.createElement(componentName); // Allows IE<9 to parse markup containing the custom element
                return originalFunction.apply(this, arguments);
            }
        })(ko.components['register']);

        // Whenever you create a document fragment, enable all preregistered component names as custom elements
        // This is needed to make innerShiv/jQuery HTML parsing correctly handle the custom elements
        document.createDocumentFragment = (function(originalFunction) {
            return function() {
                var newDocFrag = originalFunction(),
                    allComponents = ko.components._allRegisteredComponents;
                for (var componentName in allComponents) {
                    if (allComponents.hasOwnProperty(componentName)) {
                        newDocFrag.createElement(componentName);
                    }
                }
                return newDocFrag;
            };
        })(document.createDocumentFragment);
    }
})();(function(undefined) {

    var componentLoadingOperationUniqueId = 0;

    ko.bindingHandlers['component'] = {
        'init': function(element, valueAccessor, ignored1, ignored2, bindingContext) {
            var currentViewModel,
                currentLoadingOperationId,
                disposeAssociatedComponentViewModel = function () {
                    var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                    if (typeof currentViewModelDispose === 'function') {
                        currentViewModelDispose.call(currentViewModel);
                    }

                    // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                    currentLoadingOperationId = null;
                };

            ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

            ko.computed(function () {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    componentName, componentParams;

                if (typeof value === 'string') {
                    componentName = value;
                } else {
                    componentName = ko.utils.unwrapObservable(value['name']);
                    componentParams = ko.utils.unwrapObservable(value['params']);
                }

                if (!componentName) {
                    throw new Error('No component name specified');
                }

                var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                ko.components.get(componentName, function(componentDefinition) {
                    // If this is not the current load operation for this element, ignore it.
                    if (currentLoadingOperationId !== loadingOperationId) {
                        return;
                    }

                    // Clean up previous state
                    disposeAssociatedComponentViewModel();

                    // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                    if (!componentDefinition) {
                        throw new Error('Unknown component \'' + componentName + '\'');
                    }
                    cloneTemplateIntoElement(componentName, componentDefinition, element);
                    var componentViewModel = createViewModel(componentDefinition, element, componentParams),
                        childBindingContext = bindingContext['createChildContext'](componentViewModel);
                    currentViewModel = componentViewModel;
                    ko.applyBindingsToDescendants(childBindingContext, element);
                });
            }, null, { disposeWhenNodeIsRemoved: element });

            return { 'controlsDescendantBindings': true };
        }
    };

    ko.virtualElements.allowedBindings['component'] = true;

    function cloneTemplateIntoElement(componentName, componentDefinition, element) {
        var template = componentDefinition['template'];
        if (!template) {
            throw new Error('Component \'' + componentName + '\' has no template');
        }

        var clonedNodesArray = ko.utils.cloneNodes(template);
        ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    }

    function createViewModel(componentDefinition, element, componentParams) {
        var componentViewModelFactory = componentDefinition['createViewModel'];
        return componentViewModelFactory
            ? componentViewModelFactory.call(componentDefinition, componentParams, { element: element })
            : componentParams; // Template-only component
    }

})();
var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        ko.utils.objectForEach(value, function(attrName, attrValue) {
            attrValue = ko.utils.unwrapObservable(attrValue);

            // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
            // when someProp is a "no value"-like value (strictly null, false, or undefined)
            // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
            var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
            if (toRemove)
                element.removeAttribute(attrName);

            // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
            // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
            // but instead of figuring out the mode, we'll just set the attribute through the Javascript
            // property for IE <= 8.
            if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                attrName = attrHtmlToJavascriptMap[attrName];
                if (toRemove)
                    element.removeAttribute(attrName);
                else
                    element[attrName] = attrValue;
            } else if (!toRemove) {
                element.setAttribute(attrName, attrValue.toString());
            }

            // Treat "name" specially - although you can think of it as an attribute, it also needs
            // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
            // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
            // entirely, and there's no strong reason to allow for such casing in HTML.
            if (attrName === "name") {
                ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
            }
        });
    }
};
(function() {

ko.bindingHandlers['checked'] = {
    'after': ['value', 'attr'],
    'init': function (element, valueAccessor, allBindings) {
        var checkedValue = ko.pureComputed(function() {
            // Treat "value" like "checkedValue" when it is included with "checked" binding
            if (allBindings['has']('checkedValue')) {
                return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
            } else if (allBindings['has']('value')) {
                return ko.utils.unwrapObservable(allBindings.get('value'));
            }

            return element.value;
        });

        function updateModel() {
            // This updates the model value from the view value.
            // It runs in response to DOM events (click) and changes in checkedValue.
            var isChecked = element.checked,
                elemValue = useCheckedValue ? checkedValue() : isChecked;

            // When we're first setting up this computed, don't change any model state.
            if (ko.computedContext.isInitial()) {
                return;
            }

            // We can ignore unchecked radio buttons, because some other radio
            // button will be getting checked, and that one can take care of updating state.
            if (isRadio && !isChecked) {
                return;
            }

            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
            if (isValueArray) {
                if (oldElemValue !== elemValue) {
                    // When we're responding to the checkedValue changing, and the element is
                    // currently checked, replace the old elem value with the new elem value
                    // in the model array.
                    if (isChecked) {
                        ko.utils.addOrRemoveItem(modelValue, elemValue, true);
                        ko.utils.addOrRemoveItem(modelValue, oldElemValue, false);
                    }

                    oldElemValue = elemValue;
                } else {
                    // When we're responding to the user having checked/unchecked a checkbox,
                    // add/remove the element value to the model array.
                    ko.utils.addOrRemoveItem(modelValue, elemValue, isChecked);
                }
            } else {
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
            }
        };

        function updateView() {
            // This updates the view value from the model value.
            // It runs in response to changes in the bound (checked) value.
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (isValueArray) {
                // When a checkbox is bound to an array, being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
            } else if (isCheckbox) {
                // When a checkbox is bound to any other value (not an array), being checked represents the value being trueish
                element.checked = modelValue;
            } else {
                // For radio buttons, being checked means that the radio button's value corresponds to the model value
                element.checked = (checkedValue() === modelValue);
            }
        };

        var isCheckbox = element.type == "checkbox",
            isRadio = element.type == "radio";

        // Only bind to check boxes and radio buttons
        if (!isCheckbox && !isRadio) {
            return;
        }

        var isValueArray = isCheckbox && (ko.utils.unwrapObservable(valueAccessor()) instanceof Array),
            oldElemValue = isValueArray ? checkedValue() : undefined,
            useCheckedValue = isRadio || isValueArray;

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if (isRadio && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });

        // Set up two computeds to update the binding:

        // The first responds to changes in the checkedValue value and to element clicks
        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
        ko.utils.registerEventHandler(element, "click", updateModel);

        // The second responds to changes in the model value (the one associated with the checked binding)
        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['checked'] = true;

ko.bindingHandlers['checkedValue'] = {
    'update': function (element, valueAccessor) {
        element.value = ko.utils.unwrapObservable(valueAccessor());
    }
};

})();var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (typeof value == "object") {
            ko.utils.objectForEach(value, function(className, shouldHaveClass) {
                shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            });
        } else {
            value = String(value || ''); // Make sure we don't try to store or set a non-string value
            ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
            element[classesWrittenByBindingKey] = value;
            ko.utils.toggleDomNodeCssClass(element, value, true);
        }
    }
};
ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
function makeEventHandlerShortcut(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
        }
    }
}

ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var eventsToHandle = valueAccessor() || {};
        ko.utils.objectForEach(eventsToHandle, function(eventName) {
            if (typeof eventName == "string") {
                ko.utils.registerEventHandler(element, eventName, function (event) {
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[eventName];
                    if (!handlerFunction)
                        return;

                    try {
                        // Take all the event args, and prefix with the viewmodel
                        var argsForHandler = ko.utils.makeArray(arguments);
                        viewModel = bindingContext['$data'];
                        argsForHandler.unshift(viewModel);
                        handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                    } finally {
                        if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        }
                    }

                    var bubble = allBindings.get(eventName + 'Bubble') !== false;
                    if (!bubble) {
                        event.cancelBubble = true;
                        if (event.stopPropagation)
                            event.stopPropagation();
                    }
                });
            }
        });
    }
};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    }
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
var hasfocusLastValue = '__ko_hasfocusLastValue';
ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindings) {
        var handleElementFocusChange = function(isFocused) {
            // Where possible, ignore which event was raised and determine focus state using activeElement,
            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
            // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
            // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
            // from calling 'blur()' on the element when it loses focus.
            // Discussion at https://github.com/SteveSanderson/knockout/pull/352
            element[hasfocusUpdatingProperty] = true;
            var ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                var active;
                try {
                    active = ownerDoc.activeElement;
                } catch(e) {
                    // IE9 throws if you access activeElement during page load (see issue #703)
                    active = ownerDoc.body;
                }
                isFocused = (active === element);
            }
            var modelValue = valueAccessor();
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

            //cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
            element[hasfocusLastValue] = isFocused;
            element[hasfocusUpdatingProperty] = false;
        };
        var handleElementFocusIn = handleElementFocusChange.bind(null, true);
        var handleElementFocusOut = handleElementFocusChange.bind(null, false);

        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = !!ko.utils.unwrapObservable(valueAccessor()); //force boolean to compare with last value
        if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
            value ? element.focus() : element.blur();
            ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
        }
    }
};
ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        // setHtml will unwrap the value if needed
        ko.utils.setHtml(element, valueAccessor());
    }
};
// Makes a binding like with or if
function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
    ko.bindingHandlers[bindingKey] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var didDisplayOnLastUpdate,
                savedNodes;
            ko.computed(function() {
                var dataValue = ko.utils.unwrapObservable(valueAccessor()),
                    shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
                    isFirstRender = !savedNodes,
                    needsRefresh = isFirstRender || isWith || (shouldDisplay !== didDisplayOnLastUpdate);

                if (needsRefresh) {
                    // Save a copy of the inner nodes on the initial update, but only if we have dependencies.
                    if (isFirstRender && ko.computedContext.getDependenciesCount()) {
                        savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                    }

                    if (shouldDisplay) {
                        if (!isFirstRender) {
                            ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                        }
                        ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
                    } else {
                        ko.virtualElements.emptyNode(element);
                    }

                    didDisplayOnLastUpdate = shouldDisplay;
                }
            }, null, { disposeWhenNodeIsRemoved: element });
            return { 'controlsDescendantBindings': true };
        }
    };
    ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings[bindingKey] = true;
}

// Construct the actual binding handlers
makeWithIfBinding('if');
makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
makeWithIfBinding('with', true /* isWith */, false /* isNot */,
    function(bindingContext, dataValue) {
        return bindingContext['createChildContext'](dataValue);
    }
);
var captionPlaceholder = {};
ko.bindingHandlers['options'] = {
    'init': function(element) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        // Remove all existing <option>s.
        while (element.length > 0) {
            element.remove(0);
        }

        // Ensures that the binding processor doesn't try to bind the options
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor, allBindings) {
        function selectedOptions() {
            return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
        }

        var selectWasPreviouslyEmpty = element.length == 0;
        var previousScrollTop = (!selectWasPreviouslyEmpty && element.multiple) ? element.scrollTop : null;
        var unwrappedArray = ko.utils.unwrapObservable(valueAccessor());
        var includeDestroyed = allBindings.get('optionsIncludeDestroyed');
        var arrayToDomNodeChildrenOptions = {};
        var captionValue;
        var filteredArray;
        var previousSelectedValues;

        if (element.multiple) {
            previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
        } else {
            previousSelectedValues = element.selectedIndex >= 0 ? [ ko.selectExtensions.readValue(element.options[element.selectedIndex]) ] : [];
        }

        if (unwrappedArray) {
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // If caption is included, add it to the array
            if (allBindings['has']('optionsCaption')) {
                captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                // If caption value is null or undefined, don't show a caption
                if (captionValue !== null && captionValue !== undefined) {
                    filteredArray.unshift(captionPlaceholder);
                }
            }
        } else {
            // If a falsy value is provided (e.g. null), we'll simply empty the select element
        }

        function applyToObject(object, predicate, defaultValue) {
            var predicateType = typeof predicate;
            if (predicateType == "function")    // Given a function; run it against the data value
                return predicate(object);
            else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                return object[predicate];
            else                                // Given no optionsText arg; use the data value itself
                return defaultValue;
        }

        // The following functions can run at two different times:
        // The first is when the whole array is being updated directly from this binding handler.
        // The second is when an observable value for a specific array entry is updated.
        // oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
        var itemUpdate = false;
        function optionForArrayItem(arrayEntry, index, oldOptions) {
            if (oldOptions.length) {
                previousSelectedValues = oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
                itemUpdate = true;
            }
            var option = element.ownerDocument.createElement("option");
            if (arrayEntry === captionPlaceholder) {
                ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                ko.selectExtensions.writeValue(option, undefined);
            } else {
                // Apply a value to the option element
                var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                // Apply some text to the option element
                var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                ko.utils.setTextContent(option, optionText);
            }
            return [option];
        }

        // By using a beforeRemove callback, we delay the removal until after new items are added. This fixes a selection
        // problem in IE<=8 and Firefox. See https://github.com/knockout/knockout/issues/1208
        arrayToDomNodeChildrenOptions['beforeRemove'] =
            function (option) {
                element.removeChild(option);
            };

        function setSelectionCallback(arrayEntry, newOptions) {
            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
            // That's why we first added them without selection. Now it's time to set the selection.
            if (previousSelectedValues.length) {
                var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

                // If this option was changed from being selected during a single-item update, notify the change
                if (itemUpdate && !isSelected)
                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
            }
        }

        var callback = setSelectionCallback;
        if (allBindings['has']('optionsAfterRender')) {
            callback = function(arrayEntry, newOptions) {
                setSelectionCallback(arrayEntry, newOptions);
                ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
            }
        }

        ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);

        ko.dependencyDetection.ignore(function () {
            if (allBindings.get('valueAllowUnset') && allBindings['has']('value')) {
                // The model value is authoritative, so make sure its value is the one selected
                ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
            } else {
                // Determine if the selection has changed as a result of updating the options list
                var selectionChanged;
                if (element.multiple) {
                    // For a multiple-select box, compare the new selection count to the previous one
                    // But if nothing was selected before, the selection can't have changed
                    selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
                } else {
                    // For a single-select box, compare the current value to the previous value
                    // But if nothing was selected before or nothing is selected now, just look for a change in selection
                    selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
                        ? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
                        : (previousSelectedValues.length || element.selectedIndex >= 0);
                }

                // Ensure consistency between model value and selected option.
                // If the dropdown was changed so that selection is no longer the same,
                // notify the value or selectedOptions binding.
                if (selectionChanged) {
                    ko.utils.triggerEvent(element, "change");
                }
            }
        });

        // Workaround for IE bug
        ko.utils.ensureSelectElementIsRenderedCorrectly(element);

        if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
            element.scrollTop = previousScrollTop;
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
ko.bindingHandlers['selectedOptions'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor(), valueToWrite = [];
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                if (node.selected)
                    valueToWrite.push(ko.selectExtensions.readValue(node));
            });
            ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (newValue && typeof newValue.length == "number") {
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                ko.utils.setOptionNodeSelectionState(node, isSelected);
            });
        }
    }
};
ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        ko.utils.objectForEach(value, function(styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            element.style[styleName] = styleValue;
        });
    }
};
ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(bindingContext['$data'], element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};
ko.bindingHandlers['text'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
        // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};
ko.virtualElements.allowedBindings['text'] = true;
(function () {

if (window && window.navigator) {
    var parseVersion = function (matches) {
        if (matches) {
            return parseFloat(matches[1]);
        }
    };

    // Detect various browser versions because some old versions don't fully support the 'input' event
    var operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()),
        userAgent = window.navigator.userAgent,
        safariVersion = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
        firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
}

// IE 8 and 9 have bugs that prevent the normal events from firing when the value changes.
// But it does fire the 'selectionchange' event on many of those, presumably because the
// cursor is moving and that counts as the selection changing. The 'selectionchange' event is
// fired at the document level only and doesn't directly indicate which element changed. We
// set up just one event handler for the document and use 'activeElement' to determine which
// element was changed.
if (ko.utils.ieVersion < 10) {
    var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
        selectionChangeHandlerName = ko.utils.domData.nextKey();
    var selectionChangeHandler = function(event) {
        var target = this.activeElement,
            handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
        if (handler) {
            handler(event);
        }
    };
    var registerForSelectionChangeEvent = function (element, handler) {
        var ownerDoc = element.ownerDocument;
        if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
            ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
            ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
        }
        ko.utils.domData.set(element, selectionChangeHandlerName, handler);
    };
}

ko.bindingHandlers['textInput'] = {
    'init': function (element, valueAccessor, allBindings) {

        var previousElementValue = element.value,
            timeoutHandle,
            elementValueBeforeEvent;

        var updateModel = function (event) {
            clearTimeout(timeoutHandle);
            elementValueBeforeEvent = timeoutHandle = undefined;

            var elementValue = element.value;
            if (previousElementValue !== elementValue) {
                // Provide a way for tests to know exactly which event was processed
                if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                previousElementValue = elementValue;
                ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
            }
        };

        var deferUpdateModel = function (event) {
            if (!timeoutHandle) {
                // The elementValueBeforeEvent variable is set *only* during the brief gap between an
                // event firing and the updateModel function running. This allows us to ignore model
                // updates that are from the previous state of the element, usually due to techniques
                // such as rateLimit. Such updates, if not ignored, can cause keystrokes to be lost.
                elementValueBeforeEvent = element.value;
                var handler = DEBUG ? updateModel.bind(element, {type: event.type}) : updateModel;
                timeoutHandle = setTimeout(handler, 4);
            }
        };

        var updateView = function () {
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (modelValue === null || modelValue === undefined) {
                modelValue = '';
            }

            if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                setTimeout(updateView, 4);
                return;
            }

            // Update the element only if the element and model are different. On some browsers, updating the value
            // will move the cursor to the end of the input, which would be bad while the user is typing.
            if (element.value !== modelValue) {
                previousElementValue = modelValue;  // Make sure we ignore events (propertychange) that result from updating the value
                element.value = modelValue;
            }
        };

        var onEvent = function (event, handler) {
            ko.utils.registerEventHandler(element, event, handler);
        };

        if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
            // Provide a way for tests to specify exactly which events are bound
            ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function(eventName) {
                if (eventName.slice(0,5) == 'after') {
                    onEvent(eventName.slice(5), deferUpdateModel);
                } else {
                    onEvent(eventName, updateModel);
                }
            });
        } else {
            if (ko.utils.ieVersion < 10) {
                // Internet Explorer <= 8 doesn't support the 'input' event, but does include 'propertychange' that fires whenever
                // any property of an element changes. Unlike 'input', it also fires if a property is changed from JavaScript code,
                // but that's an acceptable compromise for this binding. IE 9 does support 'input', but since it doesn't fire it
                // when using autocomplete, we'll use 'propertychange' for it also.
                onEvent('propertychange', function(event) {
                    if (event.propertyName === 'value') {
                        updateModel(event);
                    }
                });

                if (ko.utils.ieVersion == 8) {
                    // IE 8 has a bug where it fails to fire 'propertychange' on the first update following a value change from
                    // JavaScript code. It also doesn't fire if you clear the entire value. To fix this, we bind to the following
                    // events too.
                    onEvent('keyup', updateModel);      // A single keystoke
                    onEvent('keydown', updateModel);    // The first character when a key is held down
                }
                if (ko.utils.ieVersion >= 8) {
                    // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
                    // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
                    // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
                    // can detect all of those except dragging text out of the field, for which we use 'dragend'.
                    // These are also needed in IE8 because of the bug described above.
                    registerForSelectionChangeEvent(element, updateModel);  // 'selectionchange' covers cut, paste, drop, delete, etc.
                    onEvent('dragend', deferUpdateModel);
                }
            } else {
                // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
                // through the user interface.
                onEvent('input', updateModel);

                if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                    // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
                    // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
                    onEvent('keydown', deferUpdateModel);
                    onEvent('paste', deferUpdateModel);
                    onEvent('cut', deferUpdateModel);
                } else if (operaVersion < 11) {
                    // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
                    // We can try to catch some of those using 'keydown'.
                    onEvent('keydown', deferUpdateModel);
                } else if (firefoxVersion < 4.0) {
                    // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                    onEvent('DOMAutoComplete', updateModel);

                    // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
                    onEvent('dragdrop', updateModel);       // <3.5
                    onEvent('drop', updateModel);           // 3.5
                }
            }
        }

        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
        onEvent('change', updateModel);

        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['textInput'] = true;

// textinput is an alias for textInput
ko.bindingHandlers['textinput'] = {
    // preprocess is the only way to set up a full alias
    'preprocess': function (value, name, addBinding) {
        addBinding('textInput', value);
    }
};

})();ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
            ko.utils.setElementName(element, name);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['value'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        // If the value binding is placed on a radio/checkbox, then just pass through to checkedValue and quit
        if (element.tagName.toLowerCase() == "input" && (element.type == "checkbox" || element.type == "radio")) {
            ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
            return;
        }

        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindings.get("valueUpdate");
        var propertyChangedFired = false;
        var elementValueBeforeEvent = null;

        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            elementValueBeforeEvent = null;
            propertyChangedFired = false;
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "focus", function () { propertyChangedFired = false });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() {
                    // The elementValueBeforeEvent variable is non-null *only* during the brief gap between
                    // a keyX event firing and the valueUpdateHandler running, which is scheduled to happen
                    // at the earliest asynchronous opportunity. We store this temporary information so that
                    // if, between keyX and valueUpdateHandler, the underlying model value changes separately,
                    // we can overwrite that model value change with the value the user just typed. Otherwise,
                    // techniques like rateLimit can trigger model changes at critical moments that will
                    // override the user's inputs, causing keystrokes to be lost.
                    elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                    setTimeout(valueUpdateHandler, 0);
                };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });

        var updateFromModel = function () {
            var newValue = ko.utils.unwrapObservable(valueAccessor());
            var elementValue = ko.selectExtensions.readValue(element);

            if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                setTimeout(updateFromModel, 0);
                return;
            }

            var valueHasChanged = (newValue !== elementValue);

            if (valueHasChanged) {
                if (ko.utils.tagNameLower(element) === "select") {
                    var allowUnset = allBindings.get('valueAllowUnset');
                    var applyValueAction = function () {
                        ko.selectExtensions.writeValue(element, newValue, allowUnset);
                    };
                    applyValueAction();

                    if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                        // because you're not allowed to have a model value that disagrees with a visible UI selection.
                        ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                    } else {
                        // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                        // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                        // to apply the value as well.
                        setTimeout(applyValueAction, 0);
                    }
                } else {
                    ko.selectExtensions.writeValue(element, newValue);
                }
            }
        };

        ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
    },
    'update': function() {} // Keep for backwards compatibility with code that may have wrapped value binding
};
ko.expressionRewriting.twoWayBindings['value'] = true;
ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;
    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.expressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
        var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript =
            "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                var nodeToBind = domNode.nextSibling;
                if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                    ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                }
            });
        }
    }
})();


// Exported only because it has to be referenced by string lookup from within rewritten template
ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    ko.templateSources.domElement = function(element) {
        this.domElement = element;
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var tagNameLower = ko.utils.tagNameLower(this.domElement),
            elemContentsProperty = tagNameLower === "script" ? "text"
                                 : tagNameLower === "textarea" ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
        } else {
            ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    var anonymousTemplatesDomDataKey = ko.utils.domData.nextKey();
    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
        }
    };
    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            return templateData.containerData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            action(node, nextInQueue);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0],
                lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                parentNode = firstNode.parentNode,
                provider = ko.bindingProvider['instance'],
                preprocessNode = provider['preprocessNode'];

            if (preprocessNode) {
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
                    var nodePreviousSibling = node.previousSibling;
                    var newNodes = preprocessNode.call(provider, node);
                    if (newNodes) {
                        if (node === firstNode)
                            firstNode = newNodes[0] || nextNodeInRange;
                        if (node === lastNode)
                            lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                    }
                });

                // Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
                // We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
                // first node needs to be in the array).
                continuousNodeArray.length = 0;
                if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
                    return;
                }
                if (firstNode === lastNode) {
                    continuousNodeArray.push(firstNode);
                } else {
                    continuousNodeArray.push(firstNode, lastNode);
                    ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                }
            }

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });

            // Make sure any changes done by applyBindings or unmemoize are reflected in the array
            ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
        }

        return renderedNodesArray;
    }

    function resolveTemplateName(template, data, context) {
        // The template can be specified as:
        if (ko.isObservable(template)) {
            // 1. An observable, with string value
            return template();
        } else if (typeof template === 'function') {
            // 2. A function of (data, context) returning a string
            return template(data, context);
        } else {
            // 3. A string
            return template;
        }
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                    var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                        renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);

                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function(context) {
                context['$index'] = index;
            });

            var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
            // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
            ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

        }, null, { disposeWhenNodeIsRemoved: targetNode });
    };

    var templateComputedDomDataKey = ko.utils.domData.nextKey();
    function disposeOldComputedAndStoreNewOne(element, newComputed) {
        var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
        if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
            oldComputed.dispose();
        ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if (typeof bindingValue == "string" || bindingValue['name']) {
                // It's a named template - clear the element
                ko.virtualElements.emptyNode(element);
            } else {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                dataValue,
                options = ko.utils.unwrapObservable(value),
                shouldDisplay = true,
                templateComputed = null,
                templateName;

            if (typeof options == "string") {
                templateName = value;
                options = {};
            } else {
                templateName = options['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in options)
                    shouldDisplay = ko.utils.unwrapObservable(options['if']);
                if (shouldDisplay && 'ifnot' in options)
                    shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

                dataValue = ko.utils.unwrapObservable(options['data']);
            }

            if ('foreach' in options) {
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && options['foreach']) || [];
                templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
            } else if (!shouldDisplay) {
                ko.virtualElements.emptyNode(element);
            } else {
                // Render once for this single data point (or use the viewModel if no data was provided)
                var innerBindingContext = ('data' in options) ?
                    bindingContext['createChildContext'](dataValue, options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
                    bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
                templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
            }

            // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
            disposeOldComputedAndStoreNewOne(element, templateComputed);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);
// Go through the items that have been added and deleted and try to find matches between them.
ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
    if (left.length && right.length) {
        var failedCompares, l, r, leftItem, rightItem;
        for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
            for (r = 0; rightItem = right[r]; ++r) {
                if (leftItem['value'] === rightItem['value']) {
                    leftItem['moved'] = rightItem['index'];
                    rightItem['moved'] = leftItem['index'];
                    right.splice(r, 1);         // This item is marked as moved; so remove it from right list
                    failedCompares = r = 0;     // Reset failed compares count because we're checking for consecutive failures
                    break;
                }
            }
            failedCompares += r;
        }
    }
};

ko.utils.compareArrays = (function () {
    var statusNotInOld = 'added', statusNotInNew = 'deleted';

    // Simple calculation based on Levenshtein distance.
    function compareArrays(oldArray, newArray, options) {
        // For backward compatibility, if the third arg is actually a bool, interpret
        // it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
        options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
        oldArray = oldArray || [];
        newArray = newArray || [];

        if (oldArray.length <= newArray.length)
            return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
        else
            return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
    }

    function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
        var myMin = Math.min,
            myMax = Math.max,
            editDistanceMatrix = [],
            smlIndex, smlIndexMax = smlArray.length,
            bigIndex, bigIndexMax = bigArray.length,
            compareRange = (bigIndexMax - smlIndexMax) || 1,
            maxDistance = smlIndexMax + bigIndexMax + 1,
            thisRow, lastRow,
            bigIndexMaxForRow, bigIndexMinForRow;

        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push(thisRow = []);
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex)
                    thisRow[bigIndex] = smlIndex + 1;
                else if (!smlIndex)  // Top row - transform empty array into new array via additions
                    thisRow[bigIndex] = bigIndex + 1;
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                    thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                else {
                    var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }

        var editScript = [], meMinusOne, notInSml = [], notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
                notInSml.push(editScript[editScript.length] = {     // added
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex });
            } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                notInBig.push(editScript[editScript.length] = {     // deleted
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex });
            } else {
                --bigIndex;
                --smlIndex;
                if (!options['sparse']) {
                    editScript.push({
                        'status': "retained",
                        'value': bigArray[bigIndex] });
                }
            }
        }

        // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
        // smlIndexMax keeps the time complexity of this algorithm linear.
        ko.utils.findMovesInArrayComparison(notInSml, notInBig, smlIndexMax * 10);

        return editScript.reverse();
    }

    return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.length = 0;
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
        return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
    }

    var lastMappingResultDomDataKey = ko.utils.domData.nextKey();

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var newMappingResultIndex = 0;

        var nodesToDelete = [];
        var itemsToProcess = [];
        var itemsForBeforeRemoveCallbacks = [];
        var itemsForMoveCallbacks = [];
        var itemsForAfterAddCallbacks = [];
        var mapData;

        function itemMovedOrRetained(editScriptIndex, oldPosition) {
            mapData = lastMappingResult[oldPosition];
            if (newMappingResultIndex !== oldPosition)
                itemsForMoveCallbacks[editScriptIndex] = mapData;
            // Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
            mapData.indexObservable(newMappingResultIndex++);
            ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
            newMappingResult.push(mapData);
            itemsToProcess.push(mapData);
        }

        function callCallback(callback, items) {
            if (callback) {
                for (var i = 0, n = items.length; i < n; i++) {
                    if (items[i]) {
                        ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
                            callback(node, i, items[i].arrayEntry);
                        });
                    }
                }
            }
        }

        for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
            movedIndex = editScriptItem['moved'];
            switch (editScriptItem['status']) {
                case "deleted":
                    if (movedIndex === undefined) {
                        mapData = lastMappingResult[lastMappingResultIndex];

                        // Stop tracking changes to the mapping for these nodes
                        if (mapData.dependentObservable)
                            mapData.dependentObservable.dispose();

                        // Queue these nodes for later removal
                        nodesToDelete.push.apply(nodesToDelete, ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode));
                        if (options['beforeRemove']) {
                            itemsForBeforeRemoveCallbacks[i] = mapData;
                            itemsToProcess.push(mapData);
                        }
                    }
                    lastMappingResultIndex++;
                    break;

                case "retained":
                    itemMovedOrRetained(i, lastMappingResultIndex++);
                    break;

                case "added":
                    if (movedIndex !== undefined) {
                        itemMovedOrRetained(i, movedIndex);
                    } else {
                        mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
                        newMappingResult.push(mapData);
                        itemsToProcess.push(mapData);
                        if (!isFirstExecution)
                            itemsForAfterAddCallbacks[i] = mapData;
                    }
                    break;
            }
        }

        // Call beforeMove first before any changes have been made to the DOM
        callCallback(options['beforeMove'], itemsForMoveCallbacks);

        // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
        ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

        // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
        for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
            // Get nodes for newly added items
            if (!mapData.mappedNodes)
                ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

            // Put nodes in the right place if they aren't there already
            for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                if (node !== nextNode)
                    ko.virtualElements.insertAfter(domNode, node, lastNode);
            }

            // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
            if (!mapData.initialized && callbackAfterAddingNodes) {
                callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                mapData.initialized = true;
            }
        }

        // If there's a beforeRemove callback, call it after reordering.
        // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
        // some sort of animation, which is why we first reorder the nodes that will be removed. If the
        // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
        // Perhaps we'll make that change in the future if this scenario becomes more common.
        callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

        // Finally call afterMove and afterAdd callbacks
        callCallback(options['afterMove'], itemsForMoveCallbacks);
        callCallback(options['afterAdd'], itemsForAfterAddCallbacks);

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if (!jQueryInstance || !(jQueryInstance['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQueryInstance['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQueryInstance['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
        };

        if (jQueryTmplVersion > 0) {
            jQueryInstance['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQueryInstance['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
    ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
}));
}());
}();

/** 
 * datatable v3.0.3
 * 
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/datatable#readme
 * bugs : https://github.com/iuap-design/datatable/issues
 **/ 

var U_LANGUAGES = "i_languages";
var U_THEME = "u_theme";
var U_LOCALE = "u_locale";
var U_USERCODE = "usercode";
var enumerables = true,enumerablesTest = {toString: 1},toString = Object.prototype.toString;

for (var i in enumerablesTest) {
	enumerables = null;
}
if (enumerables) {
	enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
		'toLocaleString', 'toString', 'constructor'];
}

window.u = window.u || {};
//window.$ = {}
var u = window.u;
//var $ = u;

u.enumerables = enumerables;
/**
 * 复制对象属性
 *
 * @param {Object}  目标对象
 * @param {config} 源对象
 */
u.extend = function(object, config) {
	var args = arguments,options;
	if(args.length > 1){
		for(var len=1; len<args.length; len++){
			options = args[len];
			if (object && options && typeof options === 'object') {
				var i, j, k;
				for (i in options) {
					object[i] = options[i];
				}
				if (enumerables) {
					for (j = enumerables.length; j--;) {
						k = enumerables[j];
						if (options.hasOwnProperty && options.hasOwnProperty(k)) {
							object[k] = options[k];
						}
					}
				}
			}
		}
	}
	return object;
};

u.extend(u, {
	setCookie: function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
		var sCookie = sName + "=" + encodeURIComponent(sValue);
		if (oExpires)
			sCookie += "; expires=" + oExpires.toGMTString();
		if (sPath)
			sCookie += "; path=" + sPath;
		if (sDomain)
			sCookie += "; domain=" + sDomain;
		if (bSecure)
			sCookie += "; secure=" + bSecure;
		document.cookie = sCookie;
	},
	getCookie: function (sName) {
		var sRE = "(?:; )?" + sName + "=([^;]*);?";
		var oRE = new RegExp(sRE);

		if (oRE.test(document.cookie)) {
			return decodeURIComponent(RegExp["$1"]);
		} else
			return null;
	},
	/**
	 * 创建一个带壳的对象,防止外部修改
	 * @param {Object} proto
	 */
	createShellObject: function (proto) {
		var exf = function () {
		}
		exf.prototype = proto;
		return new exf();
	},
	execIgnoreError: function (a, b, c) {
		try {
			a.call(b, c);
		} catch (e) {
		}
	},
	on: function (element, eventName,child,listener) {
		if(!element)
			return;
		if(arguments.length < 4){
			listener = child;
			child = undefined;
		}else{
			var childlistener = function(e){
				if(!e){
					return;
				}
				var tmpchildren = element.querySelectorAll(child)
				tmpchildren.forEach(function(node){
					if(node == e.target){
							listener.call(e.target,e)
					}
				})
			}
		}
		//capture = capture || false;

		if(!element["uEvent"]){
			//在dom上添加记录区
			element["uEvent"] = {}
		}
		//判断是否元素上是否用通过on方法填加进去的事件
		if(!element["uEvent"][eventName]){
			element["uEvent"][eventName] = [child?childlistener:listener]
			if(u.event && u.event[eventName] && u.event[eventName].setup){
				u.event[eventName].setup.call(element);
			}
			element["uEvent"][eventName+'fn'] = function(e){
												//火狐下有问题修改判断
												if(!e)
													e = typeof event != 'undefined' && event?event:window.event;
												element["uEvent"][eventName].forEach(function(fn){
													try{
														e.target = e.target || e.srcElement;//兼容IE8
													}catch(e){
													}
													if(fn)
														fn.call(element,e)
												})
											}
			if (element.addEventListener) {  // 用于支持DOM的浏览器
				element.addEventListener(eventName, element["uEvent"][eventName+'fn']);
			} else if (element.attachEvent) {  // 用于IE浏览器
				element.attachEvent("on" + eventName,element["uEvent"][eventName+'fn'] );
			} else {  // 用于其它浏览器
				element["on" + eventName] = element["uEvent"][eventName+'fn']
			}
		}else{
			//如果有就直接往元素的记录区添加事件
			var lis = child?childlistener:listener;
			var hasLis = false;
			element["uEvent"][eventName].forEach(function(fn){
				if(fn == lis){
					hasLis = true;
				}
			});
			if(!hasLis){
				element["uEvent"][eventName].push(child?childlistener:listener)
			}
		}

	},
	off: function(element, eventName, listener){
		//删除事件数组
		if(listener){
			if(element && element["uEvent"] && element["uEvent"][eventName]){
				element["uEvent"][eventName].forEach(function(fn,i){
					if(fn == listener){
						element["uEvent"][eventName].splice(i,1);
					}
				});
			}
			return;
		}
		var eventfn = element["uEvent"][eventName+'fn']
		if (element.removeEventListener) {  // 用于支持DOM的浏览器
			element.removeEventListener(eventName,eventfn );
		} else if (element.removeEvent) {  // 用于IE浏览器
			element.removeEvent("on" + eventName, eventfn);
		} else {  // 用于其它浏览器
			delete element["on" + eventName]
		}
		if(u.event && u.event[eventName] && u.event[eventName].teardown){
			u.event[eventName].teardown.call(element);
		}
		element["uEvent"][eventName] = undefined
		element["uEvent"][eventName+'fn'] = undefined


	},
	trigger:function(element,eventName){
		if(element["uEvent"] && element["uEvent"][eventName]){
			element["uEvent"][eventName+'fn']()
		}
	},
	/**
	 * 增加样式
	 * @param value
	 * @returns {*}
	 */
	addClass: function (element, value) {
		if (typeof element.classList === 'undefined') {
			if(u._addClass)
				u._addClass(element, value);
		} else {
			element.classList.add(value);
		}
		return u;
	},
	removeClass: function (element, value) {
		if (typeof element.classList === 'undefined') {
			if(u._removeClass)
				u._removeClass(element, value);
		} else {
			element.classList.remove(value);
		}
		return u;
	},
	hasClass: function(element, value){
		if (!element) return false;
		if (element.nodeName && (element.nodeName === '#text'||element.nodeName === '#comment')) return false;
		if (typeof element.classList === 'undefined') {
			if(u._hasClass)
				return u._hasClass(element,value);
			return false;
		}else{
			return element.classList.contains(value);
		}
	},
	toggleClass: function(element,value){
		if (typeof element.classList === 'undefined') {
			return u._toggleClass(element,value);
		}else{
			return element.classList.toggle(value);
		}
	},
	closest: function(element, selector) {
		var tmp = element;
		while(tmp != null &&!u.hasClass(tmp, selector) && tmp != document.body ) {
		  tmp = tmp.parentNode;
		}
		if(tmp == document.body) return null;
		return tmp;
	},
	css:function(element,csstext,val){
		if(csstext instanceof Object){
			for(var k in csstext){
				var tmpcss = csstext[k]
				if(["width","height","top","bottom","left","right"].indexOf(k) > -1 && u.isNumber(tmpcss) ){
					tmpcss = tmpcss + "px"
				}
				element.style[k] = tmpcss
			}
		}else{
			if(arguments.length > 2){
				element.style[csstext] = val
			}else{
				return u.getStyle(element,csstext)
			}
		}

	},
	wrap:function(element,parent){
		var p = u.makeDOM(parent)
			element.parentNode.insertBefore(p,element)
			p.appendChild(element)
	},
	getStyle:function(element,key){
		//不要在循环里用
		var allCSS
		if(window.getComputedStyle){
			allCSS = window.getComputedStyle(element)
		}else{
			allCSS = element.currentStyle
		}
		if(allCSS[key] !== undefined){
			return allCSS[key]
		}else{
			return ""
		}
	},
	/**
	 * 统一zindex值, 不同控件每次显示时都取最大的zindex，防止显示错乱
	 */
	getZIndex: function(){
		if (!u.globalZIndex){
			u.globalZIndex = 2000;
		}
		return u.globalZIndex ++;
	},
	makeDOM: function(htmlString){
		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlString;
		var _dom = tempDiv.children[0];
		return _dom;
	},
	/**
	 * element
	 */
	makeModal : function(element,parEle){
	    var overlayDiv = document.createElement('div');
	    u.addClass(overlayDiv, 'u-overlay');
	    overlayDiv.style.zIndex = u.getZIndex();
	    // 如果有父元素则插入到父元素上，没有则添加到body上
	    if(parEle&&parEle!=document.body){
	    	u.addClass(overlayDiv, 'hasPar');
	    	parEle.appendChild(overlayDiv);
	    }else{
	    	document.body.appendChild(overlayDiv)
	    }
	    
	    element.style.zIndex = u.getZIndex();
	    u.on(overlayDiv, 'click', function(e){
	        u.stopEvent(e);
	    })
	    return overlayDiv;
	},
	getOffset : function(Node, offset){
		if (!offset) {
	        offset = {};
	        offset.top = 0;
	        offset.left = 0;
	    }
	    if (Node == document.body) {
	        return offset;
	    }
	    offset.top += Node.offsetTop;
	    offset.left += Node.offsetLeft;
	    if(Node.offsetParent)
	    	return u.getOffset(Node.offsetParent, offset);
	    else
	    	return offset;
	},
	getScroll:function(Node, offset){
		if (!offset) {
	        offset = {};
	        offset.top = 0;
	        offset.left = 0;
	    }
	    if (Node == document.body) {
	    	offset.top += Node.scrollTop || document.documentElement.scrollTop;
	    	offset.left += Node.scrollLeft || document.documentElement.scrollLeft;
	        return offset;
	    }
	    offset.top += Node.scrollTop;
	    offset.left += Node.scrollLeft;
	    if(Node.parentNode)
	    	return u.getScroll(Node.parentNode, offset);
	    else
	    	return offset;
	},
	showPanelByEle:function(obj){
		var ele = obj.ele,panel = obj.panel,position = obj.position,
			off = u.getOffset(ele),scroll = u.getScroll(ele),
			offLeft = off.left,offTop = off.top,
			scrollLeft = scroll.left,scrollTop = scroll.top,
			eleWidth = ele.offsetWidth,eleHeight = ele.offsetHeight,
			panelWidth = panel.offsetWidth,panelHeight = panel.offsetHeight,
			bodyWidth = document.body.clientWidth,bodyHeight = document.body.clientHeight,
			position = position || 'top',
			left = offLeft - scrollLeft,top = offTop - scrollTop;
			// 基准点为Ele的左上角
			// 后续根据需要完善
		if(position == 'left'){
			left=left-panelWidth;
			top=top+(eleHeight - panelHeight)/2;
		}else if(position == 'right'){
			left=left+eleWidth;
			top=top+(eleHeight - panelHeight)/2;
		}else if(position == 'top'||position == 'topCenter'){
			left = left + (eleWidth - panelWidth)/2;
			top = top - panelHeight;
		}else if(position == 'bottom'||position == 'bottomCenter'){
			left = left+ (eleWidth - panelWidth)/2;
			top = top + eleHeight;
		}else if(position == 'bottomLeft'){
			left = left;
			top = top + eleHeight;
		}
        
        // if((left + panelWidth) > bodyWidth)
        //     left = bodyWidth - panelWidth;
        // if(left < 0)
        //     left = 0;

        // if((top + panelHeight) > bodyHeight)
        //     top = bodyHeight - panelHeight;
        // if(top < 0)
        //     top = 0;
        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
	},

	/**
	 * 阻止冒泡
	 */
	stopEvent: function(e){
		if(typeof(e) != "undefined") {
			if (e.stopPropagation)
				e.stopPropagation();
			else {
				e.cancelBubble = true;
			}
			//阻止默认浏览器动作(W3C)
			if (e && e.preventDefault)
				e.preventDefault();
			//IE中阻止函数器默认动作的方式
			else
				window.event.returnValue = false;
		}
	},
	getFunction: function(target, val){
		if (!val || typeof val == 'function') return val
		if (typeof target[val] == 'function')
			return target[val]
		else if (typeof window[val] == 'function')
			return window[val]
		else if (val.indexOf('.') != -1){
			var func = u.getJSObject(target, val)
			if (typeof func == 'function') return func
			func = u.getJSObject(window, val)
			if (typeof func == 'function') return func
		}
		return val
	},
	getJSObject: function(target, names) {
		if(!names) {
			return;
		}
		if (typeof names == 'object')
			return names
		var nameArr = names.split('.')
		var obj = target
		for (var i = 0; i < nameArr.length; i++) {
			obj = obj[nameArr[i]]
			if (!obj) return null
		}
		return obj
	},
	isDate: function(input){
		return Object.prototype.toString.call(input) === '[object Date]' ||
				input instanceof Date;
	},
	isNumber : function(obj){
		//return obj === +obj
		return (obj - parseFloat( obj ) + 1) >= 0;
	},
	isArray: Array.isArray || function (val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	},
	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},
	inArray :function(node,arr){


	  if(!arr instanceof Array){
		throw "arguments is not Array";
	  }

	  for(var i=0,k=arr.length;i<k;i++){
		if(node==arr[i]){
		  return true;
		}
	  }

	  return false;
	},
	each: function(obj,callback){
		if(obj.forEach){
			obj.forEach(function(v,k){callback(k,v)})

		}else if(obj instanceof Object){
			for(var k in obj){
				callback(k,obj[k])
			}
		}else{
			return
		}

	}

});

//core context
(function() {
	var environment = {};
	/**
	 * client attributes
	 */
	var clientAttributes = {};

	var sessionAttributes = {};

	var fn = {};
	var maskerMeta = {
		'float': {
			precision: 2
		},
		'datetime': {
			format: 'YYYY-MM-DD HH:mm:ss',
			metaType: 'DateTimeFormatMeta',
			speratorSymbol: '-'
		},
		'time':{
			format:'HH:mm'
		},
		'date':{
			format:'YYYY-MM-DD'
		},
		'currency':{
			precision: 2,
			curSymbol: '￥'
		},
		'percent':{

		}
	};
	/**
	 * 获取环境信息
	 * @return {environment}
	 */
	fn.getEnvironment = function() {
		return u.createShellObject(environment);
	};

	/**
	 * 获取客户端参数对象
	 * @return {clientAttributes}
	 */
	fn.getClientAttributes = function() {
		var exf = function() {}
		return u.createShellObject(clientAttributes);
	}


	fn.setContextPath = function(contextPath) {
		return environment[IWEB_CONTEXT_PATH] = contextPath
	}
	fn.getContextPath = function(contextPath) {
		return environment[IWEB_CONTEXT_PATH]
	}
	/**
	 * 设置客户端参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
	fn.setClientAttribute = function(k, v) {
		clientAttributes[k] = v;
	}
	/**
	 * 获取会话级参数对象
	 * @return {clientAttributes}
	 */
	fn.getSessionAttributes = function() {
		var exf = function() {}
		return u.createShellObject(sessionAttributes);
	}

	/**
	 * 设置会话级参数对象
	 * @param {Object} k 对象名称
	 * @param {Object} v 对象值(建议使用简单类型)
	 */
	fn.setSessionAttribute = function(k, v) {
		sessionAttributes[k] = v;
		setCookie("ISES_" + k, v);
	}

	/**
	 * 移除客户端参数
	 * @param {Object} k 对象名称
	 */
	fn.removeClientAttribute = function(k) {
		clientAttributes[k] = null;
		execIgnoreError(function() {
			delete clientAttributes[k];
		})
	}

		/**
		 * 获取地区信息编码
		 */
		fn.getLocale = function() {
			return this.getEnvironment().locale
		}

	/**
	 * 获取多语信息
	 */
	fn.getLanguages = function(){
		return this.getEnvironment().languages
	};
	/**
	 * 收集环境信息(包括客户端参数)
	 * @return {Object}
	 */
	fn.collectEnvironment = function() {
		var _env = this.getEnvironment();
		var _ses = this.getSessionAttributes();

		for (var i in clientAttributes) {
			_ses[i] = clientAttributes[i];
		}
		_env.clientAttributes = _ses;
		return _env
	}

	/**
	 * 设置数据格式信息
	 * @param {String} type
	 * @param {Object} meta
	 */
	fn.setMaskerMeta = function(type, meta) {
		if (typeof type == 'function'){
			getMetaFunc = type;
		}else{
			if (!maskerMeta[type])
				maskerMeta[type] = meta;
			else{
				if (typeof meta != 'object')
					maskerMeta[type] = meta;
				else
					for (var key in meta){
						maskerMeta[type][key] = meta[key];
					}
			}
		}
	};
	fn.getMaskerMeta = function(type) {
		if (typeof getMetaFunc == 'function'){
			var meta = getMetaFunc.call(this);
			return meta[type];
		}else
			return u.extend({}, maskerMeta[type]);
	};
	environment.languages = u.getCookie(U_LANGUAGES) ? u.getCookie(U_LANGUAGES).split(',') : navigator.language ? navigator.language : 'zh-CN';
	if(environment.languages == 'zh-cn')
		environment.languages = 'zh-CN'
	if(environment.languages == 'en-us')
		environment.languages = 'en-US'

	environment.theme = u.getCookie(U_THEME);
	environment.locale = u.getCookie(U_LOCALE);
	//environment.timezoneOffset = (new Date()).getTimezoneOffset()
	environment.usercode = u.getCookie(U_USERCODE);
	//init session attribute
	document.cookie.replace(/ISES_(\w*)=([^;]*);?/ig, function(a, b, c) {
		sessionAttributes[b] = c;
	});


	var Core = function() {};
	Core.prototype = fn;

	u.core = new Core();

})();

u.extend(u, {
	isIE:  false,
	isFF: false,
	isOpera: false,
	isChrome: false,
	isSafari: false,
	isWebkit: false,
	isIE8_BEFORE: false,
	isIE8: false,
	isIE8_CORE: false,
	isIE9: false,
	isIE9_CORE: false,
	isIE10: false,
	isIE10_ABOVE: false,
	isIE11: false,
	isIOS: false,
	isIphone: false,
	isIPAD: false,
	isStandard: false,
	version: 0,
	isWin: false,
	isUnix: false,
	isLinux: false,
	isAndroid: false,
	isMac: false,
	hasTouch: false,
	isMobile: false
});

(function(){
	var userAgent = navigator.userAgent,
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
			rFirefox = /(firefox)\/([\w.]+)/,
			rOpera = /(opera).+version\/([\w.]+)/,
			rChrome = /(chrome)\/([\w.]+)/,
			rSafari = /version\/([\w.]+).*(safari)/,
			version,
			ua = userAgent.toLowerCase(),
			s,
			browserMatch = { browser : "", version : ''},
			match = rMsie.exec(ua);

	if (match != null) {
		browserMatch =  { browser : "IE", version : match[2] || "0" };
	}
	match = rFirefox.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[1] || "", version : match[2] || "0" };
	}
	match = rOpera.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[1] || "", version : match[2] || "0" };
	}
	match = rChrome.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[1] || "", version : match[2] || "0" };
	}
	match = rSafari.exec(ua);
	if (match != null) {
		browserMatch =  { browser : match[2] || "", version : match[1] || "0" };
	}
	if (match != null) {
		browserMatch =  { browser : "", version : "0" };
	}


	if (s=ua.match(/opera.([\d.]+)/)) {
		u.isOpera = true;
	}else if(browserMatch.browser=="IE"&&browserMatch.version==11){
		u.isIE11 = true;
		u.isIE = true;
	}else if (s=ua.match(/chrome\/([\d.]+)/)) {
		u.isChrome = true;
		u.isStandard = true;
	} else if (s=ua.match(/version\/([\d.]+).*safari/)) {
		u.isSafari = true;
		u.isStandard = true;
	} else if (s=ua.match(/gecko/)) {
		//add by licza : support XULRunner
		u.isFF = true;
		u.isStandard = true;
	} else if (s=ua.match(/msie ([\d.]+)/)) {
		u.isIE = true;
	}

	else if (s=ua.match(/firefox\/([\d.]+)/)) {
		u.isFF = true;
		u.isStandard = true;
	}
	if (ua.match(/webkit\/([\d.]+)/)) {
		u.isWebkit = true;
	}
	if (ua.match(/ipad/i)){
		u.isIOS = true;
		u.isIPAD = true;
		u.isStandard = true;
	}
	if (ua.match(/iphone/i)){
		u.isIOS = true;
		u.isIphone = true;
	}

	if((navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel")){
		//u.isIOS = true;
		u.isMac = true;
	}

	if((navigator.platform == "Win32") || (navigator.platform == "Windows") || (navigator.platform == "Win64")){
		u.isWin = true;
	}

	if((navigator.platform == "X11") && !u.isWin && !u.isMac){
		u.isUnix = true;
	}
	 if((String(navigator.platform).indexOf("Linux") > -1)){
    	u.isLinux = true;
    }
    
    if(ua.indexOf('Android') > -1 || ua.indexOf('android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('adr') > -1){
    	u.isAndroid = true;
    }

	u.version = version ? (browserMatch.version ?  browserMatch.version : 0) : 0;
	if (u.isIE) {
		var intVersion = parseInt(u.version);
		var mode = document.documentMode;
		if(mode == null){
			if (intVersion == 6 || intVersion == 7) {
				u.isIE8_BEFORE = true;
			}
		}
		else{
			if(mode == 7){
				u.isIE8_BEFORE = true;
			}
			else if (mode == 8) {
				u.isIE8 = true;
			}
			else if (mode == 9) {
				u.isIE9 = true;
				u.isSTANDARD = true;
			}
			else if (mode == 10) {
				u.isIE10 = true;
				u.isSTANDARD = true;
				u.isIE10_ABOVE = true;
			}
			else{
				u.isSTANDARD = true;
			}
			if (intVersion == 8) {
				u.isIE8_CORE = true;
			}
			else if (intVersion == 9) {
				u.isIE9_CORE = true;
			}
			else if(browserMatch.version==11){
				u.isIE11 = true;
			}
			else{

			}
		}
	}
	if("ontouchend" in document) {
		u.hasTouch = true;
	}
	if(u.isIOS || u.isAndroid)
		u.isMobile = true;
})();

if (u.isIE8_BEFORE){
	alert('uui 不支持IE8以前的浏览器版本，请更新IE浏览器或使用其它浏览器！')
	throw new Error('uui 不支持IE8以前的浏览器版本，请更新IE浏览器或使用其它浏览器！');
}
if (u.isIE8 && !u.polyfill){
	alert('IE8浏览器中使用uui 必须在u.js之前引入u-polyfill.js!');
	throw new Error('IE8浏览器中使用uui 必须在uui之前引入u-polyfill.js!');
}
//TODO 兼容 后面去掉
//u.Core = u.core;
window.iweb = {};
window.iweb.Core = u.core;
window.iweb.browser = {
	isIE: u.isIE,
	isFF: u.isFF,
	isOpera: u.isOpera,
	isChrome: u.isChrome,
	isSafari: u.isSafari,
	isWebkit: u.isWebkit,
	isIE8_BEFORE: u.isIE8_BEFORE,
	isIE8: u.isIE8,
	isIE8_CORE: u.isIE8_CORE,
	isIE9: u.isIE9,
	isIE9_CORE: u.isIE9_CORE,
	isIE10: u.isIE10,
	isIE10_ABOVE: u.isIE10_ABOVE,
	isIE11: u.isIE11,
	isIOS: u.isIOS,
	isIphone: u.isIphone,
	isIPAD: u.isIPAD,
	isStandard: u.isStandard,
	version: 0,
	isWin: u.isWin,
	isUnix: u.isUnix, 
	isLinux: u.isLinux,
	isAndroid: u.isAndroid,
	isMac: u.isMac,
	hasTouch: u.hasTouch
};

u.isDomElement = function(obj) {
    if (window['HTMLElement']) {
        return obj instanceof HTMLElement;
    } else {
        return obj && obj.tagName && obj.nodeType === 1;
    }
}
u.event = {};

var	touchStartEvent = u.hasTouch ? "touchstart" : "mousedown",
		touchStopEvent = u.hasTouch ? "touchend" : "mouseup",
		touchMoveEvent = u.hasTouch ? "touchmove" : "mousemove";

// tap和taphold
u.event.tap = {
	tapholdThreshold: 750,
	emitTapOnTaphold: true,
	touchstartFun:function(){
		u.trigger(this,'vmousedown');
	},
	touchendFun:function(){
		u.trigger(this,'vmouseup');
		u.trigger(this,'vclick');
	},
	setup: function() {
		var thisObject = this,
			isTaphold = false;
			
		u.on(thisObject, "vmousedown", function( event ) {
			isTaphold = false;
			if ( event.which && event.which !== 1 ) {
				return false;
			}

			var origTarget = event.target,
				timer;

			function clearTapTimer() {
				clearTimeout( timer );
			}

			function clearTapHandlers() {
				clearTapTimer();
				
				u.off(thisObject,'vclick');
				u.off(thisObject,'vmouseup');
				u.off(document,'vmousecancel');
			}

			function clickHandler( event ) {
				clearTapHandlers();

				// ONLY trigger a 'tap' event if the start target is
				// the same as the stop target.
				if ( !isTaphold && origTarget === event.target ) {
					u.trigger(thisObject,'tap');
				} else if ( isTaphold ) {
					event.preventDefault();
				}
			}
			u.on(thisObject, 'vmouseup',clearTapTimer);
			u.on(thisObject, 'vclick',clickHandler);
			u.on(document, 'vmousecancel',clearTapHandlers);

			timer = setTimeout( function() {
				if ( !u.event.tap.emitTapOnTaphold ) {
					isTaphold = true;
				}
				u.trigger(thisObject, "taphold");
				clearTapHandlers();
			}, u.event.tap.tapholdThreshold );
		});
		
		u.on(thisObject,'touchstart',u.event.tap.touchstartFun);
		u.on(thisObject,'touchend',u.event.tap.touchendFun);
	},
	teardown: function() {
		u.off(thisObject,'vmousedown');
		u.off(thisObject,'vclick');
		u.off(thisObject,'vmouseup');
		u.off(document,'vmousecancel');
	}
};

u.event.taphold = u.event.tap;

u.event.swipe = {

	// More than this horizontal displacement, and we will suppress scrolling.
	scrollSupressionThreshold: 30,

	// More time than this, and it isn't a swipe.
	durationThreshold: 1000,

	// Swipe horizontal displacement must be more than this.
	horizontalDistanceThreshold: 30,

	// Swipe vertical displacement must be less than this.
	verticalDistanceThreshold: 30,

	getLocation: function ( event ) {
		var winPageX = window.pageXOffset,
			winPageY = window.pageYOffset,
			x = event.clientX,
			y = event.clientY;

		if ( event.pageY === 0 && Math.floor( y ) > Math.floor( event.pageY ) ||
			event.pageX === 0 && Math.floor( x ) > Math.floor( event.pageX ) ) {

			// iOS4 clientX/clientY have the value that should have been
			// in pageX/pageY. While pageX/page/ have the value 0
			x = x - winPageX;
			y = y - winPageY;
		} else if ( y < ( event.pageY - winPageY) || x < ( event.pageX - winPageX ) ) {

			// Some Android browsers have totally bogus values for clientX/Y
			// when scrolling/zooming a page. Detectable since clientX/clientY
			// should never be smaller than pageX/pageY minus page scroll
			x = event.pageX - winPageX;
			y = event.pageY - winPageY;
		}

		return {
			x: x,
			y: y
		};
	},

	start: function( event ) {
		var data = event.touches ?
				event.touches[ 0 ] : event,
			location = u.event.swipe.getLocation( data );
		return {
					time: ( new Date() ).getTime(),
					coords: [ location.x, location.y ],
					origin: event.target 
				};
	},

	stop: function( event ) {
		var data =  event.touches ?
				event.touches[ 0 ] : event,
			location = u.event.swipe.getLocation( data );
		return {
					time: ( new Date() ).getTime(),
					coords: [ location.x, location.y ]
				};
	},

	handleSwipe: function( start, stop, thisObject, origTarget ) {
		if ( stop.time - start.time < u.event.swipe.durationThreshold &&
			Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > u.event.swipe.horizontalDistanceThreshold &&
			Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < u.event.swipe.verticalDistanceThreshold ) {
			var direction = start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight";

			u.trigger( thisObject, "swipe");
			u.trigger( thisObject, direction);
			return true;
		}
		return false;

	},

		// This serves as a flag to ensure that at most one swipe event event is
		// in work at any given time
	eventInProgress: false,

	setup: function() {
		var events,
			thisObject = this,
			context = {};

		// Retrieve the events data for this element and add the swipe context
		events = thisObject["mobile-events"];
		if ( !events ) {
			events = { length: 0 };
			thisObject["mobile-events"] = events;
		}
		events.length++;
		events.swipe = context;

		context.start = function( event ) {

			// Bail if we're already working on a swipe event
			if ( u.event.swipe.eventInProgress ) {
				return;
			}
			u.event.swipe.eventInProgress = true;

			var stop,
				start = u.event.swipe.start( event ),
				origTarget = event.target,
				emitted = false;

			context.move = function( event ) {
				// if ( !start || event.isDefaultPrevented() ) {
				if ( !start ) {	
					return;
				}

				stop = u.event.swipe.stop( event );
				if ( !emitted ) {
					emitted = u.event.swipe.handleSwipe( start, stop, thisObject, origTarget );
					if ( emitted ) {

						// Reset the context to make way for the next swipe event
						u.event.swipe.eventInProgress = false;
					}
				}
				// prevent scrolling
				if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > u.event.swipe.scrollSupressionThreshold ) {
					event.preventDefault();
				}
			};

			context.stop = function() {
					emitted = true;

					// Reset the context to make way for the next swipe event
					u.event.swipe.eventInProgress = false;
					u.off(document, touchMoveEvent, context.move);
					context.move = null;
			};

			u.on(document, touchMoveEvent, context.move);
			u.on(document, touchStopEvent, context.stop);
		};
		u.on(thisObject, touchStartEvent, context.start );
	},

	teardown: function() {
		var events, context;

		events = thisObject["mobile-events"];
		if ( events ) {
			context = events.swipe;
			delete events.swipe;
			events.length--;
			if ( events.length === 0 ) {
				thisObject["mobile-events"] = null;
			}
		}

		if ( context ) {
			if ( context.start ) {
				u.off(thisObject, touchStartEvent, context.start);
			}
			if ( context.move ) {
				u.off(document, touchMoveEvent, context.move);
			}
			if ( context.stop ) {
				u.off(document, touchStopEvent, context.stop);
			}
		}
	}
};


u.event.swipeleft = u.event.swipe;

u.event.swiperight = u.event.swipe;

NodeList.prototype.forEach = Array.prototype.forEach;


/**
 * 获得字符串的字节长度
 */
String.prototype.lengthb = function() {
    //	var str = this.replace(/[^\x800-\x10000]/g, "***");
    var str = this.replace(/[^\x00-\xff]/g, "**");
    return str.length;
};

/**
 * 将AFindText全部替换为ARepText
 */
String.prototype.replaceAll = function(AFindText, ARepText) {
    //自定义String对象的方法
    var raRegExp = new RegExp(AFindText, "g");
    return this.replace(raRegExp, ARepText);
};



var XmlHttp = {
  get : "get",
  post : "post",
  reqCount : 4,
  createXhr : function() {
    var xmlhttp = null;
    /*if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }*/
    if(u.isIE8){
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");//IE低版本创建XMLHTTP  
    }else if(u.isIE){
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");//IE高版本创建XMLHTTP
    }else if(window.XMLHttpRequest){
      xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
  },
  ajax : function(_json) {
    var url = _json["url"];
    var callback = _json["success"];
    var async = (_json["async"] == undefined ? true : _json["async"]);
    var error = _json["error"];
    var params = _json["data"] || {};
    var method = (_json["type"] == undefined ? XmlHttp.post : _json["type"]).toLowerCase();
    var gzipFlag = params.compressType;
    url = XmlHttp.serializeUrl(url);
    params = XmlHttp.serializeParams(params);
    if (method == XmlHttp.get && params != null) {
      url += ("&" + params);
      params = null;  //如果是get请求,保证最终会执行send(null)
    }

    var xmlhttp = XmlHttp.createXhr();
    //xmlhttp.open(method, url+ escape(new Date()), async);
    xmlhttp.open(method, url, async);

    if (method == XmlHttp.post) {
      xmlhttp.setRequestHeader("Content-type",
          "application/x-www-form-urlencoded;charset=UTF-8");
    }

    var execount = 0;
    // 异步
    if (async) {
      // readyState 从 1~4发生4次变化
      xmlhttp.onreadystatechange = function() {
        execount++;
        // 等待readyState状态不再变化之后,再执行回调函数
        //if (execount == XmlHttp.reqCount) {// 火狐下存在问题，修改判断方式
        if(xmlhttp.readyState == XmlHttp.reqCount){
          XmlHttp.execBack(xmlhttp, callback, error);
        }
      };
      // send方法要在在回调函数之后执行
      xmlhttp.send(params);
    } else {
      // 同步 readyState 直接变为 4
      // 并且 send 方法要在回调函数之前执行
      xmlhttp.send(params);
      XmlHttp.execBack(xmlhttp, callback, error);
    }
  },
  execBack : function(xmlhttp, callback, error) {
    //if (xmlhttp.readyState == 4
     if (xmlhttp.status == 200 || xmlhttp.status == 304 || xmlhttp.readyState == 4) {
      callback(xmlhttp.responseText,xmlhttp.status, xmlhttp);
    } else {
      if (error) {
        error(xmlhttp.responseText,xmlhttp.status, xmlhttp);
      } else {
        var errorMsg = "no error callback function!";
        if(xmlhttp.responseText) {
          errorMsg = xmlhttp.responseText;
        }
        alert(errorMsg);
        // throw errorMsg;
      }
    }
  },
  serializeUrl : function(url) {
    var cache = "cache=" + Math.random();
    if (url.indexOf("?") > 0) {
      url += ("&" + cache);
    } else {
      url += ("?" + cache);
    }
    return url;
  },
  serializeParams : function(params) {
    var ud = undefined;
    if (ud == params || params == null || params == "") {
      return null;
    }
    if (params.constructor == Object) {
      var result = "";
      for ( var p in params) {
        result += (p + "=" + encodeURIComponent(params[p]) + "&");
      }
      return result.substring(0, result.length - 1);
    }
    return params;
  }
};

//if ($ && $.ajax)
//  u.ajax = $.ajax;
//else
  u.ajax = XmlHttp.ajax;



var Class = function (o) {
    if (!(this instanceof Class) && isFunction(o)) {
        return classify(o)
    }
}

// Create a new Class.
//
//  var SuperPig = Class.create({
//    Extends: Animal,
//    Implements: Flyable,
//    initialize: function() {
//      SuperPig.superclass.initialize.apply(this, arguments)
//    },
//    Statics: {
//      COLOR: 'red'
//    }
// })
//
Class.create = function (parent, properties) {
    if (!isFunction(parent)) {
        properties = parent
        parent = null
    }

    properties || (properties = {})
    parent || (parent = properties.Extends || Class)
    properties.Extends = parent

    // The created class constructor
    function SubClass() {
        var ret;
        // Call the parent constructor.
        parent.apply(this, arguments)

        // Only call initialize in self constructor.
        if (this.constructor === SubClass && this.initialize) {
            ret = this.initialize.apply(this, arguments)
        }
        return ret ? ret : this;
    }

    // Inherit class (static) properties from parent.
    if (parent !== Class) {
        mix(SubClass, parent, parent.StaticsWhiteList)
    }

    // Add instance properties to the subclass.
    implement.call(SubClass, properties)

    // Make subclass extendable.
    return classify(SubClass)
}

function implement(properties) {
    var key, value

    for (key in properties) {
        value = properties[key]

        if (Class.Mutators.hasOwnProperty(key)) {
            Class.Mutators[key].call(this, value)
        } else {
            this.prototype[key] = value
        }
    }
}


// Create a sub Class based on `Class`.
Class.extend = function (properties) {
    properties || (properties = {})
    properties.Extends = this

    return Class.create(properties)
}


function classify(cls) {
    cls.extend = Class.extend
    cls.implement = implement
    return cls
}


// Mutators define special properties.
Class.Mutators = {

    'Extends': function (parent) {
        var existed = this.prototype
        var proto = createProto(parent.prototype)

        // Keep existed properties.
        mix(proto, existed)

        // Enforce the constructor to be what we expect.
        proto.constructor = this

        // Set the prototype chain to inherit from `parent`.
        this.prototype = proto

        // Set a convenience property in case the parent's prototype is
        // needed later.
        this.superclass = parent.prototype
    },

    'Implements': function (items) {
        isArray(items) || (items = [items])
        var proto = this.prototype,
            item

        while (item = items.shift()) {
            mix(proto, item.prototype || item)
        }
    },

    'Statics': function (staticProperties) {
        mix(this, staticProperties)
    }
}


// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {
}

// See: http://jsperf.com/object-create-vs-new-ctor
var createProto = Object.__proto__ ?
    function (proto) {
        return {
            __proto__: proto
        }
    } :
    function (proto) {
        Ctor.prototype = proto
        return new Ctor()
    }


// Helpers
// ------------

function mix(r, s, wl) {
    // Copy "all" properties including inherited ones.
    for (var p in s) {
        if (s.hasOwnProperty(p)) {
            if (wl && indexOf(wl, p) === -1) continue

            // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
            if (p !== 'prototype') {
                r[p] = s[p]
            }
        }
    }
}


var toString = Object.prototype.toString

var isArray = Array.isArray || function (val) {
        return toString.call(val) === '[object Array]'
    }

var isFunction = function (val) {
    return toString.call(val) === '[object Function]'
}

var indexOf = function(arr, item){
    if (Array.prototype.indexOf && arr.indexOf){
        return arr.indexOf(item);
    }else{
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i
            }
        }
        return -1
    }
}

u.Class = Class



function _findRegisteredClass(name, optReplace) {
    for (var i = 0; i < CompMgr.registeredControls.length; i++) {
        if (CompMgr.registeredControls[i].className === name) {
            if (typeof optReplace !== 'undefined') {
                CompMgr.registeredControls[i] = optReplace;
            }
            return CompMgr.registeredControls[i];
        }
    }
    return false;
}

function _getUpgradedListOfElement(element) {
    var dataUpgraded = element.getAttribute('data-upgraded');
    // Use `['']` as default value to conform the `,name,name...` style.
    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
}

function _isElementUpgraded(element, jsClass) {
    var upgradedList = _getUpgradedListOfElement(element);
    return upgradedList.indexOf(jsClass) != -1;
}

function _upgradeElement(element, optJsClass) {
    if (!(typeof element === 'object' && element instanceof Element)) {
        throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    var upgradedList = _getUpgradedListOfElement(element);
    var classesToUpgrade = [];
    if (!optJsClass) {
        var className = element.className;
        for(var i=0; i< CompMgr.registeredControls.length; i++){
            var component = CompMgr.registeredControls[i]
            if (className.indexOf(component.cssClass) > -1 && classesToUpgrade.indexOf(component) === -1 &&
                !_isElementUpgraded(element, component.className)) {
                classesToUpgrade.push(component);
            }
        }
    } else if (!_isElementUpgraded(element, optJsClass)) {
        classesToUpgrade.push(_findRegisteredClass(optJsClass));
    }

    // Upgrade the element for each classes.
    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
        registeredClass = classesToUpgrade[i];
        if (registeredClass) {
            if (element[registeredClass.className]){
                continue;
            }
            // Mark element as upgraded.
            upgradedList.push(registeredClass.className);
            element.setAttribute('data-upgraded', upgradedList.join(','));
            var instance = new registeredClass.classConstructor(element);
            CompMgr.createdControls.push(instance);
            // Call any callbacks the user has registered with this component type.
            for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
                registeredClass.callbacks[j](element);
            }
            element[registeredClass.className] = instance;
        } else {
            throw new Error('Unable to find a registered component for the given class.');
        }

    }
}

function _upgradeDomInternal(optJsClass, optCssClass, ele) {
    if (typeof optJsClass === 'undefined' && typeof optCssClass === 'undefined') {
        for (var i = 0; i < CompMgr.registeredControls.length; i++) {
            _upgradeDomInternal(CompMgr.registeredControls[i].className, registeredControls[i].cssClass, ele);
        }
    } else {
        var jsClass = (optJsClass);
        if (!optCssClass) {
            var registeredClass = _findRegisteredClass(jsClass);
            if (registeredClass) {
                optCssClass = registeredClass.cssClass;
            }
        }
        var elements;
        if(ele) {
            elements = u.hasClass(ele, optCssClass) ? [ele] : ele.querySelectorAll('.' + optCssClass);
        } else {
           elements = document.querySelectorAll('.' + optCssClass);
        }
        for (var n = 0; n < elements.length; n++) {
            _upgradeElement(elements[n], jsClass);
        }
    }
}

var CompMgr = {
    plugs: {},
    dataAdapters:{},
    /** 注册的控件*/
    registeredControls: [],
    createdControls: [],
    /**
     *
     * @param options  {el:'#content', model:{}}
     */
    apply: function (options) {
		if(options){
        var _el = options.el||document.body;
        var model = options.model;
		}
        if (typeof _el == 'string'){
            _el = document.body.querySelector(_el);
        }
        if (_el == null || typeof _el != 'object')
            _el = document.body;
        var comps =_el.querySelectorAll('[u-meta]');
        comps.forEach(function(element){
            if (element['comp']) return;
            var options = JSON.parse(element.getAttribute('u-meta'));
            if (options && options['type']) {
                //var comp = CompMgr._createComp({el:element,options:options,model:model});
                var comp = CompMgr.createDataAdapter({el:element,options:options,model:model});
                if (comp){
                    element['adpt'] = comp;
                    element['u-meta'] = comp;
                }
            }
        });
    },
    addPlug: function (config) {
        var plug = config['plug'],
            name = config['name'];
        this.plugs || (this.plugs = {});
        if (this.plugs[name]) {
            throw new Error('plug has exist:' + name);
        }
        plug.compType = name;
        this.plugs[name] = plug
    },
    addDataAdapter: function(config){
        var adapter = config['adapter'],
            name = config['name'];
            //dataType = config['dataType'] || ''
        //var key = dataType ? name + '.' + dataType : name;
        this.dataAdapters || (dataAdapters = {});
        if(this.dataAdapters[name]){
            throw new Error('dataAdapter has exist:' + name);
        }
        this.dataAdapters[name] = adapter;

    },
    getDataAdapter: function(name){
        if (!name) return;
        this.dataAdapters || (dataAdapters = {});
        //var key = dataType ? name + '.' + dataType : name;
        return this.dataAdapters[name];
    },
    createDataAdapter: function(options){
        var opt = options['options'];
        var type = opt['type'],
            id = opt['id'];
        var adpt = this.dataAdapters[type];
        if (!adpt) return null;
        var comp = new adpt(options);
        comp.type = type;
        comp.id = id;
        return comp;
    },
    _createComp: function (options) {
        var opt = options['options'];
        var type = opt['type'];
        var plug = this.plugs[type];
        if (!plug) return null;
        var comp = new plug(options);
        comp.type = type;
        return comp;
    },
    /**
     * 注册UI控件
     */
    regComp: function(config){
        var newConfig = {
            classConstructor: config.comp,
            className: config.compAsString || config['compAsString'],
            cssClass: config.css || config['css'],
            callbacks: []
        };
        config.comp.prototype.compType = config.compAsString;
        for(var i=0; i< this.registeredControls.length; i++){
            var item = this.registeredControls[i];
            //registeredControls.forEach(function(item) {
            if (item.cssClass === newConfig.cssClass) {
                throw new Error('The provided cssClass has already been registered: ' + item.cssClass);
            }
            if (item.className === newConfig.className) {
                throw new Error('The provided className has already been registered');
            }
        };
        this.registeredControls.push(newConfig);
    },
    updateComp: function(ele){
        for (var n = 0; n < this.registeredControls.length; n++) {
            _upgradeDomInternal(this.registeredControls[n].className,null ,ele);
        }
    }
};

u.compMgr = CompMgr;

///**
// * 加载控件
// */
//
//if (document.readyState && document.readyState === 'complete'){
//    u.compMgr.updateComp();
//}else{
//    u.on(window, 'load', function() {
//
//        //扫描并生成控件
//        u.compMgr.updateComp();
//    });
//}

//
//if (window.i18n) {
//    var scriptPath = getCurrentJsPath(),
//        _temp = scriptPath.substr(0, scriptPath.lastIndexOf('/')),
//        __FOLDER__ = _temp.substr(0, _temp.lastIndexOf('/'))
//    u.uuii18n = u.extend({}, window.i18n)
//    u.uuii18n.init({
//        postAsync: false,
//        getAsync: false,
//        fallbackLng: false,
//        ns: {namespaces: ['uui-trans']},
//        resGetPath: __FOLDER__ + '/locales/__lng__/__ns__.json'
//    })
//}

window.trans = u.trans = function (key, dftValue) {
    return  u.uuii18n ?  u.uuii18n.t('uui-trans:' + key) : dftValue
}


/* ========================================================================
 * UUI: rsautils.js v 1.0.0
 *
 * ========================================================================
 * Copyright 2015 yonyou, Inc.
 * Licensed under MIT ()
 * ======================================================================== */

/*
 * u.RSAUtils.encryptedString({exponent: 'xxxxx', modulus: 'xxxxx', text: 'xxxxx'})
 * u.RSAUtils.decryptedString({exponent: 'xxxxx', modulus: 'xxxxx', text: 'xxxxx'})
 */

if (typeof u.RSAUtils === 'undefined')
    u.RSAUtils = {};
var RSAUtils = u.RSAUtils;
var biRadixBase = 2;
var biRadixBits = 16;
var bitsPerDigit = biRadixBits;
var biRadix = 1 << 16; // = 2^16 = 65536
var biHalfRadix = biRadix >>> 1;
var biRadixSquared = biRadix * biRadix;
var maxDigitVal = biRadix - 1;
var maxInteger = 9999999999999998;

//maxDigits:
//Change this to accommodate your largest number size. Use setMaxDigits()
//to change it!
//
//In general, if you're working with numbers of size N bits, you'll need 2*N
//bits of storage. Each digit holds 16 bits. So, a 1024-bit key will need
//
//1024 * 2 / 16 = 128 digits of storage.
//
var maxDigits;
var ZERO_ARRAY;
var bigZero, bigOne;

var BigInt = u.BigInt = function (flag) {
    if (typeof flag == "boolean" && flag == true) {
        this.digits = null;
    } else {
        this.digits = ZERO_ARRAY.slice(0);
    }
    this.isNeg = false;
};

RSAUtils.setMaxDigits = function (value) {
    maxDigits = value;
    ZERO_ARRAY = new Array(maxDigits);
    for (var iza = 0; iza < ZERO_ARRAY.length; iza++) ZERO_ARRAY[iza] = 0;
    bigZero = new BigInt();
    bigOne = new BigInt();
    bigOne.digits[0] = 1;
};
RSAUtils.setMaxDigits(20);

//The maximum number of digits in base 10 you can convert to an
//integer without JavaScript throwing up on you.
var dpl10 = 15;

RSAUtils.biFromNumber = function (i) {
    var result = new BigInt();
    result.isNeg = i < 0;
    i = Math.abs(i);
    var j = 0;
    while (i > 0) {
        result.digits[j++] = i & maxDigitVal;
        i = Math.floor(i / biRadix);
    }
    return result;
};

//lr10 = 10 ^ dpl10
var lr10 = RSAUtils.biFromNumber(1000000000000000);

RSAUtils.biFromDecimal = function (s) {
    var isNeg = s.charAt(0) == '-';
    var i = isNeg ? 1 : 0;
    var result;
    // Skip leading zeros.
    while (i < s.length && s.charAt(i) == '0') ++i;
    if (i == s.length) {
        result = new BigInt();
    }
    else {
        var digitCount = s.length - i;
        var fgl = digitCount % dpl10;
        if (fgl == 0) fgl = dpl10;
        result = RSAUtils.biFromNumber(Number(s.substr(i, fgl)));
        i += fgl;
        while (i < s.length) {
            result = RSAUtils.biAdd(RSAUtils.biMultiply(result, lr10),
                RSAUtils.biFromNumber(Number(s.substr(i, dpl10))));
            i += dpl10;
        }
        result.isNeg = isNeg;
    }
    return result;
};

RSAUtils.biCopy = function (bi) {
    var result = new BigInt(true);
    result.digits = bi.digits.slice(0);
    result.isNeg = bi.isNeg;
    return result;
};

RSAUtils.reverseStr = function (s) {
    var result = "";
    for (var i = s.length - 1; i > -1; --i) {
        result += s.charAt(i);
    }
    return result;
};

var hexatrigesimalToChar = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
];

RSAUtils.biToString = function (x, radix) { // 2 <= radix <= 36
    var b = new BigInt();
    b.digits[0] = radix;
    var qr = RSAUtils.biDivideModulo(x, b);
    var result = hexatrigesimalToChar[qr[1].digits[0]];
    while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
        qr = RSAUtils.biDivideModulo(qr[0], b);
        digit = qr[1].digits[0];
        result += hexatrigesimalToChar[qr[1].digits[0]];
    }
    return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(result);
};

RSAUtils.biToDecimal = function (x) {
    var b = new BigInt();
    b.digits[0] = 10;
    var qr = RSAUtils.biDivideModulo(x, b);
    var result = String(qr[1].digits[0]);
    while (RSAUtils.biCompare(qr[0], bigZero) == 1) {
        qr = RSAUtils.biDivideModulo(qr[0], b);
        result += String(qr[1].digits[0]);
    }
    return (x.isNeg ? "-" : "") + RSAUtils.reverseStr(result);
};

var hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f'];

RSAUtils.digitToHex = function (n) {
    var mask = 0xf;
    var result = "";
    for (var i = 0; i < 4; ++i) {
        result += hexToChar[n & mask];
        n >>>= 4;
    }
    return RSAUtils.reverseStr(result);
};

RSAUtils.biToHex = function (x) {
    var result = "";
    var n = RSAUtils.biHighIndex(x);
    for (var i = RSAUtils.biHighIndex(x); i > -1; --i) {
        result += RSAUtils.digitToHex(x.digits[i]);
    }
    return result;
};

RSAUtils.charToHex = function (c) {
    var ZERO = 48;
    var NINE = ZERO + 9;
    var littleA = 97;
    var littleZ = littleA + 25;
    var bigA = 65;
    var bigZ = 65 + 25;
    var result;

    if (c >= ZERO && c <= NINE) {
        result = c - ZERO;
    } else if (c >= bigA && c <= bigZ) {
        result = 10 + c - bigA;
    } else if (c >= littleA && c <= littleZ) {
        result = 10 + c - littleA;
    } else {
        result = 0;
    }
    return result;
};

RSAUtils.hexToDigit = function (s) {
    var result = 0;
    var sl = Math.min(s.length, 4);
    for (var i = 0; i < sl; ++i) {
        result <<= 4;
        result |= RSAUtils.charToHex(s.charCodeAt(i));
    }
    return result;
};

RSAUtils.biFromHex = function (s) {
    var result = new BigInt();
    var sl = s.length;
    for (var i = sl, j = 0; i > 0; i -= 4, ++j) {
        result.digits[j] = RSAUtils.hexToDigit(s.substr(Math.max(i - 4, 0), Math.min(i, 4)));
    }
    return result;
};

RSAUtils.biFromString = function (s, radix) {
    var isNeg = s.charAt(0) == '-';
    var istop = isNeg ? 1 : 0;
    var result = new BigInt();
    var place = new BigInt();
    place.digits[0] = 1; // radix^0
    for (var i = s.length - 1; i >= istop; i--) {
        var c = s.charCodeAt(i);
        var digit = RSAUtils.charToHex(c);
        var biDigit = RSAUtils.biMultiplyDigit(place, digit);
        result = RSAUtils.biAdd(result, biDigit);
        place = RSAUtils.biMultiplyDigit(place, radix);
    }
    result.isNeg = isNeg;
    return result;
};

RSAUtils.biDump = function (b) {
    return (b.isNeg ? "-" : "") + b.digits.join(" ");
};

RSAUtils.biAdd = function (x, y) {
    var result;

    if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = RSAUtils.biSubtract(x, y);
        y.isNeg = !y.isNeg;
    }
    else {
        result = new BigInt();
        var c = 0;
        var n;
        for (var i = 0; i < x.digits.length; ++i) {
            n = x.digits[i] + y.digits[i] + c;
            result.digits[i] = n % biRadix;
            c = Number(n >= biRadix);
        }
        result.isNeg = x.isNeg;
    }
    return result;
};

RSAUtils.biSubtract = function (x, y) {
    var result;
    if (x.isNeg != y.isNeg) {
        y.isNeg = !y.isNeg;
        result = RSAUtils.biAdd(x, y);
        y.isNeg = !y.isNeg;
    } else {
        result = new BigInt();
        var n, c;
        c = 0;
        for (var i = 0; i < x.digits.length; ++i) {
            n = x.digits[i] - y.digits[i] + c;
            result.digits[i] = n % biRadix;
            // Stupid non-conforming modulus operation.
            if (result.digits[i] < 0) result.digits[i] += biRadix;
            c = 0 - Number(n < 0);
        }
        // Fix up the negative sign, if any.
        if (c == -1) {
            c = 0;
            for (var i = 0; i < x.digits.length; ++i) {
                n = 0 - result.digits[i] + c;
                result.digits[i] = n % biRadix;
                // Stupid non-conforming modulus operation.
                if (result.digits[i] < 0) result.digits[i] += biRadix;
                c = 0 - Number(n < 0);
            }
            // Result is opposite sign of arguments.
            result.isNeg = !x.isNeg;
        } else {
            // Result is same sign.
            result.isNeg = x.isNeg;
        }
    }
    return result;
};

RSAUtils.biHighIndex = function (x) {
    var result = x.digits.length - 1;
    while (result > 0 && x.digits[result] == 0) --result;
    return result;
};

RSAUtils.biNumBits = function (x) {
    var n = RSAUtils.biHighIndex(x);
    var d = x.digits[n];
    var m = (n + 1) * bitsPerDigit;
    var result;
    for (result = m; result > m - bitsPerDigit; --result) {
        if ((d & 0x8000) != 0) break;
        d <<= 1;
    }
    return result;
};

RSAUtils.biMultiply = function (x, y) {
    var result = new BigInt();
    var c;
    var n = RSAUtils.biHighIndex(x);
    var t = RSAUtils.biHighIndex(y);
    var u, uv, k;

    for (var i = 0; i <= t; ++i) {
        c = 0;
        k = i;
        for (var j = 0; j <= n; ++j, ++k) {
            uv = result.digits[k] + x.digits[j] * y.digits[i] + c;
            result.digits[k] = uv & maxDigitVal;
            c = uv >>> biRadixBits;
            //c = Math.floor(uv / biRadix);
        }
        result.digits[i + n + 1] = c;
    }
    // Someone give me a logical xor, please.
    result.isNeg = x.isNeg != y.isNeg;
    return result;
};

RSAUtils.biMultiplyDigit = function (x, y) {
    var n, c, uv;

    var result = new BigInt();
    n = RSAUtils.biHighIndex(x);
    c = 0;
    for (var j = 0; j <= n; ++j) {
        uv = result.digits[j] + x.digits[j] * y + c;
        result.digits[j] = uv & maxDigitVal;
        c = uv >>> biRadixBits;
        //c = Math.floor(uv / biRadix);
    }
    result.digits[1 + n] = c;
    return result;
};

RSAUtils.arrayCopy = function (src, srcStart, dest, destStart, n) {
    var m = Math.min(srcStart + n, src.length);
    for (var i = srcStart, j = destStart; i < m; ++i, ++j) {
        dest[j] = src[i];
    }
};

var highBitMasks = [0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800,
    0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0,
    0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF];

RSAUtils.biShiftLeft = function (x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, result.digits, digitCount,
        result.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var rightBits = bitsPerDigit - bits;
    for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
        result.digits[i] = ((result.digits[i] << bits) & maxDigitVal) |
            ((result.digits[i1] & highBitMasks[bits]) >>>
            (rightBits));
    }
    result.digits[0] = ((result.digits[i] << bits) & maxDigitVal);
    result.isNeg = x.isNeg;
    return result;
};

var lowBitMasks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
    0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
    0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];

RSAUtils.biShiftRight = function (x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, digitCount, result.digits, 0,
        x.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var leftBits = bitsPerDigit - bits;
    for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
        result.digits[i] = (result.digits[i] >>> bits) |
            ((result.digits[i1] & lowBitMasks[bits]) << leftBits);
    }
    result.digits[result.digits.length - 1] >>>= bits;
    result.isNeg = x.isNeg;
    return result;
};

RSAUtils.biMultiplyByRadixPower = function (x, n) {
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, result.digits, n, result.digits.length - n);
    return result;
};

RSAUtils.biDivideByRadixPower = function (x, n) {
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, n, result.digits, 0, result.digits.length - n);
    return result;
};

RSAUtils.biModuloByRadixPower = function (x, n) {
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, result.digits, 0, n);
    return result;
};

RSAUtils.biCompare = function (x, y) {
    if (x.isNeg != y.isNeg) {
        return 1 - 2 * Number(x.isNeg);
    }
    for (var i = x.digits.length - 1; i >= 0; --i) {
        if (x.digits[i] != y.digits[i]) {
            if (x.isNeg) {
                return 1 - 2 * Number(x.digits[i] > y.digits[i]);
            } else {
                return 1 - 2 * Number(x.digits[i] < y.digits[i]);
            }
        }
    }
    return 0;
};

RSAUtils.biDivideModulo = function (x, y) {
    var nb = RSAUtils.biNumBits(x);
    var tb = RSAUtils.biNumBits(y);
    var origYIsNeg = y.isNeg;
    var q, r;
    if (nb < tb) {
        // |x| < |y|
        if (x.isNeg) {
            q = RSAUtils.biCopy(bigOne);
            q.isNeg = !y.isNeg;
            x.isNeg = false;
            y.isNeg = false;
            r = biSubtract(y, x);
            // Restore signs, 'cause they're references.
            x.isNeg = true;
            y.isNeg = origYIsNeg;
        } else {
            q = new BigInt();
            r = RSAUtils.biCopy(x);
        }
        return [q, r];
    }

    q = new BigInt();
    r = x;

    // Normalize Y.
    var t = Math.ceil(tb / bitsPerDigit) - 1;
    var lambda = 0;
    while (y.digits[t] < biHalfRadix) {
        y = RSAUtils.biShiftLeft(y, 1);
        ++lambda;
        ++tb;
        t = Math.ceil(tb / bitsPerDigit) - 1;
    }
    // Shift r over to keep the quotient constant. We'll shift the
    // remainder back at the end.
    r = RSAUtils.biShiftLeft(r, lambda);
    nb += lambda; // Update the bit count for x.
    var n = Math.ceil(nb / bitsPerDigit) - 1;

    var b = RSAUtils.biMultiplyByRadixPower(y, n - t);
    while (RSAUtils.biCompare(r, b) != -1) {
        ++q.digits[n - t];
        r = RSAUtils.biSubtract(r, b);
    }
    for (var i = n; i > t; --i) {
        var ri = (i >= r.digits.length) ? 0 : r.digits[i];
        var ri1 = (i - 1 >= r.digits.length) ? 0 : r.digits[i - 1];
        var ri2 = (i - 2 >= r.digits.length) ? 0 : r.digits[i - 2];
        var yt = (t >= y.digits.length) ? 0 : y.digits[t];
        var yt1 = (t - 1 >= y.digits.length) ? 0 : y.digits[t - 1];
        if (ri == yt) {
            q.digits[i - t - 1] = maxDigitVal;
        } else {
            q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
        }

        var c1 = q.digits[i - t - 1] * ((yt * biRadix) + yt1);
        var c2 = (ri * biRadixSquared) + ((ri1 * biRadix) + ri2);
        while (c1 > c2) {
            --q.digits[i - t - 1];
            c1 = q.digits[i - t - 1] * ((yt * biRadix) | yt1);
            c2 = (ri * biRadix * biRadix) + ((ri1 * biRadix) + ri2);
        }

        b = RSAUtils.biMultiplyByRadixPower(y, i - t - 1);
        r = RSAUtils.biSubtract(r, RSAUtils.biMultiplyDigit(b, q.digits[i - t - 1]));
        if (r.isNeg) {
            r = RSAUtils.biAdd(r, b);
            --q.digits[i - t - 1];
        }
    }
    r = RSAUtils.biShiftRight(r, lambda);
    // Fiddle with the signs and stuff to make sure that 0 <= r < y.
    q.isNeg = x.isNeg != origYIsNeg;
    if (x.isNeg) {
        if (origYIsNeg) {
            q = RSAUtils.biAdd(q, bigOne);
        } else {
            q = RSAUtils.biSubtract(q, bigOne);
        }
        y = RSAUtils.biShiftRight(y, lambda);
        r = RSAUtils.biSubtract(y, r);
    }
    // Check for the unbelievably stupid degenerate case of r == -0.
    if (r.digits[0] == 0 && RSAUtils.biHighIndex(r) == 0) r.isNeg = false;

    return [q, r];
};

RSAUtils.biDivide = function (x, y) {
    return RSAUtils.biDivideModulo(x, y)[0];
};

RSAUtils.biModulo = function (x, y) {
    return RSAUtils.biDivideModulo(x, y)[1];
};

RSAUtils.biMultiplyMod = function (x, y, m) {
    return RSAUtils.biModulo(RSAUtils.biMultiply(x, y), m);
};

RSAUtils.biPow = function (x, y) {
    var result = bigOne;
    var a = x;
    while (true) {
        if ((y & 1) != 0) result = RSAUtils.biMultiply(result, a);
        y >>= 1;
        if (y == 0) break;
        a = RSAUtils.biMultiply(a, a);
    }
    return result;
};

RSAUtils.biPowMod = function (x, y, m) {
    var result = bigOne;
    var a = x;
    var k = y;
    while (true) {
        if ((k.digits[0] & 1) != 0) result = RSAUtils.biMultiplyMod(result, a, m);
        k = RSAUtils.biShiftRight(k, 1);
        if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
        a = RSAUtils.biMultiplyMod(a, a, m);
    }
    return result;
};


u.BarrettMu = function (m) {
    this.modulus = RSAUtils.biCopy(m);
    this.k = RSAUtils.biHighIndex(this.modulus) + 1;
    var b2k = new BigInt();
    b2k.digits[2 * this.k] = 1; // b2k = b^(2k)
    this.mu = RSAUtils.biDivide(b2k, this.modulus);
    this.bkplus1 = new BigInt();
    this.bkplus1.digits[this.k + 1] = 1; // bkplus1 = b^(k+1)
    this.modulo = BarrettMu_modulo;
    this.multiplyMod = BarrettMu_multiplyMod;
    this.powMod = BarrettMu_powMod;
};

function BarrettMu_modulo(x) {
    var $dmath = RSAUtils;
    var q1 = $dmath.biDivideByRadixPower(x, this.k - 1);
    var q2 = $dmath.biMultiply(q1, this.mu);
    var q3 = $dmath.biDivideByRadixPower(q2, this.k + 1);
    var r1 = $dmath.biModuloByRadixPower(x, this.k + 1);
    var r2term = $dmath.biMultiply(q3, this.modulus);
    var r2 = $dmath.biModuloByRadixPower(r2term, this.k + 1);
    var r = $dmath.biSubtract(r1, r2);
    if (r.isNeg) {
        r = $dmath.biAdd(r, this.bkplus1);
    }
    var rgtem = $dmath.biCompare(r, this.modulus) >= 0;
    while (rgtem) {
        r = $dmath.biSubtract(r, this.modulus);
        rgtem = $dmath.biCompare(r, this.modulus) >= 0;
    }
    return r;
}

function BarrettMu_multiplyMod(x, y) {
    /*
     x = this.modulo(x);
     y = this.modulo(y);
     */
    var xy = RSAUtils.biMultiply(x, y);
    return this.modulo(xy);
}

function BarrettMu_powMod(x, y) {
    var result = new BigInt();
    result.digits[0] = 1;
    var a = x;
    var k = y;
    while (true) {
        if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
        k = RSAUtils.biShiftRight(k, 1);
        if (k.digits[0] == 0 && RSAUtils.biHighIndex(k) == 0) break;
        a = this.multiplyMod(a, a);
    }
    return result;
}

var RSAKeyPair = function (encryptionExponent, decryptionExponent, modulus) {
    var $dmath = RSAUtils;
    this.e = $dmath.biFromHex(encryptionExponent);
    this.d = $dmath.biFromHex(decryptionExponent);
    this.m = $dmath.biFromHex(modulus);
    // We can do two bytes per digit, so
    // chunkSize = 2 * (number of digits in modulus - 1).
    // Since biHighIndex returns the high index, not the number of digits, 1 has
    // already been subtracted.
    this.chunkSize = 2 * $dmath.biHighIndex(this.m);
    this.radix = 16;
    this.barrett = new u.BarrettMu(this.m);
};

RSAUtils.getKeyPair = function (encryptionExponent, decryptionExponent, modulus) {
    return new RSAKeyPair(encryptionExponent, decryptionExponent, modulus);
};

if (typeof u.twoDigit === 'undefined') {
    u.twoDigit = function (n) {
        return (n < 10 ? "0" : "") + String(n);
    };
}

// Altered by Rob Saunders (rob@robsaunders.net). New routine pads the
// string after it has been converted to an array. This fixes an
// incompatibility with Flash MX's ActionScript.
RSAUtils._encryptedString = function (key, s) {
    var a = [];
    var sl = s.length;
    var i = 0;
    while (i < sl) {
        a[i] = s.charCodeAt(i);
        i++;
    }

    while (a.length % key.chunkSize != 0) {
        a[i++] = 0;
    }

    var al = a.length;
    var result = "";
    var j, k, block;
    for (i = 0; i < al; i += key.chunkSize) {
        block = new BigInt();
        j = 0;
        for (k = i; k < i + key.chunkSize; ++j, k++) {
            block.digits[j] = a[k];
            block.digits[j] += a[k] << 8;
        }
        var crypt = key.barrett.powMod(block, key.e);
        var text = key.radix == 16 ? RSAUtils.biToHex(crypt) : RSAUtils.biToString(crypt, key.radix);
        result += text + " ";
    }
    return result.substring(0, result.length - 1); // Remove last space.
};

RSAUtils._decryptedString = function (key, s) {
    var blocks = s.split(" ");
    var result = "";
    var i, j, block;
    for (i = 0; i < blocks.length; ++i) {
        var bi;
        if (key.radix == 16) {
            bi = RSAUtils.biFromHex(blocks[i]);
        }
        else {
            bi = RSAUtils.biFromString(blocks[i], key.radix);
        }
        block = key.barrett.powMod(bi, key.d);
        for (j = 0; j <= RSAUtils.biHighIndex(block); ++j) {
            result += String.fromCharCode(block.digits[j] & 255,
                block.digits[j] >> 8);
        }
    }
    // Remove trailing null, if any.
    if (result.charCodeAt(result.length - 1) == 0) {
        result = result.substring(0, result.length - 1);
    }
    return result;
};

RSAUtils.setMaxDigits(130);

RSAUtils.encryptedString = function (options) {
    var text = options.text;
    if (options.exponent && options.modulus) {
        var key = RSAUtils.getKeyPair(options.exponent, '', options.modulus);
        text = RSAUtils._encryptedString(key, options.text);
    }
    return text;
};

RSAUtils.decryptedString = function (options) {
    var text = options.text;
    if (options.exponent && options.modulus) {
        var key = RSAUtils.getKeyPair('', options.exponent, options.modulus);
        text = RSAUtils._decryptedString(key, options.text);
    }
    return text;
};
	

/**
 * 抽象格式化类
 */
function AbstractMasker() {};

AbstractMasker.prototype.format = function(obj) {
	if (obj == null)
		return null;

	var fObj = this.formatArgument(obj);
	return this.innerFormat(fObj);
};

/**
 * 统一被格式化对象结构
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.formatArgument = function(obj) {

};

/**
 * 格式化
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.innerFormat = function(obj) {

};

/**
 * 拆分算法格式化虚基类
 */
AbstractSplitMasker.prototype = new AbstractMasker;

function AbstractSplitMasker() {};
AbstractSplitMasker.prototype.elements = new Array;
AbstractSplitMasker.prototype.format = function(obj) {
	if (obj == null)
		return null;

	var fObj = this.formatArgument(obj);
	return this.innerFormat(fObj);
};

/**
 * 统一被格式化对象结构
 *
 * @param obj
 * @return
 */
AbstractSplitMasker.prototype.formatArgument = function(obj) {
	return obj;
};

/**
 * 格式化
 *
 * @param obj
 * @return
 */
AbstractSplitMasker.prototype.innerFormat = function(obj) {
	if (obj == null || obj == "")
		return new FormatResult(obj);
	this.doSplit();
	var result = "";
	//dingrf 去掉concat合并数组的方式，换用多维数组来实现 提高效率
	result = this.getElementsValue(this.elements, obj);

	return new FormatResult(result);
};

/**
 * 合并多维数组中的elementValue
 * @param {} element
 * @param {} obj
 * @return {}
 */
AbstractSplitMasker.prototype.getElementsValue = function(element, obj) {
	var result = "";
	if (element instanceof Array) {
		for (var i = 0; i < element.length; i++) {
			result = result + this.getElementsValue(element[i], obj);
		}
	} else {
		if (element.getValue)
			result = element.getValue(obj);
	}
	return result;
};

AbstractSplitMasker.prototype.getExpress = function() {

};

AbstractSplitMasker.prototype.doSplit = function() {
	var express = this.getExpress();
	if (this.elements == null || this.elements.length == 0)
		this.elements = this.doQuotation(express, this.getSeperators(), this.getReplaceds(), 0);
};


/**
 * 处理引号
 *
 * @param express
 * @param seperators
 * @param replaced
 * @param curSeperator
 * @param obj
 * @param result
 */
AbstractSplitMasker.prototype.doQuotation = function(express, seperators, replaced, curSeperator) {
	if (express.length == 0)
		return null;
	var elements = new Array();
	var pattern = new RegExp('".*?"', "g");
	var fromIndex = 0;
	var result;
	do {
		result = pattern.exec(express);
		if (result != null) {
			var i = result.index;
			var j = pattern.lastIndex;
			if (i != j) {
				if (fromIndex < i) {
					var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator);
					if (childElements != null && childElements.length > 0) {
						//						elements = elements.concat(childElements);
						elements.push(childElements);
					}
				}
			}
			elements.push(new StringElement(express.substring(i + 1, j - 1)));
			fromIndex = j;
		}
	}
	while (result != null);

	if (fromIndex < express.length) {
		var childElements = this.doSeperator(express.substring(fromIndex, express.length), seperators, replaced, curSeperator);
		if (childElements != null && childElements.length > 0)
		//			elements = elements.concat(childElements);
			elements.push(childElements);
	}
	return elements;
};

/**
 * 处理其它分隔符
 *
 * @param express
 * @param seperators
 * @param replaced
 * @param curSeperator
 * @param obj
 * @param result
 */
AbstractSplitMasker.prototype.doSeperator = function(express, seperators, replaced, curSeperator) {
	if (curSeperator >= seperators.length) {
		var elements = new Array;
		elements.push(this.getVarElement(express));
		return elements;
	}

	if (express.length == 0)
		return null;
	var fromIndex = 0;
	var elements = new Array();
	var pattern = new RegExp(seperators[curSeperator], "g");
	var result;
	do {
		result = pattern.exec(express);
		if (result != null) {
			var i = result.index;
			var j = pattern.lastIndex;
			if (i != j) {
				if (fromIndex < i) {
					var childElements = this.doSeperator(express.substring(fromIndex, i), seperators, replaced, curSeperator + 1);
					if (childElements != null && childElements.length > 0)
					//						elements = elements.concat(childElements);
						elements.push(childElements);
				}

				if (replaced[curSeperator] != null) {
					elements.push(new StringElement(replaced[curSeperator]));
				} else {
					elements.push(new StringElement(express.substring(i, j)));
				}
				fromIndex = j;
			}
		}
	}
	while (result != null);

	if (fromIndex < express.length) {
		var childElements = this.doSeperator(express.substring(fromIndex, express.length), seperators, replaced, curSeperator + 1);
		if (childElements != null && childElements.length > 0)
		//			elements = elements.concat(childElements);
			elements.push(childElements);
	}
	return elements;
};


/**
 * 地址格式
 */
AddressMasker.prototype = new AbstractSplitMasker;

function AddressMasker(formatMeta) {
	this.update(formatMeta);
};

AddressMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, AddressMasker.DefaultFormatMeta, formatMeta)
}

AddressMasker.prototype.getExpress = function() {
	return this.formatMeta.express;
};

AddressMasker.prototype.getReplaceds = function() {
	return [this.formatMeta.separator];
};

AddressMasker.prototype.getSeperators = function() {
	return ["(\\s)+?"];
};

AddressMasker.prototype.getVarElement = function(express) {
	var ex = {};

	if (express == ("C"))
		ex.getValue = function(obj) {
			return obj.country;
		};


	if (express == ("S"))
		ex.getValue = function(obj) {
			return obj.state;
		};


	if (express == ("T"))
		ex.getValue = function(obj) {
			return obj.city;
		};


	if (express == ("D"))
		ex.getValue = function(obj) {
			return obj.section;
		};


	if (express == ("R"))
		ex.getValue = function(obj) {
			return obj.road;
		};

	if (express == ("P"))
		ex.getValue = function(obj) {
			return obj.postcode;
		};

	if (typeof(ex.getValue) == undefined)
		return new StringElement(express);
	else
		return ex;
};

AddressMasker.prototype.formatArgument = function(obj) {
	return obj;
};

/**
 * <b> 数字格式化  </b>
 *
 * <p> 格式化数字
 *
 * </p>
 *
 * Create at 2009-3-20 上午08:50:32
 *
 * @author bq
 * @since V6.0
 */
NumberMasker.prototype = new AbstractMasker;
NumberMasker.prototype.formatMeta = null;

/**
 *构造方法
 */
function NumberMasker(formatMeta) {
	this.update(formatMeta);
};

NumberMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, formatMeta)
}

/**
 *格式化对象
 */
NumberMasker.prototype.innerFormat = function(obj) {
	var dValue, express, seperatorIndex, strValue;
	dValue = obj.value;
	if (dValue > 0) {
		express = this.formatMeta.positiveFormat;
		strValue = dValue + '';
	} else if (dValue < 0) {
		express = this.formatMeta.negativeFormat;
		strValue = (dValue + '').substr(1, (dValue + '').length - 1);
	} else {
		express = this.formatMeta.positiveFormat;
		strValue = dValue + '';
	}
	seperatorIndex = strValue.indexOf('.');
	strValue = this.setTheSeperator(strValue, seperatorIndex);
	strValue = this.setTheMark(strValue, seperatorIndex);
	var color = null;
	if (dValue < 0 && this.formatMeta.isNegRed) {
		color = "FF0000";
	}
	return new FormatResult(express.replaceAll('n', strValue), color);

};
/**
 *设置标记
 */
NumberMasker.prototype.setTheMark = function(str, seperatorIndex) {
	var endIndex, first, index;
	if (!this.formatMeta.isMarkEnable)
		return str;
	if (seperatorIndex <= 0)
		seperatorIndex = str.length;
	first = str.charCodeAt(0);
	endIndex = 0;
	if (first == 45)
		endIndex = 1;
	index = seperatorIndex - 3;
	while (index > endIndex) {
		str = str.substr(0, index - 0) + this.formatMeta.markSymbol + str.substr(index, str.length - index);
		index = index - 3;
	}
	return str;
};
NumberMasker.prototype.setTheSeperator = function(str, seperatorIndex) {
	var ca;
	if (seperatorIndex > 0) {
		ca = NumberMasker.toCharArray(str);
		//ca[seperatorIndex] = NumberMasker.toCharArray(this.formatMeta.pointSymbol)[0];
		ca[seperatorIndex] = this.formatMeta.pointSymbol;
		str = ca.join('');
	}
	return str;
};
/**
 * 将字符串转换成char数组
 * @param {} str
 * @return {}
 */
NumberMasker.toCharArray = function(str) {
	var str = str.split("");
	var charArray = new Array();
	for (var i = 0; i < str.length; i++) {
		charArray.push(str[i]);
	}
	return charArray;
};


/**
 *默认构造方法
 */
NumberMasker.prototype.formatArgument = function(obj) {
	var numberObj = {};
	numberObj.value = obj;
	return numberObj;
};

/**
 * 货币格式
 */
CurrencyMasker.prototype = new NumberMasker;
CurrencyMasker.prototype.formatMeta = null;

function CurrencyMasker(formatMeta) {
	this.update(formatMeta);
};

CurrencyMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, CurrencyMasker.DefaultFormatMeta, formatMeta)
}

/**
 * 重载格式方法
 * @param {} obj
 * @return {}
 */
CurrencyMasker.prototype.innerFormat = function(obj) {
	if(!obj.value) {
		return {value: ""};
	}
	var fo = (new NumberMasker(this.formatMeta)).innerFormat(obj);
	fo.value = this.formatMeta.curSymbol  +  fo.value; //fo.value.replace("$", this.formatMeta.curSymbol);
	return fo;
};


PercentMasker.prototype = new NumberMasker;

function PercentMasker(formatMeta) {
	this.update(formatMeta)
};

PercentMasker.prototype.update = function(formatMeta) {
	this.formatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, formatMeta)
}


PercentMasker.prototype.formatArgument = function(obj) {
	return obj;
};

PercentMasker.prototype.innerFormat = function(value) {
	var val = "";
	if (value != "") {
		var obj = (new NumberMasker(this.formatMeta)).innerFormat({value:value}).value;
		// 获取obj保留几位小数位,obj小数位-2为显示小数位
		var objStr = String(obj);
		var objPrecision = objStr.length - objStr.indexOf(".") - 1;
		var showPrecision = objPrecision - 2;
		if (showPrecision < 0) {
			showPrecision = 0;
		}
		val = parseFloat(obj) * 100;
		val = (val * Math.pow(10, showPrecision) / Math.pow(10, showPrecision)).toFixed(showPrecision);
		val = val + "%";
	}
	return {
		value: val
	};
};


/**
 * 将结果输出成HTML代码
 * @param {} result
 * @return {String}
 */
function toColorfulString(result) {
	var color;
	if (!result) {
		return '';
	}
	if (result.color == null) {
		return result.value;
	}
	color = result.color;
	return '<font color="' + color + '">' + result.value + '<\/font>';
};

/**
 * 格式解析后形成的单个格式单元
 * 适用于基于拆分算法的AbstractSplitFormat，表示拆分后的变量单元
 */
StringElement.prototype = new Object();

function StringElement(value) {
	this.value = value;
};
StringElement.prototype.value = "";

StringElement.prototype.getValue = function(obj) {
	return this.value;
};
/**
 *格式结果
 */
FormatResult.prototype = new Object;
/**
 *默认构造方法
 */
function FormatResult(value, color) {
	this.value = value;
	this.color = color;
};

NumberMasker.DefaultFormatMeta = {
	isNegRed: true,
	isMarkEnable: true,
	markSymbol: ",",
	pointSymbol: ".",
	positiveFormat: "n",
	negativeFormat: "-n"
}

CurrencyMasker.DefaultFormatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, {
	//curSymbol: "",
	positiveFormat: "n",
	negativeFormat: "-n"
})


AddressMasker.defaultFormatMeta = {
	express: "C S T R P",
	separator: " "
};


u.AddressMasker = AddressMasker;
u.NumberMasker = NumberMasker;
u.CurrencyMasker = CurrencyMasker;
u.PercentMasker = PercentMasker;
/**
 * 数据格式化工具
 */

function NumberFormater(precision) {
    this.precision = precision;
};

NumberFormater.prototype.update = function (precision) {
    this.precision = precision;
}

NumberFormater.prototype.format = function (value) {
    if (!u.isNumber(value)) return "";

    // 以0开头的数字将其前面的0去掉
    while ((value + "").charAt(0) == "0" && value.length > 1 && (value + "").indexOf('0.') != 0) {
        value = value.substring(1);
    }
    var result = value;
    if (u.isNumber(this.precision)) {
        if (window.BigNumber) {
            // 已经引入BigNumber
            result = (new BigNumber(value)).toFixed(this.precision)
        } else {
            var digit = parseFloat(value);
            // 解决toFixed四舍五入问题，如1.345
            result = (Math.round(digit * Math.pow(10, this.precision)) / Math.pow(10, this.precision)).toFixed(this.precision);
        }
        if (result == "NaN")
            return "";
    }


    return result;
};

function DateFormater(pattern) {
    this.pattern = pattern;
};

DateFormater.prototype.update = function (pattern) {
    this.pattern = pattern;
}


DateFormater.prototype.format = function (value) {
    return moment(value).format(this.pattern)
};

u.NumberFormater = NumberFormater;
u.DateFormater = DateFormater;



u.date= {
    /**
     * 多语言处理
     */
    //TODO 后续放到多语文件中
    _dateLocale:{
        'zh-CN':{
            months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin : '日_一_二_三_四_五_六'.split('_')
        },
        'en-US':{
            months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thurday_Friday_Saturday'.split('_'),
            weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin : 'S_M_T_W_T_F_S'.split('_')
        }
    },

    _formattingTokens : /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,

    leftZeroFill : function(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),sign = number >= 0;
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    },

    _formats: {
        //year
        YY   : function (date) {
            return u.date.leftZeroFill(date.getFullYear() % 100, 2);
        },
        YYYY : function (date) {
            return date.getFullYear();
        },
        //month
        M : function (date) {
            return date.getMonth() + 1;
        },
        MM: function(date){
            var m = u.date._formats.M(date);
            return u.date.leftZeroFill(m,2);
        },
        MMM  : function (date, language) {
            var m = date.getMonth();
            return u.date._dateLocale[language].monthsShort[m];
        },
        MMMM : function (date, language) {
            var m = date.getMonth();
            return u.date._dateLocale[language].months[m];
        },
        //date
        D : function (date) {
            return date.getDate();
        },
        DD: function(date){
            var d = u.date._formats.D(date);
            return u.date.leftZeroFill(d,2);
        },
        // weekday
        d : function (date) {
            return date.getDay();
        },
        dd : function (date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdaysMin[d];
        },
        ddd : function (date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdaysShort[d];
        },
        dddd : function (date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdays[d];
        },
        // am pm
        a: function(date){
            if (date.getHours() > 12){
                return 'pm';
            }else{
                return 'am';
            }
        },
        //hour
        h: function(date){
            var h = date.getHours();
            h = h > 12 ? h-12 : h;
            return h
        },
        hh: function(date){
            var h = u.date._formats.h(date);
            return u.date.leftZeroFill(h,2);
        },
        H: function(date){
            return date.getHours();
        },
        HH: function(date){
            return u.date.leftZeroFill(date.getHours(),2);
        },
        // minutes
        m: function(date){
            return date.getMinutes();
        },
        mm: function(date){
            return u.date.leftZeroFill(date.getMinutes(), 2);
        },
        //seconds
        s: function(date){
            return date.getSeconds();
        },
        ss: function(date){
            return u.date.leftZeroFill(date.getSeconds(),2);
        }
    },

    /**
     * 日期格式化
     * @param date
     * @param formatString
     */
    format: function(date, formatString, language){
        if (!date) return date;
        var array = formatString.match(u.date._formattingTokens), i, length,output='';
        var _date = u.date.getDateObj(date);
        if (!_date) return date;
        language = language || u.core.getLanguages();
        for (i = 0, length = array.length; i < length; i++) {
            if (u.date._formats[array[i]]) {
                output += u.date._formats[array[i]](_date, language);
            } else {
                output += array[i];
            }
        }
        return output;
    },

    _addOrSubtract: function(date, period, value, isAdding){
        var times = date.getTime(),d = date.getDate(), m = date.getMonth(),_date = u.date.getDateObj(date);
        if (period === 'ms') {
            times = times + value * isAdding;
            _date.setTime(times);
        }
        else if (period == 's') {
            times = times + value*1000 * isAdding;
            _date.setTime(times);
        }
        else if (period == 'm') {
            times = times + value*60000 * isAdding;
            _date.setTime(times);
        }
        else if (period == 'h') {
            times = times + value*3600000 * isAdding;
            _date.setTime(times);
        }
        else if (period == 'd') {
            d = d + value * isAdding;
            _date.setDate(d);
        }
        else if (period == 'w') {
            d = d + value * 7 * isAdding;
            _date.setDate(d);
        }
        else if (period == 'M') {
            m = m + value * isAdding;
            _date.setMonth(d);
        }
        else if (period == 'y'){
            m = m + value * 12 * isAdding;
            _date.setMonth(d);
        }
        return _date;
    },

    add: function(date,period,value){
        return u.date._addOrSubtract(date, period, value, 1);
    },
    sub: function(date,period,value){
        return u.date._addOrSubtract(date, period, value, -1);
    },
    getDateObj: function(value){
        if (!value || typeof value == 'undefined') return value;
        var dateFlag = false;
        var _date = new Date(value);
        if (isNaN(_date)){
            // IE的话对"2016-2-13 12:13:22"进行处理
            var index1,index2,index3,s1,s2,s3;
            index1 = value.indexOf('-');
            index2 = value.indexOf(':');
            index3 = value.indexOf(' ');
            if(index1 > 0 || index2 > 0 || index3 > 0){
                _date = new Date();
                if(index3 > 0){
                    s3 = value.split(' ');
                    s1 = s3[0].split('-');
                    s2 = s3[1].split(':'); 
                }else if(index1 > 0){
                    s1 = value.split('-');
                }else if(index2 > 0){
                    s2 = value.split(':');
                }
                if(s1 && s1.length > 0){
                    _date.setYear(s1[0]);
                    _date.setMonth(parseInt(s1[1] -1));
                    _date.setDate(s1[2]?s1[2]:0);
                    dateFlag = true;
                }
                if(s2 && s2.length > 0){
                    _date.setHours(s2[0]?s2[0]:0);
                    _date.setMinutes(s2[1]?s2[1]:0);
                    _date.setSeconds(s2[2]?s2[2]:0);
                    dateFlag = true;
                }
            }else{
                _date = new Date(parseInt(value))
                if (isNaN(_date)) {
                    throw new TypeError('invalid Date parameter');
                }else{
                    dateFlag = true;
                }
            }
        }else{
            dateFlag = true;
        }

        if(dateFlag)
            return _date;
        else
            return null;
    }
};


/**
 * 处理数据显示格式
 */

u.floatRender = function (value, precision) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
        return value;
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value();
    var maskerMeta = u.core.getMaskerMeta('float') || {};
    if (typeof precision === 'number')
        maskerMeta.precision = precision;
    var formater = new u.NumberFormater(maskerMeta.precision);
    var masker = new NumberMasker(maskerMeta);
    return masker.format(formater.format(trueValue)).value;
};

u.integerRender = function (value) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
        return value;
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value();
    return trueValue
};

var _dateRender = function(value, format, type){
    var trueValue = value;
    if (typeof value === 'undefined' || value === null)
        return value
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value()
    var maskerMeta = u.core.getMaskerMeta(type) || {}
    if (typeof format != 'undefined')
        maskerMeta.format = format
    var maskerValue = u.date.format(trueValue, maskerMeta.format);
    return maskerValue;
}

u.dateRender = function (value, format) {
    return _dateRender(value, format, 'date');
};

u.dateTimeRender = function (value, format) {
    return _dateRender(value, format, 'datetime');
};

u.timeRender = function (value, format) {
    return _dateRender(value, format, 'time');
};

u.percentRender = function (value) {
    var trueValue = value
    if (typeof value === 'undefined' || value === null)
        return value
    //value 为 ko对象
    if (typeof value === 'function')
        trueValue = value()
    var maskerMeta = u.core.getMaskerMeta('percent') || {}
    var masker = new PercentMasker(maskerMeta);
    var maskerValue = masker.format(trueValue);
    return (maskerValue && maskerValue.value) ? maskerValue.value : '';
};

u.dateToUTCString = function (date) {
    if (!date) return ''
    if (date.indexOf("-") > -1)
        date = date.replace(/\-/g, "/");
    var utcString = Date.parse(date);
    if (isNaN(utcString)) return "";
    return utcString;
}

var _hotkeys = {};
_hotkeys.special_keys = {
    27: 'esc', 9: 'tab', 32: 'space', 13: 'enter', 8: 'backspace', 145: 'scroll', 20: 'capslock',
    144: 'numlock', 19: 'pause', 45: 'insert', 36: 'home', 46: 'del', 35: 'end', 33: 'pageup',
    34: 'pagedown', 37: 'left', 38: 'up', 39: 'right', 40: 'down', 112: 'f1', 113: 'f2', 114: 'f3',
    115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10', 122: 'f11', 123: 'f12'
};

_hotkeys.shift_nums = {
    "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
    "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ":", "'": "\"", ",": "<",
    ".": ">", "/": "?", "\\": "|"
};

_hotkeys.add = function (combi, options, callback) {
    if (u.isFunction(options)) {
        callback = options;
        options = {};
    }
    var opt = {},
        defaults = {type: 'keydown', propagate: false, disableInInput: false, target: document.body, checkParent: true},
        that = this;
    opt = u.extend(opt, defaults, options || {});
    combi = combi.toLowerCase();

    // inspect if keystroke matches
    var inspector = function (event) {
        //event = $.event.fix(event); // jQuery event normalization.
        var element = this//event.target;
        // @ TextNode -> nodeType == 3
        element = (element.nodeType == 3) ? element.parentNode : element;

        if (opt['disableInInput']) { // Disable shortcut keys in Input, Textarea fields
            var target = element;//$(element);
            if (target.tagName == "INPUT" || target.tagName == "TEXTAREA") {
                return;
            }
        }
        var code = event.which,
            type = event.type,
            character = String.fromCharCode(code).toLowerCase(),
            special = that.special_keys[code],
            shift = event.shiftKey,
            ctrl = event.ctrlKey,
            alt = event.altKey,
            propagate = true, // default behaivour
            mapPoint = null;

        // in opera + safari, the event.target is unpredictable.
        // for example: 'keydown' might be associated with HtmlBodyElement
        // or the element where you last clicked with your mouse.
        if (opt.checkParent) {
//              while (!that.all[element] && element.parentNode){
            while (!element['u.hotkeys'] && element.parentNode) {
                element = element.parentNode;
            }
        }

//          var cbMap = that.all[element].events[type].callbackMap;
        var cbMap = element['u.hotkeys'].events[type].callbackMap;
        if (!shift && !ctrl && !alt) { // No Modifiers
            mapPoint = cbMap[special] || cbMap[character]
        }
        // deals with combinaitons (alt|ctrl|shift+anything)
        else {
            var modif = '';
            if (alt) modif += 'alt+';
            if (ctrl) modif += 'ctrl+';
            if (shift) modif += 'shift+';
            // modifiers + special keys or modifiers + characters or modifiers + shift characters
            mapPoint = cbMap[modif + special] || cbMap[modif + character] || cbMap[modif + that.shift_nums[character]]
        }
        if (mapPoint) {
            mapPoint.cb(event);
            if (!mapPoint.propagate) {
                event.stopPropagation();
                event.preventDefault();
                return false;
            }
        }
    };
    // first hook for this element
    var data = opt.target['u.hotkeys'];
    if (!data) {
        opt.target['u.hotkeys'] =  data = {events: {}};
    }
//      if (!_hotkeys.all[opt.target]){
//          _hotkeys.all[opt.target] = {events:{}};
//      }
    if (!data.events[opt.type]) {
        data.events[opt.type] = {callbackMap: {}};
        u.on(opt.target, opt.type, inspector);
        //$.event.add(opt.target, opt.type, inspector);
    }
//      if (!_hotkeys.all[opt.target].events[opt.type]){
//          _hotkeys.all[opt.target].events[opt.type] = {callbackMap: {}}
//          $.event.add(opt.target, opt.type, inspector);
//      }
    data.events[opt.type].callbackMap[combi] = {cb: callback, propagate: opt.propagate};
//      _hotkeys.all[opt.target].events[opt.type].callbackMap[combi] =  {cb: callback, propagate:opt.propagate};
    return u.hotkeys;
};
_hotkeys.remove = function (exp, opt) {
    opt = opt || {};
    target = opt.target || document.body;
    type = opt.type || 'keydown';
    exp = exp.toLowerCase();

    delete target['u.hotkeys'].events[type].callbackMap[exp];
};

_hotkeys.scan = function (element, target) {
    element = element || document.body;
    element.querySelectorAll('[u-enter]').forEach(function(el){
        var enterValue = el.getAttribute('u-enter');
        if (!enterValue) return;
        if (enterValue.substring(0, 1) == '#')
            u.hotkeys.add('enter', {target: this}, function () {
                var _el = element.querySelector(enterValue);
                if (_el){
                    _el.focus();
                }
            });
        else {
            target = target || window
            var func = u.getFunction(target, enterValue)
            u.hotkeys.add('enter', {target: this}, function () {
                func.call(this)
            })
        }
    });
    element.querySelectorAll('[u-hotkey]').forEach(function(el){
        var hotkey = el.getAttribute('u-hotkey');
        if (!hotkey) return;
        u.hotkeys.add(hotkey, function () {
            el.click();
        })

    });
}

u.hotkeys = _hotkeys;


var App = function () {
    this.dataTables = {};
}

App.fn = App.prototype;

App.fn.init = function (viewModel, element, doApplyBindings) {
    var self = this;
    element = element || document.body;
    if (!u.isArray(element)) {
        element = [element];
    }
    this.elements = element;
    u.each(this.elements, function (i, element) {
        if (typeof element === 'string'){
            element = document.querySelector(element);
        }
        if(element){
            element.querySelectorAll('[u-meta]').forEach(function (ele) {
                // if (ele['init'] && ele['init'] === true) return;
                //if ($(this).parents('[u-meta]').length > 0) return;
                var options = JSON.parse(ele.getAttribute('u-meta'));
                options['type'] = options['type'] || 'string';
                if (options && options['type']) {
                    if (self.adjustFunc)
                        self.adjustFunc.call(self, options);
                    //var comp = u.compMgr._createComp(ele, options, viewModel, self);
                    var comp = u.compMgr.createDataAdapter({el:ele,options:options,model:viewModel,app:self});
                    ele['u-meta'] = comp;
                    //if (comp)
                    //    $(this).data('u-meta', comp)
                }
            })
        }

        if (u.hotkeys)
            u.hotkeys.scan(element);
        //try {
            if (typeof doApplyBindings == 'undefined' || doApplyBindings == true)
                ko.applyBindings(viewModel, element);
        //} catch (e) {
            //iweb.log.error(e)
        //}
        u.compMgr.updateComp(element);
    });

    _getDataTables(this, viewModel);
//		ko.cleanNode(this.element)
}

App.fn.createComp = function(ele,viewModel){
    var options = JSON.parse(ele.getAttribute('u-meta'));
    if (options && options['type']) {
        var comp = u.compMgr.createDataAdapter({el:ele,options:options,model:viewModel,app:this});
        ele['u-meta'] = comp;
    }
    return comp;
}

App.fn.setAdjustMetaFunc = function (adjustFunc) {
    this.adjustFunc = adjustFunc
}

App.fn.addDataTable = function (dataTable) {
    this.dataTables[dataTable.id] = dataTable
    return this
}
App.fn.getDataTable = function (id) {
    return this.dataTables[id]
}

App.fn.getDataTables = function () {
    return this.dataTables
}

App.fn.getComp = function (compId) {
    var returnComp = null;
    u.each(this.elements, function (i, element) {
        if (typeof element === 'string'){
            element = document.querySelector(element);
        }
        if(element){
            element.querySelectorAll('[u-meta]').forEach(function (ele) {
                if (ele['u-meta']) {
                    var comp = ele['u-meta'];
                    if (comp.id === compId) {
                        returnComp = comp;
                        return false;
                    }
                }
            })
        }

    })
    return returnComp;
}

App.fn.getCompsByDataTable = function (dataTableId, element) {
    var comps = this.getComps(element),
        targetComps = []
    for (var i = 0; i < comps.length; i++) {
        if ((comps[i].dataModel && comps[i].dataModel['id'] == dataTableId) || (comps[i].dataTable && comps[i].dataTable['id'] == dataTableId))
            targetComps.push(comps[i])
    }
    return targetComps
}

/**
 * 获取某区域中的所有控件
 * @param {object} element
 */
App.fn.getComps = function (element) {
    var elements = element ? element : this.elements;
    var returnComps = [];
    if(typeof elements == 'string'){
    	elements = document.querySelectorAll(elements);
    }
    if (!u.isArray(elements) && !(elements instanceof NodeList))
        elements = [elements];
    u.each(elements, function (i, element) {
        if(element){
            element.querySelectorAll('[u-meta]').forEach(function (ele) {
                if (ele['u-meta']) {
                    var comp = ele['u-meta'];
                    if (comp)
                        returnComps.push(comp);
                }
            })
        }

    });
    return returnComps;
}

/**
 * 控件数据校验
 * @param {Object} element
 */
App.fn.compsValidate = function (element, retUnpass) {
    var comps = this.getComps(element),
        passed = true,
        unpassed=[];
    for (var i = 0; i < comps.length; i++) {
        if (comps[i].doValidate){
            var result = comps[i].doValidate({trueValue:true,showMsg:true});
            result = typeof result === 'object' ? result['passed'] : result;
            passed = result && passed;
            if(!result) unpassed.push(comps[i])
        }
    }
    if(retUnpass) return unpassed;
    return passed
}

App.fn.compsValidateMultiParam = function(options){
    var element = options.element,
        comps = this.getComps(element),
        passed = true,
        showMsg = options.showMsg,
        notPassedArr = new Array();
    for(var i = 0; i < comps.length; i++){
        if (comps[i].doValidate){
            result = comps[i].doValidate({trueValue:true, showMsg:showMsg});
            passed = result.passed && passed;
            if(!result.passed){
                notPassedArr.push(result);
            }
        }
    }
    return {passed:passed,
            notPassedArr:notPassedArr}; 
}

/**
 * 将comp显示到顶端（此方法只支持body上存在滚动条的情况）
 * @param {object} comp对象
 */
App.fn.showComp = function(comp){
    var ele = comp.element,off = u.getOffset(ele),scroll = u.getScroll(ele),
        top = off.top - scroll.top,bodyHeight = document.body.clientHeight,
        nowTop = document.body.scrollTop;
    if(top > bodyHeight || top < 0){
        document.body.scrollTop = nowTop + top;
    }
}

/**
 * 根据类型获取控件
 * @param {String} type
 * @param {object} element
 */
App.fn.getCompsByType = function (type, element) {
    var elements = element ? element : this.elements;
    var returnComps = [];
    if (!u.isArray(elements))
        elements = [elements];
    u.each(elements, function (i, element) {
        if(element){
            element.querySelectorAll('[u-meta]').forEach(function (ele) {
                if (ele['u-meta']) {
                    var comp = ele['u-meta'];
                    if (comp && comp.type == type)
                        returnComps.push(comp);
                }
            })
        }

    });
    return returnComps;
}


App.fn.getEnvironment = function () {
    return window.iweb.Core.collectEnvironment()
}

App.fn.setClientAttribute = function (k, v) {
    window.iweb.Core.setClientAttribute(k, v)
}

App.fn.getClientAttribute = function (k) {
    return window.iweb.Core.getClientAttributes()[k]
}

App.fn.serverEvent = function () {
    return new ServerEvent(this)
}

App.fn.ajax = function (params) {
    params = this._wrapAjax(params)
    u.ajax(params)
}

App.fn._wrapAjax = function (params) {
    var self = this
    this.serverEventObj = this.serverEvent();
    var orignSuccess = params.success
    var orignError = params.error
    var deferred = params.deferred;
    if (!deferred || !deferred.resolve) {
        deferred = {
            resolve: function () {
            }, reject: function () {
            }
        }
    }
    params.success = function (data, state, xhr) {
        if (typeof data === 'string')
            data = JSON.parse(data)
        if (self.serverEventObj.processXHRError(self, data, state, xhr)) {
            orignSuccess.call(null, data)
            self._successFunc(data, deferred)
        } else {
            deferred.reject();
        }
    }
    params.error = function (data, state, xhr) {
        if (typeof data === 'string')
            data = JSON.parse(data)
        if (self.serverEventObj.processXHRError(self, data, state, xhr)) {
            orignError.call(null, data)
            self._successFunc(data, deferred)
        } else {
            deferred.reject();
        }
    }
    if (params.data)
        params.data.environment = ko.utils.stringifyJson(window.iweb.Core.collectEnvironment());
    else
        params.data = {environment: ko.utils.stringifyJson(window.iweb.Core.collectEnvironment())}
    return params
}

App.fn._successFunc = function (data, deferred) {
    deferred.resolve();
}

window.processXHRError = function (rsl, state, xhr) {
    if (typeof rsl === 'string')
        rsl = JSON.parse(rsl)
    if (xhr.getResponseHeader && xhr.getResponseHeader("X-Error")) {
        u.showMessageDialog({type: "info", title: "提示", msg: rsl["message"], backdrop: true});
        if (rsl["operate"]) {
            eval(rsl["operate"]);
        }
        return false;
    }
    return true;
};

App.fn.setUserCache = function (key, value) {
    var userCode = this.getEnvironment().usercode;
    if (!userCode)return;
    localStorage.setItem(userCode + key, value);
}

App.fn.getUserCache = function (key) {
    var userCode = this.getEnvironment().usercode;
    if (!userCode)return;
    return localStorage.getItem(userCode + key);
}

App.fn.removeUserCache = function (key) {
    var userCode = this.getEnvironment().usercode;
    if (!userCode)return;
    localStorage.removeItem(userCode + key);
}

App.fn.setCache = function (key, value) {
    localStorage.setItem(key, value);
}

App.fn.getCache = function (key) {
    return localStorage.getItem(key);
}

App.fn.removeCache = function (key) {
    localStorage.removeItem(key)
}

App.fn.setSessionCache = function (key, value) {
    sessionStorage.setItem(key, value)
}

App.fn.getSessionCache = function (key) {
    return sessionStorage.getItem(key)
}

App.fn.removeSessionCache = function (key) {
    sessionStorage.removeItem(key)
}

App.fn.setEnable = function (enable) {
    u.each(this.elements, function (i, element) {
        if(element){
            element.querySelectorAll('[u-meta]').each(function () {
                if (this['u-meta']) {
                    var comp = this['u-meta'];
                    if (comp.setEnable)
                        comp.setEnable(enable)
                }
            })
        }

    })
}

var ServerEvent = function (app) {
    this.app = app
    this.datas = {}
    this.params = {}
    this.event = null
    this.ent = window.iweb.Core.collectEnvironment()
    if (!iweb.debugMode) {
        this.compression = true
    }
}

ServerEvent.DEFAULT = {
    async: true,
    singleton: true,
    url: (window.$ctx || '/iwebap') + '/evt/dispatch'
}

ServerEvent.fn = ServerEvent.prototype

ServerEvent.fn.addDataTable = function (dataTableId, rule) {
    var dataTable = this.app.getDataTable(dataTableId)
    this.datas[dataTableId] = dataTable.getDataByRule(rule)
    return this
}

ServerEvent.fn.setCompression = function (compression) {
    if (!iweb.browser.isIE8 && !window.pako && compression == true)
        iweb.log.error("can't compression, please include  pako!")
    else
        this.compression = compression
}

/**
 *
 * @param {Object} dataTabels
 * 格式1: ['dt1',{'dt2':'all'}]，格式2：['dt1', 'dt2']，格式3: ['dt1', 'dt2'], 'all'
 */
ServerEvent.fn.addDataTables = function (dataTables) {
    if (arguments.length == 2) {
        for (var i = 0; i < dataTables.length; i++) {
            var rule;
            if (typeof arguments[1] == 'string') {
                rule = arguments[1]
            } else if (u.isArray(arguments[1])) {
                rule = arguments[1][i]
            }
            this.addDataTable(dataTables[i], rule)
        }
    } else {
        for (var i = 0; i < dataTables.length; i++) {
            var dt = dataTables[i]
            if (typeof dt == 'string')
                this.addDataTable(dt)
            else {
                for (key in dt)
                    this.addDataTable(key, dt[key])
            }
        }
    }

    return this
}

ServerEvent.fn.addAllDataTables = function (rule) {
    var dts = this.app.dataTables
    for (var i = 0; i < dts.length; i++) {
        this.addDataTable(dts[i].id, rule)
    }
}


ServerEvent.fn.addParameter = function (key, value) {
    this.params[key] = value
    return this
}

ServerEvent.fn.setEvent = function (event) {
    //无用逻辑
    //if (true)
    //	this.event = event
    //else
    this.event = _formatEvent(event)
    return this
}

var _formatEvent = function (event) {
    return event
}


//	app.serverEvent().fire({
//		ctrl:'CurrtypeController',
//		event:'event1',
//		success:
//		params:
//	})
ServerEvent.fn.fire = function (p) {
    var self = this
//		params = $.extend(ServerEvent.DEFAULT, params);
    var data = this.getData();
    data.parameters = ko.utils.stringifyJson(this.params)
    var params = {
        type: p.type || "POST",
        data: p.params || {},
        url: p.url || ServerEvent.DEFAULT.url,
        async: typeof p.async == 'undefined' ? ServerEvent.DEFAULT.async : p.async,
        singleton: p.singleton || ServerEvent.DEFAULT.singleton,
        success: p.success,
        error: p.error,
        dataType: 'json'
    }
    params.data.ctrl = p.ctrl
    params.data.method = p.method
    if (this.event)
        params.data.event = ko.utils.stringifyJson(this.event)
    var preSuccess = p.preSuccess || function () {
        }
    var orignSuccess = p.success || function () {
        }
    var orignError = params.error //|| function(){}
    this.orignError = orignError
    var deferred = params.deferred;
    if (!deferred || !deferred.resolve) {
        deferred = {
            resolve: function () {
            }, reject: function () {
            }
        }
    }
    params.success = function (data, state, xhr) {
        if (typeof data === 'string')
            data = JSON.parse(data)
        if (self.processXHRError(self, data, state, xhr)) {
            preSuccess.call(null, data)
            self._successFunc(data, deferred)
            orignSuccess.call(null, data.custom)
            deferred.resolve();
        } else {
            deferred.reject();
        }
    }
    params.error = function (data, state, xhr) {
        if (typeof data === 'string')
            data = JSON.parse(data)
        if (self.processXHRError(self, data, state, xhr)) {
            if (orignError)
                orignError.call(null, data.custom)
//				self._successFunc(data, deferred)
        } else {
            deferred.reject();
        }
    }
    params.data = u.extend(params.data, data);
    u.ajax(params)

}

ServerEvent.fn.getData = function () {
    var envJson = ko.utils.stringifyJson(this.app.getEnvironment()),
        datasJson = ko.utils.stringifyJson(this.datas, function replacer(key, value) {
          if (typeof value === "undefined" || value == null) {
            return '';
          }
          return value;
        }),
        compressType = '',
        compression = false
    if (window.trimServerEventData) {
        datasJson = window.trimServerEventData(datasJson);
    }
    if (this.compression) {
        if (!iweb.browser.isIE8 && window.pako) {
            envJson = encodeBase64(window.pako.gzip(envJson));
            datasJson = encodeBase64(window.pako.gzip(datasJson));
            compression = true
            compressType = 'gzip'
        }
    }
    return {
        environment: envJson,
        dataTables: datasJson,
        compression: compression,
        compressType: compressType
    }
}

ServerEvent.fn._successFunc = function (data, deferred) {
    if (typeof data === 'string')
        data = JSON.parse(data)
    var dataTables = data.dataTables
    var dom = data.dom
    if (dom)
        this.updateDom(JSON.parse(dom))
    if (dataTables)
        this.updateDataTables(dataTables, deferred)
}

ServerEvent.fn.updateDataTables = function (dataTables, deferred) {
    for (var key in dataTables) {
        var dt = this.app.getDataTable(key)
        if (dt) {
            dt.setData(dataTables[key])
            dt.updateMeta(dataTables[key].meta)
        }
    }
}

ServerEvent.fn.setSuccessFunc = function (func) {
    this._successFunc = func
}

ServerEvent.fn.updateDom = function () {
    u.each(dom, function (i, n) {
        var vo = n.two
        var key = n.one;
        _updateDom(key, vo)
    });
}

//TODO 去除jQuery后有问题待修改
function _updateDom(key, vos) {
    for (var i in vos) {
        var vo = vos[i]
        for (var key in vo) {
            var props = vo[key]
            if (key == 'trigger') {
                u.trigger(key,props[0]);
            }
            else {
                if (u.isArray(props)) {
                    u.each(props, function (i, n) {
                        key[i](n)
                    });
                }
                else
                    try {
                        key[i](vo)
                    } catch (error) {
                        key[i](vo[i])
                    }
            }
        }
    }
}

ServerEvent.fn.processXHRError = function (self, rsl, state, xhr) {
    if (typeof rsl === 'string')
        rsl = JSON.parse(rsl)
    if (xhr.getResponseHeader && xhr.getResponseHeader("X-Error")) {
        if (self.orignError)
            self.orignError.call(self, rsl, state, xhr)
        else {
            if (u.showMessageDialog)
                u.showMessageDialog({type: "info", title: "提示", msg: rsl["message"], backdrop: true});
            else
                alert(rsl["message"])
            if (rsl["operate"]) {
                eval(rsl["operate"]);
            }
        }
        return false;
    }
    return true;
};

u.createApp = function () {
    var app = new App();
    if (arguments.length > 0){
        var arg = arguments[0];
        app.init(arg.model, arg.el);
    }
    return app;
}

var _getDataTables = function (app, viewModel) {
    for (var key in viewModel) {
        if (viewModel[key] instanceof u.DataTable) {
            viewModel[key].id = key
            viewModel[key].parent = viewModel
            app.addDataTable(viewModel[key])
        }
    }
}

/* ========================================================================
 * UUI: dataTable.js
 *
 * ========================================================================
 * Copyright 2016 yonyou, Inc.
 * ======================================================================== */

var Events = function () {
};

Events.fn = Events.prototype;
/**
 * 绑定事件
 * 支持的格式： 1. on(u.DataTable.ON_ROW_FOCUS, function() {}) // 普通
 * 2. on([u.DataTable.ON_INSERT, u.DataTable.ON_DELETE], function() {}) // 数组
 * 3. on({u.DataTable.ON_INSERT: function() {}, u.DataTable.ON_DELETE: function() {}}) // map
 */
Events.fn.on = function (name, callback, one) {
    var self = this, origCb = callback;
    if(Object.prototype.toString.call(name) == '[object Array]') {
        // 数组
        for(var i in name) {
            this.on(name[i], callback);
        }
        return this;
    } else if(typeof name == 'object'){
        // map
        for(var key in name) {
            this.on(key, name[key]);
        }
        return this;
    }
    if(one) {
        callback = function() {
            self.off(name, callback);
            origCb.apply(this, arguments);
        }
    }
    name = name.toLowerCase();
    this._events || (this._events = {});
    var events = this._events[name] || (this._events[name] = []);
    events.push({
        callback: callback
    })
    return this;
}

/**
 * 解绑事件
 * 
**/
Events.fn.off = function (name, callback) {
    if(Object.prototype.toString.call(name) == '[object Array]') {
        // 数组
        for(var i in name) {
            this.off(name[i], callback);
        }
        return this;
    } else if(typeof name == 'object'){
        // map
        for(var key in name) {
            this.off(key, name[key]);
        }
        return this;
    }
    var cbs = this._events[name];
    if(!cbs) return this;
    if(!callback) {
        // 解绑所有事件
        cbs = null;
    } else {
        for(var i = cbs.length - 1;i >= 0; i--) {
            if(cbs[i] == callback) {
                cbs.splice(i, 1);
            }
        }
    }
    return this;
}

/**
 * 
**/
Events.fn.one = function (name, callback) {
    this.on(name, callback, 1);
}

/**
 * 触发事件
 */
Events.fn.trigger = function (name) {
    name = name.toLowerCase()
    if (!this._events || !this._events[name]) return this;
    var args = Array.prototype.slice.call(arguments, 1);
    var events = this._events[name];
    for (var i = 0, count = events.length; i < count; i++) {
        events[i].callback.apply(this, args);
    }
    return this;
}


Events.fn.getEvent = function (name) {
    name = name.toLowerCase()
    this._events || (this._events = {})
    return this._events[name]
}

/**===========================================================================================================
 *
 * 数据模型
 *
 * ===========================================================================================================
 */

var DataTable = function (options) {
    options = options || {};
    this.id = options['id'];
    this.strict = options['strict'] || false;
    this.meta = DataTable.createMetaItems(options['meta']);
    this.enable = options['enable'] || DataTable.DEFAULTS.enable;
    this.pageSize = ko.observable(options['pageSize'] || DataTable.DEFAULTS.pageSize)
    this.pageIndex = ko.observable(options['pageIndex'] || DataTable.DEFAULTS.pageIndex)
    this.totalPages = ko.observable(options['totalPages'] || DataTable.DEFAULTS.totalPages)
    this.totalRow = ko.observable()
    this.pageCache = options['pageCache'] === undefined ? DataTable.DEFAULTS.pageCache : options['pageCache']
    this.rows = ko.observableArray([])
    this.selectedIndices = ko.observableArray([])
    this._oldCurrentIndex = -1;
    this.focusIndex = ko.observable(-1)
    this.cachedPages = []
    this.metaChange = {};
    this.valueChange = {};//ko.observable(1);
    this.currentRowChange = ko.observable(1);
    this.enableChange = ko.observable(1);
    this.params = options['params'] || {};
    this.master = options['master'] || '';
    this.allSelected = ko.observable(false);
    if (options['root']){
        this.root = options['root']
    }else{
        this.root = this;
    }
    if (options['ns']){
        this.ns = options['ns'];
    }else{
        this.ns = '';
    }
}

DataTable.fn = DataTable.prototype = new Events()

DataTable.DEFAULTS = {
    pageSize: 20,
    pageIndex: 0,
    totalPages: 20,
    pageCache: false,
    enable: true
}

DataTable.META_DEFAULTS = {
    enable: true,
    required: false,
    descs: {}
}
DataTable.createMetaItems = function (metas) {
    var newMetas = {};
    for (var key in metas) {
        var meta = metas[key]
        if (typeof meta == 'string')
            meta = {}
        //if (meta['type'] && meta['type'] === 'child'){
        //
        //}
        newMetas[key] = u.extend({}, DataTable.META_DEFAULTS, meta)
    }
    //默认创建一个$data字段
    // if (u.isEmptyObject(newMetas)){
    //     newMetas['$data'] = {};
    // }
    return newMetas
}

/**
 * 字段不存在时，创建字段
 * @param fieldName
 * @param options
 */
DataTable.fn.createField = function(fieldName, options){
    //字段不主动定义，则不创建
    if (this.root.strict == true)
        return;
    //有子表的情况不创建字段
    if (fieldName.indexOf('.') != -1){
        var fNames = fieldName.split('.');
        var _name = fNames[0];
        for(var i= 0, count = fNames.length; i< count; i++){
            if (this.meta[_name] && this.meta[_name]['type'] === 'child')
                return;
            if ((i+1) < count)
                _name = _name + '.' + fNames[i+1]
        }
    }
    if (!this.meta[fieldName]){
        this.meta[fieldName] = {}
    }
    if (typeof options === 'object'){
        if(options['meta']){
            for(var key in options['meta']){
                //if (!this.meta[fieldName][key]){
                this.meta[fieldName]['meta'][key] = options['meta'][key];
                //}
            }
        }else{
            for(var key in options){
                //if (!this.meta[fieldName][key]){
                this.meta[fieldName][key] = options[key];
                //}
            }
        }
    }
    // 在顶层dataTable上定义field信息
    if (this.root !== this){
        var nsArr = this.ns.split('.')
        var _fieldMeta = this.root.meta
        for (var i = 0; i< nsArr.length; i++){
            _fieldMeta[nsArr[i]] = _fieldMeta[nsArr[i]] || {}
            _fieldMeta[nsArr[i]]['type'] = _fieldMeta[nsArr[i]]['type'] || 'child';
            _fieldMeta[nsArr[i]]['meta'] = _fieldMeta[nsArr[i]]['meta'] || {};
            _fieldMeta =  _fieldMeta[nsArr[i]]['meta'];
        }
        if (!_fieldMeta[fieldName]){
            _fieldMeta[fieldName] = {}
        }
        if (typeof options === 'object'){
            for(var key in options){
                if (!_fieldMeta[fieldName][key]){
                    _fieldMeta[fieldName][key] = options[key];
                }
            }
        }
    }

}


//事件类型
DataTable.ON_ROW_SELECT = 'select'
DataTable.ON_ROW_UNSELECT = 'unSelect'
DataTable.ON_ROW_ALLSELECT = 'allSelect'
DataTable.ON_ROW_ALLUNSELECT = 'allUnselect'
DataTable.ON_VALUE_CHANGE = 'valueChange'
DataTable.ON_CURRENT_VALUE_CHANGE = 'currentValueChange'  //当前行变化
//	DataTable.ON_AFTER_VALUE_CHANGE = 'afterValueChange'
//	DataTable.ON_ADD_ROW = 'addRow'
DataTable.ON_INSERT = 'insert'
DataTable.ON_UPDATE = 'update'
DataTable.ON_CURRENT_UPDATE = 'currentUpdate'
DataTable.ON_DELETE = 'delete'
DataTable.ON_DELETE_ALL = 'deleteAll'
DataTable.ON_ROW_FOCUS = 'focus'
DataTable.ON_ROW_UNFOCUS = 'unFocus'
DataTable.ON_LOAD = 'load'
DataTable.ON_ENABLE_CHANGE = 'enableChange'
DataTable.ON_META_CHANGE = 'metaChange'
DataTable.ON_ROW_META_CHANGE = 'rowMetaChange'
DataTable.ON_CURRENT_META_CHANGE = 'currentMetaChange'
DataTable.ON_CURRENT_ROW_CHANGE = 'currentRowChange'

DataTable.SUBMIT = {
    current: 'current',
    focus: 'focus',
    all: 'all',
    select: 'select',
    change: 'change',
    empty: 'empty',
    allSelect: 'allSelect',
    allPages: 'allPages'
}


DataTable.fn.addParam = function (key, value) {
    this.params[key] = value
}

DataTable.fn.addParams = function (params) {
    for (var key in params) {
        this.params[key] = params[key]
    }
}

DataTable.fn.getParam = function (key) {
    return this.params[key]
}

/**
 * 获取meta信息，先取row上的信息，没有时，取dataTable上的信息
 * @param {Object} fieldName
 * @param {Object} key
 * @param {Object} row
 */
DataTable.fn.getMeta = function (fieldName, key) {
    if (arguments.length === 0)
        return this.meta;
    else if (arguments.length === 1)
        return this.meta[fieldName];

    if(this.meta[fieldName] && typeof this.meta[fieldName][key] !== 'undefined'){
        return this.meta[fieldName][key];
    }else{
        return null;
    }
    
}

DataTable.fn.setMeta = function (fieldName, key, value) {
    if(!this.meta[fieldName])
        return;
    var oldValue = this.meta[fieldName][key]
    var currRow = this.getCurrentRow();
    this.meta[fieldName][key] = value
    if (this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key](-this.metaChange[fieldName + '.' + key]());
    //this.metaChange(- this.metaChange())
    if (key == 'enable')
        this.enableChange(-this.enableChange())
    this.trigger(DataTable.ON_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value
    });
    if (currRow && !currRow.getMeta(fieldName, key, false)) {
        this.trigger(fieldName + '.' + key + '.' + DataTable.ON_CURRENT_META_CHANGE, {
            eventType: 'dataTableEvent',
            dataTable: this.id,
            oldValue: oldValue,
            newValue: value
        });
    }
}

DataTable.fn.setCurrentPage = function (pageIndex, notCacheCurrentPage) {
    if (pageIndex != this.pageIndex() && notCacheCurrentPage != true)
        this.cacheCurrentPage();
    this.pageIndex(pageIndex)
    var cachedPage = this.cachedPages[this.pageIndex()]
    if (cachedPage) {
        this.removeAllRows()
        this.setRows(cachedPage.rows)
        this.setRowsSelect(cachedPage.selectedIndcies)
    }
}

DataTable.fn.isChanged = function () {
    var rows = this.getAllRows()
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].status != Row.STATUS.NORMAL)
            return true
    }
    return false
}


/**
 * example: meta: {supplier: {meta: {precision:'3', default: '0239900x', display:'显示名称'}}}
 */
DataTable.fn.updateMeta = function (meta) {
    if (!meta) {
        return;
    }
    for (var fieldKey in meta) {
        for (var propKey in meta[fieldKey]) {
            var oldValue = this.meta[fieldKey][propKey]
            var newValue = meta[fieldKey][propKey]
            if (propKey === 'default') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {}
                }
                this.meta[fieldKey]['default'].value = meta[fieldKey][propKey]
            } else if (propKey === 'display') {
                if (!this.meta[fieldKey]['default']) {
                    this.meta[fieldKey]['default'] = {}
                }
                this.meta[fieldKey]['default'].display = meta[fieldKey][propKey]
            } else {
                this.meta[fieldKey][propKey] = meta[fieldKey][propKey]
            }
            if (this.metaChange[fieldKey + '.' + propKey])
                this.metaChange[fieldKey + '.' + propKey](-this.metaChange[fieldKey + '.' + propKey]());

            this.trigger(DataTable.ON_META_CHANGE, {
                eventType: 'dataTableEvent',
                dataTable: this.id,
                field: fieldKey,
                meta: propKey,
                oldValue: oldValue,
                newValue: newValue
            });
        }

    }
    //this.metaChange(- this.metaChange())
}


/**
 *设置数据
 *
 */
DataTable.fn.setData = function (data,options) {
    var newIndex = data.pageIndex || this.pageIndex(),
        newSize = data.pageSize || this.pageSize(),
        newTotalPages = data.totalPages || this.totalPages(),
        newTotalRow = data.totalRow || data.rows.length,
        select, focus,unSelect=options?options.unSelect:false; 
        //currPage,
        //type = data.type;

    this.pageCache = data.pageCache || this.pageCache
    if (this.pageCache === true) {
        this.updatePages(data.pages)
        if (newIndex != this.pageIndex()) {
            this.setCurrentPage(newIndex, true);
            this.totalPages(newTotalPages)
            this.totalRow(newTotalRow)
            return;
        }
        else {
            select = this.getPage(newIndex).selectedIndices
            focus = this.getPage(newIndex).focus
            this.setRows(this.getPage(newIndex).rows)
        }
    } else {
        select = data.select||(!unSelect?[0]:[]);
        focus = data.focus;
        this.setRows(data.rows)
    }
    this.pageIndex(newIndex)
    this.pageSize(newSize)
    this.totalPages(newTotalPages)
    this.totalRow(newTotalRow)

    this.updateSelectedIndices()

    if (select && select.length > 0 && this.rows().length > 0)
        this.setRowsSelect(select)
    if (focus)
        this.setRowFocus(focus)
};

/**
 * 获取数据,只取字段名与字段值
 */
DataTable.fn.getSimpleData = function(options){
    options = options || {}
    var rows,_rowData = [], type = options['type'] || 'all', fields = options['fields'] || null;

    if (type === 'all') {
        rows = this.rows.peek();
    }else if (type === 'current'){
        var currRow = this.getCurrentRow();
        rows = currRow == null ? [] :  [currRow];
    }else if (type === 'focus'){
        var focusRow = this.getFocusRow();
        rows = focusRow == null ? [] :  [focusRow];
    }else if (type === 'select'){
        rows = this.getSelectedRows();
    }else if (type === 'change'){
        rows = this.getChangedRows();
    }

    for(var i = 0; i< rows.length; i++){
        _rowData.push(rows[i].getSimpleData({fields:fields}));
    }
    return _rowData;
};

/**
 * 设置数据, 只设置字段值
 * @param {array} data
 *options{} unSelect为true：不选中，为false则选中，默认选中0行
 */
DataTable.fn.setSimpleData = function(data,options){
    //this.clear();
    this.removeAllRows();
    this.cachedPages = [];
    //this.totalPages(1);
    //this.pageIndex(0);
    this.focusIndex(-1);
    this.selectedIndices([]);

    if (!data){
        // throw new Error("dataTable.setSimpleData param can't be null!");
        return;
    }
    
    var rows = [];
    if (!u.isArray(data))
        data = [data];
    for (var i =0; i< data.length; i++){
        var _data = data[i];
        /* 判断data中的字段在datatable中是否存在，如果不存在则创建 */
        // for(var f in _data){
        //     this.createField(f)
        // }
        if (typeof data[i] !== 'object')
            _data = {$data:data[i]}
        rows.push({
            status: Row.STATUS.NORMAL,
            data: _data
        })
    }
    var _data = {
        rows: rows
    }
    this.setData(_data,options);
};


/**
 * 追加数据
 * @param data
 */
DataTable.fn.addSimpleData = function(data){
    if (!data){
        throw new Error("dataTable.addSimpleData param can't be null!");
    }
    if (!u.isArray(data))
        data = [data];
    for (var i =0; i< data.length; i++){
        var r = this.createEmptyRow();
        r.setSimpleData(data[i]);
    }

}


/**
 * 清空datatable的所有数据以及分页数据以及index
 */
DataTable.fn.clear = function () {
    this.removeAllRows();
    this.cachedPages = [];
    this.totalPages(1);
    this.pageIndex(0);
    this.focusIndex(-1);
    this.selectedIndices([]);
}

/**
 * 更新分页数据
 */
DataTable.fn.updatePages = function (pages) {
    var pageSize = this.pageSize(), pageIndex = 0, page, r, row;
    var page, index, i, rows, focus, selectIndices, status, j, row, originRow;
    for (i = 0; i < pages.length; i++) {
        index = pages[i].index
        rows = pages[i].rows
        focus = pages[i].current
        selectIndices = pages[i].select
        status = pages[i].status
        if (status === 'del') {
            this.cachedPages[index] = null;
            continue;
        }
        if (!this.cachedPages[index]) {
            page = new Page({parent: this})
            page.rows = rows;
            for (var j = 0; j < page.rows.length; j++) {
                page.rows[j].rowId = page.rows[j].id
                delete page.rows[j].id
            }
            this.cachedPages[index] = page
        } else {
            //如果是当前页，先把this.rows数据更新到page中
            if (index == this.pageIndex()) {
                this.cacheCurrentPage();
            }
            page = this.cachedPages[index]
            for (var j = 0; j < rows.length; j++) {
                r = rows[j];
                if (!r.id)
                    r.id = Row.getRandomRowId()
                if (r.status == Row.STATUS.DELETE) {
                    this.removeRowByRowId(r.id)
                } else {
                    row = page.getRowByRowId(r.id)
                    if (row) {
                        page.updateRow(row, r);
                    } else {
                        r.rowId = r.id
                        delete r.id
                        page.rows.push(r);
                    }
                }
            }
        }
        page.selectedIndices = selectIndices;
        page.focus = focus;
    }
}

/**
 * 设置行数据
 * @param {Object} rows
 */
DataTable.fn.setRows = function (rows) {
    var insertRows = [], _id;
    for (var i = 0; i < rows.length; i++) {
        var r = rows[i]
        _id = r.rowId || r.id;
        if (!_id)
            _id = Row.getRandomRowId()
        if (r.status == Row.STATUS.DELETE) {
            this.removeRowByRowId(_id)
        }
        else {
            var row = this.getRowByRowId(_id)
            if (row) {
                row.updateRow(r);
                if (!u.isEmptyObject(r.data)) {
                    this.trigger(DataTable.ON_UPDATE, {
                        index: i,
                        rows: [row]
                    })
                    if (row == this.getCurrentRow()) {
                        this.currentRowChange(-this.currentRowChange())
                        row.currentRowChange(-row.currentRowChange())
                        this.trigger(DataTable.ON_CURRENT_UPDATE, {
                            index: i,
                            rows: [row]
                        })
                    } else {
                        row.currentRowChange(-row.currentRowChange())
                    }
                }

            }
            else {
                row = new Row({parent: this, id: _id})
                row.setData(rows[i])
                insertRows.push(row)
//					this.addRow(row)
            }
        }
    }
    if (insertRows.length > 0)
        this.addRows(insertRows)
}

DataTable.fn.clearCache = function () {
    this.cachedPages = []
}

DataTable.fn.cacheCurrentPage = function () {
    if (this.pageCache && this.pageIndex() > -1) {
        var page = new Page({parent: this});
        page.focus = this.getFocusIndex();
        page.selectedIndices = this.selectedIndices().slice();
        var rows = this.rows.peek() //.slice();
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i].getData();
            r.rowId = r.id;
            delete r.id;
            page.rows.push(r)
        }
        //page.rows = this.rows().slice();
        this.cachedPages[this.pageIndex()] = page
    }
}

/**
 * 前端分页方法，不建议使用，建议在后端进行分页
 * @param allRows
 */
DataTable.fn.setPages = function (allRows) {
    var pageSize = this.pageSize(), pageIndex = 0, page;
    this.cachedPages = [];
    for (var i = 0; i < allRows.length; i++) {
        pageIndex = Math.floor(i / pageSize);
        if (!this.cachedPages[pageIndex]) {
            page = new Page({parent: this})
            this.cachedPages[pageIndex] = page
        }
        page.rows.push(allRows[i])
    }
    if (this.pageIndex() > -1)
        this.setCurrentPage(this.pageIndex());
    this.totalRow(allRows.length);
    this.totalPages(pageIndex + 1);
}

DataTable.fn.hasPage = function (pageIndex) {
    //return (this.pageCache && this.cachedPages[pageIndex]  && this.cachedPages[pageIndex].pageSize == this.pageSize()) ? true : false
    return (this.pageCache && this.cachedPages[pageIndex]) ? true : false
}

DataTable.fn.getPage = function (pageIndex) {
    if (this.pageCache) {
        return this.cachedPages[pageIndex]
    }
    return -1;
}

DataTable.fn.getPages = function () {
    if (this.pageCache) {
        return this.cachedPages
    }
    return [];
}

DataTable.fn.copyRow = function (index, row) {
    this.copyRows(index, [row])
}

DataTable.fn.copyRows = function (index, rows) {
    for(var i=0;i < rows.length;i++) {
        var newRow = new Row({parent: this})
        if (rows[i]) {
            newRow.setData(rows[i].getData())
        }
        this.insertRows(index === undefined ? this.rows().length : index, [newRow])
    }
}

/**
 *追加行
 */
DataTable.fn.addRow = function (row) {
    this.insertRow(this.rows().length, row)
}

/**
 *追加多行
 */
DataTable.fn.addRows = function (rows) {
    this.insertRows(this.rows().length, rows)
}

DataTable.fn.insertRow = function (index, row) {
    if (!row) {
        row = new Row({parent: this})
    }
    this.insertRows(index, [row])
}

DataTable.fn.insertRows = function (index, rows) {
//		if (this.onBeforeRowInsert(index,rows) == false)
//			return
    var args = [index, 0]
    for (var i = 0; i < rows.length; i++) {
        args.push(rows[i]);
    }
    this.rows.splice.apply(this.rows, args);

    this.updateSelectedIndices(index, '+', rows.length)
    this.updateFocusIndex(index, '+', rows.length)

    this.trigger(DataTable.ON_INSERT, {
        index: index,
        rows: rows
    })
    if (this.ns){
        //var fName = this.parent.ns + '.' + fieldName;
        if (this.root.valueChange[this.ns])
            this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
    }
}

/**
 * 创建空行
 */
DataTable.fn.createEmptyRow = function () {
    var r = new Row({parent: this})
    this.addRow(r)
    if (!this.getCurrentRow())
        this.setRowSelect(r);
    return r
}

DataTable.fn.removeRowByRowId = function (rowId) {
    var index = this.getIndexByRowId(rowId)
    if (index != -1)
        this.removeRow(index)
}

DataTable.fn.removeRow = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.removeRows([index]);
}

DataTable.fn.removeAllRows = function () {
    this.rows([])
    this.selectedIndices([])
    this.focusIndex(-1)
    this.trigger(DataTable.ON_DELETE_ALL)
    this.updateCurrIndex();
}

DataTable.fn.removeRows = function (indices) {
    indices = this._formatToIndicesArray(indices)
    indices = indices.sort()
    var rowIds = [], rows = this.rows(), deleteRows = [];
    for (var i = indices.length - 1; i >= 0; i--) {
        var index = indices[i]
        var delRow = rows[index];
        if (delRow == null) {
            continue;
        }
        rowIds.push(delRow.rowId)
        var deleteRow = rows.splice(index, 1);
        deleteRows.push(deleteRow[0]);
        this.updateSelectedIndices(index, '-')
        this.updateFocusIndex(index, '-')
    }
    this.rows(rows)
    this.deleteRows = deleteRows;
    this.trigger(DataTable.ON_DELETE, {
        indices: indices,
        rowIds: rowIds,
        deleteRows: deleteRows
    })
    this.updateCurrIndex();
}

/**
 * 设置行删除
 * @param {Object} index
 */
DataTable.fn.setRowDelete = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.setRowDelete([index])
}

/**
 * 设置所有行删除
 */
DataTable.fn.setAllRowsDelete = function () {
    var indices = new Array(this.rows().length)
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i
    }
    this.setRowsDelete(indices)
}

/**
 * 设置行删除
 * @param {Array} indices
 */
DataTable.fn.setRowsDelete = function (indices) {
    indices = this._formatToIndicesArray(indices)
    for (var i = 0; i < indices.length; i++) {
        var row = this.getRow(indices[i])
        if (row.status == Row.STATUS.NEW) {
            this.rows(this.rows().splice(indices[i], 1));
            this.updateSelectedIndices(indices[i], '-')
            this.updateFocusIndex(index, '-')
        }
        else {
            row.status = Row.STATUS.FALSE_DELETE
        }
    }
    var rowIds = this.getRowIdsByIndices(indices)
    this.trigger(DataTable.ON_ROW_DELETE, {
        falseDelete: true,
        indices: indices,
        rowIds: rowIds
    })
}

DataTable.fn.toggleAllSelect = function(){
    if (this.allSelected()){
        this.setAllRowsUnSelect();
    }else{
        this.setAllRowsSelect();
    }

};

DataTable.fn.setAllRowsSelect = function () {
    var indices = new Array(this.rows().length)
    for (var i = 0; i < indices.length; i++) {
        indices[i] = i
    }
    this.setRowsSelect(indices);
    this.allSelected(true);
    this.trigger(DataTable.ON_ROW_ALLSELECT, {})
}

/**
 * 设置选中行，清空之前已选中的所有行
 */
DataTable.fn.setRowSelect = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.setRowsSelect([index])
    this.setRowFocus(this.getSelectedIndex())
}

DataTable.fn.setRowsSelect = function (indices) {
    indices = indices || -1;
    if (indices == -1) {
        this.setAllRowsUnSelect({quiet: true})
        return;
    }
    indices = this._formatToIndicesArray(indices);
    var sIns = this.selectedIndices();
    if (u.isArray(indices) && u.isArray(sIns) && indices.join() == sIns.join()) {
        // 避免与控件循环触发
        return;
    }
    this.setAllRowsUnSelect({quiet: true});
    try{
        this.selectedIndices(indices);
    }catch(e){
        
    }
    
//		var index = this.getSelectedIndex()
//		this.setCurrentRow(index)
    var rowIds = this.getRowIdsByIndices(indices);
    this.currentRowChange(-this.currentRowChange());
    this.trigger(DataTable.ON_ROW_SELECT, {
        indices: indices,
        rowIds: rowIds
    })
    this.updateCurrIndex();
}


/**
 * 添加选中行，不会清空之前已选中的行
 */
DataTable.fn.addRowSelect = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.addRowsSelect([index])
}

/**
 * 添加选中行，不会清空之前已选中的行
 */
DataTable.fn.addRowsSelect = function (indices) {
    indices = this._formatToIndicesArray(indices)
    var selectedIndices = this.selectedIndices().slice()
    for (var i = 0; i < indices.length; i++) {
        var ind = indices[i], toAdd = true
        for (var j = 0; j < selectedIndices.length; j++) {
            if (selectedIndices[j] == ind) {
                toAdd = false
            }
        }
        if (toAdd) {
            selectedIndices.push(indices[i])
        }
    }
    this.selectedIndices(selectedIndices)
//		var index = this.getSelectedIndex()
//		this.setCurrentRow(index)
    var rowIds = this.getRowIdsByIndices(indices)
    this.trigger(DataTable.ON_ROW_SELECT, {
        indices: indices,
        rowIds: rowIds
    })
    this.updateCurrIndex();
}

/**
 * 根据索引取rowid
 * @param {Object} indices
 */
DataTable.fn.getRowIdsByIndices = function (indices) {
    var rowIds = []
    for (var i = 0; i < indices.length; i++) {
        rowIds.push(this.getRow(indices[i]).rowId)
    }
    return rowIds
}

/**
 * 全部取消选中
 */
DataTable.fn.setAllRowsUnSelect = function (options) {
    this.selectedIndices([])
    if (!(options && options.quiet)) {
        this.trigger(DataTable.ON_ROW_ALLUNSELECT)
    }
    this.updateCurrIndex();
    this.allSelected(false);
}

/**
 * 取消选中
 */
DataTable.fn.setRowUnSelect = function (index) {
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
    }
    this.setRowsUnSelect([index])
}

DataTable.fn.setRowsUnSelect = function (indices) {
    indices = this._formatToIndicesArray(indices)
    var selectedIndices = this.selectedIndices().slice()

    // 避免与控件循环触发
    if (selectedIndices.indexOf(indices[0]) == -1) return;

    for (var i = 0; i < indices.length; i++) {
        var index = indices[i]
        var pos = selectedIndices.indexOf(index)
        if (pos != -1)
            selectedIndices.splice(pos, 1)
    }
    this.selectedIndices(selectedIndices)
    var rowIds = this.getRowIdsByIndices(indices)
    this.trigger(DataTable.ON_ROW_UNSELECT, {
        indices: indices,
        rowIds: rowIds
    })
    this.updateCurrIndex();
    this.allSelected(false);
}

/**
 *
 * @param {Object} index 要处理的起始行索引
 * @param {Object} type   增加或减少  + -
 */
DataTable.fn.updateSelectedIndices = function (index, type, num) {
    if (!u.isNumber(num)) {
        num = 1
    }
    var selectedIndices = this.selectedIndices().slice()
    if (selectedIndices == null || selectedIndices.length == 0)
        return
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        if (type == '+') {
            if (selectedIndices[i] >= index)
                selectedIndices[i] = parseInt(selectedIndices[i]) + num
        }
        else if (type == '-') {
            if (selectedIndices[i] >= index && selectedIndices[i] <= index + num - 1) {
                selectedIndices.splice(i, 1)
            }
            else if (selectedIndices[i] > index + num - 1)
                selectedIndices[i] = selectedIndices[i] - num
        }
    }
    this.selectedIndices(selectedIndices)
//		var currIndex = this.getSelectedIndex()
//		this.setCurrentRow(currIndex)
}

DataTable.fn.updateFocusIndex = function (opIndex, opType, num) {
    if (!u.isNumber(num)) {
        num = 1
    }
    if (opIndex <= this.focusIndex() && this.focusIndex() != -1) {
        if (opType === '+') {
            this.focusIndex(this.focusIndex() + num)
        } else if (opType === '-') {
            if (this.focusIndex() >= opIndex && this.focusIndex() <= opIndex + num - 1) {
                this.focusIndex(this.focusIndex() - 1)
            } else if (this.focusIndex() > opIndex + num - 1) {
                this.focusIndex(this.focusIndex() - num)
            }
        }
    }
}

/**
 * 获取选中行索引，多选时，只返回第一个行索引
 */
DataTable.fn.getSelectedIndex = function () {
    var selectedIndices = this.selectedIndices()
    if (selectedIndices == null || selectedIndices.length == 0)
        return -1
    return selectedIndices[0]
};

/**
 *获取选中的所有行索引数组索引
 */
DataTable.fn.getSelectedIndices = function () {
    var selectedIndices = this.selectedIndices()
    if (selectedIndices == null || selectedIndices.length == 0)
        return []
    return selectedIndices
};

/**
 * 兼容保留，不要用
 */
DataTable.fn.getSelectedIndexs = function () {
    return this.getSelectedIndices();
}

/**
 * 获取焦点行
 */
DataTable.fn.getFocusIndex = function () {
    return this.focusIndex()
}

/**
 * 根据行号获取行索引
 * @param {String} rowId
 */
DataTable.fn.getIndexByRowId = function (rowId) {
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowId)
            return i
    }
    return -1
}

/**
 * 获取所有行数据
 */
DataTable.fn.getAllDatas = function () {
    var rows = this.getAllRows()
    var datas = []
    for (var i = 0, count = rows.length; i < count; i++)
        if (rows[i])
            datas.push(rows[i].getData())
    return datas
}

/**
 * 获取当前页数据
 */
DataTable.fn.getData = function () {
    var datas = [], rows = this.rows();
    for (var i = 0; i < rows.length; i++) {
        datas.push(rows[i].getData())
    }
    return datas
}

DataTable.fn.getDataByRule = function (rule) {
    var returnData = {}, datas = null, rows;
    returnData.meta = this.meta
    returnData.params = this.params
    rule = rule || DataTable.SUBMIT.current
    if (rule == DataTable.SUBMIT.current) {
        datas = []
        var currIndex = this.focusIndex()
        if (currIndex == -1)
            currIndex = this.getSelectedIndex()
        rows = this.rows();
        for (var i = 0, count = rows.length; i < count; i++) {
            if (i == currIndex)
                datas.push(rows[i].getData())
            else
                datas.push(rows[i].getEmptyData())
        }

    }
    else if (rule == DataTable.SUBMIT.focus) {
        datas = []
        rows = this.rows();
        for (var i = 0, count = rows.length; i < count; i++) {
            if (i == this.focusIndex())
                datas.push(rows[i].getData())
            else
                datas.push(rows[i].getEmptyData())
        }
    }
    else if (rule == DataTable.SUBMIT.all) {
        datas = this.getData()
    }
    else if (rule == DataTable.SUBMIT.select) {
        datas = this.getSelectedDatas(true)
    }
    else if (rule == DataTable.SUBMIT.change) {
        datas = this.getChangedDatas()
    }
    else if (rule === DataTable.SUBMIT.empty) {
        datas = []
    }
    if (this.pageCache && datas != null) {
        datas = [{index: this.pageIndex(), select: this.getSelectedIndexs(), focus: this.focusIndex(), rows: datas}]
    }
    if (rule == DataTable.SUBMIT.allSelect) {
        datas = []
        var totalPages = this.totalPages();
        //缓存页数据
        for (var i = 0; i < totalPages; i++) {
            if (i == this.pageIndex()) {
                //当前页数据
                datas.push({
                    index: this.pageIndex(),
                    select: this.getSelectedIndexs(),
                    focus: this.focusIndex(),
                    rows: this.getSelectedDatas()
                });
            } else {
                var page = this.cachedPages[i];
                if (page) {
                    datas.push({
                        index: i,
                        select: page.selectedIndices,
                        focus: page.focus,
                        rows: page.getSelectDatas()
                    });
                }
            }
        }
    } else if (rule == DataTable.SUBMIT.allPages) {
        datas = []
        var totalPages = this.totalPages();
        //缓存页数据
        for (var i = 0; i < totalPages; i++) {
            if (i == this.pageIndex()) {
                //当前页数据
                datas.push({
                    index: this.pageIndex(),
                    select: this.getSelectedIndexs(),
                    focus: this.focusIndex(),
                    rows: this.getData()
                });
            } else {
                var page = this.cachedPages[i];
                if (page) {
                    datas.push({index: i, select: page.selectedIndices, focus: page.focus, rows: page.getData()});
                }
            }
        }
    }
    if (this.pageCache) {
        returnData.pages = datas;
    } else {
        returnData.rows = datas
        returnData.select = this.getSelectedIndexs()
        returnData.focus = this.getFocusIndex()
    }

    returnData.pageSize = this.pageSize()
    returnData.pageIndex = this.pageIndex()
    returnData.isChanged = this.isChanged()
    returnData.master = this.master
    returnData.pageCache = this.pageCache
    return returnData
}

/**
 * 获取选中行数据
 */
DataTable.fn.getSelectedDatas = function (withEmptyRow) {
    var selectedIndices = this.selectedIndices()
    var datas = []
    var sIndices = []
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i])
    }
    var rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            datas.push(rows[i].getData())
        else if (withEmptyRow == true)
            datas.push(rows[i].getEmptyData())
    }
    return datas
};

/**
 * 取选中行
 */
DataTable.fn.getSelectedRows = function (){
    var selectedIndices = this.selectedIndices();
    var selectRows = [];
    var rows = this.rows.peek();
    var sIndices = []
    for (var i = 0, count = selectedIndices.length; i < count; i++) {
        sIndices.push(selectedIndices[i])
    }
    for (var i = 0, count = rows.length; i < count; i++) {
        if (sIndices.indexOf(i) != -1)
            selectRows.push(rows[i])
    }
    return selectRows
}

DataTable.fn.refSelectedRows = function () {
    return ko.pureComputed({
        read: function () {
            var ins = this.selectedIndices() || []
            var rs = this.rows()
            var selectedRows = []
            for (var i = 0; i < ins.length; i++) {
                selectedRows.push(rs[i])
            }
            return selectedRows
        }, owner: this
    })
}

/**
 * 绑定字段值
 * @param {Object} fieldName
 */
DataTable.fn.ref = function (fieldName) {
    this.createField(fieldName);
    if (!this.valueChange[fieldName])
        this.valueChange[fieldName] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.valueChange[fieldName]();
            this.currentRowChange();
            var row = this.getCurrentRow()
            if (row) {
                return row.getChildValue(fieldName)
            }
            else
                return ''
        },
        write: function (value) {
            var row = this.getCurrentRow()
            if (row)
                row.setChildValue(fieldName, value);
                //row.setValue(fieldName, value)
        },
        owner: this
    })
}

/**
 * 绑定字段属性
 * @param {Object} fieldName
 * @param {Object} key
 */
DataTable.fn.refMeta = function (fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.metaChange[fieldName + '.' + key]();
            this.currentRowChange();
            return this.getMeta(fieldName, key)
        },
        write: function (value) {
            this.setMeta(fieldName, key, value)
        },
        owner: this
    })
}

DataTable.fn.refRowMeta = function (fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.metaChange[fieldName + '.' + key]();
            this.currentRowChange();
            var row = this.getCurrentRow()
            if (row)
                return row.getMeta(fieldName, key)
            else
                return this.getMeta(fieldName, key)
        },
        write: function (value) {
            var row = this.getCurrentRow()
            if (row)
                row.setMeta(fieldName, value)
        },
        owner: this
    })
}

DataTable.fn.getRowMeta = function (fieldName, key) {
    var row = this.getCurrentRow()
    if (row)
        return row.getMeta(fieldName, key)
    else
        return this.getMeta(fieldName, key)
}

DataTable.fn.refEnable = function (fieldName) {
    return ko.pureComputed({
        //enable优先级： dataTable.enable >  row上的enable >  field中的enable定义
        read: function () {
            this.enableChange();
            if (!fieldName)
                return this.enable;
            var fieldEnable = this.getRowMeta(fieldName, 'enable')
            if (typeof fieldEnable == 'undefined' || fieldEnable == null)
                fieldEnable = true;
            return fieldEnable && this.enable
//				return this.enable && (this.getMeta(fieldName, 'enable') || false)
        },
        owner: this
    })
}

DataTable.fn.isEnable = function (fieldName) {
    var fieldEnable = this.getMeta(fieldName, 'enable')
    if (typeof fieldEnable == 'undefined' || fieldEnable == null)
        fieldEnable = true
    return fieldEnable && this.enable
}

DataTable.fn.getValue = function (fieldName, row) {
    row = row || this.getCurrentRow()
    if (row)
        return row.getValue(fieldName)
    else
        return ''
}



DataTable.fn.setValue = function (fieldName, value, row, ctx) {
    if (arguments.length === 1){
        value = fieldName;
        fieldName = '$data';
    }

    row = row ? row : this.getCurrentRow()
    if (row)
        row.setValue(fieldName, value, ctx)
}

DataTable.fn.setEnable = function (enable) {
    if (this.enable == enable) return
    //当传入的参数不为false时，默认enable为true
    if (enable===false){
        enable=false;
    }else{
        enable=true;
    }
    this.enable = enable
    this.enableChange(-this.enableChange())
    this.trigger(DataTable.ON_ENABLE_CHANGE, {
        enable: this.enable
    })
}

/**
 * 获取当前操作行
 * 规则： focus 行优先，没有focus行时，取第一选中行
 */
DataTable.fn.getCurrentRow = function () {
    if (this.focusIndex() != -1)
        return this.getFocusRow()
    var index = this.getSelectedIndex()
    if (index == -1)
        return null
    else
        return this.getRow(index)
}


DataTable.fn.updateCurrIndex = function () {
    var currentIndex = this.focusIndex() != -1 ? this.focusIndex() : this.getSelectedIndex();
    if (this._oldCurrentIndex != currentIndex) {
        this._oldCurrentIndex = currentIndex;
        this.trigger(DataTable.ON_CURRENT_ROW_CHANGE)
        this.currentRowChange(-this.currentRowChange());
        if (this.ns){
            if (this.root.valueChange[this.ns])
                this.root.valueChange[this.ns](-this.root.valueChange[this.ns]());
        }

    }
}

/**
 * 获取焦点行
 */
DataTable.fn.getFocusRow = function () {
    if (this.focusIndex() != -1)
        return this.getRow(this.focusIndex())
    else
        return null
}

/**
 * 设置焦点行
 * @param {Object} index 行对象或者行index
 * @param quiet 不触发事件
 * @param force 当index行与已focus的行相等时，仍然触发事件
 */
DataTable.fn.setRowFocus = function (index, quiet, force) {
    var rowId = null
    if (index instanceof Row) {
        index = this.getIndexByRowId(index.rowId)
        rowId = index.rowId
    }
    if (index === -1 || (index === this.focusIndex() && !force)) {
        return;
    }
    this.focusIndex(index)
    if (quiet) {
        return;
    }
    this.currentRowChange(-this.currentRowChange())
    if (!rowId) {
        rowId = this.getRow(index).rowId
    }
    this.trigger(DataTable.ON_ROW_FOCUS, {
        index: index,
        rowId: rowId
    })
    this.updateCurrIndex();
}

/**
 * 焦点行反选
 */
DataTable.fn.setRowUnFocus = function () {
    this.currentRowChange(-this.currentRowChange())
    var indx = this.focusIndex(), rowId = null;
    if (indx !== -1) {
        rowId = this.getRow(indx).rowId
    }
    this.trigger(DataTable.ON_ROW_UNFOCUS, {
        index: indx,
        rowId: rowId
    })
    this.focusIndex(-1)
    this.updateCurrIndex();
}

DataTable.fn.getRow = function (index) {
    //return this.rows()[index]   //modify by licza.   improve performance
    return this.rows.peek()[index]
};

/**
 * 根据rowid取row对象
 * @param rowid
 * @returns {*}
 */
DataTable.fn.getRowByRowId = function (rowid) {
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId == rowid)
            return rows[i]
    }
    return null
}

/**
 * 取行索引
 * @param row
 * @returns {*}
 */
DataTable.fn.getRowIndex = function (row){
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].rowId === row.rowId)
            return i;
    }
    return -1;
};

DataTable.fn.getRowsByField = function(field,value){
    var rows = this.rows.peek();
    var returnRows = new Array();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].getValue(field) === value)
            returnRows.push(rows[i]);
    }
    return returnRows;
}

DataTable.fn.getRowByField = function(field,value){
    var rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i].getValue(field) === value)
            return rows[i]
    }
    return null;
}

DataTable.fn.getAllRows = function () {
    return this.rows.peek();
}

DataTable.fn.getAllPageRows = function () {
    var datas = [], rows;
    for (var i = 0; i < this.totalPages(); i++) {
        rows = [];
        if (i == this.pageIndex()) {
            rows = this.getData();
        } else {
            var page = this.cachedPages[i];
            if (page) {
                rows = page.getData();
            }
        }
        for (var j = 0; j < rows.length; j++) {
            datas.push(rows[j]);
        }
    }
    return datas;
}

/**
 * 获取变动的数据(新增、修改)
 */
DataTable.fn.getChangedDatas = function (withEmptyRow) {
    var datas = [], rows = this.rows();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            datas.push(rows[i].getData())
        }
        else if (withEmptyRow == true) {
            datas.push(rows[i].getEmptyData())
        }
    }
    return datas
};

/**
 * 取改变的行
 */
DataTable.fn.getChangedRows = function(){
    var changedRows = [], rows = this.rows.peek();
    for (var i = 0, count = rows.length; i < count; i++) {
        if (rows[i] && rows[i].status != Row.STATUS.NORMAL) {
            changedRows.push(rows[i])
        }
    }
    return changedRows
}

DataTable.fn._formatToIndicesArray = function (indices) {
    if (typeof indices == 'string' || typeof indices == 'number') {
        indices = [indices]
    } else if (indices instanceof Row) {
        indices = this.getIndexByRowId(indices.rowId)
    } else if (u.isArray(indices) && indices.length > 0 && indices[0] instanceof Row) {
        for (var i = 0; i < indices.length; i++) {
            indices[i] = this.getIndexByRowId(indices[i].rowId)
        }
    }
    return indices;
};


/**
 * row :   {data:{}}
 * @constructor
 */
var Page = function (options) {
    this.focus = options['focus'] || null;
    this.selectedIndices = options['selectedIndices'] || null;
    this.rows = options['rows'] || []
    this.parent = options['parent'] || null;
}

Page.fn = Page.prototype

Page.fn.getData = function () {
    var datas = [], row, meta;
    meta = this.parent.getMeta()
    for (var i = 0; i < this.rows.length; i++) {
        row = this.rows[i];
        datas.push({'id': row.rowId, 'status': row.status, data: row.data});
    }
    return datas
}

Page.fn.getSelectDatas = function () {
    var datas = [], row;
    for (var i = 0; i < this.rows.length; i++) {
        row = this.rows[i];
        datas.push({'id': row.rowId, 'status': row.status, data: row.data});
    }
    for (var i = 0; i < this.selectedIndices.length; i++) {
        row = this.rows[this.selectedIndices[i]];
        datas.push({'id': row.rowId, 'status': row.status, data: row.data});
    }
    return datas
}

Page.fn.getRowByRowId = function (rowid) {
    for (var i = 0, count = this.rows.length; i < count; i++) {
        if (this.rows.rowId == rowid)
            return this.rows[i]
    }
    return null
}

Page.fn.removeRowByRowId = function (rowid) {
    for (var i = 0, count = this.rows.length; i < count; i++) {
        if (this.rows.rowId == rowid)
            this.rows.splice(i, 1);
    }
}

Page.fn.getSelectRows = function () {
    var rows = [];
    for (var i = 0; i < this.selectedIndices.length; i++) {
        rows.push(this.rows[this.selectedIndices[i]])
    }
    return rows
}

Page.fn.getRowByRowId = function (rowid) {
    for (var i = 0, count = this.rows.length; i < count; i++) {
        if (this.rows[i].rowId == rowid)
            return this.rows[i]
    }
    return null
}

Page.fn.setRowValue = function (rowIndex, fieldName, value) {
    var row = this.rows[rowIndex]
    if (row) {
        row.data[fieldName]['value'] = value
        if (row.status != Row.STATUS.NEW)
            row.status = Row.STATUS.UPDATE
    }
}

Page.fn.getRowValue = function (rowIndex, fieldName) {
    var row = this.rows[rowIndex]
    if (row) {
        return row.data[fieldName]['value']
    }
    return null
}

Page.fn.setRowMeta = function (rowIndex, fieldName, metaName, value) {
    var row = this.rows[rowIndex]
    if (row) {
        var meta = row[fieldName].meta
        if (!meta)
            meta = row[fieldName].meta = {}
        meta[metaName] = value
        if (row.status != Row.STATUS.NEW)
            row.status = Row.STATUS.UPDATE
    }
}

Page.fn.getRowMeta = function (rowIndex, fieldName, metaName) {
    var row = this.rows[rowIndex]
    if (row) {
        var meta = row[fieldName].meta
        if (!meta)
            return null
        else
            return meta[metaName]
    }
    return null
}


Page.fn.updateRow = function (originRow, newRow) {
    originRow.status = originRow.status
    //this.rowId = data.rowId
    if (!newRow.data) return;
    for (var key in newRow.data) {
        if (originRow.data[key]) {
            var valueObj = newRow.data[key]
            if (typeof valueObj == 'string' || typeof valueObj == 'number' || valueObj === null)
                originRow.data[key]['value'] = valueObj
            //this.setValue(key, this.formatValue(key, valueObj))
            else {
//					this.setValue(key, valueObj.value)

                if (valueObj.error) {
                    u.showMessageDialog({title: "警告", msg: valueObj.error, backdrop: true});
                } else {
                    //this.setValue(key, this.formatValue(key, valueObj.value), null)
                    originRow.data[key]['value'] = valueObj.value
                    for (var k in valueObj.meta) {
                        originRow.data[key]['meta'] = originRow.data[key]['meta'] || {}
                        originRow.data[key]['meta'][k] = valueObj.meta[k]
                    }
                }
            }
        }
    }
}


/**===========================================================================================================
 *
 * 行模型
 *
 * {id:'xxx', parent:dataTable1}
 *
 * data:{value:'v1',meta:{}}
 *
 * ===========================================================================================================
 */
var Row = function (options) {
    var self = this;
    this.rowId = options['id'] || Row.getRandomRowId()
    this.status = Row.STATUS.NEW
    //this.selected = ko.observable(false);
    //this.selected.subscribe(function(value){
    //    if (value === true){
    //        self.parent.addRowSelect(self);
    //    }else{
    //        self.parent.setRowUnSelect(self);
    //    }
    //
    //})
    this.parent = options['parent']
    this.initValue = null
    this.data = {}
    this.metaChange = {}//ko.observable(1)
    this.valueChange = {};
    this.currentRowChange = ko.observable(1);
    this.selected = ko.pureComputed({
        read: function () {
            var index = this.parent.getRowIndex(this);
            var selectindices = this.parent.getSelectedIndices();
            return selectindices.indexOf(index) != -1;
        },
        owner: this

    })
    this.focused = ko.pureComputed({
        read: function () {
            var index = this.parent.getRowIndex(this);
            var focusIndex = this.parent.getFocusIndex()
            return focusIndex == index;
        },
        owner: this

    })
    this.init()
}

Row.STATUS = {
    NORMAL: 'nrm',
    UPDATE: 'upd',
    NEW: 'new',
    DELETE: 'del',
    FALSE_DELETE: 'fdel'
}

Row.fn = Row.prototype = new Events()

/**
 * Row初始化方法
 * @private
 */
Row.fn.init = function () {
    var meta = this.parent.meta;

    for (var key in meta) {
        var targetData;
        if (key.indexOf('.') > 0){
            var keys = key.split('.');
            targetData =  this.data[keys[0]] = this.data[keys[0]] || {};
            for(var i = 1; i< keys.length; i++){
                targetData[keys[i]] = targetData[keys[i]] || {};
                targetData = targetData[keys[i]];
            }
        }else{
            this.data[key] = this.data[key] || {}
            targetData = this.data[key];
        }
        targetData.value = null;
        //this.data[key] = {}
        //处理子表
        if (meta[key]['type'] && meta[key]['type'] === 'child'){
            targetData.isChild = true;
            //ns 是多级数据时的空间名： 最顶层的dataTable没有ns。  f1.f2.f3
            var ns = this.parent.ns === '' ? key : this.parent.ns + '.' + key
            targetData.value = new u.DataTable({root:this.parent.root,ns:ns,meta:meta[key]['meta']});
        }
        //添加默认值
        else if (meta[key]['default']) {
            var defaults = meta[key]['default']
            if (typeof defaults === 'object'){
                for (var k in defaults) {
                    if (k == 'value'){
                        if (typeof defaults[k] === 'function')
                            targetData.value = this.formatValue(key,defaults[k]());
                        else
                            targetData.value = this.formatValue(key,defaults[k]);
                    }
                    else {
                        targetData.meta = targetData.meta || {}
                        targetData.meta[k] = defaults[k]
                    }
                }
            }else{
                if (typeof defaults === 'function')
                    targetData.value = this.formatValue(key, defaults());
                else
                    targetData.value = this.formatValue(key,defaults);
            }
        }
    }
}

Row.fn.toggleSelect = function(type){
    var index = this.parent.getRowIndex(this);
    var selectindices = this.parent.getSelectedIndices();
    if (selectindices.indexOf(index) != -1){
        this.parent.setRowUnSelect(index);
    }else{
        if (type === 'single')
            this.parent.setRowSelect(index);
        else
            this.parent.addRowSelect(index);
    }
};

/**
 * 行点击事件
 */
Row.fn.singleSelect = function(){
    this.toggleSelect('single');
};

Row.fn.multiSelect = function(){
    this.toggleSelect('multi');
};

Row.fn.ref = function (fieldName) {
    this.parent.createField(fieldName);
    if (!this.valueChange[fieldName])
        this.valueChange[fieldName] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.valueChange[fieldName]();
            this.currentRowChange();
            return this.getChildValue(fieldName)
            //var value = this._getField(fieldName)['value'];
            //return value;
        },
        write: function (value) {
            this.setChildValue(fieldName, value);
            //this.setValue(fieldName, value)
        },
        owner: this
    })
}


/**
 * 绑定子表行
 * @param fieldName
 */
//Row.fn.refChildRows = function(fieldName){
//    if (!this.valueChange[fieldName])
//        this.valueChange[fieldName] = ko.observable(1);
//    return ko.pureComputed({
//        read: function () {
//            this.valueChange();
//            this.currentRowChange();
//            var childDt = this._getField(fieldName)['value'];
//            if (!(childDt instanceof u.DataTable)){
//                throw new Error("refChildRows('" + fieldName + "') error, field is not a child datatable!");
//            }
//            return childDt.rows.peek();
//        },
//        //write: function (value) {
//        //    this.setValue(fieldName, value)
//        //},
//        owner: this
//    })
//}

Row.fn.refMeta = function (fieldName, key) {
    if (!this.metaChange[fieldName + '.' + key])
        this.metaChange[fieldName + '.' + key] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.metaChange[fieldName + '.' + key]()
            return this.getMeta(fieldName, key)
        },
        write: function (value) {
            this.setMeta(fieldName, key, value)
        },
        owner: this
    })
}
Row.fn.refCombo = function (fieldName, datasource) {
    if (!this.valueChange[fieldName])
        this.valueChange[fieldName] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.valueChange[fieldName]();
            this.currentRowChange();
            var ds = u.getJSObject(this.parent.parent, datasource)
            if (this._getField(fieldName)['value'] === undefined || this._getField(fieldName)['value'] === "") return "";
            var v = this._getField(fieldName)['value'];
            var valArr = typeof v === 'string' ? v.split(',') : [v];

            var nameArr = []

            for (var i = 0, length = ds.length; i < length; i++) {
                for (var j = 0; j < valArr.length; j++) {
                    var value = ds[i]['pk'] || ds[i]['value'] || '';
                    if (value == valArr[j]) {
                        nameArr.push(ds[i].name)
                    }
                }
            }

            return nameArr.toString();
        },
        write: function (value) {

            this.setValue(fieldName, value)
        },
        owner: this
    })
}
Row.fn.refDate = function (fieldName, format) {
    if (!this.valueChange[fieldName])
        this.valueChange[fieldName] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.valueChange[fieldName]();
            this.currentRowChange();
            if (!this._getField(fieldName)['value']) return "";
            var valArr = this._getField(fieldName)['value']
            if (!valArr) return "";
            valArr = u.date.format(valArr, format); //moment(valArr).format(format)
            return valArr;
        },
        write: function (value) {

            this.setValue(fieldName, value)
        },
        owner: this
    })
}

// 刘云燕提交
Row.fn.refEnum = function (fieldName) {
    this.parent.createField(fieldName);
    if (!this.valueChange[fieldName])
        this.valueChange[fieldName] = ko.observable(1);
    return ko.pureComputed({
        read: function () {
            this.valueChange[fieldName]();
            this.currentRowChange();
            if (!this._getField(fieldName)['value']) return "";
            var valArr = this._getField(fieldName)['value']
            if (!valArr) return "";
            if(valArr == "N")
                valArr = "否";
            else if(valArr == "Y")
                valArr = "是";
            return valArr;
        },
        write: function (value) {

            this.setValue(fieldName, value)
        },
        owner: this
    })
}

/**
 *获取row中某一列的值
 */
Row.fn.getValue = function (fieldName) {
    return this._getField(fieldName)['value']
}

/**
 * 获取子表值 ，如果fieldName对应了一个子表，返回该子表的行数组
 * @param fieldName
 */
Row.fn.getChildValue = function(fieldName){
    var nameArr = fieldName.split('.');
    var _name = nameArr[0];
    for (var i = 0, count = nameArr.length; i<count; i++){
        var _value = this.getValue(_name);
        //最后一级
        if (i == count -1){
            if (_value instanceof u.DataTable){
                return _value.rows.peek();
            }else{
                return _value;
            }
        }else{
            if (_value instanceof u.DataTable){
                _value = _value.getCurrentRow();
                if (!_value)
                    return '';
                else
                    return _value.getChildValue(fieldName.replace(_name + '.', ''))
            }else{
                _name = _name + '.' + nameArr[i+1];
            }

        }
    }
    return '';
};

Row.fn.setChildValue = function(fieldName, value){
    var nameArr = fieldName.split('.');
    var _name = nameArr[0];
    var _field = this.data[_name];//_field保存当前_name对应的数据
    for (var i = 0, count = nameArr.length; i<count; i++){
        // var _field = this.data[_name];
        // if (!_field)
        //     throw new Error('field:' + fieldName + ' not exist in dataTable:' + this.root.id + '!');
        //最后一级
        if (i == count -1){
            if (_field['value'] instanceof u.DataTable){
                //暂不处理
            }else{
                //_field['value'] = value;
                this.setValue(fieldName, value);
            }
        }else{
			if (_field && _field['value'] instanceof u.DataTable){
                var row = _field['value'].getCurrentRow();
                if (row)
                    row.setChildValue(fieldName.replace(_name + '.', ''), value)
            }else{
            	_name = nameArr[i + 1];
            	_field = _field[_name];//多层嵌套时_field取子项对应的数据
                // _name = _name + '.' + nameArr[i];
                
            }

        }
    }
};

Row.fn.setChildSimpleDataByRowId = function(rowId, data){
    var rowIdArr = rowId.split('.');
    var rowIdLength = rowIdArr.length;
    if(rowIdLength > 1){
        var _childField = rowIdArr[0]; //子表字段
        var _childObj = this.data[_childField]; // 子表字段存放的obj
        if (_childObj && _childObj['value'] instanceof u.DataTable){
            var rowId = rowIdArr[1];
            var row = null;
            if(rowId)
                row = _childObj['value'].getRowByRowId(rowId);
            if (row){
                if(rowIdArr.length == 2){
                    row.setSimpleData(data);
                }else{
                    row.setChildSimpleDataByRowId(fieldName.replace(_childField + '.' + rowId + '.', ''),data)
                }
            }
        }
    }
}


var eq = function (a, b) {
    if ((a === null || a === undefined || a === '') && (b === null || b === undefined || b === '')) return true;
    if (u.isNumber(a) && u.isNumber(b) && parseFloat(a) == parseFloat(b)) return true;
    if (a + '' == b + '')  return true;
    return false;
}

Row.fn._triggerChange = function(fieldName, oldValue, ctx){
    this._getField(fieldName).changed = true
    if (this.status != Row.STATUS.NEW)
        this.status = Row.STATUS.UPDATE
    if (this.valueChange[fieldName])
        this.valueChange[fieldName](-this.valueChange[fieldName]())
    if (this.parent.getCurrentRow() == this && this.parent.valueChange[fieldName]){
        this.parent.valueChange[fieldName](-this.parent.valueChange[fieldName]());
    }
    if (this.parent.ns){
        var fName = this.parent.ns + '.' + fieldName;
        if (this.parent.root.valueChange[fName])
            this.parent.root.valueChange[fName](-this.parent.root.valueChange[fName]());
    }

    var event = {
        eventType: 'dataTableEvent',
        dataTable: this.parent.id,
        rowId: this.rowId,
        field: fieldName,
        oldValue: oldValue,
        newValue: this.getValue(fieldName),
        ctx: ctx || ""
    }
    this.parent.trigger(DataTable.ON_VALUE_CHANGE, event);
    this.parent.trigger(fieldName + "." + DataTable.ON_VALUE_CHANGE, event);
    if (this == this.parent.getCurrentRow())
        this.parent.trigger(fieldName + "." + DataTable.ON_CURRENT_VALUE_CHANGE, event);

};

/**
 *设置row中某一列的值
 */
Row.fn.setValue = function (fieldName, value, ctx, options) {
    if (arguments.length === 1){
        value = fieldName;
        fieldName = '$data';
    }
    var oldValue = this.getValue(fieldName)
    if(typeof oldValue == 'undefined' || oldValue === null)
        oldValue = ''
    if (eq(oldValue, value)) return;
    this._getField(fieldName)['value'] = value;
    this._triggerChange(fieldName, oldValue, ctx);
    // this._getField(fieldName).changed = true
    // if (this.status != Row.STATUS.NEW)
    //     this.status = Row.STATUS.UPDATE
    // if (this.valueChange[fieldName])
    //     this.valueChange[fieldName](-this.valueChange[fieldName]())
    // if (this.parent.getCurrentRow() == this && this.parent.valueChange[fieldName])
    //     this.parent.valueChange[fieldName](-this.parent.valueChange[fieldName]());
    // if (this.parent.ns){
    //     var fName = this.parent.ns + '.' + fieldName;
    //     if (this.parent.root.valueChange[fName])
    //         this.parent.root.valueChange[fName](-this.parent.root.valueChange[fName]());
    // }

    // var event = {
    //     eventType: 'dataTableEvent',
    //     dataTable: this.parent.id,
    //     rowId: this.rowId,
    //     field: fieldName,
    //     oldValue: oldValue,
    //     newValue: value,
    //     ctx: ctx || ""
    // }
    // this.parent.trigger(DataTable.ON_VALUE_CHANGE, event);
    // this.parent.trigger(fieldName + "." + DataTable.ON_VALUE_CHANGE, event);
    // if (this == this.parent.getCurrentRow())
    //     this.parent.trigger(fieldName + "." + DataTable.ON_CURRENT_VALUE_CHANGE, event);
}

/**
 *获取row中某一列的属性
 */
Row.fn.getMeta = function (fieldName, key, fetchParent) {
    if (arguments.length == 0) {
        var mt = {}
        for (var k in this.data) {
            mt[k] = this.data[k].meta ? this.data[k].meta : {}
        }
        return mt
    }
    var meta = this._getField(fieldName).meta
    if (meta && meta[key] !== undefined && meta[key] !== null && meta[key] !== '')
        return meta[key]
    else if (typeof fetchParent == 'undefined' || fetchParent != false)
        return this.parent.getMeta(fieldName, key)
    return undefined;
}

/**
 *设置row中某一列的属性
 */
Row.fn.setMeta = function (fieldName, key, value) {
    var meta = this._getField(fieldName).meta
    if (!meta)
        meta = this._getField(fieldName).meta = {}
    var oldValue = meta[key]
    if (eq(oldValue, value)) return;
    meta[key] = value
    //this.metaChange(- this.metaChange())
    if (this.metaChange[fieldName + '.' + key]) {
        this.metaChange[fieldName + '.' + key](-this.metaChange[fieldName + '.' + key]());
    }

    if (key == 'enable')
        this.parent.enableChange(-this.parent.enableChange())
    if (this.parent.getCurrentRow() == this) {
        if (this.parent.metaChange[fieldName + '.' + key])
            this.parent.metaChange[fieldName + '.' + key](-this.parent.metaChange[fieldName + '.' + key]());
        this.parent.trigger(fieldName + '.' + key + '.' + DataTable.ON_CURRENT_META_CHANGE, {
            eventType: 'dataTableEvent',
            dataTable: this.parent.id,
            oldValue: oldValue,
            newValue: value
        });
        //this.parent.metaChange(- this.parent.metaChange())
    }
    this.parent.trigger(DataTable.ON_ROW_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.parent.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value,
        row: this
    });

    this.parent.trigger(fieldName + '.' + key + '.' + DataTable.ON_ROW_META_CHANGE, {
        eventType: 'dataTableEvent',
        dataTable: this.parent.id,
        field: fieldName,
        meta: key,
        oldValue: oldValue,
        newValue: value,
        row: this
    });
}

/**
 * [_setData description]
 * @param {[type]} sourceData 
 * @param {[type]} targetData 
 * @param {[type]} subscribe  
 * @param {[type]} parentKey  [父项key，数据项为数组时获取meta值用]
 */
Row.fn._setData = function(sourceData, targetData, subscribe, parentKey){
    for (var key in sourceData) {
    	var _parentKey = parentKey || null;
        //if (targetData[key]) {
        targetData[key] = targetData[key] || {};
        var valueObj = sourceData[key]
        if (typeof valueObj != 'object')
            this.parent.createField(key);
        //if (typeof this.parent.meta[key] === 'undefined') continue;
        if (valueObj == null ||  typeof valueObj != 'object'){
            targetData[key]['value'] = this.formatValue(key, valueObj)
            if (subscribe === true && (oldValue !== targetData[key]['value'])){
                    this._triggerChange(key, oldValue);
                }
        }
        else {
            if (valueObj.error) {
                u.showMessageDialog({title: "警告", msg: valueObj.error, backdrop: true});
            } else if (valueObj.value || valueObj.value === null  || valueObj.meta || valueObj.value === '' || valueObj.value === '0' || valueObj.value === 0){
                var oldValue = targetData[key]['value'];
                targetData[key]['value'] = this.formatValue(key, valueObj.value)
                if (subscribe === true && (oldValue !== targetData[key]['value'])){
                    this._triggerChange(key, oldValue);
                }
                for (var k in valueObj.meta) {
                    this.setMeta(key, k, valueObj.meta[k])
                }
            }else if (u.isArray(valueObj)){
                targetData[key].isChild = true;
                //ns 是多级数据时的空间名： 最顶层的dataTable没有ns。  f1.f2.f3
                var _key = _parentKey == null ? key : _parentKey + '.' + key;
                var ns = this.parent.ns === '' ? key : this.parent.ns + '.' + _key
              if(this.parent.meta[_key]){
            	var meta = this.parent.meta[_key]['meta']
                targetData[key].value = new u.DataTable({root:this.parent.root,ns:ns,meta:meta});
                targetData[key].value.setSimpleData(valueObj);
              }
            }else{
            	_parentKey = _parentKey == null ? key : _parentKey + '.' + key;
                this._setData(valueObj, targetData[key], null, _parentKey);
            }
        }
        //}
    }

}

/**
 *设置Row数据
 *@subscribe 是否触发监听  
 */
Row.fn.setData = function (data, subscribe) {
    this.status = data.status
    var sourceData = data.data,
        targetData = this.data;
    if (this.parent.root.strict != true){
        this._setData(sourceData, targetData,subscribe);
        return;
    }

    // strict 为true 时 ，定义dataTable的时候必须定义所有字段信息才能设置数据。
    var meta = this.parent.meta;
    for (var key in meta){
        var oldValue = newValue = null;
        //子数据
        if (meta[key]['type'] && meta[key]['type'] === 'child'){
            targetData[key].isChild = true;
            //ns 是多级数据时的空间名： 最顶层的dataTable没有ns。  f1.f2.f3
            var ns = this.parent.ns === '' ? key : this.parent.ns + '.' + key
            var meta = this.parent.meta[key]['meta']
            targetData[key].value = new u.DataTable({root:this.parent.root,ns:ns,meta:meta});
            if (typeof sourceData[key] === 'object')
                targetData[key].value.setSimpleData(sourceData[key]);
        }
        //存在多级关系
        else if (key.indexOf('.') != -1){
            var keys = key.split('.');
            var _fieldValue = sourceData;
            var _targetField = targetData;
            for(var i = 0; i< keys.length; i++){
                _fieldValue = _fieldValue || {};
                _fieldValue = _fieldValue[keys[i]];
                _targetField = _targetField[keys[i]];
            }
            oldValue = _targetField['value'];
            _targetField['value'] = this.formatValue(key, _fieldValue)
            newValue = _targetField['value'];
        }
        // 通过 setSimpleData 设置的数据
        else if (sourceData[key] == null ||  typeof sourceData[key] != 'object'){
            oldValue = targetData[key]['value'];
            targetData[key]['value'] = this.formatValue(key, sourceData[key])
            newValue = targetData[key]['value'];
        }
        else{
            var valueObj = sourceData[key];
            if (valueObj.error) {
                u.showMessageDialog({title: "警告", msg: valueObj.error, backdrop: true});
            } else if (valueObj.value || valueObj.value === null || valueObj.meta){
                oldValue = targetData[key]['value'];
                targetData[key]['value'] = this.formatValue(key, valueObj.value)
                newValue = targetData[key]['value'];
                for (var k in valueObj.meta) {
                    this.setMeta(key, k, valueObj.meta[k])
                }
            }
        }
        if (subscribe === true && (oldValue !== newValue)){
            this._triggerChange(key, oldValue);
        }

    }
};



Row.fn.setSimpleData = function(data){
    var allData = {};
    allData.data = data;
    allData.status = 'nrm';
    this.setData(allData, true);
    this.currentRowChange(-this.currentRowChange());
}


/**
 * 格式化数据值
 * @private
 * @param {Object} field
 * @param {Object} value
 */
Row.fn.formatValue = function (field, value) {
    var type = this.parent.getMeta(field, 'type')
    if (!type) return value
    if (type == 'date' || type == 'datetime') {
        return _formatDate(value)
    }
    return value
}

Row.fn.updateRow = function (row) {
    this.setData(row)
}

/**
 * @private
 * 提交数据到后台
 */
/**
 * @private
 * 提交数据到后台
 */
Row.fn.getData = function () {
    var data = ko.toJS(this.data)
    var meta = this.parent.getMeta()
    for (var key in meta) {
        if (meta[key] && meta[key].type) {
            if (meta[key].type == 'date' || meta[key].type == 'datetime') {
                if(key.indexOf('.')>0){//大于0说明是多级json
                    var keys=key.split('.');
                    var _keyValue=data;
                    for(var i=0,count=keys.length;i<count;i++){
                        _keyValue=_keyValue[keys[i]];
                    }
                    _keyValue.value =_dateToUTCString(_keyValue.value);
                  
                }else{
                    data[key].value = _dateToUTCString(data[key].value)
                }
            } else if(meta[key].type == 'child') {
                var chiddt = this.getValue(key),
                    rs = chiddt.rows(),
                    cds = [];
                for(var i=0;i < rs.length;i++) {
                    cds.push(rs[i].getData());
                }
                data[key].value = JSON.stringify(cds);
            }
        }
    }
    return {'id': this.rowId, 'status': this.status, data: data}
}

Row.fn.getEmptyData = function () {
    return {'id': this.rowId, 'status': this.status, data: {}}
};

Row.fn._getSimpleData = function(data){
    var _data = {};
    var meta = this.parent.getMeta() || {};
    for(var key in data){
        if (key === 'meta' || u.isEmptyObject(data[key])){
            continue;
        }else if (data[key].isChild) {
            _data[key] = data[key].value?data[key].value.getSimpleData():{};
        }else if (key === '$data'){  //处理一维数组： [1,2,3]
            _data = data[key].value
        }else if (typeof data[key].value !== 'undefined'){
           //如果类型为boolean，无论值为false、true都应该等于他本身
            if(meta[key] && meta[key].type==='boolean'){
                _data[key] = data[key].value?true:false;//默认值可能是null
            }else{
                _data[key] = data[key].value;
            }
            if (meta[key] && meta[key].type) {
                if (meta[key].type == 'date' || meta[key].type == 'datetime') {

                    _data[key] = _dateToUTCString(data[key].value)
                }
            }
        }else if(typeof data[key].value !== 'undefined'){
            _data[key] = undefined;
        }else{
            _data[key] = this._getSimpleData(data[key])
        }
    }
    return _data;

}

Row.fn.getSimpleData = function(options){
    options = options || {}
    var fields = options['fields'] || null;
    var meta = this.parent.getMeta();
    var data = this.data;
    var _data = this._getSimpleData(data); //{};
    var _fieldsData = {};
    if (fields){
        for (var key in _data){
            if (fields.indexOf(key) != -1){
                _fieldsData[key] = _data[key];
            }
        }
        return _fieldsData;
    }
    // for (var key in meta) {
    //    if (fields && fields.indexOf(key) == -1)
    //        continue;
    //    if (meta[key] && meta[key].type) {
    //        if (meta[key].type == 'date' || meta[key].type == 'datetime') {
    //            data[key].value = _dateToUTCString(data[key].value)
    //        }
    //    }
    //    _data[key] = data[key].value;
    // }
    return _data;

};

Row.fn._findField = function(fieldName){
    var rat = this.data[fieldName];
    if (!rat) {
        var fnames = fieldName.split('.'); //多级field
        if (fnames.length > 1){
            var tempField = this.data
            for (var i = 0; i < fnames.length; i++){
                tempField = tempField[fnames[i]];
                if (!tempField){
                    break;
                }
            }
            rat = tempField;
        }
    }
    return rat || null;

}

Row.fn._getField = function (fieldName) {
    var rat = this._findField(fieldName);
    if (!rat) {
        var msg = 'field:' + fieldName + ' not exist in dataTable:' + this.parent.root.id + '!'
        console.error(msg);
        throw new Error(msg);
    }
    return rat;
}


/*
 * 生成随机行id
 * @private
 */
Row.getRandomRowId = function () {
    var _id = setTimeout(function () {})
    return  _id + '';
};

var _formatDate = function (value) {
    if (!value) return value
    var date = new Date();
    date.setTime(value);
    //如果不能转为Date 直接返回原值
    if (isNaN(date)){
        return value
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if (parseInt(month) < 10) month = "0" + month;
    var day = date.getDate();
    if (parseInt(day) < 10) day = "0" + day;
    var hours = date.getHours();
    if (parseInt(hours) < 10) hours = "0" + hours;
    var minutes = date.getMinutes();
    if (parseInt(minutes) < 10) minutes = "0" + minutes;
    var seconds = date.getSeconds();
    if (parseInt(seconds) < 10) seconds = "0" + seconds;
    var mill = date.getMilliseconds();
    var formatString = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds ; //+ "." + mill;
    return formatString;
}

var _dateToUTCString = function (date) {
    if (!date) return ''
    if(typeof date==='number')
        return date
    if (date.indexOf("-") > -1)
        date = date.replace(/\-/g, "/");
    var utcString = Date.parse(date);
    if (isNaN(utcString)) return "";
    return utcString;
}


u.Row = Row;
u.DataTable = DataTable;

/**
 * Created by dingrf on 2016/4/5.
 */

u.EnableMixin = {
    init: function(){
        var self = this;
        //处理只读
        if (this.options['enable'] && (this.options['enable'] == 'false' || this.options['enable'] == false)){
            this.setEnable(false);
        }else {
            this.dataModel.refEnable(this.field).subscribe(function (value) {
                self.setEnable(value);
            });
            this.setEnable(this.dataModel.isEnable(this.field));
        }
    },
    methods:{
        setEnable: function(enable){
                if (enable === true || enable === 'true') {
                    this.enable = true;
                    this.element.removeAttribute('readonly');
                    u.removeClass(this.element.parentNode,'disablecover');
                } else if (enable === false || enable === 'false') {
                    this.enable = false;
                    this.element.setAttribute('readonly', 'readonly');
                    u.addClass(this.element.parentNode,'disablecover');
                }
        }
    }
}
/**
 * Created by dingrf on 2016/4/6.
 */

u.RequiredMixin = {
    init: function(){
        var self = this;
        this.required = this.getOption('required');
        this.dataModel.refRowMeta(this.field, "required").subscribe(function(value) {
            self.setRequired(value);
        });
        //this.setRequired(this.dataModel.getMeta(this.field, "required"));

    },
    methods:{
        setRequired: function (required) {
            if (required === true || required === 'true') {
                this.required = true;
            } else if (required === false || required === 'false') {
                this.required = false;
            }
        },
    }
}
/**
 * Created by dingrf on 2016/4/6.
 */

u.ValidateMixin = {
    init: function(){
        this.placement = this.getOption('placement');
        this.tipId = this.getOption('tipId');
        this.errorMsg = this.getOption('errorMsg');
        this.nullMsg = this.getOption('nullMsg');
        this.regExp = this.getOption('regExp');
        this.successId=this.getOption('successId');
        this.hasSuccess=this.getOption('hasSuccess');
        this.notipFlag=this.getOption('notipFlag');

        // if (this.validType) {
            this.validate = new u.Validate({
                el: this.element,
                single: true,
                validMode: 'manually',
                required: this.required,
                validType: this.validType,
                placement: this.placement,
                tipId: this.tipId,
                successId:this.successId,
                notipFlag:this.notipFlag,
                hasSuccess:this.hasSuccess,
                errorMsg: this.errorMsg,
                nullMsg: this.nullMsg,
                maxLength: this.maxLength,
                minLength: this.minLength,
                max: this.max,
                min: this.min,
                maxNotEq: this.maxNotEq,
                minNotEq: this.minNotEq,
                reg: this.regExp
            });
        // };

    },
    methods:{
        /**
         *校验
         */
        doValidate: function (options) {
            if (this.validate) {
                if (options && options['trueValue'] === true) {
                    options['showMsg'] = options['showMsg'] || false;
                    var result = this.validate.check({pValue: this.getValue(), showMsg: options['showMsg']});
                }
                else{
                    var result = this.validate.check();
                }
                result.comp = this;
                return result;
            } else {
                return {passed:true,comp:this}
            }
        },
        /**
         * 是否需要清除数据
         */
        _needClean: function () {
            if (this.validate)
                return this.validate._needClean();
            else return false
        }
    }
}
/**
 * Created by dingrf on 2016/4/6.
 */


u.ValueMixin = {
    init: function(){
        var self = this;
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        });
        this.modelValueChange(this.dataModel.getValue(this.field));

    },
    methods:{
        /**
         * 模型数据改变
         * @param {Object} value
         */
        modelValueChange: function (value) {
            if (this.slice) return;
            if (value === null || typeof value == "undefined")
                value = "";
            this.trueValue = this.formater ? this.formater.format(value) : value;
            //this.element.trueValue = this.trueValue;
            this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
            this.setShowValue(this.showValue);

            //this.trueValue = value;
            //this.showValue = value;
            //this.setShowValue(this.showValue);
        },

        ///**
        // * 设置模型值
        // * @param {Object} value
        // */
        //setModelValue: function (value) {
        //    if (!this.dataModel) return;
        //    this.dataModel.setValue(this.field, value)
        //},
        /**
         * 设置控件值
         * @param {Object} value
         */
        setValue: function (value) {
            this.trueValue = this.formater ? this.formater.format(value) : value;
            this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
            this.setShowValue(this.showValue);
            this.slice = true;
            this.dataModel.setValue(this.field, this.trueValue);
            this.slice = false;
        },
        /**
         * 取控件的值
         */
        getValue: function () {
            return this.trueValue;
        },
        setShowValue: function (showValue) {
            this.showValue = showValue;
            this.element.value = showValue;
            this.element.title = showValue;

        },
        getShowValue: function () {
            return this.showValue
        },
        setModelValue: function (value) {
            if (!this.dataModel) return
            this.dataModel.setValue(this.field, value)
        },
    }
}
/**
 * Created by dingrf on 2016/1/15.
 */

/**
 * adapter基类
 */

u.BaseAdapter = u.Class.create({
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        //组合mixin中的方法
        for(var i in this.mixins){
            var mixin = this.mixins[i];
            for (var key in mixin['methods']){
                if (!this[key]){
                    this[key] = mixin['methods'][key];
                }
            }
        }

        //this.comp = comp;
        this.element = options['el'];
        this.options = options['options'];
        this.viewModel = options['model'];
        this.dataModel = null;
        this.mixins = this.mixins || [];
        this.parseDataModel();
        this.init();
        //执行mixin中的初始化方法
        for(var i in this.mixins){
            var mixin = this.mixins[i];
            if (mixin['init'])
                mixin.init.call(this);
        }

    },
    parseDataModel: function () {
        if (!this.options || !this.options["data"]) return;
        this.field = this.options["field"];
        var dtId = this.options["data"];
        this.dataModel = u.getJSObject(this.viewModel, this.options["data"]);
        if (this.dataModel){
            var opt = {};
            if (this.options.type === 'u-date'){
                opt.type = 'date'
            }
            if (this.field)
                this.dataModel.createField(this.field, opt);
        }
    },
    getOption: function(key){
        return this.dataModel.getRowMeta(this.field, key) || this.options[key];
    },
    init: function(){

    }
});
u.IntegerAdapter = u.BaseAdapter.extend({
    mixins:[u.ValueMixin,u.EnableMixin, u.RequiredMixin, u.ValidateMixin],
    init: function () {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element){
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.validType = this.options['validType'] || 'integer';
        this.max = this.options['max'];
        this.min = this.options['min'];
        this.maxNotEq = this.options['maxNotEq'];
        this.minNotEq = this.options['minNotEq'];
        this.maxLength = this.options['maxLength'] ? options['maxLength'] : 25;
        this.minLength = this.options['mixLength'] ? options['mixLength'] : 0;
        if (this.dataModel) {
            this.min = this.dataModel.getMeta(this.field, "min") !== undefined ? this.dataModel.getMeta(this.field, "min") : this.min;
            this.max = this.dataModel.getMeta(this.field, "max") !== undefined ? this.dataModel.getMeta(this.field, "max") : this.max;
            this.minNotEq = this.dataModel.getMeta(this.field, "minNotEq") !== undefined ? this.dataModel.getMeta(this.field, "minNotEq") : this.minNotEq;
            this.maxNotEq = this.dataModel.getMeta(this.field, "maxNotEq") !== undefined ? this.dataModel.getMeta(this.field, "maxNotEq") : this.maxNotEq;
            this.minLength = u.isNumber(this.dataModel.getMeta(this.field, "minLength")) ? this.dataModel.getMeta(this.field, "minLength") : this.minLength;
            this.maxLength = u.isNumber(this.dataModel.getMeta(this.field, "maxLength")) ? this.dataModel.getMeta(this.field, "maxLength") : this.maxLength;
        }
        u.on(this.element, 'focus', function(){
            if(self.enable){
                self.setShowValue(self.getValue())
            }
        })

        u.on(this.element, 'blur',function(){
            if(self.enable){
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('')
                    } else {
                        self.element.value = self.getShowValue()
                    }
                }
                else
                    self.setValue(self.element.value)
            }
        });
    }
});
u.compMgr.addDataAdapter({
        adapter: u.IntegerAdapter,
        name: 'integer'
    });


u.FloatAdapter = u.BaseAdapter.extend({
    mixins:[u.ValueMixin,u.EnableMixin, u.RequiredMixin, u.ValidateMixin],
    init: function () {
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element){
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.maskerMeta = u.core.getMaskerMeta('float') || {};
        this.validType = 'float';
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.max = this.getOption('max') || "10000000000000000000";
        this.min = this.getOption('min') || "-10000000000000000000";
        this.maxNotEq = this.getOption('maxNotEq');
        this.minNotEq = this.getOption('minNotEq');

        //处理数据精度
        this.dataModel.refRowMeta(this.field, "precision").subscribe(function(precision){
            if(precision === undefined) return;
            self.setPrecision(precision)
        });
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new u.NumberMasker(this.maskerMeta);
        u.on(this.element, 'focus', function(){
            if(self.enable){
                self.onFocusin()
            }
        })

        u.on(this.element, 'blur',function(){
            if(self.enable){
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('')
                    } else {
                        self.element.value = self.getShowValue()
                    }
                }
                else
                    self.setValue(self.element.value)
            }
        });


    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function (precision) {
        if (this.maskerMeta.precision == precision) return;
        this.maskerMeta.precision = precision
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new u.NumberMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field)
            this.showValue = this.masker.format(this.formater.format(v)).value
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value
        }

        this.setShowValue(this.showValue)
    },
    onFocusin: function () {
        var v = this.dataModel.getCurrentRow().getValue(this.field), vstr = v + '', focusValue = v;
        if (u.isNumber(v) && u.isNumber(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1);
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v)
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v)
            }
        }
        focusValue = parseFloat(focusValue) || '';
        this.setShowValue(focusValue)
    },
    _needClean: function () {
        return true
    }
});

u.compMgr.addDataAdapter({
        adapter: u.FloatAdapter,
        name: 'float'
    });
/**
 * 货币控件
 */
u.CurrencyAdapter = u.FloatAdapter.extend({
    init: function () {
        var self = this;
        u.CurrencyAdapter.superclass.init.apply(this);

        this.maskerMeta = iweb.Core.getMaskerMeta('currency') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        this.maskerMeta.curSymbol = this.getOption('curSymbol') || this.maskerMeta.curSymbol;
        this.validType = 'float';
        this.dataModel.on(this.field + '.curSymbol.' + u.DataTable.ON_CURRENT_META_CHANGE, function (event) {
            self.setCurSymbol(event.newValue)
        });
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new CurrencyMasker(this.maskerMeta);
    },
    /**
     * 修改精度
     * @param {Integer} precision
     */
    setPrecision: function (precision) {
        if (this.maskerMeta.precision == precision) return
        this.maskerMeta.precision = precision
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new u.CurrencyMasker(this.maskerMeta);
        var currentRow = this.dataModel.getCurrentRow();
        if (currentRow) {
            var v = this.dataModel.getCurrentRow().getValue(this.field)
            this.showValue = this.masker.format(this.formater.format(v)).value
        } else {
            this.showValue = this.masker.format(this.formater.format(this.trueValue)).value
        }
        this.setShowValue(this.showValue)
    },
    /**
     * 修改币符
     * @param {String} curSymbol
     */
    setCurSymbol: function (curSymbol) {
        if (this.maskerMeta.curSymbol == curSymbol) return
        this.maskerMeta.curSymbol = curSymbol
        this.masker.formatMeta.curSymbol = this.maskerMeta.curSymbol
        this.element.trueValue = this.trueValue
        this.showValue = this.masker.format(this.trueValue).value
        this.setShowValue(this.showValue)

    },
    onFocusin: function (e) {
        var v = this.getValue(), vstr = v + '', focusValue = v
        if (u.isNumber(v) && u.isNumber(this.maskerMeta.precision)) {
            if (vstr.indexOf('.') >= 0) {
                var sub = vstr.substr(vstr.indexOf('.') + 1)
                if (sub.length < this.maskerMeta.precision || parseInt(sub.substr(this.maskerMeta.precision)) == 0) {
                    focusValue = this.formater.format(v)
                }
            } else if (this.maskerMeta.precision > 0) {
                focusValue = this.formater.format(v)
            }
        }
        this.setShowValue(focusValue)

    }
})

u.compMgr.addDataAdapter({
        adapter: u.CurrencyAdapter,
        name: 'currency'
    });


/**
 * 百分比控件
 */
u.PercentAdapter = u.FloatAdapter.extend({
    init: function () {
        u.PercentAdapter.superclass.init.apply(this);
        this.validType = 'float';
        this.maskerMeta = iweb.Core.getMaskerMeta('percent') || {};
        this.maskerMeta.precision = this.getOption('precision') || this.maskerMeta.precision;
        if (this.maskerMeta.precision){
            this.maskerMeta.precision = parseInt(this.maskerMeta.precision) + 2;
        }
        this.formater = new u.NumberFormater(this.maskerMeta.precision);
        this.masker = new PercentMasker(this.maskerMeta);
    }
});
u.compMgr.addDataAdapter(
    {
        adapter: u.PercentAdapter,
        name: 'percent'
    });



u.StringAdapter = u.BaseAdapter.extend({
    mixins:[u.ValueMixin,u.EnableMixin, u.RequiredMixin, u.ValidateMixin],
    init: function(){
        var self = this;
        this.element = this.element.nodeName === 'INPUT' ? this.element : this.element.querySelector('input');
        if (!this.element){
            throw new Error('not found INPUT element, u-meta:' + JSON.stringify(this.options));
        };
        this.validType = this.options['validType'] || 'string';
        this.minLength = this.getOption('minLength');
        this.maxLength = this.getOption('maxLength');

        u.on(this.element, 'focus', function(){
            if(self.enable){
                self.setShowValue(self.getValue())
            }
        })

        u.on(this.element, 'keydown',function(e){
            var keyCode = e.keyCode;
            if( e.keyCode == 13){// 回车
                this.blur();
            }
        });

        u.on(this.element, 'blur',function(e){
            if(self.enable){
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('')
                    } else {
                        self.element.value = self.getShowValue()
                    }
                }
                else
                    self.setValue(self.element.value)
            }
        });
    }
});
u.compMgr.addDataAdapter({
        adapter: u.StringAdapter,
        name: 'string'
    });

	

u.TextAreaAdapter = u.BaseAdapter.extend({
    mixins:[u.ValueMixin,u.EnableMixin, u.RequiredMixin, u.ValidateMixin],
    init: function () {
        var self = this;
        this.element = this.element.nodeName === 'TEXTAREA' ? this.element : this.element.querySelector('textarea');
        if (!this.element){
            throw new Error('not found TEXTAREA element, u-meta:' + JSON.stringify(this.options));
        };

        u.on(this.element, 'focus', function () {
            self.setShowValue(self.getValue())
        });
        u.on(this.element, 'blur', function () {
            self.setValue(self.element.value)
        })
    }
});

u.compMgr.addDataAdapter({
        adapter: u.TextAreaAdapter,
        name: 'textarea'
    })

/**
 * Created by dingrf on 2016/1/25.
 */

u.TextFieldAdapter = u.BaseAdapter.extend({
    /**
     *
     * @param comp
     * @param options ：
     *      el: '#content',  对应的dom元素
     *      options: {},     配置
     *      model:{}        模型，包括数据和事件
     */
    initialize: function (options) {
        u.TextFieldAdapter.superclass.initialize.apply(this, arguments);
        //this.comp = comp;
        //this.element = options['el'];
        //this.options = options['options'];
        //this.viewModel = options['model'];
        var dataType = this.dataModel.getMeta(this.field,'type') || 'string';
        //var dataType = this.options['dataType'] || 'string';

        this.comp = new u.Text(this.element);
        this.element['u.Text'] = this.comp;


        if (dataType === 'float'){
            this.trueAdpt = new u.FloatAdapter(options);
        }
        else if (dataType === 'string'){
            this.trueAdpt = new u.StringAdapter(options);
        }
        else if (dataType === 'integer'){
            this.trueAdpt = new u.IntegerAdapter(options);
        }else{
            throw new Error("'u-text' only support 'float' or 'string' or 'integer' field type, not support type: '" + dataType + "', field: '" +this.field+ "'");
        }
        u.extend(this, this.trueAdpt);


        this.trueAdpt.comp = this.comp;
        this.trueAdpt.setShowValue = function (showValue) {
            this.showValue = showValue;
            //if (this.comp.compType === 'text')
            this.comp.change(showValue);
            this.element.title = showValue;
        }
        return this.trueAdpt;
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.TextFieldAdapter,
        name: 'u-text'
        //dataType: 'float'
    })
u.CheckboxAdapter = u.BaseAdapter.extend({
    mixins: [u.ValueMixin, u.EnableMixin,u.RequiredMixin, u.ValidateMixin],
    init: function (options) {
        var self = this;
        // u.CheckboxAdapter.superclass.initialize.apply(this, arguments); 
        this.isGroup = this.options['isGroup'] === true || this.options['isGroup'] === 'true';
        if (this.options['datasource']) {
            this.isGroup = true;
            var datasource = u.getJSObject(this.viewModel, this.options['datasource']);
            this.checkboxTemplateArray = [];
            for (var i= 0, count = this.element.childNodes.length; i< count; i++){
                this.checkboxTemplateArray.push(this.element.childNodes[i]);
            }
            this.setComboData(datasource);
        }else{
            if(this.element['u.Checkbox']) {
                this.comp = this.element['u.Checkbox']
            } else {
                this.comp = new u.Checkbox(this.element);
                this.element['u.Checkbox'] = this.comp;
            }
            
            this.checkedValue =  this.options['checkedValue'] || this.comp._inputElement.value;
            this.unCheckedValue =  this.options["unCheckedValue"];

            this.comp.on('change', function(){
                if (self.slice) return;
                if(!self.dataModel) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                if (self.isGroup) {
                    var valueArr = modelValue == '' ? [] : modelValue.split(',');

                    if (self.comp._inputElement.checked) {
                        valueArr.push(self.checkedValue)
                    } else {
                        var index = valueArr.indexOf(self.checkedValue);
                        valueArr.splice(index, 1);
                    }
                    self.dataModel.setValue(self.field, valueArr.join(','));
                }else{
                    if (self.comp._inputElement.checked) {
                        self.dataModel.setValue(self.field, self.checkedValue);
                    }else{
                        self.dataModel.setValue(self.field, self.unCheckedValue)
                    }
                }
            });
        }

        if(this.dataModel){
            this.dataModel.ref(this.field).subscribe(function(value) {
                self.modelValueChange(value)
            })
        }
    },
    setComboData: function (comboData) {
        var self = this;
        //this.element.innerHTML = '';
        for (var i = 0, len = comboData.length; i < (len - 1); i++) {
            for(var j=0; j<this.checkboxTemplateArray.length; j++){
                this.element.appendChild(this.checkboxTemplateArray[j].cloneNode(true));
            }
        }
        var allCheck = this.element.querySelectorAll('[type=checkbox]');
        var allName = this.element.querySelectorAll('[data-role=name]');
        for (var k = 0; k < allCheck.length; k++) {
            allCheck[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name
        }
        this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
            var comp;
            if(ele['u.Checkbox']) {
                comp = ele['u.Checkbox'];
            } else {
                comp = new u.Checkbox(ele);
            }
            ele['u.Checkbox'] = comp;
            comp.on('change', function(){
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                modelValue = modelValue ? modelValue : '';
                var valueArr = modelValue == '' ? [] : modelValue.split(',');
                if (comp._inputElement.checked) {
                    valueArr.push(comp._inputElement.value)
                } else {
                    var index = valueArr.indexOf(comp._inputElement.value);
                    valueArr.splice(index, 1);
                }
                //self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                //self.slice = false;
            });
        })

    },
    modelValueChange: function (val) {
        var self = this;
        if (this.slice) return;
        if (this.isGroup){
            this.trueValue = val;
            this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
                var comp =  ele['u.Checkbox'];
                if (comp._inputElement.checked != (val + ',').indexOf(comp._inputElement.value) > -1){
                    self.slice = true;
                    comp.toggle();
                    self.slice = false;
                }
            })
        }else{
            if (this.comp._inputElement.checked != (val === this.checkedValue)){
                this.slice = true;
                this.comp.toggle();
                this.slice = false;
            }
        }
    },

    setEnable: function (enable) {
        this.enable = (enable === true || enable === 'true');
        if (this.isGroup){
            this.element.querySelectorAll('.u-checkbox').forEach(function (ele) {
                var comp =  ele['u.Checkbox'];
                if (enable === true || enable === 'true'){
                    comp.enable();
                }else{
                    comp.disable();
                }
            })
        }else{
            if (this.enable){
                this.comp.enable();
            }else{
                this.comp.disable();
            }
        }
    }
})


u.compMgr.addDataAdapter(
    {
        adapter: u.CheckboxAdapter,
        name: 'u-checkbox'
    });

u.SwitchAdapter = u.BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.SwitchAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new u.Switch(this.element);
        this.element['u.Switch'] = this.comp;
        this.checkedValue =  this.options['checkedValue'] || this.comp._inputElement.value;
        this.unCheckedValue =  this.options["unCheckedValue"];
        this.comp.on('change', function(event){
            if (self.slice) return;
            if (self.comp._inputElement.checked) {
                self.dataModel.setValue(self.field, self.checkedValue);
            }else{
                self.dataModel.setValue(self.field, self.unCheckedValue)
            }
        });

        this.dataModel.ref(this.field).subscribe(function(value) {
        	self.modelValueChange(value)
        })


    },

    modelValueChange: function (val) {
        if (this.slice) return;
        if (this.comp._inputElement.checked != (val === this.checkedValue)){
            this.slice = true;
            this.comp.toggle();
            this.slice = false;
        }

    },
    setEnable: function (enable) {
        if (enable === true || enable === 'true') {
            this.enable = true
        } else if (enable === false || enable === 'false') {
            this.enable = false
        }
    }
})


u.compMgr.addDataAdapter(
    {
        adapter: u.SwitchAdapter,
        name: 'u-switch'
    });

u.ComboboxAdapter = u.BaseAdapter.extend({
    mixins:[u.ValueMixin,u.EnableMixin, u.RequiredMixin, u.ValidateMixin],
    init: function () {
        var self = this;
        //u.ComboboxAdapter.superclass.initialize.apply(this, arguments);
        this.datasource = u.getJSObject(this.viewModel, this.options['datasource']);
        this.mutil = this.options.mutil || false;
        this.onlySelect = this.options.onlySelect || false;
        this.validType = 'combobox';
        this.comp = new u.Combo({el:this.element,mutilSelect:this.mutil,onlySelect:this.onlySelect});
        this.element['u.Combo'] = this.comp;
        if (this.datasource){
            this.comp.setComboData(this.datasource);
        }else{
            if(u.isIE8 || u.isIE9)
                alert("IE8/IE9必须设置datasource");
        }
        ////TODO 后续支持多选
        //if (this.mutil) {
        //    //$(this.comboEle).on("mutilSelect", function (event, value) {
        //    //    self.setValue(value)
        //    //})
        //}
        this.comp.on('select', function(event){
            // self.slice = true;
            // if(self.dataModel)
            //     self.dataModel.setValue(self.field, event.value);
            // self.slice = false;
            self.setValue(event.value);
        });
        //if(this.dataModel){
        //    this.dataModel.ref(this.field).subscribe(function(value) {
        //        self.modelValueChange(value)
        //    })
        //}
    },
    modelValueChange: function (value) {
        if (this.slice) return;
        //this.trueValue = value;
        if (value === null || typeof value == "undefined")
            value = "";
        this.comp.setValue(value);
        // this.trueValue = this.formater ? this.formater.format(value) : value;
        // this.element.trueValue = this.trueValue;
        // this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
        // this.setShowValue(this.showValue);
    },
    //setValue: function (value) {
    //    this.trueValue = value;
    //    this.slice = true;
    //    this.setModelValue(this.trueValue);
    //    this.slice = false;
    //},
    //getValue: function () {
    //    return this.trueValue
    //},
    setEnable: function (enable) {
        var self = this;
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            this.comp._input.removeAttribute('readonly');
            u.removeClass(this.element.parentNode,'disablecover');
            u.on(this.comp._input, 'focus', function (e) {
                self.comp.show(e);
                u.stopEvent(e);
            })
            if (this.comp.iconBtn){
                u.on(this.comp.iconBtn, 'click', function(e){
                    self.comp.show(e);
                    u.stopEvent(e);
                })
            }
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            this.comp._input.setAttribute('readonly', 'readonly');
            u.addClass(this.element.parentNode,'disablecover');
            u.off(this.comp._input, 'focus')
            if (this.comp.iconBtn){
                u.off(this.comp.iconBtn, 'click')
            }
        }
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.ComboboxAdapter,
        name: 'u-combobox'
    });





u.RadioAdapter = u.BaseAdapter.extend({
    mixins: [u.ValueMixin, u.EnableMixin,u.RequiredMixin, u.ValidateMixin],
    init: function (options) {
        var self = this;
        //u.RadioAdapter.superclass.initialize.apply(this, arguments);
        this.dynamic = false;
        if (this.options['datasource']) {
            this.dynamic = true;
            var datasource = u.getJSObject(this.viewModel, this.options['datasource']);

            this.radioTemplateArray = [];
            for (var i= 0, count = this.element.childNodes.length; i< count; i++){
                this.radioTemplateArray.push(this.element.childNodes[i]);
            }
            this.setComboData(datasource);
        } else {
            this.comp = new u.Radio(this.element);
            this.element['u.Radio'] = this.comp;
            this.eleValue = this.comp._btnElement.value;

            this.comp.on('change', function(event){
                if (self.slice) return;
                var modelValue = self.dataModel.getValue(self.field);
                //var valueArr = modelValue == '' ?  [] : modelValue.split(',');
                if (self.comp._btnElement.checked){
                    self.dataModel.setValue(self.field, self.eleValue);
                }
            });
        }

        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    setComboData: function (comboData) {
        var self = this;
        // this.element.innerHTML = '';
        for (var i = 0, len = comboData.length; i < (len - 1); i++) {
            for(var j=0; j<this.radioTemplateArray.length; j++){
                this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
            }
            //this.radioTemplate.clone().appendTo(this.element)
        }

        var allRadio = this.element.querySelectorAll('[type=radio]');
        var allName = this.element.querySelectorAll('.u-radio-label');
        for (var k = 0; k < allRadio.length; k++) {
            allRadio[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name
        }

        this.radioInputName = allRadio[0].name;

        this.element.querySelectorAll('.u-radio').forEach(function (ele) {
            var comp = new u.Radio(ele);
            ele['u.Radio'] = comp;

            comp.on('change', function(event){
                if (comp._btnElement.checked){
                    self.dataModel.setValue(self.field, comp._btnElement.value);
                }
            });
        })
    },

    modelValueChange: function (value) {
        if (this.slice) return;
        if (this.dynamic){
            this.trueValue = value;
            this.element.querySelectorAll('.u-radio').forEach(function (ele) {
                var comp =  ele['u.Radio'];
                if (comp._btnElement.value == value) {
                    comp._btnElement.click();
                }
            })
        }else{
            if (this.eleValue == value){
                this.slice = true
                this.comp._btnElement.click();
                this.slice = false
            }
        }
    },

    setEnable: function (enable) {
        this.enable = (enable === true || enable === 'true');
        if (this.dynamic){
            this.element.querySelectorAll('.u-radio').forEach(function (ele) {
                var comp =  ele['u.Radio'];
                if (enable === true || enable === 'true'){
                    comp.enable();
                }else{
                    comp.disable();
                }
            })
        }else{
            if (this.enable){
                this.comp.enable();
            }else{
                this.comp.disable();
            }
        }
    }
})


u.compMgr.addDataAdapter(
    {
        adapter: u.RadioAdapter,
        name: 'u-radio'
    });

u.NativeRadioAdapter = u.BaseAdapter.extend({
    mixins: [u.ValueMixin, u.EnableMixin],
    init: function () {
        this.isDynamic = false;
        //如果存在datasource，动态创建radio
        if (this.options['datasource']) {
            this.isDynamic = true;
            var datasource = u.getJSObject(this.viewModel, this.options['datasource']);
            //if(!u.isArray(datasource)) return;

            this.radioTemplateArray = [];
            for (var i= 0, count = this.element.childNodes.length; i< count; i++){
                this.radioTemplateArray.push(this.element.childNodes[i]);
            }
            this.setComboData(datasource);
        } else {
        }
    },
    setComboData: function (comboData) {
        var self = this;
        //if(!this.radioTemplate.is(":radio")) return;
        this.element.innerHTML = '';
        for (var i = 0, len = comboData.length; i < len; i++) {
            for(var j=0; j<this.radioTemplateArray.length; j++){
                try{
                    this.element.appendChild(this.radioTemplateArray[j].cloneNode(true));
                }catch(e){
                    
                }
                
            }
            //this.radioTemplate.clone().appendTo(this.element)
        }

        var allRadio = this.element.querySelectorAll('[type=radio]');
        var allName = this.element.querySelectorAll('[data-role=name]');
        for (var k = 0; k < allRadio.length; k++) {
            allRadio[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name
        }

        this.radioInputName = allRadio[0].name;

        this.element.querySelectorAll('[type=radio][name="'+ this.radioInputName +'"]').forEach(function (ele) {
            u.on(ele, 'click', function () {
                if (this.checked) {
                    self.setValue(this.value);
                }

            })
        })
    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.setValue(value)
    },
    setValue: function (value) {
        this.trueValue = value;
        this.element.querySelectorAll('[type=radio][name="'+ this.radioInputName +'"]').forEach(function (ele) {
            if (ele.value == value) {
                ele.checked = true;
            } else {
                ele.checked = false;
            }
        })
        this.slice = true;
        this.dataModel.setValue(this.field, this.trueValue);
        this.slice = false;
    },
    getValue: function () {
        return this.trueValue;
    },


});

u.compMgr.addDataAdapter({
    adapter: u.NativeRadioAdapter,
    name: 'radio'
});

u.NativeCheckAdapter = u.BaseAdapter.extend({
    mixins: [u.ValueMixin, u.EnableMixin],
    init: function () {
        var self = this;
        this.isGroup = false;
        //如果存在datasource，动态创建checkbox
        if (this.options['datasource']) {
            this.isGroup = true;
            var datasource = u.getJSObject(this.viewModel, this.options['datasource']);
            //if(!u.isArray(datasource)) return;

            this.checkboxTemplateArray = [];
            for (var i= 0, count = this.element.childNodes.length; i< count; i++){
                this.checkboxTemplateArray.push(this.element.childNodes[i]);
            }
            this.setComboData(datasource);
        } else {
            this.checkedValue =  this.options['checkedValue'] || 'Y';
            this.unCheckedValue =  this.options["unCheckedValue"] || 'N';
            u.on(this.element, 'click', function () {
                if (this.checked) {
                    self.dataModel.setValue(self.field, self.checkedValue);
                }else{
                    self.dataModel.setValue(self.field, self.unCheckedValue)
                }
            });
        }
    },
    setComboData: function (comboData) {
        var self = this;
        this.element.innerHTML = '';
        for (var i = 0, len = comboData.length; i < len; i++) {
            for(var j=0; j<this.checkboxTemplateArray.length; j++){
                try{
                    this.element.appendChild(this.checkboxTemplateArray[j].cloneNode());
                }catch(e){
                }
            }
            //this.radioTemplate.clone().appendTo(this.element)
        }

        var allCheck = this.element.querySelectorAll('[type=checkbox]');
        var allName = this.element.querySelectorAll('[data-role=name]');
        for (var k = 0; k < allCheck.length; k++) {
            allCheck[k].value = comboData[k].pk || comboData[k].value;
            allName[k].innerHTML = comboData[k].name
        }

        this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
            u.on(ele, 'click', function () {
                var modelValue = self.dataModel.getValue(self.field);

                var valueArr = modelValue == '' ? [] : modelValue.split(',');

                if (this.checked) {
                    valueArr.push(this.value)
                } else {
                    var index = valueArr.indexOf(this.value);
                    valueArr.splice(index, 1);
                }
                self.slice = true;
                self.dataModel.setValue(self.field, valueArr.join(','));
                self.slice = false;

            })
        })
    },
    modelValueChange: function (val) {
        if (this.slice) return;
        if (this.isGroup){
            this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
                if (ele.checked != (val + ',').indexOf(ele.value) > -1){
                    this.slice = true;
                    ele.checked = !ele.checked;
                    this.slice = false;
                }
            })
        }else{
            if (this.element.checked != (val === this.checkedValue)){
                this.slice = true;
                this.element.checked = !this.element.checked;
                this.slice = false;
            }
        }
    },
    setValue: function (value) {
        this.trueValue = value;
        this.element.querySelectorAll('[type=checkbox]').forEach(function (ele) {
            if (ele.value == value) {
                ele.checked = true;
            } else {
                ele.checked = false;
            }
        })
        this.slice = true;
        this.dataModel.setValue(this.field, this.trueValue);
        this.slice = false;
    },
    getValue: function () {
        return this.trueValue;
    },


});

u.compMgr.addDataAdapter({
    adapter: u.NativeCheckAdapter,
    name: 'checkbox'
});

u.PaginationAdapter = u.BaseAdapter.extend({
        initialize: function (comp, options) {
            var self = this;
            u.PaginationAdapter.superclass.initialize.apply(this, arguments);

            //var Pagination = function(element, options, viewModel) {

            if (!this.dataModel.pageSize() && this.options.pageSize)
                this.dataModel.pageSize(this.options.pageSize)
            this.options.pageSize = this.dataModel.pageSize() || this.options.pageSize;
            //this.$element.pagination(options);
            //this.comp = this.$element.data('u.pagination');
            this.comp = new u.pagination({el:this.element,jumppage:true});
			this.element['u.pagination'] = this.comp;
            this.comp.dataModel = this.dataModel;
            this.pageChange = u.getFunction(this.viewModel, this.options['pageChange']);
            this.sizeChange = u.getFunction(this.viewModel, this.options['sizeChange']);

            this.comp.on('pageChange', function (pageIndex) {
                if (typeof self.pageChange == 'function') {
                    self.pageChange(pageIndex);
                } else {
                    self.defaultPageChange(pageIndex);
                }

            });
            this.comp.on('sizeChange', function (size, pageIndex) {
                if (typeof self.sizeChange == 'function') {
                    self.sizeChange(size, pageIndex);
                } else {
                    u.showMessage({msg:"没有注册sizeChange事件"});
                }
            });


            this.dataModel.totalPages.subscribe(function (value) {
                self.comp.update({totalPages: value})
            })

            this.dataModel.pageSize.subscribe(function (value) {
                self.comp.update({pageSize: value})
            })

            this.dataModel.pageIndex.subscribe(function (value) {
                self.comp.update({currentPage: value + 1})
            })

            this.dataModel.totalRow.subscribe(function (value) {
                self.comp.update({totalCount: value})
            })

        },

        defaultPageChange: function (pageIndex) {
        if (this.dataModel.hasPage(pageIndex)) {
            this.dataModel.setCurrentPage(pageIndex)
        } else {
        }
    },

    disableChangeSize: function () {
        this.comp.disableChangeSize();
    },

    enableChangeSize: function () {
        this.comp.enableChangeSize();
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.PaginationAdapter,
        name: 'pagination'
    });





u.DateTimeAdapter = u.BaseAdapter.extend({
	mixins: [u.ValueMixin,u.EnableMixin,u.RequiredMixin, u.ValidateMixin],
	init: function (options) {
		var self = this,adapterType,format;
		// u.DateTimeAdapter.superclass.initialize.apply(this, arguments);
		if (this.options.type === 'u-date'){
			this.adapterType = 'date';
		}else{
			this.adapterType = 'datetime'
			u.addClass(this.element,'time');
		}

		this.maskerMeta = u.core.getMaskerMeta(this.adapterType) || {};
		this.maskerMeta.format = this.options['format'] || this.maskerMeta.format;
		if(this.dataModel){
			this.dataModel.on(this.field + '.format.' +  u.DataTable.ON_CURRENT_META_CHANGE, function(event){
				self.setFormat(event.newValue)
			});
		}
		
		if(this.dataModel && !this.options['format'])
			this.options.format = this.dataModel.getMeta(this.field, "format")

		if(!this.options['format']){
			if(this.options.type === 'u-date'){
				this.options.format = "YYYY-MM-DD";
			}else{
				this.options.format = "YYYY-MM-DD HH:mm:ss";
			}
		}
		format = this.options.format;
		this.maskerMeta.format = format || this.maskerMeta.format

		this.startField = this.options.startField?this.options.startField : this.dataModel.getMeta(this.field, "startField");
		
			
		// this.formater = new $.DateFormater(this.maskerMeta.format);
		// this.masker = new DateTimeMasker(this.maskerMeta);
		var op;
		if(u.isMobile){
			op = {
				theme:"ios",
				mode:"scroller",
				lang: "zh",  
				cancelText: null,
				onSelect:function(val){
					self.setValue(val);
				}
			}
			this.element = this.element.querySelector("input");
			this.element.setAttribute('readonly','readonly');
			if(this.adapterType == 'date'){
				$(this.element).mobiscroll().date(op);
			}else{
				$(this.element).mobiscroll().datetime(op);
			}
		}else{
			this.comp = new u.DateTimePicker({el:this.element,format:this.maskerMeta.format});
		}
		
		this.element['u.DateTimePicker'] = this.comp;

		if(!u.isMobile){
			this.comp.on('select', function(event){
				self.setValue(event.value);
			});
		}
		if(this.dataModel){
			this.dataModel.ref(this.field).subscribe(function(value) {
				self.modelValueChange(value);
			});
			if(this.startField){
				this.dataModel.ref(this.startField).subscribe(function(value) {
					if(u.isMobile){
						var valueObj = u.date.getDateObj(value);
						op.minDate = valueObj;
						if(self.adapterType == 'date'){
							$(self.element).mobiscroll().date(op);
						}else{
							$(self.element).mobiscroll().datetime(op);
						}
						var nowDate = u.date.getDateObj(self.dataModel.getValue(self.field));
						if(nowDate < valueObj || !value){
							self.dataModel.setValue(self.field,'');
						}
					}else{
						self.comp.setStartDate(value);
						if(self.comp.date < u.date.getDateObj(value) || !value){
							self.dataModel.setValue(self.field,'');
						}
					}
					
				});
			}
			if(this.startField){
				var startValue = this.dataModel.getValue(this.startField);
				if(startValue){
					if(u.isMobile){
						op.minDate = u.date.getDateObj(startValue);
						if(this.adapterType == 'date'){
							$(this.element).mobiscroll().date(op);
						}else{
							$(this.element).mobiscroll().datetime(op);
						}
					}else{
						self.comp.setStartDate(startValue);
					}
				}
			}
			
		}
			
	},
	modelValueChange: function(value){
		if (this.slice) return;
		this.trueValue = value;
		if(u.isMobile){
			if(value){
				value = u.date.format(value,this.options.format);
				$(this.element).scroller('setDate', u.date.getDateObj(value), true);
			}
		}else{
			this.comp.setDate(value);
		}
		
	},
	setFormat: function(format){
		if (this.maskerMeta.format == format) return;
		this.options.format = format;
		this.maskerMeta.format = format;
		if(!u.isMobile)
			this.comp.setFormat(format);
		// this.formater = new $.DateFormater(this.maskerMeta.format);
		// this.masker = new DateTimeMasker(this.maskerMeta);
	},
	setValue: function (value) {
		value = u.date.format(value,this.options.format);
        this.trueValue = this.formater ? this.formater.format(value) : value;
        this.showValue = this.masker ? this.masker.format(this.trueValue).value : this.trueValue;
        this.setShowValue(this.showValue);
        this.slice = true;
        this.dataModel.setValue(this.field, this.trueValue);
        this.slice = false;
    },
    setEnable: function(enable){
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            if(u.isMobile){
            	this.element.removeAttribute('disabled');
            }else{
            	this.comp._input.removeAttribute('readonly');
            }
            u.removeClass(this.element.parentNode,'disablecover');
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            if(u.isMobile){
            	this.element.setAttribute('disabled','disabled');
            }else{
            	this.comp._input.setAttribute('readonly', 'readonly');
            }
            u.addClass(this.element.parentNode,'disablecover');
        }
        if(!u.isMobile)
        	this.comp.setEnable(enable);
    }

});

u.compMgr.addDataAdapter(
		{
			adapter: u.DateTimeAdapter,
			name: 'u-date'
		});

u.compMgr.addDataAdapter(
		{
			adapter: u.DateTimeAdapter,
			name: 'u-datetime'
		});

u.TimeAdapter = u.BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.TimeAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'time';

        this.maskerMeta = u.core.getMaskerMeta('time') || {};
        this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format

        if (this.options.type == 'u-clockpicker' && !u.isIE8)
            this.comp = new u.ClockPicker(this.element);
        else
            this.comp = new u.Time(this.element);
        var dataType = this.dataModel.getMeta(this.field,'type');
        this.dataType =  dataType || 'string';


        this.comp.on('valueChange', function(event){
            self.slice = true;
            if(event.value == ''){
                self.dataModel.setValue(self.field,'')
            }else{
                var _date = self.dataModel.getValue(self.field);
                if (self.dataType === 'datetime') {
                    var valueArr = event.value.split(':');
                    _date = u.date.getDateObj(_date);
                    if (!_date){
                        self.dataModel.setValue(self.field,'');
                    }else {
                        if (event.value == _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds())
                            return;
                        _date.setHours(valueArr[0]);
                        _date.setMinutes(valueArr[1]);
                        _date.setSeconds(valueArr[2]);
                        self.dataModel.setValue(self.field, u.date.format(_date, 'YYYY-MM-DD HH:mm:ss'));
                    }
                }
                else{
                    if (event.value == _date)
                        return;
                    self.dataModel.setValue(self.field, event.value);
                }
            }
            
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        var compValue = '';
        if (this.dataType === 'datetime') {
            var _date = u.date.getDateObj(value);
            if (!_date)
                compValue = ''
            else
                compValue = _date.getHours() + ':' + _date.getMinutes() + ':' + _date.getSeconds();
        }
        else{
            compValue = value;
        }
        this.comp.setValue(compValue);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.TimeAdapter,
        name: 'u-time'
    });

u.compMgr.addDataAdapter(
    {
        adapter: u.TimeAdapter,
        name: 'u-clockpicker'
    });




u.YearMonthAdapter = u.BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        u.YearMonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'yearmonth';

        this.comp = new u.YearMonth(this.element);


        this.comp.on('valueChange', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.YearMonthAdapter,
        name: 'u-yearmonth'
    });





u.YearAdapter = u.BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        u.YearAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'year';

        this.comp = new u.Year(this.element);


        this.comp.on('valueChange', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.YearAdapter,
        name: 'u-year'
    });





u.MonthAdapter = u.BaseAdapter.extend({
    initialize: function (comp, options) {
        var self = this;
        u.MonthAdapter.superclass.initialize.apply(this, arguments);
        this.validType = 'month';

        this.comp = new u.Month(this.element);


        this.comp.on('valueChange', function(event){
            self.slice = true;
            self.dataModel.setValue(self.field, event.value);
            self.slice = false;
            //self.setValue(event.value);
        });
        this.dataModel.ref(this.field).subscribe(function(value) {
            self.modelValueChange(value)
        })


    },
    modelValueChange: function (value) {
        if (this.slice) return;
        this.comp.setValue(value);
    },
    setEnable: function (enable) {
    }
});

u.compMgr.addDataAdapter(
    {
        adapter: u.MonthAdapter,
        name: 'u-month'
    });





u.ProgressAdapter = u.BaseAdapter.extend({
    initialize: function (options) {
        var self = this;
        u.ProgressAdapter.superclass.initialize.apply(this, arguments);

        this.comp = new u.Progress(this.element);
        this.element['u.Progress'] = this.comp;

        this.dataModel.ref(this.field).subscribe(function(value) {
        	self.modelValueChange(value)
        })
    },

    modelValueChange: function (val) {
        this.comp.setProgress(val)
    }
})


u.compMgr.addDataAdapter(
    {
        adapter: u.ProgressAdapter,
        name: 'u-progress'
    });

/**
 * URL控件
 */
u.UrlAdapter = u.StringAdapter.extend({
    init: function () {
        u.UrlAdapter.superclass.init.apply(this);
        this.validType = 'url';
        /*
         * 因为需要输入，因此不显示为超链接
         */
    }
});
u.compMgr.addDataAdapter(
    {
        adapter: u.UrlAdapter,
        name: 'url'
    });



/**
 * 密码控件
 */
u.PassWordAdapter = u.StringAdapter.extend({
    init: function () {
        u.PassWordAdapter.superclass.init.apply(this);
        var oThis = this;
        if(u.isIE8){
            var outStr = this.element.outerHTML;
            var l = outStr.length;
            outStr = outStr.substring(0,l-1) + ' type="password"' + outStr.substring(l-1);
            var newEle = document.createElement(outStr);
            var parent = this.element.parentNode;
            parent.insertBefore(newEle,this.element.nextSibling);
            parent.removeChild(this.element);
            this.element = newEle;
        }else{
            this.element.type = "password";
        }
        oThis.element.title = '';
        this._element = this.element.parentNode;
        this.span = this._element.querySelector("span");
        if(u.isIE8){
            this.span.style.display = 'none';
        }
        if(this.span){
            u.on(this.span,'click',function(){
                if(oThis.element.type == 'password'){
                    oThis.element.type = 'text';
                }else{
                    oThis.element.type = 'password';
                }
            });
        }
        
    },
    setShowValue: function (showValue) {
        this.showValue = showValue;
        this.element.value = showValue;
        this.element.title = '';
    },
});
u.compMgr.addDataAdapter(
    {
        adapter: u.PassWordAdapter,
        name: 'password'
    });



+function ($) {
    $.compManager = {
        addPlug: function (plug) {
            var name = plug.compName;
            u.compMgr.addDataAdapter(
                {
                    adapter: plug,
                    name: name
                });
        }
    };

}($);


u.compMgr.createDataAdapter = function (options) {
    var opt = options['options'];
    var type = opt['type'],
        id = opt['id'];
    var adpt = this.dataAdapters[type];
    if (!adpt) return null;
    /*if(type == 'ncRefer' || type == 'time' || type == 'datetime' || type == 'date' || type == 'combo'
     || type == 'check'){
     var comp = new adpt(options.el,options.options,options.model);
     }else{
     var comp = new adpt(options);
     }*/
    if (adpt.prototype.initialize.length == 3) { //兼容旧版本
        var comp = new adpt(options.el, options.options, options.model);
    } else {
        var comp = new adpt(options);
    }
    comp.type = type;
    comp.id = id;
    return comp;
};
// 兼容旧版本，jquery必须存在
$.DataTable = u.DataTable;

$.Row = u.Row;

$.createApp = u.createApp;

$.NumberFormater = u.NumberFormater;

$.isDate = u.isDate;


ServerEvent.fn.processXHRError = function (self, rsl, state, xhr) {
    if (typeof rsl === 'string')
        rsl = JSON.parse(rsl)
    if (xhr.getResponseHeader && xhr.getResponseHeader("X-Error")) {
        u.showMessageDialog({type: "info", title: "提示", msg: rsl["message"], backdrop: true});
        if (rsl["operate"]) {
            eval(rsl["operate"]);
        }
        return false;
    }
    return true;
};
$.InputComp = u.BaseAdapter.extend({

    initialize: function (element, options, viewModel) {
        this.hasDataTable = true;
        var newOptions = {};
        newOptions.el = element;
        newOptions.options = options;
        newOptions.model = viewModel;


        $.InputComp.superclass.initialize.call(this, newOptions);

        //this.element = (this.element.nodeName === 'INPUT' || this.element.nodeName === 'TEXTAREA') ? this.element : this.element.querySelector('input');
        //if (!this.element){
        //    throw new Error('not found INPUT or TEXTAREA element, u-meta:' + JSON.stringify(this.options));
        //}
        this.required = this.options['required'];
        this.maxLength = null;
        this.minLength = null;
        this.max = null;
        this.min = null;
        this.regExp = null;
        this.placement = this.options['placement'];
        this.tipId = this.options['tipId'];
        this.errorMsg = this.options['errorMsg'];
        this.nullMsg = this.options['nullMsg'];
        //this.create()

        //this.element = element;



    },
    create: function () {
        var self = this;

        if(this.dataModel){
            //处理数据绑定
            this.dataModel.ref(this.field).subscribe(function(value) {
                self.modelValueChange(value)
            })
            //this.dataModel.on(this.field + "." + u.DataTable.ON_CURRENT_VALUE_CHANGE, function (event) {
            //    self.modelValueChange(event.newValue);
            //});

            //处理只读
            this.dataModel.refEnable(this.field).subscribe(function(value) {
                self.setEnable(value);
            });
            //处理必填
            this.dataModel.refRowMeta(this.field, "required").subscribe(function(value) {
                self.setRequired(event.newValue);
            });
            this.dataModel.refRowMeta(this.field, "regExp").subscribe(function(value) {
                self.regExp = value
            });

            this.setRequired(this.dataModel.getMeta(this.field, "required"));
            this.regExp = this.dataModel.getMeta(this.field, "regExp");
            this.modelValueChange(this.dataModel.getValue(this.field));
        }
        if (this.validType) {
            this.validate = new u.Validate({
                el: this.element,
                single: true,
                validMode: 'manually',
                required: this.required,
                validType: this.validType,
                placement: this.placement,
                maxLength: this.maxLength,
                minLength: this.minLength,
                max: this.max,
                min: this.min,
                maxNotEq: this.maxNotEq,
                minNotEq: this.minNotEq,
                reg: this.regExp
            });
        };

        if (this.element.nodeName == 'INPUT' && (!this.element.getAttribute("type") || this.element.getAttribute("type") == 'text')) {
            u.on(this.element, 'focus',function(e){
                if(self.enable){
                    self.onFocusin ? self.onFocusin(e) : self.setShowValue(self.getValue());
                    //$(this).select();
                }
            });
            u.on(this.element, 'blur',function(e){
                if (!self.doValidate() && self._needClean()) {
                    if (self.required && (self.element.value === null || self.element.value === undefined || self.element.value === '')) {
                        // 因必输项清空导致检验没通过的情况
                        self.setValue('')
                    } else {
                        self.element.value = self.getShowValue()
                    }
                }
                else
                    self.setValue(self.element.value)
            });
        }
    },
    /**
     * 模型数据改变
     * @param {Object} value
     */
    modelValueChange: function (value) {

    },

    /**
     * 设置模型值
     * @param {Object} value
     */
    setModelValue: function (value) {
        if (!this.dataModel) return
        this.dataModel.setValue(this.field, value)
    },
    /**
     * 设置控件值
     * @param {Object} value
     */
    setValue: function (value) {
    },
    /**
     * 取控件的值
     */
    getValue: function () {
        return this.trueValue
    },
    setShowValue: function (showValue) {
        this.showValue = showValue;
        this.element.value = showValue;
        this.element.title = showValue;

    },
    getShowValue: function () {
        return this.showValue
    },
    setEnable: function (enable) {
        if (enable === true || enable === 'true') {
            this.enable = true;
            this.element.removeAttribute('readonly');
            u.removeClass(this.element.parentNode,'disablecover');
        } else if (enable === false || enable === 'false') {
            this.enable = false;
            this.element.setAttribute('readonly', 'readonly');
            u.addClass(this.element.parentNode,'disablecover');
        }
    },
    setRequired: function (required) {
        if (required === true || required === 'true') {
            this.required = true;
        } else if (required === false || required === 'false') {
            this.required = false;
        }
    },

    /**
     *校验
     */
    doValidate: function (options) {
        if (this.validate) {
            if (options && options['trueValue'] === true) {
                options['showMsg'] = options['showMsg'] || false;
                var result = this.validate.check({pValue: this.getValue(), showMsg: options['showMsg']});
            }
            else{
                var result = this.validate.check();
            }
            result.comp = this;
            return result;
        } else {
            return {passed:true,comp:this}
        }
    },
    /**
     * 是否需要清除数据
     */
    _needClean: function () {
        if (this.validate)
            return this.validate._needClean();
        else return false
    },
    trigger: function(name) {
        name = name.toLowerCase()
        if (!this._events || !this._events[name]) return this;
        var args = Array.prototype.slice.call(arguments, 1);
        var events = this._events[name];
        for (var i = 0, count = events.length; i < count; i++) {
            events[i].callback.apply(this, args);
        }
        return this;

    },
    on: function(name, callback) {
        name = name.toLowerCase()
        this._events || (this._events = {})
        var events = this._events[name] || (this._events[name] = [])
        events.push({
            callback: callback
        })
        return this;
    }

});
+function($) {

	var DateTime = $.InputComp.extend({
		initialize: function(element, options, viewModel) {
			var self = this
			this.outerDiv = element
			element = $(element).find('input')[0]
			DateTime.superclass.initialize.apply(this, arguments)
			this.maskerMeta = iweb.Core.getMaskerMeta('datetime') || {}
			this.maskerMeta.format = options['format'] || this.maskerMeta.format

			if (this.dataModel) {
				//处理数据精度
				if (this.hasDataTable) {
					this.dataModel.on(this.field + '.format.' +  $.DataTable.ON_CURRENT_META_CHANGE, function(event){
						self.setFormat(event.newValue)
					});
					this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format
				}
			}
			this.validType = 'datetime'
			if(!this.options.widgetParent){
				this.options.widgetParent = $("body")
			}	
			this.options.picker_type = "datetime";
			this.options.picker_type = "datetime";
			if(!options['format'])
				this.options.format = "YYYY-MM-DD HH:mm:ss";
			this.formater = new $.DateFormater(this.maskerMeta.format);
			//this.masker = new DateTimeMasker(this.maskerMeta);
			element.value = this.getValue();
			this.create()
			this.comp = $(this.outerDiv).datetimepicker(this.options)
			if($.app){
				$(this.element).on("picker_open",function(){
					self.setShowValue(self.getValue())
				}).on("picker_close",function(){
					self.setValue(this.value)
				})
			}
		},
		create: function() {
			var self = this
			if (this.dataModel) {
				//处理数据绑定
				if (this.hasDataTable) {

					this.dataModel.on(this.field + "." + $.DataTable.ON_CURRENT_VALUE_CHANGE, function (event) {
						self.modelValueChange(event.newValue);
					});


					this.dataModel.on($.DataTable.ON_ENABLE_CHANGE, function (event) {
						if (event.enable === true) {
							var _enable = self.dataModel.getRowMeta(self.field, 'enable');
							if (_enable === true)
								self.setEnable(_enable);
						} else {
							self.setEnable(event.enable);
						}
					});

					this.dataModel.on(this.field + '.enable.' + $.DataTable.ON_CURRENT_META_CHANGE, function (event) {
						self.setEnable(event.newValue);
					});

					this.dataModel.on(this.field + '.enable.' + $.DataTable.ON_ROW_META_CHANGE, function (event) {
						self.setEnable(event.newValue);
					});


					this.dataModel.on(this.field + '.required.' + $.DataTable.ON_CURRENT_META_CHANGE, function (event) {
						self.setRequired(event.newValue);
					});

					this.dataModel.on(this.field + '.regExp.' + $.DataTable.ON_CURRENT_META_CHANGE, function (event) {
						self.regExp = event.newValue;
					});
					this.dataModel.on($.DataTable.ON_CURRENT_ROW_CHANGE, function () {
						var row = self.dataModel.getCurrentRow();
						if (!row) {
							self.modelValueChange('');
							self.setEnable(false);
						} else {
							self.modelValueChange(row.getValue(self.field));
							if (this.enable === true) {
								var _enable = row.getMeta(self.field, 'enable');
								if (_enable === true)
									self.setEnable(_enable);
							} else {
								self.setEnable(this.enable);
							}
							self.setRequired(row.getMeta(self.field, 'required'));
						}
					});
					this.dataModel.on($.DataTable.ON_CURRENT_UPDATE, function (event) {
						var row = event.rows[0]
						self.modelValueChange(row.getValue(self.field));
					});

					this.setEnable(this.dataModel.isEnable(this.field))
					this.setRequired(this.dataModel.getMeta(this.field, "required"))
					this.regExp = this.dataModel.getMeta(this.field, "regExp")
				} else {
					this.dataModel.subscribe(function (value) {
						self.modelValueChange(value)
					})
				}
				this.modelValueChange(this.hasDataTable ? this.dataModel.getValue(this.field) : this.dataModel())
			}

			$(this.element).focus(function(e) {
				if($(".dropdown-menu").length == 0) {
					self.onFocusin ? self.onFocusin(e) : self.setShowValue(self.getValue())
				}
				//$(this).select();
			})
			$(this.element).on('change.date',function(e) {
				if (!self.doValidate() && self._needClean()){
					self.element.value = self.getShowValue()
					//self.setValue(self.getValue())
				}
				else
					self.setValue(self.element.value)
			})

			if (this.validType) {
				this.validate = $(this.element).validate({
					single: true,
					validMode: 'manually',
					required: this.required,
					validType: this.validType,
					placement: this.placement,
					maxLength: this.maxLength,
					minLength: this.minLength,
					max: this.max,
					min: this.min,
					maxNotEq: this.maxNotEq,
					minNotEq: this.minNotEq,
					reg: this.regExp,
					midValidateCallBack: this.midValidateCallBack,
					validateCallBack: this.validateCallBack
				})
			};



		},
		modelValueChange: function(value) {
			if (this.slice) return
			value = value || ""
			this.trueValue = value
			var showValue = u.date.format(value, this.maskerMeta.format); //this.masker.format(value).value
			this.setShowValue(showValue)
		},
		setValue: function(value) {
			this.trueValue = value
			this.setShowValue(this.trueValue) //TODO fomat格式			
			this.slice = true
			this.setModelValue(value)
			this.slice = false
			//this.trigger(DateTime.EVENT_VALUE_CHANGE, this.trueValue)
		},
		getValue : function() {
			return this.trueValue
		},
		setShowValue : function(showValue) {
			this.showValue = showValue
//			this.element.value = showValue
			$(this.element).val(showValue);
			if($(this.outerDiv).data("DateTimePicker")){
				$(this.outerDiv).data("DateTimePicker").date(showValue)
			}
		},
		getShowValue: function() {
			return this.showValue
		},
		/**
		 * 修改显示格式
		 * @param {Integer} precision
		 */
		setFormat: function(format){

			if (this.maskerMeta.format == format) return
			this.maskerMeta.format = format
			this.formater = new $.DateFormater(this.maskerMeta.format);
			//this.masker = new DateTimeMasker(this.maskerMeta);
		},
		setEnable: function(enable) {
			if (enable === true || enable === 'true') {
				this.enable = true
				if(!$.app){
					$(this.element).removeAttr('readonly')
				}
				$(this.element).attr('h7picker','true')
				$(this.element).parent().removeClass('disablecover')

			} else if (enable === false || enable === 'false') {
				this.enable = false
				$(this.element).attr('h7picker','false')
				$(this.element).attr('readonly', 'readonly')
				$(this.element).parent().addClass('disablecover')

			}
		},
		Statics: {
			compName: 'datetime'
		}
	})

	var DateComp = DateTime.extend({
		initialize: function(element, options, viewModel) {
			var self = this
			this.outerDiv = element
			element = $(element).find('input')[0]
			DateTime.superclass.initialize.apply(this, arguments)
			this.maskerMeta = iweb.Core.getMaskerMeta('date') || {}
			this.maskerMeta.format = options['format'] || this.maskerMeta.format

			if (this.dataModel) {
				//处理数据精度
				if (this.hasDataTable) {
					//this.dataModel.refRowMeta(this.field, "format").subscribe(function(format){
					//	self.setFormat(format)
					//})
					this.dataModel.on(this.field + '.format.' +  $.DataTable.ON_CURRENT_META_CHANGE, function(event){
						self.setFormat(event.newValue)
					});

					this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format

				}
			}
			//this.validType = 'date'
			if(!this.options.widgetParent){
				this.options.widgetParent = $("body")
			}	
			this.options.picker_type = "datecomp";
			if(!options['format'])
				this.options.format = "YYYY-MM-DD";
			this.formater = new $.DateFormater(this.maskerMeta.format);
			//this.masker = new DateMasker(this.maskerMeta);
			element.value = this.getValue();
			this.create()

			this.comp = $(this.outerDiv).datetimepicker(this.options)
			//$(this.element).focusin(function(e) {
			//	self.setShowValue(self.getValue())
            //
			//}).on('blur',function(e) {
			//	if (!self.doValidate() && self._needClean()){
			//		//self.element.value = self.getShowValue()
			//		self.setShowValue(self.getShowValue())
			//	}
			//	else
			//	//self.setValue(self.element.value)
			//		self.setValue(this.value)
			//})
		},
		/**
		 * 修改显示格式
		 * @param {Integer} precision
		 */
		setFormat: function(format){
			if (this.maskerMeta.format == format) return
			this.maskerMeta.format = format
			this.formater = new $.DateFormater(this.maskerMeta.format);
			//this.masker = new DateMasker(this.maskerMeta);
		},
		Statics: {
			compName: 'date'
		}
	})
	var TimeComp = DateTime.extend({
		initialize: function(element, options, viewModel) {
			var self = this
			this.outerDiv = element
			element = $(element).find('input')[0]
			DateTime.superclass.initialize.apply(this, arguments)
			this.maskerMeta = iweb.Core.getMaskerMeta('time') || {}
			this.maskerMeta.format = options['format'] || this.maskerMeta.format

			if (this.dataModel) {
				//处理数据精度
				if (this.hasDataTable) {
					//this.dataModel.refRowMeta(this.field, "format").subscribe(function(format){
					//	self.setFormat(format)
					//})
					this.dataModel.on(this.field + '.format.' +  $.DataTable.ON_CURRENT_META_CHANGE, function(event){
						self.setFormat(event.newValue)
					});

					this.maskerMeta.format = this.dataModel.getMeta(this.field, "format") || this.maskerMeta.format

				}
			}
			//this.validType = 'date'
			if(!this.options.widgetParent){
				this.options.widgetParent = $("body")
			}	
			this.options.picker_type = "timecomp";
			if(!options['format'])
				this.options.format = "HH:mm:ss";
			this.formater = new $.DateFormater(this.maskerMeta.format);
			//this.masker = new DateMasker(this.maskerMeta);
			element.value = this.getValue();
			this.create()

			this.comp = $(this.outerDiv).datetimepicker(this.options)
		},
		/**
		 * 修改显示格式
		 * @param {Integer} precision
		 */
		setFormat: function(format){
			if (this.maskerMeta.format == format) return
			this.maskerMeta.format = format
			this.formater = new $.DateFormater(this.maskerMeta.format);
			//this.masker = new DateMasker(this.maskerMeta);
		},
		Statics: {
			compName: 'time'
		}
	})
	if ($.compManager){
		$.compManager.addPlug(DateTime)
		$.compManager.addPlug(DateComp)
		$.compManager.addPlug(TimeComp)
	}
	// $.DateTime = DateTime;
	// $.DateComp = DateComp;
	// $.TimeComp = TimeComp;
	
}($);
/*u.OriginComboboxAdapter = u.ComboboxAdapter.extend({
	initialize: function (comp, options) {
		var div = comp.el;
		div.appendChild(u.makeDOM('<input class="u-input"/>'));
		u.OriginComboboxAdapter.superclass.initialize(comp, options);
	},
	 modelValueChange: function(value){
		 u.OriginComboboxAdapter.superclass.modelValueChange(value);
	 },
	setEnable: function(enable){
		u.OriginComboboxAdapter.superclass.setEnable(enable);
	},
});

u.compMgr.addDataAdapter(
		{
			adapter: u.OriginComboboxAdapter,
			name: 'combo'
		});
		*/

+function($) {

	var Combobox = $.InputComp.extend({
		initialize: function(element, options, viewModel) {
			var self = this
			
			this.hasDataTable = true;
		var newOptions = {};
		newOptions.el = element;
		newOptions.options = options;
		newOptions.model = viewModel;
		$.InputComp.superclass.initialize.call(this, newOptions);
        this.element = element;
        this.required = this.options['required'];
        this.maxLength = null;
        this.minLength = null;
        this.max = null;
        this.min = null;
        this.regExp = null;
        this.placement = this.options['placement'];
        this.tipId = this.options['tipId'];
        this.errorMsg = this.options['errorMsg'];
        this.nullMsg = this.options['nullMsg'];


			this.datasource = $.getJSObject(viewModel, options['datasource'])
			this.single = options.single
			this.mutil = options.mutil
			this.validType = 'combo'
			if ($(this.element).children().length > 0)
				this.comboEle = $(this.element).find('div')[0]
			else
				this.comboEle = this.element
			this.create()	
			//$(this.comboEle).attr('contenteditable', true)
			if(this.mutil){
			   $(this.comboEle).on("mutilSelect",function(event,value){
			   	    self.setValue(value)
			   })
			}
			
			this.comp = $(this.comboEle).Combobox({
				readchange:false,
				dataSource: this.datasource,
				single:this.single,
				mutil:this.mutil,
				onSelect: function(item) {
					self.setValue(item.pk)
					self.trigger('onSelect',item)
//					if (self.onSelect) {
//						self.onSelect(item)
//					}
				}
			})
		},
		/**
		 * 增加dom事件
		 * @param {String} name
		 * @param {Function} callback
		 */
		addDomEvent: function(name, callback){
			$(this.comboEle).on(name, callback)
			return this
		},
		/**
		 * 移除dom事件
		 * @param {String} name
		 */
		removeDomEvent: function(name){
			$(this.comboEle).off(name)
		},
		modelValueChange: function(value) {
			if (this.slice) return
//			value = value || ""
			this.trueValue = value
			$(this.comboEle).val(value);	

		},
		setValue: function(value) {
			this.trueValue = value
			$(this.comboEle).val(value);			
			this.slice = true
			this.setModelValue(this.trueValue)
			this.slice = false
			//this.trigger(Combobox.EVENT_VALUE_CHANGE, this.trueValue)
		},
		getValue: function() {
			return this.trueValue
		},
		setEnable: function(enable) {
			if (enable === true || enable === 'true') {
				this.enable = true				
				$(this.comboEle).data("enable",true)
				$(this.comboEle).parent().removeClass('disablecover').parent().find('.covershade').remove()
			} else if (enable === false || enable === 'false') {
				this.enable = false				
				$(this.comboEle).data("enable",false)
				$(this.comboEle).parent().addClass('disablecover').parent().prepend('<div class="covershade"></div>')
				
			}
		},
		Statics: {
			compName: 'combo'
		}
	})

	if ($.compManager)
		$.compManager.addPlug(Combobox)
	$.Combobox = Combobox;
}($);

+function($ ) {
	var CheckboxComp = $.InputComp.extend({
		initialize: function(element, options, viewModel) {
			
			var self = this
			CheckboxComp.superclass.initialize.apply(this, arguments)
			this.create()
			
			if($.app){
				$(this.element).wrap("<label class='label-switch'></label>").after("<div class='checkbox'></div>").css("display","none")
				
    		}else{
				if($(this.element).parent(".checkbox").length === 0 && !iweb.browser.isIE8){
					$(this.element).wrap("<div class='checkbox check-success'></div>").after("<label for="+element.id+"></label>")
				}
			}
    		$(this.element).on('change',function(){
					var val = element.checked ? 'Y' : 'N'
					
					self.setValue(val)
			})
			
		},

		modelValueChange: function(val) {
			if (this.slice) return
			val = val || ""
			this.trueValue = val
			if (val == 'Y' || val == 'true') {
				this.showValue = true;
			} else if (val == 'N' || val == 'false') {
				this.showValue = false;
			} else {
				this.showValue = false;
			}
			this.setShowValue(this.showValue)
		},
		setValue: function(val) {
			this.trueValue = val
			if (val == 'Y' || val == 'true') {
				this.showValue = true;
			} else if (val == 'N' || val == 'false') {
				this.showValue = false;
			} else {
				this.showValue = false;
			}
			this.setShowValue(this.showValue)
			this.slice = true
			this.setModelValue(this.trueValue)
			this.slice = false
			// this.trigger(CheckboxComp.EVENT_VALUE_CHANGE, this.trueValue)
		},
		getValue: function() {
			return this.trueValue
		},
		setShowValue: function(showValue) {
			this.showValue = showValue
			this.element.checked = showValue
		},
		getShowValue: function() {
			return this.showValue
		},
		setEnable: function(enable) {
			if (enable === true || enable === 'true') {
				this.enable = true
				$(this.element).parent().removeClass('disablecover').parent().find('.covershade').remove()
			} else if (enable === false || enable === 'false') {
				this.enable = false
				var tmpelement = $(this.element)
				if(tmpelement.parent().hasClass('disablecover')){ return};
				tmpelement.parent().addClass('disablecover').before('<div class="covershade"></div>')
			}
		},

		Statics: {
			compName: 'check'
		}
	})

	if ($.compManager)
		$.compManager.addPlug(CheckboxComp)
	$.CheckboxComp = CheckboxComp;
}($);

/** 
 * datatable v3.0.3
 * 
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/datatable#readme
 * bugs : https://github.com/iuap-design/datatable/issues
 **/ 
u.GridAdapter = u.BaseAdapter.extend({
	
	initialize: function(options) {
		// 初始options中包含grid的属性设置，还需要增加dataSource、columns、transMap以及事件处理

		var opt = options['options'] || {},
				viewModel = options['model'];
		var element = typeof options['el'] === 'string' ? document.querySelector(options['el']) : options['el'];
		var app = options['app'];
		this.id = opt['id'];
		options = opt;

		var oThis = this;
		var compDiv = null;
		var comp = null;
		this.dataTable = u.getJSObject(viewModel, options["data"]);
		this.element = element;
		this.$element = $(element);
		this.editComponentDiv = {};
		this.editComponent = {};
		this.id = options['id'];
		this.gridOptions = options;


		
		// 在html中将函数类参数进行处理
		this.gridOptions.onBeforeRowSelected = u.getFunction(viewModel,this.gridOptions.onBeforeRowSelected);
		this.gridOptions.onRowSelected = u.getFunction(viewModel,this.gridOptions.onRowSelected);
		this.gridOptions.onBeforeRowUnSelected = u.getFunction(viewModel,this.gridOptions.onBeforeRowUnSelected);
		this.gridOptions.onRowUnSelected = u.getFunction(viewModel,this.gridOptions.onRowUnSelected);
		this.gridOptions.onBeforeAllRowSelected = u.getFunction(viewModel,this.gridOptions.onBeforeAllRowSelected);
		this.gridOptions.onAllRowSelected = u.getFunction(viewModel,this.gridOptions.onAllRowSelected);
		this.gridOptions.onBeforeAllRowUnSelected = u.getFunction(viewModel,this.gridOptions.onBeforeAllRowUnSelected);
		this.gridOptions.onAllRowUnSelected = u.getFunction(viewModel,this.gridOptions.onAllRowUnSelected);
		this.gridOptions.onBeforeRowFocus = u.getFunction(viewModel,this.gridOptions.onBeforeRowFocus);
		this.gridOptions.onRowFocus = u.getFunction(viewModel,this.gridOptions.onRowFocus);
		this.gridOptions.onBeforeRowUnFocus = u.getFunction(viewModel,this.gridOptions.onBeforeRowUnFocus);
		this.gridOptions.onRowUnFocus = u.getFunction(viewModel,this.gridOptions.onRowUnFocus);
		this.gridOptions.onDblClickFun = u.getFunction(viewModel,this.gridOptions.onDblClickFun);
		this.gridOptions.onValueChange = u.getFunction(viewModel,this.gridOptions.onValueChange);
		this.gridOptions.onBeforeClickFun = u.getFunction(viewModel,this.gridOptions.onBeforeClickFun);
		this.gridOptions.onBeforeEditFun = u.getFunction(viewModel,this.gridOptions.onBeforeEditFun);
		this.gridOptions.onRowHover = u.getFunction(viewModel,this.gridOptions.onRowHover);
		
		/*
		 * 处理column参数  item
		 * div子项div存储column信息
		 */
		var columns = [];
		$("div",this.$element).each(function() {
			var ops = $(this).attr('options')
			if(typeof(ops) == "undefined")
				var column = eval("(" + ops+")");
			else
				var column = JSON.parse(ops);
			// 处理精度，以dataTable的精度为准
			
			/*处理editType*/
			var eType = u.getFunction(viewModel, column.editType);
			var rType = u.getFunction(viewModel, column.renderType);
			var afterEType = u.getFunction(viewModel, column.afterEType);
			var afterRType = u.getFunction(viewModel, column.afterRType);
			var sumRenderType = u.getFunction(viewModel, column.sumRenderType);
			column.sumRenderType = sumRenderType;
			var eOptions = {};
			if(column.editOptions){
				if(typeof(column.editOptions) == "undefined")
					var eOptions = eval("(" + column.editOptions +")");
				else
					var eOptions = column.editOptions;
			}
			eOptions.data = options['data']
			eOptions.field = column['field']
			// 默认按照string处理
			if(eType == '')
					eType = 'string';
			if(eType == 'string' || eType == 'integer' || eType == 'checkbox' || eType == 'combo' || eType == 'radio' || eType == 'float' || eType == 'currency' || eType == 'datetime'|| eType == 'date' || eType == 'time' || eType == 'url' || eType == 'password' || eType == 'percent'){
				oThis.createDefaultEdit(eType,eOptions,options,viewModel,column);
				column.editType = function(obj){
					if(oThis.editComponentDiv[column.field] && oThis.editComponentDiv[column.field][0].childNodes.length > 0){
					}else{
						//IE8有问题，所以需要重新创建div,将上面的代码直接拷贝
						oThis.createDefaultEdit(eType,eOptions,options,viewModel,column);
					}
					var comp = oThis.editComponent[column.field]
					if (!comp){
						$(obj.element).parent().focus();
						return
					}
					obj.element.innerHTML = '';
					var row = oThis.getDataTableRow(obj.rowObj)
					$(obj.element).append(oThis.editComponentDiv[column.field]);
					if(comp.required) {
						$(obj.element).parent().parent().find('.u-grid-edit-mustFlag').show()
					}

					// checkbox 类型  此段逻辑不知道是什么，暂时注释掉
					// if($Div.find('.checkbox').length > 0) {
					// 	$Div.closest('.u-grid-edit-div').css({'position': 'absolute', 'left': '83px'});
					// 	$Div.closest('.u-grid-edit-whole-div').find('.u-grid-edit-label').css({'margin-left': '112px', 'text-align': 'left'})
					// }
					$(obj.element).parent().focus();
					comp.modelValueChange(obj.value);


					// 根据惊道需求增加editype之后的处理,此处只针对grid.js中的默认eType进行处理，非默认通过eType进行处理
					if(typeof afterEType == 'function'){
						afterEType.call(this,obj);
					}
				}
			}else if (typeof eType == 'function'){
				column.editType = eType;
			}
			
			if(rType == 'booleanRender'){
				column.renderType = function(obj){
					var checkStr = '';
					if(obj.value == 'Y'){
						checkStr = 'checked';
					}
					var htmlStr = '<input type="checkbox"   style="cursor:default;" disabled ' + checkStr +'>'
					obj.element.innerHTML = htmlStr;

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'integerRender'){
				column.renderType = function(obj){
					var grid = obj.gridObj											
					var column = obj.gridCompColumn
					var field = column.options.field
					obj.element.innerHTML =  obj.value
					/*设置header为right*/
					$('#' + grid.options.id + '_header_table').find('th[field="'+field+'"]').css('text-align', 'right');
					$(obj.element).css('text-align', 'right')	
					$(obj.element).css('color', '#e33c37')
					$(obj.element).find('.u-grid-header-link').css('padding-right','3em')
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'currencyRender'){
				column.renderType = function(obj){
					//需要处理精度
					
					var grid = obj.gridObj											
					var column = obj.gridCompColumn
					var field = column.options.field
					var rowIndex = obj.rowIndex
					var datatable = grid.dataTable
					var rowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
					var row = datatable.getRowByRowId(rowId);				
					if(!row)
						return;
					var rprec = row.getMeta(field, 'precision')
					var maskerMeta = iweb.Core.getMaskerMeta('float') || {}
					var precision = typeof(parseFloat(rprec)) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;

					maskerMeta.precision = precision || maskerMeta.precision
					var formater = new u.NumberFormater(maskerMeta.precision);
					var masker = new u.NumberMasker(maskerMeta);
					var svalue = masker.format(formater.format(obj.value)).value
					obj.element.innerHTML =  svalue
					/*设置header为right*/
					$('#' + grid.options.id + '_header_table').find('th[field="'+field+'"]').css('text-align', 'right');
					$(obj.element).css('text-align', 'right')
					$(obj.element).css('color', '#e33c37')
					$(obj.element).find('.u-grid-header-link').css('padding-right','3em')
					$(obj.element).attr('title', svalue)

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'floatRender'){
				column.renderType = function(obj){
					//需要处理精度
					
					var grid = obj.gridObj											
					var column = obj.gridCompColumn
					var field = column.options.field
					var rowIndex = obj.rowIndex
					var datatable = grid.dataTable
					var rowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
					var row = datatable.getRowByRowId(rowId);				
					if(!row)
						return;
					var rprec =  row.getMeta(field, 'precision') || column.options.precision;
					var maskerMeta = iweb.Core.getMaskerMeta('float') || {}
					var precision = typeof(parseFloat(rprec)) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;

					var formater = new u.NumberFormater(maskerMeta.precision);
					var masker = new u.NumberMasker(maskerMeta);
					var svalue = masker.format(formater.format(obj.value)).value
					obj.element.innerHTML =  svalue 
					/*设置header为right*/
					$('#' + grid.options.id + '_header_table').find('th[field="'+field+'"]').css('text-align', 'right');
					$(obj.element).css('text-align', 'right')
					$(obj.element).css('color', '#e33c37')
					$(obj.element).find('.u-grid-header-link').css('padding-right','3em')
					$(obj.element).attr('title', svalue)

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'comboRender'){
				column.renderType = function(obj){
				  
				  //需要将key转化为name
					var ds = u.getJSObject(viewModel, eOptions['datasource'])
				
					obj.element.innerHTML = '';
					if(nameArr){
						nameArr.length = 0
					}
					
					var valArr = obj.value.split(',')
					var nameArr = []
					for( var i=0,length=ds.length; i<length; i++){
                      for(var j=0; j<valArr.length;j++){
                      	  if(ds[i].value == valArr[j]){
                      	  	  nameArr.push(ds[i].name)
                      	  }
                      }
					}	
					var svalue = nameArr.toString()
					if(!svalue)
						svalue = obj.value;
					obj.element.innerHTML = svalue;
					$(obj.element).attr('title', svalue)
				  				  
				  	// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'dateRender'){
				//通过grid的dataType为Date format处理
				column.renderType = function(obj){
					var svalue =  u.dateRender(obj.value, obj.gridCompColumn.options['format']);
					obj.element.innerHTML = svalue;
					$(obj.element).attr('title', svalue)
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'dateTimeRender'){
				//通过grid的dataType为DateTime format处理
				column.renderType = function(obj){
					var svalue = u.dateTimeRender(obj.value)
					obj.element.innerHTML = svalue;
					$(obj.element).attr('title', svalue)

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if (typeof rType == 'function'){
				column.renderType =  rType
			}else if(rType == 'radioRender'){
				column.renderType = function(params){
					//debugger
					var ds = u.getJSObject(viewModel, eOptions['datasource'])
					var value = params.value
					var compDiv = $('<div class="u-grid-edit-item-radio"></div>');
					
					params.element.innerHTML = ""
					$(params.element).append(compDiv)

					for(var i = 0;i < ds.length;i++){
						if(ds[i].pk==value)
							compDiv.append('<input name="'+column.field+params.row.value['$_#_@_id']+'" type="radio" value="'+ds[i].pk +'" checked="true" /><i data-role="name">' +ds[i].name+ '</i>')
						else
							compDiv.append('<input name="'+column.field+params.row.value['$_#_@_id']+'" type="radio" value="'+ds[i].pk +'"/><i data-role="name">' +ds[i].name+ '</i>')
					}
					compDiv.find(":radio").each(function() {

						$(this).on('click', function() {

							var val = this.value
							compDiv.find(":radio").each(function() {
								if (this.value == val) {
									this.checked = true;
								}else{
									this.checked = false;
								}
							})
							var grid = params.gridObj
							var column = params.gridCompColumn
							var field = column.options.field
							var datatable = grid.dataTable
							//var rowIndex = params.rowIndex
							//var tmprowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
							var rowId = params.row.value['$_#_@_id'];

							var row = datatable.getRowByRowId(rowId);

							row.setValue(field,val)
						})
					})
//					var comp = new $.compManager.plugs.radio(compDiv[0],eOptions,viewModel);					
//					for( var i=0,length=rdo.length; i<length; i++){
//					   if(rdo[i].pk==value){
//					   	 obj.element.innerHTML = '<input type="radio" checked><i data-role="name">'+rdo[i].name+'</i>';
//					   	 break;
//					   }
//					}				
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'urlRender'){
				//通过grid的dataType为DateTime format处理
				column.renderType = function(obj){
					obj.element.innerHTML = '<a href="' + obj.value + '" target="_blank">' + obj.value +'</a>';

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'passwordRender'){
				//通过grid的dataType为DateTime format处理
				column.renderType = function(obj){
					obj.element.innerHTML = '<input type="password" disable="true" readonly="readonly" style="border:0px;background:none;padding:0px;" value="' + obj.value + '" title=""><span class="fa fa-eye right-span" ></span>';
					var span = obj.element.querySelector('span');
					var input = obj.element.querySelector('input');
					input.value = obj.value;
					$(span).on('click',function(){
						if(input.type == 'password'){
							input.type = 'text'
						}
						else{
							input.type = 'password'
						}
					})
					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}else if(rType == 'percentRender'){
				column.renderType = function(obj){
					//需要处理精度
					
					var grid = obj.gridObj											
					var column = obj.gridCompColumn
					var field = column.options.field
					var rowIndex = obj.rowIndex
					var datatable = grid.dataTable
					var rowId =  $(grid.dataSourceObj.rows[rowIndex].value).attr("$_#_@_id");
					var row = datatable.getRowByRowId(rowId);				
					if(!row)
						return;
					var rprec =  row.getMeta(field, 'precision') || column.options.precision;
					var maskerMeta = iweb.Core.getMaskerMeta('percent') || {}
					var precision = typeof(parseFloat(rprec)) == 'number' ? rprec : maskerMeta.precision;
					maskerMeta.precision = precision;
					if (maskerMeta.precision){
			            maskerMeta.precision = parseInt(maskerMeta.precision) + 2;
			        }

					var formater = new u.NumberFormater(maskerMeta.precision);
					var masker = new u.PercentMasker(maskerMeta)
					var svalue = masker.format(formater.format(obj.value)).value
					obj.element.innerHTML =  svalue
					$(obj.element).css('text-align', 'right')
					$(obj.element).attr('title', svalue)

					// 根据惊道需求增加renderType之后的处理,此处只针对grid.js中的默认render进行处理，非默认通过renderType进行处理
					if(typeof afterRType == 'function'){
						afterRType.call(this,obj);
					}
				}
			}

			var defineSumRenderType = column.sumRenderType;
			column.sumRenderType = function(obj){
				obj.value = parseFloat(obj.value);
				var grid = obj.gridObj											
				var column = obj.gridCompColumn
				var rprec = column.options.precision;
				var maskerMeta = iweb.Core.getMaskerMeta('float') || {}
				var precision = rprec == 0 || (rprec && typeof(parseFloat(rprec)) == 'number')? rprec : maskerMeta.precision;
				maskerMeta.precision = precision;

				var formater = new u.NumberFormater(maskerMeta.precision);
				var masker = new u.NumberMasker(maskerMeta);
				var svalue = masker.format(formater.format(obj.value)).value
				obj.element.innerHTML =  svalue
				$(obj.element).parent().css('text-align', 'right')
				$(obj.element).css('text-align', 'right')
				$(obj.element).attr('title', svalue)
				if(typeof defineSumRenderType == 'function')
					defineSumRenderType.call(grid,obj);
			}

			columns.push(column);	
		});
		
		if (app && app.adjustFunc)
			app.adjustFunc.call(app, {id: this.id, type:'gridColumn', columns:columns});

		this.gridOptions.columns = columns;
		
		
		/*
		 * 处理viewModel与grid之间的绑定
		 * 
		 */
		var onRowSelectedFun = this.gridOptions.onRowSelected; 
		// 选中
		this.gridOptions.onRowSelected = function(obj) {
			var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
			var index = oThis.dataTable.getIndexByRowId(rowId);
			if(oThis.grid.options.multiSelect){
				oThis.dataTable.addRowsSelect([index]);
			}else{
				oThis.dataTable.setRowSelect(index);
			}
			
			if(onRowSelectedFun){
				onRowSelectedFun.call(oThis,obj);
			}
		};
		this.dataTable.on(u.DataTable.ON_ROW_SELECT, function(event) {
			/*index转化为grid的index*/
			$.each(event.rowIds, function() {
				var index = oThis.grid.getRowIndexByValue('$_#_@_id',this);
				var selectFlag = true;
				if(index > -1){
					selectFlag = oThis.grid.setRowSelect(parseInt(index));
					if(!selectFlag){
						oThis.dataTable.setRowUnSelect(oThis.dataTable.getIndexByRowId(this));
					}
				}
			});
		});
		
		//全选
		this.dataTable.on(u.DataTable.ON_ROW_ALLSELECT, function(event) {
			oThis.grid.setAllRowSelect()
		});
		
		//全返选
		this.dataTable.on(u.DataTable.ON_ROW_ALLUNSELECT, function(event) {
			oThis.grid.setAllRowUnSelect()
		});
		
		// 反选
		var onRowUnSelectedFun = this.gridOptions.onRowUnSelected; 
		this.gridOptions.onRowUnSelected = function(obj) {
			var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
			var index = oThis.dataTable.getIndexByRowId(rowId);
			oThis.dataTable.setRowUnSelect(index);
			if(onRowUnSelectedFun){
				onRowUnSelectedFun.call(oThis,obj);
			}
		};
		this.dataTable.on(u.DataTable.ON_ROW_UNSELECT, function(event) {
			$.each(event.rowIds, function() {
				var index = oThis.grid.getRowIndexByValue('$_#_@_id',this);
				var unSelectFlag = true;
				if(index > -1){
					unSelectFlag = oThis.grid.setRowUnselect(parseInt(index));
					if(!unSelectFlag){
						if(oThis.grid.options.multiSelect){
							oThis.dataTable.addRowsSelect([oThis.dataTable.getIndexByRowId(this)]);
						}else{
							oThis.dataTable.setRowSelect(oThis.dataTable.getIndexByRowId(this));
						}
					}
				}
			});
		});
		
		var onRowFocusFun = this.gridOptions.onRowFocus; 
		// focus
		this.gridOptions.onRowFocus = function(obj) {
			var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
			var index = oThis.dataTable.getIndexByRowId(rowId);
			
			if(oThis.grid.options.rowClickBan) {
				oThis.dataTable.setRowFocus(index, true);
			} else {
				oThis.dataTable.setRowFocus(index);
			}
			
			if(onRowFocusFun){
				onRowFocusFun.call(oThis,obj);
			}
		};
		this.dataTable.on(u.DataTable.ON_ROW_FOCUS, function(event) {
			/*index转化为grid的index*/
			var index = oThis.grid.getRowIndexByValue('$_#_@_id',event.rowId);
		
			var focusFlag = true;
			if(index > -1){
				focusFlag = oThis.grid.setRowFocus(parseInt(index));
				
				if(!focusFlag){
					oThis.dataTable.setRowUnFocus(oThis.dataTable.getIndexByRowId(event.rowId));
				}
			}
		});
		
		// 反focus
		var onRowUnFocusFun = this.gridOptions.onRowUnFocus; 
		this.gridOptions.onRowUnFocus = function(obj) {
			var rowId = oThis.grid.dataSourceObj.rows[obj.rowIndex].value['$_#_@_id'];
			var index = oThis.dataTable.getIndexByRowId(rowId);
			oThis.dataTable.setRowUnFocus(index);
			if(onRowUnFocusFun){
				onRowUnFocusFun.call(oThis,obj);
			}
		};
		this.dataTable.on(u.DataTable.ON_ROW_UNFOCUS, function(event) {
			var index = oThis.grid.getRowIndexByValue('$_#_@_id',event.rowId);
			var unFocusFlag = true;
			if(index > -1){
				unFocusFlag = oThis.grid.setRowUnFocus(parseInt(index));
				if(!unFocusFlag){
					oThis.dataTable.setRowFocus(oThis.dataTable.getIndexByRowId(event.rowId));
				}
			}
		});
		
		// 增行,只考虑viewModel传入grid
//		var onRowInsertFun = this.gridOptions.onRowInsert; 
//		this.gridOptions.onRowInsert = function(obj){
//			dataTable.insertRow(obj.index,obj.row);
//			if(onRowSelectedFun){
//				viewModel[onRowUnSelectedFun].call(grid,grid, row, rowindex);
//			}
//		};
		this.dataTable.on(u.DataTable.ON_INSERT, function(event) {
			var gridRows = new Array();
			$.each(event.rows,function(){
				var row = this.data;
				var id = this.rowId;
				var gridRow = {};
				for(var filed in row){
					gridRow[filed] = row[filed].value;
				}
				gridRow['$_#_@_id'] = id;
				gridRows.push(gridRow); 
			})
			oThis.grid.addRows(gridRows,event.index);
		});
		
		this.dataTable.on(u.DataTable.ON_UPDATE, function(event) {
			$.each(event.rows,function(){
				var row = this.data;
				var id = this.rowId;
				var gridRow = {};
				for(var filed in row){
					gridRow[filed] = row[filed].value;
				}
				gridRow['$_#_@_id'] = id;
				var index = oThis.grid.getRowIndexByValue('$_#_@_id',id);
				oThis.grid.updateRow(index,gridRow);
			})
			
		});		
		
		this.dataTable.on(u.DataTable.ON_VALUE_CHANGE, function(obj) {
	
			var id = obj.rowId;
			var index = oThis.grid.getRowIndexByValue('$_#_@_id',id);
			if(index == -1) {
				return;
			}
			var field = obj.field;
			var value = obj.newValue;
			oThis.grid.updateValueAt(index,field,value);
			//oThis.grid.editClose();
		});		
		
		// 删除行,只考虑viewModel传入grid
//		this.gridOptions.onRowDelete = function(obj){
//			dataTable.removeRow(obj.index);
//		};
		this.dataTable.on(u.DataTable.ON_DELETE, function(event) {
			/*index转化为grid的index*/
			var gridIndexs = new Array();
			$.each(event.rowIds, function() {
				var index = oThis.grid.getRowIndexByValue('$_#_@_id',this);
				gridIndexs.push(index);
			});
			oThis.grid.deleteRows(gridIndexs);
		});
		
		this.dataTable.on(u.DataTable.ON_DELETE_ALL, function(event) {
			oThis.grid.setDataSource({})
		});		
		
		// 数据改变
		var onValueChangeFun = this.gridOptions.onValueChange; 
		this.gridOptions.onValueChange = function(obj) {
			var row = oThis.getDataTableRow(oThis.grid.dataSourceObj.rows[obj.rowIndex].value)
			if(row){
				if($.type(obj.newValue) == 'object') {
					row.setValue(obj.field, obj.newValue.trueValue);
					row.setMeta(obj.field, 'display', obj.newValue.showValue);
				} else {
					row.setValue(obj.field,obj.newValue);
				}
			}
			if(onValueChangeFun){
				onValueChangeFun.call(oThis,obj);
			}
		};
		this.dataTable.on('valueChange', function(event) {
			var field = event.field,
				rowId = event.rowId,
				oldValue = event.oldValue,
				newValue = event.newValue;
			var rowIndex = oThis.grid.getRowIndexByValue('$_#_@_id',rowId);
			if(rowIndex > -1){
				oThis.grid.updateValueAt(rowIndex,field,newValue);	
			}
		});
		// 加载数据,只考虑viewModel传入grid
		this.dataTable.on(u.DataTable.ON_LOAD, function(data) {
			if(data.length > 0){
				var values = new Array();
				
				$.each(data, function() {
					var value = {};
					var dataObj = this.data;
					var id = this.rowId;
					for(var p in dataObj){
						var v = dataObj[p].value;
						value[p] = v;
					} 
					value['$_#_@_id'] = id;
					values.push(value);
				});
				var dataSource = {};
				dataSource['values'] = values;
				oThis.grid.setDataSource(dataSource);
			}
		});
		this.dataTable.on(u.DataTable.ON_ENABLE_CHANGE, function(enable) {		
			oThis.grid.setEditable(enable.enable);
		});

		this.dataTable.on(u.DataTable.ON_ROW_META_CHANGE, function(event){
			var field = event.field,
				meta = event.meta,
				row = event.row,
				newValue = event.newValue
			if (meta == 'required'){
				oThis.grid.setRequired(field, newValue)
			}
			if (meta == 'precision'){
				var comp = oThis.editComponent[field];
				if(comp) {
					comp.setPrecision(newValue)
				}

				var index = oThis.grid.getRowIndexByValue('$_#_@_id',row.rowId);
				if(index == -1) {
					return;
				}
				var value = row.getValue(field)

				oThis.grid.updateValueAt(index,field,value,true);
			}
		})

		this.dataTable.on(u.DataTable.ON_META_CHANGE, function(event){
			var field = event.field
			var meta = event.meta
			if (meta == 'precision'){
				oThis.grid.renderTypeFun({field:field})
			}
		})

		this.gridOptions.transMap = {
			ml_show_column:trans('gridComp.show_column', '显示/隐藏列'),
			ml_clear_set:trans('gridComp.clear_set', '清除设置'),
			ml_no_rows:trans('gridComp.no_rows', '无数据'),
			ml_sum:trans('gridComp.sum', '合计:'),
			ml_close:trans('gridComp.close', '关闭')
		}
		// 创建grid
		this.grid = $(element).grid(this.gridOptions);
		this.grid.dataTable = this.dataTable
		this.grid.viewModel = viewModel
		this.grid.gridModel = this
		
		
		
		//如果先插入数据再创建grid需要处理 load
		var data = this.dataTable.rows(); 
		if(data.length > 0){
			var values = new Array();
				
			$.each(data, function() {
				var value = {};
				var dataObj = this.data;
				var id = this.rowId;
				for(var p in dataObj){
					var v = dataObj[p].value;
					value[p] = v;
				} 
				value['$_#_@_id'] = id;
				values.push(value);
			});
			var dataSource = {};
			dataSource['values'] = values;
			oThis.grid.setDataSource(dataSource);
		}
		// 选中行
		var selectIndexs = this.dataTable.getSelectedIndexs();
		if(selectIndexs.length > 0){
			$.each(selectIndexs, function() {
				oThis.grid.setRowSelect(this);	
			});
		}
		
		return this;
	},
	
	getName: function() {
		return 'grid'
	},
	createDefaultEdit:function(eType,eOptions,options,viewModel,column){
		var oThis = this;
		if(eType == 'string'){
			compDiv = $('<div><input type="text" class="u-grid-edit-item-string"></div>');
			if(!options.editType || options.editType =="default" ){
				compDiv.addClass("eType-input")
			}
			eOptions.dataType = 'string';
			comp = new u.StringAdapter({
				el:compDiv[0],
				options:eOptions,
				model: viewModel
			});

		}else if(eType == 'integer'){
			compDiv = $('<div><input type="text" class="u-grid-edit-item-integer"></div>');
			if(!options.editType || options.editType =="default" ){
				compDiv.addClass("eType-input")
			}
			eOptions.dataType = 'integer';
			comp = new u.IntegerAdapter({
				el:compDiv[0],
				options:eOptions,
				model: viewModel
			});

			//comp = new $.compManager.plugs.integer(compDiv.find("input")[0],eOptions,viewModel);

		} else if(eType == 'checkbox'){
			compDiv = $('<div><input id="' + oThis.id + "_edit_field_" + column['field'] + '" type="checkbox" class="u-grid-edit-item-checkbox"></div>');
			//eOptions.dataType = 'integer';
			
			if($.CheckboxComp){
				comp = new $.CheckboxComp(compDiv.find("input")[0],eOptions,viewModel);
			}else{
				comp = new u.CheckboxAdapter({
					el:compDiv[0],
					options:eOptions,
					model: viewModel
				});
			}
			

			//comp = new $.compManager.plugs.check(compDiv.find("input")[0],eOptions,viewModel);

		}else if(eType == 'combo'){
			// compDiv = $('<div class="input-group  form_date u-grid-edit-item-comb"><div  type="text" class="form-control grid-combox"></div><i class="input-group-addon" ><i class="fa fa-angle-down"></i></i></div>');
			compDiv = $('<div class="eType-input"><input type="text" class="u-grid-edit-item-float"></div>');
			//comp = new $.compManager.plugs.combo(compDiv[0],eOptions,viewModel);
			//comp = new u.Combobox({
			//	el:compDiv[0],
			//	options:eOptions,
			//	model: viewModel
			//});
			if($.Combobox){ //兼容旧版本
				compDiv = $('<div class="input-group  form_date u-grid-edit-item-comb"><div  type="text" class="form-control grid-combox"></div><i class="input-group-addon" ><i class="fa fa-angle-down"></i></i></div>');
				comp = new $.Combobox(compDiv[0],eOptions,viewModel)
			}else{
				comp = new u.ComboboxAdapter({
					el:compDiv[0],
					options:eOptions,
					model: viewModel
				});
				if(oThis.gridOptions.customEditPanelClass){
					if(oThis.gridOptions.customEditPanelClass.indexOf('u-combo-ul') < 0){
						oThis.gridOptions.customEditPanelClass += ',u-combo-ul';
					}
				}else{
					oThis.gridOptions.customEditPanelClass = 'u-combo-ul';
				}
			}

			
		}else if(eType == 'radio'){
			if(!options.editType || options.editType =="default" ){
				compDiv = null;
				comp = null;
			}else {
				compDiv = $('<div class="u-grid-edit-item-radio"><input type="radio" name="identity" /><i data-role="name"></i></div>');
				//comp = new $.compManager.plugs.radio(compDiv[0],eOptions,viewModel);
				comp = new u.RadioAdapter({
					el:compDiv[0],
					options:eOptions,
					model: viewModel
				});

			}
		}else if(eType == 'float'){
			compDiv = $('<div><input type="text" class="u-grid-edit-item-float"></div>');
			if(!options.editType || options.editType =="default" ){
				compDiv.addClass("eType-input")
			}
			//comp = new $.compManager.plugs.float(compDiv.find("input")[0],eOptions,viewModel);
			eOptions.dataType = 'float';
			comp = new u.FloatAdapter({
				el:compDiv[0],
				options:eOptions,
				model: viewModel
			});

		}else if(eType == 'currency'){
			compDiv = $('<div><input type="text" class="u-grid-edit-item-currency"></div>');
			if(!options.editType || options.editType =="default" ){
				compDiv.addClass("eType-input")
			}
			//comp = new $.compManager.plugs.currency(compDiv.find("input")[0],eOptions,viewModel);
			eOptions.dataType = 'currency';
			comp = new u.CurrencyAdapter({
				el:compDiv[0],
				options:eOptions,
				model: viewModel
			});

		}else if(eType == 'datetime'){
			compDiv = $('<div class="input-group u-grid-edit-item-datetime" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');
			
			//comp = new $.compManager.plugs.datetime(compDiv[0],eOptions,viewModel);
			if($.DateTime){
				comp = new $.DateTime(compDiv[0],eOptions,viewModel);
			}else{
				comp = new u.DateTimeAdapter({
					el:compDiv[0],
					options:eOptions,
					model: viewModel
				});
				if(oThis.gridOptions.customEditPanelClass){
					if(oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0){
						oThis.gridOptions.customEditPanelClass += ',u-date-panel';
					}
				}else{
					oThis.gridOptions.customEditPanelClass = 'u-date-panel';
				}
			}

		}else if(eType == 'date'){
			compDiv = $('<div class="input-group u-grid-edit-item-date" ><input class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span></div>');
			
			//comp = new $.compManager.plugs.date(compDiv[0],eOptions,viewModel);
			if($.DateComp){
				comp = new $.DateComp(compDiv[0],eOptions,viewModel);
			}else{
				eOptions.type = 'u-date';
				comp = new u.DateTimeAdapter({
					el:compDiv[0],
					options:eOptions,
					model: viewModel
				});
				if(oThis.gridOptions.customEditPanelClass){
					if(oThis.gridOptions.customEditPanelClass.indexOf('u-date-panel') < 0){
						oThis.gridOptions.customEditPanelClass += ',u-date-panel';
					}
				}else{
					oThis.gridOptions.customEditPanelClass = 'u-date-panel';
				}
			}
			

		}else if(eType == 'url'){
			compDiv = $('<div><input type="text" class="u-grid-edit-item-string"></div>');
			if(!options.editType || options.editType =="default" ){
				compDiv.addClass("eType-input")
			}
			eOptions.dataType = 'url';
			comp = new u.UrlAdapter({
				el:compDiv[0],
				options:eOptions,
				model: viewModel
			});
			//$.compManager.plugs.string(compDiv.find("input")[0],eOptions,viewModel);

		}else if(eType == 'password'){
			compDiv = $('<div><input type="text" class="u-grid-edit-item-string"><span class="fa fa-eye right-span"></span></div>');
			if(!options.editType || options.editType =="default" ){
				compDiv.addClass("eType-input")
			}
			eOptions.dataType = 'password';
			comp = new u.PassWordAdapter({
				el:compDiv[0],
				options:eOptions,
				model: viewModel
			});
			//$.compManager.plugs.string(compDiv.find("input")[0],eOptions,viewModel);

		}else if(eType == 'percent'){

			compDiv = $('<div><input type="text" class="u-grid-edit-item-float"></div>');
			if(!options.editType || options.editType =="default" ){
				compDiv.addClass("eType-input")
			}
			//comp = new $.compManager.plugs.float(compDiv.find("input")[0],eOptions,viewModel);
			eOptions.dataType = 'precent';
			comp = new u.PercentAdapter({
				el:compDiv[0],
				options:eOptions,
				model: viewModel
			});
		}
		// input输入blur时显示下一个编辑控件
		$('input',$(compDiv)).on('blur',function(e){
			oThis.grid.nextEditShow();
		});
		if (comp && comp.dataAdapter){
			comp = comp.dataAdapter;
		}

		oThis.editComponentDiv[column.field] = compDiv;
		oThis.editComponent[column.field] = comp;
	},
	
	
	
	/**
	 * 获取grid行对应的数据模型行对象
	 * @param {Object} gridRow
	 */
	getDataTableRow: function(gridRow){
		var rowId =  gridRow['$_#_@_id']
		var row = null
		var rowIndex = this.dataTable.getIndexByRowId(rowId)
		if(rowIndex > -1)
			row = this.dataTable.getRow(rowIndex);
		return row
	},
	
	setEnable: function(enable){
		this.grid.setEditable(enable);
	},
	
	setShowHeader: function(showHeader){
		this.grid.setShowHeader(showHeader);
	},
	
	// 传入要编辑的tr对应的jquery对象
	editRowFun: function(index){
		this.dataTable.setRowSelect(index);
		this.grid.editRowIndexFun(index);
	},
	/*
	grid校验之后不显示提示信息，只返回提示信息，由调用者主动处理
	传入参数：	trueValue 不处理
				showMsg 不处理
	返回：	passed 是否通过
			MsgObj 包含id以及提示信息，后续可扩展
			Msg 提示信息
	*/
	doValidate:function(options){
		var rows = this.grid.dataSourceObj.rows,
			gridColumnArr = this.grid.gridCompColumnArr,
			passed = true,
			MsgArr = new Array(),
			evalStr = '',
			rowMsg = '',
			wholeMsg = '',
			columnShowMsg = '';

		// 遍历所有列
		for(var j = 0; j < gridColumnArr.length;j++){
			// 遍历所有行
			var column = gridColumnArr[j],
				columnOptions = gridColumnArr[j].options,
				field = columnOptions.field,
				title = columnOptions.title,
				required = columnOptions.required,
				validType = columnOptions.editOptions.validType,
				placement = columnOptions.editOptions.placement,
				tipId = columnOptions.editOptions.tipId,
				errorMsg = columnOptions.editOptions.errorMsg,
				nullMsg = columnOptions.editOptions.nullMsg,
                maxLength = columnOptions.editOptions.maxLength,
                minLength = columnOptions.editOptions.minLength,
                max = columnOptions.editOptions.max,
                min = columnOptions.editOptions.min,
                maxNotEq = columnOptions.editOptions.maxNotEq,
                minNotEq = columnOptions.editOptions.minNotEq,
                reg = columnOptions.editOptions.regExp,
                columnPassedFlag = true,
                columnMsg = '';
            var validate = new u.Validate({
            	el:this.element,
                single: true,
                required: required,
                validType: validType,
                placement: placement,
                tipId: tipId,
                errorMsg: errorMsg,
                nullMsg: nullMsg,
                maxLength: maxLength,
                minLength: minLength,
                max: max,
                min: min,
                maxNotEq: maxNotEq,
                minNotEq: minNotEq,
                reg: reg
        	});
			for (var i = 0; i < rows.length; i++) {
				var value = rows[i].value[field];
            	var result = validate.check({pValue:value,showMsg:false});
            	passed = result.passed && passed;
            	if(!result.passed){
            		columnPassedFlag = false;
            		if(options.showMsg && columnMsg.indexOf(result.Msg) < 0){
            			columnMsg += result.Msg + ' ';
            		}
            		// 设置背景色
            		var index = this.grid.getIndexOfColumn(column);
            		var contentDiv = document.getElementById(this.grid.options.id + '_content_tbody');
            		var row = contentDiv.querySelectorAll('tr')[i];
            		var td = row.querySelectorAll('td')[index];
            		var div = td.querySelector('div')
            		u.addClass(td,'u-grid-err-td');
            		u.addClass(div,'u-grid-err-td');
            		evalStr = 'if(typeof obj' + i + ' == \'undefined\'){var obj' + i + '= {}; MsgArr.push(obj' + i + ');obj' + i + '.rowNum = ' + i + '; obj' + i + '.arr = new Array();}';
					eval(evalStr);
            		var msg = '(' + title + ')' + result.Msg + ';'; 
            		evalStr = 'obj' + i + '.arr.push(msg)';
            		eval(evalStr);
            	}
			}
			// 如果存在错误信息并且提示信息
			if(!columnPassedFlag && options.showMsg){
				columnShowMsg += title + ':' + columnMsg + '<br>';
			}
			
		}
		if(columnShowMsg)
			u.showMessage({msg:columnShowMsg,showSeconds:3})
		if(MsgArr.length > 0){
			MsgArr.sort(function(a1,a2){
				if(a1.rowNum > a2.rowNum)
					return 1
				else
					return -1
			})
		}

		for(var k = 0; k < MsgArr.length; k++){
			var rowNum = MsgArr[k].rowNum;
			rowMsg = MsgArr[k].arr.join('');
			wholeMsg += '第' + (rowNum + 1) + '行:' + rowMsg;
 		}

 		return {
 			passed:passed,
 			comp:this,
 			Msg:wholeMsg
 		}
	},
});

	//if ($.compManager)
	//	$.compManager.addPlug(Grid)


u.compMgr.addDataAdapter(
    {
        adapter: u.GridAdapter,
        name: 'grid'
        //dataType: 'float'
    })