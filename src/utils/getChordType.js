const chordMap = {
    minorThird: {
        diminshedFifth: {
            noSeventh: 'dim',
            diminishedSeventh: 'dim7',
            minorSeventh: 'm7♭5',
            majorSeventh: 'm(maj7)♭5',
        },
        perfectFifth: {
            noSeventh: 'm',
            diminishedSeventh: '?',
            minorSeventh: 'm7',
            majorSeventh: 'm(maj7)',
        },
        augmentedFifth: {
            noSeventh: 'ms5',
            diminishedSeventh: '?',
            minorSeventh: 'm7♯5',
            majorSeventh: 'm(maj7)♯5',
        },
    },
    majorThird: {
        diminshedFifth: {
            noSeventh: '(♭5)',
            diminishedSeventh: '?',
            minorSeventh: '7♭5',
            majorSeventh: 'maj7♭5',
        },
        perfectFifth: {
            noSeventh: '',
            diminishedSeventh: '?',
            minorSeventh: '7',
            majorSeventh: 'maj7',
        },
        augmentedFifth: {
            noSeventh: 'aug',
            diminishedSeventh: '?',
            minorSeventh: '7♯5',
            majorSeventh: 'maj7♯5',
        },
    },
};

function getChordType(chordTones, semitoneOffsets) {
    // TODO: support more chord types
    if(chordTones[0] !== 2
            || chordTones[1] !== 4
            || chordTones.length === 3 && chordTones[2] !== 6
            || chordTones.length > 3) {
        return '?';
    }

    let third;
    switch(semitoneOffsets[0]) {
        case 3:
            third = chordMap.minorThird;
            break;
        case 4:
            third = chordMap.majorThird;
            break;
        default:
            return {
                type: '?',
                style: '',
            };
    }

    let fifth;
    switch(semitoneOffsets[1]) {
        case 6:
            fifth = third.diminshedFifth;
            break;
        case 7:
            fifth = third.perfectFifth;
            break;
        case 8:
            fifth = third.augmentedFifth;
            break;
        default:
            return '?';
    }

    if(semitoneOffsets.length === 2) {
        return fifth.noSeventh;
    }

    switch(semitoneOffsets[2]) {
        case 9:
            return fifth.diminishedSeventh;
        case 10:
            return fifth.minorSeventh;
        case 11:
            return fifth.majorSeventh;
        default:
            return '?';
    }
}

function getChordStyle(third, fifth, seventh) {
    if(fifth === 6) {
        if(seventh === 9) {
            return 'diminished';
        }
        if(seventh === 10) {
            return 'half-diminished';
        }
    }
    if(fifth === 8) {
        return 'augmented';
    }
    if(third === 4) {
        if(seventh === 10) {
            return 'dominant';
        }
        if(seventh === 11) {
            return 'major';
        }
        return '?';
    }
    if(third === 3) {
        return 'minor';
    }
    return '?';
}

export { getChordType, getChordStyle };
