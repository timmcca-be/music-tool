import Chord from './chord';
import tritoneSubstituteChord from './substitute/tritoneSubstituteChord';
import secondaryDominantSubstituteChord from './substitute/secondaryDominantSubstituteChord';

function getChordComponent(secondaryDominantsEnabled, tritoneSubstitutionsEnabled) {
    let ChordComponent = Chord;

    if(tritoneSubstitutionsEnabled) {
        ChordComponent = tritoneSubstituteChord(ChordComponent);
    }
    if(secondaryDominantsEnabled) {
        ChordComponent = secondaryDominantSubstituteChord(ChordComponent);
    }

    return ChordComponent
}

export default getChordComponent;
