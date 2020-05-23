import { h } from 'preact';
import { playChord } from '../../utils/playChord';
import { getChordType } from '../../utils/getChordType';
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

function semitonesBetweenScaleTones(start, end, flats) {
    if(end < start) {
        end += 7;
    }
    let distance = Math.floor((end - start) / 7) * 12 + 2 * (end - start);
    for(const flat of flats) {
        if(end > flat + 7 || end > flat && start <= flat) {
            distance--;
        }
    }
    return distance;
}

function isMinorSeventh(start, end, flats) {
    return semitonesBetweenScaleTones(start, end, flats) === 10;
}

function Scale({ keyCenter, name, flats, addSeventh, reset }) {
    const scaleToneOffset = noteScaleTones.indexOf(keyCenter[0]);
    const startingSemitone = getSemitone(keyCenter);
    const chords = [];
    const semitones = [];
    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        semitones[scaleTone] = startingSemitone + semitonesBetweenScaleTones(0, scaleTone, flats);
    }

    const chordTones = addSeventh ? [2, 4, 6] : [2, 4];

    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        const semitone = semitones[scaleTone];
        const scaleToneName = noteScaleTones[(scaleToneOffset + scaleTone) % 7];

        let semitoneOffset = (semitone % 12) - getSemitone(scaleToneName);
        if(semitoneOffset > 6) {
            semitoneOffset = semitoneOffset - 12;
        } else if(semitoneOffset <= -6) {
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

        const chordBaseSemitone = startingSemitone <= 2 ? semitone : semitone - 12;
        const chordSemitoneOffsets = chordTones.map(offset => semitonesBetweenScaleTones(scaleTone, scaleTone + offset, flats));
        let { type, style } = getChordType(chordTones, chordSemitoneOffsets);
        if(style === 'major/dominant') {
            style = isMinorSeventh(scaleTone, scaleTone + 6, flats) ? 'dominant' : 'major';
        }

        chords[scaleTone] = {
            name: chordName + type.replace('b', '♭').replace('s', '♯'),
            style,
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
