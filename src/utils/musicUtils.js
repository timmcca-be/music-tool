function getScaleSemitoneOffsets(firstFlat, secondFlat) {
    const semitoneOffsets = [0];
    for(let i = 1; i < 7; i++) {
        const step = (i - 1) === firstFlat || (i - 1) === secondFlat ? 1 : 2;
        semitoneOffsets[i] = semitoneOffsets[i - 1] + step;
    }
    return semitoneOffsets;
}

const NOTE_SCALE_TONES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const getNote = scaleTone => NOTE_SCALE_TONES[scaleTone % 7];

const getScaleTone = note => NOTE_SCALE_TONES.indexOf(note[0]);

function getSemitone(note) {
    let semitone = 2 * getScaleTone(note);
    if(semitone > 4) {
        semitone--;
    }
	for(let i = 1; i < note.length; i++) {
		switch(note[i]) {
			case 'b':
				semitone--;
				break;
			case 's':
				semitone++;
				break;
		}
	}
    return semitone;
}

const roundTowardZero = num => num | 0;

function getSemitonesFromRootFunction(scaleSemitones, startingScaleTone) {

    return scaleToneOffset => {
        const endScaleTone = startingScaleTone + scaleToneOffset;
        const octaveDistance = roundTowardZero((endScaleTone - startingScaleTone) / 7);
        if(endScaleTone >= 7) {
            const semitoneDistance = scaleSemitones[endScaleTone - 7] - scaleSemitones[startingScaleTone];
            return 12 * (octaveDistance + 1) + semitoneDistance;
        }
        const semitoneDistance = scaleSemitones[endScaleTone] - scaleSemitones[startingScaleTone];

        return 12 * octaveDistance + semitoneDistance;
    }
}

export { getScaleSemitoneOffsets, getNote, getScaleTone, getSemitone, getSemitonesFromRootFunction };
