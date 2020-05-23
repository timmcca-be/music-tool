export function getScaleSemitoneOffsets(firstFlat, secondFlat) {
    const semitoneOffsets = [0];
    for(let i = 1; i < 7; i++) {
        const step = (i - 1) === firstFlat || (i - 1) === secondFlat ? 1 : 2;
        semitoneOffsets[i] = semitoneOffsets[i - 1] + step;
    }
    return semitoneOffsets;
}
