import { h } from 'preact';
import { useContext } from 'preact/hooks';
import ScalesContext from '../../context/scalesContext';
import Chord from '../chord/chord';
import style from './scaleStyle';
import SecondaryDominantChord from '../chord/secondaryDominantChord';

function Scale({ name, semitoneOffsets }) {
    const {
        startingSemitone,
        secondaryDominantsEnabled,
    } = useContext(ScalesContext);
    const semitones = semitoneOffsets.map(offset => startingSemitone + offset);

    const chords = [];
    if(secondaryDominantsEnabled) {
        for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
            chords[scaleTone] = <SecondaryDominantChord key={scaleTone} scaleSemitones={semitones} scaleTone={scaleTone} />;
        }
    } else {
        for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
            chords[scaleTone] = <Chord key={scaleTone} scaleSemitones={semitones} scaleTone={scaleTone} />;
        }
    }

	return (
		<article class={style.scale}>
            <h3 class={style.modeTitle}>{name}</h3>
            <section class={style.chords}>
                {chords}
            </section>
        </article>
	);
}

export default Scale;
