import Scale from './scale';
import { getScaleSemitoneOffsets } from '../../utils/getScaleSemitoneOffsets';

const modeNames = ['Ionian (Major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (Minor)', 'Locrian'];

const DiatonicScale = ({ keyCenter, mode, addSeventh, reset }) => (
    <Scale
        keyCenter={keyCenter}
        name={modeNames[mode]}
        semitoneOffsets={getScaleSemitoneOffsets(mode <= 2 ? 2 - mode : 9 - mode, 6 - mode)}
        addSeventh={addSeventh}
        reset={reset} />
);

export default DiatonicScale;
