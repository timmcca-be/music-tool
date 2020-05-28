import { h } from 'preact';
import { getScaleSemitoneOffsets } from '../../../utils/musicUtils';
import substituteChord from './substituteChord';

// https://en.wikipedia.org/wiki/Altered_scale
// Implied by tritone substitution, sorta
const ALTERED_SEMITONE_OFFSETS = getScaleSemitoneOffsets(0, 2);

function tritoneSubstituteChord(ChordComponent) {
    return function TritoneSubstitutedChord({ scaleSemitones, scaleTone, relativeTonic, relativeTonicSemitone }) {
        let SelectedChordComponent;
        if(Math.abs(scaleSemitones[(scaleTone + 2) % 7] - scaleSemitones[(scaleTone + 6) % 7]) === 6) {
            SelectedChordComponent = substituteChord(ChordComponent, ALTERED_SEMITONE_OFFSETS, 4, true);
        } else {
            SelectedChordComponent = ChordComponent;
        }
        return (
            <SelectedChordComponent scaleTone={scaleTone} scaleSemitones={scaleSemitones}
                relativeTonic={relativeTonic} relativeTonicSemitone={relativeTonicSemitone} />
        );
    }
}

export default tritoneSubstituteChord;
