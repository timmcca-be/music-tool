const chordMap = {
    minorThird: {
        diminshedFifth: {
            noSeventh: 'dim',
            diminishedSeventh: 'dim7',
            minorSeventh: 'm7b5',
            majorSeventh: 'm(maj7)b5',
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
            minorSeventh: 'm7s5',
            majorSeventh: 'm(maj7)s5',
        },
    },
    majorThird: {
        diminshedFifth: {
            noSeventh: '(b5)',
            diminishedSeventh: '?',
            minorSeventh: '7b5',
            majorSeventh: 'maj7b5',
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
            minorSeventh: '7s5',
            majorSeventh: 'maj7s5',
        },
    },
};

export function getChordType(chordTones, semitoneOffsets) {
    const chordType = {
        style: ''
    };

    // TODO: support more chord types
    if(chordTones[0] !== 2
            || chordTones[1] !== 4
            || chordTones.length === 3 && chordTones[2] !== 6
            || chordTones.length > 3) {
        chordType.type = '?';
        return chordType;
    }

    let third;
    switch(semitoneOffsets[0]) {
        case 3:
            third = chordMap.minorThird;
            chordType.style = 'minor';
            break;
        case 4:
            third = chordMap.majorThird;
            chordType.style = 'major/dominant'
            break;
        default:
            chordType.type = '?';
            return chordType;
    }

    let fifth;
    switch(semitoneOffsets[1]) {
        case 6:
            fifth = third.diminshedFifth;
            chordType.style = 'diminished';
            break;
        case 7:
            fifth = third.perfectFifth;
            break;
        case 8:
            fifth = third.augmentedFifth;
            break;
        default:
            chordType.type = '?';
            return chordType;
    }

    if(semitoneOffsets.length === 2) {
        chordType.type = fifth.noSeventh;
        return chordType;
    }
    
    switch(semitoneOffsets[2]) {
        case 9:
            chordType.type = fifth.diminishedSeventh;
            break;
        case 10:
            if(chordType.style === 'major/dominant') {
                chordType.style = 'dominant';
            }
            chordType.type = fifth.minorSeventh;
            break;
        case 11:
            if(chordType.style === 'major/dominant') {
                chordType.style = 'major';
            }
            chordType.type = fifth.majorSeventh;
            break;
        default:
            chordType.type = '?';
            break;
    }

    return chordType;
}
