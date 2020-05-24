import { h } from 'preact';
import style from './mainStyle';
import { Link } from 'preact-router/match';

const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'Fs', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

const Main = () => {
	if(typeof window !== 'undefined') {
		document.title = 'Keys';
	}

	return (
		<main>
			<h1>Keys</h1>
			<p>Select a key to view its modes</p>
			<nav class={style.keys}>
				{ notes.map(note => <Link class={style.link} href={`/scales/${note}`}>{note.replace('s', '♯').replace('b', '♭')}</Link>) }
			</nav>
		</main>
	);
};

export default Main;
