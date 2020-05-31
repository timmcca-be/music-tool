import { h } from 'preact';

function substituteChord(ChordComponent, substituteScaleSemitoneOffsets, substituteScaleStartingTone, allowOctaveDrop) {

    return function SubstitutedChord({ scaleSemitones, scaleTone, relativeTonic = 0, relativeTonicSemitone = 0 }) {
        const shouldDropOctave = allowOctaveDrop && scaleTone >= substituteScaleStartingTone;
        const chordStartingSemitone = scaleSemitones[scaleTone] - (shouldDropOctave ? 12 : 0);
        const substituteScaleSemitones = substituteScaleSemitoneOffsets.map(offset => offset + chordStartingSemitone);

        return (
            <ChordComponent scaleTone={substituteScaleStartingTone} scaleSemitones={substituteScaleSemitones}
                relativeTonic={(scaleTone + relativeTonic) % 7}
                relativeTonicSemitone={(chordStartingSemitone - scaleSemitones[0] + relativeTonicSemitone) % 12} />
        );
    }
}

export default substituteChord;
