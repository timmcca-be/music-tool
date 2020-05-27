import { h } from 'preact';
import { playDrone, stopDrone } from '../../utils/playChord';
import { useState, useEffect } from 'preact/hooks';
import Toggle from './toggle';

function DroneToggle({ note, semitone }) {
    const [droneEnabled, setDroneEnabled] = useState(false);

    useEffect(() => {
        if(droneEnabled) {
            playDrone(semitone);
        } else {
            stopDrone();
        }
        return stopDrone;
    }, [droneEnabled, semitone]);

    return (
        <Toggle name={`${note} drone`} enabled={droneEnabled} setEnabled={setDroneEnabled} keyboardShortcut="o">
            {note}<span class="desktop"> drone</span>
        </Toggle>
    );
}

export default DroneToggle;
