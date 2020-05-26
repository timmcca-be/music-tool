import { h } from 'preact';
import { getScaleSemitoneOffsets } from '../../utils/musicUtils';
import Chord from './chord';

const IONIAN_SEMITONE_OFFSETS = getScaleSemitoneOffsets(2, 6);

function SecondaryDominantChord({ scaleSemitones, scaleTone }) {
    const chordStartingSemitone = scaleSemitones[scaleTone];

    return (
        <Chord scaleTone={4} relativeTonic={scaleTone}
            scaleSemitones={IONIAN_SEMITONE_OFFSETS.map(offset => offset + chordStartingSemitone)} />
    );
}

export default SecondaryDominantChord;
