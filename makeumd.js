var fs = require('fs');
var curPath = process.cwd();
var path = require('path');

module.exports = {

	/**
	 * 文件处理入口
	 * @return {[type]} [description]
	 */

	//头部增加内容
	uui_header_content : '+function(){\r\n',

	all_header_content : '( function( factory ) {\r\n' +
		'\tif ( typeof define === "function" && define.amd ) {\r\n' +
		'\t\t// AMD. Register as an anonymous module.\r\n' +
		'\t\tdefine(["jquery", "knockout"], factory );\r\n' +
		'\t} else {\r\n' +
		'\t\t// Browser globals\r\n' +
		'\t\tfactory($, ko);\r\n' +
		'\t}\r\n' +
		'}( function($, ko) {\r\n',

	//尾部增加内容	
	uui_footer_content : '}();',
	footer_content : '}));',

	init: function(jsArr) {
		for (var i = 0; i< jsArr.length; i++){
			var filePath = jsArr[i]
			var data = fs.readFileSync(filePath, 'utf8');
			data = this.uui_header_content  + data + this.uui_footer_content;
			fs.writeFileSync(filePath, data);
		}
	},
	
};