import Scale from './scale';
import { getScaleSemitoneOffsets } from '../../utils/musicUtils';

const modeNames = ['Ionian (Major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (Minor)', 'Locrian'];

const DiatonicScale = ({ mode }) => (
    <Scale name={modeNames[mode]}
        semitoneOffsets={getScaleSemitoneOffsets(mode <= 2 ? 2 - mode : 9 - mode, 6 - mode)} />
);

export default DiatonicScale;
