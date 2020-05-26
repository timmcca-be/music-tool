import { h } from 'preact';
import style from './mainStyle';
import { Link } from 'preact-router/match';

const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'Fs', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

const Main = () => {
	if(typeof window !== 'undefined') {
		document.title = 'Chord Scales';
	}

	return (
		<main>
			<h1>Tonal Centers</h1>
			<p>Select a tonal center to view its chord scales</p>
			<nav class={style.keys}>
				{ notes.map(note => <Link class={style.link} href={`/scales/${note}`}>{note.replace('s', '♯').replace('b', '♭')}</Link>) }
			</nav>
		</main>
	);
};

export default Main;
