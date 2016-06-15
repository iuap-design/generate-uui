"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var U_LANGUAGES = "i_languages";
var U_THEME = "u_theme";
var U_LOCALE = "u_locale";
var U_USERCODE = "usercode";
var enumerables = true,
    enumerablesTest = { toString: 1 },
    toString = Object.prototype.toString;

for (var i in enumerablesTest) {
	enumerables = null;
}
if (enumerables) {
	enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];
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
u.extend = function (object, config) {
	var args = arguments,
	    options;
	if (args.length > 1) {
		for (var len = 1; len < args.length; len++) {
			options = args[len];
			if (object && options && (typeof options === "undefined" ? "undefined" : _typeof(options)) === 'object') {
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
	setCookie: function setCookie(sName, sValue, oExpires, sPath, sDomain, bSecure) {
		var sCookie = sName + "=" + encodeURIComponent(sValue);
		if (oExpires) sCookie += "; expires=" + oExpires.toGMTString();
		if (sPath) sCookie += "; path=" + sPath;
		if (sDomain) sCookie += "; domain=" + sDomain;
		if (bSecure) sCookie += "; secure=" + bSecure;
		document.cookie = sCookie;
	},
	getCookie: function getCookie(sName) {
		var sRE = "(?:; )?" + sName + "=([^;]*);?";
		var oRE = new RegExp(sRE);

		if (oRE.test(document.cookie)) {
			return decodeURIComponent(RegExp["$1"]);
		} else return null;
	},
	/**
  * 创建一个带壳的对象,防止外部修改
  * @param {Object} proto
  */
	createShellObject: function createShellObject(proto) {
		var exf = function exf() {};
		exf.prototype = proto;
		return new exf();
	},
	execIgnoreError: function execIgnoreError(a, b, c) {
		try {
			a.call(b, c);
		} catch (e) {}
	},
	on: function on(element, eventName, child, listener) {
		if (!element) return;
		if (arguments.length < 4) {
			listener = child;
			child = undefined;
		} else {
			var childlistener = function childlistener(e) {
				if (!e) {
					return;
				}
				var tmpchildren = element.querySelectorAll(child);
				tmpchildren.forEach(function (node) {
					if (node == e.target) {
						listener.call(e.target, e);
					}
				});
			};
		}
		//capture = capture || false;

		if (!element["uEvent"]) {
			//在dom上添加记录区
			element["uEvent"] = {};
		}
		//判断是否元素上是否用通过on方法填加进去的事件
		if (!element["uEvent"][eventName]) {
			element["uEvent"][eventName] = [child ? childlistener : listener];
			if (u.event && u.event[eventName] && u.event[eventName].setup) {
				u.event[eventName].setup.call(element);
			}
			element["uEvent"][eventName + 'fn'] = function (e) {
				//火狐下有问题修改判断
				if (!e) e = typeof event != 'undefined' && event ? event : window.event;
				element["uEvent"][eventName].forEach(function (fn) {
					e.target = e.target || e.srcElement; //兼容IE8
					if (fn) fn.call(element, e);
				});
			};
			if (element.addEventListener) {
				// 用于支持DOM的浏览器
				element.addEventListener(eventName, element["uEvent"][eventName + 'fn']);
			} else if (element.attachEvent) {
				// 用于IE浏览器
				element.attachEvent("on" + eventName, element["uEvent"][eventName + 'fn']);
			} else {
				// 用于其它浏览器
				element["on" + eventName] = element["uEvent"][eventName + 'fn'];
			}
		} else {
			//如果有就直接往元素的记录区添加事件
			var lis = child ? childlistener : listener;
			var hasLis = false;
			element["uEvent"][eventName].forEach(function (fn) {
				if (fn == lis) {
					hasLis = true;
				}
			});
			if (!hasLis) {
				element["uEvent"][eventName].push(child ? childlistener : listener);
			}
		}
	},
	off: function off(element, eventName, listener) {
		//删除事件数组
		if (listener) {
			if (element && element["uEvent"] && element["uEvent"][eventName]) {
				element["uEvent"][eventName].forEach(function (fn, i) {
					if (fn == listener) {
						element["uEvent"][eventName].splice(i, 1);
					}
				});
			}
			return;
		}
		var eventfn = element["uEvent"][eventName + 'fn'];
		if (element.removeEventListener) {
			// 用于支持DOM的浏览器
			element.removeEventListener(eventName, eventfn);
		} else if (element.removeEvent) {
			// 用于IE浏览器
			element.removeEvent("on" + eventName, eventfn);
		} else {
			// 用于其它浏览器
			delete element["on" + eventName];
		}
		if (u.event && u.event[eventName] && u.event[eventName].teardown) {
			u.event[eventName].teardown.call(element);
		}
		element["uEvent"][eventName] = undefined;
		element["uEvent"][eventName + 'fn'] = undefined;
	},
	trigger: function trigger(element, eventName) {
		if (element["uEvent"] && element["uEvent"][eventName]) {
			element["uEvent"][eventName + 'fn']();
		}
	},
	/**
  * 增加样式
  * @param value
  * @returns {*}
  */
	addClass: function addClass(element, value) {
		if (typeof element.classList === 'undefined') {
			u._addClass(element, value);
		} else {
			element.classList.add(value);
		}
		return u;
	},
	removeClass: function removeClass(element, value) {
		if (typeof element.classList === 'undefined') {
			u._removeClass(element, value);
		} else {
			element.classList.remove(value);
		}
		return u;
	},
	hasClass: function hasClass(element, value) {
		if (!element) return false;
		if (element.nodeName && (element.nodeName === '#text' || element.nodeName === '#comment')) return false;
		if (typeof element.classList === 'undefined') {
			if (u._hasClass) return u._hasClass(element, value);
			return false;
		} else {
			return element.classList.contains(value);
		}
	},
	toggleClass: function toggleClass(element, value) {
		if (typeof element.classList === 'undefined') {
			return u._toggleClass(element, value);
		} else {
			return element.classList.toggle(value);
		}
	},
	closest: function closest(element, selector) {
		var tmp = element;
		while (tmp != null && !u.hasClass(tmp, selector) && tmp != document.body) {
			tmp = tmp.parentNode;
		}
		if (tmp == document.body) return null;
		return tmp;
	},
	css: function css(element, csstext, val) {
		if (csstext instanceof Object) {
			for (var k in csstext) {
				var tmpcss = csstext[k];
				if (["width", "height", "top", "bottom", "left", "right"].indexOf(k) > -1 && u.isNumber(tmpcss)) {
					tmpcss = tmpcss + "px";
				}
				element.style[k] = tmpcss;
			}
		} else {
			if (arguments.length > 2) {
				element.style[csstext] = val;
			} else {
				u.getStyle(element, csstext);
			}
		}
	},
	wrap: function wrap(element, parent) {
		var p = u.makeDOM(parent);
		element.parentNode.insertBefore(p, element);
		p.appendChild(element);
	},
	getStyle: function getStyle(element, key) {
		//不要在循环里用
		var allCSS;
		if (window.getComputedStyle) {
			allCSS = window.getComputedStyle(element);
		} else {
			allCSS = element.currentStyle;
		}
		if (allCSS[key] !== undefined) {
			return allCSS[key];
		} else {
			return "";
		}
	},
	/**
  * 统一zindex值, 不同控件每次显示时都取最大的zindex，防止显示错乱
  */
	getZIndex: function getZIndex() {
		if (!u.globalZIndex) {
			u.globalZIndex = 2000;
		}
		return u.globalZIndex++;
	},
	makeDOM: function makeDOM(htmlString) {
		var tempDiv = document.createElement("div");
		tempDiv.innerHTML = htmlString;
		var _dom = tempDiv.children[0];
		return _dom;
	},
	makeModal: function makeModal(element) {
		var overlayDiv = document.createElement('div');
		u.addClass(overlayDiv, 'u-overlay');
		overlayDiv.style.zIndex = u.getZIndex();
		document.body.appendChild(overlayDiv);
		element.style.zIndex = u.getZIndex();
		u.on(overlayDiv, 'click', function (e) {
			u.stopEvent(e);
		});
		return overlayDiv;
	},
	getOffset: function getOffset(Node, offset) {
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
		if (Node.offsetParent) return u.getOffset(Node.offsetParent, offset);else return offset;
	},
	getScroll: function getScroll(Node, offset) {
		if (!offset) {
			offset = {};
			offset.top = 0;
			offset.left = 0;
		}
		if (Node == document.body) {
			offset.top += Node.scrollTop;
			offset.left += Node.scrollLeft;
			return offset;
		}
		offset.top += Node.scrollTop;
		offset.left += Node.scrollLeft;
		if (Node.parentNode) return u.getScroll(Node.parentNode, offset);else return offset;
	},
	showPanelByEle: function showPanelByEle(obj) {
		var ele = obj.ele,
		    panel = obj.panel,
		    position = obj.position,
		    off = u.getOffset(ele),
		    scroll = u.getScroll(ele),
		    offLeft = off.left,
		    offTop = off.top,
		    scrollLeft = scroll.left,
		    scrollTop = scroll.top,
		    eleWidth = ele.offsetWidth,
		    eleHeight = ele.offsetHeight,
		    panelWidth = panel.offsetWidth,
		    panelHeight = panel.offsetHeight,
		    bodyWidth = document.body.clientWidth,
		    bodyHeight = document.body.clientHeight,
		    position = position || 'top',
		    left = offLeft - scrollLeft,
		    top = offTop - scrollTop;
		// 基准点为Ele的左上角
		// 后续根据需要完善
		if (position == 'left') {} else if (position == 'right') {} else if (position == 'topCenter') {
			left = left + (eleWidth - panelWidth) / 2;
			top = top - panelHeight;
		} else if (position == 'bottomLeft') {
			left = left;
			top = top + eleHeight;
		}

		if (left + panelWidth > bodyWidth) left = bodyWidth - panelWidth;
		if (left < 0) left = 0;

		if (top + panelHeight > bodyHeight) top = bodyHeight - panelHeight;
		if (top < 0) top = 0;
		panel.style.left = left + 'px';
		panel.style.top = top + 'px';
	},

	/**
  * 阻止冒泡
  */
	stopEvent: function stopEvent(e) {
		if (typeof e != "undefined") {
			if (e.stopPropagation) e.stopPropagation();else {
				e.cancelBubble = true;
			}
			//阻止默认浏览器动作(W3C)
			if (e && e.preventDefault) e.preventDefault();
			//IE中阻止函数器默认动作的方式
			else window.event.returnValue = false;
		}
	},
	getFunction: function getFunction(target, val) {
		if (!val || typeof val == 'function') return val;
		if (typeof target[val] == 'function') return target[val];else if (typeof window[val] == 'function') return window[val];else if (val.indexOf('.') != -1) {
			var func = u.getJSObject(target, val);
			if (typeof func == 'function') return func;
			func = u.getJSObject(window, val);
			if (typeof func == 'function') return func;
		}
		return val;
	},
	getJSObject: function getJSObject(target, names) {
		if (!names) {
			return;
		}
		if ((typeof names === "undefined" ? "undefined" : _typeof(names)) == 'object') return names;
		var nameArr = names.split('.');
		var obj = target;
		for (var i = 0; i < nameArr.length; i++) {
			obj = obj[nameArr[i]];
			if (!obj) return null;
		}
		return obj;
	},
	isDate: function isDate(input) {
		return Object.prototype.toString.call(input) === '[object Date]' || input instanceof Date;
	},
	isNumber: function isNumber(obj) {
		//return obj === +obj
		return obj - parseFloat(obj) + 1 >= 0;
	},
	isArray: Array.isArray || function (val) {
		return Object.prototype.toString.call(val) === '[object Array]';
	},
	isEmptyObject: function isEmptyObject(obj) {
		var name;
		for (name in obj) {
			return false;
		}
		return true;
	},
	inArray: function inArray(node, arr) {

		if (!arr instanceof Array) {
			throw "arguments is not Array";
		}

		for (var i = 0, k = arr.length; i < k; i++) {
			if (node == arr[i]) {
				return true;
			}
		}

		return false;
	},
	each: function each(obj, callback) {
		if (obj.forEach) {
			obj.forEach(function (v, k) {
				callback(k, v);
			});
		} else if (obj instanceof Object) {
			for (var k in obj) {
				callback(k, obj[k]);
			}
		} else {
			return;
		}
	}

});

//core context
(function () {
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
		'time': {
			format: 'HH:mm'
		},
		'date': {
			format: 'YYYY-MM-DD'
		},
		'currency': {
			precision: 2,
			curSymbol: '￥'
		},
		'percent': {}
	};
	/**
  * 获取环境信息
  * @return {environment}
  */
	fn.getEnvironment = function () {
		return u.createShellObject(environment);
	};

	/**
  * 获取客户端参数对象
  * @return {clientAttributes}
  */
	fn.getClientAttributes = function () {
		var exf = function exf() {};
		return u.createShellObject(clientAttributes);
	};

	fn.setContextPath = function (contextPath) {
		return environment[IWEB_CONTEXT_PATH] = contextPath;
	};
	fn.getContextPath = function (contextPath) {
		return environment[IWEB_CONTEXT_PATH];
	};
	/**
  * 设置客户端参数对象
  * @param {Object} k 对象名称
  * @param {Object} v 对象值(建议使用简单类型)
  */
	fn.setClientAttribute = function (k, v) {
		clientAttributes[k] = v;
	};
	/**
  * 获取会话级参数对象
  * @return {clientAttributes}
  */
	fn.getSessionAttributes = function () {
		var exf = function exf() {};
		return u.createShellObject(sessionAttributes);
	};

	/**
  * 设置会话级参数对象
  * @param {Object} k 对象名称
  * @param {Object} v 对象值(建议使用简单类型)
  */
	fn.setSessionAttribute = function (k, v) {
		sessionAttributes[k] = v;
		setCookie("ISES_" + k, v);
	};

	/**
  * 移除客户端参数
  * @param {Object} k 对象名称
  */
	fn.removeClientAttribute = function (k) {
		clientAttributes[k] = null;
		execIgnoreError(function () {
			delete clientAttributes[k];
		});
	};

	/**
  * 获取地区信息编码
  */
	fn.getLocale = function () {
		return this.getEnvironment().locale;
	};

	/**
  * 获取多语信息
  */
	fn.getLanguages = function () {
		return this.getEnvironment().languages;
	};
	/**
  * 收集环境信息(包括客户端参数)
  * @return {Object}
  */
	fn.collectEnvironment = function () {
		var _env = this.getEnvironment();
		var _ses = this.getSessionAttributes();

		for (var i in clientAttributes) {
			_ses[i] = clientAttributes[i];
		}
		_env.clientAttributes = _ses;
		return _env;
	};

	/**
  * 设置数据格式信息
  * @param {String} type
  * @param {Object} meta
  */
	fn.setMaskerMeta = function (type, meta) {
		if (typeof type == 'function') {
			getMetaFunc = type;
		} else {
			if (!maskerMeta[type]) maskerMeta[type] = meta;else {
				if ((typeof meta === "undefined" ? "undefined" : _typeof(meta)) != 'object') maskerMeta[type] = meta;else for (var key in meta) {
					maskerMeta[type][key] = meta[key];
				}
			}
		}
	};
	fn.getMaskerMeta = function (type) {
		if (typeof getMetaFunc == 'function') {
			var meta = getMetaFunc.call(this);
			return meta[type];
		} else return u.extend({}, maskerMeta[type]);
	};
	environment.languages = u.getCookie(U_LANGUAGES) ? u.getCookie(U_LANGUAGES).split(',') : navigator.language ? navigator.language : 'zh-CN';
	if (environment.languages == 'zh-cn') environment.languages = 'zh-CN';
	if (environment.languages == 'en-us') environment.languages = 'en-US';

	environment.theme = u.getCookie(U_THEME);
	environment.locale = u.getCookie(U_LOCALE);
	//environment.timezoneOffset = (new Date()).getTimezoneOffset()
	environment.usercode = u.getCookie(U_USERCODE);
	//init session attribute
	document.cookie.replace(/ISES_(\w*)=([^;]*);?/ig, function (a, b, c) {
		sessionAttributes[b] = c;
	});

	var Core = function Core() {};
	Core.prototype = fn;

	u.core = new Core();
})();

u.extend(u, {
	isIE: false,
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

(function () {
	var userAgent = navigator.userAgent,
	    rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
	    rFirefox = /(firefox)\/([\w.]+)/,
	    rOpera = /(opera).+version\/([\w.]+)/,
	    rChrome = /(chrome)\/([\w.]+)/,
	    rSafari = /version\/([\w.]+).*(safari)/,
	    version,
	    ua = userAgent.toLowerCase(),
	    s,
	    browserMatch = { browser: "", version: '' },
	    match = rMsie.exec(ua);

	if (match != null) {
		browserMatch = { browser: "IE", version: match[2] || "0" };
	}
	match = rFirefox.exec(ua);
	if (match != null) {
		browserMatch = { browser: match[1] || "", version: match[2] || "0" };
	}
	match = rOpera.exec(ua);
	if (match != null) {
		browserMatch = { browser: match[1] || "", version: match[2] || "0" };
	}
	match = rChrome.exec(ua);
	if (match != null) {
		browserMatch = { browser: match[1] || "", version: match[2] || "0" };
	}
	match = rSafari.exec(ua);
	if (match != null) {
		browserMatch = { browser: match[2] || "", version: match[1] || "0" };
	}
	if (match != null) {
		browserMatch = { browser: "", version: "0" };
	}

	if (s = ua.match(/opera.([\d.]+)/)) {
		u.isOpera = true;
	} else if (browserMatch.browser == "IE" && browserMatch.version == 11) {
		u.isIE11 = true;
		u.isIE = true;
	} else if (s = ua.match(/chrome\/([\d.]+)/)) {
		u.isChrome = true;
		u.isStandard = true;
	} else if (s = ua.match(/version\/([\d.]+).*safari/)) {
		u.isSafari = true;
		u.isStandard = true;
	} else if (s = ua.match(/gecko/)) {
		//add by licza : support XULRunner
		u.isFF = true;
		u.isStandard = true;
	} else if (s = ua.match(/msie ([\d.]+)/)) {
		u.isIE = true;
	} else if (s = ua.match(/firefox\/([\d.]+)/)) {
		u.isFF = true;
		u.isStandard = true;
	}
	if (ua.match(/webkit\/([\d.]+)/)) {
		u.isWebkit = true;
	}
	if (ua.match(/ipad/i)) {
		u.isIOS = true;
		u.isIPAD = true;
		u.isStandard = true;
	}
	if (ua.match(/iphone/i)) {
		u.isIOS = true;
		u.isIphone = true;
	}

	if (navigator.platform == "Mac68K" || navigator.platform == "MacPPC" || navigator.platform == "Macintosh" || navigator.platform == "MacIntel") {
		//u.isIOS = true;
		u.isMac = true;
	}

	if (navigator.platform == "Win32" || navigator.platform == "Windows" || navigator.platform == "Win64") {
		u.isWin = true;
	}

	if (navigator.platform == "X11" && !u.isWin && !u.isMac) {
		u.isUnix = true;
	}
	if (String(navigator.platform).indexOf("Linux") > -1) {
		u.isLinux = true;
	}

	if (ua.indexOf('Android') > -1 || ua.indexOf('android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('adr') > -1) {
		u.isAndroid = true;
	}

	u.version = version ? browserMatch.version ? browserMatch.version : 0 : 0;
	if (u.isIE) {
		var intVersion = parseInt(u.version);
		var mode = document.documentMode;
		if (mode == null) {
			if (intVersion == 6 || intVersion == 7) {
				u.isIE8_BEFORE = true;
			}
		} else {
			if (mode == 7) {
				u.isIE8_BEFORE = true;
			} else if (mode == 8) {
				u.isIE8 = true;
			} else if (mode == 9) {
				u.isIE9 = true;
				u.isSTANDARD = true;
			} else if (mode == 10) {
				u.isIE10 = true;
				u.isSTANDARD = true;
				u.isIE10_ABOVE = true;
			} else {
				u.isSTANDARD = true;
			}
			if (intVersion == 8) {
				u.isIE8_CORE = true;
			} else if (intVersion == 9) {
				u.isIE9_CORE = true;
			} else if (browserMatch.version == 11) {
				u.isIE11 = true;
			} else {}
		}
	}
	if ("ontouchend" in document) {
		u.hasTouch = true;
	}
	if (u.isIOS || u.isAndroid) u.isMobile = true;
})();

if (u.isIE8_BEFORE) {
	alert('uui 不支持IE8以前的浏览器版本，请更新IE浏览器或使用其它浏览器！');
	throw new Error('uui 不支持IE8以前的浏览器版本，请更新IE浏览器或使用其它浏览器！');
}
if (u.isIE8 && !u.polyfill) {
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

u.isDomElement = function (obj) {
	if (window['HTMLElement']) {
		return obj instanceof HTMLElement;
	} else {
		return obj && obj.tagName && obj.nodeType === 1;
	}
};
'use strict';

var Class = function Class(o) {
    if (!(this instanceof Class) && isFunction(o)) {
        return classify(o);
    }
};

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
        properties = parent;
        parent = null;
    }

    properties || (properties = {});
    parent || (parent = properties.Extends || Class);
    properties.Extends = parent;

    // The created class constructor
    function SubClass() {
        var ret;
        // Call the parent constructor.
        parent.apply(this, arguments);

        // Only call initialize in self constructor.
        if (this.constructor === SubClass && this.initialize) {
            ret = this.initialize.apply(this, arguments);
        }
        return ret ? ret : this;
    }

    // Inherit class (static) properties from parent.
    if (parent !== Class) {
        mix(SubClass, parent, parent.StaticsWhiteList);
    }

    // Add instance properties to the subclass.
    implement.call(SubClass, properties);

    // Make subclass extendable.
    return classify(SubClass);
};

function implement(properties) {
    var key, value;

    for (key in properties) {
        value = properties[key];

        if (Class.Mutators.hasOwnProperty(key)) {
            Class.Mutators[key].call(this, value);
        } else {
            this.prototype[key] = value;
        }
    }
}

// Create a sub Class based on `Class`.
Class.extend = function (properties) {
    properties || (properties = {});
    properties.Extends = this;

    return Class.create(properties);
};

function classify(cls) {
    cls.extend = Class.extend;
    cls.implement = implement;
    return cls;
}

// Mutators define special properties.
Class.Mutators = {

    'Extends': function Extends(parent) {
        var existed = this.prototype;
        var proto = createProto(parent.prototype);

        // Keep existed properties.
        mix(proto, existed);

        // Enforce the constructor to be what we expect.
        proto.constructor = this;

        // Set the prototype chain to inherit from `parent`.
        this.prototype = proto;

        // Set a convenience property in case the parent's prototype is
        // needed later.
        this.superclass = parent.prototype;
    },

    'Implements': function Implements(items) {
        isArray(items) || (items = [items]);
        var proto = this.prototype,
            item;

        while (item = items.shift()) {
            mix(proto, item.prototype || item);
        }
    },

    'Statics': function Statics(staticProperties) {
        mix(this, staticProperties);
    }
};

// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {}

// See: http://jsperf.com/object-create-vs-new-ctor
var createProto = Object.__proto__ ? function (proto) {
    return {
        __proto__: proto
    };
} : function (proto) {
    Ctor.prototype = proto;
    return new Ctor();
};

// Helpers
// ------------

function mix(r, s, wl) {
    // Copy "all" properties including inherited ones.
    for (var p in s) {
        if (s.hasOwnProperty(p)) {
            if (wl && indexOf(wl, p) === -1) continue;

            // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
            if (p !== 'prototype') {
                r[p] = s[p];
            }
        }
    }
}

var toString = Object.prototype.toString;

var isArray = Array.isArray || function (val) {
    return toString.call(val) === '[object Array]';
};

var isFunction = function isFunction(val) {
    return toString.call(val) === '[object Function]';
};

var indexOf = function indexOf(arr, item) {
    if (Array.prototype.indexOf && arr.indexOf) {
        return arr.indexOf(item);
    } else {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    }
};

u.Class = Class;
'use strict';

var BaseComponent = u.Class.create({
    initialize: function initialize(element) {
        if (u.isDomElement(element)) {
            this.element = element;
            this.options = {};
        } else {
            this.element = element['el'];
            this.options = element;
        }
        this.element = typeof this.element === 'string' ? document.querySelector(this.element) : this.element;

        this.compType = this.compType || this.constructor.compType;
        this.element[this.compType] = this;
        this.element['init'] = true;
        this.init();
    },
    /**
     * 绑定事件
     * @param {String} name
     * @param {Function} callback
     */
    on: function on(name, callback) {
        name = name.toLowerCase();
        this._events || (this._events = {});
        var events = this._events[name] || (this._events[name] = []);
        events.push({
            callback: callback
        });
        return this;
    },
    /**
     * 触发事件
     * @param {String} name
     */
    trigger: function trigger(name) {
        name = name.toLowerCase();
        if (!this._events || !this._events[name]) return this;
        var args = Array.prototype.slice.call(arguments, 1);
        var events = this._events[name];
        for (var i = 0, count = events.length; i < count; i++) {
            events[i].callback.apply(this, args);
        }
        return this;
    },
    /**
     * 初始化
     */
    init: function init() {},
    /**
     * 渲染控件
     */
    render: function render() {},
    /**
     * 销毁控件
     */
    destroy: function destroy() {
        delete this.element['comp'];
        this.element.innerHTML = '';
    },
    /**
     * 增加dom事件
     * @param {String} name
     * @param {Function} callback
     */
    addDomEvent: function addDomEvent(name, callback) {
        u.on(this.element, name, callback);
        return this;
    },
    /**
     * 移除dom事件
     * @param {String} name
     */
    removeDomEvent: function removeDomEvent(name, callback) {
        u.off(this.element, name, callback);
        return this;
    },
    setEnable: function setEnable(enable) {
        return this;
    },
    /**
     * 判断是否为DOM事件
     */
    isDomEvent: function isDomEvent(eventName) {
        if (this.element['on' + eventName] === undefined) return false;else return true;
    },
    createDateAdapter: function createDateAdapter(options) {
        var opt = options['options'],
            model = options['model'];
        var Adapter = u.compMgr.getDataAdapter(this.compType, opt['dataType']);
        if (Adapter) {
            this.dataAdapter = new Adapter(this, options);
        }
    },
    Statics: {
        compName: '',
        EVENT_VALUE_CHANGE: 'valueChange',
        getName: function getName() {
            return this.compName;
        }
    }
});

function adjustDataType(options) {
    var types = ['integer', 'float', 'currency', 'percent', 'string', 'textarea'];
    var _type = options['type'],
        _dataType = options['dataType'];
    if (types.indexOf(_type) != -1) {
        options['dataType'] = _type;
        options['type'] = 'originText';
    }
}

u.BaseComponent = BaseComponent;
"use strict";

var XmlHttp = {
  get: "get",
  post: "post",
  reqCount: 4,
  createXhr: function createXhr() {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  },
  ajax: function ajax(_json) {
    var url = _json["url"];
    var callback = _json["success"];
    var async = _json["async"] == undefined ? true : _json["async"];
    var error = _json["error"];
    var params = _json["data"] || {};
    var method = (_json["type"] == undefined ? XmlHttp.post : _json["type"]).toLowerCase();
    var gzipFlag = params.compressType;
    url = XmlHttp.serializeUrl(url);
    params = XmlHttp.serializeParams(params);
    if (method == XmlHttp.get && params != null) {
      url += "&" + params;
      params = null; //如果是get请求,保证最终会执行send(null)
    }

    var xmlhttp = XmlHttp.createXhr();
    xmlhttp.open(method, url, async);

    if (method == XmlHttp.post) {
      xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    }

    var execount = 0;
    // 异步
    if (async) {
      // readyState 从 1~4发生4次变化
      xmlhttp.onreadystatechange = function () {
        execount++;
        // 等待readyState状态不再变化之后,再执行回调函数
        //if (execount == XmlHttp.reqCount) {// 火狐下存在问题，修改判断方式
        if (this.readyState == XmlHttp.reqCount) {
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
  execBack: function execBack(xmlhttp, callback, error) {
    //if (xmlhttp.readyState == 4
    if (xmlhttp.status == 200 || xmlhttp.status == 304) {
      callback(xmlhttp.responseText, xmlhttp.status, xmlhttp);
    } else {
      if (error) {
        error(xmlhttp.responseText, xmlhttp.status, xmlhttp);
      } else {
        var errorMsg = "no error callback function!";
        if (xmlhttp.responseText) {
          errorMsg = xmlhttp.responseText;
        }
        alert(errorMsg);
        // throw errorMsg;
      }
    }
  },
  serializeUrl: function serializeUrl(url) {
    var cache = "cache=" + Math.random();
    if (url.indexOf("?") > 0) {
      url += "&" + cache;
    } else {
      url += "?" + cache;
    }
    return url;
  },
  serializeParams: function serializeParams(params) {
    var ud = undefined;
    if (ud == params || params == null || params == "") {
      return null;
    }
    if (params.constructor == Object) {
      var result = "";
      for (var p in params) {
        result += p + "=" + encodeURIComponent(params[p]) + "&";
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
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
    if (!((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element instanceof Element)) {
        throw new Error('Invalid argument provided to upgrade MDL element.');
    }
    var upgradedList = _getUpgradedListOfElement(element);
    var classesToUpgrade = [];
    if (!optJsClass) {
        var className = element.className;
        for (var i = 0; i < CompMgr.registeredControls.length; i++) {
            var component = CompMgr.registeredControls[i];
            if (className.indexOf(component.cssClass) > -1 && classesToUpgrade.indexOf(component) === -1 && !_isElementUpgraded(element, component.className)) {
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
            if (element[registeredClass.className]) {
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
        var jsClass = optJsClass;
        if (!optCssClass) {
            var registeredClass = _findRegisteredClass(jsClass);
            if (registeredClass) {
                optCssClass = registeredClass.cssClass;
            }
        }
        var elements;
        if (ele) {
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
    dataAdapters: {},
    /** 注册的控件*/
    registeredControls: [],
    createdControls: [],
    /**
     *
     * @param options  {el:'#content', model:{}}
     */
    apply: function apply(options) {
        if (options) {
            var _el = options.el || document.body;
            var model = options.model;
        }
        if (typeof _el == 'string') {
            _el = document.body.querySelector(_el);
        }
        if (_el == null || (typeof _el === 'undefined' ? 'undefined' : _typeof(_el)) != 'object') _el = document.body;
        var comps = _el.querySelectorAll('[u-meta]');
        comps.forEach(function (element) {
            if (element['comp']) return;
            var options = JSON.parse(element.getAttribute('u-meta'));
            if (options && options['type']) {
                //var comp = CompMgr._createComp({el:element,options:options,model:model});
                var comp = CompMgr.createDataAdapter({ el: element, options: options, model: model });
                if (comp) {
                    element['adpt'] = comp;
                    element['u-meta'] = comp;
                }
            }
        });
    },
    addPlug: function addPlug(config) {
        var plug = config['plug'],
            name = config['name'];
        this.plugs || (this.plugs = {});
        if (this.plugs[name]) {
            throw new Error('plug has exist:' + name);
        }
        plug.compType = name;
        this.plugs[name] = plug;
    },
    addDataAdapter: function addDataAdapter(config) {
        var adapter = config['adapter'],
            name = config['name'];
        //dataType = config['dataType'] || ''
        //var key = dataType ? name + '.' + dataType : name;
        this.dataAdapters || (dataAdapters = {});
        if (this.dataAdapters[name]) {
            throw new Error('dataAdapter has exist:' + name);
        }
        this.dataAdapters[name] = adapter;
    },
    getDataAdapter: function getDataAdapter(name) {
        if (!name) return;
        this.dataAdapters || (dataAdapters = {});
        //var key = dataType ? name + '.' + dataType : name;
        return this.dataAdapters[name];
    },
    createDataAdapter: function createDataAdapter(options) {
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
    _createComp: function _createComp(options) {
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
    regComp: function regComp(config) {
        var newConfig = {
            classConstructor: config.comp,
            className: config.compAsString || config['compAsString'],
            cssClass: config.css || config['css'],
            callbacks: []
        };
        config.comp.prototype.compType = config.compAsString;
        for (var i = 0; i < this.registeredControls.length; i++) {
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
    updateComp: function updateComp(ele) {
        for (var n = 0; n < this.registeredControls.length; n++) {
            _upgradeDomInternal(this.registeredControls[n].className, null, ele);
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
'use strict';

/**
 * 处理数据显示格式
 */

u.floatRender = function (value, precision) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null) return value;
    //value 为 ko对象
    if (typeof value === 'function') trueValue = value();
    var maskerMeta = u.core.getMaskerMeta('float') || {};
    if (typeof precision === 'number') maskerMeta.precision = precision;
    var formater = new u.NumberFormater(maskerMeta.precision);
    var masker = new NumberMasker(maskerMeta);
    return masker.format(formater.format(trueValue)).value;
};

u.integerRender = function (value) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null) return value;
    //value 为 ko对象
    if (typeof value === 'function') trueValue = value();
    return trueValue;
};

var _dateRender = function _dateRender(value, format, type) {
    var trueValue = value;
    if (typeof value === 'undefined' || value === null) return value;
    //value 为 ko对象
    if (typeof value === 'function') trueValue = value();
    var maskerMeta = u.core.getMaskerMeta(type) || {};
    if (typeof format != 'undefined') maskerMeta.format = format;
    var maskerValue = u.date.format(trueValue, maskerMeta.format);
    return maskerValue;
};

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
    var trueValue = value;
    if (typeof value === 'undefined' || value === null) return value;
    //value 为 ko对象
    if (typeof value === 'function') trueValue = value();
    var maskerMeta = u.core.getMaskerMeta('percent') || {};
    var masker = new PercentMasker(maskerMeta);
    var maskerValue = masker.format(trueValue);
    return maskerValue && maskerValue.value ? maskerValue.value : '';
};

u.dateToUTCString = function (date) {
    if (!date) return '';
    if (date.indexOf("-") > -1) date = date.replace(/\-/g, "/");
    var utcString = Date.parse(date);
    if (isNaN(utcString)) return "";
    return utcString;
};
'use strict';

u.date = {
    /**
     * 多语言处理
     */
    //TODO 后续放到多语文件中
    _dateLocale: {
        'zh-CN': {
            months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
            monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
            weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
            weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
            weekdaysMin: '日_一_二_三_四_五_六'.split('_')
        },
        'en-US': {
            months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
            monthsShort: 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thurday_Friday_Saturday'.split('_'),
            weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            weekdaysMin: 'S_M_T_W_T_F_S'.split('_')
        }
    },

    _formattingTokens: /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,

    leftZeroFill: function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? forceSign ? '+' : '' : '-') + output;
    },

    _formats: {
        //year
        YY: function YY(date) {
            return u.date.leftZeroFill(date.getFullYear() % 100, 2);
        },
        YYYY: function YYYY(date) {
            return date.getFullYear();
        },
        //month
        M: function M(date) {
            return date.getMonth() + 1;
        },
        MM: function MM(date) {
            var m = u.date._formats.M(date);
            return u.date.leftZeroFill(m, 2);
        },
        MMM: function MMM(date, language) {
            var m = date.getMonth();
            return u.date._dateLocale[language].monthsShort[m];
        },
        MMMM: function MMMM(date, language) {
            var m = date.getMonth();
            return u.date._dateLocale[language].months[m];
        },
        //date
        D: function D(date) {
            return date.getDate();
        },
        DD: function DD(date) {
            var d = u.date._formats.D(date);
            return u.date.leftZeroFill(d, 2);
        },
        // weekday
        d: function d(date) {
            return date.getDay();
        },
        dd: function dd(date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdaysMin[d];
        },
        ddd: function ddd(date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdaysShort[d];
        },
        dddd: function dddd(date, language) {
            var d = u.date._formats.d(date);
            return u.date._dateLocale[language].weekdays[d];
        },
        // am pm
        a: function a(date) {
            if (date.getHours() > 12) {
                return 'pm';
            } else {
                return 'am';
            }
        },
        //hour
        h: function h(date) {
            var h = date.getHours();
            h = h > 12 ? h - 12 : h;
            return h;
        },
        hh: function hh(date) {
            var h = u.date._formats.h(date);
            return u.date.leftZeroFill(h, 2);
        },
        H: function H(date) {
            return date.getHours();
        },
        HH: function HH(date) {
            return u.date.leftZeroFill(date.getHours(), 2);
        },
        // minutes
        m: function m(date) {
            return date.getMinutes();
        },
        mm: function mm(date) {
            return u.date.leftZeroFill(date.getMinutes(), 2);
        },
        //seconds
        s: function s(date) {
            return date.getSeconds();
        },
        ss: function ss(date) {
            return u.date.leftZeroFill(date.getSeconds(), 2);
        }
    },

    /**
     * 日期格式化
     * @param date
     * @param formatString
     */
    format: function format(date, formatString, language) {
        if (!date) return date;
        var array = formatString.match(u.date._formattingTokens),
            i,
            length,
            output = '';
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

    _addOrSubtract: function _addOrSubtract(date, period, value, isAdding) {
        var times = date.getTime(),
            d = date.getDate(),
            m = date.getMonth(),
            _date = u.date.getDateObj(date);
        if (period === 'ms') {
            times = times + value * isAdding;
            _date.setTime(times);
        } else if (period == 's') {
            times = times + value * 1000 * isAdding;
            _date.setTime(times);
        } else if (period == 'm') {
            times = times + value * 60000 * isAdding;
            _date.setTime(times);
        } else if (period == 'h') {
            times = times + value * 3600000 * isAdding;
            _date.setTime(times);
        } else if (period == 'd') {
            d = d + value * isAdding;
            _date.setDate(d);
        } else if (period == 'w') {
            d = d + value * 7 * isAdding;
            _date.setDate(d);
        } else if (period == 'M') {
            m = m + value * isAdding;
            _date.setMonth(d);
        } else if (period == 'y') {
            m = m + value * 12 * isAdding;
            _date.setMonth(d);
        }
        return _date;
    },

    add: function add(date, period, value) {
        return u.date._addOrSubtract(date, period, value, 1);
    },
    sub: function sub(date, period, value) {
        return u.date._addOrSubtract(date, period, value, -1);
    },
    getDateObj: function getDateObj(value) {
        if (!value || typeof value == 'undefined') return value;
        var dateFlag = false;
        var _date = new Date(value);
        if (isNaN(_date)) {
            // IE的话对"2016-2-13 12:13:22"进行处理
            var index1, index2, index3, s1, s2, s3;
            index1 = value.indexOf('-');
            index2 = value.indexOf(':');
            index3 = value.indexOf(' ');
            if (index1 > 0 || index2 > 0 || index3 > 0) {
                _date = new Date();
                if (index3 > 0) {
                    s3 = value.split(' ');
                    s1 = s3[0].split('-');
                    s2 = s3[1].split(':');
                } else if (index1 > 0) {
                    s1 = value.split('-');
                } else if (index2 > 0) {
                    s2 = value.split(':');
                }
                if (s1 && s1.length > 0) {
                    _date.setYear(s1[0]);
                    _date.setMonth(parseInt(s1[1] - 1));
                    _date.setDate(s1[2] ? s1[2] : 0);
                    dateFlag = true;
                }
                if (s2 && s2.length > 0) {
                    _date.setHours(s2[0] ? s2[0] : 0);
                    _date.setMinutes(s2[1] ? s2[1] : 0);
                    _date.setSeconds(s2[2] ? s2[2] : 0);
                    dateFlag = true;
                }
            } else {
                _date = new Date(parseInt(value));
                if (isNaN(_date)) {
                    throw new TypeError('invalid Date parameter');
                } else {
                    dateFlag = true;
                }
            }
        } else {
            dateFlag = true;
        }

        if (dateFlag) return _date;else return null;
    }
};
"use strict";

/**
 * 数据格式化工具
 */

function NumberFormater(precision) {
    this.precision = precision;
};

NumberFormater.prototype.update = function (precision) {
    this.precision = precision;
};

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
            result = new BigNumber(value).toFixed(this.precision);
        } else {
            var digit = parseFloat(value);
            // 解决toFixed四舍五入问题，如1.345
            result = (Math.round(digit * Math.pow(10, this.precision)) / Math.pow(10, this.precision)).toFixed(this.precision);
        }
        if (result == "NaN") return "";
    }

    return result;
};

function DateFormater(pattern) {
    this.pattern = pattern;
};

DateFormater.prototype.update = function (pattern) {
    this.pattern = pattern;
};

DateFormater.prototype.format = function (value) {
    return moment(value).format(this.pattern);
};

u.NumberFormater = NumberFormater;
u.DateFormater = DateFormater;
'use strict';

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
        defaults = { type: 'keydown', propagate: false, disableInInput: false, target: document.body, checkParent: true },
        that = this;
    opt = u.extend(opt, defaults, options || {});
    combi = combi.toLowerCase();

    // inspect if keystroke matches
    var inspector = function inspector(event) {
        //event = $.event.fix(event); // jQuery event normalization.
        var element = this; //event.target;
        // @ TextNode -> nodeType == 3
        element = element.nodeType == 3 ? element.parentNode : element;

        if (opt['disableInInput']) {
            // Disable shortcut keys in Input, Textarea fields
            var target = element; //$(element);
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
            propagate = true,
            // default behaivour
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
        if (!shift && !ctrl && !alt) {
            // No Modifiers
            mapPoint = cbMap[special] || cbMap[character];
        }
        // deals with combinaitons (alt|ctrl|shift+anything)
        else {
                var modif = '';
                if (alt) modif += 'alt+';
                if (ctrl) modif += 'ctrl+';
                if (shift) modif += 'shift+';
                // modifiers + special keys or modifiers + characters or modifiers + shift characters
                mapPoint = cbMap[modif + special] || cbMap[modif + character] || cbMap[modif + that.shift_nums[character]];
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
        opt.target['u.hotkeys'] = data = { events: {} };
    }
    //      if (!_hotkeys.all[opt.target]){
    //          _hotkeys.all[opt.target] = {events:{}};
    //      }
    if (!data.events[opt.type]) {
        data.events[opt.type] = { callbackMap: {} };
        u.on(opt.target, opt.type, inspector);
        //$.event.add(opt.target, opt.type, inspector);
    }
    //      if (!_hotkeys.all[opt.target].events[opt.type]){
    //          _hotkeys.all[opt.target].events[opt.type] = {callbackMap: {}}
    //          $.event.add(opt.target, opt.type, inspector);
    //      }
    data.events[opt.type].callbackMap[combi] = { cb: callback, propagate: opt.propagate };
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
    element.querySelectorAll('[u-enter]').forEach(function (el) {
        var enterValue = el.getAttribute('u-enter');
        if (!enterValue) return;
        if (enterValue.substring(0, 1) == '#') u.hotkeys.add('enter', { target: this }, function () {
            var _el = element.querySelector(enterValue);
            if (_el) {
                _el.focus();
            }
        });else {
            target = target || window;
            var func = u.getFunction(target, enterValue);
            u.hotkeys.add('enter', { target: this }, function () {
                func.call(this);
            });
        }
    });
    element.querySelectorAll('[u-hotkey]').forEach(function (el) {
        var hotkey = el.getAttribute('u-hotkey');
        if (!hotkey) return;
        u.hotkeys.add(hotkey, function () {
            el.click();
        });
    });
};

u.hotkeys = _hotkeys;
'use strict';

if (window.i18n) {
    var scriptPath = getCurrentJsPath(),
        _temp = scriptPath.substr(0, scriptPath.lastIndexOf('/')),
        __FOLDER__ = _temp.substr(0, _temp.lastIndexOf('/'));
    u.uuii18n = u.extend({}, window.i18n);
    u.uuii18n.init({
        postAsync: false,
        getAsync: false,
        fallbackLng: false,
        ns: { namespaces: ['uui-trans'] },
        resGetPath: __FOLDER__ + '/locales/__lng__/__ns__.json'
    });
}

window.trans = u.trans = function (key, dftValue) {
    return u.uuii18n ? u.uuii18n.t('uui-trans:' + key) : dftValue;
};
"use strict";

NodeList.prototype.forEach = Array.prototype.forEach;

/**
 * 获得字符串的字节长度
 */
String.prototype.lengthb = function () {
    //	var str = this.replace(/[^\x800-\x10000]/g, "***");
    var str = this.replace(/[^\x00-\xff]/g, "**");
    return str.length;
};

/**
 * 将AFindText全部替换为ARepText
 */
String.prototype.replaceAll = function (AFindText, ARepText) {
    //自定义String对象的方法
    var raRegExp = new RegExp(AFindText, "g");
    return this.replace(raRegExp, ARepText);
};
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/**
 * 抽象格式化类
 */
function AbstractMasker() {};

AbstractMasker.prototype.format = function (obj) {
	if (obj == null) return null;

	var fObj = this.formatArgument(obj);
	return this.innerFormat(fObj);
};

/**
 * 统一被格式化对象结构
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.formatArgument = function (obj) {};

/**
 * 格式化
 *
 * @param obj
 * @return
 */
AbstractMasker.prototype.innerFormat = function (obj) {};

/**
 * 拆分算法格式化虚基类
 */
AbstractSplitMasker.prototype = new AbstractMasker();

function AbstractSplitMasker() {};
AbstractSplitMasker.prototype.elements = new Array();
AbstractSplitMasker.prototype.format = function (obj) {
	if (obj == null) return null;

	var fObj = this.formatArgument(obj);
	return this.innerFormat(fObj);
};

/**
 * 统一被格式化对象结构
 *
 * @param obj
 * @return
 */
AbstractSplitMasker.prototype.formatArgument = function (obj) {
	return obj;
};

/**
 * 格式化
 *
 * @param obj
 * @return
 */
AbstractSplitMasker.prototype.innerFormat = function (obj) {
	if (obj == null || obj == "") return new FormatResult(obj);
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
AbstractSplitMasker.prototype.getElementsValue = function (element, obj) {
	var result = "";
	if (element instanceof Array) {
		for (var i = 0; i < element.length; i++) {
			result = result + this.getElementsValue(element[i], obj);
		}
	} else {
		if (element.getValue) result = element.getValue(obj);
	}
	return result;
};

AbstractSplitMasker.prototype.getExpress = function () {};

AbstractSplitMasker.prototype.doSplit = function () {
	var express = this.getExpress();
	if (this.elements == null || this.elements.length == 0) this.elements = this.doQuotation(express, this.getSeperators(), this.getReplaceds(), 0);
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
AbstractSplitMasker.prototype.doQuotation = function (express, seperators, replaced, curSeperator) {
	if (express.length == 0) return null;
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
	} while (result != null);

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
AbstractSplitMasker.prototype.doSeperator = function (express, seperators, replaced, curSeperator) {
	if (curSeperator >= seperators.length) {
		var elements = new Array();
		elements.push(this.getVarElement(express));
		return elements;
	}

	if (express.length == 0) return null;
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
	} while (result != null);

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
AddressMasker.prototype = new AbstractSplitMasker();

function AddressMasker(formatMeta) {
	this.update(formatMeta);
};

AddressMasker.prototype.update = function (formatMeta) {
	this.formatMeta = u.extend({}, AddressMasker.DefaultFormatMeta, formatMeta);
};

AddressMasker.prototype.getExpress = function () {
	return this.formatMeta.express;
};

AddressMasker.prototype.getReplaceds = function () {
	return [this.formatMeta.separator];
};

AddressMasker.prototype.getSeperators = function () {
	return ["(\\s)+?"];
};

AddressMasker.prototype.getVarElement = function (express) {
	var ex = {};

	if (express == "C") ex.getValue = function (obj) {
		return obj.country;
	};

	if (express == "S") ex.getValue = function (obj) {
		return obj.state;
	};

	if (express == "T") ex.getValue = function (obj) {
		return obj.city;
	};

	if (express == "D") ex.getValue = function (obj) {
		return obj.section;
	};

	if (express == "R") ex.getValue = function (obj) {
		return obj.road;
	};

	if (express == "P") ex.getValue = function (obj) {
		return obj.postcode;
	};

	if (_typeof(ex.getValue) == undefined) return new StringElement(express);else return ex;
};

AddressMasker.prototype.formatArgument = function (obj) {
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
NumberMasker.prototype = new AbstractMasker();
NumberMasker.prototype.formatMeta = null;

/**
 *构造方法
 */
function NumberMasker(formatMeta) {
	this.update(formatMeta);
};

NumberMasker.prototype.update = function (formatMeta) {
	this.formatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, formatMeta);
};

/**
 *格式化对象
 */
NumberMasker.prototype.innerFormat = function (obj) {
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
NumberMasker.prototype.setTheMark = function (str, seperatorIndex) {
	var endIndex, first, index;
	if (!this.formatMeta.isMarkEnable) return str;
	if (seperatorIndex <= 0) seperatorIndex = str.length;
	first = str.charCodeAt(0);
	endIndex = 0;
	if (first == 45) endIndex = 1;
	index = seperatorIndex - 3;
	while (index > endIndex) {
		str = str.substr(0, index - 0) + this.formatMeta.markSymbol + str.substr(index, str.length - index);
		index = index - 3;
	}
	return str;
};
NumberMasker.prototype.setTheSeperator = function (str, seperatorIndex) {
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
NumberMasker.toCharArray = function (str) {
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
NumberMasker.prototype.formatArgument = function (obj) {
	var numberObj = {};
	numberObj.value = obj;
	return numberObj;
};

/**
 * 货币格式
 */
CurrencyMasker.prototype = new NumberMasker();
CurrencyMasker.prototype.formatMeta = null;

function CurrencyMasker(formatMeta) {
	this.update(formatMeta);
};

CurrencyMasker.prototype.update = function (formatMeta) {
	this.formatMeta = u.extend({}, CurrencyMasker.DefaultFormatMeta, formatMeta);
};

/**
 * 重载格式方法
 * @param {} obj
 * @return {}
 */
CurrencyMasker.prototype.innerFormat = function (obj) {
	if (!obj.value) {
		return { value: "" };
	}
	var fo = new NumberMasker(this.formatMeta).innerFormat(obj);
	fo.value = this.formatMeta.curSymbol + fo.value; //fo.value.replace("$", this.formatMeta.curSymbol);
	return fo;
};

PercentMasker.prototype = new NumberMasker();

function PercentMasker(formatMeta) {
	this.update(formatMeta);
};

PercentMasker.prototype.update = function (formatMeta) {
	this.formatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, formatMeta);
};

PercentMasker.prototype.formatArgument = function (obj) {
	return obj;
};

PercentMasker.prototype.innerFormat = function (value) {
	var val = "";
	if (value != "") {
		var obj = new NumberMasker(this.formatMeta).innerFormat({ value: value }).value;
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

StringElement.prototype.getValue = function (obj) {
	return this.value;
};
/**
 *格式结果
 */
FormatResult.prototype = new Object();
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
};

CurrencyMasker.DefaultFormatMeta = u.extend({}, NumberMasker.DefaultFormatMeta, {
	//curSymbol: "",
	positiveFormat: "n",
	negativeFormat: "-n"
});

AddressMasker.defaultFormatMeta = {
	express: "C S T R P",
	separator: " "
};

u.AddressMasker = AddressMasker;
u.NumberMasker = NumberMasker;
u.CurrencyMasker = CurrencyMasker;
u.PercentMasker = PercentMasker;
'use strict';

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

if (typeof u.RSAUtils === 'undefined') u.RSAUtils = {};
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
    for (var iza = 0; iza < ZERO_ARRAY.length; iza++) {
        ZERO_ARRAY[iza] = 0;
    }bigZero = new BigInt();
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
    while (i < s.length && s.charAt(i) == '0') {
        ++i;
    }if (i == s.length) {
        result = new BigInt();
    } else {
        var digitCount = s.length - i;
        var fgl = digitCount % dpl10;
        if (fgl == 0) fgl = dpl10;
        result = RSAUtils.biFromNumber(Number(s.substr(i, fgl)));
        i += fgl;
        while (i < s.length) {
            result = RSAUtils.biAdd(RSAUtils.biMultiply(result, lr10), RSAUtils.biFromNumber(Number(s.substr(i, dpl10))));
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

var hexatrigesimalToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

RSAUtils.biToString = function (x, radix) {
    // 2 <= radix <= 36
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

var hexToChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

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
    } else {
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
    while (result > 0 && x.digits[result] == 0) {
        --result;
    }return result;
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

var highBitMasks = [0x0000, 0x8000, 0xC000, 0xE000, 0xF000, 0xF800, 0xFC00, 0xFE00, 0xFF00, 0xFF80, 0xFFC0, 0xFFE0, 0xFFF0, 0xFFF8, 0xFFFC, 0xFFFE, 0xFFFF];

RSAUtils.biShiftLeft = function (x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, 0, result.digits, digitCount, result.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var rightBits = bitsPerDigit - bits;
    for (var i = result.digits.length - 1, i1 = i - 1; i > 0; --i, --i1) {
        result.digits[i] = result.digits[i] << bits & maxDigitVal | (result.digits[i1] & highBitMasks[bits]) >>> rightBits;
    }
    result.digits[0] = result.digits[i] << bits & maxDigitVal;
    result.isNeg = x.isNeg;
    return result;
};

var lowBitMasks = [0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F, 0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF, 0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF];

RSAUtils.biShiftRight = function (x, n) {
    var digitCount = Math.floor(n / bitsPerDigit);
    var result = new BigInt();
    RSAUtils.arrayCopy(x.digits, digitCount, result.digits, 0, x.digits.length - digitCount);
    var bits = n % bitsPerDigit;
    var leftBits = bitsPerDigit - bits;
    for (var i = 0, i1 = i + 1; i < result.digits.length - 1; ++i, ++i1) {
        result.digits[i] = result.digits[i] >>> bits | (result.digits[i1] & lowBitMasks[bits]) << leftBits;
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
        var ri = i >= r.digits.length ? 0 : r.digits[i];
        var ri1 = i - 1 >= r.digits.length ? 0 : r.digits[i - 1];
        var ri2 = i - 2 >= r.digits.length ? 0 : r.digits[i - 2];
        var yt = t >= y.digits.length ? 0 : y.digits[t];
        var yt1 = t - 1 >= y.digits.length ? 0 : y.digits[t - 1];
        if (ri == yt) {
            q.digits[i - t - 1] = maxDigitVal;
        } else {
            q.digits[i - t - 1] = Math.floor((ri * biRadix + ri1) / yt);
        }

        var c1 = q.digits[i - t - 1] * (yt * biRadix + yt1);
        var c2 = ri * biRadixSquared + (ri1 * biRadix + ri2);
        while (c1 > c2) {
            --q.digits[i - t - 1];
            c1 = q.digits[i - t - 1] * (yt * biRadix | yt1);
            c2 = ri * biRadix * biRadix + (ri1 * biRadix + ri2);
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

var RSAKeyPair = function RSAKeyPair(encryptionExponent, decryptionExponent, modulus) {
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
        } else {
            bi = RSAUtils.biFromString(blocks[i], key.radix);
        }
        block = key.barrett.powMod(bi, key.d);
        for (j = 0; j <= RSAUtils.biHighIndex(block); ++j) {
            result += String.fromCharCode(block.digits[j] & 255, block.digits[j] >> 8);
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
'use strict';

u.MDLayout = u.BaseComponent.extend({
	_CssClasses: {
		MASTER: 'u-mdlayout-master',
		DETAIL: 'u-mdlayout-detail',
		PAGE: 'u-mdlayout-page',
		PAGE_HEADER: 'u-mdlayout-page-header',
		PAGE_SECTION: 'u-mdlayout-page-section',
		PAGE_FOOTER: 'u-mdlayout-page-footer'
	},
	init: function init() {
		//this.browser = _getBrowserInfo();
		var me = this;
		this.minWidth = 600;
		//this.options = $.extend({}, MDLayout.DEFAULTS, options)
		//this.$element.css('position','relative').css('width','100%').css('height','100%').css('overflow','hidden')
		this._master = this.element.querySelector('.' + this._CssClasses.MASTER);
		this._detail = this.element.querySelector('.' + this._CssClasses.DETAIL);

		//this.$master.css('float','left').css('height','100%')
		//this.$detail.css('height','100%').css('overflow','hidden').css('position','relative');

		this.masterWidth = this._master.offsetWidth;
		this.detailWidth = this._detail.offsetWidth;
		this.mPages = this._master.querySelectorAll('.' + this._CssClasses.PAGE);
		this.dPages = this._detail.querySelectorAll('.' + this._CssClasses.PAGE);
		this.mPageMap = {};
		this.dPageMap = {};
		this.initPages(this.mPages, 'master');
		this.initPages(this.dPages, 'detail');

		this.mHistory = [];
		this.dHistory = [];
		this.isNarrow = null;
		this.response();
		u.on(window, 'resize', function () {
			me.response();
		});
	},

	initPages: function initPages(pages, type) {
		var pageMap, pWidth;
		if (type === 'master') {
			pageMap = this.mPageMap;
			pWidth = this.masterWidth;
		} else {
			pageMap = this.dPageMap;
			pWidth = this.detailWidth;
		}
		for (var i = 0; i < pages.length; i++) {
			var pid = pages[i].getAttribute('id');
			if (!pid) throw new Error('u-mdlayout-page mast have id attribute');
			pageMap[pid] = pages[i];
			if (i === 0) {
				if (type === 'master') this.current_m_pageId = pid;else this.current_d_pageId = pid;
				u.addClass(pages[i], 'current');
				//pages[i].style.transform = 'translate3d('+ pWidth +'px,0,0)';
				pages[i].style.transform = 'translate3d(0,0,0)';
			} else {
				pages[i].style.transform = 'translate3d(' + pWidth + 'px,0,0)';
			}
			if (u.isIE8 || u.isIE9) {
				u.addClass(pages[i], 'let-ie9');
			}
		}
	},

	//	MDLayout.DEFAULTS = {
	//		minWidth: 600,
	////		masterFloat: false,
	//		afterNarrow:function(){},
	//		afterUnNarrow:function(){},
	//		afterMasterGo:function(pageId){},
	//		afterMasterBack:function(pageId){},
	//		afterDetailGo:function(pageId){},
	//		afterDetailBack:function(pageId){}
	//	}

	response: function response() {
		var totalWidth = this.element.offsetWidth;
		if (totalWidth < this.minWidth) {
			if (this.isNarrow == null || this.isNarrow == false) this.isNarrow = true;
			this.hideMaster();
		} else {
			if (this.isNarrow == null || this.isNarrow == true) this.isNarrow = false;
			this.showMaster();
		}
		this.calcWidth();
	},

	calcWidth: function calcWidth() {
		if (!(u.isIE8 || u.isIE9)) {
			this.detailWidth = this._detail.offsetWidth;
			this.masterWidth = this._master.offsetWidth;
			//TODO this.mHistory中的panel应该置为-值
			for (var i = 0; i < this.dPages.length; i++) {
				var pid = this.dPages[i].getAttribute('id');
				if (pid !== this.current_d_pageId) {
					this.dPages[i].style.transform = 'translate3d(' + this.detailWidth + 'px,0,0)';
				}
			}
			//this.$detail.find('[data-role="page"]').css('transform','translate3d('+ this.detailWidth +'px,0,0)')
			//this.$detail.find('#' + this.current_d_pageId).css('transform','translate3d(0,0,0)')
		}
	},

	mGo: function mGo(pageId) {
		if (this.current_m_pageId == pageId) return;
		this.mHistory.push(this.current_m_pageId);
		_hidePage(this.mPageMap[this.current_m_pageId], this, '-' + this.masterWidth);
		this.current_m_pageId = pageId;
		_showPage(this.mPageMap[this.current_m_pageId], this);
	},

	mBack: function mBack() {
		if (this.mHistory.length == 0) return;
		_hidePage(this.mPageMap[this.current_m_pageId], this, this.masterWidth);
		this.current_m_pageId = this.mHistory.pop();
		_showPage(this.mPageMap[this.current_m_pageId], this);
	},

	dGo: function dGo(pageId) {
		if (this.current_d_pageId == pageId) return;
		this.dHistory.push(this.current_d_pageId);
		_hidePage(this.dPageMap[this.current_d_pageId], this, '-' + this.detailWidth);
		this.current_d_pageId = pageId;
		_showPage(this.dPageMap[this.current_d_pageId], this);
	},

	dBack: function dBack() {
		if (this.dHistory.length == 0) return;
		_hidePage(this.dPageMap[this.current_d_pageId], this, this.detailWidth);
		this.current_d_pageId = this.dHistory.pop();
		_showPage(this.dPageMap[this.current_d_pageId], this);
	},

	showMaster: function showMaster() {
		if (u.isIE8 || u.isIE9) this._master.style.display = 'block';else {
			this._master.style.transform = 'translate3d(0,0,0)';
		}
		if (!this.isNarrow) this._master.style.position = 'relative';
	},

	hideMaster: function hideMaster() {
		if (this._master.offsetLeft < 0 || this._master.style.display == 'none') return;
		if (u.isIE8 || u.isIE9) this._master.style.display = 'none';else {
			this._master.style.transform = 'translate3d(-' + this.masterWidth + 'px,0,0)';
		}
		this._master.style.position = 'absolute';
		this._master.style.zIndex = 5;
		this.calcWidth();
	}
});

/**
 * masterFloat属性只有在宽屏下起作用，为true时，master层浮动于detail层之上
 *
 */
//	MDLayout.fn.setMasterFloat = function(float){
//		this.masterFloat = float;
//
//	}

//function _getBrowserInfo(){
//	var browser = {};
//	var ua = navigator.userAgent.toLowerCase();
//	var s;
//	(s = ua.match(/rv:([\d.]+)\) like gecko/)) ? browser.ie = parseInt(s[1]) :
//			(s = ua.match(/msie ([\d.]+)/)) ? browser.ie = s[1] :
//					(s = ua.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] :
//							(s = ua.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] :
//									(s = ua.match(/opera.([\d.]+)/)) ? browser.opera = s[1] :
//											(s = ua.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
//	return browser;
//}

function _showPage(el, me) {
	u.addClass(el, 'current');
	if (!(u.isIE8 || u.isIE9)) el.style.transform = 'translate3d(0,0,0)';
}

function _hidePage(el, me, width) {
	u.removeClass(el, 'current');
	if (!(u.isIE8 || u.isIE9)) el.style.transform = 'translate3d(' + width + 'px,0,0)';
}

u.compMgr.regComp({
	comp: u.MDLayout,
	compAsString: 'u.MDLayout',
	css: 'u-mdlayout'
});
'use strict';

u.NavLayout = u.BaseComponent.extend({
    _Constant: {
        MAX_WIDTH: '(max-width: 1024px)',
        TAB_SCROLL_PIXELS: 100,

        MENU_ICON: 'menu',
        CHEVRON_LEFT: 'chevron_left',
        CHEVRON_RIGHT: 'chevron_right'
    },
    /**
     * Modes.
     *
     * @enum {number}
     * @private
     */
    _Mode: {
        STANDARD: 0,
        SEAMED: 1,
        WATERFALL: 2,
        SCROLL: 3
    },
    /**
     * Store strings for class names defined by this component that are used in
     * JavaScript. This allows us to simply change it in one place should we
     * decide to modify at a later date.
     *
     * @enum {string}
     * @private
     */
    _CssClasses: {
        CONTAINER: 'u-navlayout-container',
        HEADER: 'u-navlayout-header',
        DRAWER: 'u-navlayout-drawer',
        CONTENT: 'u-navlayout-content',
        DRAWER_BTN: 'u-navlayout-drawer-button',

        ICON: 'fa',

        //JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
        //RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
        //RIPPLE: 'mdl-ripple',
        //RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',

        HEADER_SEAMED: 'seamed',
        HEADER_WATERFALL: 'waterfall',
        HEADER_SCROLL: 'scroll',

        FIXED_HEADER: 'fixed',
        OBFUSCATOR: 'u-navlayout-obfuscator',

        TAB_BAR: 'u-navlayout-tab-bar',
        TAB_CONTAINER: 'u-navlayout-tab-bar-container',
        TAB: 'u-navlayout-tab',
        TAB_BAR_BUTTON: 'u-navlayout-tab-bar-button',
        TAB_BAR_LEFT_BUTTON: 'u-navlayout-tab-bar-left-button',
        TAB_BAR_RIGHT_BUTTON: 'u-navlayout-tab-bar-right-button',
        PANEL: 'u-navlayout-tab-panel',

        HAS_DRAWER: 'has-drawer',
        HAS_TABS: 'has-tabs',
        HAS_SCROLLING_HEADER: 'has-scrolling-header',
        CASTING_SHADOW: 'is-casting-shadow',
        IS_COMPACT: 'is-compact',
        IS_SMALL_SCREEN: 'is-small-screen',
        IS_DRAWER_OPEN: 'is-visible',
        IS_ACTIVE: 'is-active',
        IS_UPGRADED: 'is-upgraded',
        IS_ANIMATING: 'is-animating',

        ON_LARGE_SCREEN: 'u-navlayout-large-screen-only',
        ON_SMALL_SCREEN: 'u-navlayout-small-screen-only',

        NAV: 'u-nav',
        NAV_LINK: 'u-nav-link',
        NAV_LINK_CURRENT: 'u-nav-link-current',
        NAV_LINK_OPEN: 'u-nav-link-open',
        NAV_SUB: 'u-nav-sub'
    },
    init: function init() {
        var container = document.createElement('div');
        u.addClass(container, this._CssClasses.CONTAINER);
        this.element.parentElement.insertBefore(container, this.element);
        this.element.parentElement.removeChild(this.element);
        container.appendChild(this.element);

        var directChildren = this.element.childNodes;
        var numChildren = directChildren.length;
        for (var c = 0; c < numChildren; c++) {
            var child = directChildren[c];
            if (u.hasClass(child, this._CssClasses.HEADER)) {
                this._header = child;
            }

            if (u.hasClass(child, this._CssClasses.DRAWER)) {
                this._drawer = child;
            }

            if (u.hasClass(child, this._CssClasses.CONTENT)) {
                this._content = child;
                var layoutHeight = this.element.offsetHeight;
                var headerHeight = typeof this._header === 'undefined' ? 0 : this._header.offsetHeight;
                this._content.style.height = layoutHeight - headerHeight + 'px';
                var self = this;
                u.on(window, 'resize', function () {
                    var layoutHeight = self.element.offsetHeight;
                    var headerHeight = typeof self._header === 'undefined' ? 0 : self._header.offsetHeight;
                    self._content.style.height = layoutHeight - headerHeight + 'px';
                });
            }
        }

        if (this._header) {
            this._tabBar = this._header.querySelector('.' + this._CssClasses.TAB_BAR);
        }

        var mode = this._Mode.STANDARD;

        if (this._header) {
            if (u.hasClass(this._header, this._CssClasses.HEADER_SEAMED)) {
                mode = this._Mode.SEAMED;
                //} else if (u.hasClass(this._header,this._CssClasses.HEADER_SEAMED)) {
                //    mode = this._Mode.WATERFALL;
                //    u.on(this._header,'transitionend', this._headerTransitionEndHandler.bind(this));
                //    // this._header.addEventListener('transitionend', this._headerTransitionEndHandler.bind(this));
                //    u.on(this._header,'click', this._headerClickHandler.bind(this));
                //    // this._header.addEventListener('click', this._headerClickHandler.bind(this));
            } else if (u.hasClass(this._header, this._CssClasses.HEADER_SCROLL)) {
                    mode = this._Mode.SCROLL;
                    u.addClass(container, this._CssClasses.HAS_SCROLLING_HEADER);
                }

            if (mode === this._Mode.STANDARD) {
                u.addClass(this._header, this._CssClasses.CASTING_SHADOW);
                if (this._tabBar) {
                    u.addClass(this._tabBar, this._CssClasses.CASTING_SHADOW);
                }
            } else if (mode === this._Mode.SEAMED || mode === this._Mode.SCROLL) {
                u.removeClass(this._header, this._CssClasses.CASTING_SHADOW);
                if (this._tabBar) {
                    u.removeClass(this._tabBar, this._CssClasses.CASTING_SHADOW);
                }
            } else if (mode === this._Mode.WATERFALL) {
                // Add and remove shadows depending on scroll position.
                // Also add/remove auxiliary class for styling of the compact version of
                // the header.
                u.on(this._content, 'scroll', this._contentScrollHandler.bind(this));
                this._contentScrollHandler();
            }
        }

        // Add drawer toggling button to our layout, if we have an openable drawer.
        if (this._drawer) {
            var drawerButton = this.element.querySelector('.' + this._CssClasses.DRAWER_BTN);
            if (!drawerButton) {
                drawerButton = document.createElement('div');
                u.addClass(drawerButton, this._CssClasses.DRAWER_BTN);

                var drawerButtonIcon = document.createElement('i');
                drawerButtonIcon.className = 'fa fa-bars';
                //drawerButtonIcon.textContent = this._Constant.MENU_ICON;
                drawerButton.appendChild(drawerButtonIcon);
            }

            if (u.hasClass(this._drawer, this._CssClasses.ON_LARGE_SCREEN)) {
                //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
                u.addClass(drawerButton, this._CssClasses.ON_LARGE_SCREEN);
            } else if (u.hasClass(this._drawer, this._CssClasses.ON_SMALL_SCREEN)) {
                //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
                u.addClass(drawerButton, this._CssClasses.ON_SMALL_SCREEN);
            }
            u.on(drawerButton, 'click', this._drawerToggleHandler.bind(this));

            // Add a class if the layout has a drawer, for altering the left padding.
            // Adds the HAS_DRAWER to the elements since this._header may or may
            // not be present.
            u.addClass(this.element, this._CssClasses.HAS_DRAWER);

            // If we have a fixed header, add the button to the header rather than
            // the layout.
            if (u.hasClass(this.element, this._CssClasses.FIXED_HEADER) && this._header) {
                this._header.insertBefore(drawerButton, this._header.firstChild);
            } else {
                this.element.insertBefore(drawerButton, this._content);
            }
            this.drawerButton = drawerButton;

            var obfuscator = document.createElement('div');
            u.addClass(obfuscator, this._CssClasses.OBFUSCATOR);
            this.element.appendChild(obfuscator);
            u.on(obfuscator, 'click', this._drawerToggleHandler.bind(this));
            this._obfuscator = obfuscator;

            var leftnav = this.element.querySelector('.' + this._CssClasses.NAV);
            u.on(leftnav, 'click', this._navlinkClickHander.bind(this));

            var items = leftnav.querySelectorAll('.' + this._CssClasses.NAV_LINK);
            for (var i = 0; i < items.length; i++) {
                new u.Ripple(items[i]);
            }
        }

        // Keep an eye on screen size, and add/remove auxiliary class for styling
        // of small screens.

        if (u.isIE8 || u.isIE9) {
            u.on(window, 'resize', this._screenSizeHandler.bind(this));
        } else {
            this._screenSizeMediaQuery = window.matchMedia(
            /** @type {string} */this._Constant.MAX_WIDTH);
            this._screenSizeMediaQuery.addListener(this._screenSizeHandler.bind(this));
        }

        this._screenSizeHandler();

        // Initialize tabs, if any.
        if (this._header && this._tabBar) {
            u.addClass(this.element, this._CssClasses.HAS_TABS);

            var tabContainer = document.createElement('div');
            u.addClass(tabContainer, this._CssClasses.TAB_CONTAINER);
            this._header.insertBefore(tabContainer, this._tabBar);
            this._header.removeChild(this._tabBar);

            var leftButton = document.createElement('div');
            u.addClass(leftButton, this._CssClasses.TAB_BAR_BUTTON);
            u.addClass(leftButton, this._CssClasses.TAB_BAR_LEFT_BUTTON);
            var leftButtonIcon = document.createElement('i');
            u.addClass(leftButtonIcon, this._CssClasses.ICON);
            leftButtonIcon.textContent = this._Constant.CHEVRON_LEFT;
            leftButton.appendChild(leftButtonIcon);
            u.on(leftButton, 'click', function () {
                this._tabBar.scrollLeft -= this._Constant.TAB_SCROLL_PIXELS;
            }.bind(this));

            var rightButton = document.createElement('div');
            u.addClass(rightButton, this._CssClasses.TAB_BAR_BUTTON);
            u.addClass(rightButton, this._CssClasses.TAB_BAR_RIGHT_BUTTON);
            var rightButtonIcon = document.createElement('i');
            u.addClass(rightButtonIcon, this._CssClasses.ICON);
            rightButtonIcon.textContent = this._Constant.CHEVRON_RIGHT;
            rightButton.appendChild(rightButtonIcon);
            u.on(rightButton, 'click', function () {
                this._tabBar.scrollLeft += this._Constant.TAB_SCROLL_PIXELS;
            }.bind(this));

            tabContainer.appendChild(leftButton);
            tabContainer.appendChild(this._tabBar);
            tabContainer.appendChild(rightButton);

            // Add and remove buttons depending on scroll position.
            var tabScrollHandler = function () {
                if (this._tabBar.scrollLeft > 0) {
                    u.addClass(leftButton, this._CssClasses.IS_ACTIVE);
                } else {
                    u.removeClass(leftButton, this._CssClasses.IS_ACTIVE);
                }

                if (this._tabBar.scrollLeft < this._tabBar.scrollWidth - this._tabBar.offsetWidth) {
                    u.addClass(rightButton, this._CssClasses.IS_ACTIVE);
                } else {
                    u.removeClass(rightButton, this._CssClasses.IS_ACTIVE);
                }
            }.bind(this);

            u.on(this._tabBar, 'scroll', tabScrollHandler);
            tabScrollHandler();

            if (u.hasClass(this._tabBar, this._CssClasses.JS_RIPPLE_EFFECT)) {
                u.addClass(this._tabBar, this._CssClasses.RIPPLE_IGNORE_EVENTS);
            }

            // Select element tabs, document panels
            var tabs = this._tabBar.querySelectorAll('.' + this._CssClasses.TAB);
            var panels = this._content.querySelectorAll('.' + this._CssClasses.PANEL);

            // Create new tabs for each tab element
            for (var i = 0; i < tabs.length; i++) {
                new UNavLayoutTab(tabs[i], tabs, panels, this);
            }
        }

        u.addClass(this.element, this._CssClasses.IS_UPGRADED);
    },

    /**
     * Handles scrolling on the content.
     *
     * @private
     */
    _contentScrollHandler: function _contentScrollHandler() {
        if (u.hasClass(this._header, this._CssClasses.IS_ANIMATING)) {
            return;
        }

        if (this._content.scrollTop > 0 && !u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.addClass(this._header, this._CssClasses.CASTING_SHADOW).addClass(this._header, this._CssClasses.IS_COMPACT).addClass(this._header, this._CssClasses.IS_ANIMATING);
        } else if (this._content.scrollTop <= 0 && u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.removeClass(this._header, this._CssClasses.CASTING_SHADOW).removeClass(this._header, this._CssClasses.IS_COMPACT).addClass(this._header, this._CssClasses.IS_ANIMATING);
        }
    },

    /**
     * Handles changes in screen size.
     *
     * @private
     */
    _screenSizeHandler: function _screenSizeHandler() {
        if (u.isIE8 || u.isIE9) {
            this._screenSizeMediaQuery = {};
            var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (w > 1024) this._screenSizeMediaQuery.matches = false;else this._screenSizeMediaQuery.matches = true;
        }
        if (this._screenSizeMediaQuery.matches) {
            u.addClass(this.element, this._CssClasses.IS_SMALL_SCREEN);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_SMALL_SCREEN);
            // Collapse drawer (if any) when moving to a large screen size.
            if (this._drawer) {
                u.removeClass(this._drawer, this._CssClasses.IS_DRAWER_OPEN);
                u.removeClass(this._obfuscator, this._CssClasses.IS_DRAWER_OPEN);
            }
        }
    },
    /**
     * Handles toggling of the drawer.
     *
     * @private
     */
    _drawerToggleHandler: function _drawerToggleHandler() {
        u.toggleClass(this._drawer, this._CssClasses.IS_DRAWER_OPEN);
        u.toggleClass(this._obfuscator, this._CssClasses.IS_DRAWER_OPEN);
    },
    /**
     * Handles (un)setting the `is-animating` class
     *
     * @private
     */
    _headerTransitionEndHandler: function _headerTransitionEndHandler() {
        u.removeClass(this._header, this._CssClasses.IS_ANIMATING);
    },
    /**
     * Handles expanding the header on click
     *
     * @private
     */
    _headerClickHandler: function _headerClickHandler() {
        if (u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.removeClass(this._header, this._CssClasses.IS_COMPACT);
            u.addClass(this._header, this._CssClasses.IS_ANIMATING);
        }
    },
    /**
     * Reset tab state, dropping active classes
     *
     * @private
     */
    _resetTabState: function _resetTabState(tabBar) {
        for (var k = 0; k < tabBar.length; k++) {
            u.removeClass(tabBar[k], this._CssClasses.IS_ACTIVE);
        }
    },
    /**
     * Reset panel state, droping active classes
     *
     * @private
     */
    _resetPanelState: function _resetPanelState(panels) {
        for (var j = 0; j < panels.length; j++) {
            u.removeClass(panels[j], this._CssClasses.IS_ACTIVE);
        }
    },
    _navlinkClickHander: function _navlinkClickHander(e) {
        //var _target = e.currentTarget || e.target || e.srcElement;
        var curlink = this.element.querySelector('.' + this._CssClasses.NAV_LINK_CURRENT);
        curlink && u.removeClass(curlink, this._CssClasses.NAV_LINK_CURRENT);
        // if (curlink && u.isIE8){
        // 	var sub = curlink.parentNode.querySelector('.'+this._CssClasses.NAV_SUB);
        // 	if (sub){
        // 		sub.style.maxHeight = '0';
        // 	}
        // }

        var item = u.closest(e.target, this._CssClasses.NAV_LINK);

        if (item) {
            u.addClass(item, this._CssClasses.NAV_LINK_CURRENT);
            var sub = item.parentNode.querySelector('.' + this._CssClasses.NAV_SUB),
                open = u.hasClass(item, this._CssClasses.NAV_LINK_OPEN);
            if (sub && open) {
                u.removeClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8) sub.style.maxHeight = 0;
            }
            if (sub && !open) {
                u.addClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8) sub.style.maxHeight = '999px';
            }
            // sub && open && u.removeClass(item, this._CssClasses.NAV_LINK_OPEN);
            // sub && !open && u.addClass(item, this._CssClasses.NAV_LINK_OPEN);
        }
    }
});

/**
 * Constructor for an individual tab.
 *
 * @constructor
 * @param {HTMLElement} tab The HTML element for the tab.
 * @param {!Array<HTMLElement>} tabs Array with HTML elements for all tabs.
 * @param {!Array<HTMLElement>} panels Array with HTML elements for all panels.
 * @param {UNavLayout} layout The UNavLayout object that owns the tab.
 */
function UNavLayoutTab(tab, tabs, panels, layout) {

    /**
     * Auxiliary method to programmatically select a tab in the UI.
     */
    function selectTab() {
        var href = tab.href.split('#')[1];
        var panel = layout._content.querySelector('#' + href);
        layout._resetTabState(tabs);
        layout._resetPanelState(panels);
        u.addClass(tab, layout._CssClasses.IS_ACTIVE);
        u.addClass(panel, layout._CssClasses.IS_ACTIVE);
    }

    //if (layout.tabBar_.classList.contains(layout._CssClasses.JS_RIPPLE_EFFECT)) {
    var rippleContainer = document.createElement('span');
    u.addClass(rippleContainer, 'u-ripple');
    //rippleContainer.classList.add(layout._CssClasses.JS_RIPPLE_EFFECT);
    //var ripple = document.createElement('span');
    //ripple.classList.add(layout._CssClasses.RIPPLE);
    //rippleContainer.appendChild(ripple);
    tab.appendChild(rippleContainer);
    new URipple(tab);
    //}
    u.on(tab, 'click', function (e) {
        if (tab.getAttribute('href').charAt(0) === '#') {
            e.preventDefault();
            selectTab();
        }
    });

    tab.show = selectTab;

    u.on(tab, 'click', function (e) {
        e.preventDefault();
        var href = tab.href.split('#')[1];
        var panel = layout._content.querySelector('#' + href);
        layout._resetTabState(tabs);
        layout._resetPanelState(panels);
        u.addClass(tab, layout._CssClasses.IS_ACTIVE);
        u.addClass(panel, layout._CssClasses.IS_ACTIVE);
    });
}
u.NavLayoutTab = UNavLayoutTab;

u.compMgr.regComp({
    comp: u.NavLayout,
    compAsString: 'u.NavLayout',
    css: 'u-navlayout'
});
'use strict';

u.slidePanelTemplate = ['<div class="slidePanel slidePanel-right  slidePanel-show slidePanel-dragging" style="transform:translate3d(100%,0,0);">', '<div class="slidePanel-content site-sidebar-content"></div>', '<div class="slidePanel-handler"></div>', '</div>'];

u.slidePanel = function (options) {
    var url = options['url'],
        width = options['width'] || '700px',
        callback = options['callback'] || function () {},
        slideDom = u.makeDOM(u.slidePanelTemplate.join('')),
        overlayDiv = u.makeModal(slideDom);
    slideDom.style.width = width;
    overlayDiv.style.opacity = 0;
    document.body.appendChild(slideDom);
    //overlayDiv.style.opacity = 0.5;
    u.ajax({
        type: 'get',
        url: url,
        success: function success(data) {
            var content = slideDom.querySelector('.slidePanel-content');
            content.innerHTML = data;
            callback();
            setTimeout(function () {
                slideDom.style.transform = 'translate3d(0,0,0)';
                overlayDiv.style.opacity = 0.5;
            }, 1);
        }
    });

    u.on(overlayDiv, 'click', function () {
        u.on(slideDom, 'transitionend', function () {
            document.body.removeChild(slideDom);
            document.body.removeChild(overlayDiv);
        });
        u.on(slideDom, 'webkitTransitionEnd', function () {
            document.body.removeChild(slideDom);
            document.body.removeChild(overlayDiv);
        });
        slideDom.style.transform = 'translate3d(100%,0,0)';
        overlayDiv.style.opacity = 0;
    });

    return {
        close: function close() {
            overlayDiv.click();
        }
    };
};
'use strict';

var URipple = function URipple(element) {
  if (u.isIE8) return;
  this._element = element;

  // Initialize instance.
  this.init();
};
//window['URipple'] = URipple;

URipple.prototype._down = function (event) {
  if (!this._rippleElement.style.width && !this._rippleElement.style.height) {
    var rect = this._element.getBoundingClientRect();
    this.rippleSize_ = Math.sqrt(rect.width * rect.width + rect.height * rect.height) * 2 + 2;
    this._rippleElement.style.width = this.rippleSize_ + 'px';
    this._rippleElement.style.height = this.rippleSize_ + 'px';
  }

  u.addClass(this._rippleElement, 'is-visible');

  if (event.type === 'mousedown' && this._ignoringMouseDown) {
    this._ignoringMouseDown = false;
  } else {
    if (event.type === 'touchstart') {
      this._ignoringMouseDown = true;
    }
    var frameCount = this.getFrameCount();
    if (frameCount > 0) {
      return;
    }
    this.setFrameCount(1);
    var t = event.currentTarget || event.target || event.srcElement;
    var bound = t.getBoundingClientRect();
    var x;
    var y;
    // Check if we are handling a keyboard click.
    if (event.clientX === 0 && event.clientY === 0) {
      x = Math.round(bound.width / 2);
      y = Math.round(bound.height / 2);
    } else {
      var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
      var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
      x = Math.round(clientX - bound.left);
      y = Math.round(clientY - bound.top);
    }
    this.setRippleXY(x, y);
    this.setRippleStyles(true);
    if (window.requestAnimationFrame) window.requestAnimationFrame(this.animFrameHandler.bind(this));
  }
};

/**
 * Handle mouse / finger up on element.
 *
 * @param {Event} event The event that fired.
 * @private
 */
URipple.prototype._up = function (event) {
  var self = this;
  // Don't fire for the artificial "mouseup" generated by a double-click.
  if (event && event.detail !== 2) {
    u.removeClass(this._rippleElement, 'is-visible');
  }
  // Allow a repaint to occur before removing this class, so the animation
  // shows for tap events, which seem to trigger a mouseup too soon after
  // mousedown.
  window.setTimeout(function () {
    u.removeClass(self._rippleElement, 'is-visible');
  }, 0);
};

/**
 * Initialize element.
 */
URipple.prototype.init = function () {
  var self = this;
  if (this._element) {
    this._rippleElement = this._element.querySelector('.u-ripple');
    if (!this._rippleElement) {
      this._rippleElement = document.createElement('span');
      u.addClass(this._rippleElement, 'u-ripple');
      this._element.appendChild(this._rippleElement);
      this._element.style.overflow = 'hidden';
      this._element.style.position = 'relative';
    }
    this.frameCount_ = 0;
    this.rippleSize_ = 0;
    this.x_ = 0;
    this.y_ = 0;

    // Touch start produces a compat mouse down event, which would cause a
    // second ripples. To avoid that, we use this property to ignore the first
    // mouse down after a touch start.
    this._ignoringMouseDown = false;
    u.on(this._element, 'mousedown', function (e) {
      self._down(e);
    });
    u.on(this._element, 'touchstart', function (e) {
      self._down(e);
    });

    u.on(this._element, 'mouseup', function (e) {
      self._up(e);
    });
    u.on(this._element, 'mouseleave', function (e) {
      self._up(e);
    });
    u.on(this._element, 'touchend', function (e) {
      self._up(e);
    });
    u.on(this._element, 'blur', function (e) {
      self._up(e);
    });

    /**
     * Getter for frameCount_.
     * @return {number} the frame count.
     */
    this.getFrameCount = function () {
      return this.frameCount_;
    };

    /**
     * Setter for frameCount_.
     * @param {number} fC the frame count.
     */
    this.setFrameCount = function (fC) {
      this.frameCount_ = fC;
    };

    /**
     * Getter for _rippleElement.
     * @return {Element} the ripple element.
     */
    this.getRippleElement = function () {
      return this._rippleElement;
    };

    /**
     * Sets the ripple X and Y coordinates.
     * @param  {number} newX the new X coordinate
     * @param  {number} newY the new Y coordinate
     */
    this.setRippleXY = function (newX, newY) {
      this.x_ = newX;
      this.y_ = newY;
    };

    /**
     * Sets the ripple styles.
     * @param  {boolean} start whether or not this is the start frame.
     */
    this.setRippleStyles = function (start) {
      if (this._rippleElement !== null) {
        var transformString;
        var scale;
        var size;
        var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

        if (start) {
          scale = 'scale(0.0001, 0.0001)';
          size = '1px';
        } else {
          scale = '';
          size = this.rippleSize_ + 'px';
        }

        transformString = 'translate(-50%, -50%) ' + offset + scale;

        this._rippleElement.style.webkitTransform = transformString;
        this._rippleElement.style.msTransform = transformString;
        this._rippleElement.style.transform = transformString;

        if (start) {
          u.removeClass(this._rippleElement, 'is-animating');
        } else {
          u.addClass(this._rippleElement, 'is-animating');
        }
      }
    };

    /**
     * Handles an animation frame.
     */
    this.animFrameHandler = function () {
      if (this.frameCount_-- > 0) {
        window.requestAnimationFrame(this.animFrameHandler.bind(this));
      } else {
        this.setRippleStyles(false);
      }
    };
  }
};

u.Ripple = URipple;
'use strict';

u.Button = u.BaseComponent.extend({
    init: function init() {
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer, 'u-button-container');
        this._rippleElement = document.createElement('span');
        u.addClass(this._rippleElement, 'u-ripple');
        if (u.isIE8) u.addClass(this._rippleElement, 'oldIE');
        rippleContainer.appendChild(this._rippleElement);
        u.on(this._rippleElement, 'mouseup', this.element.blur);
        this.element.appendChild(rippleContainer);

        u.on(this.element, 'mouseup', this.element.blur);
        u.on(this.element, 'mouseleave', this.element.blur);
        this.ripple = new u.Ripple(this.element);
    }

});

u.compMgr.regComp({
    comp: u.Button,
    compAsString: 'u.Button',
    css: 'u-button'
});
'use strict';

u.Checkbox = u.BaseComponent.extend({
    _Constant: {
        TINY_TIMEOUT: 0.001
    },

    _CssClasses: {
        INPUT: 'u-checkbox-input',
        BOX_OUTLINE: 'u-checkbox-outline',
        FOCUS_HELPER: 'u-checkbox-focus-helper',
        TICK_OUTLINE: 'u-checkbox-tick-outline',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked',
        IS_UPGRADED: 'is-upgraded'
    },
    init: function init() {
        this._inputElement = this.element.querySelector('input');

        var boxOutline = document.createElement('span');
        u.addClass(boxOutline, this._CssClasses.BOX_OUTLINE);

        var tickContainer = document.createElement('span');
        u.addClass(tickContainer, this._CssClasses.FOCUS_HELPER);

        var tickOutline = document.createElement('span');
        u.addClass(tickOutline, this._CssClasses.TICK_OUTLINE);

        boxOutline.appendChild(tickOutline);

        this.element.appendChild(tickContainer);
        this.element.appendChild(boxOutline);

        //if (this.element.classList.contains(this._CssClasses.RIPPLE_EFFECT)) {
        //  u.addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
        this.rippleContainerElement_ = document.createElement('span');
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CONTAINER);
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_EFFECT);
        //this.rippleContainerElement_.classList.add(this._CssClasses.RIPPLE_CENTER);
        this.boundRippleMouseUp = this._onMouseUp.bind(this);
        this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);

        //var ripple = document.createElement('span');
        //ripple.classList.add(this._CssClasses.RIPPLE);

        //this.rippleContainerElement_.appendChild(ripple);
        this.element.appendChild(this.rippleContainerElement_);
        new URipple(this.rippleContainerElement_);

        //}
        this.boundInputOnChange = this._onChange.bind(this);
        this.boundInputOnFocus = this._onFocus.bind(this);
        this.boundInputOnBlur = this._onBlur.bind(this);
        this.boundElementMouseUp = this._onMouseUp.bind(this);
        //this._inputElement.addEventListener('change', this.boundInputOnChange);
        //this._inputElement.addEventListener('focus', this.boundInputOnFocus);
        //this._inputElement.addEventListener('blur', this.boundInputOnBlur);
        //this.element.addEventListener('mouseup', this.boundElementMouseUp);
        if (!u.hasClass(this.element, 'only-style')) {
            u.on(this.element, 'click', function (e) {
                if (!this._inputElement.disabled) {
                    this.toggle();
                    u.stopEvent(e);
                }
            }.bind(this));
        }

        this._updateClasses();
        u.addClass(this.element, this._CssClasses.IS_UPGRADED);
    },

    _onChange: function _onChange(event) {
        this._updateClasses();
        this.trigger('change', { isChecked: this._inputElement.checked });
    },

    _onFocus: function _onFocus() {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onBlur: function _onBlur() {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onMouseUp: function _onMouseUp(event) {
        this._blur();
    },

    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses: function _updateClasses() {
        this.checkDisabled();
        this.checkToggleState();
    },

    /**
     * Add blur.
     *
     * @private
     */
    _blur: function _blur() {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._inputElement.blur();
        }.bind(this), /** @type {number} */this._Constant.TINY_TIMEOUT);
    },

    // Public methods.

    /**
     * Check the inputs toggle state and update display.
     *
     * @public
     */
    checkToggleState: function checkToggleState() {
        if (this._inputElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED);
        }
    },

    /**
     * Check the inputs disabled state and update display.
     *
     * @public
     */
    checkDisabled: function checkDisabled() {
        if (this._inputElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },

    isChecked: function isChecked() {
        //return u.hasClass(this.element,this._CssClasses.IS_CHECKED);
        return this._inputElement.checked;
    },

    toggle: function toggle() {
        //return;
        if (this.isChecked()) {
            this.uncheck();
        } else {
            this.check();
        }
    },

    /**
     * Disable checkbox.
     *
     * @public
     */
    disable: function disable() {
        this._inputElement.disabled = true;
        this._updateClasses();
    },

    /**
     * Enable checkbox.
     *
     * @public
     */
    enable: function enable() {
        this._inputElement.disabled = false;
        this._updateClasses();
    },

    /**
     * Check checkbox.
     *
     * @public
     */
    check: function check() {
        this._inputElement.checked = true;
        this._updateClasses();
        this.boundInputOnChange();
    },

    /**
     * Uncheck checkbox.
     *
     * @public
     */
    uncheck: function uncheck() {
        this._inputElement.checked = false;
        this._updateClasses();
        this.boundInputOnChange();
    }

});

if (u.compMgr) u.compMgr.regComp({
    comp: u.Checkbox,
    compAsString: 'u.Checkbox',
    css: 'u-checkbox'
});
'use strict';

/**
 * Created by dingrf on 2015-11-20.
 */

u.Combo = u.BaseComponent.extend({
    init: function init() {
        this.mutilSelect = this.options['mutilSelect'] || false;
        if (u.hasClass(this.element, 'mutil-select')) {
            this.mutilSelect = true;
        }

        this.onlySelect = this.options['onlySelect'] || false;
        if (this.mutilSelect) this.onlySelect = true;

        this.comboDatas = [];
        var i,
            option,
            datas = [],
            self = this;
        //u.addClass(this.element, 'u-text')
        new u.Text(this.element);
        var options = this.element.getElementsByTagName('option');
        for (i = 0; i < options.length; i++) {
            option = options[i];
            datas.push({ value: option.value, name: option.text });
        }

        this.setComboData(datas);
        this._input = this.element.querySelector("input");
        if (this.onlySelect) {
            setTimeout(function () {
                self._input.setAttribute('readonly', 'readonly');
            }, 1000);
        } else {
            u.on(this._input, 'blur', function (e) {
                var v = this.value;
                /*校验数值是否存在于datasource的name中*/
                for (var i = 0; i < self.comboDatas.length; i++) {
                    if (v == self.comboDatas[i].name) {
                        v = self.comboDatas[i].value;
                        break;
                    }
                }
                self.setValue(v);
            });
        }
        this._combo_name_par = this.element.querySelector(".u-combo-name-par");
        u.on(this._input, 'focus', function (e) {
            self._inputFocus = true;
            self.show(e);
            u.stopEvent(e);
        });
        u.on(this._input, 'blur', function (e) {
            self._inputFocus = false;
        });
        this.iconBtn = this.element.querySelector("[data-role='combo-button']");
        if (this.iconBtn) {
            u.on(this.iconBtn, 'click', function (e) {
                self.show(e);
                u.stopEvent(e);
            });
        }
    },

    show: function show(evt) {
        var self = this,
            width = this.element.offsetWidth;
        u.showPanelByEle({
            ele: this._input,
            panel: this._ul,
            position: "bottomLeft"
        });
        this._ul.style.width = width + 'px';
        u.addClass(this._ul, 'is-animating');
        this._ul.style.zIndex = u.getZIndex();
        u.addClass(this._ul, 'is-visible');

        var callback = function (e) {
            if (e === evt || e.target === this._input || self._inputFocus == true) return;
            if (this.mutilSelect && (u.closest(e.target, 'u-combo-ul') === self._ul || u.closest(e.target, 'u-combo-name-par') || u.closest(e.target, 'u-combo-name'))) return;
            u.off(document, 'click', callback);
            // document.removeEventListener('click', callback);
            this.hide();
        }.bind(this);
        u.on(document, 'click', callback);
        // document.addEventListener('click', callback);
    },

    hide: function hide() {
        u.removeClass(this._ul, 'is-visible');
        this._ul.style.zIndex = -1;
        this.trigger('select', { value: this.value });
    },

    /**
     * 设置下拉数据
     * @param datas  数据项
     * @param options  指定name value对应字段 可以为空
     */
    setComboData: function setComboData(datas, options) {
        var i,
            li,
            self = this;
        if (!options) this.comboDatas = datas;else {
            this.comboDatas = [];
            for (var i = 0; i < datas.length; i++) {
                this.comboDatas.push({ name: datas[i][options.name], value: datas[i][options.value] });
            }
        }
        if (!this._ul) {
            this._ul = u.makeDOM('<ul class="u-combo-ul"></ul>');
            // this.element.parentNode.appendChild(this._ul);
            document.body.appendChild(this._ul);
        }
        this._ul.innerHTML = '';
        //TODO 增加filter
        for (i = 0; i < this.comboDatas.length; i++) {
            li = u.makeDOM('<li class="u-combo-li">' + this.comboDatas[i].name + '</li>'); //document.createElement('li');
            li._index = i;
            u.on(li, 'click', function () {
                self.selectItem(this._index);
            });
            var rippleContainer = document.createElement('span');
            u.addClass(rippleContainer, 'u-ripple');
            li.appendChild(rippleContainer);
            new URipple(li);
            this._ul.appendChild(li);
        }
    },

    selectItem: function selectItem(index) {
        var self = this;

        if (this.mutilSelect) {
            var val = this.comboDatas[index].value;
            var name = this.comboDatas[index].name;
            var index = (this.value + ',').indexOf(val + ',');
            var l = val.length + 1;
            var flag;
            if (index != -1) {
                // 已经选中
                this.value = this.value.substring(0, index) + this.value.substring(index + l);
                flag = '-';
            } else {
                this.value = !this.value ? val + ',' : this.value + val + ',';
                flag = '+';
            }

            if (flag == '+') {
                var nameDiv = u.makeDOM('<div class="u-combo-name" key="' + val + '">' + name + /*<a href="javascript:void(0)" class="remove">x</a>*/'</div>');
                var parNameDiv = u.makeDOM('<div class="u-combo-name-par" style="position:absolute"></div>');
                /*var _a = nameDiv.querySelector('a');
                u.on(_a, 'click', function(){
                    var values = self.value.split(',');
                    values.splice(values.indexOf(val),1);
                    self.value = values.join(',');
                    self._combo_name_par.removeChild(nameDiv);
                    self._updateItemSelect();
                    self.trigger('select', {value: self.value, name: name});
                });*/
                if (!this._combo_name_par) {
                    this._input.parentNode.insertBefore(parNameDiv, this._input);
                    this._combo_name_par = parNameDiv;
                }
                this._combo_name_par.appendChild(nameDiv);
            } else {
                if (this._combo_name_par) {
                    var comboDiv = this._combo_name_par.querySelector('[key="' + val + '"]');
                    if (comboDiv) comboDiv.remove();
                }
            }

            this._updateItemSelect();

            // this.trigger('select', {value: this.value, name: name});
        } else {
                this.value = this.comboDatas[index].value;
                this._input.value = this.comboDatas[index].name;
                this._updateItemSelect();
                // this.trigger('select', {value: this.value, name: this._input.value});
            }
    },

    _updateItemSelect: function _updateItemSelect() {
        var lis = this._ul.querySelectorAll('.u-combo-li');
        if (this.mutilSelect) {
            var values = this.value.split(',');
            for (var i = 0; i < lis.length; i++) {
                if (values.indexOf(this.comboDatas[i].value) > -1) {
                    u.addClass(lis[i], 'is-selected');
                } else {
                    u.removeClass(lis[i], 'is-selected');
                }
            }
            /*根据多选区域div的高度调整input的高度*/
            var h = this._combo_name_par.offsetHeight;
            if (h < 25) h = 25;
            this._input.style.height = h + 'px';
        } else {
            for (var i = 0; i < lis.length; i++) {
                if (this.value == this.comboDatas[i].value) {
                    u.addClass(lis[i], 'is-selected');
                } else {
                    u.removeClass(lis[i], 'is-selected');
                }
            }
        }
    },

    /**
     *设置值
     * @param value
     */
    setValue: function setValue(value) {
        var self = this;
        value = value + '';
        value = value || '';

        var values = value.split(',');
        if (this.mutilSelect === true) {
            if (self._combo_name_par) self._combo_name_par.innerHTML = '';
            this.value = '';
        }
        if (!value) {
            this._input.value = '';
            this.value = '';
        }
        this.comboDatas.forEach(function (item, index) {
            if (this.mutilSelect === true) {
                if (values.indexOf(item.value) != -1) {
                    this.selectItem(index);
                }
            } else {
                if (item.value === value) {
                    this.selectItem(index);
                    return;
                }
            }
        }.bind(this));
        if (!this.onlySelect) {
            this.value = value;
            this.trigger('select', { value: this.value, name: this._input.value });
        }
    },

    /**
     * 设置显示名
     * @param name
     */
    setName: function setName(name) {
        this.comboDatas.forEach(function (item, index) {
            if (item.name === name) {
                this.selectItem(index);
                return;
            }
        }.bind(this));
    }

});

u.compMgr.regComp({
    comp: u.Combo,
    compAsString: 'u.Combo',
    css: 'u-combo'
});
"use strict";

/*
*加载loading
*/
u.loadTemplate = "<div class='u-loader-container'><div class='u-loader'>{centerContent}</div>{loadDesc}</div>"; //{centerContent}为加载条中间内容
/**
 * @param  {Object} options 
 * @return {[type]}
 */
u.showLoader = function (options) {
	// hasback:是否含有遮罩层，centerContent加载图标中的内容，parEle加载图标的父元素,hasDesc加载条说明
	var hasback, centerContent, template, parEle, templateDom, loadDesc;
	options = options || {};
	hasback = options["hasback"];
	centerContent = options["centerContent"] || '';
	// hasDesc=options["hasDesc"];
	template = u.loadTemplate.replace('{centerContent}', centerContent);
	loadDesc = options["hasDesc"] ? "<div class='u-loader-desc'>页面加载中，请稍后。。。</div>" : " ";

	template = template.replace("{loadDesc}", loadDesc);

	templateDom = u.makeDOM(template);
	parEle = options["parEle"] || document.body;
	if (hasback) {
		var overlayDiv = u.makeModal(templateDom);
	}
	if (parEle == document.body) {
		templateDom.style.position = 'fixed';
	}
	parEle.appendChild(templateDom);
};
u.hideLoader = function () {
	var divs = document.querySelectorAll('.u-overlay,.u-loader-container');
	for (var i = 0; i < divs.length; i++) {
		divs[i].parentNode.removeChild(divs[i]);
	}
};
'use strict';

u.Loading = u.BaseComponent.extend({
  _Constant: {
    U_LOADING_LAYER_COUNT: 4
  },

  _CssClasses: {
    U_LOADING_LAYER: 'u-loading-layer',
    U_LOADING_CIRCLE_CLIPPER: 'u-loading-circle-clipper',
    U_LOADING_CIRCLE: 'u-loading-circle',
    U_LOADING_GAP_PATCH: 'u-loading-gap-patch',
    U_LOADING_LEFT: 'u-loading-left',
    U_LOADING_RIGHT: 'u-loading-right'
  },

  init: function init() {
    if (u.isIE8 || u.isIE9) {
      var img = document.createElement('div');
      img.className = "loadingImg";
      this.element.appendChild(img);
    } else {
      for (var i = 1; i <= this._Constant.U_LOADING_LAYER_COUNT; i++) {
        this.createLayer(i);
      }
    }
    u.addClass(this.element, 'is-upgraded');
  },

  createLayer: function createLayer(index) {
    var layer = document.createElement('div');
    u.addClass(layer, this._CssClasses.U_LOADING_LAYER);
    u.addClass(layer, this._CssClasses.U_LOADING_LAYER + '-' + index);

    var leftClipper = document.createElement('div');
    u.addClass(leftClipper, this._CssClasses.U_LOADING_CIRCLE_CLIPPER);
    u.addClass(leftClipper, this._CssClasses.U_LOADING_LEFT);

    var gapPatch = document.createElement('div');
    u.addClass(gapPatch, this._CssClasses.U_LOADING_GAP_PATCH);

    var rightClipper = document.createElement('div');
    u.addClass(rightClipper, this._CssClasses.U_LOADING_CIRCLE_CLIPPER);
    u.addClass(rightClipper, this._CssClasses.U_LOADING_RIGHT);

    var circleOwners = [leftClipper, gapPatch, rightClipper];

    for (var i = 0; i < circleOwners.length; i++) {
      var circle = document.createElement('div');
      u.addClass(circle, this._CssClasses.U_LOADING_CIRCLE);
      circleOwners[i].appendChild(circle);
    }

    layer.appendChild(leftClipper);
    layer.appendChild(gapPatch);
    layer.appendChild(rightClipper);

    this.element.appendChild(layer);
  },

  stop: function stop() {
    u.removeClass(this.element, 'is-active');
  },

  start: function start() {
    u.addClass(this.element, 'is-active');
  }

});

u.compMgr.regComp({
  comp: u.Loading,
  compAsString: 'u.Loading',
  css: 'u-loading'
});

u.showLoading = function (op) {
  var htmlStr = '<div class="alert alert-waiting"><i class="fa fa-spinner fa-spin"></i></div>';
  document.body.appendChild(u.makeDOM(htmlStr));
  htmlStr = '<div class="alert-backdrop" role="waiting-backdrop"></div>';
  document.body.appendChild(u.makeDOM(htmlStr));
};

u.hideLoading = function () {
  var divs = document.querySelectorAll('.alert-waiting,.alert-backdrop');
  for (var i = 0; i < divs.length; i++) {
    document.body.removeChild(divs[i]);
  }
};

//兼容性保留
u.showWaiting = u.showLoading;
u.removeWaiting = u.hideLoading;
'use strict';

u.Menu = u.BaseComponent.extend({
    _Keycodes: {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        UP_ARROW: 38,
        DOWN_ARROW: 40
    },
    _CssClasses: {

        BOTTOM_LEFT: 'u-menu-bottom-left', // This is the default.
        BOTTOM_RIGHT: 'u-menu-bottom-right',
        TOP_LEFT: 'u-menu-top-left',
        TOP_RIGHT: 'u-menu-top-right',
        UNALIGNED: 'u-menu-unaligned'
    },

    init: function init() {

        // Create container for the menu.
        var container = document.createElement('div');
        u.addClass(container, 'u-menu-container');
        this.element.parentElement.insertBefore(container, this.element);
        this.element.parentElement.removeChild(this.element);
        container.appendChild(this.element);
        this._container = container;

        // Create outline for the menu (shadow and background).
        var outline = document.createElement('div');
        u.addClass(outline, 'u-menu-outline');
        this._outline = outline;
        container.insertBefore(outline, this.element);

        // Find the "for" element and bind events to it.
        var forElId = this.element.getAttribute('for') || this.element.getAttribute('data-u-for');
        var forEl = null;
        if (forElId) {
            forEl = document.getElementById(forElId);
            if (forEl) {
                this.for_element = forEl;
                u.on(forEl, 'click', this._handleForClick.bind(this));
                u.on(forEl, 'keydown', this._handleForKeyboardEvent.bind(this));
            }
        }

        var items = this.element.querySelectorAll('.u-menu-item');
        this._boundItemKeydown = this._handleItemKeyboardEvent.bind(this);
        this._boundItemClick = this._handleItemClick.bind(this);
        for (var i = 0; i < items.length; i++) {
            // Add a listener to each menu item.
            u.on(items[i], 'click', this._boundItemClick);
            // Add a tab index to each menu item.
            items[i].tabIndex = '-1';
            // Add a keyboard listener to each menu item.
            u.on(items[i], 'keydown', this._boundItemKeydown);
        }

        for (i = 0; i < items.length; i++) {
            var item = items[i];

            var rippleContainer = document.createElement('span');
            u.addClass(rippleContainer, 'u-ripple');
            item.appendChild(rippleContainer);
            new URipple(item);
        }
        //}

        // Copy alignment classes to the container, so the outline can use them.
        if (u.hasClass(this.element, 'u-menu-bottom-left')) {
            u.addClass(this._outline, 'u-menu-bottom-left');
        }
        if (u.hasClass(this.element, 'u-menu-bottom-right')) {
            u.addClass(this._outline, 'u-menu-bottom-right');
        }
        if (u.hasClass(this.element, 'u-menu-top-left')) {
            u.addClass(this._outline, 'u-menu-top-left');
        }
        if (u.hasClass(this.element, 'u-menu-top-right')) {
            u.addClass(this._outline, 'u-menu-top-right');
        }
        if (u.hasClass(this.element, 'u-menu-unaligned')) {
            u.addClass(this._outline, 'u-menu-unaligned');
        }

        u.addClass(container, 'is-upgraded');
    },
    _handleForClick: function _handleForClick(evt) {
        if (this.element && this.for_element) {
            var rect = this.for_element.getBoundingClientRect();
            var forRect = this.for_element.parentElement.getBoundingClientRect();

            if (u.hasClass(this.element, 'u-menu-unaligned')) {
                // Do not position the menu automatically. Requires the developer to
                // manually specify position.
            } else if (u.hasClass(this.element, 'u-menu-bottom-right')) {
                    // Position below the "for" element, aligned to its right.
                    this._container.style.right = forRect.right - rect.right + 'px';
                    this._container.style.top = this.for_element.offsetTop + this.for_element.offsetHeight + 'px';
                } else if (u.hasClass(this.element, 'u-menu-top-left')) {
                    // Position above the "for" element, aligned to its left.
                    this._container.style.left = this.for_element.offsetLeft + 'px';
                    this._container.style.bottom = forRect.bottom - rect.top + 'px';
                } else if (u.hasClass(this.element, 'u-menu-top-right')) {
                    // Position above the "for" element, aligned to its right.
                    this._container.style.right = forRect.right - rect.right + 'px';
                    this._container.style.bottom = forRect.bottom - rect.top + 'px';
                } else {
                    // Default: position below the "for" element, aligned to its left.
                    this._container.style.left = this.for_element.offsetLeft + 'px';
                    this._container.style.top = this.for_element.offsetTop + this.for_element.offsetHeight + 'px';
                }
        }

        this.toggle(evt);
    },
    /**
     * Handles a keyboard event on the "for" element.
     *
     * @param {Event} evt The event that fired.
     * @private
     */
    _handleForKeyboardEvent: function _handleForKeyboardEvent(evt) {
        if (this.element && this._container && this.for_element) {
            var items = this.element.querySelectorAll('.u-menu-item:not([disabled])');

            if (items && items.length > 0 && u.hasClass(this._container, 'is-visible')) {
                if (evt.keyCode === this._Keycodes.UP_ARROW) {
                    u.stopEvent(evt);
                    // evt.preventDefault();
                    items[items.length - 1].focus();
                } else if (evt.keyCode === this._Keycodes.DOWN_ARROW) {
                    u.stopEvent(evt);
                    // evt.preventDefault();
                    items[0].focus();
                }
            }
        }
    },
    /**
     * Handles a keyboard event on an item.
     *
     * @param {Event} evt The event that fired.
     * @private
     */
    _handleItemKeyboardEvent: function _handleItemKeyboardEvent(evt) {
        if (this.element && this._container) {
            var items = this.element.querySelectorAll('.u-menu-item:not([disabled])');

            if (items && items.length > 0 && u.hasClass(this._container, 'is-visible')) {
                var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);

                if (evt.keyCode === this._Keycodes.UP_ARROW) {
                    u.stopEvent(evt);
                    // evt.preventDefault();
                    if (currentIndex > 0) {
                        items[currentIndex - 1].focus();
                    } else {
                        items[items.length - 1].focus();
                    }
                } else if (evt.keyCode === this._Keycodes.DOWN_ARROW) {
                    u.stopEvent(evt);
                    // evt.preventDefault();
                    if (items.length > currentIndex + 1) {
                        items[currentIndex + 1].focus();
                    } else {
                        items[0].focus();
                    }
                } else if (evt.keyCode === this._Keycodes.SPACE || evt.keyCode === this._Keycodes.ENTER) {
                    u.stopEvent(evt);
                    // evt.preventDefault();
                    // Send mousedown and mouseup to trigger ripple.
                    var e = new MouseEvent('mousedown');
                    evt.target.dispatchEvent(e);
                    e = new MouseEvent('mouseup');
                    evt.target.dispatchEvent(e);
                    // Send click.
                    evt.target.click();
                } else if (evt.keyCode === this._Keycodes.ESCAPE) {
                    u.stopEvent(evt);
                    // evt.preventDefault();
                    this.hide();
                }
            }
        }
    },
    /**
     * Handles a click event on an item.
     *
     * @param {Event} evt The event that fired.
     * @private
     */
    _handleItemClick: function _handleItemClick(evt) {
        if (evt.target.hasAttribute('disabled')) {
            u.stopEvent(evt);
            // evt.stopPropagation();
        } else {
                // Wait some time before closing menu, so the user can see the ripple.
                this._closing = true;
                window.setTimeout(function (evt) {
                    this.hide();
                    this._closing = false;
                }.bind(this), 150);
            }
    },
    /**
     * Calculates the initial clip (for opening the menu) or final clip (for closing
     * it), and applies it. This allows us to animate from or to the correct point,
     * that is, the point it's aligned to in the "for" element.
     *
     * @param {number} height Height of the clip rectangle
     * @param {number} width Width of the clip rectangle
     * @private
     */
    _applyClip: function _applyClip(height, width) {
        if (u.hasClass(this.element, 'u-menu-unaligned')) {
            // Do not clip.
            this.element.style.clip = '';
        } else if (u.hasClass(this.element, 'u-menu-bottom-right')) {
            // Clip to the top right corner of the menu.
            this.element.style.clip = 'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
        } else if (u.hasClass(this.element, 'u-menu-top-left')) {
            // Clip to the bottom left corner of the menu.
            this.element.style.clip = 'rect(' + height + 'px 0 ' + height + 'px 0)';
        } else if (u.hasClass(this.element, 'u-menu-top-right')) {
            // Clip to the bottom right corner of the menu.
            this.element.style.clip = 'rect(' + height + 'px ' + width + 'px ' + height + 'px ' + width + 'px)';
        } else {
            // Default: do not clip (same as clipping to the top left corner).
            this.element.style.clip = 'rect(' + 0 + 'px ' + 0 + 'px ' + 0 + 'px ' + 0 + 'px)';
        }
    },
    /**
     * Adds an event listener to clean up after the animation ends.
     *
     * @private
     */
    _addAnimationEndListener: function _addAnimationEndListener() {
        var cleanup = function () {
            u.off(this.element, 'transitionend', cleanup);
            // this.element.removeEventListener('transitionend', cleanup);
            u.off(this.element, 'webkitTransitionEnd', cleanup);
            // this.element.removeEventListener('webkitTransitionEnd', cleanup);
            u.removeClass(this.element, 'is-animating');
        }.bind(this);

        // Remove animation class once the transition is done.
        u.on(this.element, 'transitionend', cleanup);
        // this.element.addEventListener('transitionend', cleanup);
        u.on(this.element, 'webkitTransitionEnd', cleanup);
        // this.element.addEventListener('webkitTransitionEnd', cleanup);
    },
    /**
     * Displays the menu.
     *
     * @public
     */
    show: function show(evt) {
        if (this.element && this._container && this._outline) {
            // Measure the inner element.
            var height = this.element.getBoundingClientRect().height;
            var width = this.element.getBoundingClientRect().width;

            if (!width) {
                var left = this.element.getBoundingClientRect().left;
                var right = this.element.getBoundingClientRect().right;
                width = right - left;
            }

            if (!height) {
                var top = this.element.getBoundingClientRect().top;
                var bottom = this.element.getBoundingClientRect().bottom;
                height = bottom - top;
            }

            // Apply the inner element's size to the container and outline.
            this._container.style.width = width + 'px';
            this._container.style.height = height + 'px';
            this._outline.style.width = width + 'px';
            this._outline.style.height = height + 'px';

            var transitionDuration = 0.24;

            // Calculate transition delays for individual menu items, so that they fade
            // in one at a time.
            var items = this.element.querySelectorAll('.u-menu-item');
            for (var i = 0; i < items.length; i++) {
                var itemDelay = null;
                if (u.hasClass(this.element, 'u-menu-top-left') || u.hasClass(this.element, 'u-menu-top-right')) {
                    itemDelay = (height - items[i].offsetTop - items[i].offsetHeight) / height * transitionDuration + 's';
                } else {
                    itemDelay = items[i].offsetTop / height * transitionDuration + 's';
                }
                items[i].style.transitionDelay = itemDelay;
            }

            // Apply the initial clip to the text before we start animating.
            this._applyClip(height, width);

            // Wait for the next frame, turn on animation, and apply the final clip.
            // Also make it visible. This triggers the transitions.
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(function () {
                    u.addClass(this.element, 'is-animating');
                    this.element.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
                    u.addClass(this._container, 'is-visible');
                }.bind(this));
            } else {
                u.addClass(this.element, 'is-animating');
                this.element.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
                u.addClass(this._container, 'is-visible');
            }

            // Clean up after the animation is complete.
            this._addAnimationEndListener();

            // Add a click listener to the document, to close the menu.
            var firstFlag = true;
            var callback = function (e) {
                if (u.isIE8) {
                    if (firstFlag) {
                        firstFlag = false;
                        return;
                    }
                }
                if (e !== evt && !this._closing && e.target.parentNode !== this.element) {
                    u.off(document, 'click', callback);
                    // document.removeEventListener('click', callback);
                    this.hide();
                }
            }.bind(this);
            u.on(document, 'click', callback);
            // document.addEventListener('click', callback);
        }
    },

    /**
     * Hides the menu.
     *
     * @public
     */
    hide: function hide() {
        if (this.element && this._container && this._outline) {
            var items = this.element.querySelectorAll('.u-menu-item');

            // Remove all transition delays; menu items fade out concurrently.
            for (var i = 0; i < items.length; i++) {
                items[i].style.transitionDelay = null;
            }

            // Measure the inner element.
            var rect = this.element.getBoundingClientRect();
            var height = rect.height;
            var width = rect.width;

            if (!width) {
                var left = rect.left;
                var right = rect.right;
                width = right - left;
            }

            if (!height) {
                var top = rect.top;
                var bottom = rect.bottom;
                height = bottom - top;
            }

            // Turn on animation, and apply the final clip. Also make invisible.
            // This triggers the transitions.
            u.addClass(this.element, 'is-animating');
            this._applyClip(height, width);
            u.removeClass(this._container, 'is-visible');

            // Clean up after the animation is complete.
            this._addAnimationEndListener();
        }
    },
    /**
     * Displays or hides the menu, depending on current state.
     *
     * @public
     */
    toggle: function toggle(evt) {
        if (u.hasClass(this._container, 'is-visible')) {
            this.hide();
        } else {
            this.show(evt);
        }
    }
});

u.compMgr.regComp({
    comp: u.Menu,
    compAsString: 'u.Menu',
    css: 'u-menu'
});
/**
 * Created by dingrf on 2015-11-18.
 */
'use strict';
// u.messageTemplate ='<div class="u-message"><button type="button" class="u-msg-close u-button floating  mini"><span class="">X</span></button>{msg}</div>';

u.messageTemplate = '<div class="u-message"><span class="u-msg-close fa fa-close"></span>{msg}</div>';
// u.nocloseTemplate ='<div class="u-message">{msg}</div>';

u.showMessage = function (options) {
    var msg, position, width, height, showSeconds, msgType, template;
    if (typeof options === 'string') {
        options = { msg: options };
    }
    msg = options['msg'] || "";
    position = options['position'] || "bottom-right"; //center. top-left, top-center, top-right, bottom-left, bottom-center, bottom-right,
    //TODO 后面改规则：没设宽高时，自适应
    width = options['width'] || "300px";
    // height = options['height'] || "100px";
    msgType = options['msgType'] || 'info';
    //默认为当用户输入的时间，当用户输入的时间为false并且msgType=='info'时，默认显示时间为2s
    showSeconds = parseInt(options['showSeconds']) || (msgType == 'info' ? 2 : 0);

    template = options['template'] || u.messageTemplate;

    template = template.replace('{msg}', msg);
    var msgDom = u.makeDOM(template);
    u.addClass(msgDom, 'u-mes' + msgType);
    msgDom.style.width = width;
    // msgDom.style.height = height;
    // msgDom.style.lineHeight = height;
    if (position == 'bottom-right') {
        msgDom.style.bottom = '10px';
    }

    if (position == 'center') {
        msgDom.style.bottom = '50%';
        msgDom.style.transform = 'translateY(50%)';
    }
    var closeBtn = msgDom.querySelector('.u-msg-close');
    //new u.Button({el:closeBtn});
    u.on(closeBtn, 'click', function () {
        u.removeClass(msgDom, "active");
        setTimeout(function () {
            try {
                document.body.removeChild(msgDom);
            } catch (e) {}
        }, 500);
    });
    document.body.appendChild(msgDom);

    if (showSeconds > 0) {
        setTimeout(function () {
            closeBtn.click();
        }, showSeconds * 1000);
    }
    setTimeout(function () {
        u.addClass(msgDom, "active");
    }, showSeconds * 1);
};

u.showMessageDialog = u.showMessage;
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

u.Multilang = u.BaseComponent.extend({
	DEFAULTS: {
		dataSource: {},
		onSelect: function onSelect() {}
	},
	init: function init() {
		var self = this;
		var element = this.element;
		this.options = u.extend({}, this.DEFAULTS, this.options);
		this.multinfo(this.options.multinfo);
		this.addData(this.options.multidata);
	}
});
u.Multilang.fn = u.Multilang.prototype;
u.Multilang.fn.addData = function (val) {
	var target = this.element,
	    tmparray,
	    target_div = target.parentNode;
	if ((typeof val === "undefined" ? "undefined" : _typeof(val)) == "object") {
		tmparray = val;
	} else {
		tmparray = val.split(",");
	}
	target_div.value = tmparray;
	u.each(tmparray, function (i, node) {
		target_div.querySelectorAll(".m_context")[i].innerHTML = node;
	});
};
u.Multilang.fn.multinfo = function (sort) {

	var target = this.element,
	    me = this,
	    tmplabel = "",
	    close_menu = true,
	    tmpfield = "name";
	if (sort.lang_name) {
		tmpfield = sort.lang_name;
	}
	if (u.isArray(sort)) {

		u.wrap(target, "<div class='multilang_body'><input class='lang_value' contenteditable='true'><span class='fa fa-sort-desc lang_icon'><span class='m_icon'></span></span>");
		u.css(target, "display", "none");

		u.each(sort, function (i, node) {
			if (i) {
				tmplabel += "<label attr='" + tmpfield + (i + 1) + "'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>";
			} else {
				tmplabel += "<label attr='" + tmpfield + "'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>";
			}
		});
		var target_div = target.parentNode;

		target_div.insertAdjacentHTML("beforeEnd", "<div class='multilang_menu '>" + tmplabel + "</div>");
		var tmpIconv = target_div.querySelector(".lang_icon"),
		    target_menu = target_div.querySelector(".multilang_menu"),
		    tmpvaluebox = target_div.querySelector(".lang_value");
		u.on(tmpIconv, "click", function () {
			var target_icon = this;
			target_div.querySelector(".lang_value").focus();
			if (u.css(target_menu, "display") == "block") {
				u.css(target_menu, "display", "none");
			} else {
				u.css(target_menu, "display", "block");
			}
		});
		u.on(target_menu, "mouseenter", function () {
			close_menu = false;
		});
		u.on(target_menu, "mouseleave", function () {
			close_menu = true;
		});

		u.on(tmpvaluebox, "blur", function () {
			//this//
			//target_box = me.fixtarget(target_input),
			//target_div = target_input.parents(".multilang_body"),
			target = this;
			tmpkey = target.className.split(" ")[2], tmptext = target.value;

			if (u.hasClass(target, "ready_change")) {
				me.changeData(target_div, tmpkey, tmptext);
			}
			if (close_menu) {
				u.css(target_menu, "display", "none");
			}
		});
		u.on(target_menu, "click", "label", function () {
			var target_label = this,
			    tmpfield = target_label.getAttribute("attr"),
			    tmptext = target_label.querySelector(".m_context").innerHTML,
			    tmpicon = target_label.querySelector(".m_icon").cloneNode(true);

			tmpvaluebox.setAttribute("class", "ready_change lang_value " + tmpfield);
			tmpvaluebox.value = tmptext;
			tmpvaluebox.focus();
			var tmpicom = target_div.querySelector(".lang_icon"),
			    oldicon = target_div.querySelector(".m_icon");
			u.removeClass(tmpicom, "fa-sort-desc");
			tmpicom.replaceChild(tmpicon, oldicon);
		});
	} else {
		console.error('Not object');
	}
};
u.Multilang.fn.changeData = function (target_div, field, text) {
	var tmpdata = target_div.value;
	tmplabel = target_div.querySelector("label[attr='" + field + "']");
	tmpcontext = tmplabel.querySelector(".m_context");
	tmpcontext.innerHTML = text;
	tmpcontext.value = text;
	u.each(target_div.querySelectorAll(".m_context"), function (i, node) {
		tmpdata[i] = node.innerHTML;
	});

	u.trigger(this.element, 'change.u.multilang', { newValue: text, field: field });
};
u.Multilang.fn.getData = function () {
	var target = $(multilang.target).next(".multilang_body")[0],
	    multilang_data = target.value;
	return multilang_data;
};
if (u.compMgr) u.compMgr.regComp({
	comp: u.Multilang,
	compAsString: 'u.Multilang',
	css: 'u-multilang'
});
'use strict';

u.NavMenu = u.BaseComponent.extend({
    _Constant: {},
    _CssClasses: {
        NAV: 'u-navmenu',
        NAV_LINK: 'u-navmenu-link',
        NAV_LINK_CURRENT: 'u-navmenu-link-current',
        NAV_LINK_OPEN: 'u-navmenu-link-open',
        NAV_SUB: 'u-navmenu-sub'
    },
    init: function init() {

        u.on(this.element, 'click', this._navlinkClickHander.bind(this));

        var items = this.element.querySelectorAll('.' + this._CssClasses.NAV_LINK);
        for (var i = 0; i < items.length; i++) {
            new u.Ripple(items[i]);
        }
    },

    _navlinkClickHander: function _navlinkClickHander(e) {
        //var _target = e.currentTarget || e.target || e.srcElement;
        var curlink = this.element.querySelector('.' + this._CssClasses.NAV_LINK_CURRENT);
        curlink && u.removeClass(curlink, this._CssClasses.NAV_LINK_CURRENT);
        // if (curlink && u.isIE8){
        // 	var sub = curlink.parentNode.querySelector('.'+this._CssClasses.NAV_SUB);
        // 	if (sub){
        // 		sub.style.maxHeight = '0';
        // 	}
        // }

        var item = u.closest(e.target, this._CssClasses.NAV_LINK);

        if (item) {
            u.addClass(item, this._CssClasses.NAV_LINK_CURRENT);
            var sub = item.parentNode.querySelector('.' + this._CssClasses.NAV_SUB),
                open = u.hasClass(item, this._CssClasses.NAV_LINK_OPEN);
            if (sub && open) {
                u.removeClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8) sub.style.maxHeight = 0;
            }
            if (sub && !open) {
                u.addClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8) sub.style.maxHeight = '999px';
            }
            // sub && open && u.removeClass(item, this._CssClasses.NAV_LINK_OPEN);
            // sub && !open && u.addClass(item, this._CssClasses.NAV_LINK_OPEN);
        }
    }
});

u.compMgr.regComp({
    comp: u.NavMenu,
    compAsString: 'u.NavMenu',
    css: 'u-navmenu'
});
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

u.pagination = u.BaseComponent.extend({});

var PageProxy = function PageProxy(options, page) {
	this.isCurrent = function () {
		return page == options.currentPage;
	};

	this.isFirst = function () {
		return page == 1;
	};

	this.isLast = function () {
		return page == options.totalPages;
	};

	this.isPrev = function () {
		return page == options.currentPage - 1;
	};

	this.isNext = function () {
		return page == options.currentPage + 1;
	};

	this.isLeftOuter = function () {
		return page <= options.outerWindow;
	};

	this.isRightOuter = function () {
		return options.totalPages - page < options.outerWindow;
	};

	this.isInsideWindow = function () {
		if (options.currentPage < options.innerWindow + 1) {
			return page <= options.innerWindow * 2 + 1;
		} else if (options.currentPage > options.totalPages - options.innerWindow) {
			return options.totalPages - page <= options.innerWindow * 2;
		} else {
			return Math.abs(options.currentPage - page) <= options.innerWindow;
		}
	};

	this.number = function () {
		return page;
	};
	this.pageSize = function () {
		return options.pageSize;
	};
};

var View = {
	firstPage: function firstPage(pagin, options, currentPageProxy) {
		return '<li role="first"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a >' + options.first + '</a></li>';
	},

	prevPage: function prevPage(pagin, options, currentPageProxy) {
		return '<li role="prev"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a  rel="prev">' + options.prev + '</a></li>';
	},

	nextPage: function nextPage(pagin, options, currentPageProxy) {
		return '<li role="next"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a  rel="next">' + options.next + '</a></li>';
	},

	lastPage: function lastPage(pagin, options, currentPageProxy) {

		return '<li role="last"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a >' + options.last + '</a></li>';
	},

	gap: function gap(pagin, options) {
		return '<li role="gap" class="disabled"><a href="#">' + options.gap + '</a></li>';
	},

	page: function page(pagin, options, pageProxy) {
		return '<li role="page"' + (pageProxy.isCurrent() ? 'class="active"' : '') + '><a ' + (pageProxy.isNext() ? ' rel="next"' : '') + (pageProxy.isPrev() ? 'rel="prev"' : '') + '>' + pageProxy.number() + '</a></li>';
	}

};

//u.pagination.prototype.compType = 'u.pagination';
u.pagination.prototype.init = function (element, options) {
	var self = this;
	var element = this.element;
	this.$element = element;
	this.options = u.extend({}, this.DEFAULTS, this.options);
	this.$ul = this.$element; //.find("ul");
	this.render();
};

u.pagination.prototype.DEFAULTS = {
	currentPage: 1,
	totalPages: 1,
	pageSize: 10,
	pageList: [10, 20, 50, 100],
	innerWindow: 2,
	outerWindow: 0,
	first: '&laquo;',
	prev: '<i class="fa fa-chevron-left"></i>',
	next: '<i class="fa fa-chevron-right"></i>',
	last: '&raquo;',
	gap: '···',
	//totalText: '合计:',
	totalText: '共',
	truncate: false,
	page: function page(_page) {
		return true;
	}
};

u.pagination.prototype.update = function (options) {
	this.$ul.innerHTML = "";
	this.options = u.extend({}, this.options, options);
	this.render();
};
u.pagination.prototype.render = function () {
	var a = new Date().valueOf();

	var options = this.options;

	if (!options.totalPages) {
		this.$element.style.display = "none";
		return;
	} else {
		this.$element.style.display = "block";
	}

	var htmlArr = [];
	var currentPageProxy = new PageProxy(options, options.currentPage);

	//update pagination by pengyic@yonyou.com
	//预设显示页码数
	var windows = 2;
	var total = options.totalPages - 0;
	var current = options.currentPage - 0;
	//预设显示页码数截断修正
	var fix = 0;
	var pageProxy;
	if (current - 2 <= windows) {
		for (var i = 1; i <= current; i++) {
			pageProxy = new PageProxy(options, i);
			htmlArr.push(View.page(this, options, pageProxy));
		}

		fix = windows - (current - 1) < 0 ? 0 : windows - (current - 1);

		if (total - current - fix <= windows + 1) {
			for (var i = current + 1; i <= total; i++) {
				pageProxy = new PageProxy(options, i);
				htmlArr.push(View.page(this, options, pageProxy));
			}
		} else {
			for (var i = current + 1; i <= current + windows + fix; i++) {
				pageProxy = new PageProxy(options, i);
				htmlArr.push(View.page(this, options, pageProxy));
			}
			//添加分割'...'
			htmlArr.push(View.gap(this, options));

			pageProxy = new PageProxy(options, total);
			htmlArr.push(View.page(this, options, pageProxy));
		}
	} else {
		if (total - current <= windows + 1) {
			fix = windows - (total - current) < 0 ? 0 : windows - (total - current);

			for (var i = current - windows - fix; i <= total; i++) {
				pageProxy = new PageProxy(options, i);
				htmlArr.push(View.page(this, options, pageProxy));
			}
			if (i >= 2) {
				//添加分割'...'
				htmlArr.unshift(View.gap(this, options));
				pageProxy = new PageProxy(options, 1);
				htmlArr.unshift(View.page(this, options, pageProxy));
			}
		} else {
			for (var i = current - windows; i <= current + windows; i++) {
				pageProxy = new PageProxy(options, i);
				htmlArr.push(View.page(this, options, pageProxy));
			}
			//添加分割'...'
			htmlArr.push(View.gap(this, options));

			pageProxy = new PageProxy(options, total);
			htmlArr.push(View.page(this, options, pageProxy));

			//添加分割'...'
			htmlArr.unshift(View.gap(this, options));
			pageProxy = new PageProxy(options, 1);
			htmlArr.unshift(View.page(this, options, pageProxy));
		}
	}
	htmlArr.unshift(View.prevPage(this, options, currentPageProxy));
	htmlArr.push(View.nextPage(this, options, currentPageProxy));
	/*
 if (!currentPageProxy.isFirst() || !options.truncate) {
 			if (options.first) {
 		htmlArr.push(View.firstPage(this, options, currentPageProxy))
 	}
 	if (options.prev) {
 		htmlArr.push(View.prevPage(this, options, currentPageProxy));
 	}
 }
 
 var wasTruncated = false;
 		for (var i = 1, length = options.totalPages; i <= length; i++) {
 	var pageProxy = new PageProxy(options, i);
 	if (pageProxy.isLeftOuter() || pageProxy.isRightOuter() || pageProxy.isInsideWindow()) {
 		htmlArr.push(View.page(this, options, pageProxy));
 		wasTruncated = false;
 	} else {
 		if (!wasTruncated && options.outerWindow > 0) {
 			htmlArr.push(View.gap(this, options));
 			wasTruncated = true;
 		}
 	}
 }
 		if (!currentPageProxy.isLast() || !options.truncate) {
 	if (options.next) {
 		htmlArr.push(View.nextPage(this, options, currentPageProxy));
 	}
 			if (options.last) {
 		htmlArr.push(View.lastPage(this, options, currentPageProxy));
 	}
 }
 */
	if (options.totalCount === undefined || options.totalCount <= 0) {
		options.totalCount = 0;
	}

	var htmlStr = '<div class="pagination-state">' + options.totalText + '&nbsp;' + options.totalCount + '&nbsp;条</div>';
	htmlArr.push(htmlStr);

	if (options.jumppage || options.pageSize) {

		var pageOption = '';
		options.pageList.forEach(function (item) {
			if (options.pageSize - 0 == item) {
				pageOption += '<option selected>' + item + '</option>';
			} else {
				pageOption += '<option>' + item + '</option>';
			}
		});
		var jumppagehtml = '到<input class="page_j" value=' + options.currentPage + '>页<input class="pagination-jump" type="button" value="确定"/>';
		var sizehtml = '显示<select  class="page_z">' + pageOption + '</select>条&nbsp;&nbsp;';
		var tmpjump = "<div class='pagination-state'>" + (options.pageSize ? sizehtml : "") + (options.jumppage ? jumppagehtml : "") + "</div>";
		htmlArr.push(tmpjump);
		//<i class='jump_page fa fa-arrow-circle-right' style='margin-left: 8px; cursor: pointer;'></i>
	}

	this.$ul.insertAdjacentHTML('beforeEnd', htmlArr.join(''));

	var me = this;
	u.on(this.$ul.querySelector(".pagination-jump"), "click", function () {
		var jp, pz;
		jp = me.$ul.querySelector(".page_j").value || options.currentPage;
		pz = me.$ul.querySelector(".page_z").value || options.pageSize;

		//if (pz != options.pageSize){
		//	me.$element.trigger('sizeChange', [pz, jp - 1])
		//}else{
		//	me.$element.trigger('pageChange', jp - 1)
		//}
		me.page(jp, options.totalPages, pz);
		//me.$element.trigger('pageChange', jp - 1)
		//me.$element.trigger('sizeChange', pz)
		return false;
	});

	u.on(this.$ul.querySelector('[role="first"] a'), 'click', function () {
		if (options.currentPage <= 1) return;
		me.firstPage();
		//me.$element.trigger('pageChange', 0)
		return false;
	});
	u.on(this.$ul.querySelector('[role="prev"] a'), 'click', function () {
		if (options.currentPage <= 1) return;
		me.prevPage();
		//me.$element.trigger('pageChange', options.currentPage - 1)
		return false;
	});
	u.on(this.$ul.querySelector('[role="next"] a'), 'click', function () {
		if (parseInt(options.currentPage) + 1 > options.totalPages) return;
		me.nextPage();
		//me.$element.trigger('pageChange', parseInt(options.currentPage) + 1)
		return false;
	});
	u.on(this.$ul.querySelector('[role="last"] a'), 'click', function () {
		if (options.currentPage == options.totalPages) return;
		me.lastPage();
		//me.$element.trigger('pageChange', options.totalPages - 1)
		return false;
	});
	u.each(this.$ul.querySelectorAll('[role="page"] a'), function (i, node) {
		u.on(node, 'click', function () {
			var pz = me.$element.querySelector(".page_z").value || options.pageSize;
			me.page(parseInt(this.innerHTML), options.totalPages, pz);
			//me.$element.trigger('pageChange', parseInt($(this).html()) - 1)

			return false;
		});
	});
	u.on(this.$ul.querySelector('.page_z'), 'change', function () {
		var pz = me.$element.querySelector(".page_z").value || options.pageSize;
		me.trigger('sizeChange', pz);
	});
};

u.pagination.prototype.page = function (pageIndex, totalPages, pageSize) {

	var options = this.options;

	if (totalPages === undefined) {
		totalPages = options.totalPages;
	}
	if (pageSize === undefined) {
		pageSize = options.pageSize;
	}
	var oldPageSize = options.pageSize;
	// if (pageIndex > 0 && pageIndex <= totalPages) {
	// 	if (options.page(pageIndex)) {

	// 		this.$ul.innerHTML="";
	// 		options.pageSize = pageSize;
	// 		options.currentPage = pageIndex;
	// 		options.totalPages = totalPages;
	// 		this.render();

	// 	}
	// }else{
	// 	return false;
	// }

	if (options.page(pageIndex)) {
		if (pageIndex < 0) {
			pageIndex = 0;
		}

		if (pageIndex > totalPages) {
			pageIndex = totalPages;
		}
		this.$ul.innerHTML = "";
		options.pageSize = pageSize;
		options.currentPage = pageIndex;
		options.totalPages = totalPages;
		this.render();
	}
	if (pageSize != oldPageSize) {
		this.trigger('sizeChange', [pageSize, pageIndex - 1]);
	} else {
		this.trigger('pageChange', pageIndex - 1);
	}

	//this.$element.trigger('pageChange', pageIndex)

	return false;
};

u.pagination.prototype.firstPage = function () {
	return this.page(1);
};

u.pagination.prototype.lastPage = function () {
	return this.page(this.options.totalPages);
};

u.pagination.prototype.nextPage = function () {
	return this.page(parseInt(this.options.currentPage) + 1);
};

u.pagination.prototype.prevPage = function () {
	return this.page(this.options.currentPage - 1);
};

u.pagination.prototype.disableChangeSize = function () {
	this.$element.querySelector('.page_z').setAttribute('readonly', true);
};

u.pagination.prototype.enableChangeSize = function () {
	this.$element.querySelector('.page_z').removeAttribute('readonly');
};

function Plugin(option) {
	return this.each(function () {
		var $this = $(this);
		var data = $this.data('u.pagination');
		var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

		if (!data) $this.data('u.pagination', data = new Pagination(this, options));else data.update(options);
	});
}

// var old = $.fn.pagination;

// $.fn.pagination = Plugin
// $.fn.pagination.Constructor = Pagination

if (u.compMgr) u.compMgr.regComp({
	comp: u.pagination,
	compAsString: 'u.pagination',
	css: 'u-pagination'
});
'use strict';

u.Progress = u.BaseComponent.extend({
	_Constant: {},
	_CssClasses: {
		INDETERMINATE_CLASS: 'u-progress__indeterminate'
	},
	setProgress: function setProgress(p) {

		if (u.hasClass(this.element, this._CssClasses.INDETERMINATE_CLASS)) {
			return;
		}

		this.progressbar_.style.width = p + '%';
		return this;
	},
	setBuffer: function setBuffer(p) {
		this.bufferbar_.style.width = p + '%';
		this.auxbar_.style.width = 100 - p + '%';
		return this;
	},

	init: function init() {
		var el = document.createElement('div');
		el.className = 'progressbar bar bar1';
		this.element.appendChild(el);
		this.progressbar_ = el;

		el = document.createElement('div');
		el.className = 'bufferbar bar bar2';
		this.element.appendChild(el);
		this.bufferbar_ = el;

		el = document.createElement('div');
		el.className = 'auxbar bar bar3';
		this.element.appendChild(el);
		this.auxbar_ = el;

		this.progressbar_.style.width = '0%';
		this.bufferbar_.style.width = '100%';
		this.auxbar_.style.width = '0%';

		u.addClass(this.element, 'is-upgraded');

		if (u.isIE8 || u.isIE9) {

			if (u.hasClass(this.element, this._CssClasses.INDETERMINATE_CLASS)) {
				var p = 0;
				var oThis = this;
				setInterval(function () {
					p += 5;
					p = p % 100;
					oThis.progressbar_.style.width = p + '%';
				}, 100);
			}
		}
	}

});

u.compMgr.regComp({
	comp: u.Progress,
	compAsString: 'u.Progress',
	css: 'u-progress'
});
'use strict';

u.Radio = u.BaseComponent.extend({
    Constant_: {
        TINY_TIMEOUT: 0.001
    },

    _CssClasses: {
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked',
        IS_UPGRADED: 'is-upgraded',
        JS_RADIO: 'u-radio',
        RADIO_BTN: 'u-radio-button',
        RADIO_OUTER_CIRCLE: 'u-radio-outer-circle',
        RADIO_INNER_CIRCLE: 'u-radio-inner-circle'
    },

    init: function init() {
        this._btnElement = this.element.querySelector('input');

        this._boundChangeHandler = this._onChange.bind(this);
        this._boundFocusHandler = this._onChange.bind(this);
        this._boundBlurHandler = this._onBlur.bind(this);
        this._boundMouseUpHandler = this._onMouseup.bind(this);

        var outerCircle = document.createElement('span');
        u.addClass(outerCircle, this._CssClasses.RADIO_OUTER_CIRCLE);

        var innerCircle = document.createElement('span');
        u.addClass(innerCircle, this._CssClasses.RADIO_INNER_CIRCLE);

        this.element.appendChild(outerCircle);
        this.element.appendChild(innerCircle);

        var rippleContainer;
        //if (this.element.classList.contains( this._CssClasses.RIPPLE_EFFECT)) {
        //  u.addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
        rippleContainer = document.createElement('span');
        //rippleContainer.classList.add(this._CssClasses.RIPPLE_CONTAINER);
        //rippleContainer.classList.add(this._CssClasses.RIPPLE_EFFECT);
        //rippleContainer.classList.add(this._CssClasses.RIPPLE_CENTER);
        rippleContainer.addEventListener('mouseup', this._boundMouseUpHandler);

        //var ripple = document.createElement('span');
        //ripple.classList.add(this._CssClasses.RIPPLE);

        //rippleContainer.appendChild(ripple);
        this.element.appendChild(rippleContainer);
        new URipple(rippleContainer);
        //}

        this._btnElement.addEventListener('change', this._boundChangeHandler);
        this._btnElement.addEventListener('focus', this._boundFocusHandler);
        this._btnElement.addEventListener('blur', this._boundBlurHandler);
        this.element.addEventListener('mouseup', this._boundMouseUpHandler);

        this._updateClasses();
        u.addClass(this.element, this._CssClasses.IS_UPGRADED);
    },

    _onChange: function _onChange(event) {
        // Since other radio buttons don't get change events, we need to look for
        // them to update their classes.
        var radios = document.querySelectorAll('.' + this._CssClasses.JS_RADIO);
        for (var i = 0; i < radios.length; i++) {
            var button = radios[i].querySelector('.' + this._CssClasses.RADIO_BTN);
            // Different name == different group, so no point updating those.
            if (button.getAttribute('name') === this._btnElement.getAttribute('name')) {
                if (radios[i]['u.Radio']) {
                    radios[i]['u.Radio']._updateClasses();
                }
            }
        }
        this.trigger('change', { isChecked: this._btnElement.checked });
    },

    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onFocus: function _onFocus(event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onBlur: function _onBlur(event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    /**
     * Handle mouseup.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onMouseup: function _onMouseup(event) {
        this._blur();
    },

    /**
     * Update classes.
     *
     * @private
     */
    _updateClasses: function _updateClasses() {
        this.checkDisabled();
        this.checkToggleState();
    },

    /**
     * Add blur.
     *
     * @private
     */
    _blur: function _blur() {

        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._btnElement.blur();
        }.bind(this), /** @type {number} */this.Constant_.TINY_TIMEOUT);
    },

    // Public methods.

    /**
     * Check the components disabled state.
     *
     * @public
     */
    checkDisabled: function checkDisabled() {
        if (this._btnElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },

    /**
     * Check the components toggled state.
     *
     * @public
     */
    checkToggleState: function checkToggleState() {
        if (this._btnElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED);
        }
    },

    /**
     * Disable radio.
     *
     * @public
     */
    disable: function disable() {
        this._btnElement.disabled = true;
        this._updateClasses();
    },

    /**
     * Enable radio.
     *
     * @public
     */
    enable: function enable() {
        this._btnElement.disabled = false;
        this._updateClasses();
    },

    /**
     * Check radio.
     *
     * @public
     */
    check: function check() {
        this._btnElement.checked = true;
        this._updateClasses();
    },

    uncheck: function uncheck() {
        this._btnElement.checked = false;
        this._updateClasses();
    }

});

u.compMgr.regComp({
    comp: u.Radio,
    compAsString: 'u.Radio',
    css: 'u-radio'
});
'use strict';

/* ========================================================================
 * UUI: refer.js v 1.0.0
 *
 * ========================================================================
 * Copyright 2015 yonyou, Inc.
 *
 * ======================================================================== */

/**
 * u.refer({
* contentId: 'mycontent' //内容区id，如果不提供，创建弹出框口div，以弹出方式打开参照
* pageUrl:'xxxx' //自定义参照需要设置此属性
* dataUrl:'yyyyy' //标准参照需要设置此属性
* isPOPMode: false,
* module:  {template:'<div></div>', init：function(){}}    //js模块
* params{}
* onOk: function(data){
*
* },
* onCancel: function(){
*
* }
* })
 */

var Refer = function Refer(options) {
    var contentId = options['contentId'];
    if (u.isEmptyObject(contentId)) throw new Error('contentId is null');
    this.options = u.extend({}, Refer.DEFAULTS, options);
    this.params = this.options['params'];
    this.create();
    this.loaded = false;
};

Refer.DEFAULTS = {
    isPOPMode: false,
    searchInput: null,
    contentId: null,
    okId: 'okBtn',
    cancelId: 'cancelBtn',
    width: null,
    height: null,
    title: '参照',
    setVal: function setVal() {},
    onOk: function onOk() {},
    onCancel: function onCancel() {}
};

Refer.fn = Refer.prototype;

Refer.fn.create = function () {
    var self = this;
    self.setVal = this.options.setVal;
    self.searchInput = this.options.searchInput;

    var prefixID = this.options.contentId.replace(/[^\w\s]/gi, '\\$&');
    if (!this.options.isPOPMode) {
        //TODO 后续支持非弹窗模式

        //if ($('#' + this.options.contentId).length === 0) {
        //    $('body').append($('<div>').attr('id', this.options.contentId));
        //}
        //this.$contentEle = $('#' + prefixID)
        //this.$okBtn = $('#' + prefixID + this.options.okId)
        //this.$cancelBtn = $('#' + prefixID + this.options.cancelId)
    } else {
            var dialog = document.querySelector('#' + prefixID);
            self.isDefaultDialog = true;
            if (dialog == null) {
                //var d = document.createElement('DIV')
                //d.innerHTML = '<div class="modal" id="' + prefixID + '"><div class="modal-dialog"><div class="modal-content">' + '<div class="modal-header"><h4 class="modal-title">Modal title</h4></div>' + '<div class="modal-body"></div><div class="modal-footer">' + '<button   type="button" class="btn btn-primary okBtn">确定</button>' + '<button  type="button" class="btn btn-default cancelBtn" data-dismiss="modal">取消</button></div></div></div></div>'
                dialog = u.makeDOM('	<div style="display:none;height:100%" id="' + prefixID + '">' + '<div class="u-msg-title"><h4 class="title">单据名称</h4></div>' + '<div class="u-msg-content">' + '<div class="content"></div>' + '</div>' + '<div class="u-msg-footer">' + '<button class="u-msg-ok u-button">保存<span class="u-button-container"><span class="u-ripple"></span></span></button>' + '<button class="u-msg-cancel u-button">取消<span class="u-button-container"><span class="u-ripple"></span></span></button>' + '</div>' + '</div>');
                document.body.appendChild(dialog);
                //dialog = document.body.querySelector('#' + prefixID);
            }
            //this.$contentEle = dialog.find('.modal-body');
            this.titleDiv = dialog.querySelector('.title');
            this.contentDiv = dialog.querySelector('.content');
            this.okBtn = dialog.querySelector('.u-msg-ok');
            this.cancelBtn = dialog.querySelector('.u-msg-cancel');
            this.dialog = dialog;
            //if (this.options.width)
            //    dialog.find('.modal-content').css('width', this.options.width)
            //if (this.options.height)
            //    this.$contentEle.css('height', this.options.height)
            //this.dialog.find('.modal-title').html(this.options.title)
            this.titleDiv.innerHTML = this.options.title;
        }
    u.on(this.okBtn, 'click', function () {
        self.submit();
    });

    u.on(this.cancelBtn, 'click', function () {
        self.cancel();
    });
};

Refer.fn.submit = function () {
    var data = this.submitData();
    this.options.onOk(data);
    Plugin.destroy(this);
};

Refer.fn.cancel = function () {
    this.options.onCancel();
    Plugin.destroy(this);
};

Refer.fn.open = function () {
    var self = this;
    if (self.isDefaultDialog) {
        var opt = { id: this.options.contentId, content: '#' + this.options.contentId, hasCloseMenu: true };
        if (this.options.height) opt.height = this.options.height;
        if (this.options.width) opt.width = this.options.width;
        self.modalDialog = u.dialog(opt);
        //self.dialog.modal('show')
    }
    if (this.options['module']) {
        self.contentDiv.innerHTML = this.options['module'].template;
        this.options['module'].init(self);
    }
    //else if(require && require.amd){
    //    require([this.options.pageUrl], function(module) {
    //        self.contentDiv.innerHTML =  module.template;
    //        module.init(self);
    //        self.loaded = true;
    //    })
    //}
};

/**
 * 参照页面中需注册此方法
 */
Refer.fn.registerSubmitFunc = function (func) {
    this.submitData = func;
};

Refer.fn.submitData = function () {};

var Plugin = function Plugin(options) {
    var r = new Refer(options);

    Plugin.addRefer(r);
    r.open();
    return r;
};

Refer.fn.destroy = function () {
    if (this.dialog) {
        if (this.isDefaultDialog) {
            //this.dialog.modal('hide');
            //	            this.dialog.modal('removeBackdrop');
            this.modalDialog.close();
        }
        //this.dialog.parent().remove();
        this.dialog.parentElement.removeChild(this.dialog);
    }
    delete this.options;
};

/**
 * 参照实列
 */
Plugin.instances = {};

Plugin.openRefer = function (options) {
    var r = new Refer(options);
    Plugin.addRefer(r);
    r.open();
};

Plugin.getRefer = function (id) {
    return Plugin.instances[id];
};

Plugin.addRefer = function (refer) {
    Plugin.instances[refer.options.id] = refer;
};

Plugin.destroy = function (refer) {
    var r = Plugin.instances[refer.options.id];
    delete Plugin.instances[refer.options.id];
    r.destroy();
};

u.refer = Plugin;
'use strict';

u.Switch = u.BaseComponent.extend({
    _Constant: {
        TINY_TIMEOUT: 0.001
    },

    _CssClasses: {
        INPUT: 'u-switch-input',
        TRACK: 'u-switch-track',
        THUMB: 'u-switch-thumb',
        FOCUS_HELPER: 'u-switch-focus-helper',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_CHECKED: 'is-checked'
    },

    init: function init() {
        this._inputElement = this.element.querySelector('.' + this._CssClasses.INPUT);

        var track = document.createElement('div');
        u.addClass(track, this._CssClasses.TRACK);

        var thumb = document.createElement('div');
        u.addClass(thumb, this._CssClasses.THUMB);

        var focusHelper = document.createElement('span');
        u.addClass(focusHelper, this._CssClasses.FOCUS_HELPER);

        thumb.appendChild(focusHelper);

        this.element.appendChild(track);
        this.element.appendChild(thumb);

        this.boundMouseUpHandler = this._onMouseUp.bind(this);

        //if (this.element.classList.contains(this._CssClasses.RIPPLE_EFFECT)) {
        //  u.addClass(this.element,this._CssClasses.RIPPLE_IGNORE_EVENTS);
        this._rippleContainerElement = document.createElement('span');
        //this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_CONTAINER);
        //this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_EFFECT);
        //this._rippleContainerElement.classList.add(this._CssClasses.RIPPLE_CENTER);
        this._rippleContainerElement.addEventListener('mouseup', this.boundMouseUpHandler);

        //var ripple = document.createElement('span');
        //ripple.classList.add(this._CssClasses.RIPPLE);

        //this._rippleContainerElement.appendChild(ripple);
        this.element.appendChild(this._rippleContainerElement);
        new URipple(this._rippleContainerElement);
        //}

        this.boundChangeHandler = this._onChange.bind(this);
        this.boundFocusHandler = this._onFocus.bind(this);
        this.boundBlurHandler = this._onBlur.bind(this);

        this._inputElement.addEventListener('change', this.boundChangeHandler);
        this._inputElement.addEventListener('focus', this.boundFocusHandler);
        this._inputElement.addEventListener('blur', this.boundBlurHandler);
        this.element.addEventListener('mouseup', this.boundMouseUpHandler);

        this._updateClasses();
        u.addClass(this.element, 'is-upgraded');
    },

    _onChange: function _onChange(event) {
        this._updateClasses();
        this.trigger('change', { isChecked: this._inputElement.checked });
    },

    _onFocus: function _onFocus(event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onBlur: function _onBlur(event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onMouseUp: function _onMouseUp(event) {
        this._blur();
    },

    _updateClasses: function _updateClasses() {
        this.checkDisabled();
        this.checkToggleState();
    },

    _blur: function _blur() {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._inputElement.blur();
        }.bind(this), /** @type {number} */this._Constant.TINY_TIMEOUT);
    },

    // Public methods.

    checkDisabled: function checkDisabled() {
        if (this._inputElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },

    checkToggleState: function checkToggleState() {
        if (this._inputElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED);
        }
    },

    isChecked: function isChecked() {
        //return u.hasClass(this.element,this._CssClasses.IS_CHECKED);
        return this._inputElement.checked;
    },

    toggle: function toggle() {
        //return;
        if (this.isChecked()) {
            this.uncheck();
        } else {
            this.check();
        }
    },

    disable: function disable() {
        this._inputElement.disabled = true;
        this._updateClasses();
    },

    enable: function enable() {
        this._inputElement.disabled = false;
        this._updateClasses();
    },

    check: function check() {
        this._inputElement.checked = true;
        this._updateClasses();
    },

    uncheck: function uncheck() {
        this._inputElement.checked = false;
        this._updateClasses();
    }

});

u.compMgr.regComp({
    comp: u.Switch,
    compAsString: 'u.Switch',
    css: 'u-switch'
});
'use strict';

u.Table = u.BaseComponent.extend({
    _CssClasses: {

        SELECTABLE: 'selectable',
        SELECT_ELEMENT: 'u-table-select',
        IS_SELECTED: 'is-selected',
        IS_UPGRADED: 'is-upgraded'
    },

    init: function init() {
        var self = this;
        this.element_ = this.element;
        if (this.element_) {
            var firstHeader = this.element_.querySelector('th');
            var bodyRows = Array.prototype.slice.call(this.element_.querySelectorAll('tbody tr'));
            var footRows = Array.prototype.slice.call(this.element_.querySelectorAll('tfoot tr'));
            var rows = bodyRows.concat(footRows);

            //if (this.element_.classList.contains(this._CssClasses.SELECTABLE)) {
            //    var th = document.createElement('th');
            //    var headerCheckbox = this._createCheckbox(null, rows);
            //    th.appendChild(headerCheckbox);
            //    firstHeader.parentElement.insertBefore(th, firstHeader);
            //
            //    for (var i = 0; i < rows.length; i++) {
            //        var firstCell = rows[i].querySelector('td');
            //        if (firstCell) {
            //            var td = document.createElement('td');
            //            if (rows[i].parentNode.nodeName.toUpperCase() === 'TBODY') {
            //                var rowCheckbox = this._createCheckbox(rows[i]);
            //                td.appendChild(rowCheckbox);
            //            }
            //            rows[i].insertBefore(td, firstCell);
            //        }
            //    }
            //    this.element_.classList.add(this._CssClasses.IS_UPGRADED);
            //}
        }
    },
    _selectRow: function _selectRow(checkbox, row, opt_rows) {
        if (row) {
            return function () {
                if (checkbox.checked) {
                    row.classList.add(this._CssClasses.IS_SELECTED);
                } else {
                    row.classList.remove(this._CssClasses.IS_SELECTED);
                }
            }.bind(this);
        }

        if (opt_rows) {
            return function () {
                var i;
                var el;
                if (checkbox.checked) {
                    for (i = 0; i < opt_rows.length; i++) {
                        el = opt_rows[i].querySelector('td').querySelector('.u-checkbox');
                        // el['MaterialCheckbox'].check();
                        opt_rows[i].classList.add(this._CssClasses.IS_SELECTED);
                    }
                } else {
                    for (i = 0; i < opt_rows.length; i++) {
                        el = opt_rows[i].querySelector('td').querySelector('.u-checkbox');
                        //el['MaterialCheckbox'].uncheck();
                        opt_rows[i].classList.remove(this._CssClasses.IS_SELECTED);
                    }
                }
            }.bind(this);
        }
    },
    _createCheckbox: function _createCheckbox(row, opt_rows) {
        var label = document.createElement('label');
        var labelClasses = ['u-checkbox', this._CssClasses.SELECT_ELEMENT];
        label.className = labelClasses.join(' ');
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('u-checkbox-input');

        if (row) {
            checkbox.checked = row.classList.contains(this._CssClasses.IS_SELECTED);
            checkbox.addEventListener('change', this._selectRow(checkbox, row));
        } else if (opt_rows) {
            checkbox.addEventListener('change', this._selectRow(checkbox, null, opt_rows));
        }

        label.appendChild(checkbox);
        new u.Checkbox(label);
        return label;
    }

});

if (u.compMgr) u.compMgr.regComp({
    comp: u.Table,
    compAsString: 'u.Table',
    css: 'u-table'
});
'use strict';

u.Tabs = u.BaseComponent.extend({
	_Constant: {},
	_CssClasses: {
		TAB_CLASS: 'u-tabs__tab',
		PANEL_CLASS: 'u-tabs__panel',
		ACTIVE_CLASS: 'is-active',
		UPGRADED_CLASS: 'is-upgraded',

		U_JS_RIPPLE_EFFECT: 'u-js-ripple-effect',
		U_RIPPLE_CONTAINER: 'u-tabs__ripple-container',
		U_RIPPLE: 'u-ripple',
		U_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'u-js-ripple-effect--ignore-events'
	},

	/**
  * Handle clicks to a tabs component
  *
  * @private
  */
	initTabs_: function initTabs_() {
		u.addClass(this.element, this._CssClasses.U_JS_RIPPLE_EFFECT_IGNORE_EVENTS);

		// Select element tabs, document panels
		this.tabs_ = this.element.querySelectorAll('.' + this._CssClasses.TAB_CLASS);
		this.panels_ = this.element.querySelectorAll('.' + this._CssClasses.PANEL_CLASS);

		// Create new tabs for each tab element
		for (var i = 0; i < this.tabs_.length; i++) {
			new Tab(this.tabs_[i], this);
		}
		u.addClass(this.element, this._CssClasses.UPGRADED_CLASS);
	},

	/**
  * Reset tab state, dropping active classes
  *
  * @private
  */
	resetTabState_: function resetTabState_() {
		for (var k = 0; k < this.tabs_.length; k++) {
			u.removeClass(this.tabs_[k], this._CssClasses.ACTIVE_CLASS);
		}
	},

	/**
  * Reset panel state, droping active classes
  *
  * @private
  */
	resetPanelState_: function resetPanelState_() {
		for (var j = 0; j < this.panels_.length; j++) {
			u.removeClass(this.panels_[j], this._CssClasses.ACTIVE_CLASS);
		}
	},
	show: function show(itemId) {
		var panel = this.element.querySelector('#' + itemId);
		var tab = this.element.querySelector("[href='#" + itemId + "']");
		this.resetTabState_();
		this.resetPanelState_();
		u.addClass(tab, this._CssClasses.ACTIVE_CLASS);
		u.addClass(panel, this._CssClasses.ACTIVE_CLASS);
	},

	/**
  * Initialize element.
  */
	init: function init() {
		if (this.element) {
			this.initTabs_();
		}
	}
});

/**
 * Constructor for an individual tab.
 *
 * @constructor
 * @param {Element} tab The HTML element for the tab.
 * @param {Tabs} ctx The Tabs object that owns the tab.
 */
function Tab(tab, ctx) {
	if (tab) {
		var rippleContainer = document.createElement('span');
		u.addClass(rippleContainer, ctx._CssClasses.U_RIPPLE_CONTAINER);
		u.addClass(rippleContainer, ctx._CssClasses.U_JS_RIPPLE_EFFECT);
		var ripple = document.createElement('span');
		u.addClass(ripple, ctx._CssClasses.U_RIPPLE);
		rippleContainer.appendChild(ripple);
		tab.appendChild(rippleContainer);

		tab.ripple = new u.Ripple(tab);

		tab.addEventListener('click', function (e) {
			u.stopEvent(e);
			// e.preventDefault();
			var href = tab.href.split('#')[1];
			var panel = ctx.element.querySelector('#' + href);
			ctx.resetTabState_();
			ctx.resetPanelState_();
			u.addClass(tab, ctx._CssClasses.ACTIVE_CLASS);
			u.addClass(panel, ctx._CssClasses.ACTIVE_CLASS);
		});
	}
}

u.compMgr.regComp({
	comp: u.Tabs,
	compAsString: 'u.Tabs',
	css: 'u-tabs'
});
'use strict';

u.Text = u.BaseComponent.extend({
    _Constant: {
        NO_MAX_ROWS: -1,
        MAX_ROWS_ATTRIBUTE: 'maxrows'
    },

    _CssClasses: {
        LABEL: 'u-label',
        INPUT: 'u-input',
        IS_DIRTY: 'is-dirty',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_INVALID: 'is-invalid',
        IS_UPGRADED: 'is-upgraded'
    },

    init: function init() {
        var oThis = this;
        this.maxRows = this._Constant.NO_MAX_ROWS;
        this.label_ = this.element.querySelector('.' + this._CssClasses.LABEL);
        this._input = this.element.querySelector('input');

        if (this._input) {
            if (this._input.hasAttribute(
            /** @type {string} */this._Constant.MAX_ROWS_ATTRIBUTE)) {
                this.maxRows = parseInt(this._input.getAttribute(
                /** @type {string} */this._Constant.MAX_ROWS_ATTRIBUTE), 10);
                if (isNaN(this.maxRows)) {
                    this.maxRows = this._Constant.NO_MAX_ROWS;
                }
            }

            this.boundUpdateClassesHandler = this._updateClasses.bind(this);
            this.boundFocusHandler = this._focus.bind(this);
            this.boundBlurHandler = this._blur.bind(this);
            this.boundResetHandler = this._reset.bind(this);
            this._input.addEventListener('input', this.boundUpdateClassesHandler);
            if (u.isIE8) {
                this._input.addEventListener('propertychange', function () {
                    oThis._updateClasses();
                });
            }
            this._input.addEventListener('focus', this.boundFocusHandler);
            if (u.isIE8 || u.isIE9) {
                if (this.label_) {
                    this.label_.addEventListener('click', function () {
                        this._input.focus();
                    }.bind(this));
                }
            }

            this._input.addEventListener('blur', this.boundBlurHandler);
            this._input.addEventListener('reset', this.boundResetHandler);

            if (this.maxRows !== this._Constant.NO_MAX_ROWS) {
                // TODO: This should handle pasting multi line text.
                // Currently doesn't.
                this.boundKeyDownHandler = this._down.bind(this);
                this._input.addEventListener('keydown', this.boundKeyDownHandler);
            }
            var invalid = u.hasClass(this.element, this._CssClasses.IS_INVALID);
            this._updateClasses();
            u.addClass(this.element, this._CssClasses.IS_UPGRADED);
            if (invalid) {
                u.addClass(this.element, this._CssClasses.IS_INVALID);
            }
        }
    },

    /**
     * Handle input being entered.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _down: function _down(event) {
        var currentRowCount = event.target.value.split('\n').length;
        if (event.keyCode === 13) {
            if (currentRowCount >= this.maxRows) {
                event.preventDefault();
            }
        }
    },
    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _focus: function _focus(event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },
    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _blur: function _blur(event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },
    /**
     * Handle reset event from out side.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _reset: function _reset(event) {
        this._updateClasses();
    },
    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses: function _updateClasses() {
        this.checkDisabled();
        this.checkValidity();
        this.checkDirty();
    },

    // Public methods.

    /**
     * Check the disabled state and update field accordingly.
     *
     * @public
     */
    checkDisabled: function checkDisabled() {
        if (this._input.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },
    /**
     * Check the validity state and update field accordingly.
     *
     * @public
     */
    checkValidity: function checkValidity() {
        if (this._input.validity) {
            if (this._input.validity.valid) {
                u.removeClass(this.element, this._CssClasses.IS_INVALID);
            } else {
                u.addClass(this.element, this._CssClasses.IS_INVALID);
            }
        }
    },
    /**
     * Check the dirty state and update field accordingly.
     *
     * @public
     */
    checkDirty: function checkDirty() {
        if (this._input.value && this._input.value.length > 0) {
            u.addClass(this.element, this._CssClasses.IS_DIRTY);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DIRTY);
        }
    },
    /**
     * Disable text field.
     *
     * @public
     */
    disable: function disable() {
        this._input.disabled = true;
        this._updateClasses();
    },
    /**
     * Enable text field.
     *
     * @public
     */
    enable: function enable() {
        this._input.disabled = false;
        this._updateClasses();
    },
    /**
     * Update text field value.
     *
     * @param {string} value The value to which to set the control (optional).
     * @public
     */
    change: function change(value) {
        this._input.value = value || '';
        this._updateClasses();
    }

});

//if (u.compMgr)
//    u.compMgr.addPlug({
//        name:'text',
//        plug: u.Text
//    })

u.compMgr.regComp({
    comp: u.Text,
    compAsString: 'u.Text',
    css: 'u-text'
});
'use strict';

u.Tooltip = function (element, options) {
    this.init(element, options);
    //this.show()
};

u.Tooltip.prototype = {
    defaults: {
        animation: true,
        placement: 'top',
        //selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow" style="left: 50%;"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    },
    init: function init(element, options) {
        this.element = element;
        this.options = u.extend({}, this.defaults, options);
        this._viewport = this.options.viewport && document.querySelector(this.options.viewport.selector || this.options.viewport);

        var triggers = this.options.trigger.split(' ');

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];
            if (trigger == 'click') {
                u.on(this.element, 'click', this.toggle.bind(this));
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';
                u.on(this.element, eventIn, this.enter.bind(this));
                u.on(this.element, eventOut, this.leave.bind(this));
            }
        }
        this.options.title = this.options.title || this.element.getAttribute('title');
        this.element.removeAttribute('title');
        if (this.options.delay && typeof this.options.delay == 'number') {
            this.options.delay = {
                show: this.options.delay,
                hide: this.options.delay
            };
        };
        //tip模板对应的dom
        this.tipDom = u.makeDOM(this.options.template);
        this.arrrow = this.tipDom.querySelector('.tooltip-arrow');
        // tip容器,默认为当前元素的parent
        this.container = this.options.container ? document.querySelector(this.options.container) : this.element.parentNode;
    },
    enter: function enter() {
        var self = this;
        clearTimeout(this.timeout);
        this.hoverState = 'in';
        if (!this.options.delay || !this.options.delay.show) return this.show();

        this.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show();
        }, this.options.delay.show);
    },
    leave: function leave() {
        var self = this;
        clearTimeout(this.timeout);
        self.hoverState = 'out';
        if (!self.options.delay || !self.options.delay.hide) return self.hide();
        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide();
        }, self.options.delay.hide);
    },
    show: function show() {
        this.tipDom.querySelector('.tooltip-inner').innerHTML = this.options.title;
        this.tipDom.style.zIndex = u.getZIndex();
        this.container.appendChild(this.tipDom);
        /*var placement = this.options.placement;
        var pos = this.getPosition()
        var actualWidth = this.tipDom.offsetWidth
        var actualHeight = this.tipDom.offsetHeight
        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)
          this.applyPlacement(calculatedOffset, placement)*/
        u.addClass(this.tipDom, 'active');
        u.showPanelByEle({
            ele: this.element,
            panel: this.tipDom,
            position: 'topCenter'
        });
    },
    hide: function hide() {
        if (this.container.contains(this.tipDom)) {
            u.removeClass(this.tipDom, 'active');
            this.container.removeChild(this.tipDom);
        }
    },
    applyPlacement: function applyPlacement(offset, placement) {
        var width = this.tipDom.offsetWidth;
        var height = this.tipDom.offsetHeight;

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt(this.tipDom.style.marginTop, 10);
        var marginLeft = parseInt(this.tipDom.style.marginTop, 10);

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        offset.top = offset.top + marginTop;
        offset.left = offset.left + marginLeft;

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        this.tipDom.style.left = offset.left + 'px';
        this.tipDom.style.top = offset.top + 'px';

        u.addClass(this.tipDom, 'active');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = this.tipDom.offsetWidth;
        var actualHeight = this.tipDom.offsetHeight;

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

        if (delta.left) offset.left += delta.left;else offset.top += delta.top;

        var isVertical = /top|bottom/.test(placement);
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

        //$tip.offset(offset)
        this.tipDom.style.left = offset.left + 'px';
        this.tipDom.style.top = offset.top - 4 + 'px';

        // this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    },
    getCalculatedOffset: function getCalculatedOffset(placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } : placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */{
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        };
    },
    getPosition: function getPosition(el) {
        el = el || this.element;
        var isBody = el.tagName == 'BODY';
        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = u.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top });
        }
        var elOffset = isBody ? { top: 0, left: 0 } : { top: el.offsetTop, left: el.offsetLeft };
        var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : el.scrollTop };
        var outerDims = isBody ? { width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight } : null;
        //return u.extend({}, elRect, scroll, outerDims, elOffset)
        return u.extend({}, elRect, scroll, outerDims);
    },
    getViewportAdjustedDelta: function getViewportAdjustedDelta(placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 };
        if (!this._viewport) return delta;

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this._viewport);

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) {
                // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
                // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) {
                // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.width) {
                // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
        }

        return delta;
    },
    replaceArrow: function replaceArrow(delta, dimension, isHorizontal) {
        if (isHorizontal) {
            this.arrow.style.left = 50 * (1 - delta / dimension) + '%';
            this.arrow.style.top = '';
        } else {
            this.arrow.style.top = 50 * (1 - delta / dimension) + '%';
            this.arrow.style.left = '';
        }
    },
    destory: function destory() {},
    setTitle: function setTitle(title) {
        this.options.title = title;
    }

};
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

u.Validate = u.BaseComponent.extend({

	init: function init() {
		var self = this;
		this.$element = this.element;
		this.$form = this.form;
		this.options = u.extend({}, this.DEFAULTS, this.options);
		this.required = false;
		this.timeout = null;
		//所有属性优先级 ：  options参数  > attr属性  > 默认值
		this.required = this.options['required'] ? this.options['required'] : false;
		this.validType = this.options['validType'] ? this.options['validType'] : null;
		//校验模式  blur  submit
		this.validMode = this.options['validMode'] ? this.options['validMode'] : u.Validate.DEFAULTS.validMode;
		//空提示
		this.nullMsg = this.options['nullMsg'] ? this.options['nullMsg'] : u.Validate.NULLMSG[this.validType];
		//是否必填
		if (this.required && !this.nullMsg) this.nullMsg = u.Validate.NULLMSG['required'];
		//错误必填
		this.errorMsg = this.options['errorMsg'] ? this.options['errorMsg'] : u.Validate.ERRORMSG[this.validType];
		//正则校验
		this.regExp = this.options['reg'] ? this.options['reg'] : u.Validate.REG[this.validType];
		try {
			if (typeof this.regExp == 'string') this.regExp = eval(this.regExp);
		} catch (e) {}

		this.notipFlag = this.options['notipFlag']; // 错误信息提示方式是否为tip，默认为true
		this.hasSuccess = this.options['hasSuccess']; //是否含有正确提示

		//提示div的id 为空时使用tooltop来提示
		this.tipId = this.options['tipId'] ? this.options['tipId'] : null;
		//校验成功提示信息的div
		this.successId = this.options['successId'] ? this.options['successId'] : null;

		// 要求显示成功提示，并没有成功提示dom的id时，则创建成功提示dom
		if (this.hasSuccess && !this.successId) {
			this.successId = u.makeDOM('<span class="u-form-control-success fa fa-check-circle" ></span>');

			if (this.$element.nextSibling) {
				this.$element.parentNode.insertBefore(this.successId, this.$element.nextSibling);
			} else {
				this.$element.parentNode.appendChild(this.successId);
			}
		}
		//不是默认的tip提示方式并且tipId没有定义时创建默认tipid	
		if (this.notipFlag && !this.tipId) {
			this.tipId = u.makeDOM('<span class="u-form-control-info fa fa-exclamation-circle "></span>');
			this.$element.parentNode.appendChild(this.tipId);

			if (this.$element.nextSibling) {
				this.$element.parentNode.insertBefore(this.tipId, this.$element.nextSibling);
			} else {
				this.$element.parentNode.appendChild(this.tipId);
			}
		}
		//提示框位置
		this.placement = this.options['placement'] ? this.options['placement'] : u.Validate.DEFAULTS.placement;
		//
		this.minLength = this.options['minLength'] > 0 ? this.options['minLength'] : null;
		this.maxLength = this.options['maxLength'] > 0 ? this.options['maxLength'] : null;
		this.min = this.options['min'] !== undefined ? this.options['min'] : null;
		this.max = this.options['max'] !== undefined ? this.options['max'] : null;
		this.minNotEq = this.options['minNotEq'] !== undefined ? this.options['minNotEq'] : null;
		this.maxNotEq = this.options['maxNotEq'] !== undefined ? this.options['maxNotEq'] : null;
		this.min = u.isNumber(this.min) ? this.min : null;
		this.max = u.isNumber(this.max) ? this.max : null;
		this.minNotEq = u.isNumber(this.minNotEq) ? this.minNotEq : null;
		this.maxNotEq = u.isNumber(this.maxNotEq) ? this.maxNotEq : null;
		this.create();
	}
});

u.Validate.fn = u.Validate.prototype;
//u.Validate.tipTemplate = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow tooltip-arrow-c"></div><div class="tooltip-arrow"></div><div class="tooltip-inner" style="color:#ed7103;border:1px solid #ed7103;background-color:#fff7f0;"></div></div>'

u.Validate.DEFAULTS = {
	validMode: 'blur',
	placement: "top"
};

u.Validate.NULLMSG = {
	"required": trans('validate.required', "不能为空！"),
	"integer": trans('validate.integer', "请填写整数！"),
	"float": trans('validate.float', "请填写数字！"),
	"zipCode": trans('validate.zipCode', "请填写邮政编码！"),
	"phone": trans('validate.phone', "请填写手机号码！"),
	"landline": trans('validate.landline', "请填写座机号码！"),
	"email": trans('validate.email', "请填写邮箱地址！"),
	"url": trans('validate.url', "请填写网址！"),
	"datetime": trans('validate.datetime', "请填写日期！")

};

u.Validate.ERRORMSG = {
	"integer": trans('validate.error_integer', "整数格式不对！"),
	"float": trans('validate.error_float', "数字格式不对！"),
	"zipCode": trans('validate.error_zipCode', "邮政编码格式不对！"),
	"phone": trans('validate.error_phone', "手机号码格式不对！"),
	"landline": trans('validate.error_landline', "座机号码格式不对！"),
	"email": trans('validate.error_email', "邮箱地址格式不对！"),
	"url": trans('validate.error_url', "网址格式不对！"),
	"datetime": trans('validate.error_datetime', "日期格式不对！")
};

u.Validate.REG = {
	"integer": /^-?\d+$/,
	"float": /^-?\d+(\.\d+)?$/,
	"zipCode": /^[0-9]{6}$/,
	"phone": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
	"landline": /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
	"email": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
	"url": /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
	"datetime": /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/
};

u.Validate.fn.create = function () {
	var self = this;
	u.on(this.element, 'blur', function (e) {
		if (self.validMode == 'blur') {
			self.passed = self.doValid();
		}
	});
	u.on(this.element, 'focus', function (e) {
		//隐藏错误信息
		self.hideMsg();
	});
	u.on(this.element, 'change', function (e) {
		//隐藏错误信息
		self.hideMsg();
	});
	u.on(this.element, 'keydown', function (e) {
		var event = window.event || e;
		if (self["validType"] == "float") {
			var tmp = self.element.value;
			if (event.shiftKey) {
				event.returnValue = false;
				return false;
			} else if (event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
				// tab键 左箭头 右箭头 delete键
				return true;
			} else if (event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)) {
				//复制粘贴
				return true;
			} else if (!(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || u.inArray(event.keyCode, [8, 110, 190, 189, 109]) > -1)) {
				event.returnValue = false;
				return false;
			} else if ((!tmp || tmp.indexOf(".") > -1) && (event.keyCode == 190 || event.keyCode == 110)) {
				event.returnValue = false;
				return false;
			}

			if (tmp && (tmp + '').split('.')[0].length >= 25) {
				return false;
			}
		}
		if (self["validType"] == "integer") {
			var tmp = self.element.value;

			if (event.shiftKey) {
				event.returnValue = false;
				return false;
			} else if (event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
				// tab键 左箭头 右箭头 delete键
				return true;
			} else if (event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)) {
				//复制粘贴
				return true;
			} else if (!(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || u.inArray(event.keyCode, [8, 109, 189]) > -1)) {
				event.returnValue = false;
				return false;
			}

			if (tmp && (tmp + '').split('.')[0].length >= 25) {
				return false;
			}
		}
	});
};

u.Validate.fn.updateOptions = function (options) {};

u.Validate.fn.doValid = function (options) {
	var self = this;
	var pValue;
	this.showMsgFlag = true;
	if (options) {
		pValue = options.pValue;
		this.showMsgFlag = options.showMsg;
	}
	this.needClean = false;
	if (this.element && this.element.getAttribute("readonly")) return true;
	var value = null;
	if (typeof pValue != 'undefined') value = pValue;else if (this.element) value = this.element.value;

	if (this.isEmpty(value) && this.required) {
		this.showMsg(this.nullMsg);
		return { passed: false, Msg: this.nullMsg };
	} else if (this.isEmpty(value) && !this.required) {
		return { passed: true };
	}
	if (this.regExp) {
		var reg = new RegExp(this.regExp);
		if (typeof value == 'number') value = value + "";
		var r = value.match(reg);
		if (r === null || r === false) {
			this.showMsg(this.errorMsg);
			this.needClean = true;
			return { passed: false, Msg: this.errorMsg };
		}
	}
	if (this.minLength) {
		if (value.lengthb() < this.minLength) {
			var Msg = "输入长度不能小于" + this.minLength + "位";
			this.showMsg(Msg);
			return { passed: false, Msg: Msg };
		}
	}
	if (this.maxLength) {
		if (value.lengthb() > this.maxLength) {
			var Msg = "输入长度不能大于" + this.maxLength + "位";
			this.showMsg(Msg);
			return { passed: false, Msg: Msg };
		}
	}
	if (this.max != undefined && this.max != null) {
		if (parseFloat(value) > this.max) {
			var Msg = "输入值不能大于" + this.max;
			this.showMsg(Msg);
			return { passed: false, Msg: Msg };
		}
	}
	if (this.min != undefined && this.min != null) {
		if (parseFloat(value) < this.min) {
			var Msg = "输入值不能小于" + this.min;
			this.showMsg(Msg);
			return { passed: false, Msg: Msg };
		}
	}
	if (this.maxNotEq != undefined && this.maxNotEq != null) {
		if (parseFloat(value) >= this.maxNotEq) {
			var Msg = "输入值不能大于或等于" + this.maxNotEq;
			this.showMsg(Msg);
			return { passed: false, Msg: Msg };
		}
	}
	if (this.minNotEq != undefined && this.minNotEq != null) {
		if (parseFloat(value) <= this.minNotEq) {
			var Msg = "输入值不能小于或等于" + this.minNotEq;
			this.showMsg(Msg);
			return { passed: false, Msg: Msg };
		}
	}
	//succes时，将成功信息显示
	if (this.successId) {
		// u.addClass(this.element.parentNode,'u-has-success');
		var successDiv = this.successId;
		var successleft = this.$element.offsetLeft + this.$element.offsetWidth + 5;
		var successtop = this.$element.offsetTop + 10;
		if (typeof successDiv === 'string') successDiv = document.getElementById(successDiv);
		successDiv.style.display = 'inline-block';
		successDiv.style.top = successtop + 'px';
		successDiv.style.left = successleft + 'px';
		clearTimeout(this.timeout);
		this.timeout = setTimeout(function () {
			// self.tooltip.hide();
			successDiv.style.display = 'none';
		}, 3000);
	}
	return { passed: true };
};

u.Validate.fn.check = u.Validate.fn.doValid;

//	Validate.fn.getValue = function() {
//		var inputval
//		if (this.$element.is(":radio")) {
//			inputval = this.$form.find(":radio[name='" + this.$element.attr("name") + "']:checked").val();
//		} else if (this.$element.is(":checkbox")) {
//			inputval = "";
//			this.$form.find(":checkbox[name='" + obj.attr("name") + "']:checked").each(function() {
//				inputval += $(this).val() + ',';
//			})
//		} else if (this.$element.is('div')) {
//			inputval = this.$element[0].trueValue;
//		} else {
//			inputval = this.$element.val();
//		}
//		inputval = $.trim(inputval);
//		return this.isEmpty(inputval) ? "" : inputval;
//	}

u.Validate.fn.some = Array.prototype.some ? Array.prototype.some : function () {
	var flag;
	for (var i = 0; i < this.length; i++) {
		if (typeof arguments[0] == "function") {
			flag = arguments[0](this[i]);
			if (flag) break;
		}
	}
	return flag;
};

u.Validate.fn.getValue = function () {
	var inputval = '';
	//checkbox、radio为u-meta绑定时
	var bool = this.some.call(this.$element.querySelectorAll('[type="checkbox"],[type="radio"]'), function (ele) {
		return ele.type == "checkbox" || ele.type == "radio";
	});
	if (this.$element.childNodes.length > 0 && bool) {
		var eleArr = this.$element.querySelectorAll('[type="checkbox"],[type="radio"]');
		var ele = eleArr[0];
		if (ele.type == "checkbox") {
			this.$element.querySelectorAll(":checkbox[name='" + $(ele).attr("name") + "']:checked").each(function () {
				inputval += $(this).val() + ',';
			});
		} else if (ele.type == "radio") {
			inputval = this.$element.querySelectorAll(":radio[name='" + $(ele).attr("name") + "']:checked").value;
		}
	} else if (this.$element.is(":radio")) {
		//valid-type 绑定
		inputval = this.$element.parent().querySelectorAll(":radio[name='" + this.$element.attr("name") + "']:checked").val();
	} else if (this.$element.is(":checkbox")) {
		inputval = "";
		this.$element.parent().find(":checkbox[name='" + this.$element.attr("name") + "']:checked").each(function () {
			inputval += $(this).val() + ',';
		});
	} else if (this.$element.find('input').length > 0) {
		inputval = this.$element.find('input').val();
	} else {
		inputval = this.$element.val();
	}
	inputval = inputval.trim;
	return this.isEmpty(inputval) ? "" : inputval;
};

u.Validate.fn.isEmpty = function (val) {
	return val === "" || val === undefined || val === null; //|| val === $.trim(this.$element.attr("tip"));
};

u.Validate.fn.showMsg = function (msg) {

	if (this.showMsgFlag == false || this.showMsgFlag == 'false') {
		return;
	}
	var self = this;
	if (this.tipId) {
		this.$element.style.borderColor = 'rgb(241,90,74)';
		var tipdiv = this.tipId;
		var left = this.$element.offsetLeft;
		var top = this.$element.offsetTop + this.$element.offsetHeight + 4;
		if (typeof tipdiv === 'string') {
			tipdiv = document.getElementById(tipdiv);
		}
		tipdiv.innerHTML = msg;
		tipdiv.style.left = left + 'px';
		tipdiv.style.top = top + 'px';
		tipdiv.style.display = 'block';
		// u.addClass(tipdiv.parentNode,'u-has-error');
		// $('#' + this.tipId).html(msg).show()
	} else {
			var tipOptions = {
				"title": msg,
				"trigger": "manual",
				"selector": "validtip",
				"placement": this.placement,
				"container": "body"
			};
			if (this.options.tipTemplate) tipOptions.template = this.options.tipTemplate;
			if (!this.tooltip) this.tooltip = new u.Tooltip(this.element, tipOptions);
			this.tooltip.setTitle(msg);
			this.tooltip.show();
		}
	clearTimeout(this.timeout);
	this.timeout = setTimeout(function () {
		// self.tooltip.hide();
		self.hideMsg();
	}, 3000);
};
u.Validate.fn.hideMsg = function () {
	//隐藏成功信息
	// if(this.successId||this.tipId){
	// 	document.getElementById(this.successId).style.display='none';
	// 	document.getElementById(this.tipId).style.display='none';
	// }

	// u.removeClass(this.element.parentNode,'u-has-error');
	// u.removeClass(this.element.parentNode,'u-has-success');

	if (this.tipId) {
		var tipdiv = this.tipId;
		if (typeof tipdiv === 'string') {
			tipdiv = document.getElementById(tipdiv);
		}
		tipdiv.style.display = 'none';
		this.$element.style.borderColor = '';
		// u.removeClass(tipdiv.parentNode,'u-has-error');
	} else {
			if (this.tooltip) this.tooltip.hide();
		}
};

/**
 * 只有单一元素时使用
 */
u.Validate.fn._needClean = function () {
	return true; //this.validates[0].needClean
};

u.validate = function (element) {
	var self = this,
	    options,
	    childEle;
	if (typeof element === 'string') {
		element = document.querySelector(element);
	}
	//element本身需要校验
	if (element.attributes["validate"]) {
		options = element.attributes["validate"] ? JSON.parse(element.attributes["validate"].value) : {};
		options = u.extend({ el: element }, options);
		element['u.Validate'] = new u.Validate(options);
	}

	//element是个父元素，校验子元素
	childEle = element.querySelectorAll('[validate]');
	u.each(childEle, function (i, child) {
		if (!child['u.Validate']) {
			//如果该元素上没有校验
			options = child.attributes["validate"] ? JSON.parse(child.attributes["validate"].value) : {};
			options = u.extend({ el: child }, options);
			child['u.Validate'] = new u.Validate(options);
		}
	});
};

// 对某个dom容器内的元素进行校验
u.doValidate = function (element) {
	var passed = true,
	    childEle,
	    result;
	if (typeof element === 'string') {
		element = document.querySelector(element);
	}
	childEle = element.querySelectorAll('input');
	u.each(childEle, function (i, child) {
		if (child['u.Validate'] && child['u.Validate'].check) {
			result = child['u.Validate'].check({ trueValue: true, showMsg: true });
			if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') passed = result['passed'] && passed;else passed = result && passed;
		}
	});
	return passed;
};
if (u.compMgr) u.compMgr.regComp({
	comp: u.Validate,
	compAsString: 'u.Validate',
	css: 'u-validate'
});
'use strict';

/**
 * Created by dingrf on 2016/3/4.
 */

/**
 * 加载控件
 */

if (document.readyState && document.readyState === 'complete') {
    u.compMgr.updateComp();
} else {
    u.on(window, 'load', function () {

        //扫描并生成控件
        u.compMgr.updateComp();
    });
}