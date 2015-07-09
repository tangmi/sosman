import React from 'react';

import Model from './model.js';
import App from './app.jsx';

const model = new Model();

const render = () => {
	React.render(
		<div className="container">
			<App model={model} />
		</div>,
		document.getElementById('content')
	);

	console.log('render');
}

model.subscribe(render);
window.setInterval(render, 5000);
render();
