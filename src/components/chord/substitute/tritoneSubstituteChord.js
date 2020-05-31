import { h } from 'preact';
import { getScaleSemitoneOffsets, getSemitonesFromRootFunction } from '../../../utils/musicUtils';
import { getChordStyle } from '../../../utils/getChordType';
import substituteChord from './substituteChord';

// https://en.wikipedia.org/wiki/Altered_scale
// Implied by tritone substitution, sorta
const ALTERED_SEMITONE_OFFSETS = getScaleSemitoneOffsets(0, 2);

function tritoneSubstituteChord(ChordComponent) {

    return function TritoneSubstitutedChord({ scaleSemitones, scaleTone, relativeTonic, relativeTonicSemitone }) {
        const semitonesFromRoot = getSemitonesFromRootFunction(scaleSemitones, scaleTone);
        const chordStyle = getChordStyle(semitonesFromRoot(2), semitonesFromRoot(4), semitonesFromRoot(6));

        let SelectedChordComponent;
        if(chordStyle === 'dominant') {
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
