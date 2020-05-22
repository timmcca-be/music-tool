let audioCtx;
if(typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

const intervals = [];
for(let i = 0; i < 12; i++) {
    intervals.push(Math.pow(2, i / 12));
}

let gainNode = null;
function createOscillator(hz) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = hz;
    oscillator.connect(gainNode);
    return oscillator;
}

function stopChord() {
    if(gainNode !== null) {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function playChord(semitone, chordType, addSeventh) {
    const chordTones = [
        1,
        chordType === 'major' || chordType === 'dominant' ? intervals[4] : intervals[3],
        chordType === 'diminished' ? intervals[6] : intervals[7]
    ];

    if(addSeventh) {
        chordTones[3] = chordType === 'major' ? intervals[11] : intervals[10];
    }

    stopChord();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 1 / chordTones.length;

    const baseFrequency = 440 * Math.pow(2, (semitone - 9) / 12);
    const oscillators = chordTones.map(ratio => createOscillator(ratio * baseFrequency));
    oscillators.forEach((oscillator) => {
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 2);
    });
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
}

export { playChord, stopChord };
