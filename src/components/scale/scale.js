import { h } from 'preact';
import { useContext } from 'preact/hooks';
import ScalesContext from '../../context/scalesContext';
import style from './scaleStyle';

function Scale({ name, semitoneOffsets }) {
    const { startingSemitone, ChordComponent } = useContext(ScalesContext);
    const semitones = semitoneOffsets.map(offset => startingSemitone + offset);

    const chords = [];
    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        chords[scaleTone] = <ChordComponent key={scaleTone} scaleSemitones={semitones} scaleTone={scaleTone} />;
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
