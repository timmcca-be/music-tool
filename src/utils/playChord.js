const intervals = [];
for(let i = 0; i < 12; i++) {
    intervals.push(Math.pow(2, i / 12));
}

let synthsPromise;
if(typeof window !== 'undefined') {
    synthsPromise = import(/* webpackPrefetch: true */ 'tone').then(Tone => {
        const volume = new Tone.Volume(-7).toMaster();
        const synths = [];
        for(let i = 0; i < 4; i++) {
            synths[i] = new Tone.Synth().connect(volume);
        }
        return synths;
    });
}

export default async function playChord(semitone, chordType) {
    let remainingModifiers = chordType;
    const chordTones = [1, intervals[4], intervals[7]];
    while(remainingModifiers !== '') {
        if(remainingModifiers.startsWith('maj7')) {
            chordTones[3] = intervals[11];
            remainingModifiers = remainingModifiers.substring(4);
        } else if(remainingModifiers.startsWith('7')) {
            chordTones[3] = intervals[10];
            remainingModifiers = remainingModifiers.substring(1);
        } else if(remainingModifiers.startsWith('dim')) {
			chordTones[1] = intervals[3];
            chordTones[2] = intervals[6];
            remainingModifiers = remainingModifiers.substring(3);
        } else if(remainingModifiers.startsWith('m')) {
            chordTones[1] = intervals[3];
            remainingModifiers = remainingModifiers.substring(1);
        } else {
            console.error('Unknown modifiers:', remainingModifiers);
            break;
        }
    }
    const baseFrequency = 440 * Math.pow(2, (semitone - 9) / 12 - (semitone <= 6 ? 0 : 1));
    const synths = await synthsPromise;
    synths.forEach(synth => synth.triggerRelease());
    chordTones.forEach((ratio, i) => synths[i].triggerAttackRelease(ratio * baseFrequency, 1));
}
