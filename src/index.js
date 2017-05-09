import React from 'react';
import 'src/regenerator-runtime';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from 'src/app';

const renderApp = () => {
	render(
		<AppContainer>
			<App/>
		</AppContainer>,
		document.getElementById('root')
	);
}

renderApp();

if (module.hot) {
	module.hot.accept('src/app', () => {
		renderApp();
	});
}
