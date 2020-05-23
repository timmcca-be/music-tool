const unknownChord = {
    literal: '?',
    roman: '?',
};

const chordMap = {
    minorThird: {
        diminshedFifth: {
            noSeventh: {
                literal: 'dim',
                roman: 'o',
            },
            diminishedSeventh: {
                literal: 'dim7',
                roman: 'o7',
            },
            minorSeventh: {
                literal: 'm7♭5',
                roman: 'ø7',
            },
            majorSeventh: {
                literal: 'm(maj7)♭5',
                roman: 'oM7',
            },
        },
        perfectFifth: {
            noSeventh: {
                literal: 'm',
                roman: '',
            },
            diminishedSeventh: unknownChord,
            minorSeventh: {
                literal: 'm7',
                roman: '7',
            },
            majorSeventh: {
                literal: 'm(maj7)',
                roman: 'M7',
            },
        },
        augmentedFifth: {
            noSeventh: {
                literal: 'm♯5',
                roman: '+',
            },
            diminishedSeventh: unknownChord,
            minorSeventh: {
                literal: 'm7♯5',
                roman: '+7',
            },
            majorSeventh: {
                literal: 'm(maj7)♯5',
                roman: '+M7',
            },
        },
    },
    majorThird: {
        diminshedFifth: {
            noSeventh: {
                literal: '(♭5)',
                roman: '♭5',
            },
            diminishedSeventh: unknownChord,
            minorSeventh: {
                literal: '7♭5',
                roman: '7♭5',
            },
            majorSeventh: {
                literal: 'maj7♭5',
                roman: 'M7♭5',
            },
        },
        perfectFifth: {
            noSeventh: {
                literal: '',
                roman: '',
            },
            diminishedSeventh: unknownChord,
            minorSeventh: {
                literal: '7',
                roman: '7',
            },
            majorSeventh: {
                literal: 'maj7',
                roman: 'M7',
            },
        },
        augmentedFifth: {
            noSeventh: {
                literal: 'aug',
                roman: '+',
            },
            diminishedSeventh: unknownChord,
            minorSeventh: {
                literal: '7♯5',
                roman: '+7',
            },
            majorSeventh: {
                literal: 'maj7♯5',
                roman: '+M7',
            },
        },
    },
};

function getChordType(chordTones, semitoneOffsets) {
    // TODO: support more chord types
    if(chordTones[0] !== 2
            || chordTones[1] !== 4
            || chordTones.length === 3 && chordTones[2] !== 6
            || chordTones.length > 3) {
        return unknownChord;
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
            return unknownChord;
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
            return unknownChord;
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
            return unknownChord;
    }
}

function getChordStyle(third, fifth, seventh) {
    if(fifth === 6) {
        if(seventh === 10) {
            return 'half-diminished';
        }
        return 'diminished';
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
