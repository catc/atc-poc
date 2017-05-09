const { resolve } = require('path');
const webpack = require('webpack');
const devServer = require('webpack-dev-server');

const custom = require('../custom-config');
const config = require('./config');

const ROOT = resolve(__dirname, '../');
const PORT = custom.port || 4800;
const FILE_NAME = `${custom.filename || 'bundle'}.js`;

// add hmr entries
config.entry.unshift('webpack/hot/only-dev-server');
config.entry.unshift(`webpack-dev-server/client?http://localhost:${PORT}`);
config.entry.unshift('react-hot-loader/patch');

// add hmr plugins
config.plugins.push(
	new webpack.HotModuleReplacementPlugin()
);
config.plugins.push(
	new webpack.NamedModulesPlugin()
);

// add loaders
config.module.rules[0].use.unshift('react-hot-loader/webpack');

// css
config.module.rules[1].use.unshift('style-loader');
config.module.rules[1].use.unshift('react-hot-loader/webpack');

// setup dev server config
const devServerConfig = {
	hot: true,
	publicPath: '/',
	contentBase: ROOT,
	headers: {'Access-Control-Allow-Origin': '*'},

	// logging
	stats: 'errors-only',
	clientLogLevel: 'warning'
}

// allow for hmr support on different ports (if bundle is used on other server)
config.output.publicPath = `http://localhost:${PORT}/`;

if (custom.proxyPort){
	// add proxy for api requests
	devServerConfig.proxy = {
		'/': {
			target: `http://localhost:${custom.proxyPort}`,
			bypass: function(req){
				// proxy any api calls to external server
				switch (req.path){
					case '/':
						return '/index.html';
					case `/${FILE_NAME}`:
						return `/${FILE_NAME}`
				}
			}
		}
	};
}

// start server
new devServer(webpack(config), devServerConfig).listen(PORT, '0.0.0.0', err => {
	if (err){
		throw new Error('webpack dev server error', err);
	}
	console.log(`Webpack dev server listening on port ${PORT}`)
})
