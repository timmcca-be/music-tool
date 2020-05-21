import { h } from 'preact';
import { Router } from 'preact-router';
import { createHashHistory } from 'history';

import Main from '../routes/main/main';
import Scales from '../routes/scales/scales';

function App() {
	if(typeof window === 'undefined') {
		return (
			<Router>
				<Main path="/" />
				<Scales path="/scales/:keyCenter" />
			</Router>
		);
	}
	return (
		<Router history={createHashHistory()}>
			<Main path="/" />
			<Scales path="/scales/:keyCenter" />
		</Router>
	);
}

export default App;
