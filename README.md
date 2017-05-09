Bearer token for figure1 api calls hardcoded in `src/ajax.js`.


## Installation and usage
1. Clone the repo
2. Using a node version of `7.6.0+`, run `npm install`
3. Customize environment in `custom-config.js` if necessary
4. Run `npm run dev` and navigate to `localhost:4800` (or whatever custom port you set)
5. Add your react components + scss inside `src/`

## Developing on own server
You can develop and serve the bundle from your own server but still support hot module reloading.
1. In your html file, including the bundle via: `<script type="text/javascript" src="http://localhost:4800/bundle.js"></script>`
2. Add `<div id="root"></div>` to your html

Any changes should be reflected accordingly.


## `custom-config.js`
Override webpack defaults to your own development environment. See the `custom-config.js` file for list of customizable options.

#### `proxyPort`
Allows you to proxy api requests to different host.

Eg: setting `proxyPort: 1234` will result in requests to

```localhost:4800/some_endpoint``` 

proxied to 

```localhost:1234/some_endpoint```


#### Other
Babel plugins that may be useful
- `babel-plugin-transform-object-rest-spread`
- `babel-preset-stage-0`
- `babel-preset-stage-1`

After installing, add to `.babelrc`.