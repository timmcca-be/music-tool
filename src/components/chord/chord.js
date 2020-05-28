import { h } from 'preact';
import { useContext } from 'preact/hooks';
import ScalesContext from '../../context/scalesContext';
import StandardChord from './standardChord';
import tritoneSubstituteChord from './substitute/tritoneSubstituteChord';
import secondaryDominantSubstituteChord from './substitute/secondaryDominantSubstituteChord';

function SecondaryDominantChord({ scaleSemitones, scaleTone }) {
    const { secondaryDominantsEnabled, tritoneSubstitutionsEnabled } = useContext(ScalesContext);

    let ChordComponent = StandardChord;

    if(tritoneSubstitutionsEnabled) {
        ChordComponent = tritoneSubstituteChord(ChordComponent);
    }
    if(secondaryDominantsEnabled) {
        ChordComponent = secondaryDominantSubstituteChord(ChordComponent);
    }

    return (
        <ChordComponent scaleSemitones={scaleSemitones} scaleTone={scaleTone}
            relativeTonic={0} relativeTonicSemitone={0} />
    );
}

export default SecondaryDominantChord;
