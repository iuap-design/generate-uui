(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("sparrow", [], factory);
	else if(typeof exports === 'object')
		exports["sparrow"] = factory();
	else
		root["sparrow"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.App = undefined;
	
	var _level = __webpack_require__(1);
	
	var _level2 = __webpack_require__(3);
	
	var _level3 = __webpack_require__(2);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
	                                                                                                                                                           * Module : kero app entry index
	                                                                                                                                                           * Author : liuyk(liuyk@yonyou.com)
	                                                                                                                                                           * Date	  : 2016-07-28 15:11:50
	                                                                                                                                                           */
	
	//相关依赖导入
	
	
	//公开接口、属性对外暴露
	
	
	var App = function App() {
		_classCallCheck(this, App);
	
		this.DEFAULT = {
			sa: "sa"
		};
		this.getComp = _level.getComp;
		this.addComp = _level2.addComp;
		this.getCompById = _level3.getCompById;
		this.getDefault = _level3.getDefault;
	};
	
	window.App = App;
	exports.App = App;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getComp = undefined;
	
	var _level = __webpack_require__(2);
	
	var getComp = function getComp(id) {
		return _level.getCompById.call(this, id);
	};
	
	exports.getComp = getComp;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var getCompById = function getCompById(id) {
		return this.comps[id];
	};
	
	var getDefault = function getDefault() {
		return App.DEFAULT.sa;
	};
	
	exports.getCompById = getCompById;
	exports.getDefault = getDefault;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var addComp = function addComp(id, obj) {
		this.comps = {};
		this.comps[id] = obj;
	};
	
	exports.addComp = addComp;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sparrow.js.map