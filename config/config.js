const { resolve } = require('path');
const custom = require('../custom-config');

const ROOT = resolve(__dirname, '../');
const FILE_NAME = `${custom.filename || 'bundle'}.js`;
const FILE_PATH = custom.filepath || 'build'

const config = {
	entry: ['./src/index.js'],
	output: {
		filename: FILE_NAME,
		path: resolve(ROOT, FILE_PATH),
		publicPath: '/',
	},

	devtool: 'inline-source-map',

	plugins: [],

	module: {
		rules: [
			{
				test: /\.js(x?)$/,
				exclude: [
					resolve(ROOT, 'node_modules/'),
					resolve(ROOT, 'bower_components/')
				],
				use: [
					{
						loader: 'babel-loader',
						// options specified in `.babelrc`
						options: {}
					}
				]
			},
			{
				test: /\.(s?)css$/,
				use: [
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [
								require('autoprefixer')(),
							]
						}
					},
					{
						loader: 'sass-loader',
						options: {}
					},
				]
			}
		]
	},

	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			src: resolve(ROOT, 'src'),
			components: 'src/components',
			utils: 'src/utils'
		}
	}
}

module.exports = config;

