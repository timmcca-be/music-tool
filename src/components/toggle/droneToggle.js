import { h } from 'preact';
import { playDrone, stopDrone } from '../../utils/playChord';
import { useState } from 'preact/hooks';
import Toggle from './toggle';

function DroneToggle({ note, semitone }) {
    const [droneEnabled, setDroneEnabled] = useState(false);

    const toggleDrone = enabled => {
        setDroneEnabled(enabled);
        if(enabled) {
            playDrone(semitone);
        } else {
            stopDrone();
        }
    }

    return (
        <Toggle name={`${note} drone`} enabled={droneEnabled} setEnabled={toggleDrone} keyboardShortcut="o">
            {note}<span class="desktop"> drone</span>
        </Toggle>
    );
}

export default DroneToggle;
