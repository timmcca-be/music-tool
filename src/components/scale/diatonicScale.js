import Scale from './scale';
import { getScaleSemitoneOffsets } from '../../utils/musicUtils';

const MODE_NAMES = ['Ionian (Major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (Minor)', 'Locrian'];
const SCALE_SEMITONE_OFFSETS = [];
for(let mode = 0; mode < 7; mode++) {
    SCALE_SEMITONE_OFFSETS[mode] = getScaleSemitoneOffsets(mode <= 2 ? 2 - mode : 9 - mode, 6 - mode);
}

const DiatonicScale = ({ mode }) => <Scale name={MODE_NAMES[mode]} semitoneOffsets={SCALE_SEMITONE_OFFSETS[mode]} />;

export default DiatonicScale;
