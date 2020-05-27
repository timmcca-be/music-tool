let audioCtx;
if(typeof window !== 'undefined') {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

const intervals = [];
for(let i = 0; i < 12; i++) {
    intervals.push(Math.pow(2, i / 12));
}

let droneGainNode = null;
function stopDrone() {
    stopGainNode(droneGainNode, 1);
    droneGainNode = null;
}

function playDrone(semitone) {
    stopDrone();
    droneGainNode = audioCtx.createGain();
    droneGainNode.connect(audioCtx.destination);
    droneGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime);
    playSemitone(semitone - 24, droneGainNode);
    playSemitone(semitone - 12, droneGainNode);
    droneGainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 1);
}

let gainNode = null;
function playSemitone(semitone, currentGainNode, duration) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 440 * Math.pow(2, (semitone - 9) / 12);
    oscillator.connect(currentGainNode);
    oscillator.start();
    if(duration !== undefined) {
        oscillator.stop(audioCtx.currentTime + duration);
    }
}

function stopGainNode(currentGainNode, duration) {
    if(currentGainNode !== null) {
        const currentGain = currentGainNode.gain.value;
        currentGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        currentGainNode.gain.setValueAtTime(currentGain, audioCtx.currentTime);
        currentGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    }
}

const stopChord = () => stopGainNode(gainNode, 0.05);

function playChord(semitones) {
    stopChord();
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.value = 0;
    semitones.forEach(semitone => playSemitone(semitone, gainNode, 2));
    // this is a hack to make the ramps work on Firefox and WebKit.
    // the first ramp does not work, so we add a useless one here.
    // once this: https://bugzilla.mozilla.org/show_bug.cgi?id=1171438
    //    is resolved and the issue is fixed in WebKit, this line can be removed
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime((droneGainNode === null ? 1 : 0.7) / semitones.length, audioCtx.currentTime + 0.03);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.1);
}

export { playChord, stopChord, playDrone, stopDrone };
