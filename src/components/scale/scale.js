import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { getAccidentals } from '../../utils/musicUtils';
import ScalesContext from '../../context/scalesContext';
import Chord from './chord';
import style from './scaleStyle';

const NOTE_SCALE_TONES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function getSemitone(note) {
    let semitone = 2 * NOTE_SCALE_TONES.indexOf(note[0]);
    if(semitone > 4) {
        semitone--;
    }
	for(let i = 1; i < note.length; i++) {
		switch(note[i]) {
			case 'b':
				semitone--;
				break;
			case 's':
				semitone++;
				break;
		}
	}
    return semitone;
}

function Scale({ name, semitoneOffsets }) {
    const { keyCenter } = useContext(ScalesContext);
    const startingScaleTone = NOTE_SCALE_TONES.indexOf(keyCenter[0]);
    const startingSemitone = getSemitone(keyCenter);
    const octave = startingSemitone <= 2 ? 0 : -1;
    const semitones = semitoneOffsets.map(offset => startingSemitone + offset + 12 * octave);

	return (
		<section class={style.scale}>
            <h3 class={style.modeTitle}>{name}</h3>
            { semitones.map((semitone, scaleTone) => {
                const scaleToneName = NOTE_SCALE_TONES[(startingScaleTone + scaleTone) % 7];
                const accidentals = getAccidentals(semitone % 12 - getSemitone(scaleToneName));

                return (
                    <Chord key={scaleTone}
                        note={`${scaleToneName}${accidentals}`}
                        scaleSemitones={semitones}
                        scaleTone={scaleTone} />
                );
            })}
        </section>
	);
}

export default Scale;
