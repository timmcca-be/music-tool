import { h } from 'preact';
import { playChord } from '../../utils/playChord';
import { getChordType, getChordStyle } from '../../utils/getChordType';
import style from './style';

const noteScaleTones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function getSemitone(note) {
    let semitone = 2 * noteScaleTones.indexOf(note[0]);
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

const roundTowardZero = num => num | 0;

function semitonesBetweenScaleTones(start, end, semitoneOffsets) {
    const octaveDistance = roundTowardZero((end - start) / 7);
    const semitoneDistance = semitoneOffsets[end % 7] - semitoneOffsets[start % 7];
    if(end % 7 < start % 7) {
        return 12 * (octaveDistance + 1) + semitoneDistance;
    }
    return 12 * octaveDistance + semitoneDistance;
}

function Scale({ keyCenter, name, semitoneOffsets, addSeventh, reset }) {
    const scaleToneOffset = noteScaleTones.indexOf(keyCenter[0]);
    const startingSemitone = getSemitone(keyCenter);
    const chords = [];

    const chordTones = addSeventh ? [2, 4, 6] : [2, 4];

    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        const semitone = startingSemitone + semitoneOffsets[scaleTone];
        const scaleToneName = noteScaleTones[(scaleToneOffset + scaleTone) % 7];

        let semitonesFromNaturalScaleTone = (semitone % 12) - getSemitone(scaleToneName);
        if(semitonesFromNaturalScaleTone > 6) {
            semitonesFromNaturalScaleTone = semitonesFromNaturalScaleTone - 12;
        } else if(semitonesFromNaturalScaleTone <= -6) {
            semitonesFromNaturalScaleTone += 12;
        }

        let chordName = scaleToneName;
        if(semitonesFromNaturalScaleTone < 0) {
            for(let i = -1; i > semitonesFromNaturalScaleTone; i -= 2) {
                chordName += '𝄫';
            }
            if(semitonesFromNaturalScaleTone % 2 !== 0) {
                chordName += '♭';
            }
        } else {
            for(let i = 1; i < semitonesFromNaturalScaleTone; i += 2) {
                chordName += '𝄪';
            }
            if(semitonesFromNaturalScaleTone % 2 !== 0) {
                chordName += '♯';
            }
        }

        const chordBaseSemitone = startingSemitone <= 2 ? semitone : semitone - 12;
        const chordSemitoneOffsets = chordTones.map(offset => (
            semitonesBetweenScaleTones(scaleTone, scaleTone + offset, semitoneOffsets)
        ));

        chords[scaleTone] = {
            name: chordName + getChordType(chordTones, chordSemitoneOffsets),
            style: getChordStyle(
                semitonesBetweenScaleTones(scaleTone, scaleTone + 2, semitoneOffsets),
                semitonesBetweenScaleTones(scaleTone, scaleTone + 4, semitoneOffsets),
                semitonesBetweenScaleTones(scaleTone, scaleTone + 6, semitoneOffsets),
            ),
            baseSemitone: chordBaseSemitone,
            semitoneOffsets: chordSemitoneOffsets,
        };
    }

    const playChordAndReset = chord => {
        playChord(chord.baseSemitone, chord.semitoneOffsets);
        reset();
    };

	return (
		<section class={style.scale}>
            <h3 class={style.modeTitle}>{name}</h3>
            { chords.map((chord, i) => (
                <button key={i} class={`${style.chordButton} ${style[chord.style]}`}
                    onClick={() => playChordAndReset(chord)}>
                    {chord.name}
                </button>
            ))}
        </section>
	)
}

export default Scale;
