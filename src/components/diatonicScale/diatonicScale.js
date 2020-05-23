import Scale from '../scale/scale';

const modeNames = ['Ionian (Major)', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian (Minor)', 'Locrian'];

const DiatonicScale = ({ keyCenter, mode, addSeventh, reset }) => (
    <Scale
        keyCenter={keyCenter}
        name={modeNames[mode]}
        flats={[mode <= 2 ? 2 - mode : 9 - mode, 6 - mode]}
        addSeventh={addSeventh}
        reset={reset} />
);

export default DiatonicScale;
