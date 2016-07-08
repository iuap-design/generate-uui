/** 
 * iuap-design v3.0.6
 * UI Framework Used For Enterprise.
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/iuap-design#readme
 * bugs : https://github.com/iuap-design/iuap-design/issues
 **/ 
/**
 * Created by dingrf on 2015-11-18.
 */


window.u = window.u || {};
var u = window.u;

u.polyfill = true;
u._addClass = function(element,value){
    var classes, cur, clazz, i, finalValue,rclass = /[\t\r\n\f]/g,
        proceed = typeof value === "string" && value,rnotwhite = (/\S+/g);

    if ( proceed ) {
        // The disjunction here is for better compressibility (see removeClass)
        classes = ( value || "" ).match( rnotwhite ) || [];

        cur = element.nodeType === 1 && ( element.className ?
                ( " " + element.className + " " ).replace( rclass, " " ) : " ");
        if ( cur ) {
            i = 0;
            while ( (clazz = classes[i++]) ) {
                if ( cur.indexOf( " " + clazz + " " ) < 0 ) {cur += clazz + " ";}
            }
            // only assign if different to avoid unneeded rendering.
            finalValue = (cur + "").trim();
            if ( element.className !== finalValue ) {
                element.className = finalValue;
            }
        }
    }
    return this;
};

u._removeClass = function(element, value) {
    var classes, cur, clazz, j, finalValue,rnotwhite = (/\S+/g),rclass = /[\t\r\n\f]/g,
        proceed = arguments.length === 0 || typeof value === "string" && value;

    if ( proceed ) {
        classes = ( value || "" ).match( rnotwhite ) || [];

        // This expression is here for better compressibility (see addClass)
        cur = element.nodeType === 1 && ( element.className ?
                ( " " + element.className + " " ).replace( rclass, " " ) :"");
        if ( cur ) {
            j = 0;
            while ( (clazz = classes[j++]) ) {
                // Remove *all* instances
                while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                    cur = cur.replace( " " + clazz + " ", " " );
                }
            }

            // only assign if different to avoid unneeded rendering.
            finalValue = value ? (cur + "").trim() : "";
            if ( element.className !== finalValue ) {
                element.className = finalValue;
            }
        }
    }
    return this;
};

u._hasClass = function(element,value){
    var rclass = /[\t\r\n\f]/g;
    if ( element.nodeType === 1 && (" " + element.className + " ").replace(rclass, " ").indexOf( value ) >= 0 ) {
        return true;
    }
    return false;
};

u._toggleClass = function(element, value){
    if ( u._hasClass(element, value) ) {
        u._removeClass(element, value);
    } else {
        u._addClass(element, value);
    }
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s*(\b.*\b|)\s*$/, "$1");
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj)
                return i;
        }
        return -1;
    };
}

if (!Array.prototype.remove) {
	Array.prototype.remove = function(index) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 1);
	};
}
// 遍历数组,执行函数
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn) {
        for (var i = 0, len = this.length; i < len; i++) {
            fn(this[i], i, this);
        }
    };
}

if(!NodeList.prototype.forEach)
    NodeList.prototype.forEach = Array.prototype.forEach;

    
function isDomElement(obj) {
    if (window['HTMLElement']) {
        return obj instanceof HTMLElement;
    } else {
        return obj && obj.tagName && obj.nodeType === 1;
    }
}
/*IE8的querySelectorAll返回的对象不是Array也不是NodeList，不能调用forEach，因此重写此方法*/
/* 此处没有IE8标识，因此使用HTMLElement来进行判断*/
if(!window['HTMLElement']){
    var _querySelectorAll = Element.prototype.querySelectorAll;
    Element.prototype.querySelectorAll = function(selector) {
        var result = _querySelectorAll.call(this,selector);
        if(!isDomElement(this)){
            return result;
        }
        var resArr = [];
        for(var i = 0;i < result.length;i++){
            resArr.push(result[i]);
        }
        return resArr;
    }

    var _docquerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = function(selector) {
        try{
            var result = _docquerySelectorAll.call(this,selector);
            var resArr = [];
            if(result.length > 0){
                for(var i = 0;i < result.length;i++){
                    resArr.push(result[i]);
                }
                return resArr;
            }else{
                return result;
            }
            
        }catch(e){

        }
        
    }
}

if(!Element.prototype.addEventListener){
    Element.prototype.addEventListener = function(event,fun){
        var tag = this;
        this.attachEvent("on"+event,function(){
            fun.apply(tag,arguments);//这里是关键
        });
    }
}


// 绑定环境
if(typeof Function.prototype.bind !== 'function'){
    Function.prototype.bind = function(context){
        var fn = this;
        var args = [];
        for(var i = 1, len = arguments.length; i < len; i ++){
            args.push(arguments[i]);
        }

        return function(){
            // for(var j = 1, len = arguments.length; j < len; j ++){
            //     args.push(arguments[j]);
            // }
            return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

// 获取当前js文件的路径
	window.getCurrentJsPath = function() {
		var doc = document,
		a = {},
		expose = +new Date(),
		rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
		isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
		// FF,Chrome
		if (doc.currentScript){
			return doc.currentScript.src;
		}

		var stack;
		try{
			a.b();
		}
		catch(e){
			stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
		}
		// IE10
		if (stack){
			var absPath = rExtractUri.exec(stack)[1];
			if (absPath){
				return absPath;
			}
		}

		// IE5-9
		for(var scripts = doc.scripts,
			i = scripts.length - 1,
			script; script = scripts[i--];){
			if (script.className !== expose && script.readyState === 'interactive'){
				script.className = expose;
				// if less than ie 8, must get abs path by getAttribute(src, 4)
				return isLtIE8 ? script.getAttribute('src', 4) : script.src;
			}
		}
	};
	
	window.encodeBase64 = function(str){
		var c1, c2, c3;
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
                var i = 0, len= str.length, string = '';

                while (i < len){
                        c1 = str[i++] & 0xff;
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                                string += "==";
                                break;
                        }
                        c2 = str[i++];
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                                string += "=";
                                break;
                        }
                        c3 = str[i++];
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                        string += base64EncodeChars.charAt(c3 & 0x3F)
                }
        return string
	};
/* Respond.js: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function( w ){

	"use strict";

	//exposed namespace
	var respond = {};
	w.respond = respond;

	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update = function(){};

	//define ajax obj
	var requestQueue = [],
		xmlHttp = (function() {
			var xmlhttpmethod = false;
			try {
				xmlhttpmethod = new w.XMLHttpRequest();
			}
			catch( e ){
				xmlhttpmethod = new w.ActiveXObject( "Microsoft.XMLHTTP" );
			}
			return function(){
				return xmlhttpmethod;
			};
		})(),

		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xmlHttp();
			if (!req){
				return;
			}
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.readyState !== 4 || req.status !== 200 && req.status !== 304 ){
					return;
				}
				callback( req.responseText );
			};
			if ( req.readyState === 4 ){
				return;
			}
			req.send( null );
		},
		isUnsupportedMediaQuery = function( query ) {
			return query.replace( respond.regex.minmaxwh, '' ).match( respond.regex.other );
		};

	//expose for testing
	respond.ajax = ajax;
	respond.queue = requestQueue;
	respond.unsupportedmq = isUnsupportedMediaQuery;
	respond.regex = {
		media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
		keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
		comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
		urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
		findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
		only: /(only\s+)?([a-zA-Z]+)\s?/,
		minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
		other: /\([^\)]*\)/g
	};

	//expose media query support flag for external use
	respond.mediaQueriesSupported = w.matchMedia && w.matchMedia( "only all" ) !== null && w.matchMedia( "only all" ).matches;

	//if media queries are supported, exit here
	if( respond.mediaQueriesSupported ){
		return;
	}

	//define vars
	var doc = w.document,
		docElem = doc.documentElement,
		mediastyles = [],
		rules = [],
		appendedEls = [],
		parsedSheets = {},
		resizeThrottle = 30,
		head = doc.getElementsByTagName( "head" )[0] || docElem,
		base = doc.getElementsByTagName( "base" )[0],
		links = head.getElementsByTagName( "link" ),

		lastCall,
		resizeDefer,

		//cached container for 1em value, populated the first time it's needed
		eminpx,

		// returns the value of 1em in pixels
		getEmValue = function() {
			var ret,
				div = doc.createElement('div'),
				body = doc.body,
				originalHTMLFontSize = docElem.style.fontSize,
				originalBodyFontSize = body && body.style.fontSize,
				fakeUsed = false;

			div.style.cssText = "position:absolute;font-size:1em;width:1em";

			if( !body ){
				body = fakeUsed = doc.createElement( "body" );
				body.style.background = "none";
			}

			// 1em in a media query is the value of the default font size of the browser
			// reset docElem and body to ensure the correct value is returned
			docElem.style.fontSize = "100%";
			body.style.fontSize = "100%";

			body.appendChild( div );

			if( fakeUsed ){
				docElem.insertBefore( body, docElem.firstChild );
			}

			ret = div.offsetWidth;

			if( fakeUsed ){
				docElem.removeChild( body );
			}
			else {
				body.removeChild( div );
			}

			// restore the original values
			docElem.style.fontSize = originalHTMLFontSize;
			if( originalBodyFontSize ) {
				body.style.fontSize = originalBodyFontSize;
			}


			//also update eminpx before returning
			ret = eminpx = parseFloat(ret);

			return ret;
		},

		//enable/disable styles
		applyMedia = function( fromResize ){
			var name = "clientWidth",
				docElemProp = docElem[ name ],
				currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp,
				styleBlocks	= {},
				lastLink = links[ links.length-1 ],
				now = (new Date()).getTime();

			//throttle resize calls
			if( fromResize && lastCall && now - lastCall < resizeThrottle ){
				w.clearTimeout( resizeDefer );
				resizeDefer = w.setTimeout( applyMedia, resizeThrottle );
				return;
			}
			else {
				lastCall = now;
			}

			for( var i in mediastyles ){
				if( mediastyles.hasOwnProperty( i ) ){
					var thisstyle = mediastyles[ i ],
						min = thisstyle.minw,
						max = thisstyle.maxw,
						minnull = min === null,
						maxnull = max === null,
						em = "em";

					if( !!min ){
						min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}
					if( !!max ){
						max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}

					// if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
					if( !thisstyle.hasquery || ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max ) ){
						if( !styleBlocks[ thisstyle.media ] ){
							styleBlocks[ thisstyle.media ] = [];
						}
						styleBlocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
					}
				}
			}

			//remove any existing respond style element(s)
			for( var j in appendedEls ){
				if( appendedEls.hasOwnProperty( j ) ){
					if( appendedEls[ j ] && appendedEls[ j ].parentNode === head ){
						head.removeChild( appendedEls[ j ] );
					}
				}
			}
			appendedEls.length = 0;

			//inject active styles, grouped by media type
			for( var k in styleBlocks ){
				if( styleBlocks.hasOwnProperty( k ) ){
					var ss = doc.createElement( "style" ),
						css = styleBlocks[ k ].join( "\n" );

					ss.type = "text/css";
					ss.media = k;

					//originally, ss was appended to a documentFragment and sheets were appended in bulk.
					//this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
					head.insertBefore( ss, lastLink.nextSibling );

					if ( ss.styleSheet ){
						ss.styleSheet.cssText = css;
					}
					else {
						ss.appendChild( doc.createTextNode( css ) );
					}

					//push to appendedEls to track for later removal
					appendedEls.push( ss );
				}
			}
		},
		//find media blocks in css text, convert to style blocks
		translate = function( styles, href, media ){
			var qs = styles.replace( respond.regex.comments, '' )
					.replace( respond.regex.keyframes, '' )
					.match( respond.regex.media ),
				ql = qs && qs.length || 0;

			//try to get CSS path
			href = href.substring( 0, href.lastIndexOf( "/" ) );

			var repUrls = function( css ){
					return css.replace( respond.regex.urls, "$1" + href + "$2$3" );
				},
				useMedia = !ql && media;

			//if path exists, tack on trailing slash
			if( href.length ){ href += "/"; }

			//if no internal queries exist, but media attr does, use that
			//note: this currently lacks support for situations where a media attr is specified on a link AND
				//its associated stylesheet has internal CSS media queries.
				//In those cases, the media attribute will currently be ignored.
			if( useMedia ){
				ql = 1;
			}

			for( var i = 0; i < ql; i++ ){
				var fullq, thisq, eachq, eql;

				//media attr
				if( useMedia ){
					fullq = media;
					rules.push( repUrls( styles ) );
				}
				//parse for styles
				else{
					fullq = qs[ i ].match( respond.regex.findStyles ) && RegExp.$1;
					rules.push( RegExp.$2 && repUrls( RegExp.$2 ) );
				}

				eachq = fullq.split( "," );
				eql = eachq.length;

				for( var j = 0; j < eql; j++ ){
					thisq = eachq[ j ];

					if( isUnsupportedMediaQuery( thisq ) ) {
						continue;
					}

					mediastyles.push( {
						media : thisq.split( "(" )[ 0 ].match( respond.regex.only ) && RegExp.$2 || "all",
						rules : rules.length - 1,
						hasquery : thisq.indexOf("(") > -1,
						minw : thisq.match( respond.regex.minw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
						maxw : thisq.match( respond.regex.maxw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" )
					} );
				}
			}

			applyMedia();
		},

		//recurse through request queue, get css text
		makeRequests = function(){
			if( requestQueue.length ){
				var thisRequest = requestQueue.shift();

				ajax( thisRequest.href, function( styles ){
					translate( styles, thisRequest.href, thisRequest.media );
					parsedSheets[ thisRequest.href ] = true;

					// by wrapping recursive function call in setTimeout
					// we prevent "Stack overflow" error in IE7
					w.setTimeout(function(){ makeRequests(); },0);
				} );
			}
		},

		//loop stylesheets, send text content to translate
		ripCSS = function(){

			for( var i = 0; i < links.length; i++ ){
				var sheet = links[ i ],
				href = sheet.href,
				media = sheet.media,
				isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";

				//only links plz and prevent re-parsing
				if( !!href && isCSS && !parsedSheets[ href ] ){
					// selectivizr exposes css through the rawCssText expando
					if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
						translate( sheet.styleSheet.rawCssText, href, media );
						parsedSheets[ href ] = true;
					} else {
						if( (!/^([a-zA-Z:]*\/\/)/.test( href ) && !base) ||
							href.replace( RegExp.$1, "" ).split( "/" )[0] === w.location.host ){
							// IE7 doesn't handle urls that start with '//' for ajax request
							// manually add in the protocol
							if ( href.substring(0,2) === "//" ) { href = w.location.protocol + href; }
							requestQueue.push( {
								href: href,
								media: media
							} );
						}
					}
				}
			}
			makeRequests();
		};

	//translate CSS
	ripCSS();

	//expose update for re-running respond later on
	respond.update = ripCSS;

	//expose getEmValue
	respond.getEmValue = getEmValue;

	//adjust on resize
	function callMedia(){
		applyMedia( true );
	}

	if( w.addEventListener ){
		w.addEventListener( "resize", callMedia, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onresize", callMedia );
	}
})(this);

/** 
 * iuap-design v3.0.6
 * UI Framework Used For Enterprise.
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/iuap-design#readme
 * bugs : https://github.com/iuap-design/iuap-design/issues
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
												var eObj = e;
												element["uEvent"][eventName].forEach(function(fn){
													try{
														eObj.target = eObj.target || eObj.srcElement;//兼容IE8
													}catch(e){
													}
													if(fn)
														fn.call(element,eObj)
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

var BaseComponent = u.Class.create({
    initialize: function (element) {
        if (u.isDomElement(element)){
            this.element = element;
            this.options = {};
        }else{
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
    on: function (name, callback) {
        name = name.toLowerCase()
        this._events || (this._events = {})
        var events = this._events[name] || (this._events[name] = [])
        events.push({
            callback: callback
        })
        return this;
    },
    /**
     * 触发事件
     * @param {String} name
     */
    trigger: function (name) {
        name = name.toLowerCase()
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
    init: function(){},
    /**
     * 渲染控件
     */
    render: function(){},
    /**
     * 销毁控件
     */
    destroy: function(){
        delete this.element['comp'];
        this.element.innerHTML = '';
    },
    /**
     * 增加dom事件
     * @param {String} name
     * @param {Function} callback
     */
    addDomEvent: function (name, callback) {
        u.on(this.element, name, callback)
        return this
    },
    /**
     * 移除dom事件
     * @param {String} name
     */
    removeDomEvent: function (name, callback) {
        u.off(this.element,name,callback);
        return this
    },
    setEnable: function (enable) {
        return this
    },
    /**
     * 判断是否为DOM事件
     */
    isDomEvent: function (eventName) {
        if (this.element['on' + eventName] === undefined)
            return false
        else
            return true
    },
    createDateAdapter: function(options){
        var opt = options['options'],
            model = options['model'];
        var Adapter = u.compMgr.getDataAdapter(this.compType, opt['dataType']);
        if (Adapter){
            this.dataAdapter = new Adapter(this, options);
        }
    },
    Statics: {
        compName: '',
        EVENT_VALUE_CHANGE: 'valueChange',
        getName: function () {
            return this.compName
        }
    }
})

function adjustDataType(options){
    var types = ['integer', 'float', 'currency', 'percent', 'string', 'textarea'];
    var _type = options['type'],
        _dataType = options['dataType'];
    if (types.indexOf(_type) != -1){
        options['dataType'] = _type;
        options['type'] = 'originText';
    }
}


u.BaseComponent = BaseComponent


  var URipple = function URipple(element) {
    if (u.isIE8) return; 
    this._element = element;

    // Initialize instance.
    this.init();
  };
  //window['URipple'] = URipple;

  URipple.prototype._down = function(event) {
    if (u.isIE8) return; 
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
      if(window.requestAnimationFrame)
        window.requestAnimationFrame(this.animFrameHandler.bind(this));
    }
  };

  /**
   * Handle mouse / finger up on element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  URipple.prototype._up = function(event) {
    if (u.isIE8) return; 
    var self = this;
    // Don't fire for the artificial "mouseup" generated by a double-click.
    if (event && event.detail !== 2) {
      u.removeClass(this._rippleElement,'is-visible')
    }
    // Allow a repaint to occur before removing this class, so the animation
    // shows for tap events, which seem to trigger a mouseup too soon after
    // mousedown.
    window.setTimeout(function() {
      u.removeClass(self._rippleElement,'is-visible')
    }, 0);
  };

  /**
       * Getter for frameCount_.
       * @return {number} the frame count.
       */
  URipple.prototype.getFrameCount = function() {
    if (u.isIE8) return; 
    return this.frameCount_;
  };
  /**
       * Setter for frameCount_.
       * @param {number} fC the frame count.
       */
  URipple.prototype.setFrameCount = function(fC) {
    if (u.isIE8) return; 
    this.frameCount_ = fC;
  };


  /**
       * Getter for _rippleElement.
       * @return {Element} the ripple element.
       */
      URipple.prototype.getRippleElement = function() {
        if (u.isIE8) return; 
        return this._rippleElement;
      };

      /**
       * Sets the ripple X and Y coordinates.
       * @param  {number} newX the new X coordinate
       * @param  {number} newY the new Y coordinate
       */
      URipple.prototype.setRippleXY = function(newX, newY) {
        if (u.isIE8) return; 
        this.x_ = newX;
        this.y_ = newY;
      };

      /**
       * Sets the ripple styles.
       * @param  {boolean} start whether or not this is the start frame.
       */
      URipple.prototype.setRippleStyles = function(start) {
        if (u.isIE8) return; 
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
            u.removeClass(this._rippleElement,'is-animating')
          } else {
            u.addClass(this._rippleElement,'is-animating')
          }
        }
      };

    /**
       * Handles an animation frame.
       */
      URipple.prototype.animFrameHandler = function() {
        if (u.isIE8) return; 
        if (this.frameCount_-- > 0) {
          window.requestAnimationFrame(this.animFrameHandler.bind(this));
        } else {
          this.setRippleStyles(false);
        }
      };

  /**
   * Initialize element.
   */
  URipple.prototype.init = function() {
    if (u.isIE8) return; 
    var self = this;
    if (this._element) {
      this._rippleElement = this._element.querySelector('.u-ripple');
      if (!this._rippleElement){
        this._rippleElement = document.createElement('span');
        u.addClass(this._rippleElement,'u-ripple');
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
      u.on(this._element, 'mousedown',function(e){self._down(e);})
      u.on(this._element, 'touchstart',function(e){self._down(e);})

      u.on(this._element, 'mouseup',function(e){self._up(e);})
      u.on(this._element, 'mouseleave',function(e){self._up(e);})
      u.on(this._element, 'touchend',function(e){self._up(e);})
      u.on(this._element, 'blur',function(e){self._up(e);})
    }
  };

  u.Ripple = URipple;







u.Button = u.BaseComponent.extend({
    init:function(){
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer, 'u-button-container');
        this._rippleElement = document.createElement('span');
        u.addClass(this._rippleElement, 'u-ripple');
        if (u.isIE8)
            u.addClass(this._rippleElement, 'oldIE');
        rippleContainer.appendChild(this._rippleElement);
        u.on(this._rippleElement, 'mouseup', this.element.blur);
        this.element.appendChild(rippleContainer);

        u.on(this.element, 'mouseup', this.element.blur);
        u.on(this.element, 'mouseleave', this.element.blur);
        this.ripple = new u.Ripple(this.element)
    }

});


u.compMgr.regComp({
    comp: u.Button,
    compAsString: 'u.Button',
    css: 'u-button'
})

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
    init: function(){
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
                this._content.style.height = layoutHeight - headerHeight + 'px'
                var self = this;
                u.on(window,'resize', function () {
                    var layoutHeight = self.element.offsetHeight;
                    var headerHeight = typeof self._header === 'undefined' ? 0 : self._header.offsetHeight;
                    self._content.style.height = layoutHeight - headerHeight + 'px'

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
                u.on(this._content,'scroll',this._contentScrollHandler.bind(this));
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
            u.on(drawerButton,'click', this._drawerToggleHandler.bind(this));

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
            u.on(obfuscator,'click', this._drawerToggleHandler.bind(this));
            this._obfuscator = obfuscator;

            var leftnavs = this.element.querySelectorAll('.' + this._CssClasses.NAV);
            for(var i = 0; i < leftnavs.length; i++){
                u.on(leftnavs[i],'click', this._navlinkClickHander.bind(this));
                
                var items = leftnavs[i].querySelectorAll('.' + this._CssClasses.NAV_LINK);
                for(var i=0;i<items.length;i++) {
                    new u.Ripple(items[i])
                }
            }   
            

            
            
        }

        // Keep an eye on screen size, and add/remove auxiliary class for styling
        // of small screens.
        

        if(u.isIE8 || u.isIE9){
            u.on(window,'resize',this._screenSizeHandler.bind(this));
        }else{
            this._screenSizeMediaQuery = window.matchMedia(
            /** @type {string} */ (this._Constant.MAX_WIDTH));
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
            u.on(leftButton,'click', function () {
                this._tabBar.scrollLeft -= this._Constant.TAB_SCROLL_PIXELS;
            }.bind(this));

            var rightButton = document.createElement('div');
            u.addClass(rightButton, this._CssClasses.TAB_BAR_BUTTON);
            u.addClass(rightButton, this._CssClasses.TAB_BAR_RIGHT_BUTTON);
            var rightButtonIcon = document.createElement('i');
            u.addClass(rightButtonIcon, this._CssClasses.ICON);
            rightButtonIcon.textContent = this._Constant.CHEVRON_RIGHT;
            rightButton.appendChild(rightButtonIcon);
            u.on(rightButton,'click', function () {
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

                if (this._tabBar.scrollLeft <
                    this._tabBar.scrollWidth - this._tabBar.offsetWidth) {
                    u.addClass(rightButton, this._CssClasses.IS_ACTIVE);
                } else {
                    u.removeClass(rightButton, this._CssClasses.IS_ACTIVE);
                }
            }.bind(this);

            u.on(this._tabBar,'scroll', tabScrollHandler);
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
    _contentScrollHandler: function () {
        if (u.hasClass(this._header, this._CssClasses.IS_ANIMATING)) {
            return;
        }

        if (this._content.scrollTop > 0 && !u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.addClass(this._header, this._CssClasses.CASTING_SHADOW)
                .addClass(this._header, this._CssClasses.IS_COMPACT)
                .addClass(this._header, this._CssClasses.IS_ANIMATING);
        } else if (this._content.scrollTop <= 0 && u.hasClass(this._header, this._CssClasses.IS_COMPACT)) {
            u.removeClass(this._header, this._CssClasses.CASTING_SHADOW)
                .removeClass(this._header, this._CssClasses.IS_COMPACT)
                .addClass(this._header, this._CssClasses.IS_ANIMATING);
        }
    },


    /**
     * Handles changes in screen size.
     *
     * @private
     */
    _screenSizeHandler: function () {
        if(u.isIE8 || u.isIE9){
            this._screenSizeMediaQuery = {};
            var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; 
            if(w > 1024)
                this._screenSizeMediaQuery.matches = false;
            else
                this._screenSizeMediaQuery.matches = true;
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
    _drawerToggleHandler: function () {
        u.toggleClass(this._drawer, this._CssClasses.IS_DRAWER_OPEN);
        u.toggleClass(this._obfuscator, this._CssClasses.IS_DRAWER_OPEN);
    },
    /**
     * Handles (un)setting the `is-animating` class
     *
     * @private
     */
    _headerTransitionEndHandler: function () {
        u.removeClass(this._header, this._CssClasses.IS_ANIMATING);
    },
    /**
     * Handles expanding the header on click
     *
     * @private
     */
    _headerClickHandler: function () {
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
    _resetTabState: function (tabBar) {
        for (var k = 0; k < tabBar.length; k++) {
            u.removeClass(tabBar[k], this._CssClasses.IS_ACTIVE);
        }
    },
    /**
     * Reset panel state, droping active classes
     *
     * @private
     */
    _resetPanelState: function (panels) {
        for (var j = 0; j < panels.length; j++) {
            u.removeClass(panels[j], this._CssClasses.IS_ACTIVE);
        }
    },
    _navlinkClickHander: function (e) {
        //var _target = e.currentTarget || e.target || e.srcElement;
        var curlink = this.element.querySelector('.'+this._CssClasses.NAV_LINK_CURRENT);
        curlink && u.removeClass(curlink, this._CssClasses.NAV_LINK_CURRENT);
        // if (curlink && u.isIE8){
        // 	var sub = curlink.parentNode.querySelector('.'+this._CssClasses.NAV_SUB);
        // 	if (sub){
        // 		sub.style.maxHeight = '0';
        // 	}
        // }

        var item = u.closest(e.target, this._CssClasses.NAV_LINK);

        if(item){
            u.addClass(item, this._CssClasses.NAV_LINK_CURRENT);
            var sub = item.parentNode.querySelector('.'+this._CssClasses.NAV_SUB),
                open = u.hasClass(item, this._CssClasses.NAV_LINK_OPEN);
            if (sub && open){
                u.removeClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8)
                    sub.style.maxHeight = 0;
            }
            if (sub && !open){
                u.addClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8)
                    sub.style.maxHeight = '999px';
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
    new URipple(tab)
    //}
    u.on(tab,'click', function (e) {
        if (tab.getAttribute('href').charAt(0) === '#') {
            e.preventDefault();
            selectTab();
        }
    });

    tab.show = selectTab;

    u.on(tab,'click', function (e) {
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
})

u.NavMenu = u.BaseComponent.extend({
    _Constant: {
    },
    _CssClasses: {
        NAV: 'u-navmenu',
        NAV_LINK: 'u-navmenu-link',
        NAV_LINK_CURRENT: 'u-navmenu-link-current',
        NAV_LINK_OPEN: 'u-navmenu-link-open',
        NAV_SUB: 'u-navmenu-sub'
    },
    init: function(){

       if(u.hasClass(this.element, 'u-navmenu-horizontal')) {
            u.on(this.element,'click', this._horNavlinkClickHander.bind(this));
        } else {
            u.on(this.element,'click', this._navlinkClickHander.bind(this));
        }

        var items = this.element.querySelectorAll('.' + this._CssClasses.NAV_LINK);
        for(var i=0;i<items.length;i++) {
            new u.Ripple(items[i])
        }

    },
    _horNavlinkClickHander: function (e) {
        var item = u.closest(e.target, this._CssClasses.NAV_LINK);

        if(item){
            var curlink = this.element.querySelector('.'+this._CssClasses.NAV_LINK_CURRENT);
            curlink && u.removeClass(curlink, this._CssClasses.NAV_LINK_CURRENT);
            u.addClass(item, this._CssClasses.NAV_LINK_CURRENT);
        }
    },
    _navlinkClickHander: function (e) {
        //var _target = e.currentTarget || e.target || e.srcElement;
        var curlink = this.element.querySelector('.'+this._CssClasses.NAV_LINK_CURRENT);
        curlink && u.removeClass(curlink, this._CssClasses.NAV_LINK_CURRENT);
        // if (curlink && u.isIE8){
        // 	var sub = curlink.parentNode.querySelector('.'+this._CssClasses.NAV_SUB);
        // 	if (sub){
        // 		sub.style.maxHeight = '0';
        // 	}
        // }

        var item = u.closest(e.target, this._CssClasses.NAV_LINK);

        if(item){
            u.addClass(item, this._CssClasses.NAV_LINK_CURRENT);
            var sub = item.parentNode.querySelector('.'+this._CssClasses.NAV_SUB),
                open = u.hasClass(item, this._CssClasses.NAV_LINK_OPEN);
            if (sub && open){
                u.removeClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8)
                    sub.style.maxHeight = 0;
            }
            if (sub && !open){
                u.addClass(item, this._CssClasses.NAV_LINK_OPEN);
                if (u.isIE8)
                    sub.style.maxHeight = '999px';
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
})

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

    init: function () {
        var oThis = this;
        this.maxRows = this._Constant.NO_MAX_ROWS;
        this.label_ = this.element.querySelector('.' + this._CssClasses.LABEL);
        this._input = this.element.querySelector('input');

        if (this._input) {
            if (this._input.hasAttribute(
                    /** @type {string} */ (this._Constant.MAX_ROWS_ATTRIBUTE))) {
                this.maxRows = parseInt(this._input.getAttribute(
                    /** @type {string} */ (this._Constant.MAX_ROWS_ATTRIBUTE)), 10);
                if (isNaN(this.maxRows)) {
                    this.maxRows = this._Constant.NO_MAX_ROWS;
                }
            }

            this.boundUpdateClassesHandler = this._updateClasses.bind(this);
            this.boundFocusHandler = this._focus.bind(this);
            this.boundBlurHandler = this._blur.bind(this);
            this.boundResetHandler = this._reset.bind(this);
            this._input.addEventListener('input', this.boundUpdateClassesHandler);
            if(u.isIE8){
                this._input.addEventListener('propertychange', function(){
                    oThis._updateClasses();
                });
            }
            this._input.addEventListener('focus', this.boundFocusHandler);
            if(u.isIE8 || u.isIE9){
                if(this.label_){
                    this.label_.addEventListener('click', function(){
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
    _down: function (event) {
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
    _focus : function (event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },
    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _blur : function (event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },
    /**
     * Handle reset event from out side.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _reset : function (event) {
        this._updateClasses();
    },
    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses : function () {
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
    checkDisabled : function () {
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
    checkValidity : function () {
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
    checkDirty: function () {
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
    disable: function () {
        this._input.disabled = true;
        this._updateClasses();
    },
    /**
     * Enable text field.
     *
     * @public
     */
    enable: function () {
        this._input.disabled = false;
        this._updateClasses();
    },
    /**
     * Update text field value.
     *
     * @param {string} value The value to which to set the control (optional).
     * @public
     */
    change: function (value) {
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

u.Menu = u.BaseComponent.extend({
    _Keycodes: {
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        UP_ARROW: 38,
        DOWN_ARROW: 40
    },
    _CssClasses: {

        BOTTOM_LEFT: 'u-menu-bottom-left',  // This is the default.
        BOTTOM_RIGHT: 'u-menu-bottom-right',
        TOP_LEFT: 'u-menu-top-left',
        TOP_RIGHT: 'u-menu-top-right',
        UNALIGNED: 'u-menu-unaligned'
    },

    init: function () {

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
                u.on(forEl,'click', this._handleForClick.bind(this));
                u.on(forEl,'keydown', this._handleForKeyboardEvent.bind(this))
            }
        }

        var items = this.element.querySelectorAll('.u-menu-item');
        this._boundItemKeydown = this._handleItemKeyboardEvent.bind(this);
        this._boundItemClick = this._handleItemClick.bind(this);
        for (var i = 0; i < items.length; i++) {
            // Add a listener to each menu item.
            u.on(items[i],'click', this._boundItemClick);
            // Add a tab index to each menu item.
            items[i].tabIndex = '-1';
            // Add a keyboard listener to each menu item.
            u.on(items[i],'keydown', this._boundItemKeydown);
        }

        for (i = 0; i < items.length; i++) {
            var item = items[i];

            var rippleContainer = document.createElement('span');
            u.addClass(rippleContainer, 'u-ripple');
            item.appendChild(rippleContainer);
            new URipple(item)
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
    _handleForClick: function (evt) {
        if (this.element && this.for_element) {
            var rect = this.for_element.getBoundingClientRect();
            var forRect = this.for_element.parentElement.getBoundingClientRect();

            if (u.hasClass(this.element, 'u-menu-unaligned')) {
                // Do not position the menu automatically. Requires the developer to
                // manually specify position.
            } else if (u.hasClass(this.element, 'u-menu-bottom-right')) {
                // Position below the "for" element, aligned to its right.
                this._container.style.right = (forRect.right - rect.right) + 'px';
                this._container.style.top = this.for_element.offsetTop + this.for_element.offsetHeight + 'px';
            } else if (u.hasClass(this.element, 'u-menu-top-left')) {
                // Position above the "for" element, aligned to its left.
                this._container.style.left = this.for_element.offsetLeft + 'px';
                this._container.style.bottom = (forRect.bottom - rect.top) + 'px';
            } else if (u.hasClass(this.element, 'u-menu-top-right')) {
                // Position above the "for" element, aligned to its right.
                this._container.style.right = (forRect.right - rect.right) + 'px';
                this._container.style.bottom = (forRect.bottom - rect.top) + 'px';
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
    _handleForKeyboardEvent: function (evt) {
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
    _handleItemKeyboardEvent: function (evt) {
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
                } else if (evt.keyCode === this._Keycodes.SPACE ||
                    evt.keyCode === this._Keycodes.ENTER) {
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
    _handleItemClick: function (evt) {
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
    _applyClip: function (height, width) {
        if (u.hasClass(this.element, 'u-menu-unaligned')) {
            // Do not clip.
            this.element.style.clip = '';
        } else if (u.hasClass(this.element, 'u-menu-bottom-right')) {
            // Clip to the top right corner of the menu.
            this.element.style.clip =
                'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
        } else if (u.hasClass(this.element, 'u-menu-top-left')) {
            // Clip to the bottom left corner of the menu.
            this.element.style.clip =
                'rect(' + height + 'px 0 ' + height + 'px 0)';
        } else if (u.hasClass(this.element, 'u-menu-top-right')) {
            // Clip to the bottom right corner of the menu.
            this.element.style.clip = 'rect(' + height + 'px ' + width + 'px ' +
                height + 'px ' + width + 'px)';
        } else {
            // Default: do not clip (same as clipping to the top left corner).
            this.element.style.clip = 'rect(' + 0 + 'px ' + 0 + 'px ' +
                0 + 'px ' + 0 + 'px)';
        }
    },
    /**
     * Adds an event listener to clean up after the animation ends.
     *
     * @private
     */
    _addAnimationEndListener: function () {
        var cleanup = function () {
            u.off(this.element,'transitionend', cleanup);
            // this.element.removeEventListener('transitionend', cleanup);
            u.off(this.element,'webkitTransitionEnd', cleanup);
            // this.element.removeEventListener('webkitTransitionEnd', cleanup);
            u.removeClass(this.element, 'is-animating');
        }.bind(this);

        // Remove animation class once the transition is done.
        u.on(this.element,'transitionend', cleanup);
        // this.element.addEventListener('transitionend', cleanup);
        u.on(this.element,'webkitTransitionEnd', cleanup);
        // this.element.addEventListener('webkitTransitionEnd', cleanup);
    },
    /**
     * Displays the menu.
     *
     * @public
     */
    show: function (evt) {
        if (this.element && this._container && this._outline) {
            // Measure the inner element.
            var height = this.element.getBoundingClientRect().height;
            var width = this.element.getBoundingClientRect().width;

            if(!width){
                var left = this.element.getBoundingClientRect().left;
                var right = this.element.getBoundingClientRect().right;
                width = right - left;
            }

            if(!height){
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
                    itemDelay = ((height - items[i].offsetTop - items[i].offsetHeight) /
                        height * transitionDuration) + 's';
                } else {
                    itemDelay = (items[i].offsetTop / height * transitionDuration) + 's';
                }
                items[i].style.transitionDelay = itemDelay;
            }

            // Apply the initial clip to the text before we start animating.
            this._applyClip(height, width);

            // Wait for the next frame, turn on animation, and apply the final clip.
            // Also make it visible. This triggers the transitions.
            if(window.requestAnimationFrame){
                window.requestAnimationFrame(function () {
                    u.addClass(this.element, 'is-animating');
                    this.element.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
                    u.addClass(this._container, 'is-visible');
                }.bind(this));
            }else{
                u.addClass(this.element, 'is-animating');
                this.element.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
                u.addClass(this._container, 'is-visible');
            }
                

            // Clean up after the animation is complete.
            this._addAnimationEndListener();

            // Add a click listener to the document, to close the menu.
            var firstFlag = true;
            var callback = function (e) {
                if(u.isIE8){
                    if(firstFlag){
                        firstFlag = false;
                        return
                    }
                }
                if (e !== evt && !this._closing && e.target.parentNode !== this.element) {
                    u.off(document,'click', callback);
                    // document.removeEventListener('click', callback);
                    this.hide();
                }
            }.bind(this);
            u.on(document,'click', callback);
            // document.addEventListener('click', callback);
        }
    },

    /**
     * Hides the menu.
     *
     * @public
     */
    hide: function () {
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

            if(!width){
                var left = rect.left;
                var right = rect.right;
                width = right - left;
            }

            if(!height){
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
    toggle: function (evt) {
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
})


u.MDLayout = u.BaseComponent.extend({
	_CssClasses: {
	MASTER: 'u-mdlayout-master',
	DETAIL: 'u-mdlayout-detail',
	PAGE: 'u-mdlayout-page',
	PAGE_HEADER: 'u-mdlayout-page-header',
	PAGE_SECTION: 'u-mdlayout-page-section',
	PAGE_FOOTER: 'u-mdlayout-page-footer'
},
	init: function(){
		//this.browser = _getBrowserInfo();
		var me = this;
		this.minWidth = 600;
		//this.options = $.extend({}, MDLayout.DEFAULTS, options)
		//this.$element.css('position','relative').css('width','100%').css('height','100%').css('overflow','hidden')
		this._master =  this.element.querySelector('.' + this._CssClasses.MASTER);
		this._detail =  this.element.querySelector('.' + this._CssClasses.DETAIL);

		//this.$master.css('float','left').css('height','100%')
		//this.$detail.css('height','100%').css('overflow','hidden').css('position','relative');
		if(this.master)
			this.masterWidth = this._master.offsetWidth;
		else
			this.masterWidth = 0;
		this.detailWidth = this._detail.offsetWidth;
		if(this._master)
			this.mPages = this._master.querySelectorAll('.' + this._CssClasses.PAGE);
		this.dPages = this._detail.querySelectorAll('.' + this._CssClasses.PAGE);
		this.mPageMap = {};
		this.dPageMap = {};
		if(this._master)
			this.initPages(this.mPages, 'master');
		this.initPages(this.dPages, 'detail');

		this.mHistory = [];
		this.dHistory = [];
		this.isNarrow = null;
		this.response();
		u.on(window, 'resize', function(){
			me.response();
		})
	},

initPages: function(pages, type){
	var pageMap,pWidth;
	if (type === 'master'){
		pageMap = this.mPageMap;
		pWidth = this.masterWidth;
	}else{
		pageMap = this.dPageMap;
		pWidth = this.detailWidth;
	}
	for (var i = 0; i< pages.length; i++){
		var pid = pages[i].getAttribute('id');
		if (!pid)
			throw new Error('u-mdlayout-page mast have id attribute')
		pageMap[pid] = pages[i];
		if (i === 0){
			if (type === 'master')
				this.current_m_pageId = pid;
			else
				this.current_d_pageId = pid;
			u.addClass(pages[i],'current');
			//pages[i].style.transform = 'translate3d('+ pWidth +'px,0,0)';
			pages[i].style.transform = 'translate3d(0,0,0)';
		}else{
			pages[i].style.transform = 'translate3d('+ pWidth +'px,0,0)';
		}
		if (u.isIE8 || u.isIE9){
			u.addClass(pages[i],'let-ie9');
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

response: function() {
	var totalWidth = this.element.offsetWidth;
	if (totalWidth < this.minWidth){
		if (this.isNarrow == null || this.isNarrow == false)
			this.isNarrow = true
		this.hideMaster()
	}
	else{
		if (this.isNarrow == null || this.isNarrow == true)
			this.isNarrow = false
		this.showMaster()
	}
	this.calcWidth();

},

calcWidth: function(){
	if (!(u.isIE8 || u.isIE9)){
		this.detailWidth = this._detail.offsetWidth;
		if(this._master)
			this.masterWidth = this._master.offsetWidth;
		else
			this.masterWidth = 0;
		//TODO this.mHistory中的panel应该置为-值
		for (var i = 0; i<this.dPages.length; i++){
			var pid = this.dPages[i].getAttribute('id');
			if (pid !== this.current_d_pageId){
				this.dPages[i].style.transform = 'translate3d('+ this.detailWidth +'px,0,0)';
			}
		}
		//this.$detail.find('[data-role="page"]').css('transform','translate3d('+ this.detailWidth +'px,0,0)')
		//this.$detail.find('#' + this.current_d_pageId).css('transform','translate3d(0,0,0)')
	}

},

mGo: function(pageId) {
	if (this.current_m_pageId == pageId) return;
	this.mHistory.push(this.current_m_pageId);
	_hidePage(this.mPageMap[this.current_m_pageId],this,'-' + this.masterWidth)
	this.current_m_pageId = pageId
	_showPage(this.mPageMap[this.current_m_pageId],this)
},

mBack: function() {
	if (this.mHistory.length == 0) return;
	_hidePage(this.mPageMap[this.current_m_pageId],this,this.masterWidth)
	this.current_m_pageId = this.mHistory.pop();
	_showPage(this.mPageMap[this.current_m_pageId],this)
},

dGo: function(pageId) {
	if (this.current_d_pageId == pageId) return;
	this.dHistory.push(this.current_d_pageId);
	_hidePage(this.dPageMap[this.current_d_pageId],this,'-' + this.detailWidth)
	this.current_d_pageId = pageId
	_showPage(this.dPageMap[this.current_d_pageId],this)
},

dBack: function() {
	if (this.dHistory.length == 0) return;
	_hidePage(this.dPageMap[this.current_d_pageId],this,this.detailWidth)
	this.current_d_pageId = this.dHistory.pop();
	_showPage(this.dPageMap[this.current_d_pageId],this)
},

showMaster: function() {
	if(this._master){
		if (u.isIE8 || u.isIE9)
			this._master.style.display = 'block';
		else{
			this._master.style.transform = 'translate3d(0,0,0)';
		}
		if (!this.isNarrow)
			this._master.style.position = 'relative';
	}
},

hideMaster: function() {
	if(this._master){
		if (this._master.offsetLeft < 0 || this._master.style.display == 'none')
			return;
		if (u.isIE8 || u.isIE9)
			this._master.style.display = 'none';
		else{
			this._master.style.transform = 'translate3d(-'+ this.masterWidth +'px,0,0)';
		}
		this._master.style.position = 'absolute';
		this._master.style.zIndex = 5;
		this.calcWidth()
	}
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

function _showPage(el,me){
	u.addClass(el,'current');
	if (!(u.isIE8 || u.isIE9))
		el.style.transform = 'translate3d(0,0,0)';
}

function _hidePage(el,me,width){
	u.removeClass(el,'current');
	if (!(u.isIE8 || u.isIE9))
		el.style.transform = 'translate3d('+ width +'px,0,0)';
}


u.compMgr.regComp({
	comp: u.MDLayout,
	compAsString: 'u.MDLayout',
	css: 'u-mdlayout'
});



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
	initTabs_: function() {
		u.addClass(this.element,this._CssClasses.U_JS_RIPPLE_EFFECT_IGNORE_EVENTS)

		// Select element tabs, document panels
		this.tabs_ = this.element.querySelectorAll('.' + this._CssClasses.TAB_CLASS);
		this.panels_ =
			this.element.querySelectorAll('.' + this._CssClasses.PANEL_CLASS);

		// Create new tabs for each tab element
		for (var i = 0; i < this.tabs_.length; i++) {
			new Tab(this.tabs_[i], this);
		}
		u.addClass(this.element,this._CssClasses.UPGRADED_CLASS)
	},

	/**
	 * Reset tab state, dropping active classes
	 *
	 * @private
	 */
	resetTabState_: function() {
		for (var k = 0; k < this.tabs_.length; k++) {
			u.removeClass(this.tabs_[k],this._CssClasses.ACTIVE_CLASS)
		}
	},

	/**
	 * Reset panel state, droping active classes
	 *
	 * @private
	 */
	resetPanelState_: function() {
		for (var j = 0; j < this.panels_.length; j++) {
			u.removeClass(this.panels_[j],this._CssClasses.ACTIVE_CLASS)
		}
	},
	show: function(itemId){
		var panel = this.element.querySelector('#' + itemId);
		var tab = this.element.querySelector("[href='#" + itemId + "']");
		this.resetTabState_();
		this.resetPanelState_();
		u.addClass(tab,this._CssClasses.ACTIVE_CLASS);
		u.addClass(panel,this._CssClasses.ACTIVE_CLASS);

	},

	/**
	 * Initialize element.
	 */
	init: function() {
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
			u.addClass(rippleContainer,ctx._CssClasses.U_RIPPLE_CONTAINER);
			u.addClass(rippleContainer,ctx._CssClasses.U_JS_RIPPLE_EFFECT);
			var ripple = document.createElement('span');
			u.addClass(ripple,ctx._CssClasses.U_RIPPLE);
			rippleContainer.appendChild(ripple);
			tab.appendChild(rippleContainer);

      tab.ripple = new u.Ripple(tab)


		tab.addEventListener('click', function(e) {
			u.stopEvent(e);
			// e.preventDefault();
			var href = tab.href.split('#')[1];
			var panel = ctx.element.querySelector('#' + href);
			ctx.resetTabState_();
			ctx.resetPanelState_();
			u.addClass(tab,ctx._CssClasses.ACTIVE_CLASS);
			u.addClass(panel,ctx._CssClasses.ACTIVE_CLASS);
		});

	}
}


u.compMgr.regComp({
	comp: u.Tabs,
	compAsString: 'u.Tabs',
	css: 'u-tabs'
})
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
    init: function () {
        this._inputElement = this.element.querySelector('input');

        var boxOutline = document.createElement('span');
        u.addClass(boxOutline, this._CssClasses.BOX_OUTLINE);

        var tickContainer = document.createElement('span');
        u.addClass(tickContainer, this._CssClasses.FOCUS_HELPER)

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
        if (!u.hasClass(this.element, 'only-style')){
            u.on(this.element, 'click', function(e){
                if(!this._inputElement.disabled){
                    this.toggle();
                    u.stopEvent(e);
                }
            }.bind(this));
        }


        this._updateClasses();
        u.addClass(this.element, this._CssClasses.IS_UPGRADED);

    },

    _onChange: function (event) {
        this._updateClasses();
        this.trigger('change', {isChecked:this._inputElement.checked});
    },

    _onFocus: function () {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED)
    },

    _onBlur: function () {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED)
    },

    _onMouseUp: function (event) {
        this._blur();
    },

    /**
     * Handle class updates.
     *
     * @private
     */
    _updateClasses: function () {
        this.checkDisabled();
        this.checkToggleState();
    },

    /**
     * Add blur.
     *
     * @private
     */
    _blur: function () {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._inputElement.blur();
        }.bind(this), /** @type {number} */ (this._Constant.TINY_TIMEOUT));
    },

// Public methods.

    /**
     * Check the inputs toggle state and update display.
     *
     * @public
     */
    checkToggleState: function () {
        if (this._inputElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED)
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED)
        }
    },


    /**
     * Check the inputs disabled state and update display.
     *
     * @public
     */
    checkDisabled: function () {
        if (this._inputElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED)
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED)
        }
    },


    isChecked: function(){
        //return u.hasClass(this.element,this._CssClasses.IS_CHECKED);
        return this._inputElement.checked
    },

    toggle: function(){
        //return;
        if (this.isChecked()){
            this.uncheck()
        }else{
            this.check();
        }
    },

    /**
     * Disable checkbox.
     *
     * @public
     */
    disable: function () {
        this._inputElement.disabled = true;
        this._updateClasses();
    },


    /**
     * Enable checkbox.
     *
     * @public
     */
    enable: function () {
        this._inputElement.disabled = false;
        this._updateClasses();
    },


    /**
     * Check checkbox.
     *
     * @public
     */
    check: function () {
        this._inputElement.checked = true;
        this._updateClasses();
        this.boundInputOnChange();
    },


    /**
     * Uncheck checkbox.
     *
     * @public
     */
    uncheck: function () {
        this._inputElement.checked = false;
        this._updateClasses();
        this.boundInputOnChange();
    }


});


if (u.compMgr)
    u.compMgr.regComp({
        comp: u.Checkbox,
        compAsString: 'u.Checkbox',
        css: 'u-checkbox'
    })

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

    init: function () {
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
        new URipple(rippleContainer)
        //}

        this._btnElement.addEventListener('change', this._boundChangeHandler);
        this._btnElement.addEventListener('focus', this._boundFocusHandler);
        this._btnElement.addEventListener('blur', this._boundBlurHandler);
        this.element.addEventListener('mouseup', this._boundMouseUpHandler);

        this._updateClasses();
        u.addClass(this.element, this._CssClasses.IS_UPGRADED);

    },

    _onChange: function (event) {
        // Since other radio buttons don't get change events, we need to look for
        // them to update their classes.
        var radios = document.querySelectorAll('.' + this._CssClasses.JS_RADIO);
        for (var i = 0; i < radios.length; i++) {
            var button = radios[i].querySelector('.' + this._CssClasses.RADIO_BTN);
            // Different name == different group, so no point updating those.
            if (button.getAttribute('name') === this._btnElement.getAttribute('name')) {
                if(radios[i]['u.Radio']){
                    radios[i]['u.Radio']._updateClasses();
                }
            }
        }
        this.trigger('change', {isChecked:this._btnElement.checked});
    },

    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onFocus: function (event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onBlur: function (event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    /**
     * Handle mouseup.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    _onMouseup: function (event) {
        this._blur();
    },

    /**
     * Update classes.
     *
     * @private
     */
    _updateClasses: function () {
        this.checkDisabled();
        this.checkToggleState();
    },

    /**
     * Add blur.
     *
     * @private
     */
    _blur: function () {

        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._btnElement.blur();
        }.bind(this), /** @type {number} */ (this.Constant_.TINY_TIMEOUT));
    },

// Public methods.

    /**
     * Check the components disabled state.
     *
     * @public
     */
    checkDisabled: function () {
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
    checkToggleState: function () {
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
    disable: function () {
        this._btnElement.disabled = true;
        this._updateClasses();
    },

    /**
     * Enable radio.
     *
     * @public
     */
    enable: function () {
        this._btnElement.disabled = false;
        this._updateClasses();
    },


    /**
     * Check radio.
     *
     * @public
     */
    check: function () {
        this._btnElement.checked = true;
        this._updateClasses();
    },


    uncheck: function () {
        this._btnElement.checked = false;
        this._updateClasses();
    }


});


u.compMgr.regComp({
    comp: u.Radio,
    compAsString: 'u.Radio',
    css: 'u-radio'
});

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

    init: function () {
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

    _onChange: function (event) {
        this._updateClasses();
        this.trigger('change', {isChecked:this._inputElement.checked});
    },

    _onFocus: function (event) {
        u.addClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onBlur: function (event) {
        u.removeClass(this.element, this._CssClasses.IS_FOCUSED);
    },

    _onMouseUp: function (event) {
        this._blur();
    },

    _updateClasses: function () {
        this.checkDisabled();
        this.checkToggleState();
    },

    _blur: function () {
        // TODO: figure out why there's a focus event being fired after our blur,
        // so that we can avoid this hack.
        window.setTimeout(function () {
            this._inputElement.blur();
        }.bind(this), /** @type {number} */ (this._Constant.TINY_TIMEOUT));
    },

// Public methods.

    checkDisabled: function () {
        if (this._inputElement.disabled) {
            u.addClass(this.element, this._CssClasses.IS_DISABLED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_DISABLED);
        }
    },


    checkToggleState: function () {
        if (this._inputElement.checked) {
            u.addClass(this.element, this._CssClasses.IS_CHECKED);
        } else {
            u.removeClass(this.element, this._CssClasses.IS_CHECKED);
        }
    },


    isChecked: function(){
        //return u.hasClass(this.element,this._CssClasses.IS_CHECKED);
        return this._inputElement.checked
    },

    toggle: function(){
        //return;
        if (this.isChecked()){
            this.uncheck()
        }else{
            this.check();
        }
    },

    disable: function () {
        this._inputElement.disabled = true;
        this._updateClasses();
    },


    enable: function () {
        this._inputElement.disabled = false;
        this._updateClasses();
    },


    check: function () {
        this._inputElement.checked = true;
        this._updateClasses();
    },


    uncheck: function () {
        this._inputElement.checked = false;
        this._updateClasses();
    }


});

u.compMgr.regComp({
    comp: u.Switch,
    compAsString: 'u.Switch',
    css: 'u-switch'
});

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

  init: function(){
    if(u.isIE8 || u.isIE9){
      var img = document.createElement('div');
      img.className="loadingImg";
      this.element.appendChild(img);
    }else{
      for (var i = 1; i <= this._Constant.U_LOADING_LAYER_COUNT; i++) {
        this.createLayer(i);
      }
    }
    u.addClass(this.element, 'is-upgraded');
    
  },

createLayer: function(index) {
  var layer = document.createElement('div');
  u.addClass(layer, this._CssClasses.U_LOADING_LAYER);
  u.addClass(layer, this._CssClasses.U_LOADING_LAYER + '-' + index);

  var leftClipper = document.createElement('div');
  u.addClass(leftClipper, this._CssClasses.U_LOADING_CIRCLE_CLIPPER);
  u.addClass(leftClipper, this._CssClasses.U_LOADING_LEFT);

  var gapPatch = document.createElement('div');
  u.addClass(gapPatch,this._CssClasses.U_LOADING_GAP_PATCH);

  var rightClipper = document.createElement('div');
  u.addClass(rightClipper,this._CssClasses.U_LOADING_CIRCLE_CLIPPER);
  u.addClass(rightClipper,this._CssClasses.U_LOADING_RIGHT)

  var circleOwners = [leftClipper, gapPatch, rightClipper];

  for (var i = 0; i < circleOwners.length; i++) {
    var circle = document.createElement('div');
    u.addClass(circle,this._CssClasses.U_LOADING_CIRCLE);
    circleOwners[i].appendChild(circle);
  }

  layer.appendChild(leftClipper);
  layer.appendChild(gapPatch);
  layer.appendChild(rightClipper);

  this.element.appendChild(layer);
},


stop: function() {
  u.removeClass(this.element,'is-active');
},



start: function() {
  u.addClass(this.element,'is-active');
}


});


u.compMgr.regComp({
  comp: u.Loading,
  compAsString: 'u.Loading',
  css: 'u-loading'
});




u.showLoading = function(op) {
	var htmlStr = '<div class="alert alert-waiting"><i class="fa fa-spinner fa-spin"></i></div>';
	document.body.appendChild(u.makeDOM(htmlStr));
	htmlStr = '<div class="alert-backdrop" role="waiting-backdrop"></div>';
	document.body.appendChild(u.makeDOM(htmlStr));
}

u.hideLoading = function() {
	var divs = document.querySelectorAll('.alert-waiting,.alert-backdrop');
	for(var i = 0;i < divs.length;i++){
		document.body.removeChild(divs[i]);
	}
}	
    
//兼容性保留
u.showWaiting = u.showLoading
u.removeWaiting = u.hideLoading
/*
*加载loading
*/
u.loadTemplate="<div class='u-loader-container'><div class='u-loader'>{centerContent}</div>{loadDesc}</div>";//{centerContent}为加载条中间内容
/**
 * @param  {Object} options 
 * @return {[type]}
 */
u.showLoader=function(options){
	// hasback:是否含有遮罩层，centerContent加载图标中的内容，parEle加载图标的父元素,hasDesc加载条说明
	var hasback,centerContent,template,parEle,templateDom,loadDesc;
	options=options||{};
	hasback=options["hasback"];
	centerContent=options["centerContent"]||'';
	// hasDesc=options["hasDesc"];
	template=u.loadTemplate.replace('{centerContent}',centerContent);
	loadDesc=options["hasDesc"]?"<div class='u-loader-desc'>页面加载中，请稍后。。。</div>":" ";
	
	template=template.replace("{loadDesc}",loadDesc);

	templateDom=u.makeDOM(template);
	parEle=options["parEle"]||document.body;
	if(hasback){
		var overlayDiv = u.makeModal(templateDom,parEle);
	}
	if(parEle==document.body){
		templateDom.style.position='fixed';
	}
	parEle.appendChild(templateDom);
};
u.hideLoader=function(){
	var divs = document.querySelectorAll('.u-overlay,.u-loader-container');
	for(var i = 0;i < divs.length;i++){
		divs[i].parentNode.removeChild(divs[i]);
	}
};
u.Progress = u.BaseComponent.extend({
	_Constant: {},
	_CssClasses: {
		INDETERMINATE_CLASS: 'u-progress__indeterminate'
	},
	setProgress: function(p) {
		
		if (u.hasClass(this.element,this._CssClasses.INDETERMINATE_CLASS)) {
			return;
		}

		this.progressbar_.style.width = p + '%';
		return this;
	},
	setBuffer: function(p) {
		this.bufferbar_.style.width = p + '%';
		this.auxbar_.style.width = (100 - p) + '%';
		return this;
	},

	init: function() {
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

		u.addClass(this.element,'is-upgraded');

		if(u.isIE8 || u.isIE9){

			if (u.hasClass(this.element,this._CssClasses.INDETERMINATE_CLASS)) {
				var p = 0;
				var oThis = this;
				setInterval(function(){
					p += 5;
					p = p % 100;
					oThis.progressbar_.style.width = p + '%';
				},100)
			}
		}
			
	}

});


u.compMgr.regComp({
	comp: u.Progress,
	compAsString: 'u.Progress',
	css: 'u-progress'
})
/**
 * Created by dingrf on 2015-11-18.
 */
'use strict';
// u.messageTemplate ='<div class="u-message"><button type="button" class="u-msg-close u-button floating  mini"><span class="">X</span></button>{msg}</div>';
u.messageTemplate ='<div class="u-message"><span class="u-msg-close fa fa-close"></span>{msg}</div>';
// u.nocloseTemplate ='<div class="u-message">{msg}</div>';

u.showMessage = function(options) {
    var msg,position, width, height, showSeconds,msgType, template;
    if (typeof options === 'string'){
        options = {msg:options};
    }
    msg = options['msg'] || "";
    position = options['position'] || "bottom-right";  //center. top-left, top-center, top-right, bottom-left, bottom-center, bottom-right,
    //TODO 后面改规则：没设宽高时，自适应
    width = options['width'] || "";
    // height = options['height'] || "100px";
     msgType = options['msgType'] || 'info';
    //默认为当用户输入的时间，当用户输入的时间为false并且msgType=='info'时，默认显示时间为2s
    showSeconds = parseInt(options['showSeconds']) || (msgType=='info'?2:0);
   
    template = options['template'] || u.messageTemplate;

    template = template.replace('{msg}', msg);
    var msgDom = u.makeDOM(template);
    u.addClass(msgDom,'u-mes' + msgType);
    msgDom.style.width = width;
   // msgDom.style.height = height;
   // msgDom.style.lineHeight = height;
   if (position == 'bottom-right'){
       msgDom.style.bottom = '10px';
   }
   
   if(position=='center'){
        msgDom.style.bottom = '50%';
        msgDom.style.transform ='translateY(50%)';
   }
    var closeBtn = msgDom.querySelector('.u-msg-close');
    //new u.Button({el:closeBtn});
    u.on(closeBtn, 'click', function(){
        u.removeClass(msgDom,"active")
        setTimeout(function(){
            try{
                document.body.removeChild(msgDom);
            }catch(e){

            }
          
        },500)  
    })
    document.body.appendChild(msgDom);
    
    if (showSeconds > 0 ){
        setTimeout(function(){
            closeBtn.click();
        },showSeconds* 1000)
    }
    setTimeout(function(){
            u.addClass(msgDom,"active")
    },showSeconds* 1)


}


u.showMessageDialog = u.showMessage;
/**
 * Created by dingrf on 2015-11-19.
 */

'use strict';

/**
 * 消息提示框
 * @param options
 */

u.messageDialogTemplate = '<div class="u-msg-dialog">'+
                            '<div class="u-msg-title">'+
                            '<h4>{title}</h4>'+
                            '</div>'+
                            '<div class="u-msg-content">'+
                                '<p>{msg}</p>'+
                            '</div>'+
                            '<div class="u-msg-footer"><button class="u-msg-button u-button primary raised">{btnText}</button></div>'+
                           '</div>';

u.messageDialog = function(options){
    var title,msg, btnText,template;
    if (typeof options === 'string'){
        options = {msg:options};
    }
    msg = options['msg'] || "";
    title = options['title'] || "提示";
    btnText = options['btnText'] || "确定";
    template = options['template'] || u.messageDialogTemplate;

    template = template.replace('{msg}', msg);
    template = template.replace('{title}', title);
    template = template.replace('{btnText}', btnText);

    var msgDom = u.makeDOM(template);

    var closeBtn = msgDom.querySelector('.u-msg-button');
    new u.Button({el:closeBtn});
    u.on(closeBtn, 'click', function(){
        document.body.removeChild(msgDom);
        document.body.removeChild(overlayDiv);
    })
    var overlayDiv = u.makeModal(msgDom);
    document.body.appendChild(msgDom);

    this.resizeFun = function(){
        var cDom = msgDom.querySelector('.u-msg-content');
        if (!cDom) return;
        cDom.style.height = '';
        var wholeHeight = msgDom.offsetHeight;
        var contentHeight = msgDom.scrollHeight;
        if(contentHeight > wholeHeight && cDom)
            cDom.style.height = wholeHeight - (56+46) + 'px';

    }.bind(this);

    this.resizeFun();
    u.on(window,'resize',this.resizeFun);
};



/**
 * Created by dingrf on 2015-11-19.
 */

/**
 * 三按钮确认框（是 否  取消）
 */
u.threeBtnDialog = function(){

}
/**
 * Created by dingrf on 2015-11-19.
 */

'use strict';

/**
 * 提示框
 * @param options
 */

u.dialogTemplate = '<div class="u-msg-dialog" id="{id}" style="{width}{height}">'+
                        '{close}'+
                    '</div>';

var dialogMode = function(options){
    if (typeof options === 'string'){
        options = {content:options};
    }
    var defaultOptions = {
    	id: '',
    	content: '',
    	hasCloseMenu: true,
    	template: u.dialogTemplate,
    	width: '',
    	height: ''
    }
    
    options = u.extend(defaultOptions,options);
    this.id = options['id'];
    this.hasCloseMenu = options['hasCloseMenu'];
    this.content = options['content'];
    this.template = options['template'];
    this.width = options['width'];
    this.height = options['height'];
    this.lazyShow = options['lazyShow'];
    this.create();

    this.resizeFun = function(){
    	var cDom = this.contentDom.querySelector('.u-msg-content');
    	cDom.style.height = '';
    	var wholeHeight = this.templateDom.offsetHeight;
    	var contentHeight = this.contentDom.offsetHeight;
    	if(contentHeight > wholeHeight && cDom)
    		cDom.style.height = wholeHeight - (56+46) + 'px';

    }.bind(this);

    this.resizeFun();
    u.on(window,'resize',this.resizeFun);
}

dialogMode.prototype.create = function(){
	var closeStr = '';
	var oThis = this;
	if(this.hasCloseMenu){
    	var closeStr = '<div class="u-msg-close"> <span aria-hidden="true">&times;</span></div>';
    }
	var templateStr = this.template.replace('{id}', this.id);
    templateStr = templateStr.replace('{close}', closeStr);
    templateStr = templateStr.replace('{width}', this.width ? 'width:' + this.width + ';' : '');
    templateStr = templateStr.replace('{height}', this.height ? 'height:' + this.height + ';' : '');
	
	this.contentDom = document.querySelector(this.content); //
	this.templateDom = u.makeDOM(templateStr); 
	if(this.contentDom){ // msg第一种方式传入选择器，如果可以查找到对应dom节点，则创建整体dialog之后在msg位置添加dom元素
		this.contentDomParent = this.contentDom.parentNode;
		this.contentDom.style.display = 'block';
	}else{ // 如果查找不到对应dom节点，则按照字符串处理，直接将msg拼到template之后创建dialog
		this.contentDom = u.makeDOM('<div><div class="u-msg-content"><p>' + this.content + '</p></div></div>');
	}
	this.templateDom.appendChild(this.contentDom);
	this.overlayDiv = u.makeModal(this.templateDom);
	if(this.hasCloseMenu){
		this.closeDiv = this.templateDom.querySelector('.u-msg-close');
		u.on(this.closeDiv,'click',function(){
			oThis.close();
		});
	}
	if(this.lazyShow) {
        this.templateDom.style.display = 'none';
        this.overlayDiv.style.display = 'none';
    }
    document.body.appendChild(this.templateDom);
    this.isClosed = false;
};

dialogMode.prototype.show = function(){
    if(this.isClosed) {
        this.create();
    }
    this.templateDom.style.display = 'block';
    this.overlayDiv.style.display = 'block';
}

dialogMode.prototype.hide = function(){
    this.templateDom.style.display = 'none';
    this.overlayDiv.style.display = 'none';
}

dialogMode.prototype.close = function(){
	if(this.contentDom){
		this.contentDom.style.display = 'none';
		this.contentDomParent.appendChild(this.contentDom);
	}
	document.body.removeChild(this.templateDom);
    document.body.removeChild(this.overlayDiv);
    this.isClosed = true;
}

u.dialog = function(options){
	return new dialogMode(options);
}

/**
 * 对话框向导
 * @param options:  {dialogs: [{content:".J-goods-pro-add-1-dialog",hasCloseMenu:false},
                               {content:".J-goods-pro-add-2-dialog",hasCloseMenu:false},
                            ]
                    }
 */
u.dialogWizard = function(options) {
    var dialogs = [], curIndex = 0;
    options.dialogs = options.dialogs || [],
    len = options.dialogs.length;
    if(len == 0) {
        throw new Error('未加入对话框');
    }
    for(var i = 0;i < len; i++) {
        dialogs.push(u.dialog(u.extend(options.dialogs[i], {lazyShow: true})));
    }
    var wizard = function() {
    }
    wizard.prototype.show = function() {
        dialogs[curIndex].show();
    }
    wizard.prototype.next = function() {
        dialogs[curIndex].hide();
        dialogs[++curIndex].show();
    }
    wizard.prototype.prev = function() {
        dialogs[curIndex].hide();
        dialogs[--curIndex].show();
    }
    wizard.prototype.close = function() {
        for(var i = 0; i < len; i++) {
            dialogs[i].close();
        }
    }
    return new wizard();
}

u.Combobox = u.BaseComponent.extend({
		DEFAULTS : {
			dataSource:{},
			mutil: false,
			enable: true,
			single: true,
			onSelect: function() {}
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.items = [];
			//this.oLis = [];
			this.mutilPks = [];
			this.oDiv = null;
			Object.defineProperty(element, 'value', {
				get: function() {

					return this.trueValue;
				},
				set: function(pk) {

					var items = self.items;
					//var oLis = self.oLis;
					var oLis = self.oDiv.childNodes;

					if (self.options.single == "true" || self.options.single == true ) {

						for (var i = 0, length = items.length; i < length; i++) {

							var ipk = items[i].pk;
							if (ipk == pk) {
								this.innerHTML = items[i].name;
								this.trueValue = pk;
								break;
							} else {

								this.trueValue = '';
								this.innerHTML = '';
							}

						}

					} else if (self.options.mutil == "true" || self.options.mutil == true) {
						
						if(!u.isArray(pk) ){
							if(typeof pk == "string" && pk !== ""){                   		
								pk = pk.split(',');
								self.mutilPks = pk;
							}else{
								return
							}
						}
						
						if (self.mutilPks.length == 0) {
							self.mutilPks = pk;
						}

						this.innerHTML = '';
						var valueArr = [];

						for (var j = 0; j < pk.length; j++) {

							for (var i = 0, length = oLis.length; i < length; i++) {
								var ipk = oLis[i].item.pk;
								if (pk[j] == ipk) {

									valueArr.push(pk[j]);

									oLis[i].style.display = 'none';
									var activeSelect = document.createElement("Div")
									activeSelect.className = "mutil-select-div"
									var selectName = "<i class='itemName'>" + items[i].name + "</i>"																	
									var imageFont = "<i class='fa fa-close'></i>"
									activeSelect.insertAdjacentHTML("beforeEnd",imageFont+selectName); 
									this.appendChild(activeSelect);
									    
									//activeSelect.append(imageFont);
								//	activeSelect.append(selectName);
								
									u.on(activeSelect.querySelector(".fa-close"),'mousedown', function() {

										//var $this = $(this);
										//var lis = self.oLis;
										//var lis = $(self.oDiv).find('li');
										var lis = self.oDiv.childNodes;
										for (var j = 0, len = lis.length; j < len; j++) {
											if (lis[j].item.name == this.nextSibling.innerHTML) {
												lis[j].style.display = 'block';

												for (var h = 0; h < self.mutilPks.length; h++) {
													if (self.mutilPks[h] == lis[j].item.pk) {
														self.mutilPks.splice(h, 1);
														h--;
													}
												}

												for (var b = 0; b < valueArr.length; b++) {
													if (valueArr[b] == lis[j].item.pk) {
														valueArr.splice(b, 1);
														b--;
													}
												}

											}
										}

										activeSelect.removeChild(this.parentNode);
										element.trueValue = '';
										element.trueValue = valueArr.toString();
										u.trigger(element,'mutilSelect',valueArr.toString())
									});



								//	var selectName = $("<i class='itemName'>" + items[i].name + "</i>");

								//	var activeSelect = $("<div class='mutil-select-div'></div>")

									

									


								}

							}


						}

						this.trueValue = valueArr.toString();
						

					}


				}
			})
			//禁用下拉框
			if(this.options.readonly === "readonly")return;
			
			if (this.options.single == "true" || this.options.single == true) {
				this.singleSelect()
			}

			if (this.options.mutil == "true" || this.options.mutil == true) {
				this.mutilSelect();
			}
			
			this.clickEvent();

			this.blurEvent();
			
			this.comboFilter();
			
			this.comboFilterClean();
		}
	})

	

	u.Combobox.fn = u.Combobox.prototype;

	u.Combobox.fn.createDom = function() {

		var data = this.options.dataSource;
		if (u.isEmptyObject(data)) {
			throw new Error("dataSource为空！");
		}

		var oDiv = document.createElement("div");
		oDiv.className = 'select-list-div';
        //this.oDiv
		this.oDiv = oDiv;
		//新增搜索框
		
        var searchDiv = document.createElement("div");
        searchDiv.className = 'select-search';
		var searchInput =  document.createElement("input");
		searchDiv.appendChild(searchInput);
		oDiv.appendChild(searchDiv);
		//禁用搜索框
		if(this.options.readchange){
			searchDiv.style.display = "none"
		}
		var oUl = document.createElement("ul");

		oUl.className = 'select-list-ul';
	
		for (var i = 0; i < data.length; i++) {
			var item = {
				pk: data[i].pk,
				name: data[i].name
			}
			this.items.push(item)
			var oLi = document.createElement("li");

			oLi.item = item;
			oLi.innerHTML = data[i]['name'];

			//this.oLis.push(oLi);

			oUl.appendChild(oLi);

		}


		oDiv.appendChild(oUl);
		oDiv.style.display = 'none';
		document.body.appendChild(oDiv);

	}

	u.Combobox.fn.focusEvent = function() {
		var self = this;
		u.on(this.element,'click', function(e) {
			if(self.options.readchange == true) return;
			var returnValue = self.show();

			if (returnValue === 1) return;
			// self.show();

			self.floatLayer();

			self.floatLayerEvent();

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}

	//下拉图标的点击事件
	u.Combobox.fn.clickEvent = function() {
		var self = this;		
		//var caret = this.$element.next('.input-group-addon')[0] || this.$element.next(':button')[0];
		var caret = this.element.nextSibling
		u.on(caret,'click',function(e) {
			self.show();
			self.floatLayer();
			self.floatLayerEvent();
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}

	//tab键切换 下拉隐藏	
	u.Combobox.fn.blurEvent = function() {
		var self = this;
        
		u.on(this.element,'keyup', function(e) {
			var key = e.which || e.keyCode;
			if (key == 9)
				self.show();
			
		})
		u.on(this.element,'keydown', function(e) {
			var key = e.which || e.keyCode;
			if(key == 9)
			self.hide();
		});
	}



	u.Combobox.fn.floatLayer = function() {

		if (!document.querySelector(".select-floatDiv")) {

			var oDivTwo = document.createElement("div");
			oDivTwo.className = 'select-floatDiv';
			document.body.appendChild(oDivTwo);
		}

	}

	u.Combobox.fn.floatLayerEvent = function() {
		var self = this;
		u.on(document.querySelector(".select-floatDiv"),"click",function(e) {

			self.hide();
			this.parentNode.removeChild(this);

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
		});


	}

	u.Combobox.fn.show = function() {

		//var oLis = this.oLis;
		var oLis = this.oDiv.querySelector("ul").childNodes;
		var vote = 0;
		for (var i = 0, length = oLis.length; i < length; i++) {

			if (oLis[i].style.display == 'none') {
				vote++;
			}
		}

		if (vote === length) return 1;

		var left = this.element.offsetLeft;
		var top = this.element.offsetTop;

		var selectHeight = this.options.dataSource.length * 30 + 10 + 10;

		var differ = (top + u.getStyle(this.element,"height") + selectHeight) - (window.outerHeight + window.scrollY);
		var oDiv = this.oDiv;

		if (differ > 0) {

			oDiv.style.left = left + 'px';
			oDiv.style.top = top - selectHeight + 'px';

		} else {

			oDiv.style.left = left + 'px';
			oDiv.style.top = top + u.getStyle(this.element,"height") + 'px';

		}

		oDiv.style.display = 'block';
	}

	u.Combobox.fn.hide = function() {
		this.oDiv.style.display = 'none';
	}

	u.Combobox.fn.singleDivValue = function() {
		var self = this;
		//var oLis = this.oLis;
		var oLis = this.oDiv.querySelector("ul").childNodes;
		for (var i = 0; i < oLis.length; i++) {
			
			u.on(oLis[i],"click",function(){
				
				var item = this.item
				self.element.value = item.pk;

				self.oDiv.style.display = 'none';

				self.options.onSelect(item);

				u.trigger(self.element,'change');
				
			})

		}
	}

	u.Combobox.fn.mutilDivValue = function() {
		var self = this;
		//var oLis = this.oLis;
		var oLis = this.oDiv.querySelector("ul").childNodes;
		for (var i = 0; i < oLis.length; i++) {
			u.on(oLis[i],"click",function(){
				
				var pk = this.item.pk;
				var mutilpks = self.mutilPks;
				var mutilLenth = mutilpks.length;

				if (mutilLenth > 0) {

					for (var k = 0; k < mutilLenth; k++) {

						if (pk == mutilpks[k]) {

							mutilpks.splice(k, 1);
                            k--;
						}

					}

				}

				mutilpks.push(pk);

				self.element.value = mutilpks;
                u.trigger(self.element,'mutilSelect',mutilpks.toString());
               // element.trigger('mutilSelect',mutilpks.toString())

				self.oDiv.style.display = 'none';
				this.style.display = 'none';
				u.trigger(self.element,'change');
				
				
				
			})

		}
	}

	u.Combobox.fn.singleSelect = function() {

		this.createDom();
		this.focusEvent();
		this.singleDivValue();

	}

	u.Combobox.fn.mutilSelect = function() {

		this.createDom();
		this.mutilDivValue();
		this.focusEvent();

	}
   //过滤下拉选项
   u.Combobox.fn.comboFilter = function(){
   	 var self = this;
	 u.on(this.oDiv,"keyup",function(){
   	
   	 	 var content = this.querySelector('.select-search input').value
   	 	
   	 	 var oLis = this.oDiv.querySelector("ul").childNodes;
   	 	 for(var i=0;i<oLis.length;i++){
   	 	 	 if(oLis[i].item.name.indexOf(content) != -1){
   	 	 	 	oLis[i].style.display = 'block';
   	 	 	 }else{
   	 	 	 	oLis[i].style.display = 'none';
   	 	 	
   	 	 	 }
   	 	 }
   	 	 
   	 	 
   	 })
   }
   
   //过滤的后续处理
   u.Combobox.fn.comboFilterClean = function(){
   	  var self = this;
	   u.on(self.element,"click",function(){
   	 // $(this.$element).on('click',function(){
   	  	// $(self.oDiv).find('.select-search input').val('')  	
		 self.oDiv.querySelector('.select-search input').value = ""	 
   	  	var oLis = this.oDiv.querySelector("ul").childNodes;
   	  	 if(self.options.single == "true" || self.options.single == true){
   	  	 	for(var i=0;i<oLis.length;i++){
   	  	 	  oLis[i].style.display = 'block'
   	  	   }
   	  	 }else if(self.options.mutil == "true" || self.options.mutil == true ){
   	  	 	 var selectLisIndex = [];
   	  	 	 var selectLisSpan = this.querySelector('.mutil-select-div .itemName');
   	  	 	
   	  	 	 for(var i=0;i<selectLisSpan.length;i++){
   	  	 	 	 for(var k=0;k<oLis.length;k++){
   	  	 	 	 	if(selectLisSpan[i].innerHTML == oLis[k].item.name){
   	  	 	 	 		//oLis[k].style.display = 'none';
   	  	 	 	 		selectLisIndex.push(k)
 	  	 	 	 	}
   	  	 	 	 }
   	  	 	 }
   	  	 	 
   	  	 	for(var l=0; l<oLis.length;l++) {
   	  	 		oLis[l].style.display = 'block'
   	  	 		for(var j=0;j<selectLisIndex.length;j++){
   	  	 	 	if(l == selectLisIndex[j])
   	  	 	 	  oLis[l].style.display = 'none'
   	  	 	   }
   	  	 	}
   	  	 	 
   	  	 	 
   	  	 }
   	  	 
   	  	  
   	  })
   }
	// var Plugin = function(option) {

		// var $this = $(this);
		// var data = $this.data('s.select');
		// var options = typeof option == 'object' && option

		// if (!data) $this.data('s.select', (new Combobox(this, options)))

	// }

    //动态设置li值
	// $.fn.setComboData = function(dataSourse) {
        // var $this = $(this).data('s.select');
        // if(!$this)return;
		// var data = dataSourse;
		// if (!$.isArray(data) || data.length == 0) return;
		
		// $this.items.length = 0;

		// var Olis = $($this.oDiv).find('li');
		
		
	    // if(data.length < Olis.length){
			
			// for(var k=data.length;k<Olis.length;k++){
				   // $(Olis[k]).remove();
			// }		
			
		// }else if(data.length > Olis.length){
			// var liTemplate = Olis[0]
			// var oUl = $($this.oDiv).find('ul')
			// for(var j=0;j<(data.length-Olis.length);j++){
				// $(liTemplate).clone(true).appendTo(oUl)
			// }
		// }
        
        // Olis = $($this.oDiv).find('li');
        
		// for (var i = 0; i < data.length; i++) {
			// var item = {
				// pk: data[i].pk,
				// name: data[i].name
			// }
			// $this.items.push(item)
			// Olis[i].item = item;
			// Olis[i].innerHTML = data[i]['name']
		 // }
		
	// }

	// $.fn.Combobox = Plugin;
	if (u.compMgr)
	
	u.compMgr.regComp({
		comp: u.Combobox,
		compAsString: 'u.Combobox',
		css: 'u-combobox'
	})


u.Multilang = u.BaseComponent.extend({
		DEFAULTS : {
			dataSource:{},			
			onSelect: function() {}
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.multinfo(this.options.multinfo)			
			this.addData(this.options.multidata)
			
		}
	})		
	u.Multilang.fn = u.Multilang.prototype;
	u.Multilang.fn.addData = function(val) {
			var target = this.element , tmparray,target_div = target.parentNode;
			if(typeof(val) == "object"){
				tmparray = val					
			}else{
				tmparray = val.split(",")	
			}		
			target_div.value = tmparray				
			u.each(tmparray,function(i,node){				
				target_div.querySelectorAll(".m_context")[i].innerHTML = node						
			})
			
		};
	u.Multilang.fn.multinfo = function(sort){	
			
			var target = this.element,me= this,tmplabel = "",close_menu=true,tmpfield = "name";
			if(sort.lang_name){
				tmpfield = sort.lang_name
			}
			if (u.isArray(sort)) {											
						
				u.wrap(target,"<div class='multilang_body'><input class='lang_value' contenteditable='true'><span class='fa fa-sort-desc lang_icon'><span class='m_icon'></span></span>")
				u.css(target,"display","none")

				u.each(sort, function(i, node) {
						if(i){
							tmplabel += "<label attr='"+tmpfield+(i+1)+"'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>"
						}else{
							tmplabel += "<label attr='"+tmpfield+"'><span class='m_context'></span><span class='m_icon'>" + node + "</span></label>"	
						}
				})
				var target_div = target.parentNode
				
				target_div.insertAdjacentHTML("beforeEnd","<div class='multilang_menu '>" + tmplabel + "</div>")
				var tmpIconv=target_div.querySelector(".lang_icon"),target_menu = target_div.querySelector(".multilang_menu"),tmpvaluebox = target_div.querySelector(".lang_value");
				u.on(tmpIconv,"click",function(){
					var target_icon = this ;
					target_div.querySelector(".lang_value").focus()
					if(u.css(target_menu,"display") == "block"){
						u.css(target_menu,"display","none")
					}else{
						u.css(target_menu,"display","block")							
					}
				})
				u.on(target_menu,"mouseenter",function(){
						close_menu = false;
				})
				u.on(target_menu,"mouseleave",function(){
						close_menu = true;
				})
						
				u.on(tmpvaluebox,"blur",function(){
						//this//
						//target_box = me.fixtarget(target_input),
					//target_div = target_input.parents(".multilang_body"),
					target = this
					tmpkey = target.className.split(" ")[2],						
					tmptext = target.value;
				
					if(u.hasClass(target,"ready_change")){
						me.changeData(target_div,tmpkey,tmptext);
					}					
					if(close_menu){
						u.css(target_menu,"display","none")
					}
						
				})
				u.on(target_menu,"click","label",function(){
					var target_label = this,
						tmpfield = target_label.getAttribute("attr"),
						tmptext = target_label.querySelector(".m_context").innerHTML,
						tmpicon = target_label.querySelector(".m_icon").cloneNode(true);					
						
					tmpvaluebox.setAttribute("class","ready_change lang_value "+tmpfield)
					tmpvaluebox.value = tmptext
					tmpvaluebox.focus();
					var tmpicom = target_div.querySelector(".lang_icon"),oldicon = target_div.querySelector(".m_icon")
					u.removeClass(tmpicom,"fa-sort-desc")
					tmpicom.replaceChild(tmpicon,oldicon)
				})
				
				
				
			} else {
				console.error('Not object')
			}
		}
	u.Multilang.fn.changeData = function(target_div,field,text){
			var tmpdata  = target_div.value; 										
			    tmplabel = target_div.querySelector("label[attr='"+field+"']");
				tmpcontext = tmplabel.querySelector(".m_context");
			tmpcontext.innerHTML = text
			tmpcontext.value = text
			u.each(target_div.querySelectorAll(".m_context"),function(i,node){
				tmpdata[i] = node.innerHTML
			})
			
			u.trigger(this.element,'change.u.multilang', {newValue:text, field:field})
						
		}
	u.Multilang.fn.getData = function(){
			var target = $(multilang.target).next(".multilang_body")[0], multilang_data = target.value;
			return 	multilang_data;
		}
	if (u.compMgr)
	
	u.compMgr.regComp({
		comp: u.Multilang,
		compAsString: 'u.Multilang',
		css: 'u-multilang'
	})

u.Autocomplete = u.BaseComponent.extend({
	defaults: {
		inputClass: "ac_input",
		resultsClass: "ac_results",
		lineSeparator: "\n",
		cellSeparator: "|",
		minChars: 1,
		delay: 400,
		matchCase: 0,
		matchSubset: 1,
		matchContains: 0,
		cacheLength: 1,
		mustMatch: 0,
		extraParams: {},
		loadingClass: "ac_loading",
		selectFirst: false,
		selectOnly: false,
		maxItemsToShow: -1,
		autoFill: false,
		width: 0,
		source:null,
		select: null,
		multiSelect: false,
		//moreClick:function(){},
	},
	init: function(){
		var self = this;
		this.options = u.extend({}, this.defaults, this.options);
		this.requestIndex = 0;
		this.pending = 0;
		if (this.options.inputClass){
			u.addClass(this.element, this.options.inputClass);
		}
		this._results = document.querySelector('#autocompdiv');
		if (!this._results){
			this._results = u.makeDOM('<div id="autocompdiv"></div>');
			document.body.appendChild(this._results);
		}
		this._results.style.display  = 'none';
		this._results.style.position = 'absolute';
		u.addClass(this._results, this.options.resultsClass);
		if (this.options.width){
			this._results.style.width = this.options.width;
		}
		this.timeout = null;
		this.prev = "";
		this.active = -1;
		this.cache = {};
		this.keyb = false;
		this.hasFocus = false;
		this.lastKeyPressCode = null;
		this._initSource();
		u.on(this.element,'keydown', function(e){
			self.lastKeyPressCode = e.keyCode;
			switch (e.keyCode) {
				case 38: // up
					u.stopEvent(e);
					self.moveSelect(-1);
					break;
				case 40: // down
					u.stopEvent(e);
					self.moveSelect(1);
					break;
				case 9: // tab
				case 13: // return
					if (self.selectCurrent()) {
						// make sure to blur off the current field
						// self.element.blur();
						u.stopEvent(e);
					}
					break;
				default:
					self.active = -1;
					if (self.timeout) clearTimeout(self.timeout);
					self.timeout = setTimeout(function() {
						self.onChange();
					}, self.options.delay);
					break;
			}
		});
		u.on(this.element,'focus', function(){
			self.hasFocus = true;
		});
		u.on(this.element,'blur', function(){
			self.hasFocus = false;
			self.hideResults();
		});
		this.hideResultsNow();
	},
	flushCache: function(){
		this.cache = {};
		this.cache.data = {};
		this.cache.length = 0;
	},
	_initSource: function(){
		var array, url, self = this;
		if ( u.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
//				response( $.ui.autocomplete.filter( array, request.term ) );
				response(self.filterData(request.term, array));
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if (self.xhr) {
					self.xhr.abort();
				}
				self.xhr = u.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response([]);
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},
	_response: function(){
		var self = this;
		var index = ++this.requestIndex;

		return function( content ) {
			if ( index === self.requestIndex ) {
				self.__response( content );
			}

			self.pending--;
			if ( !self.pending ) {
			}
		};
	},
	__response: function(content){
		if ( content )
			this.receiveData2(content);
		this.showResults();
	},
	onChange: function(){
		// ignore if the following keys are pressed: [del] [shift] [capslock]
		if (this.lastKeyPressCode == 46 || (this.lastKeyPressCode > 8 && this.lastKeyPressCode < 32))
			return this._results.style.disply='none';
		if(!this.element.value) return;
		var vs = this.element.value.split(','),
			v = vs[vs.length-1].trim()
		if (v == this.prev) return;
		this.prev = v;
		if (v.length >= this.options.minChars) {
			u.addClass(this.element,this.options.loadingClass);
			this.pending++;
			this.source( { term: v }, this._response() );
		} else {
			u.removeClass(this.element, this.options.loadingClass);
			this._results.style.display='none';
		}
	},
	moveSelect: function(step){
		var lis = this._results.querySelectorAll('li');
		if (!lis) return;

		this.active += step;

		if (this.active < 0) {
			this.active = 0;
		} else if (this.active >= lis.length) {
			this.active = lis.length - 1;
		}
		lis.forEach(function(li){
			u.removeClass(li, 'ac_over');
		});
		u.addClass(lis[this.active], 'ac_over');
	},
	selectCurrent: function () {
		var li =  this._results.querySelector('li.ac_over'); //$("li.ac_over", this.$results[0])[0];
		if (!li) {
			var _li = this._results.querySelectorAll('li'); //$("li", this.$results[0]);
			if (this.options.selectOnly) {
				if (_li.length == 1) li = _li[0];
			} else if (this.options.selectFirst) {
				li = _li[0];
			}
		}
		if (li) {
			this.selectItem(li);
			return true;
		} else {
			return false;
		}
	},
	selectItem: function(li){
		var self = this;
		if (!li) {
			li = document.createElement("li");
			li.selectValue = "";
		}
		var v = li.selectValue ? li.selectValue : li.innerHTML;
		this.lastSelected = v;
		this.prev = v;
		this._results.innerHTML = '';
		if(this.options.multiSelect) {
			
            if ((this.element.value + ',').indexOf(v + ',') != -1)
                return;
            var vs = this.element.value.split(',');
            var lastValue = this.element.value.substring(0, this.element.value.lastIndexOf(','));

            this.element.value = (lastValue ? lastValue + ', ' : lastValue) + v + ', ';
		} else {
			this.element.value = v;		
		}
		
		this.hideResultsNow();

		this.element.focus();
		
		if (this.options.select) setTimeout(function() {
			self.options.select(li._item, self)
		}, 1);
	},
	createSelection: function(start, end){
		// get a reference to the input element
		var field = this.element;
		if (field.createTextRange) {
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end);
			selRange.select();
		} else if (field.setSelectionRange) {
			field.setSelectionRange(start, end);
		} else {
			if (field.selectionStart) {
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	},
	// fills in the input box w/the first match (assumed to be the best match)
	autoFill: function(sValue){
		// if the last user key pressed was backspace, don't autofill
		if (this.lastKeyPressCode != 8) {
			// fill in the value (keep the case the user has typed)
			this.element.value = this.element.value + sValue.substring(this.prev.length);
			// select the portion of the value not typed by the user (so the next character will erase)
			this.createSelection(this.prev.length, sValue.length);
		}
	},
	showResults: function(){
		// get the position of the input field right now (in case the DOM is shifted)
		var pos = findPos(this.element);
		// either use the specified width, or autocalculate based on form element
		var iWidth = (this.options.width > 0) ? this.options.width : this.element.offsetWidth;
		// reposition
		if('100%'===this.options.width){
			this._results.style.top = (pos.y + this.element.offsetHeight) + "px";
			this._results.style.left = pos.x + "px";
			this._results.style.display = 'block';
		}else{
			this._results.style.width = parseInt(iWidth) + "px";
			this._results.style.top = (pos.y + this.element.offsetHeight) + "px";
			this._results.style.left = pos.x + "px";
			this._results.style.display = 'block';
		}
	},
	hideResults: function(){
		var self = this;
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(function() {
			self.hideResultsNow();
		}, 200);
	},
	hideResultsNow: function(){
		if (this.timeout) clearTimeout(this.timeout);
		u.removeClass(this.element, this.options.loadingClass);
		//if (this.$results.is(":visible")) {
		this._results.style.display = 'none';
		//}
		if (this.options.mustMatch) {
			var v = this.element.value;
			if (v != this.lastSelected) {
				this.selectItem(null);
			}
		}
	},
	receiveData:function(q, data){
		if (data) {
			u.removeClass(this.element,this.options.loadingClass);
			this._results.innerHTML = '';

			if (!this.hasFocus || data.length == 0) return this.hideResultsNow();

			this._results.appendChild(this.dataToDom(data));
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
			if (this.options.autoFill && (this.element.value.toLowerCase() == q.toLowerCase())) this.autoFill(data[0][0]);
			this.showResults();
		} else {
			this.hideResultsNow();
		}
	},
	filterData: function(v, items){
		if (!v) return items;
		var _items = [];
		for (var i =0, count = items.length; i< count; i++){
			var label = items[i].label;
			if (label.indexOf(v) > -1)
				_items.push(items[i]);
		}
		return _items;
	},
	receiveData2: function(items){
		if (items) {
			u.removeClass(this.element, this.options.loadingClass);
			this._results.innerHTML = '';

			// if the field no longer has focus or if there are no matches, do not display the drop down
			if (!this.hasFocus || items.length == 0) return this.hideResultsNow();

			this._results.appendChild(this.dataToDom2(items));
			this.showResults();
		} else {
			this.hideResultsNow();
		}
	},
	dataToDom2: function(items){
		var ul = document.createElement("ul");
		var num = items.length;
		var me = this;
		var showMoreMenu = false;

		// limited results to a max number
		if ((this.options.maxItemsToShow > 0) && (this.options.maxItemsToShow < num)){
			num = this.options.maxItemsToShow;
			if(this.options.moreMenuClick){
				showMoreMenu = true;
			}	
		} 

		for (var i = 0; i < num; i++) {
			var item = items[i];
			if (!item) continue;
			var li = document.createElement("li");
			if (this.options.formatItem)
				li.innerHTML = this.options.formatItem(item, i, num);
			else
				li.innerHTML = item.label;
			li.selectValue = item.label;
			li._item = item;
			ul.appendChild(li);
			u.on(li, 'mouseenter', function(){
				var _li = ul.querySelector('li.ac_over');
				if (_li)
					u.removeClass(_li, 'ac_over');;
				u.addClass(this,"ac_over");
				me.active = indexOf(ul.querySelectorAll('li'), this);
			});
			u.on(li,'mouseleave', function(){
				u.removeClass(this, "ac_over");
			});
			u.on(li, 'mousedown', function(e){
				u.stopEvent(e);
				me.selectItem(this);
			});
		}
		if(showMoreMenu){
			var li = document.createElement("li");
			li.innerHTML = '更多';
			ul.appendChild(li);
			u.on(li, 'mouseenter', function(){
				var _li = ul.querySelector('li.ac_over');
				if (_li)
					u.removeClass(_li, 'ac_over');;
				u.addClass(this,"ac_over");
			});
			u.on(li,'mouseleave', function(){
				u.removeClass(this, "ac_over");
			});
			u.on(li, 'mousedown', function(e){
				u.stopEvent(e);
				me.options.moreMenuClick.call(me);
			});
		}
		return ul;
	},
	parseData: function(){
		if (!data) return null;
		var parsed = [];
		var rows = data.split(this.options.lineSeparator);
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row) {
				parsed[parsed.length] = row.split(this.options.cellSeparator);
			}
		}
		return parsed;
	},
	dataToDom: function(data){
		var ul = document.createElement("ul");
		var num = data.length;
		var self = this;
		var showMoreMenu = false;

		// limited results to a max number
		if ((this.options.maxItemsToShow > 0) && (this.options.maxItemsToShow < num)){
			num = this.options.maxItemsToShow;
			if(this.options.moreMenuClick){
				showMoreMenu = true;
			}	
		} 

		for (var i = 0; i < num; i++) {
			var row = data[i];
			if (!row) continue;
			var li = document.createElement("li");
			if (this.options.formatItem) {
				li.innerHTML = this.options.formatItem(row, i, num);
				li.selectValue = row[0];
			} else {
				li.innerHTML = row[0];
				li.selectValue = row[0];
			}
			var extra = null;
			if (row.length > 1) {
				extra = [];
				for (var j = 1; j < row.length; j++) {
					extra[extra.length] = row[j];
				}
			}
			li.extra = extra;
			ul.appendChild(li);
			u.on(li, 'mouseenter', function(){
				var _li = ul.querySelector('li.ac_over');
				if (_li)
					u.removeClass(_li, 'ac_over');;
				u.addClass(this,"ac_over");
				self.active = indexOf(ul.querySelectorAll('li'), this);
			});
			u.on(li,'mouseleave', function(){
				u.removeClass(this, "ac_over");
			});
			u.on(li, 'mousedown', function(){
				u.stopEvent(e);
				self.selectItem(this);
			});
		}
		if(showMoreMenu){
			var li = document.createElement("li");
			li.innerHTML = '更多';
			ul.appendChild(li);
			u.on(li, 'mouseenter', function(){
				var _li = ul.querySelector('li.ac_over');
				if (_li)
					u.removeClass(_li, 'ac_over');;
				u.addClass(this,"ac_over");
			});
			u.on(li,'mouseleave', function(){
				u.removeClass(this, "ac_over");
			});
			u.on(li, 'mousedown', function(e){
				u.stopEvent(e);
				self.options.moreMenuClick.call(self);
			});
		}
		return ul;
	},
	requestData: function(){
		var self = this;
		if (!this.options.matchCase) q = q.toLowerCase();
		var data = this.options.cacheLength ? this.loadFromCache(q) : null;
		// recieve the cached data
		if (data) {
			this.receiveData(q, data);
			// if an AJAX url has been supplied, try loading the data now
		} else if ((typeof this.options.url == "string") && (this.options.url.length > 0)) {
			u.ajax({
				url:this.makeUrl(q),
				success: function(data){
					data = self.parseData(data);
					self.addToCache(q, data);
					self.receiveData(q, data);
				}
			})
			// if there's been no data found, remove the loading class
		} else {
			u.removeClass(this.element,this.options.loadingClass);
		}
	},
	makeUrl: function(q){
		var url = this.options.url + "?q=" + encodeURI(q);
		for (var i in this.options.extraParams) {
			url += "&" + i + "=" + encodeURI(this.options.extraParams[i]);
		}
		return url;
	},
	loadFromCache: function(){
		if (!q) return null;
		if (this.cache.data[q]) return this.cache.data[q];
		if (this.options.matchSubset) {
			for (var i = q.length - 1; i >= this.options.minChars; i--) {
				var qs = q.substr(0, i);
				var c = this.cache.data[qs];
				if (c) {
					var csub = [];
					for (var j = 0; j < c.length; j++) {
						var x = c[j];
						var x0 = x[0];
						if (this.matchSubset(x0, q)) {
							csub[csub.length] = x;
						}
					}
					return csub;
				}
			}
		}
		return null;
	},
	matchSubset: function(s, sub){
		if (!this.options.matchCase) s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (i == -1) return false;
		return i == 0 || this.options.matchContains;
	},
	addToCache: function(q, data){
		if (!data || !q || !this.options.cacheLength) return;
		if (!this.cache.length || this.cache.length > this.options.cacheLength) {
			this.flushCache();
			this.cache.length++;
		} else if (!this.cache[q]) {
			this.cache.length++;
		}
		this.cache.data[q] = data;
	}
});


	function findPos(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {
			x: curleft,
			y: curtop
		};
	}

	function indexOf(element, e) {
		for (var i = 0; i < element.length; i++) {
			if (element[i] == e) return i;
		}
		return -1;
	};


u.compMgr.regComp({
	comp: u.Autocomplete,
	compAsString: 'u.Autocomplete',
	css: 'u-autocomplete'
});




/**
 * Created by dingrf on 2015-11-20.
 */

u.Combo = u.BaseComponent.extend({
    init: function () {
        this.mutilSelect = this.options['mutilSelect'] || false;
        if (u.hasClass(this.element, 'mutil-select')){
            this.mutilSelect = true
        }

        this.onlySelect = this.options['onlySelect'] || false;
        if(this.mutilSelect)
            this.onlySelect = true;

        this.comboDatas = [];
        var i, option, datas = [], self = this;
        //u.addClass(this.element, 'u-text')
        new u.Text(this.element);
        var options = this.element.getElementsByTagName('option'); 
        for (i = 0; i < options.length; i++) {
            option = options[i];
            datas.push({value: option.value, name: option.text});
        }

        this.setComboData(datas);
        this._input = this.element.querySelector("input");
        if(this.onlySelect || u.isMobile){
            setTimeout(function(){
                self._input.setAttribute('readonly','readonly');
            },1000);
            
        }else{
            u.on(this._input, 'blur', function(e){
                var v = this.value;
                /*校验数值是否存在于datasource的name中*/
                for(var i = 0; i< self.comboDatas.length;i++){
                    if(v == self.comboDatas[i].name){
                        v = self.comboDatas[i].value;
                        break;
                    }
                    
                }
                self.setValue(v);
            })
        }
        this._combo_name_par=this.element.querySelector(".u-combo-name-par");
        u.on(this._input, 'focus', function (e) {
            self._inputFocus = true;
            self.show(e);
            u.stopEvent(e);
        })
        u.on(this._input, 'blur', function(e){
            self._inputFocus = false;
        })

        u.on(this.input, 'keydown',function(e){
            var keyCode = e.keyCode;
            if( e.keyCode == 13){// 回车
                this.blur();
            }
        });
        this.iconBtn = this.element.querySelector("[data-role='combo-button']");
        if (this.iconBtn){
            u.on(this.iconBtn, 'click', function(e){
                self._input.focus();
                u.stopEvent(e);
            })
        }
    },

    show: function (evt) {
        var self = this,width=this.element.offsetWidth;
        u.showPanelByEle({
            ele:this._input,
            panel:this._ul,
            position:"bottomLeft"
        });
        document.body.onscroll = function(){
            u.showPanelByEle({
                ele:self._input,
                panel:self._ul,
                position:"bottomLeft"
            });
        }  
	    this._ul.style.width = width + 'px';
        u.addClass(this._ul, 'is-animating');
        this._ul.style.zIndex = u.getZIndex();
        u.addClass(this._ul, 'is-visible');

        var callback = function (e) {
            if(e === evt || e.target === this._input || self._inputFocus == true) return;
            if(this.mutilSelect && (u.closest(e.target,'u-combo-ul') === self._ul || u.closest(e.target, 'u-combo-name-par') || u.closest(e.target, 'u-combo-name')) ) return;
            u.off(document,'click',callback);
            // document.removeEventListener('click', callback);
            this.hide();
        }.bind(this);
        u.on(document,'click',callback);
        u.on(document.body,'touchend',callback)
        // document.addEventListener('click', callback);

    },

    hide: function () {
        u.removeClass(this._ul, 'is-visible');
        this._ul.style.zIndex = -1;
        this.trigger('select', {value: this.value});
    },

    /**
     * 设置下拉数据
     * @param datas  数据项
     * @param options  指定name value对应字段 可以为空
     */
    setComboData: function (datas, options) {
        var i, li, self = this;
        if (!options)
            this.comboDatas = datas;
        else{
            this.comboDatas = []
            for(var i = 0; i< datas.length; i++){
                this.comboDatas.push({name:datas[i][options.name],value:datas[i][options.value]});
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
            li = u.makeDOM('<li class="u-combo-li">' + this.comboDatas[i].name + '</li>');//document.createElement('li');
            li._index = i;
            u.on(li, 'click', function () {
                self.selectItem(this._index);
            })
            // 不再提供点击特效
            // var rippleContainer = document.createElement('span');
            // u.addClass(rippleContainer, 'u-ripple');
            // li.appendChild(rippleContainer);
            // new URipple(li)
            this._ul.appendChild(li);
        }
    },

    selectItem: function (index) {
        var self = this;
        
        if (this.mutilSelect){
            var val = this.comboDatas[index].value;
            var name = this.comboDatas[index].name;
            var index = (this.value + ',').indexOf(val + ',');
            var l = val.length + 1;
            var flag;
            if (index != -1){ // 已经选中
                this.value = this.value.substring(0,index) + this.value.substring(index + l)  
                flag = '-' 
            }else{
                this.value = (!this.value) ? val + ',' : this.value + val + ',';
                flag = '+'
            }
            
            if(flag == '+'){
                var nameDiv= u.makeDOM('<div class="u-combo-name" key="' + val + '">'+ name + /*<a href="javascript:void(0)" class="remove">x</a>*/'</div>');
                var parNameDiv=u.makeDOM('<div class="u-combo-name-par" style="position:absolute"></div>');
                /*var _a = nameDiv.querySelector('a');
                u.on(_a, 'click', function(){
                    var values = self.value.split(',');
                    values.splice(values.indexOf(val),1);
                    self.value = values.join(',');
                    self._combo_name_par.removeChild(nameDiv);
                    self._updateItemSelect();
                    self.trigger('select', {value: self.value, name: name});
                });*/
                if(!this._combo_name_par){
                    this._input.parentNode.insertBefore(parNameDiv, this._input);
                    this._combo_name_par=parNameDiv;
                }
                this._combo_name_par.appendChild(nameDiv);
            }else{
                if(this._combo_name_par){
                    var comboDiv = this._combo_name_par.querySelector('[key="'+val+'"]');
                    if(comboDiv)
                        this._combo_name_par.removeChild(comboDiv);
                }
            }
            

            this._updateItemSelect();

            // this.trigger('select', {value: this.value, name: name});
        }else{
            this.value = this.comboDatas[index].value;
            this._input.value = this.comboDatas[index].name;
            this._updateItemSelect();
            // this.trigger('select', {value: this.value, name: this._input.value});
        }

        
    },

    _updateItemSelect: function() {
        var lis = this._ul.querySelectorAll('.u-combo-li')
        if (this.mutilSelect){
            var values = this.value.split(',');
            for(var i=0;i<lis.length;i++) {
                if(values.indexOf(this.comboDatas[i].value) > -1) {
                    u.addClass(lis[i], 'is-selected');
                } else {
                    u.removeClass(lis[i], 'is-selected');
                }
            }
            /*根据多选区域div的高度调整input的高度*/
            var h = this._combo_name_par.offsetHeight;
            if(h < 25)
                h = 25
            this._input.style.height = h + 'px';
        } else {
            for(var i=0;i<lis.length;i++) {
                if(this.value == this.comboDatas[i].value) {
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
    setValue: function(value){
        var self = this;
        value = value + '';
    	value = value || '';
    	
        var values = value.split(',');
        if (this.mutilSelect === true) {
            if(self._combo_name_par)
                self._combo_name_par.innerHTML = '';
            this.value = '';
        }
        if(!value) {
            this._input.value = '';
            this.value = '';
        }
        var matched = false;
        this.comboDatas.forEach(function(item, index){
            if (this.mutilSelect === true){
                if (values.indexOf(item.value) != -1){
                    this.selectItem(index)
                }
            }else {
                if (item.value === value) {
                    this.selectItem(index);
                    matched = true;
                    return;
                }
            }
        }.bind(this));
        if(!this.onlySelect && !matched){
            this.value = value;
            this._input.value = value;
            this.trigger('select', {value: this.value, name: this._input.value});
        }
    },

    /**
     * 设置显示名
     * @param name
     */
    setName: function(name){
        this.comboDatas.forEach(function(item, index){
            if(item.name === name){
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
})
u.Table = u.BaseComponent.extend({
    _CssClasses: {

        SELECTABLE: 'selectable',
        SELECT_ELEMENT: 'u-table-select',
        IS_SELECTED: 'is-selected',
        IS_UPGRADED: 'is-upgraded'
    },

    init: function(){
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
    _selectRow: function(checkbox, row, opt_rows){
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
    _createCheckbox: function(row, opt_rows){
        var label = document.createElement('label');
        var labelClasses = [
            'u-checkbox',
            this._CssClasses.SELECT_ELEMENT
        ];
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



if (u.compMgr)
    u.compMgr.regComp({
        comp: u.Table,
        compAsString: 'u.Table',
        css: 'u-table'
    })
	u.pagination = u.BaseComponent.extend({

	})

	var PageProxy = function(options, page) {
		this.isCurrent = function() {
			return page == options.currentPage;
		}

		this.isFirst = function() {
			return page == 1;
		}

		this.isLast = function() {
			return page == options.totalPages;
		}

		this.isPrev = function() {
			return page == (options.currentPage - 1);
		}

		this.isNext = function() {
			return page == (options.currentPage + 1);
		}

		this.isLeftOuter = function() {
			return page <= options.outerWindow;
		}


		this.isRightOuter = function() {
			return (options.totalPages - page) < options.outerWindow;
		}

		this.isInsideWindow = function() {
			if (options.currentPage < options.innerWindow + 1) {
				return page <= ((options.innerWindow * 2) + 1);
			} else if (options.currentPage > (options.totalPages - options.innerWindow)) {
				return (options.totalPages - page) <= (options.innerWindow * 2);
			} else {
				return Math.abs(options.currentPage - page) <= options.innerWindow;
			}
		}

		this.number = function() {
			return page;
		}
		this.pageSize = function() {
			return options.pageSize;

		}
	}

	var View = {
		firstPage: function(pagin, options, currentPageProxy) {
			return '<li role="first"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a >' + options.first + '</a></li>';
		},

		prevPage: function(pagin, options, currentPageProxy) {
			return '<li role="prev"' + (currentPageProxy.isFirst() ? 'class="disabled"' : '') + '><a  rel="prev">' + options.prev + '</a></li>';
		},

		nextPage: function(pagin, options, currentPageProxy) {
			return '<li role="next"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a  rel="next">' + options.next + '</a></li>';
		},

		lastPage: function(pagin, options, currentPageProxy) {

			return '<li role="last"' + (currentPageProxy.isLast() ? 'class="disabled"' : '') + '><a >' + options.last + '</a></li>';
		},

		gap: function(pagin, options) {
			return '<li role="gap" class="disabled"><a href="#">' + options.gap + '</a></li>';
		},

		page: function(pagin, options, pageProxy) {
			return '<li role="page"' + (pageProxy.isCurrent() ? 'class="active"' : '') + '><a ' + (pageProxy.isNext() ? ' rel="next"' : '') + (pageProxy.isPrev() ? 'rel="prev"' : '') + '>' + pageProxy.number() + '</a></li>';
		}

	}


	//u.pagination.prototype.compType = 'u.pagination';
	u.pagination.prototype.init = function(element, options) {
		var self = this;
		var element = this.element;
		this.$element = element;
		this.options = u.extend({}, this.DEFAULTS, this.options);
		this.$ul = this.$element; //.find("ul");
		this.render();
	}

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
		showState: true,
		page: function(page) {
			return true;
		}
	}

	u.pagination.prototype.update = function(options) {
		this.$ul.innerHTML="";
		this.options = u.extend({}, this.options, options);
		this.render();
	}
	u.pagination.prototype.render = function() {
		var a = (new Date()).valueOf()

		var options = this.options;

		if (!options.totalPages) {
			this.$element.style.display = "none";
			return;
		} else {
			this.$element.style.display = "block";
		}

		var htmlArr = []
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
            for (var i = 1; i <= current ; i++) {
				pageProxy = new PageProxy(options, i);
                htmlArr.push(View.page(this, options, pageProxy));
            }

            fix = windows - (current - 1) < 0 ? 0 : windows - (current - 1);

            if (total - current - fix <= windows + 1) {
                for (var i = current + 1; i <= total ; i++) {
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

                for (var i = current - windows - fix; i <= total ; i++) {
					pageProxy = new PageProxy(options, i);
	                htmlArr.push(View.page(this, options, pageProxy));
                }
                if(i >= 2) {
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
		if(options.showState){
			var htmlStr = '<div class="pagination-state">' + options.totalText + '&nbsp;' + options.totalCount + '&nbsp;条</div>';
			htmlArr.push(htmlStr);

			if (options.jumppage || options.pageSize) {

				var pageOption = '';
				options.pageList.forEach(function (item) {
					if (options.pageSize - 0 == item) {
						pageOption += '<option selected>' + item + '</option>'
					} else {
						pageOption += '<option>' + item + '</option>'
					}
				});
				var jumppagehtml = '到<input class="page_j" value=' + options.currentPage + '>页<input class="pagination-jump" type="button" value="确定"/>';
				var sizehtml = '显示<select  class="page_z">'+ pageOption + '</select>条&nbsp;&nbsp;'
				var tmpjump = "<div class='pagination-state'>" + (options.pageSize ? sizehtml : "") + (options.jumppage ? jumppagehtml : "") + "</div>";
				htmlArr.push(tmpjump)
				//<i class='jump_page fa fa-arrow-circle-right' style='margin-left: 8px; cursor: pointer;'></i>
			}
		}
		
		this.$ul.innerHTML="";
		this.$ul.insertAdjacentHTML('beforeEnd', htmlArr.join(''))

		var me = this;
		u.on(this.$ul.querySelector(".pagination-jump"),"click", function() {
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
		})

		u.on(this.$ul.querySelector('[role="first"] a'),'click', function() {
			if (options.currentPage <= 1) return;
			me.firstPage();
			//me.$element.trigger('pageChange', 0)
			return false;
		})
		u.on(this.$ul.querySelector('[role="prev"] a'),'click', function() {
			if (options.currentPage <= 1) return;
			me.prevPage();
			//me.$element.trigger('pageChange', options.currentPage - 1)
			return false;
		})
		u.on(this.$ul.querySelector('[role="next"] a'),'click', function() {
			if (parseInt(options.currentPage) + 1 > options.totalPages) return;
			me.nextPage();
			//me.$element.trigger('pageChange', parseInt(options.currentPage) + 1)
			return false;
		})
		u.on(this.$ul.querySelector('[role="last"] a'),'click', function() {
			if (options.currentPage == options.totalPages) return;
			me.lastPage();
			//me.$element.trigger('pageChange', options.totalPages - 1)
			return false;
		})
		u.each(this.$ul.querySelectorAll('[role="page"] a'),function(i,node){
			u.on(node,'click', function() {
				var pz = (me.$element.querySelector(".page_z")&&me.$element.querySelector(".page_z").value) || options.pageSize;
				me.page(parseInt(this.innerHTML), options.totalPages, pz);
				//me.$element.trigger('pageChange', parseInt($(this).html()) - 1)

				return false;
			})
		})
		u.on(this.$ul.querySelector('.page_z'), 'change', function() {
			var pz = (me.$element.querySelector(".page_z")&&me.$element.querySelector(".page_z").value)  || options.pageSize;
			me.trigger('sizeChange', pz)
		})

	}


	u.pagination.prototype.page = function(pageIndex, totalPages, pageSize) {

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
			if(pageIndex <0){
				pageIndex=0;
			}

			if(pageIndex>totalPages){
				pageIndex=totalPages;
			}
			this.$ul.innerHTML="";
			options.pageSize = pageSize;
			options.currentPage = pageIndex;
			options.totalPages = totalPages;
			this.render();

		}
		if (pageSize != oldPageSize){
			this.trigger('sizeChange', [pageSize, pageIndex - 1])
		}else{
			this.trigger('pageChange', pageIndex - 1)
		}


		//this.$element.trigger('pageChange', pageIndex)

		return false;
	}

	u.pagination.prototype.firstPage = function() {
		return this.page(1);
	}

	u.pagination.prototype.lastPage = function() {
		return this.page(this.options.totalPages);
	}

	u.pagination.prototype.nextPage = function() {
		return this.page(parseInt(this.options.currentPage) + 1);
	}

	u.pagination.prototype.prevPage = function() {
		return this.page(this.options.currentPage - 1);
	}

	u.pagination.prototype.disableChangeSize = function(){
		this.$element.querySelector('.page_z').setAttribute('readonly', true);
	}

	u.pagination.prototype.enableChangeSize = function(){
		this.$element.querySelector('.page_z').removeAttribute('readonly');
	}


	function Plugin(option) {
		return this.each(function() {
			var $this = $(this)
			var data = $this.data('u.pagination')
			var options = typeof option == 'object' && option

			if (!data) $this.data('u.pagination', (data = new Pagination(this, options)))
			else data.update(options);
		})
	}


	// var old = $.fn.pagination;

	// $.fn.pagination = Plugin
	// $.fn.pagination.Constructor = Pagination

	if (u.compMgr)

	u.compMgr.regComp({
		comp: u.pagination,
		compAsString: 'u.pagination',
		css: 'u-pagination'
	})

u.Tooltip = function(element,options){
	this.init(element,options)
	//this.show()
}


u.Tooltip.prototype = {
    defaults:{
        animation: true,
        placement: 'top',
        //selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow" ></div><div class="tooltip-inner"></div></div>',
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
    init: function (element,options) {
		this.element = element
        this.options = u.extend({}, this.defaults, options);
        this._viewport = this.options.viewport && document.querySelector(this.options.viewport.selector || this.options.viewport);

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]
            if (trigger == 'click') {
                u.on(this.element, 'click', this.toggle.bind(this));
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'
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
            }
        };
        //tip模板对应的dom
        this.tipDom = u.makeDOM(this.options.template);
        u.addClass(this.tipDom,this.options.placement);
        if(this.options.colorLevel){
             u.addClass(this.tipDom,this.options.colorLevel);
         }
        this.arrrow = this.tipDom.querySelector('.tooltip-arrow');

        // tip容器,默认为当前元素的parent
        this.container = this.options.container ? document.querySelector(this.options.container) : this.element.parentNode;
    },
    enter: function(){
        var self = this;
        clearTimeout(this.timeout);
        this.hoverState = 'in';
        if (!this.options.delay || !this.options.delay.show) return this.show();

        this.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, this.options.delay.show)
    },
    leave: function(){
        var self = this;
        clearTimeout(this.timeout);
        self.hoverState = 'out'
        if (!self.options.delay || !self.options.delay.hide) return self.hide()
        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    },
    show: function(){
        var self = this;
        this.tipDom.querySelector('.tooltip-inner').innerHTML = this.options.title;
        this.tipDom.style.zIndex = u.getZIndex();
        this.container.appendChild(this.tipDom);
        /*var placement = this.options.placement;
        var pos = this.getPosition()
        var actualWidth = this.tipDom.offsetWidth
        var actualHeight = this.tipDom.offsetHeight
        var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

        this.applyPlacement(calculatedOffset, placement)*/
        u.addClass(this.tipDom,'active');
        u.showPanelByEle({
            ele:this.element,
            panel:this.tipDom,
            position:this.options.placement
        });
        document.body.onscroll = function(){
            u.showPanelByEle({
                ele:self.element,
                panel:self.tipDom,
                position:self.options.placement
            });
        }
    },
    hide: function(){
		if (this.container.contains(this.tipDom)){
			u.removeClass(this.tipDom, 'active');
			this.container.removeChild(this.tipDom);
		}
    },
    applyPlacement: function(offset, placement){
        var width = this.tipDom.offsetWidth
        var height = this.tipDom.offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt(this.tipDom.style.marginTop, 10)
        var marginLeft = parseInt(this.tipDom.style.marginTop, 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top = offset.top + marginTop
        offset.left = offset.left + marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        this.tipDom.style.left = offset.left + 'px';
        this.tipDom.style.top = offset.top + 'px';

        u.addClass(this.tipDom,'active');

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = this.tipDom.offsetWidth
        var actualHeight =this.tipDom.offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical = /top|bottom/.test(placement)
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        //$tip.offset(offset)
        this.tipDom.style.left = offset.left + 'px';
        this.tipDom.style.top = offset.top - 4 + 'px';

       // this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)

    },
    getCalculatedOffset: function(placement, pos, actualWidth, actualHeight){
        return placement == 'bottom' ? {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2} :
            placement == 'top' ? {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2} :
                placement == 'left' ? {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth} :
                    /* placement == 'right' */ {
                    top: pos.top + pos.height / 2 - actualHeight / 2,
                    left: pos.left + pos.width
                }
    },
    getPosition: function(el){
        el = el || this.element;
        var isBody = el.tagName == 'BODY';
        var elRect = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = u.extend({}, elRect, {width: elRect.right - elRect.left, height: elRect.bottom - elRect.top})
        }
        var elOffset = isBody ? {top: 0, left: 0} : {top:el.offsetTop, left: el.offsetLeft};
        var scroll = {scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : el.scrollTop}
        var outerDims = isBody ? {width: window.innerWidth || document.body.clientWidth, height: window.innerHeight || document.body.clientHeight} : null
		//return u.extend({}, elRect, scroll, outerDims, elOffset)
        return u.extend({}, elRect, scroll, outerDims)

    },
    getViewportAdjustedDelta: function(placement, pos, actualWidth, actualHeight){
        var delta = {top: 0, left: 0}
        if (!this._viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this._viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    },
    replaceArrow: function(delta, dimension, isHorizontal){
        if (isHorizontal){
            this.arrow.style.left = 50 * (1 - delta / dimension) + '%';
            this.arrow.style.top = '';
        }else{
            this.arrow.style.top = 50 * (1 - delta / dimension) + '%';
            this.arrow.style.left = '';
        }
    },
    destory: function(){

    },
    setTitle :function(title){
        this.options.title = title;
    }

};
	u.Validate = u.BaseComponent.extend({
		
		init : function() {
			var self = this
			this.$element =this.element			
			this.$form = this.form
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.required = false
			this.timeout = null;
			this.tipAliveTime = this.options['tipAliveTime'] === undefined ?  3000 : this.options['tipAliveTime'];
			//所有属性优先级 ：  options参数  > attr属性  > 默认值
			this.required = this.options['required']  ? this.options['required']  : false
			this.validType = this.options['validType'] ? this.options['validType'] : null
			//校验模式  blur  submit
			this.validMode = this.options['validMode'] ? this.options['validMode'] : u.Validate.DEFAULTS.validMode
			//空提示
			this.nullMsg = this.options['nullMsg'] ? this.options['nullMsg'] : u.Validate.NULLMSG[this.validType]
			//是否必填
			if (this.required && !this.nullMsg)
				this.nullMsg = u.Validate.NULLMSG['required']
			//错误必填
			this.errorMsg = this.options['errorMsg'] ? this.options['errorMsg'] : u.Validate.ERRORMSG[this.validType]
			//正则校验
			this.regExp = this.options['reg'] ? this.options['reg']: u.Validate.REG[this.validType]
			try{
				if(typeof this.regExp == 'string')
					this.regExp = eval(this.regExp)
			}catch(e){

			}
			
			this.notipFlag=this.options['notipFlag'];// 错误信息提示方式是否为tip，默认为true
			this.hasSuccess=this.options['hasSuccess'];//是否含有正确提示
			
			//提示div的id 为空时使用tooltop来提示
			this.tipId = this.options['tipId'] ? this.options['tipId'] : null
			//校验成功提示信息的div
			this.successId=this.options['successId'] ? this.options['successId'] : null;
			
			// 要求显示成功提示，并没有成功提示dom的id时，则创建成功提示dom
			if(this.hasSuccess&&!this.successId){
				this.successId=u.makeDOM('<span class="u-form-control-success fa fa-check-circle" ></span>');
				
				if(this.$element.nextSibling){
					this.$element.parentNode.insertBefore(this.successId,this.$element.nextSibling);
				}else{
					this.$element.parentNode.appendChild(this.successId);
				}

			}
			//不是默认的tip提示方式并且tipId没有定义时创建默认tipid	
			if(this.notipFlag&&!this.tipId){
				this.tipId=u.makeDOM('<span class="u-form-control-info fa fa-exclamation-circle "></span>');
				this.$element.parentNode.appendChild(this.tipId);

				if(this.$element.nextSibling){
					this.$element.parentNode.insertBefore(this.tipId,this.$element.nextSibling);
				}else{
					this.$element.parentNode.appendChild(this.tipId);
				}
			}
			//提示框位置
			this.placement = this.options['placement'] ? this.options['placement'] : u.Validate.DEFAULTS.placement
			//
			this.minLength = this.options['minLength'] > 0 ? this.options['minLength'] : null
			this.maxLength = this.options['maxLength'] > 0 ? this.options['maxLength'] : null
			this.min = this.options['min'] !== undefined  ? this.options['min'] : null
			this.max = this.options['max'] !== undefined ? this.options['max'] : null
			this.minNotEq = this.options['minNotEq'] !== undefined ? this.options['minNotEq'] : null
			this.maxNotEq = this.options['maxNotEq'] !== undefined ? this.options['maxNotEq'] : null
			this.min = u.isNumber(this.min) ? this.min : null
			this.max = u.isNumber(this.max) ? this.max : null
			this.minNotEq = u.isNumber(this.minNotEq) ? this.minNotEq : null
			this.maxNotEq = u.isNumber(this.maxNotEq) ? this.maxNotEq : null
			this.create()
		}
	});
		
	
	

	
	u.Validate.fn = u.Validate.prototype
	//u.Validate.tipTemplate = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow tooltip-arrow-c"></div><div class="tooltip-arrow"></div><div class="tooltip-inner" style="color:#ed7103;border:1px solid #ed7103;background-color:#fff7f0;"></div></div>'
	
	u.Validate.DEFAULTS = {
			validMode: 'blur',
			placement: "top"
		}
	
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

	}

	u.Validate.ERRORMSG = {
		"integer": trans('validate.error_integer', "整数格式不对！"),
		"float": trans('validate.error_float', "数字格式不对！"),
		"zipCode": trans('validate.error_zipCode', "邮政编码格式不对！"),
		"phone": trans('validate.error_phone', "手机号码格式不对！"),
		"landline": trans('validate.error_landline', "座机号码格式不对！"),
		"email": trans('validate.error_email', "邮箱地址格式不对！"),
		"url": trans('validate.error_url', "网址格式不对！"),
		"datetime": trans('validate.error_datetime', "日期格式不对！")
	}

	u.Validate.REG = {
		"integer": /^-?\d+$/,
		"float": /^-?\d+(\.\d+)?$/,
		"zipCode": /^[0-9]{6}$/,
		"phone": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
		"landline": /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
		"email": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		"url": /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
		"datetime": /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/
	}

	

	

	u.Validate.fn.create = function() {
		var self = this
		u.on(this.element,'blur', function(e) {
			if (self.validMode == 'blur'){
				self.passed = self.doValid()
				
			}
		})
		u.on(this.element,'focus', function(e) {
			//隐藏错误信息
			self.hideMsg()
		})
		u.on(this.element,'change', function(e) {
			//隐藏错误信息
			self.hideMsg()
		})	
		u.on(this.element,'keydown', function(e) {
			var event = window.event || e;
			if(self["validType"] == "float"){
				var tmp = self.element.value;
				if(event.shiftKey){
					event.returnValue=false;
					return false;
				}else if(event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
					// tab键 左箭头 右箭头 delete键
					return true;
				}else if(event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)){
					//复制粘贴
					return true;
				}else if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)||(u.inArray(event.keyCode,[8,110,190,189,109]) > -1))){
					event.returnValue=false;
					return false;
				}else if((!tmp || tmp.indexOf(".") > -1) && (event.keyCode == 190 || event.keyCode == 110 )){
					event.returnValue=false;
					return false;
					
				}

				if(tmp && (tmp+'').split('.')[0].length >= 25) {
					return false;
					
				}

			}
			if(self["validType"] == "integer"){
				var tmp = self.element.value

				 if(event.shiftKey){
					event.returnValue=false;
					return false;
				}else if(event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
					// tab键 左箭头 右箭头 delete键
					return true;
				}else if(event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)){
					//复制粘贴
					return true;
				}else if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)||(u.inArray(event.keyCode,[8,109,189]) > -1))){
					event.returnValue=false;
					return false;
				}

				if(tmp && (tmp+'').split('.')[0].length >= 25) {
					return false;
				}
			}

		})
	}

	u.Validate.fn.updateOptions = function(options){

	}

	u.Validate.fn.doValid = function(options) {
		var self=this;
		var pValue;
		this.showMsgFlag = true;
		if(options){
			pValue = options.pValue;
			this.showMsgFlag = options.showMsg;
		}
		this.needClean = false
		if (this.element && this.element.getAttribute("readonly")) return {passed:true}
		var value = null
		if (typeof pValue != 'undefined')
			value = pValue
		else if(this.element)
			value = this.element.value


		if (this.isEmpty(value) && this.required) {
			this.showMsg(this.nullMsg)
			return {passed:false,Msg:this.nullMsg}
		} else if(this.isEmpty(value) && !this.required){
			return {passed:true}
		}
		if (this.regExp) {
			var reg = new RegExp(this.regExp);
			if (typeof value == 'number')
				value = value + ""
			var r = value.match(reg);
			if (r === null || r === false){
				this.showMsg(this.errorMsg)
				this.needClean = true
				return {passed:false,Msg:this.errorMsg}
			}
		}
		if (this.minLength){
			if (value.lengthb() < this.minLength){
				var Msg = "输入长度不能小于" + this.minLength + "位";
				this.showMsg(Msg)
				return {passed:false,Msg:Msg}
			}
		}
		if (this.maxLength){
			if (value.lengthb() > this.maxLength){
				var Msg = "输入长度不能大于" + this.maxLength + "位";
				this.showMsg(Msg)
				return {passed:false,Msg:Msg}
			}
		}
		if (this.max != undefined && this.max != null){
			if (parseFloat(value) > this.max){
				var Msg = "输入值不能大于" + this.max;
				this.showMsg(Msg)
				return {passed:false,Msg:Msg}
			}
		}
		if(this.min != undefined && this.min != null){
			if (parseFloat(value) < this.min){
				var Msg = "输入值不能小于" + this.min;
				this.showMsg(Msg)
				return {passed:false,Msg:Msg}
			}
		}
		if (this.maxNotEq != undefined && this.maxNotEq != null){
			if (parseFloat(value) >= this.maxNotEq){
				var Msg = "输入值不能大于或等于" + this.maxNotEq;
				this.showMsg(Msg)
				return {passed:false,Msg:Msg}
			}
		}
		if(this.minNotEq != undefined && this.minNotEq != null){
			if (parseFloat(value) <= this.minNotEq){
				var Msg = "输入值不能小于或等于" + this.minNotEq;
				this.showMsg(Msg)
				return {passed:false,Msg:Msg}
			}
		}
		//succes时，将成功信息显示
		if(this.successId){
			// u.addClass(this.element.parentNode,'u-has-success');
			var successDiv=this.successId;
			var successleft=this.$element.offsetLeft+this.$element.offsetWidth+5;
			var successtop=this.$element.offsetTop+10;
			if(typeof successDiv==='string')
				successDiv = document.getElementById(successDiv);
			successDiv.style.display='inline-block';
			successDiv.style.top=successtop+'px';
			successDiv.style.left=successleft+'px';
			clearTimeout(this.timeout)
			this.timeout = setTimeout(function(){
				// self.tooltip.hide();
				successDiv.style.display='none';
			},3000)
			
		}
		return {passed:true}
	}
	
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

    u.Validate.fn.some = Array.prototype.some ?
		Array.prototype.some : function() {
			var flag;
			for (var i = 0; i < this.length; i++) {
				if (typeof arguments[0] == "function") {
					flag = arguments[0](this[i])
					if (flag) break;
				}
			}
			return flag;
		};

	u.Validate.fn.getValue = function() {
		var inputval = '';
		//checkbox、radio为u-meta绑定时
		var bool = this.some.call(this.$element.querySelectorAll('[type="checkbox"],[type="radio"]'), function(ele) {
			return ele.type == "checkbox" || ele.type == "radio"
		});
		if (this.$element.childNodes.length > 0 && bool) {
			var eleArr = this.$element.querySelectorAll('[type="checkbox"],[type="radio"]')
			var ele = eleArr[0]
			if (ele.type == "checkbox") {
				this.$element.querySelectorAll(":checkbox[name='" + $(ele).attr("name") + "']:checked").each(function() {
					inputval += $(this).val() + ',';
				})
			} else if (ele.type == "radio") {
				inputval = this.$element.querySelectorAll(":radio[name='" + $(ele).attr("name") + "']:checked").value;
			}
		} else if (this.$element.is(":radio")) { //valid-type 绑定
			inputval = this.$element.parent().querySelectorAll(":radio[name='" + this.$element.attr("name") + "']:checked").val();
		} else if (this.$element.is(":checkbox")) {
			inputval = "";
			this.$element.parent().find(":checkbox[name='" + this.$element.attr("name") + "']:checked").each(function() {
				inputval += $(this).val() + ',';
			})
		} else if (this.$element.find('input').length > 0){
			inputval = this.$element.find('input').val()
		}else {
			inputval = this.$element.val();
		}
		inputval = inputval.trim;
		return this.isEmpty(inputval) ? "" : inputval;
	}

	u.Validate.fn.isEmpty = function(val) {
		return val === "" || val === undefined || val === null //|| val === $.trim(this.$element.attr("tip"));
	}

	u.Validate.fn.showMsg = function(msg) {
		

		if(this.showMsgFlag == false || this.showMsgFlag == 'false'){
			return;
		}
		var self = this
		if (this.tipId) {
			this.$element.style.borderColor='rgb(241,90,74)';
			var tipdiv=this.tipId;
			// 算位置不是一个好办法，样式方面的还是要通过样式控制
			//var left=this.$element.offsetLeft;
			//var top=this.$element.offsetTop+this.$element.offsetHeight+4;
			if(typeof tipdiv==='string'){
				tipdiv = document.getElementById(tipdiv);
			}
			tipdiv.innerHTML = msg;
			//tipdiv.style.left=left+'px';
			//tipdiv.style.top=top+'px';
			tipdiv.style.display = 'block';
			// u.addClass(tipdiv.parentNode,'u-has-error');
			// $('#' + this.tipId).html(msg).show()
		} else {
			var tipOptions = {
				"title": msg,
				"trigger": "manual",
				"selector": "validtip",
				"placement": this.placement,
				"container":"body"
			}
			if (this.options.tipTemplate)
				tipOptions.template = this.options.tipTemplate
			if(!this.tooltip)
				this.tooltip = new u.Tooltip(this.element,tipOptions)
			this.tooltip.setTitle(msg);
			this.tooltip.show();
			
		}
		if(this.tipAliveTime !== -1) {
			clearTimeout(this.timeout)
			this.timeout = setTimeout(function(){
				// self.tooltip.hide();
				self.hideMsg();
			},this.tipAliveTime)

		}
	}
	u.Validate.fn.hideMsg = function() {
		//隐藏成功信息
		// if(this.successId||this.tipId){
		// 	document.getElementById(this.successId).style.display='none';
		// 	document.getElementById(this.tipId).style.display='none';
		// }
		
		// u.removeClass(this.element.parentNode,'u-has-error');
		// u.removeClass(this.element.parentNode,'u-has-success');
		

		if (this.tipId) {
			var tipdiv =this.tipId;
			if(typeof tipdiv==='string' ){
				tipdiv = document.getElementById(tipdiv);
			}
			tipdiv.style.display='none';
			this.$element.style.borderColor='';
			// u.removeClass(tipdiv.parentNode,'u-has-error');
		} else {
			if(this.tooltip)
			this.tooltip.hide()
		}
			
	}

	/**
	 * 只有单一元素时使用
	 */
	u.Validate.fn._needClean = function(){
		return true;//this.validates[0].needClean
	}

	u.validate=function(element){
        var self = this,options,childEle;
        if(typeof element==='string'){
            element=document.querySelector(element);
        }
        //element本身需要校验
        if(element.attributes["validate"]){
        	options=element.attributes["validate"]?JSON.parse(element.attributes["validate"].value):{};
            options=u.extend({el:element},options);
            element['u.Validate']=new u.Validate(options);
        }

        //element是个父元素，校验子元素
        childEle=element.querySelectorAll('[validate]');
        u.each(childEle,function(i,child){
           if(!child['u.Validate']){//如果该元素上没有校验
            options=child.attributes["validate"]?JSON.parse(child.attributes["validate"].value):{};
            options=u.extend({el:child},options);
            child['u.Validate']=new u.Validate(options);
           }
        });
    }

    // 对某个dom容器内的元素进行校验
    u.doValidate=function (element){
        var passed=true,childEle,result;
        if(typeof element==='string'){
            element=document.querySelector(element);
        }
        childEle=element.querySelectorAll('input');
        u.each(childEle,function(i,child){
           if(child['u.Validate']&&child['u.Validate'].check){
            result = child['u.Validate'].check({trueValue:true,showMsg:true});
            if (typeof result === 'object')
                passed = result['passed']  && passed
            else
                passed = result && passed
           }
        });
       return passed;
    }
	if (u.compMgr)   
	u.compMgr.regComp({
		comp: u.Validate,
		compAsString: 'u.Validate',
		css: 'u-validate'
	})
	
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


var Refer = function (options) {
    var contentId = options['contentId'];
    if (u.isEmptyObject(contentId))
        throw new Error('contentId is null');
    this.options = u.extend({}, Refer.DEFAULTS, options);
    this.params = this.options['params'];
    this.create();
    this.loaded = false;
}

Refer.DEFAULTS = {
    isPOPMode: false,
    searchInput: null,
    contentId: null,
    okId: 'okBtn',
    cancelId: 'cancelBtn',
    width: null,
    height: null,
    title: '参照',
    setVal: function () {
    },
    onOk: function () {
    },
    onCancel: function () {
    }
}

Refer.fn = Refer.prototype;

Refer.fn.create = function () {
    var self = this
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
            dialog = u.makeDOM('	<div style="display:none;height:100%" id="' + prefixID + '">' +
                    '<div class="u-msg-title"><h4 class="title">单据名称</h4></div>' +
                    '<div class="u-msg-content">' +
                        '<div class="content"></div>' +
                    '</div>' +
                    '<div class="u-msg-footer">' +
                        '<button class="u-msg-ok u-button">保存<span class="u-button-container"><span class="u-ripple"></span></span></button>' +
                        '<button class="u-msg-cancel u-button">取消<span class="u-button-container"><span class="u-ripple"></span></span></button>' +
                    '</div>' +
                '</div>');
            document.body.appendChild(dialog)
            //dialog = document.body.querySelector('#' + prefixID);
        }
        //this.$contentEle = dialog.find('.modal-body');
        this.titleDiv =dialog.querySelector('.title')
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
    u.on(this.okBtn, 'click', function(){
        self.submit();
    })

    u.on(this.cancelBtn, 'click', function(){
        self.cancel();
    })
}


Refer.fn.submit = function () {
    var data = this.submitData()
    this.options.onOk(data)
    Plugin.destroy(this)
}

Refer.fn.cancel = function () {
    this.options.onCancel()
    Plugin.destroy(this)
}

Refer.fn.open = function () {
    var self = this;
    if (self.isDefaultDialog) {
        var opt = {id:this.options.contentId,content:'#' + this.options.contentId,hasCloseMenu:true}
        if (this.options.height)
            opt.height = this.options.height;
        if (this.options.width)
            opt.width = this.options.width;
        self.modalDialog = u.dialog(opt);
        //self.dialog.modal('show')
    }
    if (this.options['module']){
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
}

/**
 * 参照页面中需注册此方法
 */
Refer.fn.registerSubmitFunc = function (func) {
    this.submitData = func
}

Refer.fn.submitData = function () {
}

var Plugin = function (options) {
    var r = new Refer(options);

    Plugin.addRefer(r);
    r.open();
    return r
}

Refer.fn.destroy = function () {
    if (this.dialog) {
        if (this.isDefaultDialog) {
            //this.dialog.modal('hide');
//	            this.dialog.modal('removeBackdrop');
            this.modalDialog.close();
        }
        //this.dialog.parent().remove();
        this.dialog.parentElement.removeChild(this.dialog)
    }
    delete this.options
}

/**
 * 参照实列
 */
Plugin.instances = {}

Plugin.openRefer = function (options) {
    var r = new Refer(options);
    Plugin.addRefer(r)
    r.open()
}

Plugin.getRefer = function (id) {
    return Plugin.instances[id]
}

Plugin.addRefer = function (refer) {
    Plugin.instances[refer.options.id] = refer
}

Plugin.destroy = function (refer) {
    var r = Plugin.instances[refer.options.id];
    delete Plugin.instances[refer.options.id];
    r.destroy()
}

u.refer = Plugin;



u.slidePanelTemplate = ['<div class="slidePanel slidePanel-right  slidePanel-show slidePanel-dragging" style="transform:translate3d(100%,0,0);">',
    '<div class="slidePanel-content site-sidebar-content"></div>',
    '<div class="slidePanel-handler"></div>',
    '</div>']


u.slidePanel = function (options) {
    var url = options['url'],
        width = options['width'] || '700px',
        callback = options['callback'] || function () {
            },
        slideDom = u.makeDOM(u.slidePanelTemplate.join('')),
        overlayDiv = u.makeModal(slideDom);
    slideDom.style.width = width;
    overlayDiv.style.opacity = 0;
    document.body.appendChild(slideDom);
    //overlayDiv.style.opacity = 0.5;
    u.ajax({
        type: 'get',
        url: url,
        success: function (data) {
            var content = slideDom.querySelector('.slidePanel-content');
            content.innerHTML = data;
            callback();
            setTimeout(function () {
                slideDom.style.transform = 'translate3d(0,0,0)';
                overlayDiv.style.opacity = 0.5;
            }, 1);
        }
    })

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
        if(u.isIE8){
            document.body.removeChild(slideDom);
            document.body.removeChild(overlayDiv);
        }
    })

    return {
        close: function () {
            overlayDiv.click();
        }
    }

}

/**
 * Created by dingrf on 2016/3/4.
 */

/**
 * 加载控件
 */

if (document.readyState && document.readyState === 'complete'){
    u.compMgr.updateComp();
}else{
    u.on(window, 'load', function() {

        //扫描并生成控件
        u.compMgr.updateComp();
    });
}
/** 
 * datetimepicker v3.0.6
 * dateTime
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/datetimepicker#readme
 * bugs : https://github.com/iuap-design/datetimepicker/issues
 **/ 
u.DateTimePicker = u.BaseComponent.extend({


});

u.DateTimePicker.fn = u.DateTimePicker.prototype;


u.DateTimePicker.fn.init = function(){

    var self = this,_fmt,_defaultFmt;
    this.enable = true;
    this._element = this.element;
    //this.type = 'datetime';
    //if (u.hasClass(this.element,'u-datepicker')){
    //    this.type = 'date';
    //}
    //u.addClass(this._element,'u-text')
    //this._element.style.display = "inline-table"; // 存在右侧图标，因此修改display
    //new UText(this._element);
    this._input = this._element.querySelector("input");
    
    if(u.isMobile){
        // setTimeout(function(){
        //     self._input.setAttribute('readonly','readonly');
        // },1000);
    }

    setTimeout(function(){
        self._input.setAttribute('readonly','readonly');
    },1000);
   
    u.on(this._input, 'focus', function(e){
        // 用来关闭键盘
        if(u.isMobile)
            this.blur();
        self._inputFocus = true;
        if (self.isShow !== true){
            self.show(e);
        }
        u.stopEvent(e);
    });
    u.on(this._input, 'blur', function(e){
        self._inputFocus = false;
    })
    this._span = this._element.querySelector("span");
    if (this._span){
        u.on(this._span, 'click', function(e){
            // if (self.isShow !== true){
            //     self.show(e);
            // }
            self._input.focus();
            u.stopEvent(e);
        });
    }

    if (u.hasClass(this._element, 'time')){
        this.type = 'datetime';
        _defaultFmt = 'YYYY-MM-DD hh:mm:ss';
    }else{
        this.type = 'date';
        _defaultFmt = 'YYYY-MM-DD';
    }
    _fmt = this._element.getAttribute("format");
    this.format = _fmt || this.options['format']  ||  _defaultFmt;
    this.isShow = false;
};


/**
 * 轮播动画效果
 * @private
 */
u.DateTimePicker.fn._carousel = function(newPage, direction){
    if (direction == 'left'){
        u.addClass(newPage, 'right-page');
    }else{
        u.addClass(newPage, 'left-page');
    }
    this._dateContent.appendChild(newPage);
    if(u.isIE8 || u.isIE9 || u.isFF){
        // this._dateContent.removeChild(this.contentPage);
        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
        for (i = 0; i < pages.length; i++){
            this._dateContent.removeChild(pages[i])
        }
        this.contentPage = newPage;
        this._dateContent.appendChild(newPage);
        if (direction == 'left'){
            u.removeClass(newPage, 'right-page');
        }else{
            u.removeClass(newPage, 'left-page');
        }
    }else{

        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this._dateContent.removeChild(this.contentPage);
            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
            for (i = 0; i < pages.length; i++){
                this._dateContent.removeChild(pages[i])
            }
            this.contentPage = newPage;
            this._dateContent.appendChild(newPage);
        }.bind(this);

        newPage.addEventListener('transitionend', cleanup);
        newPage.addEventListener('webkitTransitionEnd', cleanup);
        if(window.requestAnimationFrame)
            window.requestAnimationFrame(function() {
                if (direction == 'left'){
                    u.addClass(this.contentPage, 'left-page');
                    u.removeClass(newPage, 'right-page');
                }else{
                    u.addClass(this.contentPage, 'right-page');
                    u.removeClass(newPage, 'left-page');
                }
            }.bind(this));
    }
};

/**
 * 淡入动画效果
 * @private
 */
u.DateTimePicker.fn._zoomIn = function(newPage){
    if (!this.contentPage){
        this._dateContent.appendChild(newPage);
        this.contentPage = newPage;
        return;
    }
    u.addClass(newPage, 'zoom-in');
    this._dateContent.appendChild(newPage);
    if(u.isIE8 || u.isIE9 || u.isFF){
        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
        for (i = 0; i < pages.length; i++){
            this._dateContent.removeChild(pages[i])
        }
        // this._dateContent.removeChild(this.contentPage);
        this.contentPage = newPage;
        this._dateContent.appendChild(newPage);
        u.removeClass(newPage, 'zoom-in');
    }else{
        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this._dateContent.removeChild(this.contentPage);
            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
            for (i = 0; i < pages.length; i++){
                this._dateContent.removeChild(pages[i])
            }
            this.contentPage = newPage;
            this._dateContent.appendChild(newPage);
        }.bind(this);
        if (this.contentPage){
            newPage.addEventListener('transitionend', cleanup);
            newPage.addEventListener('webkitTransitionEnd', cleanup);
        }
        if(window.requestAnimationFrame)
            window.requestAnimationFrame(function() {
                    u.addClass(this.contentPage, 'is-hidden');
                    u.removeClass(newPage, 'zoom-in');
            }.bind(this));
    }
    
};


/**
 *填充年份选择面板
 * @private
 */
u.DateTimePicker.fn._fillYear = function(type){
    var year,template,yearPage,titleDiv,yearDiv,_year, i,cell,language,year,month,date,time,self = this;
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title">',
                        /*'<div class="u-date-content-title-year"></div>-',
                        '<div class="u-date-content-title-month"></div>-',
                        '<div class="u-date-content-title-date"></div>',
                        '<div class="u-date-content-title-time"></div>',*/
                    '</div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    type = type || 'current';
    _year = this.pickerDate.getFullYear()
    if ('current' === type) {
        this.startYear = _year - _year%10 - 1;
    } else if (type === 'preivous') {
        this.startYear = this.startYear - 10;
    } else {
        this.startYear = this.startYear + 10;
    }
    yearPage = u.makeDOM(template);
    // titleDiv = yearPage.querySelector('.u-date-content-title');
    // titleDiv.innerHTML = (this.startYear - 1) + '-' + (this.startYear + 11);
    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](this.pickerDate);
    month = u.date._formats['MM'](this.pickerDate,language);
    date = u.date._formats['DD'](this.pickerDate,language);
    time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);

    this._yearTitle = yearPage.querySelector('.u-date-content-title');
    this._yearTitle.innerHTML = year;
    /*this._headerYear = yearPage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = yearPage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = yearPage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = yearPage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;*/
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    /*u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });*/

    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){

        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == _year){
            u.addClass(cell, 'current');
        }
        if (this.startYear + i < this.beginYear ){
            u.addClass(cell, 'u-disabled');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    u.on(yearDiv, 'click', function(e){
        if (u.hasClass(e.target,'u-disabled')) return;
        var _y = e.target._value;
        this.pickerDate.setYear(_y);
        this._updateDate();
        this._fillMonth();
    }.bind(this));

    if (type === 'current'){
        this._zoomIn(yearPage);
    }else if(type === 'next'){
        this._carousel(yearPage, 'left');
    }else if(type === 'preivous'){
        this._carousel(yearPage, 'right');
    }
    this.currentPanel = 'year';
};

/**
 * 填充月份选择面板
 * @private
 */
u.DateTimePicker.fn._fillMonth = function(){
    var template,monthPage,_month,cells,i,language,year,month,date,time,self = this;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
            /*'<div class="u-date-content-title-year"></div>-',
            '<div class="u-date-content-title-month"></div>-',
            '<div class="u-date-content-title-date"></div>',
            '<div class="u-date-content-title-time"></div>',*/
        '</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](this.pickerDate);
    month = u.date._formats['MM'](this.pickerDate,language);
    date = u.date._formats['DD'](this.pickerDate,language);
    time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);

    this._monthTitle =  monthPage.querySelector('.u-date-content-title');
    this._monthTitle.innerHTML = u.date._formats['MMM'](this.pickerDate,language);
    /*this._headerYear = monthPage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = monthPage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = monthPage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = monthPage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;*/
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    /*u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });*/

    cells = monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month - 1 == i){
            u.addClass(cells[i],'current');
        }
        if(this.pickerDate.getFullYear() == this.beginYear && i < this.beginMonth){
            u.addClass(cells[i],'u-disabled');
        }
        if(this.pickerDate.getFullYear() < this.beginYear){
            u.addClass(cells[i],'u-disabled');
        }
        cells[i]._value = i;
        new URipple(cells[i]);
    }
    u.on(monthPage, 'click', function(e){
        if (u.hasClass(e.target,'u-disabled')) return;
        if (u.hasClass(e.target,'u-date-content-title')) return;
        var _m = e.target._value;
        this.pickerDate.setMonth(_m);
        this._updateDate();
        this._fillDate();
    }.bind(this));
    this._zoomIn(monthPage);
    this.currentPanel = 'month';
};

u.DateTimePicker.fn._getPickerStartDate = function(date){
    var d = new Date(date);
    d.setDate(1);
    var day = d.getDay();
    d = u.date.sub(d, 'd', day);
    return d;
}

u.DateTimePicker.fn._getPickerEndDate= function(date){
    var d = new Date(date);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    var day = d.getDay();
    d = u.date.add(d,'d',6 - day);
    return d;
}

/**
 * 渲染日历
 * @param type : previous  current  next
 * @private
 */
u.DateTimePicker.fn._fillDate = function(type){
    // if (u.isMobile){
    //     this._dateMobileScroll()
    //     return
    // }
    var year,month,day,time,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](tempDate);
    month = u.date._formats['MM'](tempDate,language);
    date = u.date._formats['DD'](tempDate,language);
    time = u.date._formats['HH'](tempDate,language) + ':' + u.date._formats['mm'](tempDate,language) + ':' + u.date._formats['ss'](tempDate,language);
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
            '<div class="u-date-content-title-year"></div>-',
            '<div class="u-date-content-title-month"></div>-',
            '<div class="u-date-content-title-date"></div>',
            '<div class="u-date-content-title-time"></div>',
        '</div>',
        '<div class="u-date-week"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'].join("");
    datePage = u.makeDOM(template);
    this._headerYear = datePage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = datePage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = datePage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = datePage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });

    weekSpans = datePage.querySelectorAll('.u-date-week span');

    for(i=0; i< 7; i++){
        weekSpans[i].innerHTML = u.date._dateLocale[language].weekdaysMin[i];
    }
    dateDiv = datePage.querySelector('.u-date-content-panel');
    tempDate = this.startDate;
    while(tempDate <= this.endDate){
        cell = u.makeDOM('<div class="u-date-cell" unselectable="on" onselectstart="return false;">'+ tempDate.getDate() +'</div>');
        if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth()
            && tempDate.getDate() == this.pickerDate.getDate()){
            u.addClass(cell, 'current');
        }

        
        if(tempDate.getFullYear() < this.beginYear || (tempDate.getFullYear() == this.beginYear && tempDate.getMonth() < this.beginMonth)){
            u.addClass(cell,'u-disabled');
            u.removeClass(cell,'current');
        }

        if(tempDate.getFullYear() == this.beginYear && tempDate.getMonth() == this.beginMonth
            && tempDate.getDate() < this.beginDate){
            u.addClass(cell,'u-disabled');
            u.removeClass(cell,'current');
        }
        cell._value = tempDate.getDate();
        cell._month = (tempDate.getMonth());
        cell._year = tempDate.getFullYear();
        new URipple(cell);
        dateDiv.appendChild(cell);
        tempDate = u.date.add(tempDate, 'd', 1);
    }
    u.on(dateDiv, 'click', function(e){
        if (u.hasClass(e.target,'u-disabled')) return;
        var _d = e.target._value;
        if (!_d) return;
        this.pickerDate.setFullYear(e.target._year);
        this.pickerDate.setMonth(e.target._month);
        this.pickerDate.setDate(_d);
        var _cell = e.target.parentNode.querySelector('.u-date-cell.current');
        if (_cell) {
            u.removeClass(_cell, 'current');
            if(u.isIE8 || u.isIE9)
                _cell.style.backgroundColor = "#fff";
        }
        u.addClass(e.target, 'current');
        if(u.isIE8 || u.isIE9)
            e.target.style.backgroundColor = '#3f51b5';
        this._updateDate();
        if (this.type === 'date'){
            this.onOk();
        }
    }.bind(this));
    if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'date';
};


/**
 * 填充时间选择面板
 * @private
 */
u.DateTimePicker.fn._fillTime = function(type){
    // if (u.isMobile) {
    //     this._timeMobileScroll()
    //     return;
    // }
    var year,month,day,date,time,template,timePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](tempDate);
    month = u.date._formats['MM'](tempDate,language);
    date = u.date._formats['DD'](tempDate,language);
    time = u.date._formats['HH'](tempDate,language) + ':' + u.date._formats['mm'](tempDate,language) + ':' + u.date._formats['ss'](tempDate,language);

    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
            '<div class="u-date-content-title-year"></div>-',
            '<div class="u-date-content-title-month"></div>-',
            '<div class="u-date-content-title-date"></div>',
            '<div class="u-date-content-title-time"></div>',
        '</div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'].join("");
    timePage = u.makeDOM(template);
//    titleDiv = timePage.querySelector('.u-date-content-title');
//    titleDiv.innerHTML = year + ' ' + month + ' ' +day ;
    this._headerYear = timePage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = timePage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = timePage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = timePage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });

    dateDiv = timePage.querySelector('.u-date-content-panel');
   // tempDate = this.startDate;
    // while(tempDate <= this.endDate){
        // cell = u.makeDOM('<div class="u-date-cell">'+ u.date._formats['HH'](tempDate,language) +'</div>');
        // if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth()
            // && tempDate.getDate() == this.pickerDate.getDate()){
            // u.addClass(cell, 'current');
        // }
        // cell._value = tempDate.getDate();
        // new URipple(cell);
        // dateDiv.appendChild(cell);
        // tempDate = u.date.add(tempDate, 'd', 1);
    // }
    if(u.isIE8){ // IE8/IE9保持原来，非IE8/IE9使用clockpicker
        timetemplate = ['<div class="u_time_box">',
                            '<div class="u_time_cell">',
                                //'<div class="add_hour_cell"><i class="add_hour_cell icon-angle-up"></i></div>',
                                '<div class="show_hour_cell">'+ u.date._formats['HH'](tempDate) +'</div>' ,
                                //'<div class="subtract_hour_cell"><i class="subtract_hour_cell icon-angle-down"></i></div>',
                            '</div>',
                            '<div class="u_time_cell">',
                                //'<div class="add_min_cell"><i class="add_min_cell icon-angle-up"></i></div>',
                                '<div class="show_min_cell">'+ u.date._formats['mm'](tempDate) +'</div>',
                                //'<div class="subtract_min_cell"><i class="subtract_min_cell icon-angle-down"></i></div>',
                            '</div>',
                            '<div class="u_time_cell">',
                                //'<div class="add_sec_cell"><i class="add_sec_cell icon-angle-up"></i></div>',
                                '<div class="show_sec_cell">'+ u.date._formats['ss'](tempDate) +'</div>',
                                //'<div class="subtract_sec_cell"><i class="subtract_sec_cell icon-angle-down"></i></div>',
                            '</div>',
                        '</div>'].join("");
        cell = u.makeDOM(timetemplate);
        dateDiv.appendChild(cell);
        u.on(dateDiv, 'click', function(e){
            var _arrary = e.target.getAttribute("class").split("_");
            if(_arrary[0] == "add"){
                if(_arrary[1] == "hour"){
                    var tmph = Number(u.date._formats['HH'](this.pickerDate))
                    if(tmph < 23){
                        tmph++
                    }else{
                        tmph = 0
                    }

                    this.pickerDate.setHours(tmph)
                    dateDiv.querySelector(".show_hour_cell").innerHTML = tmph
                }else if(_arrary[1] == "min"){
                    var tmpm = Number(u.date._formats['mm'](this.pickerDate))
                    if(tmpm < 59){
                         tmpm++
                    }else{
                         tmpm = 0
                    }
                    this.pickerDate.setMinutes(tmpm)
                }else if(_arrary[1] == "sec"){
                    var tmps = Number(u.date._formats['ss'](this.pickerDate))
                    if(tmps < 59){
                        tmps++
                    }else{
                        tmps = 0
                    }
                    this.pickerDate.setSeconds(tmps)
                }
            }else if(_arrary[0] == "subtract"){
                if(_arrary[1] == "hour"){
                    var tmph = Number(u.date._formats['HH'](this.pickerDate))
                    if(tmph > 0 ){
                        tmph--
                    }else{
                        tmph = 23
                    }
                    this.pickerDate.setHours(tmph)

                }else if(_arrary[1] == "min"){
                    var tmpm = Number(u.date._formats['mm'](this.pickerDate))
                    if(tmpm > 0){
                         tmpm--
                    }else{
                         tmpm = 59
                    }
                    this.pickerDate.setMinutes(tmpm)
                }else if(_arrary[1] == "sec"){
                    var tmps = Number(u.date._formats['ss'](this.pickerDate))
                    if(tmps > 0){
                        tmps--
                    }else{
                        tmps = 59
                    }
                    this.pickerDate.setSeconds(tmps)
                }
            }else if(_arrary[0] == "show"){
                var tmptarget = e.target
                var tmpinput = u.makeDOM("<input type='text' class='u-input'>");
                if(tmptarget.querySelector('.u-input'))return;
                this._updateDate();
                tmpinput.value = tmptarget.innerHTML;
                tmptarget.innerHTML = ""
                tmptarget.appendChild(tmpinput)
                if(_arrary[1] == "hour"){
                     var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:23})
                     u.on(tmpinput,'blur',function(){
                        if(vali.passed){
                            self.pickerDate.setHours(tmpinput.value)
                            self._updateDate();
                        }
                     })
                }else if(_arrary[1] == "min"){
                     var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:59})
                       u.on(tmpinput,'blur',function(){
                        if(vali.passed){
                            self.pickerDate.setMinutes(tmpinput.value)
                            self._updateDate();
                        }
                     })
                }else if(_arrary[1] == "sec"){
                     var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:59})
                       u.on(tmpinput,'blur',function(){
                        if(vali.passed){
                            self.pickerDate.setSeconds(tmpinput.value)
                            self._updateDate();
                        }
                     })
                }

                tmpinput.focus()
                return;

            }else{
                return false;
            }

            this._updateDate();
        }.bind(this));
    }else{
        timetemplate = '<div class="u-combo-ul clockpicker-popover is-visible" style="width:100%;padding:0px;">';
//        timetemplate += '<div class="popover-title"><span class="clockpicker-span-hours">02</span> : <span class="clockpicker-span-minutes text-primary">01</span><span class="clockpicker-span-am-pm"></span></div>';
        timetemplate += '<div class="popover-content">';
        timetemplate += '  <div class="clockpicker-plate data-clockpicker-plate">';
        timetemplate += '      <div class="clockpicker-canvas">';
        timetemplate += '          <svg class="clockpicker-svg">';
        timetemplate += '              <g transform="translate(100,100)">';
        timetemplate += '                  <circle class="clockpicker-canvas-bg clockpicker-canvas-bg-trans" r="13" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
        timetemplate += '                  <circle class="clockpicker-canvas-fg" r="3.5" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
        timetemplate += '                  <line x1="0" y1="0" x2="8.362277061412277" y2="-79.56175162946187"></line>';
        timetemplate += '                  <circle class="clockpicker-canvas-bearing" cx="0" cy="0" r="2"></circle>';
        timetemplate += '              </g>';
        timetemplate += '          </svg>';
        timetemplate += '      </div>';
        timetemplate += '      <div class="clockpicker-dial clockpicker-hours" style="visibility: visible;">';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-1" >00</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-2" >1</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-3" >2</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-4" >3</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-5" >4</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-6" >5</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-7" >6</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-8" >7</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-9" >8</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-10" >9</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-11" >10</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-12" >11</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-13" >12</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-14" >13</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-15" >14</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-16" >15</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-17" >16</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-18" >17</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-19" >18</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-20" >19</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-21" >20</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-22" >21</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-23" >22</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-24" >23</div>';
        timetemplate += '      </div>';
        timetemplate += '      <div class="clockpicker-dial clockpicker-minutes" style="visibility: hidden;">';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-25" >00</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-26" >05</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-27" >10</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-28" >15</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-29" >20</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-30" >25</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-31" >30</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-32" >35</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-33" >40</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-34" >45</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-35" >50</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-36" >55</div>';
        timetemplate += '      </div>';
        timetemplate += '  </div><span class="clockpicker-am-pm-block"></span></div>';
        timetemplate += '  </div>';
        cell = u.makeDOM(timetemplate);
        this.cell = cell;
        dateDiv.appendChild(cell);

        this.hand = cell.querySelector('line');
        this.bg = cell.querySelector('.clockpicker-canvas-bg');
        this.fg = cell.querySelector('.clockpicker-canvas-fg');
        this.titleHourSpan = cell.querySelector('.clockpicker-span-hours');
        this.titleMinSpan = cell.querySelector('.clockpicker-span-minutes');
        this.hourDiv = cell.querySelector('.clockpicker-hours');
        this.minDiv = cell.querySelector('.clockpicker-minutes');
        this.currentView = 'hours';
        this.hours = u.date._formats['HH'](tempDate);
        this.min = u.date._formats['mm'](tempDate);
        this.sec = u.date._formats['ss'](tempDate);
        //this.titleHourSpan.innerHTML = this.hours;
        //this.titleMinSpan.innerHTML = this.min;
        


        u.on(this.hourDiv,'click',function(e){
            var target = e.target;
            if(u.hasClass(target,'clockpicker-tick')){
                this.hours = target.innerHTML;
                this.hours = this.hours > 9 || this.hours  == 0? '' + this.hours:'0' + this.hours;
                // this.titleHourSpan.innerHTML = this.hours;
                self.pickerDate.setHours(this.hours);
                var language = u.core.getLanguages();
                var time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);
                this._headerTime.innerHTML = time;
                this.hourDiv.style.visibility = 'hidden';
                this.minDiv.style.visibility = 'visible';
                this.currentView = 'min';
                this.setHand();
            }
        }.bind(this));
        
        u.on(this.minDiv,'click',function(e){
            var target = e.target;
            if(u.hasClass(target,'clockpicker-tick')){
                this.min = target.innerHTML;
                // this.min = this.min > 9 || this.min  == 00? '' + this.min:'0' + this.min;
                // this.titleMinSpan.innerHTML = this.min;
                self.pickerDate.setMinutes(this.min);
                var language = u.core.getLanguages();
                var time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);
                this._headerTime.innerHTML = time;
                this.minDiv.style.visibility = 'hidden';
                this.hourDiv.style.visibility = 'visible';
                this.currentView = 'hours';
                this.setHand();
            }
        }.bind(this));
        
    }
    
    this._zoomIn(timePage);
    if(!u.isIE8)
        this.setHand();
    this.currentPanel = 'time';
    dateDiv.onselectstart=new Function("return false");

};

u.DateTimePicker.fn.setHand = function(){
    var dialRadius = 100,
    innerRadius = 54,
    outerRadius = 80;
    var view = this.currentView,
        value = this[view],
        isHours = view === 'hours',
        unit = Math.PI / (isHours ? 6 : 30),
        radian = value * unit,
        radius = isHours && value > 0 && value < 13 ? innerRadius : outerRadius,
        x = Math.sin(radian) * radius,
        y = - Math.cos(radian) * radius;
        this.setHandFun(x,y);
}

u.DateTimePicker.fn.setHandFun = function(x,y,roundBy5,dragging){
    var dialRadius = 100,
    innerRadius = 54,
    outerRadius = 80;
    
    var radian = Math.atan2(x, - y),
        isHours = this.currentView === 'hours',
        unit = Math.PI / (isHours ? 6 : 30),
        z = Math.sqrt(x * x + y * y),
        options = this.options,
        inner = isHours && z < (outerRadius + innerRadius) / 2,
        radius = inner ? innerRadius : outerRadius,
        value;
        
        if (this.twelvehour) {
            radius = outerRadius;
        }

    // Radian should in range [0, 2PI]
    if (radian < 0) {
        radian = Math.PI * 2 + radian;
    }

    // Get the round value
    value = Math.round(radian / unit);

    // Get the round radian
    radian = value * unit;

    // Correct the hours or minutes
    if (options.twelvehour) {
        if (isHours) {
            if (value === 0) {
                value = 12;
            }
        } else {
            if (roundBy5) {
                value *= 5;
            }
            if (value === 60) {
                value = 0;
            }
        }
   } else {
        if (isHours) {
            if (value === 12) {
                value = 0;
            }
            value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
        } else {
            if (roundBy5) {
                value *= 5;
            }
            if (value === 60) {
                value = 0;
            }
        }
    }
    
    // Set clock hand and others' position
    var w = this._panel.offsetWidth;
        var u = w / 294;
        var cx = Math.sin(radian) * radius * u,
            cy = - Math.cos(radian) * radius * u;
        var iu = 100 * u;
        this.cell.querySelector('g').setAttribute('transform','translate(' + iu + ',' + iu + ')');
    this.hand.setAttribute('x2', cx);
    this.hand.setAttribute('y2', cy);
    this.bg.setAttribute('cx', cx);
    this.bg.setAttribute('cy', cy);
    this.fg.setAttribute('cx', cx);
    this.fg.setAttribute('cy', cy);
}

/**
 * 重新渲染面板
 * @private
 */
u.DateTimePicker.fn._updateDate = function(){
    var year,month,week,date,time, hour,minute,seconds,language;

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](this.pickerDate);
    // week = u.date._formats['ddd'](this.pickerDate, language);
    month = u.date._formats['MM'](this.pickerDate, language);
    time = u.date._formats['HH'](this.pickerDate, language)+':'+u.date._formats['mm'](this.pickerDate, language)+':'+u.date._formats['ss'](this.pickerDate, language);

    //TODO 多语
    // date = u.date._formats['D'](this.pickerDate) + '日';
    date = u.date._formats['DD'](this.pickerDate,language);
    if(this._headerYear){
        this._headerYear.innerHTML = '';
        this._headerYear.innerHTML = year;
    }
        // this._headerWeak.innerHTML = '';
        // this._headerWeak.innerHTML = week;
    if(this._headerMonth){
        this._headerMonth.innerHTML = '';
        this._headerMonth.innerHTML = month ;
    }
    if(this._headerDate){
        this._headerDate.innerHTML = '';
        this._headerDate.innerHTML = date;
    }
    if(this._headerTime){
        this._headerTime.innerHTML = '';
        this._headerTime.innerHTML = time;
    }
    if(this.currentPanel == 'time'){
        if(u.isIE8){
            this._panel.querySelector(".show_hour_cell").innerHTML =  u.date._formats['HH'](this.pickerDate, language)
            this._panel.querySelector(".show_min_cell").innerHTML =  u.date._formats['mm'](this.pickerDate, language)
            this._panel.querySelector(".show_sec_cell").innerHTML =  u.date._formats['ss'](this.pickerDate, language)
        }
    }

};


u.DateTimePicker.fn._response = function() {
    return;
    var bodyHeight = document.body.offsetHeight;  //395
    var _height = 430;
    if (this.type === 'date' && !(u.isMobile))
        _height = 395;
    if (bodyHeight > _height){
        this._panel.style.height =  _height;
    }
    //if (bodyHeight > 500){
    //    this._panel.style.height =  '500px';
    //}
    //this._dateContent.style.height =panelHeight - 158 + 'px';   // 106 52
};

u.dateTimePickerTemplateArr = ['<div class="u-date-panel">',
                            '<div class="u-date-body">',
                                /*'<div class="u-date-header">',
                                    '<span class="u-date-header-year"></span>',
                                     '<div class="u-date-header-h3">',
                                        '<span class="u-date-header-week"></span>',
                                        '<span>,</span>',
                                        '<span class="u-date-header-month"></span>',
                                        '<span> </span>',
                                        '<span class="u-date-header-date"></span>',
                                        '<span> </span>',
                                        '<span class="u-date-header-time"></span>',
                                     '</div>',
                                '</div>',*/
                                '<div class="u-date-content"></div>',
                            '</div>',
                            '<div class="u-date-nav">',
                                '<button class="u-button u-date-ok right primary">确定</button>',
                                '<button class="u-button u-date-cancel right">取消</button>',
                                '<button class="u-button u-date-clean">清空</button>',
                            '</div>',
                           '</div>'];


/******************************
 *  Public method
 ******************************/

u.DateTimePicker.fn.show = function(evt){
    if(!this.enable){
        return;
    }
    var inputValue = this._input.value;
    this.setDate(inputValue);

    var self = this;
    if (!this._panel){
        this._panel = u.makeDOM(u.dateTimePickerTemplateArr.join(""));
        if(u.isMobile){
            u.removeClass(this._panel,'u-date-panel')
            u.addClass(this._panel,'u-date-panel-mobile');
        }
        this._dateNav = this._panel.querySelector('.u-date-nav');
        if (this.type === 'date' && !u.isMobile){
           this._dateNav.style.display = 'none';
        }
        this._dateContent = this._panel.querySelector('.u-date-content');
        if(this.type == 'datetime'){
            /*if(u.isMobile){
                this._dateContent.style.height = '226/16*2rem';
            }
            else{
                this._dateContent.style.height = '226px';
            }*/
        }
        this.btnOk = this._panel.querySelector('.u-date-ok');
        this.btnCancel = this._panel.querySelector('.u-date-cancel');
        this.btnClean = this._panel.querySelector('.u-date-clean');
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnOk.appendChild(rippleContainer);
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnCancel.appendChild(rippleContainer);
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnClean.appendChild(rippleContainer);
        new URipple(this.btnOk);
        new URipple(this.btnCancel);
        new URipple(this.btnClean);
        u.on(this.btnOk, 'click', function(e){
            this.onOk();
            u.stopEvent(e);
        }.bind(this));
        u.on(this.btnCancel, 'click', function(e){
            self.onCancel();
            u.stopEvent(e)
        });
        u.on(this.btnClean, 'click', function(e){
            self.pickerDate = null;
            self.onOk();
            u.stopEvent(e)
        });
            

        // this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini">&lt;</button>');
        // this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini">&gt;</button>');
        this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
        this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');
        // new u.Button(this.nextBtn);

        u.on(this.preBtn, 'click', function(e){
            if (self.currentPanel == 'date'){
                self._fillDate('preivous');
            }else if (self.currentPanel == 'year'){
                self._fillYear('preivous');
            }
            u.stopEvent(e)
        });
        u.on(this.nextBtn, 'click', function(e){
            if (self.currentPanel == 'date'){
                self._fillDate('next');
            }else if (self.currentPanel == 'year'){
                self._fillYear('next');
            }
            u.stopEvent(e)
        });
        // if(!u.isMobile){
            this._dateContent.appendChild(this.preBtn);
            this._dateContent.appendChild(this.nextBtn);    
        // }
        

        //this._element.parentNode.appendChild(this._panel);
        document.body.appendChild(this._panel);

    }
    this.pickerDate = this.date || new Date();
    this._updateDate();
    this._fillDate();
    this._response();
    u.on(window, 'resize', function(){
        self._response();
    });
    if(u.isMobile){
        this.overlayDiv = u.makeModal(this._panel);
        u.on(this.overlayDiv, 'click', function(){
            self.onCancel();
        })
    }
    u.addClass(this._panel, 'is-visible');
    if(!u.isMobile){
        //调整left和top
        u.showPanelByEle({
            ele:this._input,
            panel:this._panel,
            position:"bottomLeft"
        });
        this._panel.style.marginLeft = '0px';
        var callback = function (e) {
            if (e !== evt && e.target !== self._input && !u.hasClass(e.target,'u-date-content-year-cell')  && !u.hasClass(e.target,'u-date-content-year-cell') &&u.closest(e.target,'u-date-panel') !== self._panel && self._inputFocus != true) {
                u.off(document,'click', callback);
                self.onCancel();
            }
        };
        u.on(document,'click', callback);

        document.body.onscroll = function(){
            u.showPanelByEle({
                ele:self._input,
                panel:self._panel,
                position:"bottomLeft"
            });
        }
    }
    
    this.isShow = true;
};


/**
 * 确定事件
 */
u.DateTimePicker.fn.onOk = function(){
    this.setDate(this.pickerDate);
    this.isShow = false;
    u.removeClass(this._panel, 'is-visible');
    try{
        document.body.removeChild(this.overlayDiv);    
    }catch(e){

    }
    this.trigger('select', {value:this.pickerDate})
}

/**
 * 确定事件
 */
u.DateTimePicker.fn.onCancel = function(){
    this.isShow = false;
    u.removeClass(this._panel, 'is-visible');
    try{
        document.body.removeChild(this.overlayDiv);
    }catch(e){

    }
}


u.DateTimePicker.fn.setDate = function(value){
    if (!value){
        this.date = null;
        this._input.value = '';
        return;
    }

    var _date = u.date.getDateObj(value);
    if(_date){
        if(this.beginDateObj){
            if(_date < this.beginDateObj)
                return;
        }
        this.date = _date;
        this._input.value = u.date.format(this.date,this.format);
    }
    
};
/**
 *设置format
 * @param format
 */
u.DateTimePicker.fn.setFormat = function(format){
    this.format = format;
    this._input.value = u.date.format(this.date,this.format);
};

u.DateTimePicker.fn.setStartDate = function(startDate){
    if(startDate){
        this.beginDateObj = u.date.getDateObj(startDate);
        this.beginYear = this.beginDateObj.getFullYear();
        this.beginMonth = this.beginDateObj.getMonth();
        this.beginDate = this.beginDateObj.getDate();
    }
    
}
u.DateTimePicker.fn.setEnable = function(enable){
    if (enable === true || enable === 'true') {
        this.enable = true;
    }else{
        this.enable = false;
    }
}

if (u.compMgr)
    u.compMgr.regComp({
        comp: u.DateTimePicker,
        compAsString: 'u.DateTimePicker',
        css: 'u-datepicker'
    })




/*
移动端渲染暂时和pc保持一致 begin
u.DateTimePicker.fn._dateMobileScroll = function(type){
   var year,month,day,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,ddheight;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();

    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',
        '<div class="u-date-content-panel"><div class="scroll-box"><div class="scroll-shadow"></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setYear" class="u-date-year  u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setMonth" class="u-date-month u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setDate" class="u-date-day u-scroll"></dl></div>',
        '</div></div>'].join("");
    datePage = u.makeDOM(template);
    var srcollyear = datePage.querySelector('.u-date-year');
    var srcollmonth = datePage.querySelector('.u-date-month');
    var srcollday = datePage.querySelector('.u-date-day');
    this.startYear =  this.pickerDate.getFullYear() -10;
    for(i = 0; i < 20; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (this.startYear + i) +'</dd>');

        if (this.startYear + i == this.pickerDate.getFullYear()){
            u.addClass(cell, 'current');
            current_postion(srcollyear,i)
        }
        cell._value = this.startYear + i;
        srcollyear.appendChild(cell);
    }
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (1 + i) + '月' +'</dd>');

        if (this.pickerDate.getMonth()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollmonth,i)
        }
        cell._value = i;
        srcollmonth.appendChild(cell);
    }
    var pickerdayend = (new Date(this.pickerDate.getFullYear(),this.pickerDate.getMonth()+1, 0)).getDate();
    for(i = 1; i < (pickerdayend + 1); i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ i +'日</dd>');
        if (i == this.pickerDate.getDate()) {
            u.addClass(cell, 'current');
            current_postion(srcollday,i-1)
        }
        cell._value = i;
        srcollday.appendChild(cell);

    }
    //current_postion(datePage)
    ddheight = 60
    u.on(datePage.querySelector(".scroll-shadow"),"touchstart",function(e){
         var tmpwidth = this.clientWidth
        var scrolltype,startp,offsetX ;
        console.dir()
        startp = e.touches[0].pageY;
        offsetX = e.touches[0].pageX - this.getClientRects()[0].left
        if(offsetX < tmpwidth * 0.33){
            scrolltype = datePage.querySelector(".u-date-year")
        }else if(tmpwidth * 0.33 < offsetX  && offsetX < tmpwidth * 0.66){
            scrolltype = datePage.querySelector(".u-date-month")
        }else if(tmpwidth * 0.66 < offsetX){
            scrolltype = datePage.querySelector(".u-date-day")
        }
        u.on(document.body,"touchmove",function(e){
            var scrollrange = e.touches[0].pageY - startp
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])
            scrolltype.style.transform = "translateY("+(oldtrans + scrollrange)+"px)";
            startp = e.touches[0].pageY
        })
        var maxscroll = (scrolltype.querySelectorAll('dd').length - 3) * -ddheight
        u.on(document.body,"touchend",function(e){
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])

            var remain = oldtrans-oldtrans%60

            if(remain > ddheight*2){
                remain = ddheight*2
            }else if(remain < maxscroll){
                remain = maxscroll
            }
            tmpdd = scrolltype.querySelectorAll("dd"),
            u.removeClass(scrolltype.querySelector(".current"),'current')
            u.addClass(tmpdd[2 - (remain/ddheight)],'current')
            scrolltype.style.transform = "translateY("+remain+"px)";
            scrollend_update(scrolltype,self)

            u.off(document.body,"touchmove")
            u.off(document.body,"touched")

        })
    })

   if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'mobile_date';

}
u.DateTimePicker.fn._timeMobileScroll = function(type){
   var year,month,day,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,ddheight;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();

    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',
        '<div class="u-date-content-panel"><div class="scroll-box"><div class="scroll-shadow"></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setHours" class="u-date-hour  u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setMinutes" class="u-date-minute u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setSeconds" class="u-date-second u-scroll"></dl></div>',
        '</div></div>'].join("");
    datePage = u.makeDOM(template);
    var srcollhour = datePage.querySelector('.u-date-hour');
    var srcollminute = datePage.querySelector('.u-date-minute');
    var srcollsecond = datePage.querySelector('.u-date-second');
    for(i = 0; i < 24; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+  (i<10? "0"+i:i) +'</dd>');

        if ( this.pickerDate.getHours() == i){
            u.addClass(cell, 'current');
            current_postion(srcollhour,i)
        }
        cell._value = i;
        srcollhour.appendChild(cell);
    }
    for(i = 0; i < 60; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (i<10? "0"+i:i) + '</dd>');

        if (this.pickerDate.getMinutes()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollminute,i)
        }
        cell._value = i;
        srcollminute.appendChild(cell);
    }
    for(i = 0; i < 60; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (i<10? "0"+i:i) +'</dd>');

        if (this.pickerDate.getSeconds()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollsecond,i)
        }
        cell._value = i;
        srcollsecond.appendChild(cell);
    }

    //current_postion(datePage)
    ddheight = 60
    u.on(datePage.querySelector(".scroll-shadow"),"touchstart",function(e){
         var tmpwidth = this.clientWidth
        var scrolltype,startp,offsetX ;

        startp = e.touches[0].pageY;
        offsetX = e.touches[0].pageX - this.getClientRects()[0].left
        if(offsetX < tmpwidth * 0.33){
            scrolltype = datePage.querySelector(".u-date-hour")
        }else if(tmpwidth * 0.33 < offsetX  && offsetX < tmpwidth * 0.66){
            scrolltype = datePage.querySelector(".u-date-minute")
        }else if(tmpwidth * 0.66 < offsetX){
            scrolltype = datePage.querySelector(".u-date-second")
        }
        u.on(document.body,"touchmove",function(e){
            var scrollrange = e.touches[0].pageY - startp
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])
            scrolltype.style.transform = "translateY("+(oldtrans + scrollrange)+"px)";
            startp = e.touches[0].pageY
        })
        var maxscroll = (scrolltype.querySelectorAll('dd').length - 3) * -ddheight
        u.on(document.body,"touchend",function(e){
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])

            var remain = oldtrans-oldtrans%60

            if(remain > ddheight*2){
                remain = ddheight*2
            }else if(remain < maxscroll){
                remain = maxscroll
            }
            tmpdd = scrolltype.querySelectorAll("dd"),
            u.removeClass(scrolltype.querySelector(".current"),'current')
            u.addClass(tmpdd[2 - (remain/ddheight)],'current')
            scrolltype.style.transform = "translateY("+remain+"px)";
            scrollend_update(scrolltype,self)

            u.off(document.body,"touchmove")
            u.off(document.body,"touched")

        })
    })

   if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'mobile_time';

}
function scrollend_update(scrolltype,self){
    var tmpmod =  scrolltype.getAttribute("time-change"),
        tmpcurrent = scrolltype.querySelector(".current");
    self.pickerDate[tmpmod](tmpcurrent._value)
    self._updateDate();

}
function current_postion(dom,i){
   dom.style.transform = "translateY("+(120-i*60)+"px)";
}
移动端渲染暂时和pc保持一致 end
*/
u.Time = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			u.addClass(this.element,'u-text');
			
			
	        u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
			
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

	u.Time.fn = u.Time.prototype;

	u.Time.fn.createPanel = function(){
		if(this.panelDiv)
			return;
		var oThis = this;
		this.panelDiv = u.makeDOM('<div class="u-combo-ul" style="padding:0px;"></div>');
		this.panelContentDiv = u.makeDOM('<div class="u-time-content"></div>');
		this.panelDiv.appendChild(this.panelContentDiv);
		this.panelHourDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelHourDiv);
		this.panelHourInput = u.makeDOM('<input class="u-time-input">');
		this.panelHourDiv.appendChild(this.panelHourInput);
		this.panelMinDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelMinDiv);
		this.panelMinInput = u.makeDOM('<input class="u-time-input">');
		this.panelMinDiv.appendChild(this.panelMinInput);
		this.panelSecDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelSecDiv);
		this.panelSecInput = u.makeDOM('<input class="u-time-input">');
		this.panelSecDiv.appendChild(this.panelSecInput);
		this.panelNavDiv = u.makeDOM('<div class="u-time-nav"></div>');
		this.panelDiv.appendChild(this.panelNavDiv);
		this.panelOKButton = u.makeDOM('<button class="u-button" style="float:right;">OK</button>');
		this.panelNavDiv.appendChild(this.panelOKButton);
		u.on(this.panelOKButton,'click',function(){
			var v = oThis.panelHourInput.value + ':' + oThis.panelMinInput.value + ':' + oThis.panelSecInput.value;
			oThis.setValue(v);
			oThis.hide();
		})
		this.panelCancelButton = u.makeDOM('<button class="u-button" style="float:right;">Cancel</button>');
		this.panelNavDiv.appendChild(this.panelCancelButton);
		u.on(this.panelCancelButton,'click',function(){
			oThis.hide();
		})
		
		var d = new Date();
		this.panelHourInput.value = d.getHours() > 9? '' + d.getHours():'0' + d.getHours();
		this.panelMinInput.value = d.getMinutes() > 9? '' + d.getMinutes():'0' + d.getMinutes();	
		this.panelSecInput.value = d.getSeconds() > 9? '' + d.getSeconds():'0' + d.getSeconds();
		this.element.parentNode.appendChild(this.panelDiv);
	}
	
	u.Time.fn.setValue = function(value) {
		var hour = '',min = '', sec = '';
		value = value? value: '';
		if (value == this.input.value) return;
		if(value && value.indexOf(':') > -1){
			var vA = value.split(":");
			var hour = vA[0];
			hour = hour % 24;
			hour = hour > 9 ?'' + hour : '0' + hour;
			var min = vA[1];
			min = min % 60;
			min = min > 9 ?'' + min : '0' + min;
			var sec = vA[2];
			sec = sec % 60;
			sec = sec > 9 ?'' + sec : '0' + sec;
			
			value = hour + ':' + min + ':' + sec;
		}
		this.input.value = value;
		this.createPanel();
		
		this.panelHourInput.value = hour;
		this.panelMinInput.value = min;	
		this.panelSecInput.value = sec;
		this.trigger('valueChange', {value:value})
	}
	
	u.Time.fn.focusEvent = function() {
		var self = this;
		u.on(this.element,'click', function(e) {
			self.show(e);

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}
	
	//下拉图标的点击事件
	u.Time.fn.clickEvent = function() {
		var self = this;		
		var caret = this.element.nextSibling
		u.on(caret,'click',function(e) {
			self.show(e);
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}


	u.Time.fn.show = function(evt) {

		var inputValue = this.input.value;
		this.setValue(inputValue);
		
		var oThis = this;
		this.createPanel();
		
		/*因为元素可能变化位置，所以显示的时候需要重新计算*/
		this.width = this.element.offsetWidth;
		if(this.width < 300)
			this.width = 300;
		
		this.panelDiv.style.width = this.width + 'px';
		u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });
		this.panelDiv.style.zIndex = u.getZIndex();
        u.addClass(this.panelDiv, 'is-visible');

        document.body.onscroll = function(){
            u.showPanelByEle({
                ele:oThis.input,
                panel:oThis.panelDiv,
                position:"bottomLeft"
            });
        }
        
        var callback = function (e) {
            if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
            	u.off(document,'click',callback);
                // document.removeEventListener('click', callback);
                this.hide();
            }
        }.bind(this);
        u.on(document,'click',callback);
        // document.addEventListener('click', callback);
	}
	
	u.Time.fn.clickPanel = function(dom){
		while(dom){
			if(dom == this.panelDiv){
				return true
			}else{
				dom = dom.parentNode;
			}
		}
		return false;
	}

	u.Time.fn.hide = function() {
		u.removeClass(this.panelDiv, 'is-visible');
        this.panelDiv.style.zIndex = -1;
	}

	if (u.compMgr){
		u.compMgr.regComp({
			comp: u.Time,
			compAsString: 'u.Time',
			css: 'u-time'
		})
		if(u.isIE8){
			u.compMgr.regComp({
				comp: u.Time,
				compAsString: 'u.ClockPicker',
				css: 'u-clockpicker'
			})
		}
	}
	
	




u.YearMonth = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			//u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.year = d.getFullYear();
			this.startYear = this.year - this.year % 10 - 1;
			this.month = d.getMonth() + 1;
			
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.YearMonth.fn = u.YearMonth.prototype;

u.YearMonth.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillYear();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-date-panel" style="padding:0px;margin:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	// this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
    // this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');
    
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillYear();
	this.element.parentNode.appendChild(this.panelDiv);
}

/**
 *填充年份选择面板
 * @private
 */
u.YearMonth.fn._fillYear = function(type){
    var oldPanel,year,template,yearPage,titleDiv,yearDiv, i,cell;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
        this.panelContentDiv.removeChild(oldPanel);
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title"></div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    yearPage = u.makeDOM(template);
    titleDiv = yearPage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = (this.startYear) + '-' + (this.startYear + 11);
    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == this.year){
            u.addClass(cell, 'current');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    var oThis = this;
    u.on(yearDiv, 'click', function(e){
        var _y = e.target._value;
        oThis.year = _y;
        oThis._fillMonth();
        u.stopEvent(e);
    });
	
	this.preBtn.style.display = 'block';
	this.nextBtn.style.display = 'block';
	// this._zoomIn(yearPage);
	this.panelContentDiv.appendChild(yearPage);
	this.contentPage = yearPage;
    this.currentPanel = 'year';
};

/**
 * 填充月份选择面板
 * @private
 */
u.YearMonth.fn._fillMonth = function(){
    var oldPanel,template,monthPage,_month,cells,i;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	this.panelContentDiv.removeChild(oldPanel);
    _month = this.month;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">'+_month+'月</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    cells =monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month == i + 1){
            u.addClass(cells[i],'current');
        }
        cells[i]._value = i + 1;
        new URipple(cells[i]);
    }
    var oThis = this;
    u.on(monthPage, 'click', function(e){
        var _m = e.target._value;
        oThis.month = _m;
        monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
        oThis.setValue(oThis.year + '-' + oThis.month);
        oThis.hide();
    });
    
    this.preBtn.style.display = 'none';
	this.nextBtn.style.display = 'none';
	this._zoomIn(monthPage);
    this.currentPanel = 'month';
};


/**
 * 淡入动画效果
 * @private
 */
u.YearMonth.fn._zoomIn = function(newPage){
    if (!this.contentPage){
        this.panelContentDiv.appendChild(newPage);
        this.contentPage = newPage;
        return;
    }
    u.addClass(newPage, 'zoom-in');
    this.panelContentDiv.appendChild(newPage);
    if(u.isIE8){
        this.contentPage = newPage;
    }else{
        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this.panelContentDiv.removeChild(this.contentPage);
            this.contentPage = newPage;
        }.bind(this);
        if (this.contentPage){
            newPage.addEventListener('transitionend', cleanup);
            newPage.addEventListener('webkitTransitionEnd', cleanup);
        }
        window.requestAnimationFrame(function() {
                u.addClass(this.contentPage, 'is-hidden');
                u.removeClass(newPage, 'zoom-in');
        }.bind(this));
    }
    
};


u.YearMonth.fn.setValue = function(value) {
	value = value? value: '';
	if(value && value.indexOf('-') > -1){
		var vA = value.split("-");
		this.year = vA[0];
		var month = vA[1];
		this.month = month % 12;
		if(this.month == 0)
			this.month = 12;
	
		value = this.year + '-' + this.month;
	}
	this.value = value;
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.YearMonth.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.YearMonth.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.YearMonth.fn.show = function(evt) {
	var oThis = this;
	if(this.value && this.value.indexOf('-') > -1){
		var vA = this.value.split("-");
		this.year = vA[0];
		var month = vA[1];
		this.month = month % 12;
		if(this.month == 0)
			this.month = 12;
	}
	this.createPanel();
	/*因为元素可能变化位置，所以显示的时候需要重新计算*/
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    
	this.panelDiv.style.width = this.width + 'px';
	u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });

     document.body.onscroll = function(){
        u.showPanelByEle({
            ele:oThis.input,
            panel:oThis.panelDiv,
            position:"bottomLeft"
        });
    }
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
    var oThis = this;
    var callback = function (e) {
        if (e !== evt && e.target !== oThis.input && !oThis.clickPanel(e.target)) {
            // document.removeEventListener('click', callback);
            u.off(document,'click',callback);
        	oThis.hide();
    	}
    };
    u.on(document,'click',callback);
    // document.addEventListener('click', callback);
}

u.YearMonth.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.YearMonth.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.YearMonth,
	compAsString: 'u.YearMonth',
	css: 'u-yearmonth'
})


u.Year = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			//u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.year = d.getFullYear();
			this.defaultYear = this.year;
			this.startYear = this.year - this.year % 10 - 1;
		
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.Year.fn = u.Year.prototype;

u.Year.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillYear();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-date-panel" style="padding:0px;margin:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	// this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
 //    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
    this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');
	
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillYear();
	this.element.parentNode.appendChild(this.panelDiv);
}

/**
 *填充年份选择面板
 * @private
 */
u.Year.fn._fillYear = function(type){
    var oldPanel,year,template,yearPage,titleDiv,yearDiv, i,cell;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	this.panelContentDiv.removeChild(oldPanel);
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title"></div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    yearPage = u.makeDOM(template);
    titleDiv = yearPage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = (this.startYear) + '-' + (this.startYear + 11);
    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == this.year){
            u.addClass(cell, 'current');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    u.on(yearDiv, 'click', function(e){
        var _y = e.target._value;
        this.year = _y;
        this.setValue(_y);
        this.hide();
        u.stopEvent(e);
    }.bind(this));
	
	this.preBtn.style.display = 'block';
	this.nextBtn.style.display = 'block';
	this.panelContentDiv.appendChild(yearPage);
	
    this.currentPanel = 'year';
};

u.Year.fn.setValue = function(value) {
	value = value? value: '';
	this.value = value;
	if(value){
		this.year = value;
	}else{
		this.year = this.defaultYear;
	}
	this.startYear = this.year - this.year % 10 - 1;
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.Year.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.Year.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.Year.fn.show = function(evt) {
	var oThis = this;
	this.createPanel();
	
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    
	this.panelDiv.style.width = 152 + 'px';
	u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });
    document.body.onscroll = function(){
        u.showPanelByEle({
            ele:oThis.input,
            panel:oThis.panelDiv,
            position:"bottomLeft"
        });
    }
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
        
    var callback = function (e) {
        if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
        	u.off(document,'click',callback);
            // document.removeEventListener('click', callback);
        	this.hide();
    	}
    }.bind(this);
    u.on(document,'click',callback);
    // document.addEventListener('click', callback);
}

u.Year.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.Year.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.Year,
	compAsString: 'u.Year',
	css: 'u-year'
})


u.Month = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			//u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.month = d.getMonth() + 1;
			this.defaultMonth = this.month;
			
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.Month.fn = u.Month.prototype;

u.Month.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillMonth();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-date-panel" style="padding:0px;margin:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillMonth();
	this.element.parentNode.appendChild(this.panelDiv);
}


/**
 * 填充月份选择面板
 * @private
 */
u.Month.fn._fillMonth = function(){
    var oldPanel,template,monthPage,_month,cells,i;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	this.panelContentDiv.removeChild(oldPanel);
    _month = this.month;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">'+_month+'月</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    cells =monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month == i + 1){
            u.addClass(cells[i],'current');
        }
        cells[i]._value = i + 1;
        new URipple(cells[i]);
    }
    u.on(monthPage, 'click', function(e){
        var _m = e.target._value;
        this.month = _m;
        monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
        this.setValue(_m);
        this.hide();
    }.bind(this));
    
    this.preBtn.style.display = 'none';
	this.nextBtn.style.display = 'none';
    this.panelContentDiv.appendChild(monthPage);
    this.currentPanel = 'month';
};




u.Month.fn.setValue = function(value) {
	value = value? value: '';
	this.value = value;
	if(value){
		this.month = value;
	}else{
		this.month = this.defaultMonth;
	}
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.Month.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.Month.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.Month.fn.show = function(evt) {
	var oThis = this;
	this.createPanel();
	
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });
    document.body.onscroll = function(){
        u.showPanelByEle({
            ele:oThis.input,
            panel:oThis.panelDiv,
            position:"bottomLeft"
        });
    }
	this.panelDiv.style.width = 152 + 'px';
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
        
    var callback = function (e) {
        if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
        	u.off(document,'click',callback);
            // document.removeEventListener('click', callback);
        	this.hide();
    	}
    }.bind(this);
    u.on(document,'click',callback);
    // document.addEventListener('click', callback);
}

u.Month.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.Month.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.Month,
	compAsString: 'u.Month',
	css: 'u-month'
})


u.ClockPicker = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.format = this.options['format'] || u.core.getMaskerMeta('time').format;
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			if(u.isMobile){
				this.input.setAttribute('readonly', 'readonly')
			}
			u.addClass(this.element,'u-text');
			
			this.template = '<div class="u-clock-ul popover clockpicker-popover" style="padding:0px;">';
			this.template += '<div class="popover-title"><button class="u-button u-date-clean u-clock-clean" >清空</button><span class="clockpicker-span-hours">02</span> : <span class="clockpicker-span-minutes text-primary">01</span><span class="clockpicker-span-am-pm"></span></div>';
			this.template += '<div class="popover-content">';
			this.template += '	<div class="clockpicker-plate">';
			this.template += '		<div class="clockpicker-canvas">';
			this.template += '			<svg class="clockpicker-svg">';
			this.template += '				<g transform="translate(100,100)">';
			this.template += '					<circle class="clockpicker-canvas-bg clockpicker-canvas-bg-trans" r="13" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
			this.template += '					<circle class="clockpicker-canvas-fg" r="3.5" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
			this.template += '					<line x1="0" y1="0" x2="8.362277061412277" y2="-79.56175162946187"></line>';
			this.template += '					<circle class="clockpicker-canvas-bearing" cx="0" cy="0" r="2"></circle>';
			this.template += '				</g>';
			this.template += '			</svg>';
			this.template += '		</div>';
			this.template += '		<div class="clockpicker-dial clockpicker-hours" style="visibility: visible;">';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-1" >00</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-2" >1</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-3" >2</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-4" >3</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-5" >4</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-6" >5</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-7" >6</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-8" >7</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-9" >8</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-10" >9</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-11" >10</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-12" >11</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-13" >12</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-14" >13</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-15" >14</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-16" >15</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-17" >16</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-18" >17</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-19" >18</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-20" >19</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-21" >20</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-22" >21</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-23" >22</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-24" >23</div>';
			this.template += '		</div>';
			this.template += '		<div class="clockpicker-dial clockpicker-minutes" style="visibility: hidden;">';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-25" >00</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-26" >05</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-27" >10</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-28" >15</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-29" >20</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-30" >25</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-31" >30</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-32" >35</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-33" >40</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-34" >45</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-35" >50</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-36" >55</div>';
			this.template += '		</div>';
			this.template += '	</div><span class="clockpicker-am-pm-block"></span></div>';
			this.template += '	</div>';
	        u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
			
			var d = new Date();
			this.defaultHour = d.getHours() > 9? '' + d.getHours():'0' + d.getHours();
			this.defaultMin = d.getMinutes() > 9? '' + d.getMinutes():'0' + d.getMinutes();	
			this.defaultSec = d.getSeconds() > 9? '' + d.getSeconds():'0' + d.getSeconds();
			
			this.hours = this.defaultHour;
			this.min = this.defaultMin;
			this.sec = this.defaultSec;
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

	u.ClockPicker.fn = u.ClockPicker.prototype;

	/**
 * 淡入动画效果
 * @private
 */
u.ClockPicker.fn._zoomIn = function(newPage){
	
     u.addClass(newPage, 'zoom-in');
    
    var cleanup = function() {
    	u.off(newPage,'transitionend', cleanup);
    	u.off(newPage,'webkitTransitionEnd', cleanup);
        // this.panelContentDiv.removeChild(this.contentPage);
        this.contentPage = newPage;
    }.bind(this);
    if (this.contentPage){
    	u.on(newPage,'transitionend', cleanup);
    	u.on(newPage,'webkitTransitionEnd', cleanup);
    }
    setTimeout(function(){
    	newPage.style.visibility = 'visible';
    	u.removeClass(newPage, 'zoom-in');
    },150)
};

	u.ClockPicker.fn.createPanel = function(){
		if(this.panelDiv)
			return;
		var oThis = this;
		this.panelDiv = u.makeDOM(this.template);
		
		this.hand = this.panelDiv.querySelector('line');
		this.bg = this.panelDiv.querySelector('.clockpicker-canvas-bg');
		this.fg = this.panelDiv.querySelector('.clockpicker-canvas-fg');
		this.titleHourSpan = this.panelDiv.querySelector('.clockpicker-span-hours');
		this.titleMinSpan = this.panelDiv.querySelector('.clockpicker-span-minutes');
		this.hourDiv = this.panelDiv.querySelector('.clockpicker-hours');
		this.minDiv = this.panelDiv.querySelector('.clockpicker-minutes');
		this.btnClean = this.panelDiv.querySelector('.u-date-clean');
		if(!u.isMobile)
			this.btnClean.style.display = 'none';
		this.currentView = 'hours';
		u.on(this.hourDiv,'click',function(e){
			var target = e.target;
			if(u.hasClass(target,'clockpicker-tick')){
				this.hours = target.innerHTML;
				this.hours = this.hours > 9 || this.hours == 0? '' + this.hours:'0' + this.hours;
				this.titleHourSpan.innerHTML = this.hours;
				this.hourDiv.style.visibility = 'hidden';
				// this.minDiv.style.visibility = 'visible';
				this._zoomIn(this.minDiv)
				this.currentView = 'min';
				this.setHand();
			}
		}.bind(this));
		
		u.on(this.minDiv,'click',function(e){
			var target = e.target;
			if(u.hasClass(target,'clockpicker-tick')){
				this.min = target.innerHTML;
				// this.min = this.min > 9 || this.min == 00? '' + this.min:'0' + this.min;
				this.titleMinSpan.innerHTML = this.min;
				this.minDiv.style.visibility = 'hidden';
				this.hourDiv.style.visibility = 'visible';
				this.currentView = 'hours';
				var v = this.hours + ':' + this.min + ':' + this.sec;
				this.setValue(v);
				this.hide();
			}
		}.bind(this));

		u.on(this.btnClean,'click',function(e){
			this.setValue("");
			this.hide();
		}.bind(this));
		
		document.body.appendChild(this.panelDiv);
	}
	
	u.ClockPicker.fn.setHand = function(){
		var dialRadius = 100,
		innerRadius = 54,
		outerRadius = 80;
		var view = this.currentView,
			value = this[view],
			isHours = view === 'hours',
			unit = Math.PI / (isHours ? 6 : 30),
			radian = value * unit,
			radius = isHours && value > 0 && value < 13 ? innerRadius : outerRadius,
			x = Math.sin(radian) * radius,
			y = - Math.cos(radian) * radius;
			this.setHandFun(x,y);
	}
	
	u.ClockPicker.fn.setHandFun = function(x,y,roundBy5,dragging){
		var dialRadius = 100,
		innerRadius = 54,
		outerRadius = 80;
		
		var radian = Math.atan2(x, - y),
			isHours = this.currentView === 'hours',
			unit = Math.PI / (isHours ? 6 : 30),
			z = Math.sqrt(x * x + y * y),
			options = this.options,
			inner = isHours && z < (outerRadius + innerRadius) / 2,
			radius = inner ? innerRadius : outerRadius,
			value;
			
			if (this.twelvehour) {
				radius = outerRadius;
			}

		// Radian should in range [0, 2PI]
		if (radian < 0) {
			radian = Math.PI * 2 + radian;
		}

		// Get the round value
		value = Math.round(radian / unit);

		// Get the round radian
		radian = value * unit;

		// Correct the hours or minutes
		if (options.twelvehour) {
			if (isHours) {
				if (value === 0) {
					value = 12;
				}
			} else {
				if (roundBy5) {
					value *= 5;
				}
				if (value === 60) {
					value = 0;
				}
			}
	   } else {
			if (isHours) {
				if (value === 12) {
					value = 0;
				}
				value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
			} else {
				if (roundBy5) {
					value *= 5;
				}
				if (value === 60) {
					value = 0;
				}
			}
		}
		
		// Set clock hand and others' position
		var w = this.panelDiv.querySelector('.clockpicker-plate').offsetWidth;
		var u = w / 200;
		var cx = Math.sin(radian) * radius * u,
			cy = - Math.cos(radian) * radius * u;
		var iu = 100 * u;
		this.panelDiv.querySelector('g').setAttribute('transform','translate(' + iu + ',' + iu + ')');

		this.hand.setAttribute('x2', cx);
		this.hand.setAttribute('y2', cy);
		this.bg.setAttribute('cx', cx);
		this.bg.setAttribute('cy', cy);
		this.fg.setAttribute('cx', cx);
		this.fg.setAttribute('cy', cy);
	}
	
	u.ClockPicker.fn.setValue = function(value) {
		value = value? value: '';

		if(value == ''){
			this.input.value =  '';
		
			this.trigger('valueChange', {value:''})
			return;
		}


		if(value && value.indexOf(':') > -1){
			var vA = value.split(":");
			var hour = vA[0];
			hour = hour % 24;
			this.hours = hour > 9 ?'' + hour : '0' + hour;
			var min = vA[1];
			min = min % 60;
			this.min = min > 9 ?'' + min : '0' + min;
			var sec = vA[2] || 0;
			sec = sec % 60;
			this.sec = sec > 9 ?'' + sec : '0' + sec;
			
			value = this.hours + ':' + this.min + ':' + this.sec;
		}else{
			this.hours = this.defaultHour;
			this.min = this.defaultMin;
			this.sec = this.defaultSec;
		}
		var _date = new Date();
		_date.setHours(this.hours);
		_date.setMinutes(this.min);
		_date.setSeconds(this.sec);
		var showValue = u.date.format(_date,this.format);
		this.input.value =  showValue;
		
		this.trigger('valueChange', {value:value})
	}
	
	u.ClockPicker.fn.focusEvent = function() {
		var self = this;
		u.on(this.element,'click', function(e) {
			self.show(e);

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}
	
	//下拉图标的点击事件
	u.ClockPicker.fn.clickEvent = function() {
		var self = this;		
		var caret = this.element.nextSibling
		u.on(caret,'click',function(e) {
			self.show(e);
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}


	u.ClockPicker.fn.show = function(evt) {

		var inputValue = this.input.value;
		this.setValue(inputValue);
		
		var self = this;
		this.createPanel();
		this.minDiv.style.visibility = 'hidden';
		this.hourDiv.style.visibility = 'visible';
		this.currentView = 'hours';
		this.titleHourSpan.innerHTML = this.hours;
		this.titleMinSpan.innerHTML = this.min;
		
		/*因为元素可能变化位置，所以显示的时候需要重新计算*/
		if(u.isMobile){
			this.panelDiv.style.position = 'fixed';
			this.panelDiv.style.top = '20%';
			var screenW = document.body.clientWidth;
			var l = (screenW - 226) / 2
			this.panelDiv.style.left = l + 'px';
        	this.overlayDiv = u.makeModal(this.panelDiv);
        	u.on(this.overlayDiv, 'click', function(){
		       self.hide();
		    })
        }else{
	        u.showPanelByEle({
	            ele:this.input,
	            panel:this.panelDiv,
	            position:"bottomLeft"
	        });
		    document.body.onscroll = function(){
		        u.showPanelByEle({
		            ele:self.input,
		            panel:self.panelDiv,
		            position:"bottomLeft"
		        });
		    }  
        }
        
		this.panelDiv.style.zIndex = u.getZIndex();
        u.addClass(this.panelDiv, 'is-visible');
        
   		this.setHand();
        
        var callback = function (e) {
            if (e !== evt && e.target !== this.input && !self.clickPanel(e.target)) {
            	u.off(document,'click', callback);
                this.hide();
            }
        }.bind(this);
        u.on(document,'click', callback);


	}
	
	u.ClockPicker.fn.clickPanel = function(dom){
		while(dom){
			if(dom == this.panelDiv){
				return true
			}else{
				dom = dom.parentNode;
			}
		}
		return false;
	}

	u.ClockPicker.fn.hide = function() {
		u.removeClass(this.panelDiv, 'is-visible');
        this.panelDiv.style.zIndex = -1;
        if(this.overlayDiv){
        	try{
        		document.body.removeChild(this.overlayDiv);	
        	}catch(e){
        		
        	}
        	
        }
	}

	if (u.compMgr)
	
	if(!u.isIE8){
		u.compMgr.regComp({
			comp: u.ClockPicker,
			compAsString: 'u.ClockPicker',
			css: 'u-clockpicker'
		})
	}
	


	u.dialog = function(op) {
		var wrapdiv = document.createElement("div")
		wrapdiv.className = "move-dialog";
		var msgdiv = document.createElement("div")
		
		if(op.type){
		    msgdiv.className = "move-alert alert alert-"+op.type + " alert-dismissible"		   
		}else{
		    msgdiv.className = "move-alert alert alert-warning alert-dismissible"
		}
      	//var msgdiv = $('<div class="move-dialog "><div class="move-alert alert alert-'+op.type+' alert-dismissible"></div></div>');
        closebtn = '<button type="button" class="close"  aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        op.title = op.title || trans('dialog.info_dialog', '提示窗口')
		var titlediv = '<h4>'+op.title+'</h4>';
	    	       
	    
        if(op.url){
			 var contentdiv = '<p class="dialog_p"><iframe class="dialog_iframe" src='+op.url+'></iframe></p>'
		}else{
			 var contentdiv = '<p style="position: absolute;top: 50px;bottom: 20px;overflow: auto;left: 30px;right: 25px;"></p>'         			 
        }
       	
        var btndiv,movable,mouseX_down,mouseY_down,mouseX_move,mouseY_move,diawidth,diaheight,tmpmove,bodywidth,bodyheight;
     
        bodywidth = window.innerWidth?window.innerWidth:document.body.clientWidth;
        bodyheight = window.innerHeight?window.innerHeight:document.body.clientHeight

		if(op.width){
       		u.css(wrapdiv,{width:op.width})
	    }else{
			u.css(wrapdiv,{width:"520px"})
		}
	    if(op.height){
	       	u.css(wrapdiv,{height:op.height})
	    }
		if(op.url){
			msgdiv.insertAdjacentHTML("beforeEnd",closebtn+titlediv+contentdiv)
		}else{
			msgdiv.insertAdjacentHTML("beforeEnd",closebtn+titlediv)
			var p = u.makeDOM(contentdiv);
			msgdiv.appendChild(p);
			p.insertAdjacentHTML("beforeEnd",op.msg);
		}
        //msgdiv.find(".alert").append(closebtn).append(titlediv).append(contentdiv).append(btndiv)
		//msgdiv.wrap("<div style='padding:5px'></div>");
		
		u.on(msgdiv.querySelector('[aria-label="Close"]'),'click',closeDialog) 
        function closeDialog(){
		    u.removeDialog()
			if(op.cancelfn){
				op.cancelfn
			}
		}
		if(op.backdrop) { 
	      //添加遮罩层
	        document.body.insertAdjacentHTML("beforeEnd",'<div class="alert-backdrop" role="alert-dialog-backdrop"></div>');     
	    }
        
		
		wrapdiv.appendChild(msgdiv)		
       
		
		if(op.movable){								
        	u.on(wrapdiv,"mousedown",function(e){
				
        		diawidth = wrapdiv.clientWidth,diaheight = wrapdiv.clientHeight;
	        	mouseX_down = e.clientX - wrapdiv.offsetLeft 
	        	mouseY_down = e.clientY - wrapdiv.offsetTop
				//调整同时调整宽度高度
				if(mouseX_move < 11 && mouseY_move < 12){
	    		//左上角
	    			
					wrapdiv_change()
	    			movable = 9;
	    			u.css(wrapdiv,{cursor: "se-resize"})
	    		
	    		}else if(mouseX_move > (diawidth - 20)  && mouseY_move > (diaheight- 10)){
	    		//右下角
	    			
					wrapdiv_change()
	    			movable = 8;
	    			u.css(wrapdiv,{cursor: "se-resize"})
	    		}else if(mouseX_move < 11 && mouseY_move > (diaheight- 10)){
	    		//左下角
	    			
					wrapdiv_change()
	    			movable = 7;
	    			 u.css(wrapdiv,{cursor: "ne-resize"})
	    		}else if( mouseX_move > (diawidth - 20) && mouseY_move < 12 ){
	    		//右上角
	    			
					wrapdiv_change()
	    			movable = 6;
	    			 u.css(wrapdiv,{cursor: "ne-resize"})
	    		//调整窗口宽度	
	    		}else if(mouseX_move < 12 ){
					
					wrapdiv_change()
					movable = 5;
					 u.css(wrapdiv,{cursor: "e-resize"})
	    		
	    		}else if(mouseX_move > (diawidth - 20)){
	    			
					wrapdiv_change()
					movable = 4;
					 u.css(wrapdiv,{cursor: "e-resize"})
	    		//调整窗口高度	
	    		}else if(mouseY_move < 11 ){
	    			
	    			movable = 3;
	    			wrapdiv_change()
	    			 u.css(wrapdiv,{cursor: "n-resize"})
	    		
	    		}else if(mouseY_move > (diaheight- 10) ){
	    			
	    			movable = 2;
	    			wrapdiv_change()
	    			 u.css(wrapdiv,{cursor: "n-resize"})
	    		//移动窗口	
	    		}else if(e.target.nodeName == 'H4'){
	    			movable = 1;
	    			wrapdiv_move();
	    			 u.css(wrapdiv,{cursor: "auto"})
	    		}
        		
        	})
			u.on(document,"mousemove",function(e){				
				diawidth = wrapdiv.clientWidth,diaheight = wrapdiv.clientHeight;
        		mouseX_move = (e.clientX - wrapdiv.offsetLeft)
        		mouseY_move = (e.clientY - wrapdiv.offsetTop)
			
        		if(movable == 1){       			
	        		 u.css(wrapdiv,{left:e.clientX-mouseX_down,top:e.clientY-mouseY_down,cursor: "all-scroll"})
	        		return
        		}else if(movable == 2){
        			 u.css(wrapdiv,{bottom:bodyheight - e.clientY -20 })        			
	        		return
        		}else if(movable == 3){
        			  u.css(wrapdiv,{top:e.clientY -20 })   			
	        		return
        		}else if(movable == 4){
        			console.log(bodywidth - e.clientX -20 )
        			 u.css(wrapdiv,{right:bodywidth - e.clientX -20 })   
	        		return
	        	}else if(movable == 5){
        			 u.css(wrapdiv,{left:e.clientX -20 })
	        		return
        		}else if(movable == 6){
        			 u.css(wrapdiv,{top:e.clientY -20,right:bodywidth- e.clientX -20 })  
	        		return
				}else if(movable == 7){
        			 u.css(wrapdiv,{left:e.clientX -20,bottom:bodyheight - e.clientY -20 })  
	        		return
				}else if(movable == 8){
        			 u.css(wrapdiv,{bottom:bodyheight - e.clientY -20,right:bodywidth- e.clientX -20 })  
	        		return
        		}else if(movable == 9){
        			 u.css(wrapdiv,{top:e.clientY -20,left:e.clientX -20 })  
	        		return

        		}else{
					
        			if((mouseX_move < 11 && mouseY_move < 12)||(mouseX_move > (diawidth - 20)  && mouseY_move > (diaheight- 10)) ){
	        			 u.css(wrapdiv,{cursor: "se-resize"})
	        		}else if((mouseX_move < 11 && mouseY_move > (diaheight- 10))||(mouseX_move > (diawidth - 20)  && mouseY_move < 12) ){
	        			 u.css(wrapdiv,{cursor: "ne-resize"})
	        		}else if( mouseX_move < 12 || mouseX_move > (diawidth - 20) ){
        				 u.css(wrapdiv,{cursor: "e-resize"})
	        		}else if(mouseY_move < 11 || mouseY_move > (diaheight- 10) ){
	        			 u.css(wrapdiv,{cursor: "n-resize"})
	        		}else {
	        			 u.css(wrapdiv,{cursor: "auto"})
	        		}
        		}
        	})
        	u.on(document,"mouseup",function(){       		
        		movable = false;
        		u.css(wrapdiv,{cursor: "auto"});
        	})
        
        } 
		
		function wrapdiv_move(){
			console.log(wrapdiv.clientWidth,  wrapdiv.clientHeight,1)
			 u.css(wrapdiv,{width:wrapdiv.clientWidth-20,height:wrapdiv.clientHeight-20,right:"auto",bottom:"auto"})
		}
		function wrapdiv_change(){
		
			console.log(wrapdiv.clientWidth,  wrapdiv.clientHeight,2)
			 u.css(wrapdiv,{width:"auto",height:"auto",
						left:wrapdiv.offsetLeft, 
						top:wrapdiv.offsetTop,
						right:bodywidth- wrapdiv.offsetLeft - wrapdiv.clientWidth, 
						bottom:bodyheight - wrapdiv.offsetTop -  wrapdiv.clientHeight
			})
		}
		
		document.body.appendChild(wrapdiv)
		wrapdiv_resize();
		function wrapdiv_resize(){
			var divWidth = wrapdiv.offsetWidth || 500,divHeight = wrapdiv.offsetHeight    	
			wrapdiv.style.left = ((window.innerWidth?window.innerWidth:document.body.clientWidth)- divWidth)/2 + "px"; 
			wrapdiv.style.top = ((window.innerHeight?window.innerHeight:document.body.clientHeight) - divHeight)/2 + "px"			
		}
		
    }
	u.removeDialog = function(){
		 // var tmp;
      	// (tmp = $('.move-dialog ')).length && tmp.remove();
		// (tmp = $('.alert-backdrop')).length && tmp.remove(); 
		var divs = document.querySelectorAll('.move-dialog,.alert-backdrop');
		for(var i = 0;i < divs.length;i++){
			document.body.removeChild(divs[i]);
		}
		//u.off(document,'mouseup.dialog')		
	}
/** 
 * grid v3.0.6
 * grid
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/grid#readme
 * bugs : https://github.com/iuap-design/grid/issues
 **/ 
;
(function($, window, document, undefined) {
	var gridBrowser = {},userAgent = navigator.userAgent,ua = userAgent.toLowerCase(),s;
	if (s=ua.match(/msie ([\d.]+)/)) {
		gridBrowser.isIE = true;
	}
	if (gridBrowser.isIE) {
		var mode = document.documentMode;
		if(mode == null){
		}else{
			if (mode == 8) {
				gridBrowser.isIE8 = true;
			}
			else if (mode == 9) {
				gridBrowser.isIE9 = true;
			}
		}
	}
	/*
	 * 对象所支持的属性及默认值
	 */
	var dataSource = function(options, gridComp) {
		this.init(options, gridComp);
		this.sortRows();
	};
	var gridCompColumn = function(options, gridComp) {
		this.init(options, gridComp);
	};

	var gridComp = function(ele, options) {
		this.init(ele,options);
		this.initGrid();
	};
	/*
	 * 对象提供的方法
	 */
	gridComp.prototype = {
		/*
		 * 处理参数
		 */
		init: function(ele, options){
			this.dataSource = dataSource;
			this.gridCompColumn = gridCompColumn;
			this.ele = ele[0];
			this.$ele = ele;
			this.initDefault();
			this.options = $.extend({}, this.defaults, options);
			this.getBooleanOptions();
			this.transDefault = {
				ml_show_column:'显示/隐藏列',
				ml_clear_set:'清除设置',
				ml_no_rows:'无数据',
				ml_sum:'合计:',
				ml_close:'关闭'
			}
			this.transMap = $.extend({},this.transDefault,options.transMap);
			this.gridCompColumnFixedArr = new Array();
			this.gridCompColumnArr = new Array(); // 存储设置默认值之后的columns对象
			// this.headerHeight = 45; // header区域高度
			this.countContentHeight = true;// 是否计算内容区的高度（是否为流式）
			this.minColumnWidth = 80; // 最小列宽
			this.scrollBarHeight = 16; // 滚动条高度
			this.numWidth = 40; // 数字列宽度
			this.multiSelectWidth = 40; // 复选框列宽度
			this.multiWidth = 40; // 复选框宽度

			this.basicGridCompColumnArr = new Array(); // 存储基本的columns对象，用于清除设置
			this.columnMenuWidth = 160; // column menu的宽度
			this.columnMenuHeight = 33; // column menu的高度
			this.gridCompColumnFixedArr = new Array(); // 存储设置默认值之后的固定列columns对象
			this.gridCompLevelColumn = new Array(); // 存储多级表头时的多级 
			this.headerHeight = 44 * parseInt(this.options.maxHeaderLevel) + 1;
			this.gridCompHiddenLevelColumnArr = new Array(); // 存储自动隐藏时隐藏优先级排序后的column
			this.treeLeft = 10; // 树表时每一级之间的差值
		},
		getBooleanOptions:function(){
			this.options.cancelFocus = this.getBoolean(this.options.cancelFocus);
			this.options.showHeader = this.getBoolean(this.options.showHeader);
			this.options.showNumCol = this.getBoolean(this.options.showNumCol);
			this.options.multiSelect = this.getBoolean(this.options.multiSelect);
			this.options.columnMenu = this.getBoolean(this.options.columnMenu);
			this.options.canDrag = this.getBoolean(this.options.canDrag);
			this.options.overWidthHiddenColumn = this.getBoolean(this.options.overWidthHiddenColumn);
			this.options.sortable = this.getBoolean(this.options.sortable);
			this.options.showSumRow = this.getBoolean(this.options.showSumRow);
			this.options.canSwap = this.getBoolean(this.options.canSwap);
			this.options.showTree = this.getBoolean(this.options.showTree);
			this.options.autoExpand = this.getBoolean(this.options.autoExpand);
			this.options.needTreeSort = this.getBoolean(this.options.needTreeSort);
		},
		/*
		 * 初始化默认参数
		 */
		initDefault: function(){
			this.defaults = {
				id: 'grid',
				cancelFocus:false, // 第二次点击是否取消focus
				showHeader: true, // 是否显示表头
				showNumCol: false, // 是否显示数字列
				multiSelect:false, // 是否显示复选框
				columnMenu: true, // 是否存在列头操作按钮
				canDrag: true, // 是否可以拖动
				formMaxWidth: 300, // 整体宽度小于某一值之后以form展示
				formMaxWidth:0,
				maxHeaderLevel:1, // header的最高层级，用于计算header区域的高度
				overWidthHiddenColumn:false, // 宽度不足时是否自动隐藏column
				sortable: true, // 是否可以排序
				showSumRow: false, // 是否显示合计行
				canSwap: true, // 是否可以交换列位置
				showTree:false, // 是否显示树表
				autoExpand:true, // 是否默认展开
				needTreeSort:false, // 是否需要对传入数据进行排序，此设置为优化性能，如果传入数据是无序的则设置为true，如果可以保证先传入父节点后传入子节点则设置为false提高性能
			}
		},
		/*
		 * 创建grid
		 */
		initGrid: function() {
			if(!this.options.columns || this.options.columns.length == 0){
				return;
			}
			var oThis = this;
			this.initOptions();
			this.initVariable();
			this.initWidthVariable();
			this.initGridCompColumn();
			this.initDataSource();
			this.createDivs();
			// UAP-NC 轻量化项目：切换tab时添加form会消失问题
			this.inte = setInterval(function(){oThis.setIntervalFun.call(oThis)}, 300);
		},
		/*
		 * 销毁自身
		 */
		destroySelf: function(){
			clearInterval(this.inte);
			this.$ele.data('gridComp',null);
			this.ele.innerHTML = '';
		},
		/*
		 * 对传入参数进行格式化处理
		 * 宽度、高度处理
		 * 左侧区域宽度计算
		 * 除去内容区域的高度
		 */
		initOptions: function() {
			this.options.width = this.formatWidth(this.options.width);
			this.options.height = this.formatWidth(this.options.height);
			if(this.options.height == '100%' || !this.options.height){
				this.countContentHeight = false;
			}
			this.initOptionsTree();
			this.leftW = 0; // 左侧区域宽度（数字列复选框等）
			if (this.options.showNumCol) {
				this.leftW += this.numWidth;
			}
			if(this.options.multiSelect){
				this.leftW += this.multiWidth;
			}
			this.exceptContentHeight = 0; // 内容区域之外的高度
			if(this.options.showHeader){
				this.exceptContentHeight +=this.headerHeight;
			}
			this.fixedWidth = 0;
			if(this.options.maxHeaderLevel > 1){
				this.options.canSwap = false;
			}
			// 获取缓存id
			var url = window.location.href;
			var index = url.indexOf('?');
			if(index > 0){
				url = url.substring(0,index);
			}
			this.localStorageId = this.options.id + url;
			
		},
		initOptionsTree:function(){

		},
		/*
		 * 初始化变量
		 */
		initVariable:function(){
			this.initDataSourceVariable();
			// 鼠标点击移动时位置记录
			this.mouseUpX = 'mouseUpX';
			this.mouseUpY = 'mouseUpY';
			this.mouseDownX = 'mouseDownX';
			this.mouseDownY = 'mouseDownY';
			this.mouseMoveX = 'mouseMoveX';
			this.mouseMoveY = 'mouseMoveY';
			this.scrollLeft = 0; // 记录横向滚动条
			this.scrollTop = 0;// 记录纵向滚动条
			this.showType = ''; // 记录grid显示方式，form和grid
			this.createGridFlag = false; // 是否已经创建grid展示
			this.columnClickX = 0; // 点击处的X坐标
			this.columnClickY = 0; // 点击处的Y坐标
			this.columnMenuMove = false;// 是否在column menu区域移动
			this.firstColumn = true; // 用于记录是否已经存在第一列，true表示还没有，false表示已经存在
			this.lastVisibleColumn = null;
			this.lastVisibleColumnWidth = 0;
			this.columnMenuMove = false;// 是否在column menu区域移动
			this.createColumnMenuFlag = false; // 是否已经创建column menu 区域
			this.menuColumnsHeight = 0;
			this.createFormFlag = false; // 是否已经创建form展示
			this.$sd_storageData = null;// 本地缓存内容为object
		},
		/*
		 * 初始化datasource相关变量
		 */
		initDataSourceVariable:function(){
			this.selectRows = new Array();
			this.selectRowsObj = new Array();
			this.selectRowsIndex = new Array();
			this.allRows = new Array();
			this.eidtRowIndex = -1; // 当前修改行
		},

		// 初始化宽度相关变量
		initWidthVariable:function(){
			// 计算用变量
			this.wholeWidth = 0; // 整体宽度
			this.wholeHeight = 0; // 整体高度
			this.rowHeight = 0; // 数据行高度
			this.contentRealWidth = 0; // 内容区真实宽度,严格按照设置的width计算的宽度
			this.contentWidth = 0; // 内容区宽度，自动扩展之后的宽度
			this.contentMinWidth = 0; // 内容区最小宽度,即可视宽度
			this.contentHeight = 0; //内容区高度
			this.fixedRealWidth = 0; // 固定区域真实宽度
			this.fixedWidth = 0; // 固定区域宽度
		},
		/*
		 * 创建gridCompColumn对象方便后续处理
		 */
		initGridCompColumn: function() {
			var oThis = this;
			this.initGridCompColumnVar();
			if (this.options.columns) {
				$.each(this.options.columns, function(i) {
					oThis.initGridCompColumnFun(this);
				});
			}
			this.initGridCompColumnLoacl();
			this.initGridHiddenLevelColumn();
			this.initGridCompFixedColumn();
			this.columnsVisibleFun();
		},
		initGridCompColumnVar: function(){
			this.gridCompColumnArr = new Array(); 
			this.basicGridCompColumnArr = new Array();
			this.gridCompColumnFixedArr = new Array(); 
			this.gridCompLevelColumn = new Array(); 
			this.gridCompHiddenLevelColumnArr = new Array();  
		},
		initGridCompColumnFun: function(columnOptions){
			var column = new gridCompColumn(columnOptions, this);
			column.options.realWidth = column.options.width;
			this.gridCompColumnArr.push(column);
			this.initGridCompColumnColumnMenuFun(columnOptions);
			this.initGridCompColumnHeaderLevelFun(columnOptions);
		},
		initGridCompColumnColumnMenuFun: function(columnOptions){
		},
		initGridCompColumnHeaderLevelFun: function(columnOptions){
		},
		initGridCompColumnLoacl: function(columnOptions){
		},
		initGridHiddenLevelColumn: function(){
		},
		initGridCompFixedColumn:function(){
		},
		/*
		 * 设置某列是否必输
		 */
		setRequired:function(field, value){
		},
		/*
		 * 创建dataSource对象方便后续处理
		 */
		initDataSource: function() {
			var oThis = this;
			this.dataSourceObj = new dataSource(this.options.dataSource,this);
		},
		/*
		 * 创建顶层div以及_top div层
		 * 添加顶层div相关监听
		 */
		createDivs: function() {
			var oThis = this,styleStr = '',str = '';
			this.ele.innerHTML = '';
			if(this.options.width){
				str += 'width:' + this.options.width + ';';
			}else{
				str += 'width:auto;';
			}
			if(this.options.height){
				str += 'max-height:' + this.options.height + ';';
			}else{
				str += 'height:auto;';
			}
			if(str != ''){
				styleStr = 'style="' + str + '"';
			}
			var htmlStr = '<div id="' + this.options.id + '" data-role="grid" class="u-grid" ' + styleStr + '>';
			htmlStr += '</div>';
			this.ele.insertAdjacentHTML('afterBegin', htmlStr);
			// 创建屏幕div,用于拖动等操作
			var htmlStr = '<div id="' + this.options.id + '_top" class="u-grid-top"></div>';
			// this.ele.insertAdjacentHTML('afterBegin', htmlStr);
			document.body.appendChild($(htmlStr)[0]);
			this.initEventFun(); //创建完成之后顶层div添加监听
			this.widthChangeFun(); // 根据整体宽度创建grid或form展示区域
		},
		/*
		 * 创建div区域
		 */
		repaintDivs:function(){
			// 后期可以考虑form展示
			this.repaintGridDivs();
			this.realtimeTableRows = null;
		},		
		/*
		 * 创建grid形式下div区域
		 */
		createGridDivs: function() {
			if (this.createGridFlag) {
				return;
			}
			// 为避免重复渲染，在开始清空里面内容
			if($('#' + this.options.id)[0])
				$('#' + this.options.id)[0].innerHTML = '';
			var htmlStr = '<div id="' + this.options.id + '_grid" class="u-grid-grid">';
				htmlStr += this.createColumnMenu();
				htmlStr += this.createHeader();
			htmlStr += this.createContent();
			htmlStr += '</div>';
			if($('#' + this.options.id)[0])
				$('#' + this.options.id).html(htmlStr);
			this.headerFirstClassFun();
			this.initGridEventFun();
			this.showType = 'grid';
			this.afterGridDivsCreate();
			this.createGridFlag = true;
			this.realtimeTableRows = null;
		},
		/*
		 * 重画grid
		 */
		repaintGridDivs: function() {
			$('#' + this.options.id + '_grid').remove(null, true);
			this.showType = '';
			this.wholeWidth = 0;
			this.createGridFlag = false;
			this.columnsVisibleFun();
			this.widthChangeFun();
			this.realtimeTableRows = null;
		},
		/*
		 * 创建columnMenu区域
		 */
		createColumnMenu: function() {
			return '';
		},
		/*
		 * 创建header区域
		 */
		createHeader: function() {
			var wrapStr = '',headerShowStr = '';
			if(!this.options.showHeader)
				headerShowStr = 'style="display:none;"';
			var htmlStr = '<div class="u-grid-header" id="' + this.options.id + '_header" ' + headerShowStr + '><div class="u-grid-header-wrap" id="' + this.options.id + '_header_wrap" data-role="resizable" ' + wrapStr + '>';
			htmlStr += '<div class="u-grid-header-columnmenu fa fa-bars"></div>';
			if (this.options.multiSelect || this.options.showNumCol) {
				htmlStr += '<div id="' + this.options.id + '_header_left" class="u-grid-header-left" style="width:' + this.leftW + 'px;">';
				if (this.options.multiSelect) {
					if(gridBrowser.isIE8){
						//htmlStr += '<div class="u-grid-header-multi-select" style="width:' + this.multiWidth + 'px;"><input class="u-grid-multi-input"   type="checkbox" id="' + this.options.id + '_header_multi_input"></div>'
						htmlStr += '<div class="u-grid-header-multi-select" style="width:' + this.multiWidth + 'px;"><span class="u-grid-checkbox-outline" id="' + this.options.id + '_header_multi_input"><span class="u-grid-checkbox-tick-outline"></span></span></div>'
						
					}else{
						//htmlStr += '<div class="u-grid-header-multi-select  checkbox check-success" style="width:' + this.multiWidth + 'px;"><input  class="u-grid-multi-input"  type="checkbox" id="' + this.options.id + '_header_multi_input"><label for="' + this.options.id + '_header_multi_input"></label></div>'
						htmlStr += '<div class="u-grid-header-multi-select  checkbox check-success" style="width:' + this.multiWidth + 'px;"><span class="u-grid-checkbox-outline" id="' + this.options.id + '_header_multi_input"><span class="u-grid-checkbox-tick-outline"></span></span></div>'
					}
				}
				if (this.options.showNumCol) {
					htmlStr += '<div class="u-grid-header-num" style="width:' + this.numWidth + 'px;"></div>';
				}
				htmlStr += '</div>';
			}
			htmlStr += this.createHeaderTableFixed();
			htmlStr += this.createHeaderTable();
			htmlStr += '</div>';
			htmlStr += this.createHeaderDrag();;
			htmlStr += '</div>';
			return htmlStr;
		},
		/*
		 * 创建header区域table
		 */
		createHeaderTable:function(createFlag){
			var leftW,positionStr,idStr;
			if(createFlag == 'fixed'){
				leftW = parseInt(this.leftW);
				positionStr = 'absolute;width:'+this.fixedWidth+'px;z-index:11;background:#F9F9F9;';
				idStr = 'fixed_';
			}else{
				leftW = parseInt(this.leftW) + parseInt(this.fixedWidth);
				positionStr = 'relative;';
				idStr = '';
				if(this.contentMinWidth > 0){
					positionStr += 'width:'+this.contentMinWidth+'px;';
				}
			}
			var htmlStr = '<table role="grid" id="' + this.options.id + '_header_'+idStr+'table" style="position:'+ positionStr+';left:' + leftW + 'px">';
			htmlStr += this.createColgroup(createFlag);
			htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_header_'+idStr+'thead">';
			htmlStr += this.createThead(createFlag);
			htmlStr += '</thead></table>';
			return htmlStr;
		},
		createHeaderTableFixed:function(){
			return '';
		},
		createHeaderDrag:function(){
			return '';
		},
		/*
		 * 创建colgroup
		 */
		createColgroup: function(createFlag) {
			var oThis = this,htmlStr = '<colgroup>',gridCompColumnArr;
			if(createFlag == 'fixed'){
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				gridCompColumnArr = this.gridCompColumnArr;
			}
			$.each(gridCompColumnArr, function() {
				if(this.options.visible){
					htmlStr += '<col';
					htmlStr += ' style="width:' + oThis.formatWidth(this.options.width) + '"';
					htmlStr += '>';
				}
			});
			htmlStr += '</colgroup>';
			return htmlStr;
		},
		/*
		 * 创建thead区域
		 */
		createThead: function(createFlag) {
			var oThis = this,visibleIndex = 0,gridCompColumnArr,trStyle = '';
			if(this.options.maxHeaderLevel >1){
				trStyle = 'style="height:' + this.headerHeight + 'px;"';
			}
			var htmlStr = '<tr role="row" ' + trStyle + '>';
			if(createFlag == 'fixed'){
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				gridCompColumnArr = this.gridCompColumnArr;
			}
			$.each(gridCompColumnArr, function(i) {
				var vi = visibleIndex,displayStyle = '';
				if(this.options.visible == false){
					vi = -1;
					displayStyle = 'style="display:none;"';
				}else{
					visibleIndex++;
				}
				// 低版本浏览器不支持th position为relative，因此加入空div
				htmlStr += '<th role="columnheader" data-filed="' + this.options.field + '" rowspan="1" class="u-grid-header-th" ' + displayStyle + 'field="' + this.options.field + '" index="' + i + '" visibleIndex="' + vi + '"><div style="position:relative;">';
				var colorStype = '';
				if(this.options.headerColor){
					colorStype = 'style="color:' + this.options.headerColor + '"';
				}
				htmlStr += '<div class="u-grid-header-link" field="' + this.options.field + '" title="' + this.options.title + '" ' + colorStype + '>' + this.options.title + '</div>';
				/*if(oThis.options.columnMenu && createFlag != 'fixed'){
					// 创建右侧按钮图标
					htmlStr += '<div class="u-grid-header-columnmenu fa fa-bars " field="' + this.options.field + '" style="display:none;"></div>';
				}*/
				htmlStr += '</div></th>';
			});

			htmlStr += '</tr>';
			return htmlStr;
		},		/*
		 * 创建内容区域
		 */
		createContent: function() {
			var h = '',displayStr = '',bottonStr='';
			if(this.countContentHeight){
			 	var wh = $('#' + this.options.id)[0].offsetHeight;
			 	this.wholeHeight = wh;
			 	if (wh > 0) {
			 		this.contentHeight = parseInt(wh) - this.exceptContentHeight - 1 > 0?parseInt(wh) - this.exceptContentHeight - 1:0;
			 		if(this.contentHeight > 0){
			 			h = 'style="height:' + this.contentHeight + 'px;"';
			 		}
			 	}
			 }
			var htmlStr = '<div id="' + this.options.id + '_content" class="u-grid-content" ' + h + '>';
			if (this.options.showNumCol || this.options.multiSelect) {
				htmlStr += this.createContentLeft();
				if(!(this.contentWidth > this.contentMinWidth)){
					displayStr = 'display:none;';
					bottonStr = 'bottom:0px;'
				}
				htmlStr += this.createContentSumRow(bottonStr);
				if(u.isIOS){
					displayStr += 'width:0px;';
				}
				htmlStr += '<div class="u-grid-content-left-bottom" id="' + this.options.id + '_content_left_bottom" style="width:' + (this.leftW + this.fixedWidth) + 'px;'+displayStr+'">';
				htmlStr += '</div>';
			}
			htmlStr += this.createContentTableFixed();
			htmlStr += this.createContentTable();
			htmlStr += '</div>';
			return htmlStr;
		},
		createContentSumRow:function(){
			return '';
		},
		/*
		 * 创建内容区左侧区域
		 */
		createContentLeft: function() {
			var oThis = this,htmlStr = "",left = 0,hStr;
			// 高度可伸缩，暂时去掉内部的高度设置
			// if(this.countContentHeight && parseInt(this.contentHeight) > 0){
			// 	hStr = 'max-height:' + this.contentHeight + 'px;overflow:hidden;';
			// }else{
			// 	hStr = '';
			// }
			if(this.options.multiSelect){
				htmlStr += '<div class="u-grid-content-left" id="' + this.options.id + '_content_multiSelect" style="width:' + this.multiSelectWidth + 'px;' + hStr + '">';
				// 遍历生成所有行
				if (this.dataSourceObj.rows) {
					$.each(this.dataSourceObj.rows, function(i) {
						htmlStr += oThis.createContentLeftMultiSelectRow(this);
					});
				}
				htmlStr += '</div>';
				left += this.multiSelectWidth;
			}
			if (this.options.showNumCol) {
				htmlStr += '<div class="u-grid-content-left" id="' + this.options.id + '_content_numCol" style="width:' + this.numWidth + 'px;left:' + left + 'px;' + hStr + '">';
				// 遍历生成所有行
				if (this.dataSourceObj.rows) {
					$.each(this.dataSourceObj.rows, function(i) {
						htmlStr += oThis.createContentLeftNumColRow(i);
					});
				}
				htmlStr += '</div>';
			}
			return htmlStr;
		},
		/*
		 * 创建内容区左侧区域复选区（一行）
		 */
		createContentLeftMultiSelectRow:function(row,displayFlag){
			var displayStr = '';
			if(!this.options.autoExpand && row.level > 0 && displayFlag != 'block'){
				displayStr = 'display:none;'
			}
			var tmpcheck = row.value["$_#_@_id"]
			if(!tmpcheck) {
				tmpcheck = setTimeout(function(){});
			}
			if(gridBrowser.isIE8){
				//var	htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + displayStr + '" class="u-grid-content-multiSelect " ><input class="u-grid-multi-input" id="checkbox'+tmpcheck+'" type="checkbox" value="1" ></div>'
				var	htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + displayStr + '" class="u-grid-content-multiSelect " ><span class="u-grid-checkbox-outline" id="checkbox'+tmpcheck+'" value="1"><span class="u-grid-checkbox-tick-outline"></span></span></div>'
			}else{
				//var htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + displayStr + '" class="u-grid-content-multiSelect checkbox check-success" ><input class="u-grid-multi-input" id="checkbox'+tmpcheck+'" type="checkbox" value="1" ><label for="checkbox'+tmpcheck+'"></label></div>'
				var htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + displayStr + '" class="u-grid-content-multiSelect checkbox check-success" ><span class="u-grid-checkbox-outline" id="checkbox'+tmpcheck+'" value="1"><span class="u-grid-checkbox-tick-outline"></span></span></div>'
			}
			return htmlStr;
		},
		/*
		 * 创建内容区左侧区域数字列（一行）
		 */
		createContentLeftNumColRow:function(index){
			var htmlStr = '<div style="width:' + this.numWidth + 'px;" class="u-grid-content-num">' + (index+1) + '</div>';
			return htmlStr;
		},
		/*
		 * 创建内容区table
		 */
		createContentTable:function(createFlag){
			var leftW,idStr,styleStr,hStr,cssStr,tableStyleStr;
			if(this.countContentHeight && parseInt(this.contentHeight) > 0){
			 	hStr = 'height:' + this.contentHeight + 'px;';
			 }else{
			 	hStr = "";
			 }
			if(createFlag == 'fixed'){
				leftW = parseInt(this.leftW);
				idStr = 'fixed_';
				cssStr = 'fixed-';
				styleStr = 'style="position:absolute;width:'+this.fixedWidth+'px;left:' + leftW + 'px;' +hStr+'"';
				tableStyleStr = 'style="width:'+this.fixedWidth+'px;"';
			}else{
				leftW = parseInt(this.leftW) + parseInt(this.fixedWidth,0); 
				idStr = '';
				cssStr = '';
				styleStr = 'style="position:relative;left:' + leftW + 'px;' +hStr;
				if(this.contentMinWidth > 0){
					styleStr += 'width:' + this.contentMinWidth + 'px;';
				}
				styleStr += '"';
				tableStyleStr = '';
				if(this.contentMinWidth > 0){
					if(this.contentWidth > 0){
						tableStyleStr = 'style="min-width:' + this.contentMinWidth + 'px;width:' + this.contentWidth + 'px;"';
					}else{
						tableStyleStr = 'style="min-width:' + this.contentMinWidth + 'px;"';
					}
				}
			}
			var  htmlStr = '<div id="' + this.options.id + '_content_'+idStr+'div" class="u-grid-content-'+cssStr+'div" '+styleStr+'>';
			htmlStr += '<div style="height:30px;position:absolute;top:-30px;width:100%;"></div><table role="grid" id="' + this.options.id + '_content_'+idStr+'table" ' + tableStyleStr+'>';
			htmlStr += this.createColgroup(createFlag);
			htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_content_'+idStr+'thead" style="display:none">';
			htmlStr += this.createThead(createFlag);
			htmlStr += '</thead>';
			htmlStr += this.createContentRows(createFlag);
			htmlStr += '</table>';
			if(createFlag != 'fixed'){
				htmlStr += this.createNoRowsDiv();
			}
			htmlStr += '</div>';
			return htmlStr;
		},
		createContentTableFixed:function(){
			return '';
		},
		/*
		 * 创建无数据区域
		 */
		createNoRowsDiv:function(){
			var styleStr = '',styleStr1 = '';
			if(this.contentMinWidth > 0){
				styleStr += 'style="width:' + this.contentMinWidth + 'px;"';
			}
			if(this.contentWidth > 0){
				styleStr1 += 'style="width:' + this.contentWidth + 'px;"';
			}
			var htmlStr = '<div class="u-grid-noRowsDiv"' + styleStr1 + ' id="' + this.options.id + '_noRows"></div>';
			htmlStr += '<div class="u-grid-noRowsShowDiv"' + styleStr + ' id="' + this.options.id + '_noRowsShow">' + this.transMap.ml_no_rows + '</div>';
			return htmlStr;
		},
		/*
		 * 创建内容区域所有行
		 */
		createContentRows: function(createFlag) {
			var oThis = this,htmlStr = "",idStr;
			if(createFlag == 'fixed'){
				idStr = 'fixed_';
			}else{
				idStr = '';
			}
			// 遍历生成所有行
			if (this.dataSourceObj.rows) {
				htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_content_'+idStr+'tbody">';
				$.each(this.dataSourceObj.rows, function(i) {
					htmlStr += oThis.createContentOneRow(this,createFlag);
				});
				htmlStr += this.createContentRowsSumRow();
				htmlStr += '</tbody>';
			}
			return htmlStr;
		},
		createContentRowsSumRow:function(){
			return '';
		},
		/*
		 * 创建内容区域数据行
		 */
		createContentOneRow: function(row,createFlag,displayFlag) {
			var styleStr = '';
			if(!this.options.autoExpand && row.level > 0 && displayFlag != 'block'){
				styleStr = 'style="display:none"';
			}
			var htmlStr = '<tr role="row" ' + styleStr + '>';
			htmlStr += this.createContentOneRowTd(row,createFlag);
			htmlStr += '</tr>';
			return htmlStr;
		},
		/*
		 * 创建内容区域数据行，针对IE
		 */
		createContentOneRowForIE:function(table,index,rowObj,createFlag,displayFlag){
			var row = table.insertRow(index + 1);
			row.setAttribute("role","row");
			if(!this.options.autoExpand && row.level > 0 && displayFlag != 'block'){
				row.style.display = 'none';
			}
			this.createContentOneRowTdForIE(row,rowObj,createFlag);
		},
		/*
		 * 数据更新重画当前行
		 */
		repaintRow:function(rowIndex){
			var tr = $('#' + this.options.id + '_content_tbody').find('tr[role="row"]')[ rowIndex],
				fixedtr = $('#' + this.options.id + '_content_fixed_tbody').find('tr[role="row"]')[rowIndex],
				row = this.dataSourceObj.rows[rowIndex],$tr = $(tr),
				index = this.getTrIndex($tr);
			if(gridBrowser.isIE8 || gridBrowser.isIE9){
				var table = $('#' + this.options.id + '_content_table')[0],
					fixedtable = $('#' + this.options.id + '_content_fixed_table')[0];
				var className = tr.className;
				var fixclassName = fixedtr.className;
					table.deleteRow(rowIndex + 1);
					fixedtable.deleteRow(rowIndex + 1);
				var tr = table.insertRow(rowIndex + 1 );
				u.addClass(tr,className)
				var fixedtr = fixedtable.insertRow(rowIndex + 1);
				u.addClass(fixedtr,fixclassName)
				this.createContentOneRowTdForIE(tr,row)
				this.createContentOneRowTdForIE(fixedtr,row,'fixed')
			}else{
				tr.innerHTML = this.createContentOneRowTd(row);
				if(fixedtr)
					fixedtr.innerHTML = this.createContentOneRowTd(row,'fixed');
			}
			var obj = {};
			obj.begin = index;
			obj.length = 1;
			this.renderTypeFun(obj);
		},
		/*
		 * 创建行td对应的html
		 */
		createContentOneRowTd:function(row,createFlag){
			var oThis = this,htmlStr = '',gridCompColumnArr,value = row.value;
			if(createFlag == 'fixed'){
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				gridCompColumnArr = this.gridCompColumnArr;
			}
			$.each(gridCompColumnArr, function() {
				var f = this.options.field,v = $(value).attr(f);
				v = oThis.getString(v,'');
				if($.type(v) == 'object') {
					v = v.showValue
				}
				var renderType = this.options.renderType;
				var treeStyle = '';
				var spanStr ='';
				var iconStr = '';
				var vStr= '';
				var tdStyle = '';
				if(oThis.options.showTree && this.firstColumn){
					var l = parseInt(oThis.treeLeft)*parseInt(row.level);
					treeStyle = 'style="position:relative;';
					if(row.hasChild){
						if(oThis.options.autoExpand){
							spanStr = '<span class=" fa fa-minus-square-o u-grid-content-tree-span"></span>';
						}else{
							spanStr = '<span class=" fa fa-plus-square-o u-grid-content-tree-span"></span>';
						}
					}else{
						l += 16;
					}
					treeStyle += 'left:'+ l +'px;"';
				}
				if(!this.options.visible){
					tdStyle = 'style="display:none;"';
				}
				if(this.options.icon){
					iconStr = '<span class="' + this.options.icon + '"></span>';
				}
				// title="' + v + '" 创建td的时候不在设置title，在renderType中设置,处理现实xml的情况
				htmlStr += '<td role="rowcell"  '+ tdStyle +' title="' + v.replace(/\</g,'\<').replace(/\>/g,'\>') + '"><div class="u-grid-content-td-div" ' + treeStyle+'>' + spanStr + iconStr + '<span>' + v.replace(/\</g,'&lt;').replace(/\>/g,'&gt;') + '</span></div></td>';
			});
			return htmlStr;
		},
		/*
		 * 创建行td,针对IE
		 */
		createContentOneRowTdForIE:function(row,rowObj,createFlag){
			var oThis = this,gridCompColumnArr,value = rowObj.value;
			if(createFlag == 'fixed'){
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				gridCompColumnArr = this.gridCompColumnArr;
			}
			$.each(gridCompColumnArr, function() {
				var f = this.options.field,v = $(value).attr(f),v = oThis.getString(v,'');
				if($.type(v) == 'object') {
					v = v.showValue
				}
				var renderType = this.options.renderType,treeStyle = '',spanStr ='',iconStr = '',
					vStr= '',htmlStr = '',newCell= row.insertCell();
				newCell.setAttribute("role","rowcell");
				newCell.title = v.replace(/\</g,'\<').replace(/\>/g,'\>');
				if(oThis.options.showTree && this.firstColumn){
					var l = parseInt(oThis.treeLeft)*parseInt(rowObj.level);
					treeStyle = 'style="position:relative;';
					if(rowObj.hasChild){
						if(oThis.options.autoExpand){
							spanStr = '<span class=" fa fa-minus-square-o u-grid-content-tree-span"></span>';
						}else{
							spanStr = '<span class=" fa fa-plus-square-o u-grid-content-tree-span"></span>';
						}
					}else{
						l += 18;
					}
					treeStyle += 'left:'+ l +'px;"';
				}
				if(!this.options.visible){
					newCell.style.display="none";
				}
				if(this.options.icon){
					iconStr = '<span class="' + this.options.icon + '"></span>';
				}
				htmlStr += '<div class="u-grid-content-td-div" ' + treeStyle+'>' + spanStr + iconStr + '<span>' + v.replace(/\</g,'&lt;').replace(/\>/g,'&gt;') + '</span></div>';
				newCell.insertAdjacentHTML('afterBegin',htmlStr);
			});
		},
		/*
		 * 重画内容区域
		 */
		repairContent: function(){
			var $pDiv = $('#' + this.options.id + '_content').parent();
			$('#' + this.options.id + '_content').remove(null, true);
			if($pDiv[0]){
				var htmlStr = this.createContent();
				$pDiv[0].insertAdjacentHTML('beforeEnd', htmlStr);
				this.renderTypeFun();
				this.initContentDivEventFun();
				if($('#' + this.options.id + '_content_div')[0]){
					$('#' + this.options.id + '_content_div')[0].scrollLeft = this.scrollLeft;
				}
				$('#' +this.options.id + '_content_edit_menu').css('display','none');
			}
			this.realtimeTableRows = null;
		},
		/*
		 * 创建完成之后顶层div添加监听
		 */
		initEventFun: function() {
			var oThis = this;
			$('#' + this.options.id).on('mousedown', function(e) {
				if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
					// 点击的是header区域
					oThis.mouseDownX = e.clientX;
					oThis.mouseDownY = e.clientY;
				} else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
					// 点击的是数据区域
				}
			});
		},
		/*
		 * 创建完成之后grid层 div添加监听
		 */
		initGridEventFun: function() {
			var oThis = this;
			// 拖动
			this.initContentDivEventFun();
			// 全选
			$('#' + this.options.id + '_header_multi_input').on('click', function(e) {
				if(this.hasChecked){
					oThis.setAllRowUnSelect();
					this.hasChecked = false;
				}else{
					oThis.setAllRowSelect();
					this.hasChecked = true;
					
				}
			});
		},
		/*
		 * 内容区 div添加监听
		 */
		initContentDivEventFun:function(){
			var oThis = this;
			// 通过复选框设置选中行
			$('#' + oThis.options.id + '_content .u-grid-content-left').on('click',function(e){
				var $input = $(e.target).closest('.u-grid-checkbox-outline');
				if($input.length > 0){
					var $div = $($input.parent());
					var index = $('.u-grid-content-multiSelect',$div.parent()).index($div);
					if($input.hasClass('is-checked')){
						oThis.setRowUnselect(index);
					}else{
						oThis.setRowSelect(index);
					}
				}
			});
			// 同步滚动条
			$('#' + this.options.id + '_content_div').on('scroll', function(e) {
				oThis.scrollLeft = this.scrollLeft;
				oThis.scrollTop = this.scrollTop;
				$('#' + oThis.options.id + '_header_table').css('left', oThis.leftW - oThis.scrollLeft + oThis.fixedWidth + "px");
				$('#' + oThis.options.id + '_noRowsShow').css('left', oThis.scrollLeft + "px");
				$('#' + oThis.options.id + '_edit_form').css('left', oThis.scrollLeft + "px");
				$('#' + oThis.options.id + '_content_multiSelect').css('top', -oThis.scrollTop + "px");
				$('#' + oThis.options.id + '_content_numCol').css('top', -oThis.scrollTop + "px");
				$('#' + oThis.options.id + '_content_fixed_div').css('top', -oThis.scrollTop + "px");
			});
			// 数据行相关事件
			$('#' + this.options.id + '_content_tbody').on('click',function(e){
				// 双击处理
				if(typeof oThis.options.onDblClickFun == 'function'){
					oThis.isDblEvent('tbodyClick',oThis.dblClickFun,e,oThis.clickFun,e);
				}else{
					oThis.clickFun(e);
				}
			});
			$('#' + this.options.id + '_content_fixed_tbody').on('click',function(e){
				// 双击处理
				if(typeof oThis.options.onDblClickFun == 'function'){
					oThis.isDblEvent('tbodyClick',oThis.dblClickFun,e,oThis.clickFun,e);
				}else{
					oThis.clickFun(e);
				}
			});
			$('#' + this.options.id + '_content').on('mousemove', function(e) {
				var $tr = $(e.target).closest('tr'),$div = $(e.target).closest('div'),mousemoveIndex = -1;
				// 首先清除所有的背景
				if($tr.length > 0){
					mousemoveIndex = $('tr',$tr.parent()).index($tr);
				}else if($div.length > 0 && ($div.hasClass('u-grid-content-multiSelect') || $div.hasClass('u-grid-content-num'))){ //左侧复选及数字列
					mousemoveIndex = $('div',$div.parent()).index($div);
				}

				oThis.trHoverFun(mousemoveIndex);
			});
			$('#' + this.options.id + '_content').on('mouseout', function(e) {
				$('#' + oThis.options.id + '_content_tbody').find('tr').removeClass('u-grid-move-bg');
				$('#' + oThis.options.id + '_content_fixed_tbody').find('tr').removeClass('u-grid-move-bg');
				if(oThis.options.multiSelect)
					$('#' + oThis.options.id + '_content_multiSelect').find('div').removeClass('u-grid-move-bg');
				if(oThis.options.showNumCol)
					$('#' + oThis.options.id + '_content_numCol').find('div').removeClass('u-grid-move-bg');
				if(typeof oThis.options.onContentOut == 'function'){
			    	var obj = {};
			     	obj.gridObj = oThis;
			     	var $tr = $(e.target).closest('tr');
			     	if($tr.length > 0 && !$tr.is('.u-grid-content-sum-row')){
			      		var mouseoutIndex = $('tr[role="row"]',$tr.parent()).index($tr)
			      		obj.rowObj = oThis.dataSourceObj.rows[mouseoutIndex];
			      		obj.rowIndex = mouseoutIndex;
			     		}
			     	oThis.options.onContentOut(obj);
			    }
			});
		},
		trHoverFun:function(index){
			var oThis = this;
			$('#' + oThis.options.id + '_content_tbody').find('tr').removeClass('u-grid-move-bg');
			$('#' + oThis.options.id + '_content_fixed_tbody').find('tr').removeClass('u-grid-move-bg');
			if(oThis.options.multiSelect)
				$('#' + oThis.options.id + '_content_multiSelect').find('div').removeClass('u-grid-move-bg');
			if(oThis.options.showNumCol)
				$('#' + oThis.options.id + '_content_numCol').find('div').removeClass('u-grid-move-bg');
			if(index > -1){
				var $tr = $('#' + oThis.options.id + '_content_tbody').find('tr').eq(index);
				if($tr[0].id && $tr[0].id == oThis.options.id + '_edit_tr'){
					return;
				}
				$('#' + oThis.options.id + '_content_tbody').find('tr').eq(index).addClass('u-grid-move-bg');
				$('#' + oThis.options.id + '_content_fixed_tbody').find('tr').eq(index).addClass('u-grid-move-bg');
				if(oThis.options.multiSelect)
					$('#' + oThis.options.id + '_content_multiSelect').find('div').eq(index).addClass('u-grid-move-bg');
				if(oThis.options.showNumCol)
					$('#' + oThis.options.id + '_content_numCol').find('div').eq(index).addClass('u-grid-move-bg');
				if(typeof oThis.options.onRowHover == 'function' && !$tr.is('.u-grid-content-sum-row')){
					var obj = {};
					obj.gridObj = oThis;
					obj.rowObj = oThis.dataSourceObj.rows[index];
					obj.rowIndex = index;
					oThis.options.onRowHover(obj);
				}
			}
		},
		/*
		 * 定时器处理
		 */
		setIntervalFun: function(e) {
			this.widthChangeFun();
			this.heightChangeFun();
			this.editorRowChangeFun();
		},
		editorRowChangeFun: function(){
		},
		/*
		 * grid区域创建完成之后处理
		 * 1、数据列显示处理
		 * 2、取行高
		 */
		afterGridDivsCreate:function(){
			this.columnsVisibleFun();
			this.resetThVariable();
			this.countRowHeight();
			this.noRowsShowFun();
			this.renderTypeFun();
			this.resetScrollLeft();
			this.hideEditMenu();
			if(typeof this.options.afterCreate == 'function'){
				this.options.afterCreate.call(this);
			}
		},
		/*
		 * 取行高
		 */
		countRowHeight:function(){
			if($('#' + this.options.id + '_content_tbody tr')[0]){
				this.rowHeight = $('#' + this.options.id + '_content_tbody tr')[0].offsetHeight;
			}
		},
		/*
		 * 处理是否显示无数据行
		 */
		noRowsShowFun:function(){
			if(this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0){
				$('#' + this.options.id + '_noRowsShow').css('display','none');
				$('#' + this.options.id + '_noRows').css('display','none');
			}else{
				$('#' + this.options.id + '_noRowsShow').css('display','block');
				$('#' + this.options.id + '_noRows').css('display','block');
			}
		},
		/*
		 * 更新最后数据行标识
		 */
		updateLastRowFlag: function(){
			// 共享服务加的，没有对应的css暂时去掉
			return;
			var rows =$('#' + this.options.id + '_content_tbody').find('tr[role=row]')
			for(var i=0, count = rows.length; i<count; i++){
				if (i == count -1)
					$(rows[i]).addClass('last-row')
				else
					$(rows[i]).removeClass('last-row')
			}
		},
		updateNumColLastRowFlag: function(){
			// 共享服务加的，没有对应的css暂时去掉
			return;
			var numCols =$('#' + this.options.id + '_content_numCol').find('.u-grid-content-num')
			for(var i=0, count = numCols.length; i<count; i++){
				if (i == count -1)
					$(numCols[i]).addClass('last-row')
				else
					$(numCols[i]).removeClass('last-row')
			}
		},
		/*
		 * 处理renderType
		 * begin为起始行，length为行数（增加行数时使用）
		 */
		renderTypeFun:function(obj){
			if(!this.isGridShow())
				return;
			if(typeof obj == 'undefined'){
				var begin = null,length = null,field = '';
			}else{
				var begin = typeof obj.begin == 'undefined'?null:obj.begin,length = typeof obj.length == 'undefined'?null:obj.length,field = typeof obj.field == 'undefined'?'':obj.field;
			}
			var oThis = this,begin = parseInt(begin),length = parseInt(length),end = begin;
			if(length >0){
				end = parseInt(begin + length - 1);
			}
			if (field == ''){
				if(this.gridCompColumnFixedArr)
					$.each(this.gridCompColumnFixedArr,function(i){
						oThis.renderTypeByColumn(this,i,begin,length,true);
					})
				$.each(this.gridCompColumnArr,function(i){
					oThis.renderTypeByColumn(this,i,begin,length, false);
				})
			}
			else{
				var rendered = false
				if(this.gridCompColumnFixedArr)
					$.each(this.gridCompColumnFixedArr,function(i){
						if (this.options.field == field){
							oThis.renderTypeByColumn(this,i,begin,length,true);
							rendered = true
							return;
						}
					})
				if (!rendered)
					$.each(this.gridCompColumnArr,function(i){
						if (this.options.field == field){
							oThis.renderTypeByColumn(this,i,begin,length,false);
							return;
						}
					})
			}
		},
		/*
		 * 处理renderType
		 * gridCompColumn对象，index为第几列
		 * begin为起始行，length为行数（增加行数时使用）
		 */
		renderTypeByColumn:function(gridCompColumn,i,begin,length, isFixedColumn){
			var oThis = this,renderType = gridCompColumn.options.renderType,
				sumCol = gridCompColumn.options.sumCol,
				sumRenderType = gridCompColumn.options.sumRenderType,
				dataType = gridCompColumn.options.dataType,
				precision = gridCompColumn.options.precision,
				format = gridCompColumn.options.format,field = gridCompColumn.options.field,
				end = begin,idSuffix = isFixedColumn === true ? '_content_fixed_tbody' : '_content_tbody',
				idStr = isFixedColumn === true? 'fixed_' : '',
				visibleColIndex = this.getVisibleIndexOfColumn(gridCompColumn);

			
			if(length >0){
				end = parseInt(begin + length - 1);
			}
			this.realtimeTableRows = document.getElementById(oThis.options.id + idSuffix).children;
			// 记录role不是row的行
			var notRowIndex = -1;
			for(var k = 0;k < oThis.realtimeTableRows.length;k++) {
				if(oThis.realtimeTableRows[k].getAttribute("role") != "row") {
					notRowIndex = k
				}
			}
			$.each(oThis.dataSourceObj.rows, function(j) {
				if((begin >= 0 && j >= begin && j <= end) || isNaN(begin)){
					//如果当前修改此列则将变量重置
					if(oThis.editColIndex == visibleColIndex && oThis.eidtRowIndex == j){
						oThis.editColIndex = -1;
						oThis.eidtRowIndex = -1;
					}
					var trIndex = j;
					if(notRowIndex != -1 && j >= notRowIndex) {
						trIndex++;
					}
					var tr = oThis.realtimeTableRows[trIndex],td = tr.children[i];
					if(td){
						if(td.children[0].innerHTML.indexOf('u-grid-content-tree-span')   !=  -1){
							var span =  td.children[0].children[1];
						}else{
							// td.innerHTML = '<div class="u-grid-content-td-div"></div>'; //如果是树表的话第一列显示会有问题，等出现其他问题之后再修改此处
							var span =  td.children[0];
						}
						if(span){
							var v = $(this.value).attr(field);
							if(typeof renderType == 'function' || dataType == 'Date' || dataType == 'Datetime' || dataType == 'Int' || dataType == 'Float'){
								span.innerHTML = '';
								if(typeof renderType == 'function'){
									v = oThis.getString(v,'');
									var obj = {};
									obj.value = v;
									obj.element = span;
									obj.gridObj = oThis;
									obj.row = this;
									obj.gridCompColumn = gridCompColumn;
									obj.rowIndex = j;
									renderType.call(oThis,obj);
								}else if(dataType == 'Date' || dataType == 'Datetime'){
									if(v == null || v == undefined || v == 'null' || v == 'undefined' || v == ""){
										v = "";
									}
									if (dataType == 'Date'){
										v = u.dateRender(v);
									}else{
										v = u.dateTimeRender(v);
									}
									span.innerHTML = v;
									td.title = v;
								}else if(dataType == 'Int'){
									v = parseInt(v);
									span.innerHTML = v;
									td.title = v;
								}else if(dataType == 'Float'){
									if(precision){
										var o = {};
										o.value = v;
										o.precision = precision;
										v = oThis.DicimalFormater(o);
									}else{
										v = parseFloat(v);
									}
									span.innerHTML = v;
									td.title = v;
								}else{ //此处逻辑放到渲染处，减少render执行次数。
									v = oThis.getString(v,'');
									var v1 = v.replace(/\</g,'\<');
									v1 = v1.replace(/\>/g,'\>');
									td.title = v;
									v = v.replace(/\</g,'&lt;');
									v = v.replace(/\>/g,'&gt;');

									span.innerHTML = v;
								}
							}else{
								v = oThis.getString(v,'');
								var v1 = v.replace(/\</g,'\<');
								v1 = v1.replace(/\>/g,'\>');
								td.title = v;
								v = v.replace(/\</g,'&lt;');
								v = v.replace(/\>/g,'&gt;');

								span.innerHTML = v;
							}
						}

					}
				}
			});
			this.renderTypeSumRow(gridCompColumn,i,begin,length, isFixedColumn);
		},
		renderTypeSumRow:function(gridCompColumn,i,begin,length, isFixedColumn){
		},
		/*
		 * grid区域重画完成之后处理，已经执行过afterGridDivsCreate
		 * 1、设置横向滚动条
		 * 2、隐藏编辑按钮
		 */
		afterRepaintGrid:function(){
			this.resetScrollLeft();
			this.hideEditMenu();
		},
		/*
		 * 设置横向滚动条
		 */
		resetScrollLeft:function(){
			if($('#' + this.options.id + '_content_div')[0]){
				try{
					$('#' + this.options.id + '_content_div')[0].scrollLeft = this.scrollLeft;
				}catch(e){

				}
				
			}
		},
		/*
		 * 隐藏编辑按钮
		 */
		hideEditMenu:function(){
		},		
		/*
		 * 整体宽度改变处理
		 */
		widthChangeFun: function() {
			var oThis = this;
			if($('#' + this.options.id)[0]){
				// 获取整体区域宽度
				var w = $('#' + this.options.id).width()  //[0].offsetWidth;
				if(this.wholeWidth != w){
					this.wholeWidth = w;
					// 树展开/合上的时候会导致页面出现滚动条导致宽度改变，没有&&之后会重新刷新页面导致无法收起
					if (w > this.options.formMaxWidth && ((this.showType == 'form' || this.showType == '') || !$('#' + this.options.id + '_content_div tbody')[0]) || this.options.overWidthHiddenColumn) { //lyk--需要完善隐藏之后再显示同事添加数据操作
						oThis.widthChangeGridFun();
					} else if (w > 0 && w < this.options.formMaxWidth && (this.showType == 'grid' || this.showType == '')) {
//						this.widthChangeFormFun();
					}
					// 某些情况下需要重复执行，待优化，去掉，以后也不应该执行这段代码
					if(w > this.options.formMaxWidth){
						this.contentMinWidth = parseInt(this.wholeWidth) - parseInt(this.leftW) - parseInt(this.fixedWidth);
						if(this.contentMinWidth < 0)
							this.contentMinWidth = 0;
						setTimeout(function(){ 
							$('#' + oThis.options.id + '_header_wrap').css('max-width', (oThis.wholeWidth) + 'px');
							$('#' + oThis.options.id + '_content_div').css('width', oThis.contentMinWidth  + 'px');
							$('#' + oThis.options.id + '_content_table').css('min-width', oThis.contentMinWidth  + 'px');
							$('#' + oThis.options.id + '_content_table').css('width', oThis.contentMinWidth  + 'px');
							$('#' + oThis.options.id + '_header_table').css('min-width', oThis.contentMinWidth + 'px');
							$('#' + oThis.options.id + '_header_table').css('width', oThis.contentMinWidth + 'px');
							$('#' + oThis.options.id + '_noRowsShow').css('width', oThis.contentMinWidth + 'px');
							//滚动条可能发生变化导致grid内部列的宽度发生变化
							oThis.columnsVisibleFun();
							if(oThis.contentRealWidth < oThis.contentMinWidth){
								oThis.contentWidth = oThis.contentMinWidth;
							}else{
								oThis.contentWidth = oThis.contentRealWidth;
							}
							$('#' + oThis.options.id + '_noRows').css('width', oThis.contentWidth + 'px');
							if(typeof oThis.options.afterCreate == 'function'){
								oThis.options.afterCreate.call(oThis);
							}
						},300);
					}
				}
				$('#' + oThis.options.id + '_header_table').css('width', oThis.contentMinWidth + 'px');
				$('#' + oThis.options.id + '_edit_form').css('width', oThis.contentMinWidth + 'px');
			}
		},
		/*
		 * 整体宽度改变处理(grid形式)
		 */
		widthChangeGridFun: function() {
			var oThis = this,halfWholeWidth = parseInt(this.wholeWidth/2);
			this.widthChangeGridFunFixed(halfWholeWidth);
			/* 如果宽度不足处理自动隐藏*/
			this.widthChangeGridFunOverWidthHidden();
			// 内容区域宽度自动扩展
			this.contentMinWidth = parseInt(this.wholeWidth) - parseInt(this.leftW) - parseInt(this.fixedWidth);
			if(this.contentMinWidth < 0)
				this.contentMinWidth = 0;
			if(this.contentRealWidth < this.contentMinWidth){
				this.contentWidth = this.contentMinWidth;
				var oldWidth = this.lastVisibleColumn.options.width;
				this.lastVisibleColumnWidth = oldWidth + (this.contentMinWidth - this.contentRealWidth);
				// modfied by tianxq1 最后一列自动扩展
				this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth-20;
			}else{
				this.contentWidth = this.contentRealWidth;
			}
			this.createGridFlag = false;
			this.createGridDivs();
			$('#' + this.options.id + '_form').css('display', 'none');
			$('#' + this.options.id + '_grid').css('display', 'block');
		},
		widthChangeGridFunFixed:function(halfWholeWidth){
		},
		widthChangeGridFunOverWidthHidden:function(){
		},
		/*
		 * 整体高度改变处理
		 */
		heightChangeFun: function() {
			if(this.countContentHeight){
				var oldH = this.wholeHeight,h = $('#' + this.options.id)[0].offsetHeight;
				this.wholeHeight = h;
				if (oldH != h && h > 0) {
					var contentH = h - this.exceptContentHeight - 1 > 0 ? h - this.exceptContentHeight -1 : 0;
					$('#' + this.options.id + '_content').css('height', contentH + 'px');
					$('#' + this.options.id + '_content_div').css('height', contentH + 'px');
				}
			}
		},
		/*
		 * column是否显示处理，只在初始化gridCompColumn对象时调用，其他时候不再调用
		 * 计算固定区域及内容区域的真实宽度
		 * 计算第一列
		 * 计算内容区域最后一列显示列
		 */
		columnsVisibleFun:function(){
			var oThis = this,
				w = 0;
			this.firstColumn = true;

			$.each(this.gridCompColumnArr,function(){
				if(this.options.visible){
					w+=parseInt(this.options.width);
					this.firstColumn = oThis.firstColumn;
					oThis.firstColumn = false;
					oThis.lastVisibleColumn = this;
					oThis.lastVisibleColumnWidth = this.options.width;
				}
			});
			this.contentRealWidth = w;
		},
		/*
		 * 创建完成之后处理变量
		 */
		resetThVariable: function() {
			if(this.showType != 'grid')
				return;
			var oThis = this;
			this.contentWidth = 0;
			
			// 记录每列宽度及当前宽度之和
			$('#' + this.options.id + '_header_table th', this.$ele).each(function(i) {  //会出现th多于列的情况，发现问题之后再看下为什么
				var gridCompColumn = oThis.gridCompColumnArr[i];
				var w = 0;
				if(gridCompColumn.options.visible){
					w = gridCompColumn.options.width;
				}
				this.attrLeftTotalWidth = oThis.contentWidth;
				oThis.contentWidth += w;
				oThis.resetThVariableDrag(this,gridCompColumn,w);
				this.gridCompColumn = gridCompColumn;
				this.attrWidth = w;
				this.attrRightTotalWidth = oThis.contentWidth;
				
			});
			oThis.resetThVariableHeaderLevel();
		},
		resetThVariableDrag:function(nowTh,gridCompColumn){
		},
		resetThVariableHeaderLevel:function(){
		},
		/*
		 * 内容区宽度改变
		 */
		contentWidthChange:function(newContentWidth){
			if(newContentWidth < this.contentMinWidth){
				var oldW = this.lastVisibleColumn.options.width;
				this.lastVisibleColumnWidth = oldW + (this.contentMinWidth - newContentWidth);
				$('#' + this.options.id + '_header_table col:last').css('width', this.lastVisibleColumnWidth + "px");
				$('#' + this.options.id + '_content_table col:last').css('width', this.lastVisibleColumnWidth + "px");
				newContentWidth = this.contentMinWidth;
			}
			$('#' + this.options.id + '_content_table').css('width', newContentWidth + "px");
			$('#' + this.options.id + '_noRows').css('width', newContentWidth + "px");
			if(newContentWidth > this.contentMinWidth){
				$('#' + this.options.id + '_content_left_bottom').css('display','block');
				$('#' + this.options.id + '_content_left_sum_bottom').css('bottom',16);
			}else{
				$('#' + this.options.id + '_content_left_bottom').css('display','none');
				$('#' + this.options.id + '_content_left_sum_bottom').css('bottom',0);
			}
			return newContentWidth;
		},
		/*
		 * 获取某列对应属性
		 */
		getColumnAttr: function(attr, field) {
			for (var i = 0; i < this.gridCompColumnArr.length; i++) {
				if (this.gridCompColumnArr[i].options.field == field) {
					return $(this.gridCompColumnArr[i].options).attr(attr);
				}
			}
			return "";
		},
		/*
		 * 根据field获取gridcompColumn对象
		 */
		getColumnByField: function(field){
			for (var i = 0; i < this.gridCompColumnArr.length; i++) {
				if (this.gridCompColumnArr[i].options.field == field) {
					return this.gridCompColumnArr[i];
				}
			}
			return null;
		},
		/*
		 * 获取column属于第几列
		 */
		getIndexOfColumn:function(column){
			var index = -1;
			for(var i=0;i < this.gridCompColumnArr.length;i++){
				if(this.gridCompColumnArr[i] == column){
					index = i;
					break;
				}
			}
			return index;
		},
		/*
		 * 获取column属于当前显示第几列
		 */
		getVisibleIndexOfColumn:function(column){
			var index = -1;
			var j = 0;
			for(var i=0;i < this.gridCompColumnArr.length;i++){
				if(this.gridCompColumnArr[i] == column){
					if(!($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')){
						index = j;
					}
					break;
				}
				if(!($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')){
					j++;
				}
			}
			return index;
		},
		/*
		 * 获取column后面第一个显示列所在第几列
		 */
		getNextVisibleInidexOfColumn:function(column){
			var index = -1,flag = false,j = 0;
			for(var i=0;i < this.gridCompColumnArr.length;i++){
				if(this.gridCompColumnArr[i] == column){
					flag = true;
					continue;
				}
				if(flag == true && !($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')){
					index = j;
					break;
				}
				if(!($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')){

					j++;
				}
			}
			return index;
		},
		/*
		 * 修改第一列的css
		 */
		headerFirstClassFun:function(){
			$('#' + this.options.id + '_grid .u-grid-header-th-first').removeClass('u-grid-header-th-first');
			$('#' + this.options.id + '_grid').find('th').eq(0).addClass('u-grid-header-th-first');
		},
		/*
		 * 双击/单击处理
		 */
		isDblEvent:function(eventname,dbFun,dbArg,Fun,Arg){
			if (this.currentEventName != null && this.currentEventName == eventname){
				dbFun.call(this,dbArg);
				this.currentEventName = null;
				if (this.cleanCurrEventName)
					clearTimeout(this.cleanCurrEventName);
			}else{
				var oThis = this;
				if (this.cleanCurrEventName)
					clearTimeout(this.cleanCurrEventName);
				this.currentEventName = eventname;
				this.cleanCurrEventName =  setTimeout(function(){
					oThis.currentEventName = null;
					Fun.call(oThis,Arg);
				},250);
			}
		},
		/*
		 * 双击处理
		 */
		dblClickFun:function(e){
			if(typeof this.options.onDblClickFun == 'function'){
				var $tr = $(e.target).closest('tr');
				if($tr[0].id == this.options.id + '_edit_tr'){
					return;
				}
				var index = 0;
				if($tr.length > 0){
					index = this.getTrIndex($tr);
				}
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[index];
				obj.rowIndex = index;
				this.options.onDblClickFun(obj);
			}
		},
		/*
		 * 单击处理
		 */
		clickFun:function(e){
			var oThis = this;
			
			
			// 处理focus事件
			var $tr = $(e.target).closest('tr');
			if($tr.length > 0 && $tr[0].id == this.options.id + '_edit_tr'){
				return;
			}
			var index = this.getTrIndex($tr);
			if(typeof this.options.onBeforeClickFun == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[index];
				obj.rowIndex = index;
				obj.e = e;
				if(!this.options.onBeforeClickFun(obj)){
					return;
				}
			}
			// 处理树表展开/合上
			this.clickFunTree(e);
			if($tr.length > 0){
				
				var row = oThis.dataSourceObj.rows[index];
				if(row){
					if(oThis.options.rowClickBan){
						return;
					}
					var rowChildIndex = row.childRowIndex;
					if(oThis.dataSourceObj.rows[index].focus && oThis.options.cancelFocus){
						oThis.setRowUnFocus(index);
					}else{
						if(!oThis.dataSourceObj.rows[index].focus){
							oThis.setRowFocus(index);
						}
					}
					this.clickFunEdit(e,index);
				}
			}
		},
		clickFunTree:function(e){
		},
		clickFunEdit:function(e){
		},
		/*
		 * 设置某列是否显示(传入column)
		 */
		setColumnVisibleByColumn:function(column,visible){
			var index = this.getIndexOfColumn(column);
			this.setColumnVisibleByIndex(index,visible);
		},
		/*
		 * 设置某列是否显示(传入index为gridCompColumnArr中的数据)
		 */
		setColumnVisibleByIndex:function(index,visible){
			if(index >= 0){
				var column = this.gridCompColumnArr[index],
					visibleIndex = this.getVisibleIndexOfColumn(column);
				// 显示处理
				if(column.options.visible == false && visible){
					var htmlStr = '<col';
					if (column.options.width) {
						htmlStr += ' style="width:' + this.formatWidth(column.options.width) + '"';
					}
					htmlStr += '>';

					$('#' + this.options.id + '_header th:eq(' + index + ')').css('display', "");
					$('#' + this.options.id + '_content th:eq(' + index + ')').css('display', "");
					$('td:eq(' + index + ')',$('#' + this.options.id + '_content tbody tr')).css('display', "");
					// 当前列之后的显示列的index
					var nextVisibleIndex = this.getNextVisibleInidexOfColumn(column);
					if(nextVisibleIndex == -1){
						// 添加在最后面
						try{
							$('#' + this.options.id + '_header col:last')[0].insertAdjacentHTML('afterEnd',htmlStr);
							$('#' + this.options.id + '_content col:last')[0].insertAdjacentHTML('afterEnd',htmlStr);
						}catch(e){
							$('#' + this.options.id + '_header col:last').after(htmlStr);
							$('#' + this.options.id + '_content col:last').after(htmlStr);
						}
					}else{
						// 添加在下一个显示列之前
						try{
							$('#' + this.options.id + '_header col:eq(' + (nextVisibleIndex) + ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
							$('#' + this.options.id + '_content col:eq(' + (nextVisibleIndex) + ')')[0].insertAdjacentHTML('beforeBegin',htmlStr);
						}catch(e){
							$('#' + this.options.id + '_header col:eq(' + (nextVisibleIndex) + ')').before(htmlStr);
							$('#' + this.options.id + '_content col:eq(' + (nextVisibleIndex) + ')').before(htmlStr);
						}
					}
					var newContentW = this.contentWidth + column.options.width;
				}
				// 隐藏处理
				if(column.options.visible == true && !visible){
					$('#' + this.options.id + '_header th:eq(' + index + ')').css('display', "none");
					$('#' + this.options.id + '_header col:eq(' + visibleIndex + ')').remove();
					$('#' + this.options.id + '_content th:eq(' + index + ')').css('display', "none");
					$('#' + this.options.id + '_content col:eq(' + visibleIndex + ')').remove();
					$('td:eq(' + index + ')',$('#' + this.options.id + '_content tbody tr')).css('display', "none");
					// 隐藏之后需要判断总体宽度是否小于内容区最小宽度，如果小于需要将最后一列进行扩展
					var newContentW = this.contentWidth - column.options.width;
				}
				column.options.visible = visible;
				this.columnsVisibleFun();
				var w = this.contentWidthChange(newContentW);
				this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth;
				this.contentWidth = w;
				this.resetThVariable();
				this.saveGridCompColumnArrToLocal();
			}
		},				
		/*
		 * 对宽度和高度进行处理
		 */
		formatWidth: function(w) { // 获得宽度
			if(w){
				return (w + "").indexOf("%") > 0 ? w : parseInt(w) + "px";
			}else{
				return '';
			}
		},
		/*
		 * 两个元素交换位置，要求传入参数e1在e2之前
		 */
		swapEle: function(e1, e2) {
			var n = e1.next(),
				p = e2.prev();
			e2.insertBefore(n);
			e1.insertAfter(p);
		},
		getString:function(value,defaultValue){
			if(value === null || value === undefined || value === 'null' || value === 'undefined' || value === ""){
				value = defaultValue;
			}
			if(gridBrowser.isIE8){
				return [value].join("");
			}else{
				return value + "";
			}
		},
		getInt:function(value,defaultValue){
			if(value === null || value === undefined || value === 'null' || value === 'undefined' || value === "" || isNaN(value)){
				value = defaultValue;
			}
			return value;
		},
		getFloat:function(value,defaultValue){
			if(value === null || value === undefined || value === 'null' || value === 'undefined' || value === "" || isNaN(value)){
				value = defaultValue;
			}
			return value;
		},
		/*
		 * 克隆对象
		 */
		cloneObj:function(obj){
		    var o;
		    if(typeof obj == "object"){
		        if(obj === null){
		            o = null;
		        }else{
		            if(obj instanceof Array){
		                o = [];
		                for(var i = 0, len = obj.length; i < len; i++){
		                    o.push(this.cloneObj(obj[i]));
		                }
		            }else{
		                o = {};
		                for(var k in obj){
		                    o[k] = this.cloneObj(obj[k]);
		                }
		            }
		        }
		    }else{
		        o = obj;
		    }
		    return o;
		},
		/*
		 * 处理精度
		 */
		DicimalFormater:function(obj){
			var value = obj.value + '',precision = obj.precision;
			for ( var i = 0; i < value.length; i++) {
				if ("-0123456789.".indexOf(value.charAt(i)) == -1)
					return "";
			}
			return this.checkDicimalInvalid(value, precision);
		},
		checkDicimalInvalid:function(value,precision){
			if (value == null || isNaN(value))
				return "";
			// 浮点数总位数不能超过10位
			var digit = parseFloat(value);
			var result = (digit * Math.pow(10, precision) / Math.pow(10, precision))
					.toFixed(precision);
			if (result == "NaN")
				return "";
			return result;
		},
		accAdd:function(v1,v2){
			var r1,r2,m;
			try{
				r1 = v1.toString().split('.')[1].length;
			}catch(e){
				r1 = 0;
			}
			try{
				r2 = v2.toString().split('.')[1].length;
			}catch(e){
				r2 = 0;
			}
			m = Math.pow(10,Math.max(r1,r2))
			return (v1 * m + v2 * m)/m;
		},
		getTrIndex:function($tr){
			return $('tr[id!="' + this.options.id +'_edit_tr"]',$tr.parent()).index($tr);
		},
		/*
		 * 设置数据源
		 */
		setDataSource: function(dataSource) {
			this.initDataSourceVariable();
			this.options.dataSource = dataSource;
			this.initDataSource();
			this.repairContent();
			this.afterGridDivsCreate();
		},
		/*
		 * 设置数据源 格式为：
		 * {
    		fields:['column1','column2','column3','column4','column5','column6'],
    		values:[["cl1","1","cl3","cl4","cl5","cl6"]
    				,["cl12","2","cl32","cl42","cl52","cl62"]
    				,["cl13","3","cl33","cl43","cl53","cl63"]
    				,["cl14","4","cl34","cl44","cl54","cl64"]
    				,["cl15","5","cl35","cl45","cl55","cl65"]
    				,["cl16","6","cl36","cl46","cl56","cl66"]
		    	]

			}
		 */
		setDataSourceFun1: function(dataSource){
			var dataSourceObj = {};
			if(dataSource.values){
				var valuesArr = new Array();
				$.each(dataSource.values, function() {
					if(dataSource.fields){
						var valueObj = {},value = this;
						$.each(dataSource.fields, function(j) {
							$(valueObj).attr(this,value[j])
						});
						valuesArr.push(valueObj);
					}
				});
			}
			$(dataSourceObj).attr('values',valuesArr);
			this.setDataSource(dataSourceObj);
		},
		/*
		 * 添加一行
		 */
		addOneRow:function(row,index){
			var oThis = this,displayFlag = 'none',rowObj = {},parentIndex,
				parentChildLength = 0,l = this.dataSourceObj.rows.length,endFlag = false;
				rowObj.value = row
			if(this.showType == 'grid'){ //只有grid展示的时候才处理div，针对隐藏情况下还要添加数据
				this.editClose();
				index = this.addOneRowTree(row,index,rowObj);
				if(index != 0){
					if(index && index > 0){
						if(l < index)
							index = l;
					}else{
						index = 0;
					}
				}
				if(l == index){
					endFlag = true;
				}
				rowObj.valueIndex = index;
				rowObj.value = row;
				this.dataSourceObj.rows.splice(index,0,rowObj);
				this.updateEditRowIndex('+', index);
				// 如果是在中间插入需要将后续的valueIndex + 1；
				if(this.dataSourceObj.rows.length > (index + 1)){
					$.each(this.dataSourceObj.rows,function(i){
						if(i > index){
							this.valueIndex =  this.valueIndex + 1;
						}
					});
				}
				try{
					var htmlStr = this.createContentOneRow(rowObj,'normal',displayFlag);
					if(endFlag){
						$('#' + this.options.id + '_content_tbody')[0].insertAdjacentHTML('beforeEnd',htmlStr);
					}else{
						var $$tr = $('#' + this.options.id + '_content_tbody').find('tr[role="row"]')[index];
						var $$tbody = $('#' + this.options.id + '_content_tbody')[0];
						if($$tr)
							$$tr.insertAdjacentHTML('beforeBegin',htmlStr);
						else if($$tbody)
							$$tbody.insertAdjacentHTML('afterBegin',htmlStr);
					}
					if($('#' + this.options.id + '_content_fixed_div').length > 0){
						var htmlStr = this.createContentOneRow(rowObj,'fixed',displayFlag);
						if(endFlag){
							$('#' + this.options.id + '_content_fixed_tbody')[0].insertAdjacentHTML('beforeEnd',htmlStr);
						}else{
							var $$tr = $('#' + this.options.id + '_content_fixed_tbody').find('tr[role="row"]')[index]
							if($$tr)
								$$tr.insertAdjacentHTML('beforeBegin',htmlStr);
							else if($('#' + this.options.id + '_content_fixed_tbody')[0])
								$('#' + this.options.id + '_content_fixed_tbody')[0].insertAdjacentHTML('afterBegin',htmlStr);
						}
					}
				}catch(e){
					//IE情况下
					var table = $('#' + this.options.id + '_content_div table')[0];
					if(table)
						this.createContentOneRowForIE(table,index,rowObj,'normal',displayFlag);
					var fixedTable = $('#' + this.options.id + '_content_fixed_div table')[0];
					if(fixedTable)
						this.createContentOneRowForIE(fixedTable,index,rowObj,'fixed',displayFlag);
				}
				if(this.options.multiSelect){
					var htmlStr = this.createContentLeftMultiSelectRow(rowObj,displayFlag);
					if(endFlag){
						$('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('beforeEnd',htmlStr);
					}else{
						var $$div = $('#' + this.options.id + '_content_multiSelect').find('div')[index]
						if($$div)
							$$div.insertAdjacentHTML('beforeBegin',htmlStr);
						else
							$('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('afterBegin',htmlStr);
					}
				}
				if (this.options.showNumCol) {
					var htmlStr = this.createContentLeftNumColRow(l);
					if(endFlag){
						$('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('beforeEnd',htmlStr);
					}else{
						var $$div = $('#' + this.options.id + '_content_numCol').find('div')[index]
						if($$div)
							$$div.insertAdjacentHTML('beforeBegin',htmlStr);
						else
							$('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('afterBegin',htmlStr);
					}
					this.resetNumCol();
					this.updateNumColLastRowFlag();
				}
				this.repairSumRow();
				this.noRowsShowFun();
				this.updateLastRowFlag();
				var obj = {};
				obj.begin = index;
				obj.length = 1;
				this.renderTypeFun(obj);
			}
			// 需要重新排序重置变量
			var l = 0;
			if(this.options.showTree){
				if(this.dataSourceObj.options.values){
					l = this.dataSourceObj.options.values.length;
				}else{
					this.dataSourceObj.options.values = new Array();
				}
				this.dataSourceObj.options.values.splice(index,0,row);
				this.addOneRowTreeHasChildF(rowObj);
			}else{
				if(this.dataSourceObj.options.values){

				}else{
					this.dataSourceObj.options.values = new Array();
				}
				this.dataSourceObj.options.values.splice(index,0,row);
			}
		},
		addOneRowTree:function(row,index){
			return index;
		},
		addOneRowTreeHasChildF:function(){
		},
		editClose:function(){
		},
		/*
		 * 添加多行
		 */
		addRows:function(rows,index){
			if(this.options.showTree){
				// 树表待优化
				var l = rows.length;
				for(var i = 0; i < l;i++){
					this.addOneRow(rows[i],l);
				}
				return;
			}
			this.editClose();
			var htmlStr = '',htmlStrmultiSelect='',htmlStrNumCol='',htmlStrFixed='',oThis = this,l = this.dataSourceObj.rows.length,endFlag = false;
			if(index != 0){
				if(index && index > 0){
					if(l < index)
						index = l;
				}else{
					index = 0;
				}
			}
			if(l == index){
				endFlag = true;
			}
			var rowObjArr = new Array();
			$.each(rows, function(i) {
				var rowObj = {};
				rowObj.value = this;
				rowObj.valueIndex = index + i;
				rowObjArr.push(rowObj);
				oThis.dataSourceObj.rows.splice(index + i,0,rowObj);
				oThis.updateEditRowIndex('+', index+i)
			});
			// 如果是在中间插入需要将后续的valueIndex + 1；
			if(this.dataSourceObj.rows.length > (index + rows.length)){
				$.each(this.dataSourceObj.rows,function(i){
					if(i > (index + rows.length - 1)){
						this.valueIndex =  this.valueIndex + rows.length;
					}
				});
			}
			if(this.showType == 'grid' && $('#' + this.options.id + '_content_div tbody')[0]){ //只有grid展示的时候才处理div，针对隐藏情况下还要添加数据 //lyk--需要完善隐藏之后再显示同事添加数据操作
				$.each(rowObjArr, function(i) {
					htmlStr += oThis.createContentOneRow(this);
					htmlStrFixed += oThis.createContentOneRowFixed(this);
					if(oThis.options.multiSelect){
						htmlStrmultiSelect += oThis.createContentLeftMultiSelectRow(this);
					}
					if(oThis.options.showNumCol){
						htmlStrNumCol += oThis.createContentLeftNumColRow(l + i);
					}
				});
				try{
					if(endFlag){
						$('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('beforeEnd',htmlStr);
					}else{
						if($('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]')[index])
							$('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]')[index].insertAdjacentHTML('beforeBegin',htmlStr);
						else if($('#' + this.options.id + '_content_div tbody')[0])
							$('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('afterBegin',htmlStr);
					}
					if(endFlag){
						$('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('beforeEnd',htmlStrFixed);
					}else{
						if($('#' + this.options.id + '_content_fixed_div').find('tbody').find('tr[role="row"]')[index])
							$('#' + this.options.id + '_content_fixed_div').find('tbody').find('tr[role="row"]')[index].insertAdjacentHTML('beforeBegin',htmlStrFixed);
						else if($('#' + this.options.id + '_content_fixed_div tbody')[0])
							$('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('afterBegin',htmlStrFixed);
					}
				}catch(e){
					//IE情况下
					var table = $('#' + this.options.id + '_content_div table')[0];
					var fixedTable = $('#' + this.options.id + '_content_fixed_div table')[0];
					if(table && fixedTable){
						$.each(rowObjArr, function(i) {
							oThis.createContentOneRowForIE(table,index + i,this);
							oThis.createContentOneRowForIE(fixedTable,index + i,this,'fixed');
						});
					}
				}
				if(this.options.multiSelect){
					if(endFlag){
						$('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('beforeEnd',htmlStrmultiSelect);
					}else{
						var _content_multiSelect = $('#' + this.options.id + '_content_multiSelect').find('div')[index];
						if(_content_multiSelect)
							_content_multiSelect.insertAdjacentHTML('beforeBegin',htmlStrmultiSelect);
						else
							$('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('afterBegin',htmlStrmultiSelect);
					}
				}
				if (this.options.showNumCol) {
					if(endFlag){
						$('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('beforeEnd',htmlStrNumCol);
					}else{
						var _content_multiSelect = $('#' + this.options.id + '_content_numCol').find('div')[index];
						if(_content_multiSelect)
							_content_multiSelect.insertAdjacentHTML('beforeBegin',htmlStrNumCol);
						else
							$('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('afterBegin',htmlStrNumCol);
					}
					this.resetNumCol();
					this.updateNumColLastRowFlag();
				}
				this.repairSumRow();
				this.noRowsShowFun();
				var obj = {};
				obj.begin = index;
				obj.length = rows.length;
				this.renderTypeFun(obj);
			}
			if(this.dataSourceObj.options.values){
			}else{
				this.dataSourceObj.options.values = new Array();
			}
			$.each(rows, function(i) {
				oThis.dataSourceObj.options.values.splice(index + i,0,this);
			});
			this.updateLastRowFlag();
		},
		createContentOneRowFixed:function(rowObj){
			return '';
		},
		updateEditRowIndex: function(opType, opIndex, num) {
		},
		/*
		 * 删除一行
		 */
		deleteOneRow:function(index){
			var oThis = this;
			index = parseInt(index);
			var row = this.dataSourceObj.rows[index];
			if(!row)
				return;
			var rowValue = row.value;
			if(this.showType == 'grid'){ //只有grid展示的时候才处理div，针对隐藏情况下还要添加数据
				this.editClose();
			}
			this.dataSourceObj.rows.splice(index,1);
			this.updateEditRowIndex('-', index);
			if(this.selectRows){
				$.each(this.selectRows,function(i){
					if(this == rowValue){
						oThis.selectRows.splice(i,1);
						oThis.selectRowsObj.splice(i,1);
						oThis.selectRowsIndex.splice(i,1);
					}else if(oThis.selectRowsIndex[i] > index){
						oThis.selectRowsIndex[i] = oThis.selectRowsIndex[i] - 1;
					}
				});
			}
			if(this.focusRow){
				if(this.focusRow == rowValue){
					this.focusRow = null;
					this.focusRowObj = null;
					this.focusRowIndex = null;
				}else if(this.focusRowIndex > index){
					this.focusRowIndex = this.focusRowIndex - 1;
				}
			}
			if(this.showType == 'grid'){ //只有grid展示的时候才处理div，针对隐藏情况下还要添加数据
				$('#' + this.options.id + '_content_div tbody tr:eq(' + index+ ')').remove();
				$('#' + this.options.id + '_content_fixed_div tbody tr:eq(' + index+ ')').remove();
				$('#' + this.options.id + '_content_multiSelect >div:eq(' + index + ')').remove();
				$('#' + this.options.id + '_content_numCol >.u-grid-content-num:eq('+ index + ')').remove();
				this.resetNumCol();
				this.repairSumRow();
				this.noRowsShowFun();
				this.updateNumColLastRowFlag();
			}
			if(this.dataSourceObj.options.values) {
				var i = this.dataSourceObj.options.values.indexOf(rowValue);
				this.dataSourceObj.options.values.splice(i,1);
			}
			this.deleteOneRowTree();
			if(typeof this.options.onRowDelete == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.index = index;
				if(!this.options.onRowDelete(index)){
					return;
				}
			}
		},
		repairSumRow:function(){
		},
		deleteOneRowTree:function(){
		},
		/*
		 * 删除多行
		 */
		deleteRows:function(indexs){
			var oThis = this,indexss = new Array();
			$.each(indexs, function(i) {
				indexss.push(indexs[i]);
			});
			indexss.sort(function(a,b){
				return b-a;
			});

			$.each(indexss, function(i) {
				oThis.deleteOneRow(this);
			});
		},
		/*
		 * 修改某一行
		 */
		updateRow:function(index,row){
			this.dataSourceObj.rows[index].value = row;
			this.dataSourceObj.options.values[this.dataSourceObj.rows[index].valueIndex] = row;
			if(this.showType == 'grid'){
				var obj = {};
				obj.begin = index;
				obj.length = 1;
				this.renderTypeFun(obj);
				this.repairSumRow();
			}
		},
		/*
		 * 修改某个cell的值
		 */
		updateValueAt:function(rowIndex,field,value,force){
			var oThis=this,oldValue = $(this.dataSourceObj.rows[rowIndex].value).attr(field),treeRowIndex = rowIndex;
			if(oldValue != value || force){
				$(this.dataSourceObj.rows[rowIndex].value).attr(field,value);
				$(this.dataSourceObj.options.values[this.dataSourceObj.rows[rowIndex].valueIndex]).attr(field,value);
				if(this.showType == 'grid'){
					var obj = {};
					obj.field = field;
					obj.begin = rowIndex;
					obj.length = 1;
					this.renderTypeFun(obj);
					// this.editColIndex = undefined;
					// 如果编辑行为修改行则同时需要修改编辑行的显示
					treeRowIndex = this.updateValueAtTree(rowIndex,field,value,force);
					this.updateValueAtEdit(rowIndex,field,value,force);
					this.repairSumRow();
				}
				if(typeof this.options.onValueChange == 'function'){
					var obj = {};
					obj.gridObj = this;
					//因为树表更新时候可能改变rowIndex的顺序
					obj.rowIndex = treeRowIndex;
					obj.field = field;
					obj.oldValue = oldValue;
					obj.newValue = value;
					this.options.onValueChange(obj);
				}
			}
		},
		updateValueAtTree:function(rowIndex,field,value,force){
			return rowIndex;
		},
		updateValueAtEdit:function(rowIndex,field,value,force){
		},
		/*
		 * 选中一行
		 * slice 设置全选时，slice为true，不做渲染，在setAllRowSelect中统一渲染
		 */
		setRowSelect:function(rowIndex, doms){
			var selectDiv, rowTr, fixedRowTr,numColDiv
			if(!this.dataSourceObj.rows[rowIndex])
				return true;
			//已经选中退出
			if(this.dataSourceObj.rows[rowIndex].checked)
				return true;
			if (doms && doms['multiSelectDivs'])
				selectDiv = doms['multiSelectDivs'][rowIndex]
			else
				selectDiv = this.$ele.find('#' + this.options.id + '_content_multiSelect').children()[rowIndex]
			if(typeof this.options.onBeforeRowSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				if(!this.options.onBeforeRowSelected(obj)){
					if(this.options.multiSelect){
						var _input = selectDiv.children[0];
						_input.checked = false;
					}
					return false;
				}
			}
			if(!this.options.multiSelect){
				if(this.selectRowsObj && this.selectRowsObj.length > 0){
					$.each(this.selectRowsObj, function() {
						this.checked = false;
					});
				}
				this.selectRows = new Array();
				this.selectRowsObj = new Array();
				this.selectRowsIndex = new Array();
				if(this.showType == 'grid'){
					$('#' + this.options.id + '_content_tbody tr').removeClass("u-grid-content-sel-row");
					$('#' + this.options.id + '_content_tbody tr a').removeClass("u-grid-content-sel-row");
					$('#' + this.options.id + '_content_fixed_tbody tr').removeClass("u-grid-content-sel-row");
					$('#' + this.options.id + '_content_fixed_tbody tr a').removeClass("u-grid-content-sel-row");
					if(this.options.multiSelect){
						$('#' + this.options.id + '_content_multiSelect div').removeClass("u-grid-content-sel-row");
					}
					if(this.options.showNumCol){
						$('#' + this.options.id + '_content_numCol div').removeClass("u-grid-content-sel-row");
					}
				}
			}else{
				if(this.showType == 'grid'){
					var _input = selectDiv.children[0];
					// _input.checked = true;
					$(_input).addClass('is-checked');
				}
			}
			if(this.showType == 'grid'){
				if (doms && doms['contentTrs'])
					rowTr =  doms['contentTrs'][rowIndex]
				else 
					rowTr = this.$ele.find('#' + this.options.id + '_content_tbody tr[role="row"]')[rowIndex]
				$(rowTr).addClass("u-grid-content-sel-row");

				if (doms && doms['fixContentTrs'])
					fixedRowTr =  doms['fixContentTrs'][rowIndex]
				else 
					fixedRowTr = this.$ele.find('#' + this.options.id + '_content_fixed_tbody tr[role="row"]')[rowIndex]
				$(fixedRowTr).addClass("u-grid-content-sel-row");
				var ini = rowIndex;
				if(this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form'){
					ini++;
				}
				if(this.options.multiSelect){
					if (ini != rowIndex)
						selectDiv =  this.$ele.find('#' + this.options.id + '_content_multiSelect').children()[ini]
					$(selectDiv).addClass('u-grid-content-sel-row');
				}
				if(this.options.showNumCol){
					if (doms && doms['numColDivs'])
						numColDiv =  doms['numColDivs'][ini]
					else 
						numColDiv = this.$ele.find('#' + this.options.id + '_content_numCol').children()[ini]	
					$(numColDiv).addClass('u-grid-content-sel-row');
				}
			}
			this.selectRows.push(this.dataSourceObj.rows[rowIndex].value);
			this.selectRowsObj.push(this.dataSourceObj.rows[rowIndex]);
			this.selectRowsIndex.push(rowIndex);
			this.dataSourceObj.rows[rowIndex].checked = true;
			if(typeof this.options.onRowSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				this.options.onRowSelected(obj);
			}
			return true;
		},
		/*
		 * 反选一行
		 */
		setRowUnselect:function(rowIndex){
			var oThis=this;
			if(!this.dataSourceObj.rows[rowIndex])
				return true;
			//已经选中退出
			if(!this.dataSourceObj.rows[rowIndex].checked)
				return true;
			if(typeof this.options.onBeforeRowUnSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				if(!this.options.onBeforeRowUnSelected(obj)){
					if(this.options.multiSelect){
						$('#' + this.options.id + '_content_multiSelect input:eq(' + rowIndex+ ')')[0].checked = true;
					}
					return false;
				}
			}
			if(this.options.multiSelect){
				// $('#' + this.options.id + '_content_multiSelect input:eq(' + rowIndex+ ')')[0].checked = false;
				$('#' + this.options.id + '_content_multiSelect .u-grid-checkbox-outline:eq(' + rowIndex+ ')').removeClass('is-checked');
			}
			var ini = rowIndex;
			if(this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form'){
				ini++;
			}
			$('#' + this.options.id + '_content_tbody tr:eq(' + ini+ ')').removeClass("u-grid-content-sel-row");
			$('#' + this.options.id + '_content_tbody tr:eq(' + ini+ ') a').removeClass("u-grid-content-sel-row");
			$('#' + this.options.id + '_content_fixed_tbody tr:eq(' + ini+ ')').removeClass("u-grid-content-sel-row");
			$('#' + this.options.id + '_content_fixed_tbody tr:eq(' + ini+ ') a').removeClass("u-grid-content-sel-row");
			if(this.options.multiSelect){
				$('#' + this.options.id + '_content_multiSelect >div:eq(' + ini + ')').removeClass("u-grid-content-sel-row");
			}
			if(this.options.showNumCol){
				$('#' + this.options.id + '_content_numCol >div:eq(' + ini + ')').removeClass("u-grid-content-sel-row");
			}
			$.each(this.selectRows,function(i){
				if(this == oThis.dataSourceObj.rows[rowIndex].value){
					oThis.selectRows.splice(i,1);
					oThis.selectRowsObj.splice(i,1);
					oThis.selectRowsIndex.splice(i,1);
				}
			})
			this.dataSourceObj.rows[rowIndex].checked = false;
			if(typeof this.options.onRowUnSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				this.options.onRowUnSelected(obj);
			}
			return true;
		},
		/*
		 * 选中所有行
		 */
		setAllRowSelect:function(){
			// $('#' + this.options.id + '_header_multi_input').prop('checked', true)
			$('#' + this.options.id + '_header_multi_input').addClass('is-checked');
			if(typeof this.options.onBeforeAllRowSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObjs = this.dataSourceObj.rows;
				if(!this.options.onBeforeAllRowSelected(obj)){
					return;
				}
			}
			// 把需要的dom在循环外获取出来
			var multiSelectDivs = this.$ele.find('#' + this.options.id + '_content_multiSelect').children(),
				numColDivs = this.$ele.find('#' + this.options.id + '_content_numCol').children(),
				contentTrs =  this.$ele.find('#' + this.options.id + '_content_tbody tr[role="row"]'),
				fixContentTrs =  this.$ele.find('#' + this.options.id + '_content_fixed_tbody tr[role="row"]');
			this.$ele.find('#' + this.options.id + '_content_tbody tr[role="row"]')
			for(var i=0;i<this.dataSourceObj.rows.length;i++){
				this.setRowSelect(i, {multiSelectDivs:multiSelectDivs, numColDivs:numColDivs, contentTrs: contentTrs, fixContentTrs: fixContentTrs});
			}
			if(typeof this.options.onAllRowSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObjs = this.dataSourceObj.rows;
				this.options.onAllRowSelected(obj);
			}
		},
		/*
		 * 反选所有行
		 */
		setAllRowUnSelect:function(){
			// $('#' + this.options.id + '_header_multi_input').attr('checked', false)
			$('#' + this.options.id + '_header_multi_input').removeClass('is-checked');
			if(typeof this.options.onBeforeAllRowUnSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObjs = this.dataSourceObj.rows;
				if(!this.options.onBeforeAllRowUnSelected(obj)){
					return;
				}
			}
			for(var i=0;i<this.dataSourceObj.rows.length;i++){
				this.setRowUnselect(i);
			}
			if(typeof this.options.onAllRowUnSelected == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObjs = this.dataSourceObj.rows;
				this.options.onAllRowUnSelected(obj);
			}
		},
		/*
		 * 获取选中行
		 */
		getSelectRows:function(){
			return this.selectRows;
		},
		/*
		 * 获取选中行对应行号
		 */
		getSelectRowsIndex:function(){
			return this.selectRowsIndex;
		},
		/*
		 * focus一行
		 */
		setRowFocus:function(rowIndex){
			//已经选中退出
			if(this.dataSourceObj.rows[rowIndex].focus)
				return true;
			if(!this.dataSourceObj.rows[rowIndex])
				return true;
			if(typeof this.options.onBeforeRowFocus == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				if(!this.options.onBeforeRowFocus(obj)){
					return false;
				}
			}
			$('#' + this.options.id + '_content_tbody tr').removeClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_tbody tr a').removeClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_fixed_tbody tr').removeClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_fixed_tbody tr a').removeClass("u-grid-content-focus-row");
			if(this.options.multiSelect){
				$('#' + this.options.id + '_content_multiSelect').find('div').removeClass("u-grid-content-focus-row");
			}
			if(this.options.showNumCol){
				$('#' + this.options.id + '_content_numCol').find('div').removeClass("u-grid-content-focus-row");
			}
			if(this.focusRowObj){
				this.focusRowObj.focus = false;
			}
			$('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + rowIndex+ ')').addClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + rowIndex+ ') a').addClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + rowIndex+ ')').addClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + rowIndex+ ') a').addClass("u-grid-content-focus-row");
			var ini = rowIndex;
			if(this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form'){
				ini++;
			}
			if(this.options.multiSelect){
				$('#' + this.options.id + '_content_multiSelect >div:eq(' + ini + ')').addClass("u-grid-content-focus-row");
			}
			if(this.options.showNumCol){
				$('#' + this.options.id + '_content_numCol >div:eq(' + ini + ')').addClass("u-grid-content-focus-row");
			}
			this.focusRow = this.dataSourceObj.rows[rowIndex].value;
			this.focusRowObj = this.dataSourceObj.rows[rowIndex];
			this.focusRowIndex = rowIndex;
			this.dataSourceObj.rows[rowIndex].focus = true;
			if(typeof this.options.onRowFocus == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				this.options.onRowFocus(obj);
			}
			if(!this.options.multiSelect){
				this.setRowSelect(rowIndex);
			}
			return true;
		},
		/*
		 * 反focus一行
		 */
		setRowUnFocus:function(rowIndex){
			var oThis=this;
			if(!this.dataSourceObj.rows[rowIndex])
				return true;
			if(typeof this.options.onBeforeRowUnFocus == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				if(!this.options.onBeforeRowUnFocus(obj)){
					return false;
				}
			}
			//已经选中退出
			if(!this.dataSourceObj.rows[rowIndex].focus)
				return true;
			var ini = rowIndex;
			if(this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form'){
				ini++;
			}
			$('#' + this.options.id + '_content_tbody tr:eq(' + ini+ ')').removeClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_tbody tr:eq(' + ini+ ') a').removeClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_fixed_tbody tr:eq(' + ini+ ')').removeClass("u-grid-content-focus-row");
			$('#' + this.options.id + '_content_fixed_tbody tr:eq(' + ini+ ') a').removeClass("u-grid-content-focus-row");
			if(this.options.multiSelect){
				$('#' + this.options.id + '_content_multiSelect >div:eq(' + ini + ')').removeClass("u-grid-content-focus-row");
			}
			if(this.options.showNumCol){
				$('#' + this.options.id + '_content_numCol >div:eq(' + ini + ')').removeClass("u-grid-content-focus-row");
			}
			this.dataSourceObj.rows[rowIndex].focus = false;
			this.focusRow = null;
			this.focusRowObj = null;
			this.focusRowIndex = null;
			if(typeof this.options.onRowUnFocus == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[rowIndex];
				obj.rowIndex = rowIndex;
				this.options.onRowUnFocus(obj);
			}
			if(!this.options.multiSelect){
				this.setRowUnselect(rowIndex);
			}
			return true;
		},
		/*
		 * 增加删除时重置数字列
		 */
		resetNumCol:function(){
			var numCols = $('#' + this.options.id + '_content_numCol >.u-grid-content-num');
			$.each(numCols,function(i){
				this.innerHTML = i + 1 + "";
			});
		},
		/*
		 * 获取focus行
		 */
		getFocusRow:function(){
			return this.focusRow;
		},
		/*
		 * 获取focus行对应行号
		 */
		getFocusRowIndex:function(){
			return this.focusRowIndex;
		},
		/*
		 * 获取所有行
		 */
		getAllRows:function(){
			var oThis = this;
			this.allRows = new Array();
			if(this.dataSourceObj.rows){
				$.each(this.dataSourceObj.rows,function(){
					oThis.allRows.push(this.value);
				});
			}
			return this.allRows;
		},
		/*
		 * 根据行号获取row
		 */
		getRowByIndex:function(index){
			return this.dataSourceObj.rows[index];
		},
		/*
		 * 根据某个字段值获取rowIndex
		 */
		getRowIndexByValue:function(field,value){
			var index = -1;
			$.each(this.dataSourceObj.rows,function(i){
				var v = $(this.value).attr(field);
				if(v == value){
					index = i;
				}
			})
			return index;
		},
		/*
		 * 根据filed设置renderType
		 */
		setRenderType:function(field,renderType){
			var gridCompColumn = this.getColumnByField(field);
			gridCompColumn.options.renderType = renderType;
			var index = this.getIndexOfColumn(gridCompColumn);
			this.renderTypeByColumn(gridCompColumn,index);
		},
		/*
		 * 设置是否显示header
		 */
		setShowHeader:function(showHeader){
			this.options.showHeader = showHeader;
			if(showHeader){
				$('#' + this.options.id + '_header').css('display',"block");
			}else{
				$('#' + this.options.id + '_header').css('display',"none");
			}
		},
		setColumnPrecision:function(field,precision){
			var gridColumn = this.getColumnByField(field);
			gridColumn.options.precision = precision;
			this.renderTypeFun();
			if(this.options.showSumRow){
				this.repairSumRow();
			}
		},
		setMultiSelect:function(multiSelect){
			var oldMultiSelect = this.options.multiSelect;
			if(oldMultiSelect != multiSelect){
				this.options.multiSelect = multiSelect;
				this.initGrid();
			}
		},
		setShowNumCol:function(showNumCol){
			var oldShowNumCol = this.options.showNumCol;
			if(oldShowNumCol != showNumCol){
				this.options.showNumCol = showNumCol;
				this.initGrid();
			}
		},
		isGridShow:function(){
			if(this.showType == 'grid')
				return true;
			return false;
		},
		getBoolean:function(value){
			if(value === 'true' || value === true)
				return true;
			return false;
		}
	}
	gridCompColumn.prototype = {
		/*
		 * 处理参数
		 */
		init:function(options, gridComp){
			this.gridComp = gridComp;
			var gridOptions = gridComp.options;
			this.defaults = {
					width:200, // 默认宽度为200
					sortable: true, // 是否可以排序
					canDrag: true, // 是否可以拖动
					fixed: false, // 是否固定列
					visible: true, // 是否显示
					canVisible: true, // 是否可以隐藏
					sumCol:false, // 是否计算合计
					editable:true, // 是否可修改
					editFormShow:true, // 是否可修改
					autoExpand:false, // 是否自动扩展列
					editType:'text', // 编辑类型，支持传入function扩展
					dataType:'String', // 数据类型,String, Date, Datetime, Int, Float
					//precision:  //精度
					format:'YYYY-MM-DD hh:mm:ss',
					//renderType:'', 渲染类型
					//headerColor
					headerLevel:1, // header层级
					hiddenLevel:1, // 宽度不足隐藏的优先级，值越大优先隐藏
					// parentHeader 对应的父header的title
					// 目前仅支持两级，多级的话需要改变头的高度，另外处理当前级别的时候需要看下是否存在上级，如果存在上级的话
					// 则创建新的div，这就涉及到需要躲变量计算每级的宽度，需要考虑下如何实现。
					// headerColor:'#a8a8a8'
			};
				// 从grid继承的属性
			var gridDefault = {
				sortable: gridOptions.sortable,
				canDrag: gridOptions.canDrag,
				width: gridOptions.columnWidth
			};
			if(options.dataType == 'Date'){
				this.defaults.format = 'YYYY-MM-DD';
			}
			// 树表暂时不支持排序
			options = this.initTree(options,gridOptions)
			this.options = $.extend({}, this.defaults, gridDefault, options);
			this.getBooleanOptions();
			try{
				if(typeof this.options.renderType == 'string')
					this.options.renderType = eval(this.options.renderType)
			}catch(e){

			}
			try{
				if(typeof this.options.editType == 'string')
					this.options.editType = eval(this.options.editType)
			}catch(e){

			}
				
			// 转成数字
			this.options.width = parseInt(this.options.width);
			this.firstColumn = false;
		},
		initTree:function(options){
			return options;
		},
		getBooleanOptions:function(){
			this.options.sortable = this.gridComp.getBoolean(this.options.sortable);
			this.options.canDrag = this.gridComp.getBoolean(this.options.canDrag);
			this.options.fixed = this.gridComp.getBoolean(this.options.fixed);
			this.options.visible = this.gridComp.getBoolean(this.options.visible);
			this.options.canVisible = this.gridComp.getBoolean(this.options.canVisible);
			this.options.sumCol = this.gridComp.getBoolean(this.options.sumCol);
			this.options.editable = this.gridComp.getBoolean(this.options.editable);
			this.options.editFormShow = this.gridComp.getBoolean(this.options.editFormShow);
			this.options.autoExpand = this.gridComp.getBoolean(this.options.autoExpand);
		},
	}
	dataSource.prototype = {
		/*
		 * 处理参数
		 */
		init:function(options, gridComp){
			this.defaults = {}
			this.gridComp = gridComp;
			this.options = $.extend({}, this.defaults, options);
			this.rows = new Array(); // 存储数据行
			this.hasParentRows = new Array(); // 存在父项
			this.nothasParentRows = new Array(); // 不存在父项
		},
		/*
		 * 将values转化为rows并进行排序
		 */
		sortRows:function(field,sortType){
			if(this.gridComp.options.showTree){
				this.treeSortRows(field,sortType);
			}else{
				this.basicSortRows(field,sortType);
			}
			this.gridComp.eidtRowIndex = -1;
		},
		/*
		 * 将values转化为rows并进行排序(标准)
		 */
		basicSortRows: function(field, sortType) {
			var oThis = this,dataType = "";
			if(field){
				dataType = this.gridComp.getColumnByField(field).options.dataType;
			}
			this.rows = new Array();
			if(this.options.values){
				$.each(this.options.values, function(i) {
					var rowObj = {};
					rowObj.value = this;
					rowObj.valueIndex = i;
					oThis.rows.push(rowObj);
				});
			}
			
		},
		treeSortRows:function(field,sortType){
			this.basicSortRows(field,sortType);
		},
		/*
		 * 获取合计值
		 */
		getSumValue:function(field,gridCompColumn,gridComp){
			var sumValue = null;
			if(gridCompColumn.options.sumCol){
				$.each(this.rows, function(i) {
					var v = $(this.value).attr(field);
					if(gridCompColumn.options.dataType == 'Int'){
						v = gridComp.getInt(v,0);
						sumValue  += parseInt(v);
					}else{
						v = gridComp.getFloat(v,0);
						sumValue  = gridComp.accAdd(sumValue,parseFloat(v));
					}
				});
			}
			// 处理精度
			if(gridCompColumn.options.dataType == 'Float' && gridCompColumn.options.precision){
				var o = {};
				o.value = sumValue;
				o.precision = gridCompColumn.options.precision;
				sumValue = gridComp.DicimalFormater(o);
			}
			if(sumValue != null && sumValue != undefined && sumValue != 'null' && sumValue != 'undefined'){
				return sumValue + '';
			}else{
				return '';
			}
		}
	};
	var old = $.fn.grid;
	// 方法扩展
	$.fn.grid = function(options) {
		var grid = $(this).data('gridComp');
		if(!grid)
			$(this).data('gridComp',(grid = new gridComp(this, options)));
		return grid;
	};
	$.fn.grid.gridComp = gridComp;
	$.fn.grid.gridCompColumn = gridCompColumn;
	$.fn.grid.dataSource = dataSource;

	$.fn.grid.noConflict = function() {
		$.fn.grid = old;
		return this;
	}
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		initGridCompColumnFun = gridCompProto.initGridCompColumn,
		initEventFunFun = gridCompProto.initEventFun,
		initGridEventFunFun = gridCompProto.initGridEventFun;
	

	gridCompProto.initGridCompColumnColumnMenuFun = function(columnOptions){
		var column1 = new this.gridCompColumn(columnOptions, this);
			column1.options.realWidth = column1.options.width;
			this.basicGridCompColumnArr.push(column1);
	};

	gridCompProto.initGridCompColumn = function(){
		// 执行原有方法
		initGridCompColumnFun.apply(this,arguments);
		// 扩展方法
		this.menuColumnsHeight = this.gridCompColumnArr.length * this.columnMenuHeight;
	};

	gridCompProto.createColumnMenu = function() {
		var oThis = this;
		var htmlStr = '<div class="u-grid-column-menu" id="' + this.options.id + '_column_menu">';
		htmlStr += '<ul data-role="menu" role="menubar" class="u-grid-column-menu-ul" id="' + this.options.id + '_column_menu_ul">';

		// 创建显示/隐藏列
		/*htmlStr += '<li class="u-grid-column-menu-li" role="menuitem">';
		htmlStr += '<div class="u-grid-column-menu-div1" id="' + this.options.id + '_showColumn">';
		htmlStr += '<span class="u-grid-column-menu-span">' + this.transMap.ml_show_column + '</span>';
		htmlStr += '<div class="u-grid-column-menu-div3 fa fa-caret-right"></div>';
		htmlStr += '</div></li>';*/

		// 创建清除设置
		htmlStr += '<li class="u-grid-column-menu-li" role="menuitem">';
		htmlStr += '<div class="u-grid-column-menu-div1" id="' + this.options.id + '_clearSet">';
		htmlStr += '<span class="u-grid-column-menu-span">' + this.transMap.ml_clear_set + '</span>';
		htmlStr += '</div></li>';


		htmlStr += '<div class="u-grid-column-menu-columns" id="' + this.options.id + '_column_menu_columns">';
		htmlStr += '<ul data-role="menu" role="menubar" class="u-grid-column-menu-columns-ul" id="' + this.options.id + '_column_menu_columns_ul">';
		$.each(this.gridCompColumnArr, function(i) {
			if(oThis.getString(this.options.title,'') != ''){
				htmlStr += '<li class="u-grid-column-menu-columns-li" role="menuitem" index="' + i + '">';
				htmlStr += '<div class="u-grid-column-menu-columns-div1">';
				var checkedStr = "";
				if(this.options.visible)
					checkedStr = ' checked';
				if(!this.options.canVisible)
					checkedStr += ' style="display:none;"';
				htmlStr += '<div class="u-grid-column-menu-columns-div2"><input type="checkbox" ' + checkedStr + '></div>';
				htmlStr += '<span class="u-grid-column-menu-columns-span">' + this.options.title + '</span>';
				htmlStr += '</div></li>';
			}
		});
		htmlStr += '</ul></div>';


		htmlStr += '</ul></div>';

		// 创建数据列区域
		
		return htmlStr;
	};

	gridCompProto.initEventFun = function(){
		// 执行原有方法
		initEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
		$('#' + this.options.id).on('mouseup', function(e) {
			if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
				// 点击的是header区域
				oThis.mouseUpX = e.clientX;
				oThis.mouseUpY = e.clientY;
				//点击过程中鼠标没有移动
				if (oThis.mouseDownX == oThis.mouseUpX && oThis.mouseDownY == oThis.mouseUpY) {
				//或者移动距离小于5px(由于移动之后会显示屏幕div，暂时不做处理)
	//					if( Math.abs(parseInt(oThis.mouseDownX) - parseInt(oThis.mouseUpX)) <=5 && Math.abs(parseInt(oThis.mouseDownY) - parseInt(oThis.mouseUpY)) <=5){
					oThis.columnClickX = e.clientX;
					oThis.columnClickY = e.clientY;
					var eleTh = $(e.target).closest('th')[0];
					if($(e.target).hasClass('u-grid-header-columnmenu')){
						//点击的是columnmenu
						$('#' + oThis.options.id + '_column_menu').css('display','block');
						/*var left = eleTh.attrRightTotalWidth - oThis.scrollLeft + oThis.leftW + oThis.fixedWidth - 20;
						if(left + oThis.columnMenuWidth > oThis.wholeWidth)
							left = eleTh.attrRightTotalWidth - oThis.scrollLeft + oThis.leftW + oThis.fixedWidth - oThis.columnMenuWidth + 1;*/
						$('#' + oThis.options.id + '_column_menu').css('right',0);
						$('#' + oThis.options.id + '_column_menu').css('top',oThis.headerHeight);

						/*数据列多的情况下处理显示的高度*/
						var sX = $(window).width();
						var sH = $(window).height();
						
						var columnsTop = oThis.headerHeight;
						var cY = e.clientY;
						// 如果数据列高度高于屏幕高度则数据列高度设置为屏幕高度-10；
						var columnsHeight = oThis.menuColumnsHeight;
						var hh = 0;
						if((oThis.menuColumnsHeight + 74) > sH){
							columnsHeight = sH - 74;
							$('#' + oThis.options.id + '_column_menu_columns').css('height',columnsHeight + 'px');
						}else{
							$('#' + oThis.options.id + '_column_menu_columns').css('height','');
						}

						oThis.ele.createColumnMenuFlag = true;
					}else{
						
					}
				}
			} else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
				// 点击的是数据区域

			}
		
		});

		$(document).on('click',function(){
			if(oThis.columnMenuMove == false && oThis.ele.createColumnMenuFlag == false){
				$('#' + oThis.options.id + '_column_menu',oThis.$ele).css('display','none');
			}
			oThis.ele.createColumnMenuFlag = false;
		});
	};

	gridCompProto.initGridEventFun = function(){
		// 执行原有方法
		initGridEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
		// 列头按钮显示/隐藏
		/*$('#' + this.options.id + '_header_table th').on('mousemove',function(e){
			$('.u-grid-header-columnmenu',$(this)).css('display','block');
		});

		$('#' + this.options.id + '_header_table th').on('mouseout',function(e){
			$('.u-grid-header-columnmenu',$(this)).css('display','none');
		});*/

		/*header 按钮处理开始*/
		// column按钮
		$('#' + this.options.id + '_column_menu_ul').on('mousemove', function(e) {
			oThis.columnMenuMove = true;
		});
		$('#' + this.options.id + '_column_menu_ul').on('mouseout', function(e) {
			oThis.columnMenuMove = false;
		});

		// 显示/隐藏列按钮
		/*$('#' + this.options.id + '_showColumn').on('mousemove', function(e) {
			//待完善 考虑屏幕高度决定columnMenu显示形式

			if(oThis.hideMenuColumns)
				clearTimeout(oThis.hideMenuColumns);
			if($('#' + oThis.options.id + '_column_menu_columns').css('display') == 'block')
				return;
			var sX = $(window).width();
			var sH = $(window).height();

			var menuLeft = $('#' + oThis.options.id + '_column_menu').css('left');
			var columnsLeft = parseInt(menuLeft) + oThis.columnMenuWidth;
			var maxLeft = oThis.columnClickX + oThis.columnMenuWidth * 2;
			if(maxLeft > sX)
				columnsLeft = parseInt(menuLeft) - oThis.columnMenuWidth;
			$('#' + oThis.options.id + '_column_menu_columns').css('left',columnsLeft);
			var columnsTop = oThis.headerHeight;
			var cY = e.clientY;
			// 如果数据列高度高于屏幕高度则数据列高度设置为屏幕高度-10；
			var columnsHeight = oThis.menuColumnsHeight;
			var hh = 0;
			if((oThis.menuColumnsHeight + 30) > sH){
				columnsHeight = sH - 30;
				$('#' + oThis.options.id + '_column_menu_columns').css('height',columnsHeight + 'px');
			}else{
				$('#' + oThis.options.id + '_column_menu_columns').css('height','');
			}
			var maxHeight = cY + columnsHeight;
			if(maxHeight > sH)
				columnsTop = (cY - (sH - columnsHeight)) * -1 + 30;
			$('#' + oThis.options.id + '_column_menu_columns').css('top',columnsTop);
			$('#' + oThis.options.id + '_column_menu_columns').css('display','block');
			oThis.columnMenuMove = true;
		});
		$('#' + this.options.id + '_showColumn').on('mouseout', function(e) {
			oThis.hideMenuColumns = setTimeout(function(){
				$('#' + oThis.options.id + '_column_menu_columns').css('display','none');
				oThis.columnMenuMove = false;
			},200);

		});*/
		/*$('#' + this.options.id + '_column_menu_columns').on('mousemove', function(e) {
			if(oThis.hideMenuColumns)
				clearTimeout(oThis.hideMenuColumns);
			$('#' + oThis.options.id + '_column_menu_columns').css('display','block');
			oThis.columnMenuMove = true;
		});
		$('#' + this.options.id + '_column_menu_columns').on('mouseout', function(e) {
			oThis.hideMenuColumns = setTimeout(function(){
				$('#' + oThis.options.id + '_column_menu_columns').css('display','none');
				oThis.columnMenuMove = false;
			},200);
		});*/

		// 清除设置按钮
		$('#' + this.options.id + '_clearSet').on('click', function(e) {
			oThis.clearLocalData();
			oThis.initGridCompColumn();
			// 清除排序
			oThis.dataSourceObj.sortRows();
			oThis.repaintGridDivs();
			if(typeof oThis.options.onClearSetFun == 'function'){
				oThis.options.onClearSetFun(oThis);
			}
		});
		// 显示/隐藏列 对应所有列的点击处理
		$('#' + this.options.id + '_column_menu_columns_ul li input').on('click', function(e) {
			//待完善 优化与li的click的代码整合
			var index = $(this).closest('li').attr('index');

			if(oThis.gridCompColumnArr[index].options.visible){
				$(this)[0].checked = false;
				var ll = $('input:checked',$('#' + oThis.options.id + '_column_menu_columns_ul')).length;
				if(ll == 0){
					$(this)[0].checked = true;
					return;
				}

				if(document.documentMode == 8){
					var oldScrollTop = $('#' + oThis.options.id + '_column_menu_columns')[0].scrollTop;
					var oldTop = $('#' + oThis.options.id + '_column_menu_columns')[0].style.top;
					oThis.gridCompColumnArr[index].options.visible = false;
					oThis.repaintGridDivs();
					$('#' + oThis.options.id + '_column_menu').css('display','block');
					$('#' + oThis.options.id + '_column_menu').css('right','0px');
					$('#' + oThis.options.id + '_column_menu').css('top',oldTop);
					$('#' + oThis.options.id + '_column_menu_columns')[0].scrollTop = oldScrollTop;

				}else{
					oThis.setColumnVisibleByIndex(index,false);
					oThis.gridCompColumnArr[index].options.visible = false;
				}
			}else{
				$(this)[0].checked = true;

				if(document.documentMode == 8){
					var oldScrollTop = $('#' + oThis.options.id + '_column_menu_columns')[0].scrollTop;
					var oldTop = $('#' + oThis.options.id + '_column_menu_columns')[0].style.top;
					oThis.gridCompColumnArr[index].options.visible = true;
					oThis.repaintGridDivs();
					$('#' + oThis.options.id + '_column_menu').css('display','block');
					$('#' + oThis.options.id + '_column_menu').css('right','0px');
					$('#' + oThis.options.id + '_column_menu').css('top',oldTop);
					$('#' + oThis.options.id + '_column_menu_columns')[0].scrollTop = oldScrollTop;
				}else{
					oThis.setColumnVisibleByIndex(index,true);
					oThis.gridCompColumnArr[index].options.visible = true;
				}

			}
			oThis.saveGridCompColumnArrToLocal();
			e.stopPropagation();
		});
		$('#' + this.options.id + '_column_menu_columns_ul li').on('click', function(e) {
			var index = $(this).attr('index');
			var gridCompColumn = oThis.gridCompColumnArr[index];
			if(!gridCompColumn.options.canVisible){
				return false;
			}
			//获取选中列数量，不能小于1
			if(gridCompColumn.options.visible){
				$('input',$(this))[0].checked = false;
				var ll = $('input:checked',$('#' + oThis.options.id + '_column_menu_columns_ul')).length;
				if(ll == 0){
					$('input',$(this))[0].checked = true;
					return;
				}
				oThis.setColumnVisibleByIndex(index,false);
				oThis.gridCompColumnArr[index].options.visible = false;
			}else{
				$('input',$(this))[0].checked = true;
				oThis.setColumnVisibleByIndex(index,true);
				oThis.gridCompColumnArr[index].options.visible = true;
			}
			oThis.saveGridCompColumnArrToLocal();
		});
		/*header 按钮处理结束*/
	};
	if(typeof gridCompProto.saveGridCompColumnArrToLocal == 'undefined'){
		gridCompProto.saveGridCompColumnArrToLocal = function(){
		};
	}
	if(typeof gridCompProto.clearLocalData == 'undefined'){
		gridCompProto.clearLocalData = function(){
		};
	}
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		initEventFunFun = gridCompProto.initEventFun,
		initGridEventFunFun = gridCompProto.initGridEventFun;

	
	gridCompProto.createHeaderDrag = function(){
		return '<div class="u-grid-header-resize-handle" id="' + this.options.id + '_resize_handle"><div class="u-grid-header-resize-handle-inner"></div></div>';
	};

	gridCompProto.initEventFun = function(){
		// 执行原有方法
		initEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;

		$('#' + this.options.id).on('mousemove', function(e) {
//				if (!oThis.countWidthFlag) {
//					oThis.countWidth(e); //某些情况下不是创建完就显示的，所以在mousemove中处理
//					oThis.countWidthFlag = true;
//				}
			if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
				// 在header区域移动
				var eleTh = $(e.target).closest('th')[0];
				// 将其他列的操作按钮隐藏，显示当前列的
				oThis.headerThDrag(e, eleTh);
			}
			
			oThis.dragFun(e);
			e.stopPropagation();
		});
		$('#' + this.options.id + '_top').on('mousemove', function(e) {
			oThis.dragFun(e);
			e.stopPropagation();
		});

		$('#' + this.options.id).on('mouseup', function(e) {
			oThis.dragEnd(e);
		});

		$('#' + this.options.id+ '_top').on('mouseup', function(e) {
			oThis.dragEnd(e);
		});	

	};

	gridCompProto.initGridEventFun = function(){
		// 执行原有方法
		initGridEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
		$('#' + this.options.id + '_resize_handle').on('mousedown', function(e) {
			oThis.dragStart(e);
			return false;
		});
	};
	/*
	 * 拖动开始
	 */
	gridCompProto.dragStart = function(e) {
		this.dragFlag = true;
		this.dragW = null;
		this.dragStartX = e.clientX;
	};
	/*
	 * 改变列宽度处理
	 */
	gridCompProto.dragFun = function(e) {
		if (this.dragFlag) {
			var nowTh = $('#' + this.options.id + '_resize_handle')[0].nowTh,
				$nowTh = $(nowTh),
				nowThIndex = $nowTh.attr('index'),
				column = this.gridCompColumnArr[nowThIndex];
				nowVisibleThIndex = this.getVisibleIndexOfColumn(column);
			if (nowTh && column != this.lastVisibleColumn) {
				this.dragEndX = e.clientX;
				var changeWidth = this.dragEndX - this.dragStartX,
					newWidth = nowTh.attrWidth + changeWidth;
					cWidth = this.contentWidth + changeWidth;
				if (newWidth > this.minColumnWidth) {
					this.dragW = this.contentWidthChange(cWidth);
					$('#' + this.options.id + '_header_table col:eq(' + nowVisibleThIndex + ')').css('width', newWidth + "px");
					$('#' + this.options.id + '_content_table col:eq(' + nowVisibleThIndex + ')').css('width', newWidth + "px");

					column.options.width = newWidth;
				}
			}
			$('#' + this.options.id + '_top').css('display', 'block');
		}
	};
	/*
	 * 拖动结束
	 */
	gridCompProto.dragEnd = function(e) {
		if (this.dragFlag) {
			this.resetThVariable();
			this.saveGridCompColumnArrToLocal();
		}
		this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth;
		if(this.dragW)
			this.contentWidth = this.dragW;
		$('#' + this.options.id + '_resize_handle')[0].nowTh = null;
		this.dragFlag = false;
		$('#' + this.options.id + '_top').css('display', 'none');
	};
	if(typeof gridCompProto.saveGridCompColumnArrToLocal == 'undefined'){
		gridCompProto.saveGridCompColumnArrToLocal = function(){
		};
	}
	/*
	 * 计算拖动div所在位置
	 */
	gridCompProto.headerThDrag = function(e, ele) {
		if (!this.dragFlag && !this.swapColumnFlag && ele && ele.gridCompColumn && ele.gridCompColumn.options.canDrag && $('#' + this.options.id + '_resize_handle')[0].nowTh != ele) {
			var $ele = $(ele);
			$('#' + this.options.id + '_resize_handle').css('left', ele.attrRightTotalWidth - this.scrollLeft - 4 + this.leftW + this.fixedWidth);
			$('#' + this.options.id + '_resize_handle')[0].nowTh = ele;
		}
	};
	gridCompProto.resetThVariableDrag = function(nowTh,gridCompColumn,width){
		if (!$('#' + this.options.id + '_resize_handle')[0].nowTh && gridCompColumn.options.canDrag) {
			$('#' + this.options.id + '_resize_handle').css('left', width - 4 + this.leftW);
			$('#' + this.options.id + '_resize_handle')[0].nowTh = nowTh;
		}
	};
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		initEventFunFun = gridCompProto.initEventFun,
		dataSource = $.fn.grid.dataSource,
		dataSourceProto = dataSource.prototype;


	gridCompProto.hideEditMenu = function(){
		$('#' +this.options.id + '_content_edit_menu').css('display','none');
	};

	gridCompProto.clickFunEdit = function(e,index){
		var $tr = $(e.target).closest('tr');
		var $td = $(e.target).closest('td');
		var colIndex = $td.index();
		if(this.options.editable && (this.eidtRowIndex != index || (this.options.editType == 'default' && this.editColIndex != colIndex))){
			if(typeof this.options.onBeforeEditFun == 'function'){
				var obj = {};
				obj.gridObj = this;
				obj.rowObj = this.dataSourceObj.rows[index];
				obj.rowIndex = index;
				obj.colIndex = colIndex;
				obj.e = e;
				if(!this.options.onBeforeEditFun(obj)){
					return;
				}
			}
			this.editRowFun($tr,colIndex);
		}
	};

	gridCompProto.editRowFun = function($tr, colIndex){
		if(this.eidtRowIndex != -1){
			this.editClose();
		}
		var index = typeof $tr === 'number' ? $tr : this.getTrIndex($tr);
		this.eidtRowIndex = index;
		this.editColIndex = colIndex;
		this.editRow($tr, colIndex);
	};
	gridCompProto.editRowIndexFun = function(i){
		if(this.eidtRowIndex != -1){
			this.editClose();
		}
		this.eidtRowIndex = i;
		this.editColIndex = 0;
		this.editRow();
	};

	/*
	 * 创建编辑行
	 */
	gridCompProto.editRow = function($tr,colIndex){
		if(colIndex < 0)
			return;
		var oThis = this;
		var isFixedCol = false
		if ($tr && $tr.parents('table').attr('id').indexOf('_fixed_') > -1)
			isFixedCol = true
		$tr = $tr || $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + this.eidtRowIndex+ ')');
		colIndex = colIndex || 0
//			var $fixedtr = $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + this.eidtRowIndex+ ')');
		var row = this.dataSourceObj.rows[this.eidtRowIndex].value;
		this.editRowObj = this.cloneObj(row);
		if(this.options.editType == 'default'){
			var column = isFixedCol ? this.gridCompColumnFixedArr[colIndex] : this.gridCompColumnArr[colIndex]
//				$.each(this.gridCompColumnArr, function(i) {
				if(column.options.editable){
					var td = $('td:eq(' + colIndex + ')',$tr)[0];
					var field = column.options.field;
					var value = $(row).attr(field);
					value = oThis.getString(value,'');
					var obj = {};
					obj.td = td;
					obj.value = value;
					obj.field = field;
					obj.editType = column.options.editType;
					obj.rowObj = oThis.editRowObj;
					obj.$tr = $tr;
					obj.colIndex = colIndex;
					oThis.editCell(obj);
				}
			$('#' +this.options.id + '_content_edit_menu').css('display','block');
			$('#' +this.options.id + '_content_edit_menu_cancel').css('marginLeft','10px');// 与form形式相比偏左
			var topIndex = $('tr:visible',$tr.parent()).index($tr);
			this.rowHeight = $tr.height(); // tianxq
			var t = this.rowHeight * (topIndex + 1) + this.headerHeight + 1;
		}else if(this.options.editType == 'form'){
			if(typeof this.options.formEditRenderFun == 'function'){
				if(this.fixedWidth>0){
					var table = $('#' + this.options.id + '_content_fixed_table')[0];
				}else{
					var table = $('#' + this.options.id + '_content_table')[0];
				}

				var tr = table.insertRow(this.eidtRowIndex + 2);
				tr.id = this.options.id + '_edit_tr';
				var cell = tr.insertCell();
				cell.id = this.options.id + '_edit_td';
				cell.style.borderBottom = '0px';
				var cWidth = parseInt(this.contentMinWidth) + parseInt(this.fixedWidth);
				var htmlStr = '<div id="' + this.options.id + '_edit_form" class="u-grid-edit-form" style="width:' + cWidth + 'px;float:left;">';
				htmlStr += '</div>';
				cell.innerHTML = htmlStr;
				var obj = {};
				obj.grid = gridObj;
				obj.element = $('#' + this.options.id + '_edit_form')[0];
				obj.editRowObj = this.editRowObj;
				this.options.formEditRenderFun.call(this,obj);
				var htmlStr = '<div style="position:relative;float:left;width:100%;height:40px;"></div>';
				$('#' + this.options.id + '_edit_form')[0].insertAdjacentHTML('beforeEnd',htmlStr);
				var h = $('#' + this.options.id + '_edit_td')[0].offsetHeight;
				var color = $('#' + this.options.id + '_edit_form').css('background-color');
				if(this.options.multiSelect){
					var $div = $('#' + this.options.id + '_content_multiSelect > div').eq( this.eidtRowIndex );
					var htmlStr = '<div class="grid_open_edit" id="' + this.options.id + '_multiSelect_edit" style="background-color:'+color+';float:left;position:relative;width:' + this.multiSelectWidth + 'px;height:'+ h +'px"></div>';
					$div[0].insertAdjacentHTML('afterEnd',htmlStr);
				}
				if(this.options.showNumCol){
					var $div = $('#' + this.options.id + '_content_numCol > .u-grid-content-num').eq( this.eidtRowIndex );
					var htmlStr = '<div id="' + this.options.id + '_numCol_edit" style="background-color:'+color+';float:left;position:relative;width:' + this.numWidth + 'px;"></div>';
					$div[0].insertAdjacentHTML('afterEnd',htmlStr);
				}
				$('#' +this.options.id + '_content_edit_menu').css('display','block');


				if(this.fixedWidth>0){
					var table1 = $('#' + this.options.id + '_content_table')[0];
					var tr1 = table1.insertRow(this.eidtRowIndex + 2);
					tr1.id = this.options.id + '_edit_tr1';
				}
			}else{
				if(this.fixedWidth>0){
					var table = $('#' + this.options.id + '_content_fixed_table')[0];
				}else{
					var table = $('#' + this.options.id + '_content_table')[0];
				}

				var tr = table.insertRow(this.eidtRowIndex + 2);
				tr.id = this.options.id + '_edit_tr';
				var cell = tr.insertCell();
				cell.id = this.options.id + '_edit_td';
				cell.style.borderBottom = '0px';
				var cWidth = parseInt(this.contentMinWidth) + parseInt(this.fixedWidth);
				var htmlStr = '<div id="' + this.options.id + '_edit_form" class="u-grid-edit-form" style="width:' + cWidth + 'px;float:left;">';
				$.each(this.gridCompColumnFixedArr, function(i) {
					var show = false;
					if(this.options.editFormShow && (this.options.editable || (!this.options.editable && oThis.options.noneEditableFormShow) ) ) {
						show = true;
					}

					if(show){
						var field = this.options.field;
						var value = $(row).attr(field);
						value = oThis.getString(value,'');
						var title = this.options.title;
						var headerColor = this.options.headerColor;
						htmlStr += oThis.formEditCell(value,field,title,this.options.required,headerColor);
					}
				});

				$.each(this.gridCompColumnArr, function(i) {
					var show = false;
					if(this.options.editFormShow && (this.options.editable || (!this.options.editable && oThis.options.noneEditableFormShow) ) ) {
						show = true;
					}

					if(show){
						var field = this.options.field;
						var value = $(row).attr(field);
						value = oThis.getString(value,'');
						var title = this.options.title;
						var headerColor = this.options.headerColor;
						htmlStr += oThis.formEditCell(value,field,title,this.options.required,headerColor);
					}
				});
				htmlStr += '</div>';
				cell.innerHTML = htmlStr;

				$.each(this.gridCompColumnFixedArr, function(i) {
					var show = false;
					if(this.options.editFormShow && (this.options.editable || (!this.options.editable && oThis.options.noneEditableFormShow) ) ) {
						show = true;
					}

					if(show){
						var field = this.options.field;
						var td = $('#' + oThis.options.id + '_edit_' + field)[0];
						var value = $(row).attr(field);
						var title = this.options.title;
						value = oThis.getString(value,'');
						var obj = {};
						obj.td = td;
						td.innerHTML = '<div class="u-grid-content-td-div" title=""></div>';
						obj.value = value;
						obj.field = field;
						obj.editType = this.options.editType;
						obj.rowObj = oThis.editRowObj;
						obj.$tr = $tr;
						obj.colIndex = colIndex;
						htmlStr += oThis.editCell(obj);
					}
				});

				$.each(this.gridCompColumnArr, function(i) {
					var show = false;
					if(this.options.editFormShow && (this.options.editable || (!this.options.editable && oThis.options.noneEditableFormShow) ) ) {
						show = true;
					}

					if(show){
						var field = this.options.field;
						var td = $('#' + oThis.options.id + '_edit_' + field)[0];
						var value = $(row).attr(field);
						var title = this.options.title;
						value = oThis.getString(value,'');
						var obj = {};
						obj.td = td;
						td.innerHTML = '<div class="u-grid-content-td-div" title=""></div>';
						obj.value = value;
						obj.field = field;
						obj.editType = this.options.editType;
						obj.rowObj = oThis.editRowObj;
						obj.$tr = $tr;
						obj.colIndex = colIndex;
						htmlStr += oThis.editCell(obj);
					}
				});

				if(typeof(this.options.renderEditMemu) == "function"){

					this.options.renderEditMemu.apply(this,[$('#' + this.options.id + '_edit_form')[0],this.eidtRowIndex,this.dataSourceObj.rows.length])
				}else{
					var htmlStr = '<div id="'+ this.options.id+'_content_edit_menu" style="position:relative;float:left;width:100%;height:40px;"><button type="button" class="u-grid-content-edit-menu-button u-grid-content-edit-menu-button-ok" id="' + this.options.id + '_content_edit_menu_close">' + this.transMap.ml_close + '</button></div>';

					$('#' + this.options.id + '_edit_form')[0].insertAdjacentHTML('beforeEnd',htmlStr);
					$('#' + this.options.id + '_content_edit_menu_close').on('click',function(e){
						oThis.editClose();
					});
				}
				// 处理左侧区域位置
				var h = $('#' + this.options.id + '_edit_td')[0].offsetHeight;
				var color = $('#' + this.options.id + '_edit_form').css('background-color');
				if(this.options.multiSelect){
					var $div = $('#' + this.options.id + '_content_multiSelect > div').eq( this.eidtRowIndex );
					var htmlStr = '<div class="grid_open_edit " id="' + this.options.id + '_multiSelect_edit" style="background-color:'+color+';float:left;position:relative;width:' + this.multiSelectWidth + 'px;height:'+ h +'px"></div>';
					$div[0].insertAdjacentHTML('afterEnd',htmlStr);
				}
				if(this.options.showNumCol){
					var $div = $('#' + this.options.id + '_content_numCol > .u-grid-content-num').eq( this.eidtRowIndex );
					var htmlStr = '<div id="' + this.options.id + '_numCol_edit" style="background-color:'+color+';float:left;position:relative;width:' + this.numWidth + 'px;"></div>';
					$div[0].insertAdjacentHTML('afterEnd',htmlStr);
				}
				$('#' +this.options.id + '_content_edit_menu').css('display','block');


				if(this.fixedWidth>0){
					var table1 = $('#' + this.options.id + '_content_table')[0];
					var tr1 = table1.insertRow(this.eidtRowIndex + 2);
					tr1.id = this.options.id + '_edit_tr1';
//						tr1.style.height = h + 'px';
				}
			}

		}
	};

	/*
	 * 行编辑关闭
	 */
	gridCompProto.editClose = function(){
		var row = this.dataSourceObj.rows[this.eidtRowIndex];
		if(!row)
			return;
			if(this.options.editType != 'form'){
				//this.repaintRow(this.eidtRowIndex);
				var obj = {};
				obj.begin = this.eidtRowIndex;
				obj.length = 1;
				this.renderTypeFun(obj);
			}

		$('#' +this.options.id + '_content_edit_menu').css('display','none');
		this.repairSumRow();
		this.noRowsShowFun();
		this.updateLastRowFlag();
		this.eidtRowIndex = -1;
		// form形式删除对应区域,存在切换编辑形式的情况，所以一直删除
		// if(this.options.editType == 'form'){
			$('#' + this.options.id + '_multiSelect_edit').remove(null,true);
			$('#' + this.options.id + '_numCol_edit').remove(null,true);
			$('#' + this.options.id + '_edit_tr').remove(null,true);
			$('#' + this.options.id + '_edit_tr1').remove(null,true);
		// }
	};

	/*
	 * 编辑单元格
	 */
	gridCompProto.editCell = function(obj){
		var td = obj.td;
		var value = obj.value;
		var field = obj.field;
		var editType = obj.editType;
		var rowObj = obj.rowObj;
		var $tr = obj.$tr;
		var	colIndex = obj.colIndex;
		var oThis = this;

		var obj = {};
		obj.td = td;
		obj.field = field;
		obj.$tr = $tr;
		obj.colIndex = colIndex;
		oThis.newEditObj = obj;
		
		if(editType == 'text'){
			if(this.options.editType == 'default'){
				td.innerHTML = '<input id="' + this.options.id + "_edit_field_" + field + '" type="text" value="' + value +'" field="' + field+'" style="width:100%;margin:0px;min-height:20px;font-size:12px;color:#444">';
			}else{
				td.innerHTML = '<input id="' + this.options.id + "_edit_field_" + field + '" type="text" value="' + value +'" field="' + field+'">';
			}
			$('input',$(td)).on('blur',function(){
				oThis.editValueChange(field,this.value);
			});
		}else if(typeof editType == 'function'){
			var obj = {};
			var $Div = $('.u-grid-content-td-div',$(td));
			obj.gridObj = this;
			obj.element = $Div[0];
			obj.value = value;
			obj.field = field;
			obj.rowObj = rowObj;
			editType.call(this,obj);
		}
		if (this.options.editType == 'default')
			$('input:first',$(td)).focus()


	};

	/*
	 * 触发下一个编辑单元格
	 */
	gridCompProto.nextEditShow = function(){
		var obj = this.newEditObj;
		var td = obj.td;
		var $tr = obj.$tr;
		var colIndex = parseInt(obj.colIndex) + 1;
		// 如果是最后一列则换行
		if($(td).next('td').length == 0){
			var $nextTr = $tr.next('tr')
			if($nextTr.length > 0){
				$tr = $nextTr;
				colIndex = 0;
				$tr.click(); //触发下一行的焦点
			}else{
				return;
			}
		}
		this.editRowFun($tr,colIndex);
	};

	gridCompProto.editValueChange=function(field,value){
		// 设置row的值为新值
		this.updateValueAt(this.eidtRowIndex,field,value);
	};
	if(typeof gridCompProto.formEditCell == 'undefined'){
		gridCompProto.formEditCell = function(){
		};
	};

	gridCompProto.updateEditRowIndex = function(opType, opIndex, num) {
		if(this.eidtRowIndex < 0) return;
		if(opType == '-') {
			if(opIndex < this.eidtRowIndex) {
				this.eidtRowIndex--;
			} else if(opIndex == this.eidtRowIndex) {
				this.eidtRowIndex = -1;
			}
		} else if(opType == '+') {
			num === undefined && (num = 1)
			if(opIndex <= this.eidtRowIndex) {
				this.eidtRowIndex += num;
			}
		}

	};

	gridCompProto.updateValueAtEdit = function(rowIndex,field,value,force){
		if(this.eidtRowIndex == rowIndex){
			if($('#' +  this.options.id + "_edit_field_" + field).length > 0){
				if($('#' +  this.options.id + "_edit_field_" + field)[0].type == 'checkbox'){
					if(value == 'Y' || value == 'true'){
						$('#' +  this.options.id + "_edit_field_" + field)[0].checked = true;
					}else{
						$('#' +  this.options.id + "_edit_field_" + field)[0].checked = false;
					}
				}else{
					$('#' +  this.options.id + "_edit_field_" + field)[0].value = value;
				}
			}
		}
	};

	/*
	 * 根据filed设置editType
	 */
	gridCompProto.setEditType = function(field,editType){
		var gridCompColumn = this.getColumnByField(field);
		gridCompColumn.options.editType = editType;
	};

	/*
	 * 设置是否可修改
	 */
	gridCompProto.setEditable = function(editable){
		this.options.editable = editable;
	};


	gridCompProto.initEventFun = function(){
		// 执行原有方法
		initEventFunFun.apply(this,arguments);
		var oThis = this;
		$(document).on('click',function(e){
			if(oThis.options.editable && oThis.options.editType == 'default'){
				var $e = $(e.target);
				var flag = true;
				flag = $(e.target).closest('.u-grid-content-td-div').length > 0?false:flag;
				var cusStr = oThis.options.customEditPanelClass
				if(cusStr){
					var cArr = cusStr.split(',');
					$.each(cArr,function(){
						flag = $e.closest('.' + this).length > 0?false:flag;
					});
				}
				if(flag){
					oThis.editClose();
				}
			}
		});
	};


	gridCompProto.setGridEditType = function(newEditType){
		this.options.editType = newEditType;
	}

	gridCompProto.setGridEditTypeAndEditRow = function(newEditType,rowIndex,colIndex){
		this.options.editType = newEditType;
		var $contentBody = $('#' + this.options.id + '_content_tbody');
		var $tr = $('tr:eq(' + rowIndex + ')',$contentBody)
		this.editRowFun($tr,colIndex)
	}

})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		initDefaultFun = gridCompProto.initDefault,
		setRequiredFun = gridCompProto.setRequired;

	gridCompProto.initDefault = function(){
		// 执行原有方法
		initDefaultFun.apply(this,arguments);
		// 扩展方法
		this.defaults = $.extend(true,{},this.defaults,{
			noneEditableFormShow:true,// form编辑器是否显示不可编辑字段
		});
	};

	gridCompProto.setRequired = function(field, value){
		// 执行原有方法
		setRequiredFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
		$.each(this.gridCompColumnArr,function(i){
			if(this.options.field == field){
				this.options.required = value;
				if(!value) {
					$('#' + oThis.options.id +  '_edit_' + this.options.field).parent().find('.u-grid-edit-mustFlag').hide()
				} else {
					$('#' + oThis.options.id +  '_edit_' + this.options.field).parent().find('.u-grid-edit-mustFlag').show()
				}


			}
		});
	};

	gridCompProto.editorRowChangeFun = function(){
		if($('#' + this.options.id + '_edit_form').length > 0){
			var h = $('#' + this.options.id + '_edit_form')[0].offsetHeight;
			$('#' + this.options.id + '_numCol_edit').css('height',h);
			$('#' + this.options.id + '_multiSelect_edit').css('height',h);
		}
	};

	/*
	 * form形式下编辑单元格
	 */
	gridCompProto.formEditCell = function(value,field,title,required,headerColor){
		// 创建lable
		var st = (title+'')
		if(st.lengthb() > 28) {
			st = st.substrCH(26)+'...'
		}
		var htmlStr = '<div class="u-grid-edit-whole-div"><div class="u-grid-edit-label"><div title="'+title+'" style="color:' +headerColor+ '">' + st + '<span style="color:red;' + (!required? 'display: none':'') + '" class="u-grid-edit-mustFlag">*</span></div></div>';			// 创建编辑区域
		htmlStr += '<div id="' + this.options.id + '_edit_' + field + '" class="u-grid-edit-div"></div>';
		htmlStr += '</div>';
		return htmlStr;
	};	

})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		columnsVisibleFunFun = gridCompProto.columnsVisibleFun;
	/*
	 * 将固定列放入gridCompColumnFixedArr
	 */
	gridCompProto.initGridCompFixedColumn = function(){
		var oThis = this;
		var w = 0;
		$.each(this.gridCompColumnArr,function(i){
			if(this.options.fixed == true){
				oThis.gridCompColumnFixedArr.push(this);
			}
		});
		$.each(this.gridCompColumnFixedArr,function(i){
			for(var i = oThis.gridCompColumnArr.length;i >-1;i-- ){
				if(oThis.gridCompColumnArr[i] == this){
					oThis.gridCompColumnArr.splice(i,1);
					break;
				}
			}
		});
	};

	gridCompProto.columnsVisibleFun = function(){
		// 执行原有方法
		columnsVisibleFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this,
			fixW = 0;
		$.each(this.gridCompColumnFixedArr,function(){
			if(this.options.visible){
				fixW += parseInt(this.options.width);
				this.firstColumn = oThis.firstColumn;
				oThis.firstColumn = false;
			}
		});
		this.fixedRealWidth = fixW;
	};

	gridCompProto.createHeaderTableFixed = function(){
		return this.createHeaderTable('fixed');
	};

	gridCompProto.createContentTableFixed = function(){
		return this.createContentTable('fixed');
	}
	gridCompProto.createContentOneRowFixed = function(rowObj){
		return this.createContentOneRow(rowObj,'fixed')
	}
	gridCompProto.widthChangeGridFunFixed = function(halfWholeWidth){
		// 固定区域宽度不大于整体宽度的一半
		if(this.fixedRealWidth > halfWholeWidth){
			this.fixedWidth = halfWholeWidth;
		}else{
			this.fixedWidth = this.fixedRealWidth;
		}
	}
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype;

	/*
	 * 创建form形式下div
	 */
	gridCompProto.createFromDivs = function() {
		if (this.createFormFlag) {
			return;
		}
		var htmlStr = '<div id="' + this.options.id + '_form" class="u-grid-form">';
		htmlStr += this.createFromContent();
		$('#' + this.options.id)[0].insertAdjacentHTML('afterBegin', htmlStr);
		this.createFormFlag = true;
	};

	/*
	 * 创建form形式下内容区域
	 */
	gridCompProto.createFromContent = function() {
		var htmlStr = '<div class="u-grid-form-content" id="' + this.options.id + '_form_content" class="u-grid-content">';
		htmlStr += '<table role="grid" id="' + this.options.id + '_form_content_table">';
		htmlStr += this.createFormContentRows();
		htmlStr += '</table>';
		return htmlStr;
	};

	/*
	 * 创建form形式下内容区域所有行
	 */
	gridCompProto.createFormContentRows = function() {
		var oThis = this,
			htmlStr = "";
		// 遍历生成所有行
		if (this.dataSourceObj.rows) {
			htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_form_content_tbody">';
			$.each(this.dataSourceObj.rows, function() {
				htmlStr += '<tr role="row"><td role="rowcell">';
				var value = this.value;
				$.each(oThis.gridCompColumnArr, function() {
					var f = this.options.field,
						t = this.options.title,
						v = $(value).attr(f);
					htmlStr += '<div>' + t + ':</div>';
					htmlStr += '<div>' + v + '</div>';
				});
				htmlStr += '</td></tr>';
			});
			htmlStr += '</tbody>';
		}
		return htmlStr;
	};

	/*
	 * 整体宽度改变处理(form形式)
	 */
	gridCompProto.widthChangeFormFun = function() {
		this.createFromDivs();
		$('#' + this.options.id + '_grid').css('display', 'none');
		$('#' + this.options.id + '_form').css('display', 'block');
		this.showType = 'form';
		if(typeof this.options.afterCreate == 'function'){
			this.options.afterCreate.call(this);
		}
	};
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype;

	gridCompProto.resetThVariableHeaderLevel = function(){
		var oThis = this,oldParentHeaderStr = '',parentWidth = 0;
		$('#' + this.options.id + '_header_table th', this.$ele).each(function(i) {
			var gridCompColumn = oThis.gridCompColumnArr[i];
			var parentHeaderStr = oThis.getString(gridCompColumn.options.parentHeader,'');
			var w = 0;
			if(gridCompColumn.options.visible){
				w = gridCompColumn.options.width;
			}
			// 处理多表头
			if(oldParentHeaderStr != '' && parentHeaderStr != oldParentHeaderStr){ // 上一个父项结束
				// 设置宽度
				$('#' + oThis.options.id + oldParentHeaderStr).css('width',parentWidth - 1 + 'px');
			}
			if(parentHeaderStr != ''){
				var parentHeaderTitleStr = oThis.getLevelTitleByField(parentHeaderStr);
				if(parentHeaderStr != oldParentHeaderStr){  //一个新的父项开始
					parentWidth = 0;
					if(!oThis.parentFlag){ //只添加一次
						var htmlStr ='<div id="' + oThis.options.id + parentHeaderStr + '" class="u-gird-parent"><div class="u-grid-header-link" title="' + parentHeaderTitleStr + '">' + parentHeaderTitleStr +'</div></div>';
						this.insertAdjacentHTML('afterBegin',htmlStr);
					}
				}
				parentWidth += w;
			}
			oldParentHeaderStr = parentHeaderStr;
		});
		if(oldParentHeaderStr != ''){
			$('#' + oThis.options.id + oldParentHeaderStr).css('width',parentWidth - 1 + 'px');
		}
		this.parentFlag = true;
	};

	gridCompProto.initGridCompColumnHeaderLevelFun = function(columnOptions){
		// 扩展方法
		if(columnOptions.headerLevel > 1){
			this.gridCompLevelColumn.push(columnOptions);
			var oldLength = this.gridCompColumnArr.length;
			this.gridCompColumnArr.length = oldLength - 1;
			if(this.basicGridCompColumnArr && this.basicGridCompColumnArr.length > 0){
				this.basicGridCompColumnArr.length = oldLength - 1;
			}
		}
	};
	/*
	 * 按照hiddenLevel对column进行排序
	 */
	gridCompProto.initGridHiddenLevelColumn = function(){
		if(!this.options.overWidthHiddenColumn)
			return;
		var oThis = this;
		var w = 0;
		
		this.gridCompHiddenLevelColumnArr = this.gridCompColumnArr.slice(0);
		
		this.gridCompHiddenLevelColumnArr.sort(function(a, b) {
			var hiddenLevel1 = a.options.hiddenLevel;
			var hiddenLevel2 = b.options.hiddenLevel;
			if(hiddenLevel1 > hiddenLevel2){
				return -1;
			}else{
				return 1;
			}
		});
	};

	gridCompProto.getLevelTitleByField = function(field){
		for(var i = 0; i < this.gridCompLevelColumn.length; i++){
			var columnField = this.gridCompLevelColumn[i].field;
			if(columnField == field){
				return this.gridCompLevelColumn[i].title;
			}
		}
		return '';
	};

})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype;

	/*
		 * 按照hiddenLevel对column进行排序
		 */
	gridCompProto.initGridHiddenLevelColumn = function(){
		if(!this.options.overWidthHiddenColumn)
			return;
		var oThis = this;
		var w = 0;
		
		this.gridCompHiddenLevelColumnArr = this.gridCompColumnArr.slice(0);
		
		this.gridCompHiddenLevelColumnArr.sort(function(a, b) {
			var hiddenLevel1 = a.options.hiddenLevel;
			var hiddenLevel2 = b.options.hiddenLevel;
			if(hiddenLevel1 > hiddenLevel2){
				return -1;
			}else{
				return 1;
			}
		});
	},
	gridCompProto.widthChangeGridFunOverWidthHidden = function(){
		if(this.options.overWidthHiddenColumn){
			this.lastVisibleColumn.options.width = this.lastVisibleColumn.options.realWidth;
			var wholeWidth = parseInt(this.wholeWidth) - parseInt(this.leftW);
			var columnWholeWidth = parseInt(this.fixedWidth) + parseInt(this.contentRealWidth);
			if(columnWholeWidth > wholeWidth){
				for(var i = 0;i < this.gridCompHiddenLevelColumnArr.length;i++){
					var column = this.gridCompHiddenLevelColumnArr[i];
					if(column.options.visible){
						column.options.visible = false;
						columnWholeWidth = columnWholeWidth - column.options.width;
					} 
					if(!(columnWholeWidth > wholeWidth)){
						break;
					}
				}
				this.columnsVisibleFun();
			}else{
				for(var i = this.gridCompHiddenLevelColumnArr.length -1;i>-1;i--){
					var column = this.gridCompHiddenLevelColumnArr[i];
					if(!column.options.visible){
						columnWholeWidth = columnWholeWidth + column.options.width;
						if(columnWholeWidth > wholeWidth){
							break;
						}
						column.options.visible = true;
					}
				}
				this.columnsVisibleFun();
			}
		}
	};
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		initEventFunFun = gridCompProto.initEventFun,
		initGridEventFunFun = gridCompProto.initGridEventFun,
		dataSource = $.fn.grid.dataSource,
		dataSourceProto = dataSource.prototype;

	gridCompProto.initEventFun = function(){
		// 执行原有方法
		initEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
		$('#' + this.options.id).on('mouseup', function(e) {
			if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
				// 点击的是header区域
				oThis.mouseUpX = e.clientX;
				oThis.mouseUpY = e.clientY;
				//点击过程中鼠标没有移动
				if (oThis.mouseDownX == oThis.mouseUpX && oThis.mouseDownY == oThis.mouseUpY) {
				//或者移动距离小于5px(由于移动之后会显示屏幕div，暂时不做处理)
	//					if( Math.abs(parseInt(oThis.mouseDownX) - parseInt(oThis.mouseUpX)) <=5 && Math.abs(parseInt(oThis.mouseDownY) - parseInt(oThis.mouseUpY)) <=5){
					oThis.columnClickX = e.clientX;
					oThis.columnClickY = e.clientY;
					var eleTh = $(e.target).closest('th')[0];
					if($(e.target).hasClass('u-grid-header-columnmenu')){
						
					}else{
						// 执行click操作,进行排序
						oThis.canSortable(e, eleTh);
					}
				}
			} else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
				// 点击的是数据区域

			}
		
		});
	};

	gridCompProto.initGridEventFun = function(){
		// 执行原有方法
		initGridEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
	};

	/*
	 * 处理排序
	 */
	gridCompProto.canSortable = function(e, ele) {
		var oThis = this,
			$ele = $(ele),
			field = $ele.attr('field'),
			sortable = this.getColumnAttr('sortable', field);
		if (sortable) {
			if(e.ctrlKey) {
				// 构建排序信息的数据结构
				var prioArray = []
				$('.u-grid-header-sort-priority').each(function(index, domEle){
					var $el = $(domEle)
					var p = parseInt($el.text())
					var f = $el.closest('th').attr('field')
					var st
					if($el.parent().hasClass("fa-caret-up")) {
						st = 'asc'
					} else if($el.parent().hasClass("fa-caret-down")){
						st = 'desc'
					}
					prioArray[p-1] = {field:f, sortType:st}
				})
				// 页面调整
				/*修改ue将caret调整为caret*/
				var $caret
				if(($caret = $ele.find('.fa-caret-up')).length > 0) {
					var p = parseInt($caret.find('.u-grid-header-sort-priority').text())
					prioArray[p-1].sortType = 'desc'
					$caret.removeClass('fa-caret-up').addClass('fa-caret-down')
				} else if(($caret = $ele.find('.fa-caret-down')).length > 0) {
					var p = parseInt($caret.find('.u-grid-header-sort-priority').text())
					for(var i=p;i<prioArray.length;i++) {
						var $flag = $('[field='+prioArray[i].field+']').find('.u-grid-header-sort-priority')
						$flag.text(parseInt($flag.text())-1)
					}
					prioArray.splice(p-1,1)
					$caret.remove()
				} else {
					prioArray.push({field:field, sortType:'asc'})
					// $ele.first().append('<span class="fa fa-caret-up u-grid-header-sort-span" ><span class="u-grid-header-sort-priority">'+prioArray.length+'</span></span>')
					$ele.first().first().append('<span class="fa fa-caret-up u-grid-header-sort-span" ></span>')
				}
				// 执行排序逻辑
				this.dataSourceObj.sortRowsByPrio(prioArray)

			} else {
				if ($(".fa-caret-up").parent().parent().parent()[0] == ele) { //原来为升序，本次为降序
					$(".fa-caret-up").remove();
					//$(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="fa fa-caret-down u-grid-header-sort-span" ><span class="u-grid-header-sort-priority">1</span></span>');
					$(ele.firstChild.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="fa fa-caret-down u-grid-header-sort-span" ></span>');
					if(typeof this.options.onSortFun == 'function'){
						this.options.onSortFun(field,'asc')
					}else{
						this.dataSourceObj.sortRows(field, "asc");
					}
				} else if ($(".fa-caret-down").parent().parent().parent()[0] == ele) { //原来为降序，本次为不排序
					$(".fa-caret-down").remove();
					if(typeof this.options.onSortFun == 'function'){
						this.options.onSortFun();
					}else{
						this.dataSourceObj.sortRows();
					}

				} else { //本次为升序 
					$(".fa-caret-up").remove();
					$(".fa-caret-down").remove();
					// $(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="fa fa-caret-up u-grid-header-sort-span"><span class="u-grid-header-sort-priority">1</span></span>');
					$(ele.firstChild.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="fa fa-caret-up u-grid-header-sort-span"></span>');
					if(typeof this.options.onSortFun == 'function'){
						this.options.onSortFun(field, "desc");
					}else{
						this.dataSourceObj.sortRows(field, "desc");
					}

				}
			}

			oThis.repairContent();
			oThis.afterGridDivsCreate();
		}
	};

	gridCompProto.deleteOneRowTree = function(){
		if(this.options.showTree){
			this.dataSourceObj.sortRows();
		}
	};

	/*
	 * 根据排序的优先级的排序
	 * prioArray = [{field:'f2', sortType:'asc'}, {field:'f3', sortType:'desc'}, {field:'f1', sortType:'asc'}]
	 */
	gridCompProto.sortRowsByPrio = function(prioArray, cancelSort) {
		var oThis = this;
		if(cancelSort) {
			this.rows = new Array();
			if(this.options.values){
				$.each(this.options.values, function(i) {
					var rowObj = {};
					rowObj.value = this;
					rowObj.valueIndex = i;
					oThis.rows.push(rowObj);
				});
			}
		}

		var evalStr = function(i) {
			if(i == prioArray.length-1) {
				return 'by(prioArray['+i+'].field, prioArray['+i+'].sortType)'
			} else {
				return 'by(prioArray['+i+'].field, prioArray['+i+'].sortType,' + evalStr(i+1) + ')'
			}

		}

		var by = function(field, sortType, eqCall) {
			var callee = arguments.callee
			return function(a, b) {
				var v1 = $(a.value).attr(field);
				var v2 = $(b.value).attr(field);
				var dataType = oThis.gridComp.getColumnByField(field).options.dataType;
				if(dataType == 'Float'){
					v1 = parseFloat(v1);
					v2 = parseFloat(v2);
					if(isNaN(v1)){
						return 1;
					}
					if(isNaN(v2)){
						return -1;
					}
					if(v1 == v2 && eqCall) {
						return eqCall()
					}
					return sortType == 'asc' ? (v1-v2) : (v2-v1);
				}else if (dataType == 'Int'){
					v1 = parseInt(v1);
					v2 = parseInt(v2);
					if(isNaN(v1)){
						return 1;
					}
					if(isNaN(v2)){
						return -1;
					}
					if(v1 == v2 && eqCall) {
						return eqCall()
					}
					return sortType == 'asc' ? (v1-v2) : (v2-v1);
				}else{
					v1 = oThis.gridComp.getString(v1,'');
					v2 = oThis.gridComp.getString(v2,'');
					try{
						var rsl = v1.localeCompare(v2)
						if(rsl === 0 && eqCall) {
							return eqCall()
						}
						if(rsl === 0) {
							return 0
						}
						return sortType == 'asc' ? rsl : -rsl;
					}catch(e){
						return 0;
					}
				}
			}
		}

		this.rows.sort(eval(evalStr(0)));
	};

	/*
	 * 将values转化为rows并进行排序(标准)
	 */
	dataSourceProto.basicSortRows = function(field, sortType) {
		var oThis = this;
		var dataType = "";
		if(field){
			dataType = this.gridComp.getColumnByField(field).options.dataType;
		}
		if (sortType == "asc") {
			this.rows.sort(function(a, b) {
				var v1 = $(b.value).attr(field);
				var v2 = $(a.value).attr(field);
				if(dataType == 'Float'){
					v1 = parseFloat(v1);
					v2 = parseFloat(v2);
					if(isNaN(v1)){
						return 1;
					}
					if(isNaN(v2)){
						return -1;
					}
					return v1-v2;
				}else if (dataType == 'Int'){
					v1 = parseInt(v1);
					v2 = parseInt(v2);
					if(isNaN(v1)){
						return 1;
					}
					if(isNaN(v2)){
						return -1;
					}
					return v1-v2;
				}else{
					v1 = oThis.gridComp.getString(v1,'');
					v2 = oThis.gridComp.getString(v2,'');
					try{
						return v1.localeCompare(v2);
					}catch(e){
						return 0;
					}
				}
			});
		} else if (sortType == "desc") {
			this.rows.sort(function(a, b) {
				var v1 = $(a.value).attr(field);
				var v2 = $(b.value).attr(field);
				if(dataType == 'Float'){
					v1 = parseFloat(v1);
					v2 = parseFloat(v2);
					if(isNaN(v1)){
						return 1;
					}
					if(isNaN(v2)){
						return -1;
					}
					return v1-v2;
				}else if (dataType == 'Int'){
					v1 = parseInt(v1);
					v2 = parseInt(v2);
					if(isNaN(v1)){
						return 1;
					}
					if(isNaN(v2)){
						return -1;
					}
					return v1-v2;
				}else{
					v1 = oThis.gridComp.getString(v1,'');
					v2 = oThis.gridComp.getString(v2,'');
					try{
						return v1.localeCompare(v2);
					}catch(e){
						return 0;
					}
				}
			});
		} else {
			this.rows = new Array();
			if(this.options.values){
				$.each(this.options.values, function(i) {
					var rowObj = {};
					rowObj.value = this;
					rowObj.valueIndex = i;
					oThis.rows.push(rowObj);
				});
			}
		}
	};
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype;

	gridCompProto.createContentRowsSumRow = function(createFlag){
		var htmlStr = '';
		if(this.options.showSumRow && this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0){
			htmlStr += this.createSumRow(createFlag);
		}
		return htmlStr;
	};
	gridCompProto.createContentSumRow = function(bottonStr){
		var htmlStr = '';
		if(this.options.showSumRow){
			htmlStr += '<div class="u-grid-content-left-sum-bottom" id="' + this.options.id + '_content_left_sum_bottom" style="width:' + (this.leftW + this.fixedWidth) + 'px;'+bottonStr+'">';
			htmlStr += '</div>';
		}
		return htmlStr;
	}
	/*
	 * 创建合计行
	 */
	gridCompProto.createSumRow = function(createFlag){
		if(this.options.showSumRow){
			var oThis = this,idStr,gridCompColumnArr;
			if(createFlag == 'fixed'){
				idStr = 'fixed_';
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				idStr = '';
				gridCompColumnArr = this.gridCompColumnArr;
			}
			var t = parseInt(this.wholeHeight) - this.exceptContentHeight - 48 - this.scrollBarHeight;
			t = t> 0?t:0;
			var htmlStr = '<tr role="row" class="u-grid-content-sum-row" id="' + this.options.id + '_content_'+idStr+'sum_row" style="top:'+t+'px;">';
			$.each(gridCompColumnArr, function() {
				var f = this.options.field;
				var precision = this.options.precision;
				var dataType = this.options.dataType;
				var sumValue = oThis.dataSourceObj.getSumValue(f,this,oThis);
				if(dataType == 'float'){
					var o = {};
					o.value = sumValue;
					o.precision = precision?precision:2;
					sumValue = oThis.DicimalFormater(o)
				}
				var tdStyle = '';
				if(!this.options.visible){
					tdStyle = 'style="display:none;"';
				}
				htmlStr += '<td role="rowcell" title="' + sumValue + '" ' + tdStyle + '>';
				if(this.firstColumn){
					htmlStr += '<div class="u-gird-centent-sum-div"><span>' + oThis.transMap.ml_sum + '</span></div>';
				}
				var contentStyle = '';
				if(this.options.dataType == 'integer' || this.options.dataType == 'float') {
					contentStyle = 'style="text-align: right;"'
				}
				htmlStr += '<div class="u-grid-content-td-div" ' + contentStyle + '><span value="' + sumValue + '">' + sumValue + '</span></div></td>';				});
			htmlStr += '</tr>';
			return htmlStr;
		}
	};

	/*
	 * 创建合计行 for ie
	 */
	gridCompProto.createSumRowForIE = function(table,createFlag){
		if(this.options.showSumRow){
			var oThis = this,idStr,gridCompColumnArr;
			if(createFlag == 'fixed'){
				idStr = 'fixed_';
				gridCompColumnArr = this.gridCompColumnFixedArr;
			}else{
				idStr = '';
				gridCompColumnArr = this.gridCompColumnArr;
			}
			var t = parseInt(this.wholeHeight) - this.exceptContentHeight - 48 - this.scrollBarHeight;
			t = t> 0?t:0;
			var row = table.insertRow();
			row.row = 'row';
			row.className = 'u-grid-content-sum-row';
			row.id = this.options.id + '_content_'+idStr+'sum_row';
			row.style.top = t + 'px';
			$.each(gridCompColumnArr, function() {
				var f = this.options.field;
				var precision = this.options.precision;
				var dataType = this.options.dataType;
				var sumValue = oThis.dataSourceObj.getSumValue(f,this,oThis);
				if(dataType == 'float'){
					var o = {};
					o.value = sumValue;
					o.precision = precision?precision:2;
					sumValue = oThis.DicimalFormater(o)
				}
				var newCell= row.insertCell();
				newCell.role = 'rowcell';
				newCell.title = sumValue;
				var contentStyle = '';
				if(this.options.dataType == 'integer' || this.options.dataType == 'float') {
					contentStyle = 'style="text-align: right;"'
				}
				
				var htmlStr = '<div class="u-grid-content-td-div" ' + contentStyle + '>';
				if(this.firstColumn){
					htmlStr += '<div class="u-gird-centent-sum-div"><span>' + oThis.transMap.ml_sum + '</span></div>';
				}
					htmlStr += '<span value="' + sumValue + '">' + sumValue + '</span></div>';
				newCell.insertAdjacentHTML('afterBegin',htmlStr);
			});
		}
	};
	/*
	 * 重画合计行
	 */
	gridCompProto.repairSumRow = function(){
		if(this.options.showSumRow){
			$('#' + this.options.id + '_content_div tbody .u-grid-content-sum-row').remove();
			$('#' + this.options.id + '_content_fixed_div tbody .u-grid-content-sum-row').remove();
			try{
				if(this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0){
					var htmlStr = this.createSumRow();
					$('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('beforeEnd',htmlStr);
					var htmlStr = this.createSumRow('fixed');
					if($('#' + this.options.id + '_content_fixed_div tbody')[0])
						$('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('beforeEnd',htmlStr);
				}
			}catch(e){
				var table = $('#' + this.options.id + '_content_div table')[0];
				var fixedTable = $('#' + this.options.id + '_content_fixed_div table')[0];
				this.createSumRowForIE(table);
				this.createSumRowForIE(table,'fixed');
			}
			this.renderSumRow();
		}
	};
		
	gridCompProto.renderSumRow = function(){
		var oThis = this;
		$.each(this.gridCompColumnFixedArr, function(i) {
			var sumCol = this.options.sumCol;
			var sumRenderType = this.options.sumRenderType;
			var idStr = 'fixed_';
			if(sumCol) {
				var sumSpans = $('#' + oThis.options.id + '_content_'+idStr+'sum_row').find('td').eq(i).find('span');
				var sumSpan = sumSpans[sumSpans.length-1];
				if(sumSpan) {
					if(typeof sumRenderType == 'function') {
						var sumV = $(sumSpan).attr('value');
						var obj = {};
						obj.value = sumV;
						obj.element = sumSpan;
						obj.gridObj = oThis;
						obj.gridCompColumn = this;
						sumRenderType.call(oThis,obj);
					} else if(dataType == 'integer' || dataType == 'float'){
						sumSpan.style.textAlign = 'right';
					}
				}	
			}
		});
		$.each(this.gridCompColumnArr, function(i) {
			var sumCol = this.options.sumCol;
			var sumRenderType = this.options.sumRenderType;
			var idStr = '';
			if(sumCol) {
				var sumSpans = $('#' + oThis.options.id + '_content_'+idStr+'sum_row').find('td').eq(i).find('span');
				var sumSpan = sumSpans[sumSpans.length-1];
				if(sumSpan) {
					if(typeof sumRenderType == 'function') {
						var sumV = $(sumSpan).attr('value');
						var obj = {};
						obj.value = sumV;
						obj.element = sumSpan;
						obj.gridObj = oThis;
						obj.gridCompColumn = this;
						sumRenderType.call(oThis,obj);
					} else if(dataType == 'integer' || dataType == 'float'){
						sumSpan.style.textAlign = 'right';
					}
				}	
			}
		});
	};

	gridCompProto.renderTypeSumRow = function(gridCompColumn,i,begin,length, isFixedColumn){
		var oThis = this;
		var sumCol = gridCompColumn.options.sumCol;
		var sumRenderType = gridCompColumn.options.sumRenderType;
		var dataType = gridCompColumn.options.dataType;
		var idStr = isFixedColumn === true? 'fixed_' : '';
		if(sumCol) {
			var sumSpans = $('#' + this.options.id + '_content_'+idStr+'sum_row').find('td').eq(i).find('span');
			var sumSpan = sumSpans[sumSpans.length-1];
			if(sumSpan) {
				if(typeof sumRenderType == 'function') {
					var sumV = $(sumSpan).attr('value');
					var obj = {};
					obj.value = sumV;
					obj.element = sumSpan;
					obj.gridObj = oThis;
					obj.gridCompColumn = gridCompColumn;
					sumRenderType.call(oThis,obj);
				} else if(dataType == 'integer' || dataType == 'float'){
					sumSpan.style.textAlign = 'right';
				}
			}	
		}
	};
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		initEventFunFun = gridCompProto.initEventFun,
		initGridEventFunFun = gridCompProto.initGridEventFun;

	

	gridCompProto.initEventFun = function(){
		// 执行原有方法
		initEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
		$('#' + this.options.id).on('mousedown', function(e) {
			if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
				// 点击的是header区域
				var eleTh = $(e.target).closest('th')[0];
				if(oThis.options.canSwap){
					oThis.swapColumnStart(e, eleTh);
				}
				e.preventDefault();
			} else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
				// 点击的是数据区域
			}
		});

		$('#' + this.options.id).on('mousemove', function(e) {
			oThis.mouseMoveX = e.clientX;
			oThis.mouseMoveY = e.clientY;
			if ((oThis.mouseMoveX != oThis.mouseDownX || oThis.mouseDownY != oThis.mouseMoveY) && oThis.mouseDownX != 'mouseDownX' && oThis.options.canSwap) {
				// 鼠标按下之后移动了
				oThis.swapColumnFlag = true;
			}
			oThis.swapColumnFun(e);
			e.stopPropagation();
		}); 

		$('#' + this.options.id + '_top').on('mousemove', function(e) {
			oThis.mouseMoveX = e.clientX;
			oThis.mouseMoveY = e.clientY;
			if ((oThis.mouseMoveX != oThis.mouseDownX || oThis.mouseDownY != oThis.mouseMoveY) && oThis.mouseDownX != 'mouseDownX' && oThis.options.canSwap) {
				// 鼠标按下之后移动了
				oThis.swapColumnFlag = true;
			}
			oThis.swapColumnFun(e);
			e.stopPropagation();
		});

		$('#' + this.options.id).on('mouseup', function(e) {
			oThis.mouseUpX = e.clientX;
			oThis.mouseUpY = e.clientY;	
			oThis.swapColumnEnd(e);
			oThis.mouseUpX = 'mouseUpX';
			oThis.mouseUpY = 'mouseUpY';
			oThis.mouseDownX = 'mouseDownX';
			oThis.mouseDownY = 'mouseDownY';
			oThis.mouseMoveX = 'mouseMoveX';
			oThis.mouseMoveY = 'mouseMoveY';
		});

		$('#' + this.options.id+ '_top').on('mouseup', function(e) {
			oThis.mouseUpX = e.clientX;
			oThis.mouseUpY = e.clientY;
			oThis.swapColumnEnd(e);
			oThis.mouseUpX = 'mouseUpX';
			oThis.mouseUpY = 'mouseUpY';
			oThis.mouseDownX = 'mouseDownX';
			oThis.mouseDownY = 'mouseDownY';
			oThis.mouseMoveX = 'mouseMoveX';
			oThis.mouseMoveY = 'mouseMoveY';
		});
	};

	gridCompProto.initGridEventFun = function(){
		// 执行原有方法
		initGridEventFunFun.apply(this,arguments);
		// 扩展方法
		var oThis = this;
	};

	/*
	 * 交换列位置开始，并不修改swapColumnFlag，当移动的时候才修改swapColumnFlag
	 */
	gridCompProto.swapColumnStart = function(e, ele) {
		if(!this.options.canSwap){
			return;
		}
		this.swapColumnEle = ele;
		this.swapColumnStartX = e.clientX;
		this.swapColumnStartY = e.clientY;
	};
	/*
	 * 交换位置
	 */
	gridCompProto.swapColumnFun = function(e) {
		if(!this.options.canSwap){
			return;
		}
		var oThis = this;
		if (this.swapColumnFlag) {
			var nowTh = this.swapColumnEle,
				$nowTh = $(nowTh),
				nowGridCompColumn = nowTh.gridCompColumn;
			//创建拖动区域
			if ($('#' + this.options.id + '_clue').length == 0) {
				var $d = $('<div class="u-grid u-grid-header-drag-clue" id="' + this.options.id + '_clue" />').css({
					width: nowTh.scrollWidth + "px",
					left: nowTh.attrLeftTotalWidth - oThis.scrollLeft + oThis.leftW +oThis.fixedWidth + "px",
					top: "0px",
					paddingLeft: $nowTh.css("paddingLeft"),
					paddingRight: $nowTh.css("paddingRight"),
					lineHeight: $nowTh.height() + "px",
					paddingTop: $nowTh.css("paddingTop"),
					paddingBottom: $nowTh.css("paddingBottom")
				}).html(nowGridCompColumn.options.title || nowGridCompColumn.options.field).prepend('<span class="fa fa-ban u-grid-header-drag-status" />');
				try{
					$('#' + this.options.id)[0].insertAdjacentElement('afterBegin',$d[0]);
				}catch(e){
					$('#' + this.options.id)[0].insertBefore($d[0],$('#' + this.options.id)[0].firstChild);
				}
				$d.on('mousemove',function(){
					e.stopPropagation();
				});
			}
			this.swapColumnEndX = e.clientX;
			this.swapColumnEndY = e.clientY;
			var changeX = this.swapColumnEndX - this.swapColumnStartX,
				changeY = this.swapColumnEndY - this.swapColumnStartY;
			$('#' + this.options.id + '_clue').css({
				left: nowTh.attrLeftTotalWidth + changeX - oThis.scrollLeft + oThis.leftW + oThis.fixedWidth + "px",
				top: changeY + "px"
			});

			// 创建提示div
			if ($('#' + this.options.id + '_swap_top').length == 0) {
				var $d = $('<span class="fa fa-sort-desc u-grid-header-swap-tip-span"  id="' + this.options.id + '_swap_top"/>');
				$d.css({
					top: $nowTh.height() - 6 + 'px'
				});
				var $d1 = $('<span class="fa fa-sort-asc u-grid-header-swap-tip-span" id="' + this.options.id + '_swap_down" />');
				$d1.css({
					top: '6px'
				});
				try{
					$('#' + this.options.id)[0].insertAdjacentElement('afterBegin',$d[0]);
					$('#' + this.options.id)[0].insertAdjacentElement('afterBegin',$d1[0]);
				}catch(e){
					$('#' + this.options.id)[0].insertBefore($d[0],$('#' + this.options.id)[0].firstChild);
					$('#' + this.options.id)[0].insertBefore($d1[0],$('#' + this.options.id)[0].firstChild);
				}
			}
			this.canSwap = false;
			$('#' + this.options.id + '_header_table th').each(function(i) {
				var left = $(this).offset().left,
					right = left + parseInt(this.attrWidth);
				if (i == 0 && e.clientX < left) {
					// 移动到最左边
					if (oThis.swapColumnEle != this) {
						oThis.swapToColumnEle = 'LeftEle';
						$('#' + oThis.options.id + '_swap_top').css({
							left: -oThis.scrollLeft - 3 + oThis.leftW +oThis.fixedWidth + 'px',
							display: 'block'
						});
						$('#' + oThis.options.id + '_swap_down').css({
							left: -oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
							display: 'block'
						});
					}
					oThis.canSwap = true;
				} else if (left < e.clientX && e.clientX < right) {
					if (oThis.swapColumnEle != this && parseInt($(this).attr('index')) + 1 != parseInt($(oThis.swapColumnEle).attr('index'))) {
						if (oThis.swapToColumnEle != this) {
							oThis.swapToColumnEle = this;
							$('#' + oThis.options.id + '_swap_top').css({
								left: this.attrRightTotalWidth - oThis.scrollLeft - 3 + oThis.leftW  + oThis.fixedWidth + 'px',
								display: 'block'
							});
							$('#' + oThis.options.id + '_swap_down').css({
								left: this.attrRightTotalWidth - oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
								display: 'block'
							});
						}
						oThis.canSwap = true;
						return false;
					}
				}
			});
			if (this.canSwap) {
				$('.u-grid-header-drag-status').removeClass('fa-ban').addClass('fa-plus-circle');
			} else {
				$('#' + this.options.id + '_swap_top').css('display', 'none');
				$('#' + this.options.id + '_swap_down').css('display', 'none');
				$('.u-grid-header-drag-status').removeClass('fa-plus-circle').addClass('fa-ban');
				this.swapToColumnEle = null;
			}
			$('#' + this.options.id + '_top').css('display', 'block');
		}
	};
	/*
	 * 交换位置结束
	 */
	gridCompProto.swapColumnEnd = function(e) {
		if(!this.options.canSwap){
			return;
		}
		var oThis = this;
		if (this.swapColumnFlag) {
			if (this.swapToColumnEle) {
				var swapColumnEle = this.swapColumnEle,
					swapToColumnEle = this.swapToColumnEle,
					swapColumnIndex = $(swapColumnEle).attr('index'),
					swapToColumnIndex = $(swapToColumnEle).attr('index'),
					swapGridCompColumn = this.gridCompColumnArr[swapColumnIndex];
				this.gridCompColumnArr.splice(parseInt(swapToColumnIndex) + 1, 0, swapGridCompColumn);
				if (swapColumnIndex < swapToColumnIndex)
					this.gridCompColumnArr.splice(swapColumnIndex, 1);
				else
					this.gridCompColumnArr.splice(parseInt(swapColumnIndex) + 1, 1);
				this.saveGridCompColumnArrToLocal();
				this.repaintGridDivs();
			}
			$('#' + this.options.id + '_clue').remove();
			$('#' + this.options.id + '_swap_top').css('display', 'none');
			$('#' + this.options.id + '_swap_down').css('display', 'none');
		}
		this.swapColumnFlag = false;
		$('#' + this.options.id + '_top').css('display', 'none');
	};
	if(typeof gridCompProto.saveGridCompColumnArrToLocal == 'undefined'){
		gridCompProto.saveGridCompColumnArrToLocal = function(){
		};
	}
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	var gridComp = $.fn.grid.gridComp,
		gridCompProto = gridComp.prototype,
		gridCompColumn = $.fn.grid.gridCompColumn,
		gridCompColumnProto = gridCompColumn.prototype,
		dataSource = $.fn.grid.dataSource,
		dataSourceProto = dataSource.prototype;

	gridCompColumnProto.initTree = function(options,gridOptions){
		if(gridOptions.showTree){
			options.sortable = false;
		}
		return options;
	};
	gridCompProto.initOptionsTree = function(){
		if(this.options.showTree){
			this.options.showNumCol = false;
		}
	};
		

	gridCompProto.clickFunTree = function(e){
		var oThis = this,$target = $(e.target),$td = $target.closest('td');
		
		if($td.length > 0){
			var $tr = $td.parent();
			var index = this.getTrIndex($tr);
			var row = oThis.dataSourceObj.rows[index];
			if(row){
				var rowChildIndex = row.childRowIndex;
				if($target.hasClass('fa-minus-square-o') || $target.hasClass('fa-plus-square-o') ){
					var minus = $td.find('.fa-minus-square-o');
					var plus = $td.find('.fa-plus-square-o');
					if(minus.length >0){
						// 合上 需要将所有的都合上
						minus.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
						if(rowChildIndex.length > 0){
							var allChildRowIndex = oThis.getAllChildRowIndex(row);
							$.each(allChildRowIndex, function() {
								var $tr1 = $('tr[role="row"]:eq(' + parseInt(this) +')',$tr.parent());
								$tr1.css('display','none');
								// 左侧复选区隐藏
								$('#' + oThis.options.id + '_content_multiSelect >div:nth-child('+(parseInt(this) +1)+ ')').css('display','none');
								$('.fa-minus-square-o',$tr1).removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
							});
						}
						if(this.options.editType == 'form'){
							$('#' + this.options.id + '_multiSelect_edit').remove(null,true);
							$('#' + this.options.id + '_numCol_edit').remove(null,true);
							$('#' + this.options.id + '_edit_tr').remove(null,true);
							$('#' + this.options.id + '_edit_tr1').remove(null,true);
						}
						return;
					}else if(plus.length > 0){
						// 展开
						plus.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
						if(rowChildIndex.length > 0){
							$.each(rowChildIndex, function() {
								var $tr1 = $('tr[role="row"]:eq(' + parseInt(this) +')',$tr.parent());
								$tr1.css('display','');
								var ss = $('#' + oThis.options.id + '_content_multiSelect >div:nth-child('+(parseInt(this) +1)+ ')')[0];
								$('#' + oThis.options.id + '_content_multiSelect >div:nth-child('+(parseInt(this) +1)+ ')').css('display','');
							});
						}
						return;
					}
				}
			}
		}
	};
	gridCompProto.addOneRowTree = function(row,index,rowObj){
		var oThis = this,l = this.dataSourceObj.rows.length;
		// 存在树结构
		if(this.options.showTree){
			this.hasParent = false;
			this.hasChildF = false;
			var keyField = this.options.keyField;
			var parentKeyField = this.options.parentKeyField;
			var keyValue = this.getString($(row).attr(keyField),'');
			rowObj.keyValue = keyValue;
			var parentKeyValue = this.getString($(row).attr(parentKeyField),'');
			rowObj.parentKeyValue = parentKeyValue;
			/* 判断是否存在父项/子项 */
			$.each(this.dataSourceObj.rows,function(i){
				var value = this.value;
				var nowKeyValue = oThis.getString($(value).attr(keyField),'');
				var nowParentKeyValue = oThis.getString($(value).attr(parentKeyField),'');
				if(nowKeyValue == parentKeyValue){
					/* 取父项的index和父项的子index*/
					oThis.hasParent = true;
					oThis.addRowParentIndex = i;
					parentChildLength = oThis.getAllChildRow(this).length;
					var parentLevel = this.level;
					rowObj.level = parentLevel + 1;
					// 由于不止需要计算最后一个子节点，同时需要计算子节点的子节点。所以现在添加到父节点的下面一个
					index = oThis.addRowParentIndex + parentChildLength + 1;
					if(!oThis.options.needTreeSort)
						return false;
				}
				if(nowParentKeyValue == keyValue){
					oThis.hasChildF = true;
				}
				if(oThis.hasParent && oThis.hasChildF)
					return false;
			});
			if(!this.hasParent){
				rowObj.level = 0;
				if(index != l) {
					// 如果没有父项则插入到最后，因为index有可能插入到其他节点的子节点之中，计算复杂
					index = l;
				}

			}
			if(this.hasParent){
				var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(oThis.addRowParentIndex);
				if(parentChildLength > 0){
					// 如果存在父项并且父项存在子项则需要判断父项是否展开
					var openDiv = $('.fa-plus-square-o',$pTr);
					if(!(openDiv.length > 0)){
						displayFlag = 'block';
					}
				}else{
					// 如果存在父项并且父项原来没有子项则需要添加图标
					if(this.options.autoExpand){
						displayFlag = 'block';
					}
					
					var d = $("div:eq(0)",$pTr);
					var openDiv = $('.fa-plus-square-o',$pTr);
					var closeDiv = $('.fa-minus-square-o',$pTr);
					if(this.options.autoExpand){
						var spanHtml = '<span class="fa u-grid-content-tree-span fa-minus-square-o"></span>';
					}else{
						var spanHtml = '<span class="fa u-grid-content-tree-span fa-plus-square-o"></span>';
					}
					if(d.length > 0 && openDiv.length == 0 && closeDiv.length == 0){
						d[0].insertAdjacentHTML('afterBegin',spanHtml);
						var oldLeft = parseInt(d[0].style.left);
						l = oldLeft - 16;
						if(l > 0 || l == 0){
							d[0].style.left = l + "px";
						}
					}
					if(openDiv.length > 0){
						openDiv.removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
					}
				}
			}
		}

		
		return index;
	}; 

	gridCompProto.addOneRowTreeHasChildF = function(rowObj){
		if(this.hasChildF){
			//如果存在子项则重新渲染整个区域
			this.dataSourceObj.sortRows();
			this.repairContent();
		}else{
			// 修改rowObj 和parent的变量
			if(this.hasParent){
				var parentRowObj = this.dataSourceObj.rows[this.addRowParentIndex];
				parentRowObj.hasChild = true;
				parentRowObj.childRow.push(rowObj);
				parentRowObj.childRowIndex.push(rowObj.valueIndex);
				rowObj.parentRow = parentRowObj;
				rowObj.parentRowIndex = this.addRowParentIndex;
			}
			rowObj.hasChild = false;
			rowObj.childRow = new Array();
			rowObj.childRowIndex = new Array();
		}
	};

	gridCompProto.updateValueAtTree = function(rowIndex,field,value,force){
		var oThis = this;
		var keyField = this.options.keyField;
		var parentKeyField = this.options.parentKeyField;
		if(this.options.showTree && (field == keyField || field == parentKeyField)){
			// 目前已经不适用grid源生的编辑设置了，因为树表时关闭edit
			var hasParent = false;
			var hasChildF = false;
			

			$.each(this.dataSourceObj.rows,function(i){
				var vv = this.value;
				var nowKeyValue = oThis.getString($(vv).attr(keyField),'');
				var nowParentKeyValue = oThis.getString($(vv).attr(parentKeyField),'');
				if(field == keyField && value == nowParentKeyValue){
					//修改的是keyfield，判断是否存在子项
					hasChildF = true;
				}
				if(field == parentKeyField && value == nowKeyValue){
					//修改的是parentKeyField，判断是否存在父项
					hasParent = true;
				}
			});
			if(hasChildF || hasParent){
				//删除当前行之后重新插入当前行由addonerow来进行树结构处理
				var rowValue = $(this.dataSourceObj.rows[rowIndex].value);
				this.deleteOneRow(rowIndex);
				this.addOneRow(rowValue[0]);
			}
			
		}
		if(this.options.showTree && (field == keyField || field == parentKeyField) && (hasChildF || hasParent)){
			rowIndex = this.getRowIndexByValue(field,value);
		}
		return rowIndex;
	};

	/*
	 * 获取数据行下所有子元素
	 */
	gridCompProto.getAllChildRow = function(row){
		// if(row.allChildRow && row.allChildRow.length > 0){
		// 	return row.allChildRow;
		// }
		row.allChildRow = new Array();
		this.getAllChildRowFun(row,row.allChildRow);
		return row.allChildRow;
	};




	/*
	 * 获取数据行下所有子元素的index
	 */
	gridCompProto.getAllChildRowIndex = function(row){
		// if(row.allChildRowIndex && row.allChildRowIndex.length > 0){
		// 	return row.allChildRowIndex;
		// }
		row.allChildRowIndex = new Array();
		this.getAllChildRowIndexFun(row,row.allChildRowIndex);
		return row.allChildRowIndex;
	};


	gridCompProto.getAllChildRowFun = function(row,rowArry){
		var oThis = this;
		if(row.childRow.length > 0){
			Array.prototype.push.apply(rowArry, row.childRow);
			$.each(row.childRow, function() {
				  oThis.getAllChildRowFun(this,rowArry);
			});
		}
	};

	gridCompProto.getAllChildRowIndexFun = function(row,rowArry){
		var oThis  = this;
		if(row.childRowIndex.length > 0){
			Array.prototype.push.apply(rowArry, row.childRowIndex);
			$.each(row.childRow, function() {
				  oThis.getAllChildRowIndexFun(this,rowArry);
			});
		}
	};
	/* 展开某个节点 */
	gridCompProto.expandNode = function(keyValue){
		var rowIndex = this.getRowIndexByValue(this.options.keyField,keyValue);
		this.expandNodeByIndex(rowIndex);
	};

	gridCompProto.expandNodeByIndex = function(rowIndex){
		var row = this.getRowByIndex(rowIndex);
		var parentExpand = false,parentIndex,needExpanedParent = new Array();
		var whileRow = row;
		while(!parentExpand){
			if(whileRow.parentKeyValue == ''){
				parentExpand = true;
				break;
			}else{
				parentIndex = whileRow.parentRowIndex;
				whileRow = whileRow.parentRow;
				var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(parentIndex);
				var openDiv = $('.fa-plus-square-o',$pTr);
				if(openDiv.length > 0){ //合着
					needExpanedParent.push(parentIndex);
				}else{
					parentExpand = true;
					break;
				}
			}
		}
		if(needExpanedParent.length > 0){
			for(var i = needExpanedParent.length - 1;i > -1;i--){
				var index = needExpanedParent[i];
				var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(index);
				var openDiv = $('.fa-plus-square-o',$pTr);
				openDiv.click();
			}
		}

		var $Tr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(rowIndex);
		var openDiv = $('.fa-plus-square-o',$Tr);
		var firstDiv = $('.u-grid-content-td-div',$Tr);
		if(openDiv.length > 0)
			openDiv.click();
		else
			firstDiv.click();
	}


	/*
	 * 将values转化为rows并进行排序(数表)
	 */
	dataSourceProto.treeSortRows = function(field, sortType) {
		var oThis = this;
		this.rows = new Array();
		this.hasParentRows = new Array();
		this.nothasParentRows = new Array();
		if(this.options.values){
			$.each(this.options.values, function(i){
				var rowObj = {};
				var $this = $(this);
				var keyField = oThis.gridComp.options.keyField;
				var parentKeyField = oThis.gridComp.options.parentKeyField;
				var keyValue = oThis.gridComp.getString($this.attr(keyField),'');
				var parentKeyValue = oThis.gridComp.getString($this.attr(parentKeyField),'');
				rowObj.valueIndex = i;
				rowObj.value = this;
				rowObj.keyValue = keyValue;
				rowObj.parentKeyValue = parentKeyValue;
				if(parentKeyValue == ''){
					oThis.nothasParentRows.push(rowObj);
				}else{
					oThis.hasParentRows.push(rowObj);
				}
				oThis.rows.push(rowObj);
			});
			// 判断存在父项的数据的父项是否真正存在
			$.each(this.hasParentRows,function(i){
				var parentKeyValue = this.parentKeyValue;
				var hasParent = false;
				$.each(oThis.rows,function(){
					if(this.keyValue == parentKeyValue){
						hasParent = true;
					}
				});
				if(!hasParent){
					oThis.hasParentRows.splice(i,0);
					oThis.nothasParentRows.push(this);
				}
			});
			oThis.rows = new Array();
			var level = 0;
			// 遍历nothasParentRows，将子项加入rows
			$.each(this.nothasParentRows, function(i) {
				this.level = level;
				oThis.rows.push(this);
				oThis.pushChildRows(this,level);
			});
		}
	};

	/*
	 * 将当前行子项插入rows数组
	 */
	dataSourceProto.pushChildRows = function(row,level){
		var keyValue = row.keyValue;
		var oThis = this;
		var nowLevel = parseInt(level) + 1;
		var hasChild = false;
		var childRowArray = new Array();
		var childRowIndexArray = new Array();
		$.each(this.hasParentRows, function(i) {
			if(this && this.parentKeyValue == keyValue){
				hasChild = true;
				this.level = nowLevel;
				oThis.rows.push(this);
				childRowArray.push(this);
				var index = parseInt(oThis.rows.length - 1);
				childRowIndexArray.push(index);
				oThis.hasParentRows.splice(i,0);
				oThis.pushChildRows(this,nowLevel);
			}
		});
		row.hasChild = hasChild;
		row.childRow = childRowArray;
		row.childRowIndex = childRowIndexArray;
	};
})(jQuery, window, document);

+ function($) {
	var Validate = function(element,options,form) {
		var self = this
		this.$element = element
		this.$form = form
		this.options = options
		this.required = false
		this.timeout = null
		//所有属性优先级 ：  options参数  > attr属性  > 默认值
		this.required = this.options['required']  ? this.options['required'] : this.$element.attr('required') ? true : false
		this.validType = this.options['validType'] ? this.options['validType'] :
			this.$element.attr('valid-type') ? this.$element.attr('valid-type') : null
		//校验模式  blur  submit
		this.validMode = this.options['validMode'] ? this.options['validMode'] :
			this.$element.attr('valid-mode') ? this.$element.attr('valid-mode') : Validate.DEFAULTS.validMode
		//空提示
		this.nullMsg = this.options['nullMsg'] ? this.options['nullMsg'] :
			this.$element.attr('null-msg') ? this.$element.attr('null-msg') : Validate.NULLMSG[this.validType]
		//是否必填
		if (this.required && !this.nullMsg)
			this.nullMsg = Validate.NULLMSG['required']
		//错误必填
		this.errorMsg = this.options['errorMsg'] ? this.options['errorMsg'] :
			$(element).attr('error-msg') ? this.$element.attr('error-msg') : Validate.ERRORMSG[this.validType]
		//正则校验
		this.regExp = this.options['reg'] ? this.options['reg'] :
			$(element).attr('reg') ? this.$element.attr('reg') : Validate.REG[this.validType]
		//提示div的id 为空时使用tooltop来提示
		this.tipId = this.options['tipId'] ? this.options['tipId'] :
			$(element).attr('tip-id') ? this.$element.attr('tip-id') : null
		//提示框位置
		this.placement = this.options['placement'] ? this.options['placement'] :
			$(element).attr('placement') ? this.$element.attr('placement') : Validate.DEFAULTS.placement
		//
		this.minLength = this.options['minLength'] > 0 ? this.options['minLength'] :
			$(element).attr('min-length') ? this.$element.attr('min-length') : null
		this.maxLength = this.options['maxLength'] > 0 ? this.options['maxLength'] :
			$(element).attr('max-length') ? this.$element.attr('max-length') : null
		this.min = this.options['min'] !== undefined  ? this.options['min'] :
			$(element).attr('min') !== undefined  ? this.$element.attr('min') : null
		this.max = this.options['max'] !== undefined ? this.options['max'] :
			$(element).attr('max') !== undefined ? this.$element.attr('max') : null
		this.minNotEq = this.options['minNotEq'] !== undefined ? this.options['minNotEq'] :
			$(element).attr('minNotEq') !== undefined ? this.$element.attr('minNotEq') : null
		this.maxNotEq = this.options['maxNotEq'] !== undefined ? this.options['maxNotEq'] :
			$(element).attr('maxNotEq') !== undefined ? this.$element.attr('maxNotEq') : null

		this.min = $.isNumeric(this.min) ? this.min : null
  		this.max = $.isNumeric(this.max) ? this.max : null
 		this.minNotEq = $.isNumeric(this.minNotEq) ? this.minNotEq : null
 		this.maxNotEq = $.isNumeric(this.maxNotEq) ? this.maxNotEq : null

 		this.validateCallBack = this.options['validateCallBack']
 		this.midValidateCallBack = this.options['midValidateCallBack']

		this.create()
	}

	Validate.tipTemplate = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow tooltip-arrow-c"></div><div class="tooltip-arrow"></div><div class="tooltip-inner" style="color:#ed7103;border:1px solid #ed7103;background-color:#fff7f0;"></div></div>'

	Validate.NULLMSG = {
		"required": trans('validate.required', "不能为空！"),
		"integer": trans('validate.integer', "请填写整数！"),
		"float": trans('validate.float', "请填写数字！"),
		"zipCode": trans('validate.zipCode', "请填写邮政编码！"),
		"phone": trans('validate.phone', "请填写手机号码！"),
		"email": trans('validate.email', "请填写邮箱地址！"),
		"url": trans('validate.url', "请填写网址！"),
		"datetime": trans('validate.datetime', "请填写日期！")

	}

	Validate.ERRORMSG = {
		"integer": trans('validate.integer', "请填写整数！"),
		"float": trans('validate.float', "请填写数字！"),
		"zipCode": trans('validate.zipCode', "邮政编码格式不对！"),
		"phone": trans('validate.phone', "手机号码格式不对！"),
		"email": trans('validate.email', "邮箱地址格式不对！"),
		"url": trans('validate.url', "网址格式不对！"),
		"datetime": trans('validate.datetime', "日期格式不对！")
	}

	Validate.REG = {
		"integer": /^-?\d+$/,
		"float": /^-?\d+(\.\d+)?$/,
		"zipCode": /^[0-9]{6}$/,
		"phone": /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
		"email": /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		"url": /^(\w+:\/\/)?\w+(\.\w+)+.*$/,
		"datetime": /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/
				// /^((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/
	}

	Validate.DEFAULTS = {
		validMode: 'blur',
		placement: "top"
	}

	Validate.fn = Validate.prototype

	Validate.fn.create = function() {
		var self = this
		this.$element.on('blur', function(e) {
			if (self.validMode == 'blur'){
				self.doValid()
			}
		}).on('focus', function(e) {
			//隐藏错误信息
			self.hideMsg()
		}).on('change', function(e) {
			//隐藏错误信息
			self.hideMsg()
		}).on('keydown', function(e) {
			var event = window.event || e;
			var tmp = self.$element.val();
			if(typeof self.midValidateCallBack == 'function') {
				var cbobj = {event: event, tempValue: tmp, inputEle: this};
				var rsl = self.midValidateCallBack.call(self, cbobj);
				if(rsl == false) return false; 
			}
			if(self["validType"] == "float"){
				
				if(event.shiftKey){
					event.returnValue=false;
					return false;
				}else if(event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
					// tab键 左箭头 右箭头 delete键
					return true;
				}else if(event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)){
					//复制粘贴
					return true;
				}else if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)||($.inArray(event.keyCode,[8,110,190,189,109]) > -1))){
					event.returnValue=false;
					return false;
				}else if((!tmp || tmp.indexOf(".") > -1) && (event.keyCode == 190 || event.keyCode == 110 )){
					event.returnValue=false;
					return false;
					
				}

				if(tmp && (tmp+'').split('.')[0].length >= 25) {
					return false;
					
				}

			}
			if(self["validType"] == "integer"){
				 if(event.shiftKey){
					event.returnValue=false;
					return false;
				}else if(event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46) {
					// tab键 左箭头 右箭头 delete键
					return true;
				}else if(event.ctrlKey && (event.keyCode == 67 || event.keyCode == 86)){
					//复制粘贴
					return true;
				}else if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)||($.inArray(event.keyCode,[8,109,189]) > -1))){
					event.returnValue=false;
					return false;
				}

				if(tmp && (tmp+'').split('.')[0].length >= 25) {
					return false;
				}
			}

		})
	}

	Validate.fn.updateOptions = function(options){

	}

	Validate.fn.calLength = function(value) {
		if(this.validType == 'float') {
			if( (value+'').indexOf('.') >= 0 ) {
				return value.lengthb() - 1;
			}
		}
		return value.lengthb();
	}

	Validate.fn.doValid = function(options) {



		if(typeof this.validateCallBack == 'function') {
			var cbobj = {event: event, tempValue: pValue, inputEle: this.$element[0]};
			var rsl = this.validateCallBack.call(this, cbobj);
			if(rsl == false) return false; 
		}

		var pValue;
		this.showMsgFlag = true;
		if(options){
			pValue = options.pValue;
			this.showMsgFlag = options.showMsg;
		}
		this.needClean = false

		if (this.$element.attr("readonly")) return true
		var value = null
		if (typeof pValue != 'undefined')
			value = pValue
		else
			value = this.getValue()
		if (this.isEmpty(value) && this.required) {
			this.showMsg(this.nullMsg)
			return false
		} else if(this.isEmpty(value) && !this.required){
			return true
		}
		if (this.regExp) {
			var reg = new RegExp(this.regExp);
			if (typeof value == 'number')
				value = value + ""
			var r = value.match(reg);
			if (r === null || r === false){
				this.showMsg(this.errorMsg)
				this.needClean = true
				return false
			}
		}
		if (this.minLength){
			if (this.calLength(value) < this.minLength){
				this.showMsg("输入长度不能小于" + this.minLength + "位")
				return false
			}
		}
		if (this.maxLength){
			if (this.calLength(value) > this.maxLength){
				this.showMsg("输入长度不能大于" + this.maxLength + "位")
				return false
			}
		}
		if (this.max != undefined && this.max != null){
			if (parseFloat(value) > this.max){
				this.showMsg("输入值不能大于" + this.max)
				return false
			}
		}
		if(this.min != undefined && this.min != null){
			if (parseFloat(value) < this.min){
				this.showMsg("输入值不能小于" + this.min)
				return false
			}
		}
		if (this.maxNotEq != undefined && this.maxNotEq != null){
			if (parseFloat(value) >= this.maxNotEq){
				this.showMsg("输入值不能大于或等于" + this.maxNotEq)
				return false
			}
		}
		if(this.minNotEq != undefined && this.minNotEq != null){
			if (parseFloat(value) <= this.minNotEq){
				this.showMsg("输入值不能小于或等于" + this.minNotEq)
				return false
			}
		}
		return true
	}

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

    Validate.fn.some = Array.prototype.some ?
		Array.prototype.some : function() {
			var flag;
			for (var i = 0; i < this.length; i++) {
				if (typeof arguments[0] == "function") {
					flag = arguments[0](this[i])
					if (flag) break;
				}
			}
			return flag;
		};

	Validate.fn.getValue = function() {
		var inputval = '';
		//checkbox、radio为u-meta绑定时
		var bool = this.some.call(this.$element.children('[type="checkbox"],[type="radio"]'), function(ele) {
			return ele.type == "checkbox" || ele.type == "radio"
		});
		if (this.$element.children().length > 0 && bool) {
			var eleArr = this.$element.find('[type="checkbox"],[type="radio"]')
			var ele = eleArr[0]
			if (ele.type == "checkbox") {
				this.$element.find(":checkbox[name='" + $(ele).attr("name") + "']:checked").each(function() {
					inputval += $(this).val() + ',';
				})
			} else if (ele.type == "radio") {
				inputval = this.$element.find(":radio[name='" + $(ele).attr("name") + "']:checked").val();
			}
		} else if (this.$element.is(":radio")) { //valid-type 绑定
			inputval = this.$element.parent().find(":radio[name='" + this.$element.attr("name") + "']:checked").val();
		} else if (this.$element.is(":checkbox")) {
			inputval = "";
			this.$element.parent().find(":checkbox[name='" + this.$element.attr("name") + "']:checked").each(function() {
				inputval += $(this).val() + ',';
			})
		} else if (this.$element.find('input').length > 0){
			inputval = this.$element.find('input').val()
		}else {
			inputval = this.$element.val();
		}
		inputval = $.trim(inputval);
		return this.isEmpty(inputval) ? "" : inputval;
	}

	Validate.fn.isEmpty = function(val) {
		return val === "" || val === undefined || val === null || val === $.trim(this.$element.attr("tip"));
	}

	Validate.fn.showMsg = function(msg) {
		if(this.showMsgFlag == false || this.showMsgFlag == 'false'){
			return;
		}
		var self = this
		if (this.tipId) {
			$('#' + this.tipId).html(msg).show()
		} else {
			var tipOptions = {
				"title": msg,
				"trigger": "manual",
				"selector": "validtip",
				"placement": this.placement,
				"container":"body"
			}
			if (Validate.tipTemplate)
				tipOptions.template = Validate.tipTemplate
			this.$element.tooltip(tipOptions)
			this.$element.tooltip('show')
			clearTimeout(this.timeout)
			this.timeout = setTimeout(function(){
				self.hideMsg();
			},3000)
		}
	}

	Validate.fn.hideMsg = function() {
		if (this.tipId) {
			$('#' + this.tipId).hide()
		} else {
			this.$element.tooltip('destroy')
		}
	}

	function Plugin($element, options) {
		var self = this
		this.$element = $element
		this.validates = []
		//单元素校验
		if (options && options['single'] && options['single'] == true)
			this.createValidate(this.$element, options)
		else{
			if (this.$element.children().length > 0) {
				var $form = this.$element.find('[valid-type], [required]')
				$form.each(function() {
					var $this = $(this)
					self.createValidate($this, options, $form)
				})
			} else
				this.createValidate(this.$element, options)
		}
		return this
	}

	Plugin.fn = Plugin.prototype

	Plugin.fn.createValidate = function($ele, options, $form) {
		var data = $ele.data('u.validate')
		var options = typeof options == 'object' && options
		if (!data) $ele.data('u.validate', (data = new Validate($ele, options, $form)))
		this.validates.push(data)
	}

	Plugin.fn.check = function(value) {
		var passed = true
//		if (this.$element.children().length > 0) {
//			var $form = this.$element.find('[valid-type], [required]')
//			$form.each(function() {
//				var validate = $(this).data('u.validate')
//				passed = validate.doValid() && passed
//			})
//		} else{
//			var validate = this.$element.data('u.validate')
//			passed = validate.doValid()
//		}
		for(var i = 0 ; i< this.validates.length; i++){
			passed = this.validates[i].doValid(value) && passed
		}
		return passed
	}

	/**
	 * 只有单一元素时使用
	 */
	Plugin.fn._needClean = function(){
		return this.validates[0].needClean
	}

	var old = $.fn.validate;

	$.fn.validate = function(options){
		var plug = new Plugin(this, options)
		return plug
	}

	$.fn.validate.noConflict = function() {
		$.fn.validate = old;
		return this;
	}

}($);

+ function($) {
	'use strict';

	var Autocomplete = function(element, options) {
		this.$input = $(element)
		this.options = $.extend({}, Autocomplete.DEFAULTS, options)
		this.requestIndex = 0
		this.pending = 0
		// Create a link to self
		var me = this;

		// Create jQuery object for input element
		//	var $input = $(input).attr("autocomplete", "off");

		// Apply inputClass if necessary
		if (this.options.inputClass) this.$input.addClass(this.options.inputClass);

		// Create results
		this.$results = $("#autocompdiv");
		if (this.$results.length == 0){
			this.$results = $('<div id="autocompdiv"></div>')
			$('body').append(this.$results)
		}
//		var results = document.createElement("div");
		// Create jQuery object for results
		this.$results.hide().addClass(this.options.resultsClass).css("position", "absolute");
		if (this.options.width > 0) this.$results.css("width", this.options.width);

		// Add to body element
//		$("body").append(results);

		//	input.autocompleter = me;

		this.timeout = null;
		this.prev = "";
		this.active = -1;
		this.cache = {};
		this.keyb = false;
		this.hasFocus = false;
		this.lastKeyPressCode = null;

		this._initSource();


		this.$input.keydown(function(e) {
				// track last key pressed
				me.lastKeyPressCode = e.keyCode;
				switch (e.keyCode) {
					case 38: // up
						e.preventDefault();
						me.moveSelect(-1);
						break;
					case 40: // down
						e.preventDefault();
						me.moveSelect(1);
						break;
					case 9: // tab
					case 13: // return
						if (me.selectCurrent()) {
							// make sure to blur off the current field
							me.$input.get(0).blur();
							e.preventDefault();
						}
						break;
					default:
						me.active = -1;
						if (me.timeout) clearTimeout(me.timeout);
						me.timeout = setTimeout(function() {
							me.onChange();
						}, me.options.delay);
						break;
				}
			})
			.focus(function() {
				// track whether the field has focus, we shouldn't process any results if the field no longer has focus
				me.hasFocus = true;
			})
			.blur(function() {
				// track whether the field has focus
				me.hasFocus = false;
				// me.hideResults();
			});

		this.hideResultsNow();


		//  this.update(this.options)
	}

	Autocomplete.DEFAULTS = {
		inputClass: "ac_input",
		resultsClass: "ac_results",
		lineSeparator: "\n",
		cellSeparator: "|",
		minChars: 1,
		delay: 400,
		matchCase: 0,
		matchSubset: 1,
		matchContains: 0,
		cacheLength: 1,
		mustMatch: 0,
		extraParams: {},
		loadingClass: "ac_loading",
		selectFirst: false,
		selectOnly: false,
		maxItemsToShow: -1,
		autoFill: false,
		width: 0,
		source:null,
		select: null
	}

	Autocomplete.fn = Autocomplete.prototype;

	// flush cache
	Autocomplete.fn.flushCache = function() {
		this.cache = {};
		this.cache.data = {};
		this.cache.length = 0;
	};

	Autocomplete.fn._initSource = function() {
		var array, url, me = this;
		if ( $.isArray( this.options.source ) ) {
			array = this.options.source;
			this.source = function( request, response ) {
//				response( $.ui.autocomplete.filter( array, request.term ) );
				response(me.filterData(request.term, array));
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( me.xhr ) {
					me.xhr.abort();
				}
				me.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response([]);
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	}
	
	Autocomplete.fn._response = function() {
		var index = ++this.requestIndex;

		return $.proxy(function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
//				this.element.removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	}

	Autocomplete.fn.__response = function( content ) {
		if ( content ) 
			this.receiveData2(content);
			this.showResults();
	}

	Autocomplete.fn.onChange = function() {
		// ignore if the following keys are pressed: [del] [shift] [capslock]
		if (this.lastKeyPressCode == 46 || (this.lastKeyPressCode > 8 && this.lastKeyPressCode < 32)) return this.$results.hide();
		var v = this.$input.val();
		// 参照修改需求
//		if (v == this.prev) return;
		this.prev = v;
		if (v.length >= this.options.minChars || v.length >= 0) {
			this.$input.addClass(this.options.loadingClass);
//			this.requestData(v);
			this.pending++;
			this.source( { term: v }, this._response() );
		} else {
			this.$input.removeClass(this.options.loadingClass);
			this.$results.hide();
		}
	};

	Autocomplete.fn.moveSelect = function(step) {
		var lis = $("li", this.$results[0]);
		if (!lis) return;

		this.active += step;

		if (this.active < 0) {
			this.active = 0;
		} else if (this.active >= lis.size()) {
			this.active = lis.size() - 1;
		}

		lis.removeClass("ac_over");

		$(lis[this.active]).addClass("ac_over");
	};

	Autocomplete.fn.selectCurrent = function() {
		var li = $("li.ac_over", this.$results[0])[0];
		if (!li) {
			var $li = $("li", this.$results[0]);
			if (this.options.selectOnly) {
				if ($li.length == 1) li = $li[0];
			} else if (this.options.selectFirst) {
				li = $li[0];
			}
		}
		if (li) {
			this.selectItem(li);
			return true;
		} else {
			return false;
		}
	};

	Autocomplete.fn.selectItem = function(li) {
		var me = this;
		if (!li) {
			li = document.createElement("li");
//			li.extra = [];
			li.selectValue = "";
		}
		var v = $.trim(li.selectValue ? li.selectValue : li.innerHTML);
		this.lastSelected = v;
		this.prev = v;
		this.$results.html("");
		this.$input.val(v);
		this.hideResultsNow();
		if (this.options.select) setTimeout(function() {
			me.options.select(li._item)
		}, 1);
	};

	// selects a portion of the input string
	Autocomplete.fn.createSelection = function(start, end) {
		// get a reference to the input element
		var field = this.$input.get(0);
		if (field.createTextRange) {
			var selRange = field.createTextRange();
			selRange.collapse(true);
			selRange.moveStart("character", start);
			selRange.moveEnd("character", end);
			selRange.select();
		} else if (field.setSelectionRange) {
			field.setSelectionRange(start, end);
		} else {
			if (field.selectionStart) {
				field.selectionStart = start;
				field.selectionEnd = end;
			}
		}
		field.focus();
	};

	// fills in the input box w/the first match (assumed to be the best match)
	Autocomplete.fn.autoFill = function(sValue) {
		// if the last user key pressed was backspace, don't autofill
		if (this.lastKeyPressCode != 8) {
			// fill in the value (keep the case the user has typed)
			this.$input.val(this.$input.val() + sValue.substring(this.prev.length));
			// select the portion of the value not typed by the user (so the next character will erase)
			this.createSelection(this.prev.length, sValue.length);
		}
	};

	Autocomplete.fn.showResults = function() {
		// get the position of the input field right now (in case the DOM is shifted)
		var pos = findPos(this.$input[0]);
		// either use the specified width, or autocalculate based on form element
		var iWidth = (this.options.width > 0) ? this.options.width : this.$input.width();
		// reposition
		if('100%'===this.options.width){
			this.$results.css({
				top: (pos.y + this.$input[0].offsetHeight) + "px",
				left: pos.x + "px"
			}).show();
		}else{
			this.$results.css({
				width: parseInt(iWidth) + "px",
				top: (pos.y + this.$input[0].offsetHeight) + "px",
				left: pos.x + "px"
			}).show();
		}
	};

	Autocomplete.fn.hideResults = function() {
		var me = this;
		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(function() {
			me.hideResultsNow();
		}, 200);
	};

	Autocomplete.fn.hideResultsNow = function() {
		if (this.timeout) clearTimeout(this.timeout);
		this.$input.removeClass(this.options.loadingClass);
		//if (this.$results.is(":visible")) {
			this.$results.hide();
		//}
		if (this.options.mustMatch) {
			var v = this.$input.val();
			if (v != this.lastSelected) {
				this.selectItem(null);
			}
		}
	};

	Autocomplete.fn.receiveData = function(q, data) {
		if (data) {
			this.$input.removeClass(this.options.loadingClass);
			this.$results.html('');

			if (!this.hasFocus || data.length == 0) return this.hideResultsNow();

			this.$results.append(this.dataToDom(data));
			// autofill in the complete box w/the first match as long as the user hasn't entered in more data
			if (this.options.autoFill && (this.$input.val().toLowerCase() == q.toLowerCase())) this.autoFill(data[0][0]);
			this.showResults();
		} else {
			this.hideResultsNow();
		}
	};
	
	Autocomplete.fn.filterData = function(v, items) {
		if (!v) return items;
		var _items = [];
		for (var i =0, count = items.length; i< count; i++){
			var label = items[i].label;
			if (label.indexOf(v) == 0)
				_items.push(items[i]);
		}
		return _items;
	};
	
	
	Autocomplete.fn.receiveData2 = function(items) {
		if (items) {
			this.$input.removeClass(this.options.loadingClass);
			this.$results.html('');

			// if the field no longer has focus or if there are no matches, do not display the drop down
			if (!this.hasFocus || items.length == 0) return this.hideResultsNow();

			this.$results.append(this.dataToDom2(items));
			this.showResults();
		} else {
			this.hideResultsNow();
		}		
	}
	Autocomplete.fn.dataToDom2 = function(items) {
		var ul = document.createElement("ul");
		var num = items.length;
		var me = this;

		// limited results to a max number
		if ((this.options.maxItemsToShow > 0) && (this.options.maxItemsToShow < num)) num = this.options.maxItemsToShow;

		for (var i = 0; i < num; i++) {
			var item = items[i];
			if (!item) continue;
			var li = document.createElement("li");
			if (this.options.formatItem) 
				li.innerHTML = this.options.formatItem(item, i, num);
			else 
				li.innerHTML = item.label;
			li.selectValue = item.label;
			li._item = item;
			ul.appendChild(li);
			$(li).hover(
				function() {
					$("li", ul).removeClass("ac_over");
					$(this).addClass("ac_over");
					me.active = indexOf($("li", ul), $(this).get(0));
				},
				function() {
					$(this).removeClass("ac_over");
				}
			).mousedown(function(e) {
				e.preventDefault();
				e.stopPropagation();
				me.selectItem(this)
			});
		}
		return ul;
	};	

	Autocomplete.fn.parseData = function(data) {
		if (!data) return null;
		var parsed = [];
		var rows = data.split(this.options.lineSeparator);
		for (var i = 0; i < rows.length; i++) {
			var row = $.trim(rows[i]);
			if (row) {
				parsed[parsed.length] = row.split(this.options.cellSeparator);
			}
		}
		return parsed;
	};

	Autocomplete.fn.dataToDom = function(data) {
		var ul = document.createElement("ul");
		var num = data.length;
		var me = this;

		// limited results to a max number
		if ((this.options.maxItemsToShow > 0) && (this.options.maxItemsToShow < num)) num = this.options.maxItemsToShow;

		for (var i = 0; i < num; i++) {
			var row = data[i];
			if (!row) continue;
			var li = document.createElement("li");
			if (this.options.formatItem) {
				li.innerHTML = this.options.formatItem(row, i, num);
				li.selectValue = row[0];
			} else {
				li.innerHTML = row[0];
				li.selectValue = row[0];
			}
			var extra = null;
			if (row.length > 1) {
				extra = [];
				for (var j = 1; j < row.length; j++) {
					extra[extra.length] = row[j];
				}
			}
			li.extra = extra;
			ul.appendChild(li);
			$(li).hover(
				function() {
					$("li", ul).removeClass("ac_over");
					$(this).addClass("ac_over");
					me.active = indexOf($("li", ul), $(this).get(0));
				},
				function() {
					$(this).removeClass("ac_over");
				}
			).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				me.selectItem(this)
			});
		}
		return ul;
	};

	Autocomplete.fn.requestData = function(q) {
		var me = this;
		if (!this.options.matchCase) q = q.toLowerCase();
		var data = this.options.cacheLength ? this.loadFromCache(q) : null;
		// recieve the cached data
		if (data) {
			this.receiveData(q, data);
			// if an AJAX url has been supplied, try loading the data now
		} else if ((typeof this.options.url == "string") && (this.options.url.length > 0)) {
			$.get(this.makeUrl(q), function(data) {
				data = me.parseData(data);
				me.addToCache(q, data);
				me.receiveData(q, data);
			});
			// if there's been no data found, remove the loading class
		} else {
			this.$input.removeClass(this.options.loadingClass);
		}
	};

	Autocomplete.fn.makeUrl = function(q) {
		var url = this.options.url + "?q=" + encodeURI(q);
		for (var i in this.options.extraParams) {
			url += "&" + i + "=" + encodeURI(this.options.extraParams[i]);
		}
		return url;
	};

	Autocomplete.fn.loadFromCache = function(q) {
		if (!q) return null;
		if (this.cache.data[q]) return this.cache.data[q];
		if (this.options.matchSubset) {
			for (var i = q.length - 1; i >= this.options.minChars; i--) {
				var qs = q.substr(0, i);
				var c = this.cache.data[qs];
				if (c) {
					var csub = [];
					for (var j = 0; j < c.length; j++) {
						var x = c[j];
						var x0 = x[0];
						if (this.matchSubset(x0, q)) {
							csub[csub.length] = x;
						}
					}
					return csub;
				}
			}
		}
		return null;
	};

	Autocomplete.fn.matchSubset = function(s, sub) {
		if (!this.options.matchCase) s = s.toLowerCase();
		var i = s.indexOf(sub);
		if (i == -1) return false;
		return i == 0 || this.options.matchContains;
	};

	Autocomplete.fn.addToCache = function(q, data) {
		if (!data || !q || !this.options.cacheLength) return;
		if (!this.cache.length || this.cache.length > this.options.cacheLength) {
			this.flushCache();
			this.cache.length++;
		} else if (!this.cache[q]) {
			this.cache.length++;
		}
		this.cache.data[q] = data;
	};

	function findPos(obj) {
		var curleft = obj.offsetLeft || 0;
		var curtop = obj.offsetTop || 0;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft
			curtop += obj.offsetTop
		}
		return {
			x: curleft,
			y: curtop
		};
	}

	function indexOf($element, e) {
		for (var i = 0; i < $element.length; i++) {
			if ($element[i] == e) return i;
		}
		return -1;
	};



	function Plugin(option) {
		if (this.length != 1) return;
		var $this = $(this)
		var data = $this.data('u.autocomplete')
		var options = typeof option == 'object' && option

		if (!data) $this.data('u.autocomplete', (data = new Autocomplete(this, options)))
			//	else data.update(options);
		return data;
	}

	var old = $.fn.autocomplete

	$.fn.autocomplete = Plugin
	$.fn.autocomplete.Constructor = Autocomplete



	$.fn.autocomplete.noConflict = function() {
		$.fn.autocomplete = old
		return this
	}

}($);
/* ========================================================================
 * UUI: backtop.js v0.0.1
 *
 * ========================================================================
 * Copyright 2014 yonyou, Inc.
 * Licensed under MIT ()
 * ======================================================================== */


+ function($) {
	'use strict';

	var BackTop = function(element, options) {
		var me = this;
		this.$element = $(element)
		this.options = $.extend({}, BackTop.DEFAULTS, options);

		$(window).scroll(function(e) {
			if($(document).scrollTop() > me.options.toggleHeight) {
				me.$element.addClass("active");
			} else {
				me.$element.removeClass("active");
			}
		});
		this.$element.click(function() {
			$(document).scrollTop(0);
		});
		

	}

	BackTop.DEFAULTS = {
		toggleHeight : 100

	}

	BackTop.fn = BackTop.prototype

	function Plugin(option) {
		if (this.length != 1) return;
		var $this = $(this)
		var data = $this.data('u.backtop')
		var options = typeof option == 'object' && option

		if (!data) $this.data('u.backtop', (data = new BackTop(this, options)))
		return data;
	}

	var old = $.fn.backtop

	$.fn.backtop = Plugin
	$.fn.backtop.Constructor = BackTop



	$.fn.backtop.noConflict = function() {
		$.fn.backtop = old
		return this
	}


}($);
;(function($) {
	var Combobox = function(element, options) {

		var self = this;
		this.$element = element;
		this.options = $.extend({}, Combobox.DEFAULTS, options);
		this.items = [];
		//this.oLis = [];
		this.mutilPks = [];
		this.oDiv = null;
		
	

		Object.defineProperty(element[0], 'value', {

			get: function() {

				return this.trueValue;
			},
			set: function(pk) {

				var items = self.items;
				//var oLis = self.oLis;
				var oLis = $(self.oDiv).find('li');

				if (self.options.single == "true" || self.options.single == true ) {

					for (var i = 0, length = items.length; i < length; i++) {

						var ipk = items[i].pk;
						if (ipk == pk) {
							this.innerHTML = items[i].name;
							this.trueValue = pk;
							break;
						} else {

							this.trueValue = '';
							this.innerHTML = '';
						}

					}

				} else if (self.options.mutil == "true" || self.options.mutil == true) {
                    
                    if(!$.isArray(pk) ){
                    	if(typeof pk == "string" && pk !== ""){                   		
                    		pk = pk.split(',');
                    		self.mutilPks = pk;
                    	}else{
                    		return
                    	}
                    }
                    
					if (self.mutilPks.length == 0) {
						self.mutilPks = pk;
					}

					$(this).html('');
					var valueArr = [];

					for (var j = 0; j < pk.length; j++) {

						for (var i = 0, length = oLis.length; i < length; i++) {
							var ipk = oLis[i].item.pk;
							if (pk[j] == ipk) {

								valueArr.push(pk[j]);

								oLis[i].style.display = 'none';

								var imageFont = $("<i class='fa fa-close'></i>");

								imageFont.on('mousedown', function() {

									var $this = $(this);
									//var lis = self.oLis;
									var lis = $(self.oDiv).find('li');

									for (var j = 0, len = lis.length; j < len; j++) {
										if (lis[j].item.name == $this.siblings('.itemName').html()) {
											lis[j].style.display = 'block';

											for (var h = 0; h < self.mutilPks.length; h++) {
												if (self.mutilPks[h] == lis[j].item.pk) {
													self.mutilPks.splice(h, 1);
													h--;
												}
											}

											for (var b = 0; b < valueArr.length; b++) {
												if (valueArr[b] == lis[j].item.pk) {
													valueArr.splice(b, 1);
													b--;
												}
											}

										}
									}

									$this.parent().remove();
									element[0].trueValue = '';
									element[0].trueValue = valueArr.toString();
									$(element).trigger('mutilSelect',valueArr.toString())
								});



								var selectName = $("<i class='itemName'>" + items[i].name + "</i>");

								var activeSelect = $("<div class='mutil-select-div'></div>")

								activeSelect.append(imageFont);
								activeSelect.append(selectName);

								$(this).append(activeSelect);


							}

						}


					}

					this.trueValue = valueArr.toString();
					

				}


			}
		})
        //禁用下拉框
        if(this.options.readonly === "readonly")return;
        
		if (this.options.single == "true" || this.options.single == true) {
			this.singleSelect()
		}

		if (this.options.mutil == "true" || this.options.mutil == true) {
			this.mutilSelect();
		}
		
		this.clickEvent();

		this.blurEvent();
        
        this.comboFilter();
        
        this.comboFilterClean();
	}

	Combobox.DEFAULTS = {
		dataSource: {},
		mutil: false,
		enable: true,
		single: true,
		onSelect: function() {}
	}

	Combobox.fn = Combobox.prototype;

	Combobox.fn.createDom = function() {

		var data = this.options.dataSource;
		if ($.isEmptyObject(data)) {
			throw new Error("dataSource为空！");
		}

		var oDiv = document.createElement("div");
		oDiv.className = 'select-list-div';
        //this.oDiv
		this.oDiv = oDiv;
		//新增搜索框
		
        var searchDiv = document.createElement("div");
        searchDiv.className = 'select-search';
		var searchInput =  document.createElement("input");
		searchDiv.appendChild(searchInput);
		//oDiv.appendChild(searchDiv);
		//禁用搜索框
		if(this.options.readchange){
			searchDiv.style.display = "none"
		}
		var oUl = document.createElement("ul");

		oUl.className = 'select-list-ul';
	
		for (var i = 0; i < data.length; i++) {
			var item = {
				pk: data[i].pk,
				name: data[i].name
			}
			this.items.push(item)
			var oLi = document.createElement("li");

			oLi.item = item;
			oLi.innerHTML = data[i]['name'];

			//this.oLis.push(oLi);

			oUl.appendChild(oLi);

		}


		oDiv.appendChild(oUl);
		oDiv.style.display = 'none';
		document.body.appendChild(oDiv);

	}

	Combobox.fn.focusEvent = function() {
		var self = this;
		this.$element.on('click', function(e) {
			if(!self.$element.data("enable") && self.options.readchange == true) return;
			var returnValue = self.show();

			if (returnValue === 1) return;
			// self.show();

			self.floatLayer();

			self.floatLayerEvent();

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}

	//下拉图标的点击事件
	Combobox.fn.clickEvent = function() {
		var self = this;		
		var caret = this.$element.next('.input-group-addon')[0] || this.$element.next(':button')[0];

		$(caret).on('click', function(e) {

			self.show();

			self.floatLayer();

			self.floatLayerEvent();

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}

	//tab键切换 下拉隐藏	
	Combobox.fn.blurEvent = function() {
		var self = this;
        
		this.$element.on('keyup', function(e) {
			var key = e.which || e.keyCode;
			if (key == 9)
				self.show();
			
		}).on('keydown', function(e) {
			var key = e.which || e.keyCode;
			if(key == 9)
			self.hide();
		});
	}



	Combobox.fn.floatLayer = function() {

		if ($(".select-floatDiv").length == 0) {

			var oDivTwo = document.createElement("div");

			oDivTwo.className = 'select-floatDiv';
			document.body.appendChild(oDivTwo);
		}

	}

	Combobox.fn.floatLayerEvent = function() {
		var self = this;
		$(".select-floatDiv").click(function(e) {

			self.hide();
			$(this).remove();

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}
		});


	}

	Combobox.fn.show = function() {

		//var oLis = this.oLis;
		var oLis = $(this.oDiv).find('li');
		var vote = 0;
		for (var i = 0, length = oLis.length; i < length; i++) {

			if (oLis[i].style.display == 'none') {
				vote++;
			}
		}

		if (vote === length) return 1;

		var left = this.$element.offset().left;
		var top = this.$element.offset().top;

		var selectHeight = this.options.dataSource.length * 30 + 10 + 10;

		var differ = (top + this.$element.outerHeight() + selectHeight) - ($(window).height() + $(window).scrollTop());
		var oDiv = this.oDiv;

		if (differ > 0) {

			oDiv.style.left = left + 'px';
			oDiv.style.top = top - selectHeight + 'px';

		} else {

			oDiv.style.left = left + 'px';
			oDiv.style.top = top + this.$element.outerHeight() + 'px';

		}

		oDiv.style.display = 'block';
	}

	Combobox.fn.hide = function() {
		this.oDiv.style.display = 'none';
	}

	Combobox.fn.singleDivValue = function() {
		var self = this;
		//var oLis = this.oLis;
		var oLis = $(this.oDiv).find('li');
		for (var i = 0; i < oLis.length; i++) {
			
			$(oLis[i]).click(function(){
				
				var item = this.item
				self.$element.val(item.pk);

				self.oDiv.style.display = 'none';

				self.options.onSelect(item);

				self.$element.trigger('change');
				
			})

		}
	}

	Combobox.fn.mutilDivValue = function() {
		var self = this;
		//var oLis = this.oLis;
		var oLis = $(this.oDiv).find('li');
		for (var i = 0; i < oLis.length; i++) {
			$(oLis[i]).click(function(){
				
				var pk = this.item.pk;
				var mutilpks = self.mutilPks;
				var mutilLenth = mutilpks.length;

				if (mutilLenth > 0) {

					for (var k = 0; k < mutilLenth; k++) {

						if (pk == mutilpks[k]) {

							mutilpks.splice(k, 1);
                            k--;
						}

					}

				}

				mutilpks.push(pk);

				self.$element.val(mutilpks);
                
                self.$element.trigger('mutilSelect',mutilpks.toString())

				self.oDiv.style.display = 'none';
				this.style.display = 'none';
				self.$element.trigger('change');
				
				
				
			})

		}
	}

	Combobox.fn.singleSelect = function() {

		this.createDom();
		this.focusEvent();
		this.singleDivValue();

	}

	Combobox.fn.mutilSelect = function() {

		this.createDom();
		this.mutilDivValue();
		this.focusEvent();

	}
   //过滤下拉选项
   Combobox.fn.comboFilter = function(){
   	 var self = this;
   	 $(this.oDiv).on('keyup',function(){
   	 	 var content = $(this).find('.select-search input').val()
   	 	
   	 	 var oLis = $(this).find('li')
   	 	 for(var i=0;i<oLis.length;i++){
   	 	 	 if(oLis[i].item.name.indexOf(content) != -1){
   	 	 	 	oLis[i].style.display = 'block';
   	 	 	 }else{
   	 	 	 	oLis[i].style.display = 'none';
   	 	 	
   	 	 	 }
   	 	 }
   	 	 
   	 	 
   	 })
   }
   
   //过滤的后续处理
   Combobox.fn.comboFilterClean = function(){
   	  var self = this;
   	  $(this.$element).on('click',function(){
   	  	 $(self.oDiv).find('.select-search input').val('')  	  	
   	  	 var oLis = $(self.oDiv).find('li');
   	  	 if(self.options.single == "true" || self.options.single == true){
   	  	 	for(var i=0;i<oLis.length;i++){
   	  	 	  oLis[i].style.display = 'block'
   	  	   }
   	  	 }else if(self.options.mutil == "true" || self.options.mutil == true ){
   	  	 	 var selectLisIndex = [];
   	  	 	 var selectLisSpan = $(this).find('.mutil-select-div .itemName');
   	  	 	
   	  	 	 for(var i=0;i<selectLisSpan.length;i++){
   	  	 	 	 for(var k=0;k<oLis.length;k++){
   	  	 	 	 	if($(selectLisSpan[i]).html() == oLis[k].item.name){
   	  	 	 	 		//oLis[k].style.display = 'none';
   	  	 	 	 		selectLisIndex.push(k)
 	  	 	 	 	}
   	  	 	 	 }
   	  	 	 }
   	  	 	 
   	  	 	for(var l=0; l<oLis.length;l++) {
   	  	 		oLis[l].style.display = 'block'
   	  	 		for(var j=0;j<selectLisIndex.length;j++){
   	  	 	 	if(l == selectLisIndex[j])
   	  	 	 	  oLis[l].style.display = 'none'
   	  	 	   }
   	  	 	}
   	  	 	 
   	  	 	 
   	  	 }
   	  	 
   	  	  
   	  })
   }
	var Plugin = function(option) {

		var $this = $(this);
		var data = $this.data('s.select');
		var options = typeof option == 'object' && option

		if (!data) $this.data('s.select', (new Combobox(this, options)))

	}

    //动态设置li值
	$.fn.setComboData = function(dataSourse) {
        var $this = $(this).data('s.select');
        if(!$this)return;
		var data = dataSourse;
		if (!$.isArray(data) || data.length == 0) return;
		
		$this.items.length = 0;

		var Olis = $($this.oDiv).find('li');
		
		
	    if(data.length < Olis.length){
			
			for(var k=data.length;k<Olis.length;k++){
				   $(Olis[k]).remove();
			}		
			
		}else if(data.length > Olis.length){
			var liTemplate = Olis[0]
			var oUl = $($this.oDiv).find('ul')
			for(var j=0;j<(data.length-Olis.length);j++){
				$(liTemplate).clone(true).appendTo(oUl)
			}
		}
        
        Olis = $($this.oDiv).find('li');
        
		for (var i = 0; i < data.length; i++) {
			var item = {
				pk: data[i].pk,
				name: data[i].name
			}
			$this.items.push(item)
			Olis[i].item = item;
			Olis[i].innerHTML = data[i]['name']
		 }
		
	}

	$.fn.Combobox = Plugin;

})($);
/* ========================================================================
 * UUI: dialog.js v 1.0.0
 *
 * ========================================================================
 * Copyright 2015 yonyou, Inc.
 * Licensed under MIT ()
 * ======================================================================== */

/**
 * 弹出窗口
 */
+ function($) {
	$.dialog = function(op) {
      	var msgdiv = $('<div class="move-dialog "><div class="move-alert alert alert-'+op.type+' alert-dismissible"></div></div>');
        var closebtn = $('<button type="button" class="close"  aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        op.title = op.title || trans('dialog.info_dialog', '提示窗口')
		var titlediv = $('<h4>' + op.title + '</h4>');
        if(op.url){
			 var contentdiv = $('<p class="dialog_p"><iframe class="dialog_iframe" src='+op.url+'></iframe></p>')
			}else{
			 var contentdiv = $('<p style="position: absolute;top: 50px;bottom: 20px;overflow: auto;left: 30px;right: 25px;"></p>')         
			 contentdiv.append(op.msg)
        
        }
       	
        var btndiv,movable,mouseX_down,mouseY_down,mouseX_move,mouseY_move,diawidth,diaheight,tmpmove,bodywidth,bodyheight;
     
        bodywidth = window.innerWidth?window.innerWidth:document.body.clientWidth;
        bodyheight = window.innerHeight?window.innerHeight:document.body.clientHeight

		if(op.width){
       		msgdiv.css({width:op.width})
	    }else{
			msgdiv.css({width:520})
		}
	    if(op.height){
	       	msgdiv.css({height:op.height})
	    }
        msgdiv.find(".alert").append(closebtn).append(titlediv).append(contentdiv).append(btndiv)
		msgdiv.wrap("<div style='padding:5px'></div>");
        if(op.backdrop) {
          //添加遮罩层
          $(document.body).append('<div class="alert-backdrop" role="alert-dialog-backdrop"></div>');
          msgdiv.on('close.bs.alert', function(e) {
          
             $('.alert-backdrop[role="alert-dialog-backdrop"]').remove();
          });
        }
        

        msgdiv.find('[data-role="okbtn"]').on('click.alert.ok', op.okfn);
        
        if(op.cancelfn && typeof op.cancelfn == 'function'){
        	
           msgdiv.find('[data-role="cancelbtn"]').on('click', op.cancelfn);
           msgdiv.find('[aria-hidden="true"]').on('click', op.cancelfn);
        	
        }
       

        msgdiv.css('z-index',99);
       
       
		
				
	
		
		closebtn.on("click",function(){			
        	$.removeDialog()
        }) 
		if(op.movable){								
        	msgdiv.on("mousedown.dialog",function(e){
        		diawidth = msgdiv[0].clientWidth,diaheight = msgdiv[0].clientHeight;
	        	mouseX_down = e.clientX - msgdiv.position().left 
	        	mouseY_down = e.clientY - msgdiv.position().top
				//调整同时调整宽度高度
				if(mouseX_move < 11 && mouseY_move < 12){
	    		//左上角
	    			
					msgdiv_change()
	    			movable = 9;
	    			msgdiv.css({cursor: "se-resize"})
	    		
	    		}else if(mouseX_move > (diawidth - 20)  && mouseY_move > (diaheight- 10)){
	    		//右下角
	    			
					msgdiv_change()
	    			movable = 8;
	    			msgdiv.css({cursor: "se-resize"})
	    		}else if(mouseX_move < 11 && mouseY_move > (diaheight- 10)){
	    		//左下角
	    			
					msgdiv_change()
	    			movable = 7;
	    			msgdiv.css({cursor: "ne-resize"})
	    		}else if( mouseX_move > (diawidth - 20) && mouseY_move < 12 ){
	    		//右上角
	    			
					msgdiv_change()
	    			movable = 6;
	    			msgdiv.css({cursor: "ne-resize"})
	    		//调整窗口宽度	
	    		}else if(mouseX_move < 12 ){
					
					msgdiv_change()
					movable = 5;
					msgdiv.css({cursor: "e-resize"})
	    		
	    		}else if(mouseX_move > (diawidth - 20)){
	    			
					msgdiv_change()
					movable = 4;
					msgdiv.css({cursor: "e-resize"})
	    		//调整窗口高度	
	    		}else if(mouseY_move < 11 ){
	    			
	    			movable = 3;
	    			msgdiv_change()
	    			msgdiv.css({cursor: "n-resize"})
	    		
	    		}else if(mouseY_move > (diaheight- 10) ){
	    			
	    			movable = 2;
	    			msgdiv_change()
	    			msgdiv.css({cursor: "n-resize"})
	    		//移动窗口	
	    		}else if(e.target.nodeName == 'H4'){
	    			movable = 1;
	    			msgdiv_move();
	    			msgdiv.css({cursor: "auto"})
	    		}
        		
        	})
			$(document).on("mousemove.dialog",function(e){
				diawidth = msgdiv[0].clientWidth,diaheight = msgdiv[0].clientHeight;
        		mouseX_move = (e.clientX - msgdiv.position().left)
        		mouseY_move = (e.clientY - msgdiv.position().top)
        		if(movable == 1){       			
	        		msgdiv.css({left:e.clientX-mouseX_down,top:e.clientY-mouseY_down,cursor: "all-scroll"})
	        		return
        		}else if(movable == 2){
        			msgdiv.css({bottom:bodyheight - e.clientY -20 })        			
	        		return
        		}else if(movable == 3){
        			  msgdiv.css({top:e.clientY -20 })   			
	        		return
        		}else if(movable == 4){
        			
        			msgdiv.css({right:bodywidth- e.clientX -20 })   
	        		return
	        	}else if(movable == 5){
        			msgdiv.css({left:e.clientX -20 })
	        		return
        		}else if(movable == 6){
        			msgdiv.css({top:e.clientY -20,right:bodywidth- e.clientX -20 })  
	        		return
				}else if(movable == 7){
        			msgdiv.css({left:e.clientX -20,bottom:bodyheight - e.clientY -20 })  
	        		return
				}else if(movable == 8){
        			msgdiv.css({bottom:bodyheight - e.clientY -20,right:bodywidth- e.clientX -20 })  
	        		return
        		}else if(movable == 9){
        			msgdiv.css({top:e.clientY -20,left:e.clientX -20 })  
	        		return

        		}else{
        			if((mouseX_move < 11 && mouseY_move < 12)||(mouseX_move > (diawidth - 20)  && mouseY_move > (diaheight- 10)) ){
	        			msgdiv.css({cursor: "se-resize"})
	        		}else if((mouseX_move < 11 && mouseY_move > (diaheight- 10))||(mouseX_move > (diawidth - 20)  && mouseY_move < 12) ){
	        			msgdiv.css({cursor: "ne-resize"})
	        		}else if( mouseX_move < 12 || mouseX_move > (diawidth - 20) ){
        				msgdiv.css({cursor: "e-resize"})
	        		}else if(mouseY_move < 11 || mouseY_move > (diaheight- 10) ){
	        			msgdiv.css({cursor: "n-resize"})
	        		}else {
	        			msgdiv.css({cursor: "auto"})
	        		}
        		}
        	})
        	$(document).on("mouseup.dialog",function(){       		
        		movable = false;
        		msgdiv.css({cursor: "auto"});
        	})
        
        } 
		function msgdiv_resize(){
			diawidth = msgdiv[0].clientWidth,diaheight = msgdiv[0].clientHeight;
			
			msgdiv.css({margin:"0px",
				left:(bodywidth - diawidth)/2, 
				top:(bodyheight - diaheight)/2
			})
		}
		function msgdiv_move(){
			msgdiv.css({width:msgdiv[0].clientWidth,height:msgdiv[0].clientHeight})
		}
		function msgdiv_change(){
			diawidth = msgdiv[0].clientWidth,diaheight = msgdiv[0].clientHeight;
			
			msgdiv.css({width:"auto",height:"auto",
						left:msgdiv.offset().left, 
						top:msgdiv.offset().top,
						right:bodywidth- msgdiv.offset().left - diawidth, 
						bottom:bodyheight - msgdiv.offset().top - diaheight
			})
		}
		$(document.body).append(msgdiv);
		msgdiv_resize();
		
    }
	$.removeDialog = function(){
		 var tmp;
      	(tmp = $('.move-dialog ')).length && tmp.remove();
		(tmp = $('.alert-backdrop')).length && tmp.remove(); 
		$(document).off('mousemove.dialog').off('mouseup.dialog')		
	}

}($)
/**
 *  日期格式处理类，从moment.js简化而来
 *  thanks moment.js : https://github.com/moment/moment/
 */

+ (function(undefined, $) {
    /************************************
        Constants
    ************************************/
    var moment,
        // the global-scope this is NOT the global object in Node.js
        globalScope = (typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window)) ? global : this,
        oldGlobalMoment,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,
        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYY|YY|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-', '15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            M : 'month',
            y : 'year',
            e : 'weekday'
        },

        // format function strings
        formatFunctions = {},

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            w    : function () {
                return this.week();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            e : function () {
                return this.weekday();
            },
            a    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            Z    : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            x    : function () {
                return this.valueOf();
            },
            X    : function () {
                return this.unix();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'],

        updateInProgress = false;

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // thie is not supposed to happen
            return hour;
        }
    }

    /************************************
        Constructors
    ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }
        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }
        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            addOrSubtractDurationFromMoment(this, val, period, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, val ,period, isAdding) {
        if (normalizeUnits(period) == 'millisecond') {
            mom._d.setTime(+mom._d + val * isAdding);
        }
        else if (normalizeUnits(period) == 'second') {
            mom._d.setTime(+mom._d + val*1000 * isAdding);
        }
        else if (normalizeUnits(period) == 'minute') {
            mom._d.setTime(+mom._d + val*60000 * isAdding);
        }
        else if (normalizeUnits(period) == 'hour') {
            mom._d.setTime(+mom._d + val*3600000 * isAdding);
        }
        else if (normalizeUnits(period) == 'day') {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + val * isAdding);
        }
        else if (normalizeUnits(period) == 'week') {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + val * 7 * isAdding);
        }
        else if (normalizeUnits(period) == 'month') {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + val * isAdding);
        }
        else if (normalizeUnits(period) == 'year'){
            rawMonthSetter(mom, rawGetter(mom, 'Month') + val * 12 * isAdding);
        }
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                    (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                                           m._a[SECOND] !== 0 ||
                                           m._a[MILLISECOND] !== 0)) ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        return locales[name];
    }
    // Return a moment from input, that is local/utc/utcOffset equivalent to
    // model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || $.isDate(input) ?
                    +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {
        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LTS : 'h:mm:ss A',
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },

        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        ordinal : function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',
        _ordinalParse : /\d{1,2}/,

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: '',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
        Formatting
    ************************************/
    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'YYYY':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'S':
            if (strict) {
                return parseTokenOneDigit;
            }
            break;
            /* falls through */
        case 'SS':
            if (strict) {
                return parseTokenTwoDigits;
            }
            break;
        case 'MMM':
        case 'MMMM':
        case 'dd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return config._locale._meridiemParse;
        case 'x':
            return parseTokenOffsetMs;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', ''))));
            return a;
        }
    }

    function utcOffsetFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = config._locale.monthsParse(input, token, config._strict);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(
                            input.match(/\d{1,2}/)[0], 10));
            }
            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = toInt(input) + (toInt(input) > 68 ? 1900 : 2000)
            break;
        case 'YYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._meridiem = input;
            // config._isPm = config._locale.isPM(input);
            break;
        // HOUR
        case 'h' : // fall through to hh
        case 'hh' :
            config._pf.bigHour = true;
            break;
            /* falls through */
        case 'H' : // fall through to HH
        case 'HH' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'x':
            config._d = new Date(toInt(input));
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = utcOffsetFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            break;
        }
    }
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }
        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;
        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];
        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }
        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR],
                config._meridiem);
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i]));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if ($.isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if ($.isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }
    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }
    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if ($.isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();
        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!$.isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d - ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if ('function' === typeof Date.prototype.toISOString) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function (keepLocalTime) {
            return this.utcOffset(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.utcOffset(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.subtract(this._dateUtcOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (that.utcOffset() - this.utcOffset()) * 6e4,
                anchor, diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                output = monthDiff(this, that);
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = this - that;
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        calendar : function (time) {
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
               
                /* falls through */
            case 'month':
                this.date(1);
               
                /* falls through */
            case 'week':
            case 'day':
                this.hours(0);
                
                /* falls through */
            case 'hour':
                this.minutes(0);
                
                /* falls through */
            case 'minute':
                this.seconds(0);
                
                /* falls through */
            case 'second':
                this.milliseconds(0);
                
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, units).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isBetween: function (from, to, units) {
            return this.isAfter(from, units) && this.isBefore(to, units);
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
                 'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        zone : deprecate(
                'moment().zone is deprecated, use moment().utcOffset instead. ' +
                'https://github.com/moment/moment/issues/1779',
                function (input, keepLocalTime) {
                    if (input != null) {
                        if (typeof input !== 'string') {
                            input = -input;
                        }

                        this.utcOffset(input, keepLocalTime);

                        return this;
                    } else {
                        return -this.utcOffset();
                    }
                }
        ),

        utcOffset : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = utcOffsetFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateUtcOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.add(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                input - offset, 'm',false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        this._changeInProgress = null;
                    }
                }

                return this;
            } else {
                return this._isUTC ? offset : this._dateUtcOffset();
            }
        },

        isLocal : function () {
            return !this._isUTC;
        },

        isUtcOffset : function () {
            return this._isUTC;
        },

        isUtc : function () {
            return this._isUTC && this._offset === 0;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone : function () {
            if (this._tzm) {
                this.utcOffset(this._tzm);
            } else if (typeof this._i === 'string') {
                this.utcOffset(utcOffsetFromString(this._i));
            }
            return this;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            var unit;
            if (typeof units === 'object') {
                for (unit in units) {
                    this.set(unit, units[unit]);
                }
            }
            else {
                units = normalizeUnits(units);
                if (typeof this[units] === 'function') {
                    this[units](value);
                }
            }
            return this;
        },

        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateUtcOffset : function () {
            return -Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }

    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;
        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    // alias isUtc for dev-friendliness
    moment.fn.isUTC = moment.fn.isUtc;


    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // moment.js locale configuration
// locale : afrikaans (af)
// author : Werner Mollentze : https://github.com/wernerm

(function (factory) {
    factory(moment);
}(function (moment) {
    return moment.defineLocale('af', {
        months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
        monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
        weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
        weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
        weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
        meridiemParse: /vm|nm/i,
        isPM : function (input) {
            return /^nm$/i.test(input);
        },
        meridiem : function (hours, minutes, isLower) {
            if (hours < 12) {
                return isLower ? 'vm' : 'VM';
            } else {
                return isLower ? 'nm' : 'NM';
            }
        },
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'LT:ss',
            L : 'DD/MM/YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY LT',
            LLLL : 'dddd, D MMMM YYYY LT'
        },
        calendar : {
            sameDay : '[Vandag om] LT',
            nextDay : '[Môre om] LT',
            nextWeek : 'dddd [om] LT',
            lastDay : '[Gister om] LT',
            lastWeek : '[Laas] dddd [om] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'oor %s',
            past : '%s gelede',
            s : '\'n paar sekondes',
            m : '\'n minuut',
            mm : '%d minute',
            h : '\'n uur',
            hh : '%d ure',
            d : '\'n dag',
            dd : '%d dae',
            M : '\'n maand',
            MM : '%d maande',
            y : '\'n jaar',
            yy : '%d jaar'
        },
        ordinalParse: /\d{1,2}(ste|de)/,
        ordinal : function (number) {
            return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
        },
        week : {
            dow : 1, // Maandag is die eerste dag van die week.
            doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
        }
    });
}));
// moment.js locale configuration
// locale : chinese (zh-cn)
// author : suupic : https://github.com/suupic
// author : Zeno Zeng : https://github.com/zenozeng

(function (factory) {
    factory(moment);
}(function (moment) {
    return moment.defineLocale('zh-cn', {
        months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
        monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
        weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
        weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
        weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
        longDateFormat : {
            LT : 'Ah点mm',
            LTS : 'Ah点m分s秒',
            L : 'YYYY-MM-DD',
            LL : 'YYYY年MMMD日',
            LLL : 'YYYY年MMMD日LT',
            LLLL : 'YYYY年MMMD日ddddLT',
            l : 'YYYY-MM-DD',
            ll : 'YYYY年MMMD日',
            lll : 'YYYY年MMMD日LT',
            llll : 'YYYY年MMMD日ddddLT'
        },
        meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
        meridiemHour: function (hour, meridiem) {
            if (hour === 12) {
                hour = 0;
            }
            if (meridiem === '凌晨' || meridiem === '早上' ||
                    meridiem === '上午') {
                return hour;
            } else if (meridiem === '下午' || meridiem === '晚上') {
                return hour + 12;
            } else {
                // '中午'
                return hour >= 11 ? hour : hour + 12;
            }
        },
        meridiem : function (hour, minute, isLower) {
            var hm = hour * 100 + minute;
            if (hm < 600) {
                return '凌晨';
            } else if (hm < 900) {
                return '早上';
            } else if (hm < 1130) {
                return '上午';
            } else if (hm < 1230) {
                return '中午';
            } else if (hm < 1800) {
                return '下午';
            } else {
                return '晚上';
            }
        },
        calendar : {
            sameDay : function () {
                return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
            },
            nextDay : function () {
                return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
            },
            lastDay : function () {
                return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
            },
            nextWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            lastWeek : function () {
                var startOfWeek, prefix;
                startOfWeek = moment().startOf('week');
                prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
                return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
            },
            sameElse : 'LL'
        },
        ordinalParse: /\d{1,2}(日|月|周)/,
        ordinal : function (number, period) {
            switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
            }
        },
        relativeTime : {
            future : '%s内',
            past : '%s前',
            s : '几秒',
            m : '1分钟',
            mm : '%d分钟',
            h : '1小时',
            hh : '%d小时',
            d : '1天',
            dd : '%d天',
            M : '1个月',
            MM : '%d个月',
            y : '1年',
            yy : '%d年'
        },
        week : {
            // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
            dow : 1, // Monday is the first day of the week.
            doy : 4  // The week that contains Jan 4th is the first week of the year.
        }
    });
}));

    moment.locale('en');
    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        globalScope  =window;
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    'Accessing Moment through the global scope is ' +
                    'deprecated, and will be removed in an upcoming ' +
                    'release.',
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // 引起fis问题修改
    makeGlobal();

}).call(this, undefined, $);

/* ========================================================================
 * UUI: datetimepicker.js
 *
 * ========================================================================
 * Copyright 2015 yonyou, Inc.
 * thanks: https://github.com/Eonasdan/bootstrap-datetimepicker 
 * ======================================================================== */

+function($,moment ) {	
    'use strict';
    if (typeof Array.prototype.reduce != "function") {
	  Array.prototype.reduce = function (callback, initialValue ) {
	     var previous = initialValue, k = 0, length = this.length;
	     if (typeof initialValue === "undefined") {
	        previous = this[0];
	        k = 1;
	     }
	     
	    if (typeof callback === "function") {
	      for (k; k < length; k++) {
	         this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
	      }
	    }
	    return previous;
	  };
	}
    if($.app){
		$.fn.datetimepicker = function(params){
				var params = params ? params : {}; 
			    var tmpv,today,tmpformat,tmpcol,tmptype;
                if($(this).data('create')){
                    return;
                }else{
                    $(this).data('create',true)
                }
				tmpv = $(this).find("input").val()				
				if(tmpv){
					tmpv = $.getPickerArray(tmpv)
				}else{
					today = new Date();
					tmpv = [ today.getFullYear(),today.getMonth(), today.getDate(),(today.getHours() < 10 ? '0' + today.getHours() : today.getHours()),(today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes())]	
				}
				tmptype = params.picker_type?params.picker_type:"datetime"
					
				if(tmptype== "datetime"){
					tmpformat = function (p, values, displayValues) {
		                return values[0] + '-' + values[1] + '-' + values[2] + ' ' +  values[3] + ':' + values[4] ;
		        	}
					tmpcol = [
		                // Years
			                {
			                    values: (function () {
			                        var arr = [];
			                        for (var i = 1950; i <= 2030; i++) { arr.push(i); }
			                        return arr;
			                    })(),
			                    textAlign: 'left',
			                    width:100
			                },
			                 {
					            divider: true,
					            content: '-'
					        },
			                // Months
			                {
			                    values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),			                    			                  
			                    textAlign: 'left'
			                },
			                 {
					            divider: true,
					            content: '-'
					        },
			                // Days
			                {
			                    values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
			                 	textAlign: 'left'
			                },
			                 // Space divider
					        {
					            divider: true,
					            content: '  '
					        },
					        // Hours
					        {
					            values: (function () {
					                var arr = [];
					                for (var i = 0; i <= 23; i++) { arr.push(i < 10 ? '0' + i : i); }
					                return arr;
					            })()
					        },
					        // Divider
					        {
					            divider: true,
					            content: ':'
					        },
					        // Minutes
					        {
					            values: (function () {
					                var arr = [];
					                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
					                return arr;
					            })()
					        }
			                
			             ]   
				}else{
					tmpformat = function (p, values, displayValues) {
		                return values[0] + '-' + values[1] + '-' + values[2] ;
		        	}
					tmpcol = [
		                // Years
			                {
			                    values: (function () {
			                        var arr = [];
			                        for (var i = 1950; i <= 2030; i++) { arr.push(i); }
			                        return arr;
			                    })(),
			                    textAlign: 'left',
			                    width:100
			                },
			                 {
					            divider: true,
					            content: '-'
					        },
			                // Months
			                {
			                   
			                    values: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' '),			                  
			                    textAlign: 'left'
			                },
			                 {
					            divider: true,
					            content: '-'
					        },
			                // Days
			                {
			                    values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
			                 	textAlign: 'left'
			                }
								                
						]  
					
				}
				
		       
		        $(this).addClass("moblie_input").find("input").attr("readonly","readonly")
		        $('#picker-date-container').html("")
		        $.app.picker_mobile({
		            input:this,
		            convertToPopover:false,
		            cssClass:params.cssClass,
		            toolbar:true,
		            refer:params.refer,
		            //container: '#picker-date-container',		            
		            rotateEffect: true,		         
		            value: tmpv,	         
		            formatValue: tmpformat,
		            cols:tmpcol,
		            pickerType:tmptype
		        });        
		        
		}

        $("[data-provide='datetimepicker']").each(function(i,node){
            $(node).datetimepicker();
        });



     	return;
	}
    if (!moment) {
        throw new Error('datetimepicker requires Moment.js to be loaded first');
    }
    var inputSelector = 'input,div[contenteditable=true]'

    var dateTimePicker = function (element, options) {
        var picker = {},
            date = moment().startOf('d'),
            viewDate = date.clone(),
            unset = true,
            input,
            component = false,
            widget = false,
            use24Hours,
            minViewModeNumber = 0,
            actualFormat,
            parseFormats,
            currentViewMode,
            datePickerModes = [
                {
                    clsName: 'days',
                    navFnc: 'M',
                    navStep: 1
                },
                {
                    clsName: 'months',
                    navFnc: 'y',
                    navStep: 1
                },
                {
                    clsName: 'years',
                    navFnc: 'y',
                    navStep: 10
                }
            ],
            viewModes = ['days', 'months', 'years'],
            verticalModes = ['top', 'bottom', 'auto'],
            horizontalModes = ['left', 'right', 'auto'],
            toolbarPlacements = ['default', 'top', 'bottom'],
            /********************************************************************************
             *
             * Private functions
             *
             ********************************************************************************/
            isEnabled = function (granularity) {
                if (typeof granularity !== 'string' || granularity.length > 1) {
                    throw new TypeError('isEnabled expects a single character string parameter');
                }
                switch (granularity) {
                    case 'y':
                        return actualFormat.indexOf('Y') !== -1;
                    case 'M':
                        return actualFormat.indexOf('M') !== -1;
                    case 'd':
                        return actualFormat.toLowerCase().indexOf('d') !== -1;
                    case 'h':
                    case 'H':
                        return actualFormat.toLowerCase().indexOf('h') !== -1;
                    case 'm':
                        return actualFormat.indexOf('m') !== -1;
                    case 's':
                        return actualFormat.indexOf('s') !== -1;
                    default:
                        return false;
                }
            },

            hasTime = function () {
                return (isEnabled('h') || isEnabled('m') || isEnabled('s'));
            },

            hasDate = function () {
                return (isEnabled('y') || isEnabled('M') || isEnabled('d'));
            },

            getDatePickerTemplate = function () {
                var headTemplate = $('<thead>')
                        .append($('<tr>')
                            .append($('<th>').addClass('prev').attr('data-action', 'previous')
                                .append($('<span>').addClass(options.icons.previous))
                                )
                            .append($('<th>').addClass('picker-switch').attr('data-action', 'pickerSwitch').attr('colspan', '5'))
                            .append($('<th>').addClass('next').attr('data-action', 'next')
                                .append($('<span>').addClass(options.icons.next))
                                )
                            ),
                    contTemplate = $('<tbody>')
                        .append($('<tr>').append($('<td>').attr('colspan', '7')));
                return [
                    $('<div>').addClass('datepicker-days')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate)
                            .append($('<tbody>'))
                            ),
                    $('<div>').addClass('datepicker-months')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            ),
                    $('<div>').addClass('datepicker-years')
                        .append($('<table>').addClass('table-condensed')
                            .append(headTemplate.clone())
                            .append(contTemplate.clone())
                            )
                ];
            },

            getTimePickerMainTemplate = function () {
                var topRow = $('<tr>'),
                    middleRow = $('<tr>'),
                    bottomRow = $('<tr>');

                if (isEnabled('h')) {
                    topRow.append($('<td>')
                        .append($('<a>').attr({ tabindex: '-1'}).addClass('btn').attr('data-action', 'incrementHours')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-hour').attr('data-time-component', 'hours').attr('data-action', 'showHours')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({ tabindex: '-1'}).addClass('btn').attr('data-action', 'decrementHours')
                            .append($('<span>').addClass(options.icons.down))));
                }
                if (isEnabled('m')) {
                    if (isEnabled('h')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr({ tabindex: '-1'}).addClass('btn').attr('data-action', 'incrementMinutes')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-minute').attr('data-time-component', 'minutes').attr('data-action', 'showMinutes')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({ tabindex: '-1'}).addClass('btn').attr('data-action', 'decrementMinutes')
                            .append($('<span>').addClass(options.icons.down))));
                }
                if (isEnabled('s')) {
                    if (isEnabled('m')) {
                        topRow.append($('<td>').addClass('separator'));
                        middleRow.append($('<td>').addClass('separator').html(':'));
                        bottomRow.append($('<td>').addClass('separator'));
                    }
                    topRow.append($('<td>')
                        .append($('<a>').attr({ tabindex: '-1'}).addClass('btn').attr('data-action', 'incrementSeconds')
                            .append($('<span>').addClass(options.icons.up))));
                    middleRow.append($('<td>')
                        .append($('<span>').addClass('timepicker-second').attr('data-time-component', 'seconds').attr('data-action', 'showSeconds')));
                    bottomRow.append($('<td>')
                        .append($('<a>').attr({ tabindex: '-1'}).addClass('btn').attr('data-action', 'decrementSeconds')
                            .append($('<span>').addClass(options.icons.down))));
                }

                if (!use24Hours) {
                    topRow.append($('<td>').addClass('separator'));
                    middleRow.append($('<td>')
                        .append($('<button>').addClass('btn btn-primary').attr('data-action', 'togglePeriod')));
                    bottomRow.append($('<td>').addClass('separator'));
                }

                return $('<div>').addClass('timepicker-picker')
                    .append($('<table>').addClass('table-condensed')
                        .append([topRow, middleRow, bottomRow]));
            },

            getTimePickerTemplate = function () {
                var hoursView = $('<div>').addClass('timepicker-hours')
                        .append($('<table>').addClass('table-condensed')),
                    minutesView = $('<div>').addClass('timepicker-minutes')
                        .append($('<table>').addClass('table-condensed')),
                    secondsView = $('<div>').addClass('timepicker-seconds')
                        .append($('<table>').addClass('table-condensed')),
                    ret = [getTimePickerMainTemplate()];

                if (isEnabled('h')) {
                    ret.push(hoursView);
                }
                if (isEnabled('m')) {
                    ret.push(minutesView);
                }
                if (isEnabled('s')) {
                    ret.push(secondsView);
                }

                return ret;
            },

            getToolbar = function () {
                var row = [];
                if (options.showTodayButton) {
                    row.push($('<td>').append($('<a>').attr('data-action', 'today').attr('title', '当前时间').append($('<span>').addClass(options.icons.today))));
                }
                if (!options.sideBySide && hasDate() && hasTime()) {
                    row.push($('<td>').append($('<a>').attr('data-action', 'togglePicker').attr('title', '时间选择').append($('<span>').addClass(options.icons.time))));
                }
                if (options.showClear) {
                    row.push($('<td>').append($('<a>').attr('data-action', 'clear').attr('title', '清除当前选择').append($('<span>').addClass(options.icons.clear))));
                }
                return $('<table>').addClass('table-condensed').append($('<tbody>').append($('<tr>').append(row)));
            },

            getTemplate = function () {
                var template = $('<div>').addClass('bootstrap-datetimepicker-widget dropdown-menu'),
                    dateView = $('<div>').addClass('datepicker').append(getDatePickerTemplate()),
                    timeView = $('<div>').addClass('timepicker').append(getTimePickerTemplate()),
                    content = $('<ul>').addClass('list-unstyled'),
                    toolbar = $('<li>').addClass('picker-switch accordion-toggle').append(getToolbar());

                if (use24Hours) {
                    template.addClass('usetwentyfour');
                }
                if (options.sideBySide && hasDate() && hasTime()) {
                    template.addClass('timepicker-sbs');
                    template.append(
                        $('<div>').addClass('row')
                            .append(dateView.addClass('col-sm-6'))
                            .append(timeView.addClass('col-sm-6'))
                    );
                    template.append(toolbar);
                    return template;
                }

                if (hasDate()) {
                    content.append($('<li>').addClass((hasTime() ? 'collapse in' : '')).append(dateView));
                }
                content.append(toolbar);
                if (hasTime()) {
                    content.append($('<li>').addClass((hasDate() ? 'collapse' : '')).append(timeView));
                }

                return template.append(content);
            },

            dataToOptions = function () {
                var eData,
                    dataOptions = {};

                if (element.is(inputSelector)) {
                    eData = element.data();
                } else {
                    eData = element.find(inputSelector).data();
                }

                if (eData.dateOptions && eData.dateOptions instanceof Object) {
                    dataOptions = $.extend(true, dataOptions, eData.dateOptions);
                }

                $.each(options, function (key) {
                    var attributeName = 'date' + key.charAt(0).toUpperCase() + key.slice(1);
                    if (eData[attributeName] !== undefined) {
                        dataOptions[key] = eData[attributeName];
                    }
                });
                return dataOptions;
            },

            place = function () {
                var position = (component || element).position(),
                    offset = (component || element).offset(),
                    vertical = 'auto',
                    horizontal = 'auto',
                    parent;

                if (options.widgetParent) {
                	
                    parent = options.widgetParent.append(widget);
                    
                } else if (element.is(inputSelector)) {
                    parent = element.parent().append(widget);
                } else {
                    parent = element;
                    element.children().first().after(widget);
                }

                // Top and bottom logic
                if (offset.top + widget.height() * 1.5 >= $(window).height() + $(window).scrollTop() &&
                    widget.height() + element.outerHeight() < offset.top) {
                    vertical = 'top';
                } else {
                    vertical = 'bottom';
                }

                // Left and right logic
                if (parent.width() < offset.left + widget.outerWidth() / 2 &&
                    offset.left + widget.outerWidth() > $(window).width()) {
                    horizontal = 'right';
                } else {
                    horizontal = 'left';
                }

                if (vertical === 'top') {
                    widget.addClass('top').removeClass('bottom');
                } else {
                    widget.addClass('bottom').removeClass('top');
                }

                if (horizontal === 'right') {
                    widget.addClass('pull-right');
                } else {
                    widget.removeClass('pull-right');
                }

                // find the first parent element that has a relative css positioning
                
                if (parent.css('position') !== 'relative' && parent[0].nodeName !==  "BODY") {
                	
                    parent = parent.parents().filter(function () {
                        return $(this).css('position') === 'relative';
                    }).first();
                    if(parent.length === 0){
                    parent = $("body")	;
                    }
                }
				
                if (parent.length === 0) {
                    throw new Error('datetimepicker component should be placed within a relative positioned container');
                }
				
                widget.css({
                    top: vertical === 'top' ? 'auto' : position.top + element.outerHeight(),
                    bottom: vertical === 'top' ? position.top + element.outerHeight() : 'auto',
                    left: horizontal === 'left' ? parent.css('padding-left') : 'auto',
                    right: horizontal === 'left' ? 'auto' : parent.width() - element.outerWidth()
                });
                if(options.widgetParent){
                	if(vertical === 'top'){
		                widget.css({	
		                	top:  element.offset().top - widget.outerHeight(),                  
		                    left: element.offset().left,
		                    bottom: 'auto',
		                    right:'auto'
		                 });
		             }else{
		             	widget.css({	
		                	top:  element.offset().top + element.outerHeight(),                  
		                    left: element.offset().left,
		                    bottom: 'auto',
		                    right:'auto'
		                 });
		             	
		             }
                }
//				//查询模板拓展
//				if(options.afterShow){
//					options.afterShow(widget,component || element);
//				}
            },

            notifyEvent = function (e) {
                if (e.type === 'dp.change' && ((e.date && e.date.isSame(e.oldDate)) || (!e.date && !e.oldDate))) {
                    return;
                }
                element.trigger(e);
            },

            showMode = function (dir) {
                if (!widget) {
                    return;
                }
                if (dir) {
                    currentViewMode = Math.max(minViewModeNumber, Math.min(2, currentViewMode + dir));
                }
                widget.find('.datepicker > div').hide().filter('.datepicker-' + datePickerModes[currentViewMode].clsName).show();
            },
		//星期排序
           fillDow = function () {
                var row = $('<tr>'),
                    currentDate = viewDate.clone().startOf('w').subtract(1, 'd');

                while (currentDate.isBefore(viewDate.clone().endOf('w').subtract(1, 'd'))) {
					
                    row.append($('<th>').addClass('dow').text(currentDate.format('dd')));
                    currentDate.add(1, 'd');
                }
                widget.find('.datepicker-days thead').append(row);
            },

            isValid = function (targetMoment, granularity) {
                if (!targetMoment.isValid()) {
                    return false;
                }
                if (options.minDate && targetMoment.isBefore(options.minDate, granularity)) {
                    return false;
                }
                if (options.maxDate && targetMoment.isAfter(options.maxDate, granularity)) {
                    return false;
                }
                return true;
            },

            fillMonths = function () {
                var spans = [],
                    monthsShort = viewDate.clone().startOf('y').hour(12); // hour is changed to avoid DST issues in some browsers
                while (monthsShort.isSame(viewDate, 'y')) {
                    spans.push($('<span>').attr('data-action', 'selectMonth').addClass('month').text(monthsShort.format('MMM')));
                    monthsShort.add(1, 'M');
                }
                widget.find('.datepicker-months td').empty().append(spans);
            },

            updateMonths = function () {
                var monthsView = widget.find('.datepicker-months'),
                    monthsViewHeader = monthsView.find('th'),
                    months = monthsView.find('tbody').find('span');

                monthsView.find('.disabled').removeClass('disabled');

                if (!isValid(viewDate.clone().subtract(1, 'y'), 'y')) {
                    monthsViewHeader.eq(0).addClass('disabled');
                }

                monthsViewHeader.eq(1).text(viewDate.year());

                if (!isValid(viewDate.clone().add(1, 'y'), 'y')) {
                    monthsViewHeader.eq(2).addClass('disabled');
                }

                months.removeClass('active');
                if (date.isSame(viewDate, 'y')) {
                    months.eq(date.month()).addClass('active');
                }

                months.each(function (index) {
                    if (!isValid(viewDate.clone().month(index), 'M')) {
                        $(this).addClass('disabled');
                    }
                });
            },

            updateYears = function () {
                var yearsView = widget.find('.datepicker-years'),
                    yearsViewHeader = yearsView.find('th'),
                    startYear = viewDate.clone().subtract(5, 'y'),
                    endYear = viewDate.clone().add(6, 'y'),
                    html = '';

                yearsView.find('.disabled').removeClass('disabled');

                if (options.minDate && options.minDate.isAfter(startYear, 'y')) {
                    yearsViewHeader.eq(0).addClass('disabled');
                }

                yearsViewHeader.eq(1).text(startYear.year() + '-' + endYear.year());

                if (options.maxDate && options.maxDate.isBefore(endYear, 'y')) {
                    yearsViewHeader.eq(2).addClass('disabled');
                }

                while (!startYear.isAfter(endYear, 'y')) {
                    html += '<span data-action="selectYear" class="year' + (startYear.isSame(date, 'y') ? ' active' : '') + (!isValid(startYear, 'y') ? ' disabled' : '') + '">' + startYear.year() + '</span>';
                    startYear.add(1, 'y');
                }

                yearsView.find('td').html(html);
            },

            fillDate = function () {
            	
                var daysView = widget.find('.datepicker-days'),
                    daysViewHeader = daysView.find('th'),
                    currentDate,
                    endDate,
                    html = [],
                    row,
                    
                    clsName;

                if (!hasDate()) {
                    return;
                }

                daysView.find('.disabled').removeClass('disabled');
                daysViewHeader.eq(1).text(viewDate.format('YYYY MMMM'));

                if (!isValid(viewDate.clone().subtract(1, 'M'), 'M')) {
                    daysViewHeader.eq(0).addClass('disabled');
                }
                if (!isValid(viewDate.clone().add(1, 'M'), 'M')) {
                    daysViewHeader.eq(2).addClass('disabled');
                }
				//调整星期顺序
                currentDate = viewDate.clone().startOf('M').startOf('week').subtract(1, 'day');
				if(viewDate.clone().startOf('M').weekday() == 6){
					currentDate =  viewDate.clone().startOf('M')
				}
				endDate = viewDate.clone().endOf('M').endOf('w').subtract(1, 'day');

				if(viewDate.clone().endOf('M').weekday() == 6){
					endDate =  endDate.add(1, 'w')
				}
			
                while (!endDate.isBefore(currentDate, 'd')) {
                    if (currentDate.weekday() === 6) {						
                        row = $('<tr>');
                        html.push(row);
                    }
                    clsName = '';
                    if (currentDate.isBefore(viewDate, 'M')) {
                        clsName += ' old';
                    }
                    if (currentDate.isAfter(viewDate, 'M')) {
                        clsName += ' new';
                    }
                    if (currentDate.isSame(date, 'd') && !unset) {
                        clsName += ' active';
                    }
                    if (!isValid(currentDate, 'd')) {
                        clsName += ' disabled';
                    }
                    if (currentDate.isSame(moment(), 'd')) {
                        clsName += ' today';
                    }
                    if (currentDate.day() === 0 || currentDate.day() === 6) {
                        clsName += ' weekend';
                    }
                    row.append('<td data-action="selectDay" class="day' + clsName + '">' + currentDate.date() + '</td>');
                    currentDate.add(1, 'd');
                }

                daysView.find('tbody').empty().append(html);

                updateMonths();

                updateYears();
            },

            fillHours = function () {
                var table = widget.find('.timepicker-hours table'),
                    currentHour = viewDate.clone().startOf('d'),
                    html = [],
                    row = $('<tr>');

                if (viewDate.hour() > 11 && !use24Hours) {
                    currentHour.hour(12);
                }
                while (currentHour.isSame(viewDate, 'd') && (use24Hours || (viewDate.hour() < 12 && currentHour.hour() < 12) || viewDate.hour() > 11)) {
                    if (currentHour.hour() % 4 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectHour" class="hour' + (!isValid(currentHour, 'h') ? ' disabled' : '') + '">' + currentHour.format(use24Hours ? 'HH' : 'hh') + '</td>');
                    currentHour.add(1, 'h');
                }
                table.empty().append(html);
            },

            fillMinutes = function () {
                var table = widget.find('.timepicker-minutes table'),
                    currentMinute = viewDate.clone().startOf('h'),
                    html = [],
                    row = $('<tr>'),
                    step = 5;

                while (viewDate.isSame(currentMinute, 'h')) {
                    if (currentMinute.minute() % (step * 4) === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectMinute" class="minute' + (!isValid(currentMinute, 'm') ? ' disabled' : '') + '">' + currentMinute.format('mm') + '</td>');
                    currentMinute.add(step, 'm');
                }
                table.empty().append(html);
            },

            fillSeconds = function () {
                var table = widget.find('.timepicker-seconds table'),
                    currentSecond = viewDate.clone().startOf('m'),
                    html = [],
                    row = $('<tr>');

                while (viewDate.isSame(currentSecond, 'm')) {
                    if (currentSecond.second() % 20 === 0) {
                        row = $('<tr>');
                        html.push(row);
                    }
                    row.append('<td data-action="selectSecond" class="second' + (!isValid(currentSecond, 's') ? ' disabled' : '') + '">' + currentSecond.format('ss') + '</td>');
                    currentSecond.add(5, 's');
                }

                table.empty().append(html);
            },

            fillTime = function () {
                var timeComponents = widget.find('.timepicker span[data-time-component]');
                if (!use24Hours) {
                    widget.find('.timepicker [data-action=togglePeriod]').text(date.format('A'));
                }
                timeComponents.filter('[data-time-component=hours]').text(date.format(use24Hours ? 'HH' : 'hh'));
                timeComponents.filter('[data-time-component=minutes]').text(date.format('mm'));
                timeComponents.filter('[data-time-component=seconds]').text(date.format('ss'));

                fillHours();
                fillMinutes();
                fillSeconds();
            },

            update = function () {
                if (!widget) {
                    return;
                }
                fillDate();
                fillTime();
            },

            setValue = function (targetMoment) {
                var oldDate = unset ? null : date;

                // case of calling setValue(null or false)
                if (!targetMoment) {
                    unset = true;
                    _setInputValue(input, '');
                    element.data('date', '');
                    notifyEvent({
                        type: 'dp.change',
                        date: null,
                        oldDate: oldDate
                    });
                    update();
                    return;
                }

                targetMoment = targetMoment.clone().locale(options.locale);


                if (isValid(targetMoment)) {
                    date = targetMoment;
                    viewDate = date.clone();
                    _setInputValue(input, date.format(actualFormat));
                    element.data('date', date.format(actualFormat));
                    update();
                    unset = false;
                    notifyEvent({
                        type: 'dp.change',
                        date: date.clone(),
                        oldDate: oldDate
                    });
                } else {
//                  if (!options.keepInvalid) {
                        _setInputValue(input, unset ? '' : date.format(actualFormat));
//                  }
                    notifyEvent({
                        type: 'dp.error',
                        date: targetMoment
                    });
                }
            },

           hide = function(){
				// if(blurAble){
				var transitioning = false;
                input.trigger("change.date");
				if (!widget) {
				return picker;
				}

				// Ignore event if in the middle of a picker transition
				widget.find('.collapse').each(function () {
				var collapseData = $(this).data('collapse');
				if (collapseData && collapseData.transitioning) {
				transitioning = true;
				return false;
				}
				return true;
				});
				if (transitioning) {
				return picker;
				}
				if (component && component.hasClass('btn')) {
				component.toggleClass('active');
				}
				widget.hide();
				 
				$(window).off('resize', place);
				widget.off('mousedown', '[data-action]');
			//	widget.off('mousedown', false);
				widget.off('mouseenter');
				widget.off('mouseleave');
				widget.remove();
				widget = false;
				 
				notifyEvent({
				type: 'dp.hide',
				date: date.clone()
				});
				return picker;
				// }
			},
 
            clear = function () {
                setValue(null);
            },
 
            /********************************************************************************
             *
             * Widget UI interaction functions
             *
             ********************************************************************************/
            actions = {
                next: function () {
                    viewDate.add(datePickerModes[currentViewMode].navStep, datePickerModes[currentViewMode].navFnc);
                    fillDate();
                },
 
                previous: function () {
                    viewDate.subtract(datePickerModes[currentViewMode].navStep, datePickerModes[currentViewMode].navFnc);
                    fillDate();
                },
 
                pickerSwitch: function () {
                    showMode(1);
                },
 
                selectMonth: function (e) {
                    var month = $(e.target).closest('tbody').find('span').index($(e.target));
                    viewDate.month(month);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()).month(viewDate.month()));
                        hide();
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                },
 
                selectYear: function (e) {
                    var year = parseInt($(e.target).text(), 10) || 0;
                    viewDate.year(year);
                    if (currentViewMode === minViewModeNumber) {
                        setValue(date.clone().year(viewDate.year()));
                        hide();
                    } else {
                        showMode(-1);
                        fillDate();
                    }
                },
 
                selectDay: function (e) {
                    var day = viewDate.clone();
                    if ($(e.target).is('.old')) {
                        day.subtract(1, 'M');
                    }
                    if ($(e.target).is('.new')) {
                        day.add(1, 'M');
                    }
                    setValue(day.date(parseInt($(e.target).text(), 10)));
					input.blur();
					hide();
										   
                },
 
                incrementHours: function () {
                    setValue(date.clone().add(1, 'h'));
                },
 
                incrementMinutes: function () {
                    setValue(date.clone().add(1, 'm'));
                },
 
                incrementSeconds: function () {
                    setValue(date.clone().add(1, 's'));
                },
 
                decrementHours: function () {
                    setValue(date.clone().subtract(1, 'h'));
                },
 
                decrementMinutes: function () {
                    setValue(date.clone().subtract(1, 'm'));
                },
 
                decrementSeconds: function () {
                    setValue(date.clone().subtract(1, 's'));
                },
 
                togglePeriod: function () {
                    setValue(date.clone().add((date.hours() >= 12) ? -12 : 12, 'h'));
                },
 
                togglePicker: function (e) {
                    var $this = $(e.target),
                        $parent = $this.closest('ul'),
                        expanded = $parent.find('.in'),
                        closed = $parent.find('.collapse:not(.in)'),
                        collapseData;
 
                    if (expanded && expanded.length) {
                        collapseData = expanded.data('collapse');
                        if (collapseData && collapseData.transitioning) {
                            return;
                        }
                        if (expanded.collapse) { // if collapse plugin is available through bootstrap.js then use it
                            expanded.collapse('hide');
                            closed.collapse('show');
                        } else { // otherwise just toggle in class on the two views
                            expanded.removeClass('in');
                            closed.addClass('in');
                        }
                        if ($this.is('span')) {
                            $this.toggleClass(options.icons.time + ' ' + options.icons.date);
                        } else {
                            $this.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        }
 
                        // NOTE: uncomment if toggled state will be restored in show()
                        //if (component) {
                        //    component.find('span').toggleClass(options.icons.time + ' ' + options.icons.date);
                        //}
                    }
                },
 
                showPicker: function () {
                    widget.find('.timepicker > div:not(.timepicker-picker)').hide();
                    widget.find('.timepicker .timepicker-picker').show();
                },
 
                showHours: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-hours').show();
                },
 
                showMinutes: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-minutes').show();
                },
 
                showSeconds: function () {
                    widget.find('.timepicker .timepicker-picker').hide();
                    widget.find('.timepicker .timepicker-seconds').show();
                },
 
                selectHour: function (e) {
                    var hour = parseInt($(e.target).text(), 10);
 
                    if (!use24Hours) {
                        if (date.hours() >= 12) {
                            if (hour !== 12) {
                                hour += 12;
                            }
                        } else {
                            if (hour === 12) {
                                hour = 0;
                            }
                        }
                    }
                    setValue(date.clone().hours(hour));
                    actions.showPicker.call(picker);
                },
 
                selectMinute: function (e) {
                    setValue(date.clone().minutes(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },
 
                selectSecond: function (e) {
                    setValue(date.clone().seconds(parseInt($(e.target).text(), 10)));
                    actions.showPicker.call(picker);
                },
 
                clear: clear,
 
                today: function () {
                    setValue(moment());
                },
 
                close: hide
            },
 
            doAction = function (e) {
                if ($(e.currentTarget).is('.disabled')) {
                    return false;
                }
                actions[$(e.currentTarget).data('action')].apply(picker, arguments);
                return false;
            },
 
            show = function () {
                var currentMoment;
//                  useCurrentGranularity = {
//                      'year': function (m) {
//                          return m.month(0).date(1).hours(0).seconds(0).minutes(0);
//                      },
//                      'month': function (m) {
//                          return m.date(1).hours(0).seconds(0).minutes(0);
//                      },
//                      'day': function (m) {
//                          return m.hours(0).seconds(0).minutes(0);
//                      },
//                      'hour': function (m) {
//                          return m.seconds(0).minutes(0);
//                      },
//                      'minute': function (m) {
//                          return m.seconds(0);
//                      }
//                  };
 
                if (input.prop('disabled') || (!options.ignoreReadonly && input.prop('readonly')) 
                            || (input.prop('contenteditable') == false)
                            || widget
                            || input.closest('fieldset').prop('disabled')) {
                    return picker;
                }
                if (unset && (input.is(inputSelector) && _getInputValue(input).trim().length === 0)) {
//                  currentMoment = moment();
//                  if (typeof options.useCurrent === 'string') {
//                      currentMoment = useCurrentGranularity[options.useCurrent](currentMoment);
//                  }
//                  setValue(currentMoment);
                }
 
                widget = getTemplate();
 					
                fillDow();
                fillMonths();
 
                widget.find('.timepicker-hours').hide();
                widget.find('.timepicker-minutes').hide();
                widget.find('.timepicker-seconds').hide();
 
                update();
                showMode();
 
                $(window).on('resize', place);
                widget.on('mousedown', '[data-action]', doAction); // this handles clicks on the widget
               // widget.on('mousedown',false);
				widget.on('mouseenter',function(){
				input.off('blur.picker')
//				blurAble = false
				})
				widget.on('mouseleave',function(){

                input.focus().on('blur.picker',hide)
//				blurAble = true
				})
                if (component && component.hasClass('btn')) {
                    component.toggleClass('active');
                }
                widget.show();
                place();

                if (!input.is(':focus')) {
                    input.focus();
                }

                notifyEvent({
                    type: 'dp.show'
                });
                return picker;
            },

            toggle = function () {
                return (widget ? hide() : show());
            },

            parseInputDate = function (inputDate) {
                if (moment.isMoment(inputDate) || inputDate instanceof Date) {
                    inputDate = moment(inputDate);
                } else {
                    inputDate = moment(inputDate, parseFormats);
                }
                inputDate.locale(options.locale);
                return inputDate;
            },
            change = function (e) {
                var val = _getInputValue($(e.target)).trim(),
                    parsedDate = val ? parseInputDate(val) : null;
                setValue(parsedDate);
                e.stopImmediatePropagation();
                return false;
            },

            attachDatePickerElementEvents = function () {
                input.on({
                    'change': change,
                    'blur.picker': hide
                });

                input.on({
                    'focus': show
                });

               if (component) {
                    component.on('click', toggle);
                    component.on('mousedown', false);
                }
            },

            detachDatePickerElementEvents = function () {
                input.off({
                    'change': change,
                    'blur': hide
                });

                input.off({
                    'focus': show
                });

                if (component) {
                    component.off('click', toggle);
                    component.off('mousedown', false);
                }
            },

            initFormatting = function () {
                var format = options.format || 'L LT';

//              actualFormat = format.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput) {
//                  var newinput = date.localeData().longDateFormat(formatInput) || formatInput;
//                  return newinput.replace(/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, function (formatInput2) { //temp fix for #740
//                      return date.localeData().longDateFormat(formatInput2) || formatInput2;
//                  });
//              });
				
				actualFormat = options.format ||  'YYYY-M-D  HH:mm';
                parseFormats = options.extraFormats ? options.extraFormats.slice() : [];
                if (parseFormats.indexOf(format) < 0 && parseFormats.indexOf(actualFormat) < 0) {
                    parseFormats.push(actualFormat);
                }

                use24Hours = (actualFormat.toLowerCase().indexOf('a') < 1 && actualFormat.indexOf('h') < 1);

                if (isEnabled('y')) {
                    minViewModeNumber = 2;
                }
                if (isEnabled('M')) {
                    minViewModeNumber = 1;
                }
                if (isEnabled('d')) {
                    minViewModeNumber = 0;
                }

                currentViewMode = Math.max(minViewModeNumber, currentViewMode);

                if (!unset) {
                    setValue(date);
                }
            },

            // 新添加方法 by tianxq1
            _getInputValue = function(input) {
                var value;
                if(input.is('input')) {
                    value = input.val();
                } else if(input.is('div[contenteditable=true]')) {
                    value = input.html();
                } else {
                    throw new Error('Must be a input or contenteditable div');
                }
                return value;
            },

            _setInputValue = function(input, value) {
                if(input.is('input')) {
                    input.val(value);
                } else if(input.is('div[contenteditable=true]')) {
                    input[0].value = value;
                } else {
                    throw new Error('Must be a input or contenteditable div');
                }
            };

        /********************************************************************************
         *
         * Public API functions
         * =====================
         *
         * Important: Do not expose direct references to private objects or the options
         * object to the outer world. Always return a clone when returning values or make
         * a clone when setting a private variable.
         *
         ********************************************************************************/
        picker.destroy = function () {
            hide();
            detachDatePickerElementEvents();
            element.removeData('DateTimePicker');
            element.removeData('date');
        };

        picker.toggle = toggle;

        picker.show = show;

        picker.hide = hide;

        picker.ignoreReadonly = function (ignoreReadonly) {
            if (arguments.length === 0) {
                return options.ignoreReadonly;
            }
            if (typeof ignoreReadonly !== 'boolean') {
                throw new TypeError('ignoreReadonly () expects a boolean parameter');
            }
            options.ignoreReadonly = ignoreReadonly;
            return picker;
        };

        picker.options = function (newOptions) {
            if (arguments.length === 0) {
                return $.extend(true, {}, options);
            }

            if (!(newOptions instanceof Object)) {
                throw new TypeError('options() options parameter should be an object');
            }
            $.extend(true, options, newOptions);
            $.each(options, function (key, value) {
                if (picker[key] !== undefined) {
                    picker[key](value);
                } else {
                    //throw new TypeError('option ' + key + ' is not recognized!');
                }
            });
            return picker;
        };

        picker.getLong = function(){
            return date.valueOf();
        };
        picker.date = function (newDate) {
            if (arguments.length === 0) {
                if (unset) {
                    return null;
                }
                return date.clone();
            }

            if (newDate !== null && typeof newDate !== 'string' && !moment.isMoment(newDate) && !(newDate instanceof Date)) {
                newDate = parseFloat(newDate);
                if (!isNaN(newDate)) {
                    newDate = new Date(newDate);
                }
                else {
                    throw new TypeError('date() parameter must be one of [null, string, moment or Date]');
                }
            }

            setValue(newDate === null ? null : parseInputDate(newDate));
			if(newDate == ''){
                setValue('');
            }
            return picker;
        };

        picker.format = function (newFormat) {
            if (arguments.length === 0) {
                return options.format;
            }

            if ((typeof newFormat !== 'string') && ((typeof newFormat !== 'boolean') || (newFormat !== false))) {
                throw new TypeError('format() expects a sting or boolean:false parameter ' + newFormat);
            }

            options.format = newFormat;
            if (actualFormat) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.extraFormats = function (formats) {
            if (arguments.length === 0) {
                return options.extraFormats;
            }

            if (formats !== false && !(formats instanceof Array)) {
                throw new TypeError('extraFormats() expects an array or false parameter');
            }

            options.extraFormats = formats;
            if (parseFormats) {
                initFormatting(); // reinit formatting
            }
            return picker;
        };

        picker.maxDate = function (maxDate) {
            if (arguments.length === 0) {
                return options.maxDate ? options.maxDate.clone() : options.maxDate;
            }

            if ((typeof maxDate === 'boolean') && maxDate === false) {
                options.maxDate = false;
                update();
                return picker;
            }

            if (typeof maxDate === 'string') {
                if (maxDate === 'now' || maxDate === 'moment') {
                    maxDate = moment();
                }
            }

            var parsedDate = parseInputDate(maxDate);

            if (!parsedDate.isValid()) {
                throw new TypeError('maxDate() Could not parse date parameter: ' + maxDate);
            }
            if (options.minDate && parsedDate.isBefore(options.minDate)) {
                throw new TypeError('maxDate() date parameter is before options.minDate: ' + parsedDate.format(actualFormat));
            }
            options.maxDate = parsedDate;
            if (options.maxDate.isBefore(maxDate)) {
                setValue(options.maxDate);
            }
            if (viewDate.isAfter(parsedDate)) {
                viewDate = parsedDate.clone();
            }
            update();
            return picker;
        };

        picker.minDate = function (minDate) {
            if (arguments.length === 0) {
                return options.minDate ? options.minDate.clone() : options.minDate;
            }

            if ((typeof minDate === 'boolean') && minDate === false) {
                options.minDate = false;
                update();
                return picker;
            }

            if (typeof minDate === 'string') {
                if (minDate === 'now' || minDate === 'moment') {
                    minDate = moment();
                }
            }

            var parsedDate = parseInputDate(minDate);

            if (!parsedDate.isValid()) {
                throw new TypeError('minDate() Could not parse date parameter: ' + minDate);
            }
            if (options.maxDate && parsedDate.isAfter(options.maxDate)) {
                throw new TypeError('minDate() date parameter is after options.maxDate: ' + parsedDate.format(actualFormat));
            }
            options.minDate = parsedDate;
            if (options.minDate.isAfter(minDate)) {
                setValue(options.minDate);
            }
            if (viewDate.isBefore(parsedDate)) {
                viewDate = parsedDate.clone();
            }
            update();
            return picker;
        };

        picker.defaultDate = function (defaultDate) {
            if (arguments.length === 0) {
                return options.defaultDate ? options.defaultDate.clone() : options.defaultDate;
            }
            if (!defaultDate) {
                options.defaultDate = false;
                return picker;
            }

            if (typeof defaultDate === 'string') {
                if (defaultDate === 'now' || defaultDate === 'moment') {
                    defaultDate = moment();
                }
            }

            var parsedDate = parseInputDate(defaultDate);
            if (!parsedDate.isValid()) {
                throw new TypeError('defaultDate() Could not parse date parameter: ' + defaultDate);
            }
            if (!isValid(parsedDate)) {
                throw new TypeError('defaultDate() date passed is invalid according to component setup validations');
            }

            options.defaultDate = parsedDate;

            if (options.defaultDate && _getInputValue(input).trim() === '' && input.attr('placeholder') === undefined) {
                setValue(options.defaultDate);
            }
            return picker;
        };

        picker.locale = function (locale) {
            if (arguments.length === 0) {
                return options.locale;
            }

            if (!moment.localeData(locale)) {
                throw new TypeError('locale() locale ' + locale + ' is not loaded from moment locales!');
            }

            options.locale = locale;
            date.locale(options.locale);
            viewDate.locale(options.locale);

            if (actualFormat) {
                initFormatting(); // reinit formatting
            }
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.sideBySide = function (sideBySide) {
            if (arguments.length === 0) {
                return options.sideBySide;
            }

            if (typeof sideBySide !== 'boolean') {
                throw new TypeError('sideBySide() expects a boolean parameter');
            }
            options.sideBySide = sideBySide;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.viewMode = function (viewMode) {
            if (arguments.length === 0) 
                return options.viewMode;

            if (typeof viewMode !== 'string') 
                throw new TypeError('viewMode() expects a string parameter');

            if (viewModes.indexOf(viewMode) === -1) 
                throw new TypeError('viewMode() parameter must be one of (' + viewModes.join(', ') + ') value');

            options.viewMode = viewMode;
            currentViewMode = Math.max(viewModes.indexOf(viewMode), minViewModeNumber);

            showMode();
            return picker;
        };
		
//		//查询模板拓展
//		picker.afterShow=function(afterShow){
//			options.afterShow = afterShow;
//		return picker
//		};

        picker.showTodayButton = function (showTodayButton) {
            if (arguments.length === 0) {
                return options.showTodayButton;
            }

            if (typeof showTodayButton !== 'boolean') {
                throw new TypeError('showTodayButton() expects a boolean parameter');
            }

            options.showTodayButton = showTodayButton;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.showClear = function (showClear) {
            if (arguments.length === 0) {
                return options.showClear;
            }

            if (typeof showClear !== 'boolean') {
                throw new TypeError('showClear() expects a boolean parameter');
            }

            options.showClear = showClear;
            if (widget) {
                hide();
                show();
            }
            return picker;
        };

        picker.clear = function () {
            clear();
            return picker;
        };

        // initializing element and component attributes
        if (element.is(inputSelector))
            input = element;
        else
            input = element.find(inputSelector);

        if (element.hasClass('input-group')) {
            if (element.find('.datepickerbutton').size() === 0) {
                component = element.find('[class^="input-group-"]');
            } else {
                component = element.find('.datepickerbutton');
            }
        }

        if (!input.is(inputSelector)) {
            throw new Error('Could not initialize DateTimePicker without an input element');
        }

        $.extend(true, options, dataToOptions());

        picker.options(options);

        initFormatting();

        attachDatePickerElementEvents();

//      if (input.prop('disabled')) {
//          picker.disable();
//      }
        
        if (input.is(inputSelector) && _getInputValue(input).trim().length !== 0) {
            setValue(parseInputDate(_getInputValue(input).trim()));
        }
        else if (options.defaultDate && input.attr('placeholder') === undefined) {
            setValue(options.defaultDate);
        }
        return picker;
    };

    /********************************************************************************
     *
     * jQuery plugin constructor and defaults object
     *
     ********************************************************************************/

    $.fn.datetimepicker = function (options) {
        return this.each(function () {
            var $this = $(this);
            if (!$this.data('DateTimePicker')) {
                // create a private copy of the defaults object
                options = $.extend(true, {}, $.fn.datetimepicker.defaults, options);
                $this.data('DateTimePicker', dateTimePicker($this, options));
            }
        });
    };

    $.fn.datetimepicker.defaults = {
//		afterShow:undefined,
        format: false,
        extraFormats: false,
        minDate: false,
        maxDate: false,
        locale: moment.locale('zh-cn'),
        defaultDate: false,
        icons: {
            time: 'glyphicon glyphicon-time',
            date: 'glyphicon glyphicon-calendar',
            up: 'glyphicon glyphicon-chevron-up',
            down: 'glyphicon glyphicon-chevron-down',
            previous: 'glyphicon glyphicon-chevron-left',
            next: 'glyphicon glyphicon-chevron-right',
            today: 'glyphicon glyphicon-screenshot',
            clear: 'glyphicon glyphicon-trash'
        },
        sideBySide: false,
        viewMode: 'days',
        showTodayButton: true,
        showClear: true,
        ignoreReadonly: false
    };
    $(document).on(
        'focus.datetimepicker.data-api click.datetimepicker.data-api',
        '[data-provide="datetimepicker"]',
        function (e) {
            var $this = $(this);
            if ($this.data('DateTimePicker')) return;
            e.preventDefault();
            var options = JSON.parse($this.attr('data-options') || null);
            $this.datetimepicker(options || {});
            $this.data('DateTimePicker').show();
            $this.on('dp.change', function() {
                $(this).find('input').trigger('change');
            });
        }
    );
}($, moment);    

/**
 * 数据格式化工具
 */
+function($, moment) {
	'use strict';

	function NumberFormater(precision) {
		this.precision = precision;
	};

	NumberFormater.prototype.update = function(precision) {
		this.precision = precision;
	}


	NumberFormater.prototype.format = function(value) {
		if(!$.isNumeric(value)) return "";

		// 以0开头的数字将其前面的0去掉
		while ((value + "").charAt(0) == "0" && value.length > 1) {
			value = value.substring(1);
		}
		var result = value;
		if($.isNumeric(this.precision)) {
			if(window.BigNumber) {
				// 已经引入BigNumber
				result = (new BigNumber(value)).toFixed(this.precision)
			} else {
				var digit = parseFloat(value);
				// 解决toFixed四舍五入问题，如1.345 
				result = (Math.round(digit* Math.pow(10, this.precision)) / Math.pow(10, this.precision)).toFixed(this.precision);
			}
			if (result == "NaN")
				return "";
		}

		
		return result;
	};

	function DateFormater(pattern) {
		this.pattern = pattern;
	};

	DateFormater.prototype.update = function(pattern) {
		this.pattern = pattern;
	}


	DateFormater.prototype.format = function(value) {
		return moment(value).format(this.pattern)
	};

  	window.DataPlugins = window.DataPlugins ? window.DataPlugins :  {};

  	window.DataPlugins.formater = {
		getter:function(options){

		},
		setter:function(options, value){
			var json = JSON.parse($(this).attr('data-plugin'));
			var formater = window.DataPlugins.formater[options.type];
			if(options.type == 'number') {
				formater = formater ? formater.update(json.formater.precision) : new NumberFormater(json.formater.precision);
			} else if(options.type == 'date') {
				formater = formater ? formater.update(json.formater.pattern) : new DateFormater(json.formater.pattern);
			}
			this.showValue = formater.format(value);
			this.trueValue = this.showValue;
		}
	}
	
	$.NumberFormater = NumberFormater
	$.DateFormater = DateFormater
	
}($, moment);






+ function($) {
	'use strict';

	/**
	 * 字符串去掉左右空格
	 */
	String.prototype.trim = function() {
		return this.replace(/^\s*(\b.*\b|)\s*$/, "$1");
	};

	/**
	 * 字符串替换
	 */
	String.prototype.replaceStr = function(strFind, strRemp) {
		var tab = this.split(strFind);
		return new String(tab.join(strRemp));
	};

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

	/**
	 * 按字节数截取字符串 例:"e我是d".nLen(4)将返回"e我"
	 */
	String.prototype.substrCH = function(nLen) {
		var i = 0;
		var j = 0;
		while (i < nLen && j < this.length) { // 循环检查制定的结束字符串位置是否存在中文字符
			var charCode = this.charCodeAt(j);
			if (charCode > 256 && i == nLen - 1) {
				break;
			}
			//		else if(charCode >= 0x800 && charCode <= 0x10000){
			//			i = i + 3;
			//		}
			else if (charCode > 256) { // 返回指定下标字符编码，大于265表示是中文字符
				i = i + 2;
			} //是中文字符，那计数增加2
			else {
				i = i + 1;
			} //是英文字符，那计数增加1
			j = j + 1;
		};
		return this.substr(0, j);
	};

	/**
	 * 校验字符串是否以指定内容开始
	 */
	String.prototype.startWith = function(strChild) {
		return this.indexOf(strChild) == 0;
	};

	/**
	 * 判断字符串是否以指定参数的字符串结尾
	 *
	 * @param strChild
	 */
	String.prototype.endWith = function(strChild) {
		var index = this.indexOf(strChild);
		if (index == -1)
			return;
		else
			return index == this.length - strChild.length;
	};

	String.prototype.format = function(data) {
		if (data != null) {
			var string = this;
			for (var key in data) {
				var reg = new RegExp('\\<\\#\\=' + key + '\\#\\>', 'gi');
				string = string.replace(reg, data[key] ? (data[key] == 'null' ? "" : data[key]) : "");
			}
		}
		return string;
	}

	function patch(element) {
		if (element.toString().length > 1) {
			return element.toString();
		} else {
			return "0" + element.toString();
		}
	}
	Date.prototype.format = function(format) {
		var year = this.getFullYear(),
			month = this.getMonth() + 1,
			day = this.getDate(),
			hour = this.getHours(),
			minute = this.getMinutes(),
			second = this.getSeconds();
		format = format || "yyyy-MM-dd hh:mm:ss";
		return format.replace(/yyyy/, year).replace(/yy/, year.toString().substr(2, 2))
			.replace(/MM/, patch(month)).replace(/M/, month)
			.replace(/dd/, patch(day)).replace(/d/, day)
			.replace(/hh/, patch(hour)).replace(/h/, hour)
			.replace(/mm/, patch(minute)).replace(/m/, minute)
			.replace(/ss/, patch(second)).replace(/s/, second);
	};

	/**
	 * 获取AAAAMMJJ类型字符串
	 */
	Date.prototype.getAAAAMMJJ = function() {
		//date du jour
		var jour = this.getDate();
		if (jour < 10)
			(jour = "0" + jour);
		var mois = this.getMonth() + 1;
		if (mois < 10)
			(mois = "0" + mois);
		var annee = this.getFullYear();
		return annee + "" + mois + "" + jour;
	};

	/**
	 * 获取YYYY-MM-DD类型字符串
	 */
	Date.prototype.getFomatDate = function() {
		var year = this.getFullYear();
		var month = this.getMonth() + 1;
		if (month < 10)
			month = "0" + month;
		var day = this.getDate();
		if (day < 10)
			day = "0" + day;
		return year + "-" + month + "-" + day;
	};

	/**
	 * 获取YYYY-MM-DD HH:MM:SS类型字符串
	 */
	Date.prototype.getFomatDateTime = function() {
		var year = this.getFullYear();
		var month = this.getMonth() + 1;
		if (month < 10)
			month = "0" + month;
		var day = this.getDate();
		if (day < 10)
			day = "0" + day;
		var hours = this.getHours();
		if (hours < 10)
			hours = "0" + hours;
		var minutes = this.getMinutes();
		if (minutes < 10)
			minutes = "0" + minutes;
		var seconds = this.getSeconds();
		if (seconds < 10)
			seconds = "0" + seconds;
		return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	};

	/**
	 * 返回obj在数组中的位置
	 */
	Array.prototype.indexOf = function(obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj)
				return i;
		}
		return -1;
	};

	/**
	 * 按照index remove
	 */
	Array.prototype.remove = function(index) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 1);
	};

	/**
	 * 按照数组的元素remove
	 */
	Array.prototype.removeEle = function(ele) {
		for (var i = 0, count = this.length; i < count; i++) {
			if (this[i] == ele) {
				this.splice(i, 1);
				return;
			}
		}
	};
	/**
	 * 生成UUID
	 */
	Math.UUID = function() {
		return ((new Date()).getTime() + "").substr(9);
	};
	String.UUID = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};

	/**
	 * 将指定值ele插入到index处
	 */
	Array.prototype.insert = function(index, ele) {
		if (index < 0 || index > this.length) {
			alert("index out of bound");
			return;
		}
		this.splice(index, 0, ele);
	};

	/**
	 * 得到和索引相对应的数组中的值
	 */
	Array.prototype.values = function(indices) {
		if (indices == null)
			return null;
		var varr = new Array();
		for (var i = 0; i < indices.length; i++) {
			varr.push(this[indices[i]]);
		}
		return varr;
	};

	/**
	 * 清空数组
	 */
	Array.prototype.clear = function() {
		this.splice(0, this.length);
	};
	/**
	 * IE8 isNaN
	 */
	Number.isNaN = Number.isNaN || function(value) {
			return value !== value
	}
	window.getRequest = function(url) {
		if (!url)
			url = document.location.search;
		var theRequest = new Object();
		if (url.indexOf("?") != -1) {
			var str = url.substring(url.indexOf("?") + 1);
			var strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		}
		return theRequest;
	};

	window.setCookie = function(sName, sValue, oExpires, sPath, sDomain, bSecure) {
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
	};

	window.getCookie = function(sName) {
		var sRE = "(?:; )?" + sName + "=([^;]*);?";
		var oRE = new RegExp(sRE);

		if (oRE.test(document.cookie)) {
			return decodeURIComponent(RegExp["$1"]);
		} else
			return null;
	};

	window.deleteCookie = function(sName, sPath, sDomain) {
		setCookie(sName, "", new Date(0), sPath, sDomain);
	};
	window.execIgnoreError = function(a, b, c) {
		try {
			a.call(b, c);
		} catch (e) {
			//TODO handle the exception
		}
	}
	
	window.encodeBase64 = function(str){
		var c1, c2, c3;
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
                var i = 0, len= str.length, string = '';

                while (i < len){
                        c1 = str[i++] & 0xff;
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                                string += "==";
                                break;
                        }
                        c2 = str[i++];
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                                string += "=";
                                break;
                        }
                        c3 = str[i++];
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                        string += base64EncodeChars.charAt(c3 & 0x3F)
                }
        return string
	}
	
	$.getFunction = function(target, val){
		if (!val || typeof val == 'function') return val
		if (typeof target[val] == 'function')
			return target[val]
		else if (typeof window[val] == 'function')
			return window[val]
		else if (val.indexOf('.') != -1){
			var func = $.getJSObject(target, val)
			if (typeof func == 'function') return func
			func = $.getJSObject(window, val)
			if (typeof func == 'function') return func
		}
		return val
	}
	
	$.getJSObject = function(target, names) {
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
	}

	$.isDate = function(input){
		return Object.prototype.toString.call(input) === '[object Date]' ||
			input instanceof Date;
	}

	
	// 获取当前js文件的路径
	window.getCurrentJsPath = function() {
		var doc = document,
		a = {},
		expose = +new Date(),
		rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
		isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;
		// FF,Chrome
		if (doc.currentScript){
			return doc.currentScript.src;
		}

		var stack;
		try{
			a.b();
		}
		catch(e){
			stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
		}
		// IE10
		if (stack){
			var absPath = rExtractUri.exec(stack)[1];
			if (absPath){
				return absPath;
			}
		}

		// IE5-9
		for(var scripts = doc.scripts,
			i = scripts.length - 1,
			script; script = scripts[i--];){
			if (script.className !== expose && script.readyState === 'interactive'){
				script.className = expose;
				// if less than ie 8, must get abs path by getAttribute(src, 4)
				return isLtIE8 ? script.getAttribute('src', 4) : script.src;
			}
		}
	}
	
}($);
$.showLoading = u.showLoading;

$.hideLoading = u.hideLoading;

$.showWaiting = $.showLoading;
$.removeWaiting = $.hideLoading;

+function ($) {
  'use strict';
  $.showMessage = function(op) {
        var msgdiv = $('<div class="alert alert-'+op.type+' alert-dismissible"></div>');
        var closebtn = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
        msgdiv.append(closebtn).append(op.msg);
        
        msgdiv.css({'position':'fixed', 'display':'block'});
        if(op.pos) {
          if(op.pos.top && op.pos.left) {
            msgdiv.css({'top':op.pos.top, 'left':op.pos.left});
          } else if(op.pos.top && op.pos.right) {
            msgdiv.css({'top':op.pos.top, 'right':op.pos.right});
          } else if(op.pos.bottom && op.pos.left) {
            msgdiv.css({'bottom':op.pos.bottom, 'left':op.pos.left});
          } else if(op.pos.bottom && op.pos.right) {
            msgdiv.css({'bottom':op.pos.bottom, 'right':op.pos.right});
          } else if(op.pos.top) {
            msgdiv.css({'left':op.pos.left, 'top':10});
          } else if(op.pos.bottom) {
            msgdiv.css({'bottom':op.pos.bottom, 'left':10});
          } else if(op.pos.left) {
            msgdiv.css({'left':op.pos.left, 'top':10});
          } else if(op.pos.right) {
            msgdiv.css({'right':op.pos.right, 'top':10});
          }
        } else {
          msgdiv.css({'bottom':10, 'right':10});
        }
        msgdiv.css('z-index',99);
        setTimeout(function() {
          msgdiv.fadeOut('slow');
        }, 3000);

        $(document.body).append(msgdiv);
        closebtn.focus();
    }
  
 $.showMessageDialog = function(op) {
    if(typeof op.msg == 'undefined') return;
    if(!op.msg)  return;
     if(op.type){
         var msgdiv = $('<div class="alert alert-'+op.type+' alert-dismissible alert-dialog"></div>');
     }else{

         var msgdiv = $('<div class="alert alert-warning alert-dismissible alert-dialog"></div>');
     }
     var closebtn = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
     if(op.title){
         var titlediv = $('<h4>'+op.title+'</h4>');
     }else{
         var titlediv = $('<h4>提示</h4>');
     }
     op.msg = op.msg.replace(/&lt;br&gt;/g,"<br>")
     var contentdiv = $('<div class="alert-content"><p>'+op.msg+'</p></div>')
     var btndiv;
     if(op.type == 'danger' || op.type == 'warning') {
         btndiv = $('<div class="alert-dialog-footer"><div class="col-md-4 diag_detail" ></div><div class="col-md-4" ><button type="button" data-role="okbtn" data-dismiss="alert" class="btn btn-danger btn-block">确定</button></div><div class="col-md-4"><button type="button" data-dismiss="alert" data-role="cancelbtn" class="btn btn-default btn-block">取消</button></div></div>');
     } else {
         btndiv = $('<div class="alert-dialog-footer"><div class="col-md-4"  ></div><div class="col-md-4 diag_detail" ></div><div class="col-md-4" ><button type="button" data-role="okbtn" data-dismiss="alert" class="btn  btn-block">确定</button></div>');
     }



     msgdiv.append(closebtn).append(titlediv).append(contentdiv).append(btndiv);
    if(op.width){
       		msgdiv.css({width:op.width})
    }
    if(op.height){
       		msgdiv.css({height:op.height})
    }
   
	if(op.detail){
			
		$(msgdiv).find(".diag_detail").append('<button type="button"  class="btn btn-block">详细</button>')
		msgdiv.on("click",".diag_detail",function(){
			if($(".detail_p").length > 0){
				$(".detail_p").remove();
			}else{	
				msgdiv.append("<p class='detail_p'>"+op.detail+"</p>")
			}
		})
	}
    if(op.backdrop) {
      //添加遮罩层
      $(document.body).append('<div class="alert-backdrop" role="alert-dialog-backdrop"></div>');
      msgdiv.on('close.bs.alert', function() {
         $('.alert-backdrop[role="alert-dialog-backdrop"]').remove();
      });
    }

    msgdiv.find('[data-role="okbtn"]').on('click.alert.ok', op.okfn);
    
    if(op.cancelfn && typeof op.cancelfn == 'function'){
    	
       msgdiv.find('[data-role="cancelbtn"]').on('click', op.cancelfn);
       msgdiv.find('[aria-hidden="true"]').on('click', op.cancelfn);
    	
    }
   

    msgdiv.css('z-index',op.zIndex || 99);
    function msgdiv_resize(){
    	var divWidth = msgdiv[0].offsetWidth || 500,divHeight = msgdiv[0].offsetHeight    	
		msgdiv.css({margin:"0px",
			left:((window.innerWidth?window.innerWidth:document.body.clientWidth)- divWidth)/2, 
			top:((window.innerHeight?window.innerHeight:document.body.clientHeight) - divHeight)/2
		})
	}
    $(document.body).append(msgdiv);
    msgdiv.find('[data-role="okbtn"]').focus()
    msgdiv_resize()

}

		$.removeAlert = function(){
			 var tmp;
      (tmp = $('.alert')).length && tmp.remove();
      (tmp = $('.alert-backdrop')).length && tmp.remove();      
      
    
		}

}($);




