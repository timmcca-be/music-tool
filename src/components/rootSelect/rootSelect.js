import { h } from 'preact';
import useKeyDown from '../../hooks/useKeyDown';
import style from './rootStyle';

function RootSelect({ awaitingRoot, setAwaitingRoot, root, setRoot }) {
    useKeyDown((key, event) => {
        if(key === '/') {
            event.preventDefault();
            setAwaitingRoot(!awaitingRoot);
            setRoot(0);
        } else if(awaitingRoot) {
            const newRoot = Number.parseInt(key, 10) - 1;
            if(!Number.isNaN(newRoot) && newRoot >= 0 && newRoot < 7) {
                setAwaitingRoot(false);
                setRoot(newRoot);
            }
        }
    });

    const options = [];
	for(let i = 0; i < 7; i++) {
		options[i] = <option value={i}>{i + 1}</option>;
    }
    
    return (
        <label class={style.container}>
            Root:
            <select class={style.select} value={root} onChange={event => {
                setRoot(Number.parseInt(event.target.value, 10));
                setAwaitingRoot(false);
            }} title="Root interval - press / and then the numeric key to select">
                {options}
            </select>
        </label>
    );
}

export default RootSelect;
