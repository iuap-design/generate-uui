var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;
var fs = require('fs');

var plugins = [],
	outputFile,
	devToolSelect;

/**
 * dev 输出未压缩版u.js
 * prod 输出压缩版u.min.js（map）
 */
if (env === 'dev'){
	
	outputFile = 'u.js';
	devToolSelect = '';

} else if (env === 'prod') {

	plugins.push(new UglifyJsPlugin({
		minimize: true
	}));
	outputFile = 'u.min.js';
	// devToolSelect = 'source-map';
	devToolSelect = '';

}


var config = {

	entry: __dirname + '/js/index.js',
	devtool: devToolSelect,
	output: {
		path: __dirname + '/dist/js',
		filename: outputFile,
		//library: 'u',
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	module: {
		loaders: [{
			test: /(\.jsx|\.js)$/,
			loader: 'babel',
			// include: [
			// 	__dirname + '/js',
			// 	__dirname + '/node_modules/neoui-sparrow/js'
			// ]
			exclude: /(bower_components)/
		}, {
			test: /(\.jsx|\.js)$/,
			loader: "eslint-loader",
			exclude: /node_modules/
		}]
	},
	resolve: {
		root: path.resolve('./js'),
		extensions: ['', '.js']
	},
	plugins: plugins
};

module.exports = config;