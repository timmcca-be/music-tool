import { h } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { playChord } from '../../utils/playChord';
import { getChordType, getChordStyle } from '../../utils/getChordType';
import { getSemitone, getNote, getSemitonesFromRootFunction } from '../../utils/musicUtils';
import ScalesContext from '../../context/scalesContext';
import style from './chordStyle';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const MINOR_CHORD_TYPES = ['half-diminished', 'diminished', 'minor'];

// pass in the number of semitones away from the "expected" pitch, get how sharp or flat it is
function getAccidentals(semitoneDifference) {
    // adjust for octave differences
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

// pass in scale tone, get how many semitones from the root it is in ionian (major)
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

    const [stopPlayingChord, setStopPlayingChord] = useState(null);

    const baseSemitone = scaleSemitones[scaleTone];

    // semitonesFromRoot is a function that computes the number of semitones that a given chord tone is from
    // the root of the chord. for instance, semitonesFromRoot(2) gets the number of semitones from the root to
    // the third, since the third is two scale tones above the root. so in the key of C, if the root of the
    // chord is D, then semitonesFromRoot(2) is 3, since F is three semitones above D
    const semitonesFromRoot = getSemitonesFromRootFunction(scaleSemitones, scaleTone);
    // major, minor, half-diminished, etc.
    const chordStyle = getChordStyle(semitonesFromRoot(2), semitonesFromRoot(4), semitonesFromRoot(6));

    // check how far the root of the chord is from what it would be if the scale was ionian (major)
    // this is used for the roman numeral display
    const accidentalsFromIonian = getAccidentalsFromIonian(scaleTone, baseSemitone, scaleSemitones[0]);
    let romanNumeral = `${accidentalsFromIonian}${ROMAN_NUMERALS[scaleTone]}`;
    if(MINOR_CHORD_TYPES.indexOf(chordStyle) !== -1) {
        romanNumeral = romanNumeral.toLowerCase();
    }
    // used if the chord is based on a substitute scale
    // the biggest example of this is secondary dominants, where a chord is the five of something (e.g. V/II)
    let relativeTonicRomanNumeral;
    if(relativeTonic === 0 && relativeTonicSemitone === 0) {
        relativeTonicRomanNumeral = '';
    } else {
        relativeTonicRomanNumeral = `/${
            getAccidentalsFromIonian(relativeTonic, relativeTonicSemitone)
        }${ROMAN_NUMERALS[relativeTonic]}`
    }

    const note = getFullNoteName(startingScaleTone + relativeTonic + scaleTone, baseSemitone);
    const chordSemitoneOffsets = chordTones.map(semitonesFromRoot);
    // m, m7, maj7, aug, etc.
    const type = getChordType(chordTones, chordSemitoneOffsets);
    const chordSemitones = chordSemitoneOffsets.map(offset => offset + baseSemitone);
    let inversion;
    if(root === 0) {
        inversion = '';
    } else {
        // This is for if an alternate root is selected, for chords like D/A
        const adjustedRoot = (scaleTone + root) % 7;
        inversion = `/${
            getFullNoteName(startingScaleTone + relativeTonic + adjustedRoot, scaleSemitones[adjustedRoot])
        }`;
        chordSemitones.push(scaleSemitones[adjustedRoot] - (adjustedRoot > scaleTone ? 12 : 0));
    }

    const onPress = () => setStopPlayingChord(() => playChord(chordSemitones));
    const onRelease = () => {
        if (stopPlayingChord != null) {
            stopPlayingChord();
            setStopPlayingChord(null);
        }
    };

    const isTouchDevice = "ontouchstart" in window;

    return (
        <button class={`${style.chordButton} ${style[chordStyle]}`}
            {...(isTouchDevice ? {
                onTouchStart: onPress,
                onTouchCancel: onRelease,
                onTouchEnd: onRelease,
            } : {
                onMouseDown: onPress,
                onMouseLeave: onRelease,
                onMouseUp: onRelease,
            })}
        >
            {note}{type.literal}{awaitingRoot ? '/' : inversion}
            <small>{romanNumeral}<sup>{type.roman}</sup>{relativeTonicRomanNumeral}</small>
        </button>
    );
}

export default Chord;
