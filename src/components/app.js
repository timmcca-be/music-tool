import { h } from 'preact';
import { Router } from 'preact-router';
import { createHashHistory } from 'history';

import Main from '../routes/main/main';
import Scales from '../routes/scales/scales';

const App = () => (
	<Router history={createHashHistory()}>
		<Main path="/" />
		<Scales path="/scales/:keyCenter" />
	</Router>
);

export default App;
