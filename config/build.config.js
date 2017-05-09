const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = require('./config');
const custom = require('../custom-config');

const CSS_FILENAME = `${custom.filenameCSS || 'styles'}.css`;
const SOURCE_MAP = custom.buildSourceMap ? custom.buildSourceMap : false

// source map
config.output.sourceMapFilename = '[name].map';

// required to omit css source maps (currently a bug with css-loader?)
config.devtool = false;

// css text extract
config.module.rules[1].use = ExtractTextPlugin.extract({
	use: [
		{
			loader: 'css-loader',
		},
		{
			loader: 'postcss-loader',
			options: {
				plugins: [
					require('autoprefixer')({
						browsers: [
							'> 1%',
							'Safari 8',
							'Last 2 versions'
						]
					}),
					require('cssnano')(),
				]
			}
		},
		{
			loader: 'sass-loader',
		}
	]
});

// add plugins
config.plugins = [
	new ExtractTextPlugin(CSS_FILENAME),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}),
	new webpack.optimize.UglifyJsPlugin({
		sourceMap: SOURCE_MAP,
		beautify: false,
		mangle: {
			screw_ie8: true,
			keep_fnames: true
		},
		compress: {
			screw_ie8: true
		},
		comments: false
	})
];

// build
webpack(config, err => {
	if (err){
		throw new Error('Error building bundle', err)
	}
	console.log(`Successfully built bundle in ${config.output.path}/${config.output.filename}`);
})