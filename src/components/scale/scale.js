import { h } from 'preact';
import { playChord } from '../../utils/playChord';
import { getChordType, getChordStyle } from '../../utils/getChordType';
import style from './style';

const NOTE_SCALE_TONES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const MINOR_CHORD_TYPES = ['half-diminished', 'diminished', 'minor'];

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

const getIonianSemitone = scaleTone => scaleTone * 2 - (scaleTone > 2 ? 1 : 0);

const roundTowardZero = num => num | 0;

function semitonesBetweenScaleTones(start, end, semitoneOffsets) {
    const octaveDistance = roundTowardZero((end - start) / 7);
    if(end >= 7) {
        const semitoneDistance = semitoneOffsets[end - 7] - semitoneOffsets[start];
        return 12 * (octaveDistance + 1) + semitoneDistance;
    }
    const semitoneDistance = semitoneOffsets[end] - semitoneOffsets[start];
    return 12 * octaveDistance + semitoneDistance;
}

function getAccidentals(semitoneDifference) {
    if(semitoneDifference > 6) {
        semitoneDifference -= 12;
    } else if(semitoneDifference <= -6) {
        semitoneDifference += 12;
    }

    let accidentals = ''
    if(semitoneDifference < 0) {
        for(let i = -1; i > semitoneDifference; i -= 2) {
            accidentals += '𝄫';
        }
        if(semitoneDifference % 2 !== 0) {
            accidentals += '♭';
        }
    } else {
        for(let i = 1; i < semitoneDifference; i += 2) {
            accidentals += '𝄪';
        }
        if(semitoneDifference % 2 !== 0) {
            accidentals += '♯';
        }
    }

    return accidentals;
}

function Scale({ keyCenter, name, semitoneOffsets, addSeventh, reset }) {
    const startingScaleTone = NOTE_SCALE_TONES.indexOf(keyCenter[0]);
    const startingSemitone = getSemitone(keyCenter);
    const relativeChordTones = addSeventh ? [0, 2, 4, 6] : [0, 2, 4];

    const chords = [];
    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        const semitoneOffset = semitoneOffsets[scaleTone];
        const semitone = startingSemitone + semitoneOffset;

        const scaleToneName = NOTE_SCALE_TONES[(startingScaleTone + scaleTone) % 7];
        const chordName = `${scaleToneName}${getAccidentals(semitone % 12 - getSemitone(scaleToneName))}`;

        const semitonesFromRoot = scaleToneOffset => (
            semitonesBetweenScaleTones(scaleTone, scaleTone + scaleToneOffset, semitoneOffsets)
        );

        const chordBaseSemitone = startingSemitone <= 2 ? semitone : semitone - 12;
        const chordSemitoneOffsets = relativeChordTones.map(semitonesFromRoot);
        const chordStyle = getChordStyle(semitonesFromRoot(2), semitonesFromRoot(4), semitonesFromRoot(6));

        const semitonesFromIonian = semitoneOffset % 12 - getIonianSemitone(scaleTone);
        let romanNumeral = `${getAccidentals(semitonesFromIonian)}${ROMAN_NUMERALS[scaleTone]}`;
        if(MINOR_CHORD_TYPES.indexOf(chordStyle) !== -1) {
            romanNumeral = romanNumeral.toLowerCase();
        }

        const chordType = getChordType(relativeChordTones, chordSemitoneOffsets);

        chords[scaleTone] = {
            name: `${chordName}${chordType.literal}`,
            romanNumeral,
            romanNumeralSuperscript: chordType.roman,
            style: chordStyle,
            semitones: chordSemitoneOffsets.map(offset => offset + chordBaseSemitone),
        };
    }

    const handleChordButtonClick = (semitones, event) => {
        playChord(semitones);
        reset();
        event.stopPropagation();
    };

	return (
		<section class={style.scale}>
            <h3 class={style.modeTitle}>{name}</h3>
            { chords.map((chord, i) => (
                <button key={i} class={`${style.chordButton} ${style[chord.style]}`}
                    onClick={event => handleChordButtonClick(chord.semitones, event)}>
                    {chord.name}<small>{chord.romanNumeral}<sup>{chord.romanNumeralSuperscript}</sup></small>
                </button>
            ))}
        </section>
	);
}

export default Scale;
