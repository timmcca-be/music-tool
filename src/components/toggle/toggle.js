import { h } from 'preact';
import useKeyDown from '../../hooks/useKeyDown';
import style from './toggleStyle';

function Toggle({ name, mobileName, enabled, setEnabled, keyboardShortcut, allowKeyboardShortcut = true }) {
    useKeyDown(key => {
		if(allowKeyboardShortcut && key === keyboardShortcut) {
			setEnabled(!enabled);
		}
	});
    
    return (
        <button onClick={() => setEnabled(!enabled)}
            class={enabled ? `${style.toggle} ${style.enabled}` : style.toggle}>
            <span class={style.desktop}>{enabled ? 'Disable' : 'Enable'} {name}</span>
            <span class={style.mobile}>{mobileName === undefined ? name : mobileName}</span>
        </button>
    );
}

export default Toggle;
