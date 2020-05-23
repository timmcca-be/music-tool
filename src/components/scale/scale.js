import { h } from 'preact';
import { playChord } from '../../utils/playChord';
import { getChordType, getChordStyle } from '../../utils/getChordType';
import style from './style';

const noteScaleTones = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

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

const getIonianSemitone = scaleTone => scaleTone * 2 - (scaleTone > 2 ? 1 : 0);

const roundTowardZero = num => num | 0;

function semitonesBetweenScaleTones(start, end, semitoneOffsets) {
    const octaveDistance = roundTowardZero((end - start) / 7);
    const semitoneDistance = semitoneOffsets[end % 7] - semitoneOffsets[start % 7];
    if(end % 7 < start % 7) {
        return 12 * (octaveDistance + 1) + semitoneDistance;
    }
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
    const scaleToneOffset = noteScaleTones.indexOf(keyCenter[0]);
    const startingSemitone = getSemitone(keyCenter);
    const chords = [];

    const chordTones = addSeventh ? [2, 4, 6] : [2, 4];

    for(let scaleTone = 0; scaleTone < 7; scaleTone++) {
        const semitoneOffset = semitoneOffsets[scaleTone];
        const semitone = startingSemitone + semitoneOffset;
        const scaleToneName = noteScaleTones[(scaleToneOffset + scaleTone) % 7];

        let semitonesFromNaturalScaleTone = (semitone % 12) - getSemitone(scaleToneName);
        if(semitonesFromNaturalScaleTone > 6) {
            semitonesFromNaturalScaleTone = semitonesFromNaturalScaleTone - 12;
        } else if(semitonesFromNaturalScaleTone <= -6) {
            semitonesFromNaturalScaleTone += 12;
        }

        const chordName = `${scaleToneName}${getAccidentals(semitone % 12 - getSemitone(scaleToneName))}`;

        const chordBaseSemitone = startingSemitone <= 2 ? semitone : semitone - 12;
        const chordSemitoneOffsets = chordTones.map(offset => (
            semitonesBetweenScaleTones(scaleTone, scaleTone + offset, semitoneOffsets)
        ));

        const chordStyle = getChordStyle(
            semitonesBetweenScaleTones(scaleTone, scaleTone + 2, semitoneOffsets),
            semitonesBetweenScaleTones(scaleTone, scaleTone + 4, semitoneOffsets),
            semitonesBetweenScaleTones(scaleTone, scaleTone + 6, semitoneOffsets),
        );

        const semitonesFromIonian = semitoneOffset % 12 - getIonianSemitone(scaleTone);
        let romanNumeral = `${getAccidentals(semitonesFromIonian)}${romanNumerals[scaleTone]}`;
        let romanNumeralSuperscript;
        switch(chordStyle) {
            case 'half-diminished':
                romanNumeral = romanNumeral.toLowerCase();
                romanNumeralSuperscript = addSeventh ? 'ø7' : 'o';
                break;
            case 'diminished':
                romanNumeral = romanNumeral.toLowerCase();
                romanNumeralSuperscript = addSeventh ? 'o7' : 'o';
                break;
            case 'minor':
                romanNumeral = romanNumeral.toLowerCase();
                romanNumeralSuperscript = addSeventh ? '7' : '';
                break;
            case 'augmented':
                romanNumeralSuperscript = addSeventh ? '+7' : '+';
                break;
            case 'major':
                romanNumeralSuperscript = addSeventh ? 'M7' : '';
                break;
            case 'dominant':
                romanNumeralSuperscript = addSeventh ? '7' : '';
                break;
        }

        chords[scaleTone] = {
            name: chordName + getChordType(chordTones, chordSemitoneOffsets),
            romanNumeral,
            romanNumeralSuperscript,
            style: chordStyle,
            baseSemitone: chordBaseSemitone,
            semitoneOffsets: chordSemitoneOffsets,
        };
    }

    const handleChordButtonClick = (chord, event) => {
        playChord(chord.baseSemitone, chord.semitoneOffsets);
        reset();
        event.stopPropagation();
    };

	return (
		<section class={style.scale}>
            <h3 class={style.modeTitle}>{name}</h3>
            { chords.map((chord, i) => (
                <button key={i} class={`${style.chordButton} ${style[chord.style]}`}
                    onClick={event => handleChordButtonClick(chord, event)}>
                    {chord.name}<small>{chord.romanNumeral}<sup>{chord.romanNumeralSuperscript}</sup></small>
                </button>
            ))}
        </section>
	)
}

export default Scale;
