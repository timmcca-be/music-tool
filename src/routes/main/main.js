import { h } from 'preact';
import style from './style';
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
			<article class={style.circle}>
				{ notes.map(note => <Link class={style.link} href={`/scales/${note}`}>{note.replace('s', '♯').replace('b', '♭')}</Link>) }
			</article>
		</main>
	);
};

export default Main;
