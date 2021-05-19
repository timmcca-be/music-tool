import { h } from 'preact';
import { Router } from 'preact-router';

import Main from '../routes/main/main';
import Scales from '../routes/scales/scales';

function App() {
	return (
		<Router>
			<Main path="/" />
			<Scales path="/scales/:keyCenter" />
		</Router>
	);
}

export default App;
