import { h } from 'preact';
import useKeyDown from '../../hooks/useKeyDown';
import style from './toggleStyle';

function Toggle({ name, children, enabled, setEnabled, keyboardShortcut, allowKeyboardShortcut = true }) {
    useKeyDown(key => {
		if(allowKeyboardShortcut && key === keyboardShortcut) {
			setEnabled(!enabled);
		}
	}, [enabled, setEnabled, allowKeyboardShortcut, keyboardShortcut]);
    
    return (
        <button onClick={() => setEnabled(!enabled)}
            title={`${name} - press ${keyboardShortcut} to toggle`}
            class={enabled ? `${style.toggle} ${style.enabled}` : style.toggle}>
            <span class="desktop">{enabled ? 'Disable' : 'Enable'} </span>
            {children}
        </button>
    );
}

export default Toggle;
