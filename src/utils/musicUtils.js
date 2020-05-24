function getScaleSemitoneOffsets(firstFlat, secondFlat) {
    const semitoneOffsets = [0];
    for(let i = 1; i < 7; i++) {
        const step = (i - 1) === firstFlat || (i - 1) === secondFlat ? 1 : 2;
        semitoneOffsets[i] = semitoneOffsets[i - 1] + step;
    }
    return semitoneOffsets;
}

function getAccidentals(semitoneDifference) {
    if(semitoneDifference > 6) {
        semitoneDifference -= 12;
    } else if(semitoneDifference <= -6) {
        semitoneDifference += 12;
    }

    let accidentals = ''
    if(semitoneDifference < 0) {
        for(let i = -1; i > semitoneDifference; i -= 2) {
            accidentals += '𝄫';
        }
        if(semitoneDifference % 2 !== 0) {
            accidentals += '♭';
        }
    } else {
        for(let i = 1; i < semitoneDifference; i += 2) {
            accidentals += '𝄪';
        }
        if(semitoneDifference % 2 !== 0) {
            accidentals += '♯';
        }
    }

    return accidentals;
}

export { getScaleSemitoneOffsets, getAccidentals }
