import { h } from 'preact';
import useKeyDown from '../../hooks/useKeyDown';
import style from './seventhToggleStyle';

function SeventhToggle({ seventhEnabled, setSeventhEnabled, awaitingRoot }) {
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
