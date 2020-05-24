import { h } from 'preact';
import { useContext } from 'preact/hooks';
import ScalesContext from '../../context/scalesContext';
import Chord from './chord';
import style from './scaleStyle';

function Scale({ name, semitoneOffsets }) {
    const { startingSemitone, octave } = useContext(ScalesContext);
    const semitones = semitoneOffsets.map(offset => startingSemitone + offset + 12 * octave);

    const chords = [];
    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        chords[scaleTone] = <Chord key={scaleTone} scaleSemitones={semitones} scaleTone={scaleTone} />;
    }

	return (
		<section class={style.scale}>
            <h3 class={style.modeTitle}>{name}</h3>
            {chords}
        </section>
	);
}

export default Scale;
