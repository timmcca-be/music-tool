import { h } from 'preact';

function substituteChord(ChordComponent, substituteScaleSemitoneOffsets, substituteScaleStartingTone, allowOctaveDrop) {
    return function SubstitutedChord({ scaleSemitones, scaleTone, relativeTonic, relativeTonicSemitone }) {
        const chordStartingSemitone = scaleSemitones[scaleTone] - (allowOctaveDrop && scaleTone >= substituteScaleStartingTone ? 12 : 0);
        const substituteScaleSemitones = substituteScaleSemitoneOffsets.map(offset => offset + chordStartingSemitone);
        return (
            <ChordComponent scaleTone={substituteScaleStartingTone} scaleSemitones={substituteScaleSemitones}
                relativeTonic={(scaleTone + relativeTonic) % 7}
                relativeTonicSemitone={(substituteScaleSemitones[0] - scaleSemitones[0] + relativeTonicSemitone) % 12} />
        );
    };
}

export default substituteChord;
