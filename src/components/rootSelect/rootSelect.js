import { h } from 'preact';
import { useContext } from 'preact/hooks';
import useKeyDown from '../../hooks/useKeyDown';
import ScalesContext from '../../context/scalesContext';

function RootSelect({ setAwaitingRoot, setRoot }) {
    const {
        awaitingRoot,
        root,
    } = useContext(ScalesContext);
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
        <>
            <label for="select">Root interval: </label>
            <select name="select" value={root} onChange={event => {
                setRoot(Number.parseInt(event.target.value, 10));
                setAwaitingRoot(false);
            }}>
                {options}
            </select>
        </>
    )
}

export default RootSelect;
