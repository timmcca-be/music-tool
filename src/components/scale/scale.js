import { h } from 'preact';
import playChord from '../../utils/playChord'
import style from './style';

const noteScaleTones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const modeNames = ['Ionian (Major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (Minor)', 'Locrian'];

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

function getChordType(scaleTone, mode) {
    switch((scaleTone + mode) % 7) {
        case 0: case 3:
            return 'major';
        case 1: case 2: case 5:
            return 'minor';
        case 4:
            return 'dominant'
        case 6:
            return 'diminished';
    }
}

function getDisplayType(chordType, addSevenths) {
    switch(chordType) {
        case 'major':
            return addSevenths ? 'maj7' : '';
        case 'minor':
            return addSevenths ? 'm7' : 'm';
        case 'dominant':
            return addSevenths ? '7' : '';
        case 'diminished':
            return addSevenths ? 'm7♭5' : 'dim';
    }
}

function Scale({ keyCenter, mode, addSevenths }) {
	const firstFlat = mode <= 2 ? 2 - mode : 9 - mode;
    const secondFlat = 6 - mode;
    const startingScaleTone = noteScaleTones.indexOf(keyCenter[0]);
    const startingSemitone = getSemitone(keyCenter);
    const chords = [];
    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        const scaleToneName = noteScaleTones[(startingScaleTone + scaleTone) % 7];

        let semitone = startingSemitone + 2 * scaleTone;
        if(scaleTone > firstFlat) {
            semitone--;
        }
        if(scaleTone > secondFlat) {
            semitone--;
        }

        let semitoneOffset = (semitone % 12) - getSemitone(scaleToneName);
        if(semitoneOffset > 6) {
            semitoneOffset = semitoneOffset - 12;
        } else if(semitoneOffset < -6) {
            semitoneOffset = semitoneOffset + 12;
        }

        let chordName = scaleToneName;
        if(semitoneOffset < 0) {
            for(let i = -1; i > semitoneOffset; i -= 2) {
                chordName += '𝄫';
            }
            if(semitoneOffset % 2 !== 0) {
                chordName += '♭';
            }
        } else {
            for(let i = 1; i < semitoneOffset; i += 2) {
                chordName += '𝄪';
            }
            if(semitoneOffset % 2 !== 0) {
                chordName += '♯';
            }
        }

        chords[scaleTone] = {
            name: chordName,
            type: getChordType(scaleTone, mode),
            semitone: startingSemitone <= 6 ? semitone : semitone - 12,
        };
    }

	return (
		<div>
            <h3 class={style.modeTitle}>{modeNames[mode]}</h3>
            { chords.map((chord, i) => (
                <button key={i} class={`${style.chordButton} ${style[chord.type]}`}
                    onClick={() => playChord(chord.semitone, chord.type, addSevenths)}>
                    {chord.name}{getDisplayType(chord.type, addSevenths)}
                </button>
            ))}
        </div>
	)
}

export default Scale;
