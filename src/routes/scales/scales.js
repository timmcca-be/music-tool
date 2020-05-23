import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import style from './style';
import Scale from '../../components/scale/scale';
import DiatonicScale from '../../components/scale/diatonicScale';
import { getScaleSemitoneOffsets } from '../../utils/getScaleSemitoneOffsets';
import { stopChord } from '../../utils/playChord';

const nonDiatonicScales = [
	{
		name: 'Harmonic Minor',
		semitoneOffsets: [0, 2, 3, 5, 7, 8, 11],
	}, {
		name: 'Melodic Minor',
		semitoneOffsets: getScaleSemitoneOffsets(1, 6),
	}, {
		name: 'Harmonic Major',
		semitoneOffsets: [0, 2, 4, 5, 7, 8, 11],
	}, {
		name: 'Melodic Major',
		semitoneOffsets: getScaleSemitoneOffsets(2, 4),
	}
];

function formatNote(note) {
	return note.replace(/bb/g, '𝄫').replace(/b/g, '♭').replace(/ss/g, '𝄪').replace(/s/g, '♯');
}

function Scales({matches: { keyCenter }}) {
    const formattedKey = formatNote(keyCenter);
    if(typeof window !== 'undefined') {
        document.title = `Key of ${formattedKey}`;
	}

	const [addSeventh, setAddSeventh] = useState(false);
	const [diatonic, setDiatonic] = useState(true);

	useEffect(() => {
		const keyDown = event => {
			if(event.key === '7') {
				setAddSeventh(!addSeventh);
			}
		};
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keydown', keyDown);
		}
	});

	const reset = () => setAddSeventh(false);

	let scales;
	if(diatonic) {
		scales = [];
		for(let i = 0; i < 7; i++) {
			const mode = (3 + 4 * i) % 7;
			scales[i] = (
				<DiatonicScale key={i}
					keyCenter={keyCenter}
					mode={mode}
					addSeventh={addSeventh}
					reset={reset} />
			);
		}
	} else {
		scales = nonDiatonicScales.map((scale, i) => (
			<Scale key={i}
				keyCenter={keyCenter}
				name={scale.name}
				semitoneOffsets={scale.semitoneOffsets}
				addSeventh={addSeventh}
				reset={reset} />
		));
	}

	const onBackgroundClick = event => {
		if(event.target.tagName !== 'BUTTON') {
			stopChord();
		}
	};

	return (
		<main onClick={onBackgroundClick}>
			<h1>Key of {formattedKey}</h1>
			<section>
				<button onClick={() => setDiatonic(true)}
					class={diatonic ? `${style.pill} ${style.toggleOn}` : style.pill}>
					Diatonic scales
				</button>
				<button onClick={() => setDiatonic(false)}
					class={diatonic ? style.pill : `${style.pill} ${style.toggleOn}`}>
					Non-diatonic scales
				</button>
			</section>
			<button onClick={() => setAddSeventh(!addSeventh)}
				class={addSeventh ? `${style.toggle} ${style.toggleOn}` : style.toggle}>
				{addSeventh ? 'Disable' : 'Enable'} 7th
			</button>
			{ scales }
		</main>
	)
}

export default Scales;
