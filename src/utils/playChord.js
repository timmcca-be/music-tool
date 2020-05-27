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
        // see comment in playChord
        gainNode.gain.linearRampToValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05);
    }
}

function playChord(semitones) {
    stopChord();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0;
    semitones.forEach(semitone => playTone(440 * Math.pow(2, (semitone - 9) / 12)));
    // this is a hack to make the ramps work on Firefox and WebKit.
    // the first ramp does not work, so we add a useless one here.
    // once this: https://bugzilla.mozilla.org/show_bug.cgi?id=1171438
    //    is resolved and the issue is fixed in WebKit, this line can be removed
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1 / semitones.length, audioCtx.currentTime + 0.03);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.1);
}

export { playChord, stopChord };
