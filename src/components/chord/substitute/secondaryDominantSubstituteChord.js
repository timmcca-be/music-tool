import { getScaleSemitoneOffsets } from '../../../utils/musicUtils';
import substituteChord from './substituteChord';

const IONIAN_SEMITONE_OFFSETS = getScaleSemitoneOffsets(2, 6);

const secondaryDominantSubstituteChord = ChordComponent => substituteChord(ChordComponent, IONIAN_SEMITONE_OFFSETS, 4, false);

export default secondaryDominantSubstituteChord;
