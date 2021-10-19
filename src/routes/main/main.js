import { h } from 'preact';
import style from './mainStyle';
import { Link } from 'preact-router/match';
import { useState } from 'preact/hooks';

const notes = ['C', 'G', 'D', 'A', 'E', 'B', 'Fs', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

const Main = () => {
	if(typeof window !== 'undefined') {
		document.title = 'Chord Scales';
	}

	const [isShowingModal, setIsShowingModal] = useState(false);

	const openModal = () => {
		setIsShowingModal(true);
		document.body.style.overflow = 'hidden';
	}

	const closeModal = () => {
		setIsShowingModal(false);
		document.body.style.overflow = 'auto';
	}

	return (
		<main>
			<h1>Tonal Centers</h1>
			<p>Select a tonal center to view its chord scales</p>
			<nav class={style.keys}>
				{ notes.map(note => (
					<Link
						key={note}
						class={style.link}
						href={`/scales/${note.toLowerCase()}/`}
					>
						{note.replace('s', '♯').replace('b', '♭')}
					</Link>)) }
			</nav>
			<button class={style.learnMore} onClick={openModal}>
				Learn more about this project
			</button>
			{isShowingModal && (
				<div class={style.modalBackground} onClick={closeModal}>
					<article class={style.modal} onClick={(e) => e.stopPropagation()}>
						<header class={style.modalHeader}>
							<h1 class={style.modalTitle}>Hi there!</h1>
							<button onClick={closeModal}>
								×
							</button>
						</header>
						<section class={style.modalBody}>
							<p>
								Tim here! This is probably my favorite personal project I've ever made.
								I love music, and it was so rewarding to make a tool to help me write songs.
								I learned so much with this project, in terms of both software development
								and music.
							</p>
							<p>
								Maybe the coolest thing about this project is that I wrote it with{' '}
								<a
									target="_blank"
									rel="noreferrer"
									href="https://www.reddit.com/r/musictheory/comments/go5ewt/tool_for_finding_chords_in_a_given_keymode/"
								>
									tons of feedback from fellow musicians on Reddit
								</a>.
								These were largely people who had no idea about software development, but whose
								musical knowledge outclassed mine. This meant that I was learning new musical
								principles, then immediately putting them into practice by codifying them.
								It also required that I balance the input from multiple different
								people, fulfilling and adapting their requests to build something that
								would hopefully appeal to everyone.
							</p>
							<p>
								From a technical standpoint, I learned most from the mistakes I made while
								building this site. I was very focused on performance, and I ended up cutting
								corners in terms of the readability and flexibility in order to eke out those
								precious processor cycles. As I kept working on it, my development slowed
								down as a result. I was lucky enough to learn this lesson on a personal project,
								and I have carried it with me since. I now place the most value on writing code
								that clearly describes the domain. Maybe there's a rewrite in this project's
								future?
							</p>
						</section>
					</article>
				</div>
			)}
		</main>
	);
};

export default Main;
