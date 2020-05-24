import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { playChord } from '../../utils/playChord';
import { getChordType, getChordStyle } from '../../utils/getChordType';
import { getAccidentals } from '../../utils/musicUtils';
import ScalesContext from '../../context/scalesContext';
import style from './scaleStyle';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const MINOR_CHORD_TYPES = ['half-diminished', 'diminished', 'minor'];

const getIonianSemitone = scaleTone => scaleTone * 2 - (scaleTone > 2 ? 1 : 0);

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

function Chord({ note, scaleSemitones, scaleTone }) {
    const { chordTones, resetChordType, awaitingInversion } = useContext(ScalesContext);

    const semitonesFromRoot = scaleToneOffset => (
        semitonesBetweenScaleTones(scaleTone, scaleTone + scaleToneOffset, scaleSemitones)
    );

    const chordSemitoneOffsets = chordTones.map(semitonesFromRoot);
    const chordStyle = getChordStyle(semitonesFromRoot(2), semitonesFromRoot(4), semitonesFromRoot(6));

    const semitonesFromIonian = (scaleSemitones[scaleTone] - scaleSemitones[0]) % 12 - getIonianSemitone(scaleTone);
    let romanNumeral = `${getAccidentals(semitonesFromIonian)}${ROMAN_NUMERALS[scaleTone]}`;
    if(MINOR_CHORD_TYPES.indexOf(chordStyle) !== -1) {
        romanNumeral = romanNumeral.toLowerCase();
    }

    const type = getChordType(chordTones, chordSemitoneOffsets);
    const chordSemitones = chordSemitoneOffsets.map(offset => offset + scaleSemitones[scaleTone]);

    return (
        <button class={`${style.chordButton} ${style[chordStyle]}`}
            onClick={event => {
                playChord(chordSemitones);
                resetChordType();
                event.stopPropagation();
            }}>
            {note}{type.literal}{awaitingInversion ? '/' : ''}
            <small>{romanNumeral}<sup>{type.roman}</sup></small>
        </button>
    );
}

export default Chord;
