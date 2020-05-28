import { h } from 'preact';
import { getScaleSemitoneOffsets } from '../../utils/musicUtils';
import StandardChord from './standardChord';
import { useContext } from 'preact/hooks';
import ScalesContext from '../../context/scalesContext';

// https://en.wikipedia.org/wiki/Altered_scale
// Implied by tritone substitution, sorta
const ALTERED_SEMITONE_OFFSETS = getScaleSemitoneOffsets(0, 2);

function Chord({ scaleSemitones, scaleTone, relativeTonic = 0, relativeTonicSemitone = 0 }) {
    const { tritoneSubstitutionsEnabled } = useContext(ScalesContext);

    const chordStartingSemitone = scaleSemitones[scaleTone];

    if(tritoneSubstitutionsEnabled && Math.abs(scaleSemitones[(scaleTone + 2) % 7] - scaleSemitones[(scaleTone + 6) % 7]) === 6) {
        const alteredSemitones = ALTERED_SEMITONE_OFFSETS.map(offset => offset + chordStartingSemitone - (scaleTone >= 4 ? 12 : 0));
        return (
            <StandardChord scaleTone={4} scaleSemitones={alteredSemitones}
                relativeTonic={(scaleTone + relativeTonic) % 7}
                relativeTonicSemitone={(alteredSemitones[0] - scaleSemitones[0] + relativeTonicSemitone) % 12} />
        );
    }
    return (
        <StandardChord scaleSemitones={scaleSemitones} scaleTone={scaleTone}
            relativeTonic={relativeTonic} relativeTonicSemitone={relativeTonicSemitone} />);
}

export default Chord;
