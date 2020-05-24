import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import style from './scalesStyle';
import ScalesContext from '../../context/scalesContext';
import Scale from '../../components/scale/scale';
import DiatonicScale from '../../components/scale/diatonicScale';
import { getScaleSemitoneOffsets, getScaleTone, getSemitone } from '../../utils/musicUtils';
import { stopChord } from '../../utils/playChord';
import Switcher from '../../components/switcher/switcher';
import RangeSelect from '../../components/rangeSelect/rangeSelect';

const NON_DIATONIC_SCALE_TYPES = [
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
	const [root, setRoot] = useState(1);

    const formattedKey = formatNote(keyCenter);
    if(typeof window !== 'undefined') {
        document.title = `Key of ${formattedKey}`;
	}

	useEffect(() => {
		const keyDown = event => {
			if(event.key === '/') {
				event.preventDefault();
				setAwaitingInversion(!awaitingInversion);
				setRoot(1);
			} else if(awaitingInversion) {
				const newRoot = Number.parseInt(event.key, 10);
				if(!Number.isNaN(newRoot) && newRoot > 0 && newRoot < 8) {
					setAwaitingInversion(false);
					setRoot(newRoot);
				}
			} else if(event.key === '7') {
				setAddSeventh(!addSeventh);
			}
		};
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keydown', keyDown);
		}
	});

	const startingSemitone = getSemitone(keyCenter);
	const context = {
		startingScaleTone: getScaleTone(keyCenter),
		startingSemitone: startingSemitone <= 2 ? startingSemitone : startingSemitone - 12,
		chordTones: addSeventh ? [0, 2, 4, 6] : [0, 2, 4],
		awaitingInversion,
		root,
		resetChordType: () => {
			setAddSeventh(false);
			setRoot(1);
			setAwaitingInversion(false);
		},
	};

	let scales;
	if(diatonic) {
		scales = [];
		for(let i = 0; i < 7; i++) {
			const mode = (3 + 4 * i) % 7;
			scales[i] = <DiatonicScale key={i} mode={mode} />;
		}
	} else {
		scales = NON_DIATONIC_SCALE_TYPES.map((scale, i) => (
			<Scale key={i} name={scale.name} semitoneOffsets={scale.semitoneOffsets} />
		));
	}

	const rootOptions = [];
	for(let i = 1; i <= 7; i++) {
		rootOptions[i] = <option value={i}>{i}</option>;
	}

	return (
		<main onClick={event => {
			if(event.target.tagName !== 'BUTTON') {
				stopChord();
			}
		}}>
			<h1>Key of {formattedKey}</h1>
			<Switcher value={diatonic} setValue={setDiatonic}
				items={{
					'Diatonic scales': true,
					'Non-diatonic scales': false,
				}} />
			<aside class={style.chordControls}>
				<button onClick={() => setAddSeventh(!addSeventh)}
					class={addSeventh ? `${style.toggle} enabled` : style.toggle}>
					{addSeventh ? 'Disable' : 'Enable'} 7th
				</button>
				<RangeSelect label="Root interval" max={7} value={root} setValue={newRoot => {
					setAwaitingInversion(false);
					setRoot(newRoot);
				}} />
			</aside>
			<ScalesContext.Provider value={context}>
				{scales}
			</ScalesContext.Provider>
		</main>
	)
}

export default Scales;
