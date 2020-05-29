import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { playChord } from '../../utils/playChord';
import { getChordType, getChordStyle } from '../../utils/getChordType';
import { getSemitone, getNote } from '../../utils/musicUtils';
import ScalesContext from '../../context/scalesContext';
import style from './chordStyle';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const MINOR_CHORD_TYPES = ['half-diminished', 'diminished', 'minor'];

const roundTowardZero = num => num | 0;

function semitonesBetweenScaleTones(start, end, semitones) {
    const octaveDistance = roundTowardZero((end - start) / 7);
    if(end >= 7) {
        const semitoneDistance = semitones[end - 7] - semitones[start];
        return 12 * (octaveDistance + 1) + semitoneDistance;
    }
    const semitoneDistance = semitones[end] - semitones[start];
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

const getIonianSemitone = scaleTone => (scaleTone % 7) * 2 - ((scaleTone % 7) > 2 ? 1 : 0);

function getAccidentalsFromIonian(scaleTone, semitone, tonicSemitone = 0) {
    return getAccidentals((semitone - tonicSemitone) % 12 - getIonianSemitone(scaleTone));
}

function getFullNoteName(scaleTone, semitone) {
    const scaleToneName = getNote(scaleTone);
    const accidentals = getAccidentals(semitone % 12 - getSemitone(scaleToneName));
    return `${scaleToneName}${accidentals}`;
}

function Chord({ scaleSemitones, scaleTone, relativeTonic = 0, relativeTonicSemitone = 0 }) {
    const {
        startingScaleTone,
        chordTones,
        awaitingRoot,
        root,
    } = useContext(ScalesContext);

    const baseSemitone = scaleSemitones[scaleTone];

    const semitonesFromRoot = scaleToneOffset => (
        semitonesBetweenScaleTones(scaleTone, scaleTone + scaleToneOffset, scaleSemitones)
    );

    const chordStyle = getChordStyle(semitonesFromRoot(2), semitonesFromRoot(4), semitonesFromRoot(6));

    const accidentalsFromIonian = getAccidentalsFromIonian(scaleTone, baseSemitone, scaleSemitones[0]);
    let romanNumeral = `${accidentalsFromIonian}${ROMAN_NUMERALS[scaleTone]}`;
    if(MINOR_CHORD_TYPES.indexOf(chordStyle) !== -1) {
        romanNumeral = romanNumeral.toLowerCase();
    }
    let relativeTonicRomanNumeral;
    if(relativeTonic === 0 && relativeTonicSemitone === 0) {
        relativeTonicRomanNumeral = '';
    } else {
        relativeTonicRomanNumeral = `/${
            getAccidentalsFromIonian(relativeTonic, relativeTonicSemitone)
        }${ROMAN_NUMERALS[relativeTonic]}`
    }

    const note = getFullNoteName(startingScaleTone + relativeTonic + scaleTone, baseSemitone);
    const adjustedRoot = (scaleTone + root) % 7;
    const chordSemitoneOffsets = chordTones.map(semitonesFromRoot);
    const type = getChordType(chordTones, chordSemitoneOffsets);
    const chordSemitones = chordSemitoneOffsets.map(offset => offset + baseSemitone);
    let inversion;
    if(root === 0) {
        inversion = '';
    } else {
        inversion = `/${getFullNoteName(startingScaleTone + relativeTonic + adjustedRoot, scaleSemitones[adjustedRoot])}`;
        chordSemitones.push(scaleSemitones[adjustedRoot] - (adjustedRoot > scaleTone ? 12 : 0));
    }

    return (
        <button class={`${style.chordButton} ${style[chordStyle]}`}
            onClick={() => playChord(chordSemitones)}>
            {note}{type.literal}{awaitingRoot ? '/' : inversion}
            <small>{romanNumeral}<sup>{type.roman}</sup>{relativeTonicRomanNumeral}</small>
        </button>
    );
}

export default Chord;
