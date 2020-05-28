import { h } from 'preact';
import useKeyDown from '../../hooks/useKeyDown';
import style from './resetButtonStyle';

function ResetButton({ resetChordType }) {
    useKeyDown(key => {
		if(key === 'r') {
            resetChordType();
		}
	}, [resetChordType]);
    
    return (
        <button onClick={resetChordType}
            title="Reset - press r"
            class={style.button}>
            <span class="desktop">Reset</span>
            <span class="mobile">⟲</span>
        </button>
    );
}

export default ResetButton;
