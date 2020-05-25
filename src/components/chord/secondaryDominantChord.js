import { h } from 'preact';
import { getScaleSemitoneOffsets } from '../../utils/musicUtils';
import Chord from './chord';

const IONIAN_SEMITONE_OFFSETS = getScaleSemitoneOffsets(2, 6);

function SecondaryDominantChord({ scaleSemitones, scaleTone }) {
    const startingSemitone = scaleSemitones[scaleTone];

    return (
        <Chord scaleTone={4} relativeRoot={scaleTone}
            scaleSemitones={IONIAN_SEMITONE_OFFSETS.map(offset => offset + startingSemitone)} />
    );
}

export default SecondaryDominantChord;
