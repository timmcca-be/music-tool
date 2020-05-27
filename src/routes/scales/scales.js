import { h } from 'preact';
import { useState } from 'preact/hooks';
import ScalesContext from '../../context/scalesContext';
import Scale from '../../components/scale/scale';
import DiatonicScale from '../../components/scale/diatonicScale';
import { getScaleSemitoneOffsets, getScaleTone, getSemitone } from '../../utils/musicUtils';
import { stopChord } from '../../utils/playChord';
import Switcher from '../../components/toggle/switcher';
import RootSelect from '../../components/rootSelect/rootSelect';
import style from './scalesStyle';
import Toggle from '../../components/toggle/toggle';
import ResetButton from '../../components/resetButton/resetButton';
import DroneToggle from '../../components/toggle/droneToggle';

const BACKGROUND_TAG_NAMES = ['MAIN', 'DIV', 'ARTICLE', 'SECTION', 'ASIDE'];
for(let i = 1; i <= 6; i++) {
	BACKGROUND_TAG_NAMES.push(`H${i}`);
}

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
	const [seventhEnabled, setSeventhEnabled] = useState(false);
	const [diatonic, setDiatonic] = useState(true);
	const [awaitingRoot, setAwaitingRoot] = useState(false);
	const [secondaryDominantsEnabled, setSecondaryDominantsEnabled] = useState(false);
	const [root, setRoot] = useState(0);

	const formattedKey = formatNote(keyCenter);
	const title = `${formattedKey} Scales`;
    if(typeof window !== 'undefined') {
        document.title = title;
	}

	const startingSemitone = getSemitone(keyCenter);
	const context = {
		startingScaleTone: getScaleTone(keyCenter),
		startingSemitone: startingSemitone <= 2 ? startingSemitone : startingSemitone - 12,
		chordTones: seventhEnabled ? [0, 2, 4, 6] : [0, 2, 4],
		awaitingRoot,
		secondaryDominantsEnabled,
		root,
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

	return (
		<main onClick={event => {
			if(BACKGROUND_TAG_NAMES.indexOf(event.target.tagName) !== -1) {
				stopChord();
			}
		}}>
			<h1>{title}</h1>
			<Switcher value={diatonic} setValue={setDiatonic}
				items={[
					{ name: 'Diatonic scales', value: true},
					{ name: 'Non-diatonic scales', value: false },
				]} />
			<aside class={style.chordControls}>
				<DroneToggle note={formattedKey} semitone={startingSemitone} />
				<Toggle name="Secondary dominants" keyboardShortcut="s"
					enabled={secondaryDominantsEnabled} setEnabled={setSecondaryDominantsEnabled}>
					<span class="desktop">secondary dominants</span><span class={`mobile ${style.romanNumeral}`}>V/x</span>
				</Toggle>
				<Toggle name="7th" keyboardShortcut="7" allowKeyboardShortcut={!awaitingRoot}
					enabled={seventhEnabled} setEnabled={setSeventhEnabled}>
					7th
				</Toggle>
				<RootSelect awaitingRoot={awaitingRoot} setAwaitingRoot={setAwaitingRoot}
					root={root} setRoot={setRoot} />
				<ResetButton resetChordType={() => {
					setSeventhEnabled(false);
					setAwaitingRoot(false);
					setSecondaryDominantsEnabled(false);
					setRoot(0);
				}} />
			</aside>
			<ScalesContext.Provider value={context}>
				{scales}
			</ScalesContext.Provider>
		</main>
	);
}

export default Scales;
