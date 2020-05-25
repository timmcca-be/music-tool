import { h } from 'preact';
import { useContext } from 'preact/hooks';
import useKeyDown from '../../hooks/useKeyDown';
import ScalesContext from '../../context/scalesContext';
import style from './seventhToggleStyle';

function SeventhToggle({ setSeventhEnabled }) {
    const { chordTones, awaitingRoot } = useContext(ScalesContext);
    const seventhEnabled = chordTones[3] === 6;

    useKeyDown(key => {
		if(!awaitingRoot && key === '7') {
			setSeventhEnabled(!seventhEnabled);
		}
	});
    
    return (
        <button onClick={() => setSeventhEnabled(!seventhEnabled)}
            class={seventhEnabled ? `${style.toggle} enabled` : style.toggle}>
            {seventhEnabled ? 'Disable' : 'Enable'} 7th
        </button>
    );
}

export default SeventhToggle;
