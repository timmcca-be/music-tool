import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import style from './scalesStyle';
import ScalesContext from '../../context/scalesContext';
import Scale from '../../components/scale/scale';
import DiatonicScale from '../../components/scale/diatonicScale';
import { getScaleSemitoneOffsets, getScaleTone, getSemitone } from '../../utils/musicUtils';
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
	const [addSeventh, setAddSeventh] = useState(false);
	const [diatonic, setDiatonic] = useState(true);
	const [awaitingInversion, setAwaitingInversion] = useState(false);

    const formattedKey = formatNote(keyCenter);
    if(typeof window !== 'undefined') {
        document.title = `Key of ${formattedKey}`;
	}

	useEffect(() => {
		const keyDown = event => {
			if(event.key === '/') {
				event.preventDefault();
				setAwaitingInversion(!awaitingInversion);
			} else if(awaitingInversion) {
				// TODO
			} else {
				setAddSeventh(!addSeventh);
			}
		};
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keydown', keyDown);
		}
	});

	let scales;
	if(diatonic) {
		scales = [];
		for(let i = 0; i < 7; i++) {
			const mode = (3 + 4 * i) % 7;
			scales[i] = <DiatonicScale key={i} mode={mode} />;
		}
	} else {
		scales = nonDiatonicScales.map((scale, i) => (
			<Scale key={i} name={scale.name} semitoneOffsets={scale.semitoneOffsets} />
		));
	}

	const onBackgroundClick = event => {
		if(event.target.tagName !== 'BUTTON') {
			stopChord();
		}
	};

	const startingSemitone = getSemitone(keyCenter);

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
			<ScalesContext.Provider value={{
				startingScaleTone: getScaleTone(keyCenter),
				startingSemitone,
				octave: startingSemitone <= 2 ? 0 : -1,
				chordTones: addSeventh ? [0, 2, 4, 6] : [0, 2, 4],
				awaitingInversion,
				resetChordType: () => setAddSeventh(false),
			}}>
				<button onClick={() => setAddSeventh(!addSeventh)}
					class={addSeventh ? `${style.toggle} ${style.toggleOn}` : style.toggle}>
					{addSeventh ? 'Disable' : 'Enable'} 7th
				</button>
				{ scales }
			</ScalesContext.Provider>
		</main>
	)
}

export default Scales;
