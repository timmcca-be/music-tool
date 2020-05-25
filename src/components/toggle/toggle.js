import { h } from 'preact';
import useKeyDown from '../../hooks/useKeyDown';
import style from './toggleStyle';

function Toggle({ name, enabled, setEnabled, keyboardShortcut, allowKeyboardShortcut = true }) {
    useKeyDown(key => {
		if(allowKeyboardShortcut && key === keyboardShortcut) {
			setEnabled(!enabled);
		}
	});
    
    return (
        <button onClick={() => setEnabled(!enabled)}
            class={enabled ? `${style.toggle} ${style.enabled}` : style.toggle}>
            {enabled ? 'Disable' : 'Enable'} {name}
        </button>
    );
}

export default Toggle;
