let audioCtx;
if(typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

const intervals = [];
for(let i = 0; i < 12; i++) {
    intervals.push(Math.pow(2, i / 12));
}

let gainNode = null;
function playTone(hz) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = hz;
    oscillator.connect(gainNode);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 2);
}

function stopChord() {
    if(gainNode !== null) {
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function playChord(baseSemitone, semitoneOffsets) {
    stopChord();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 1 / (semitoneOffsets.length + 1);

    const baseFrequency = 440 * Math.pow(2, (baseSemitone - 9) / 12);
    playTone(baseFrequency);
    for(const offset of semitoneOffsets) {
        playTone(intervals[offset] * baseFrequency);
    }
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
}

export { playChord, stopChord };
