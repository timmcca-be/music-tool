import { h } from 'preact';
import style from './switcherStyle';

const Switcher = ({ value, setValue, items }) => (
    <>
        {
            Object.keys(items).map(name => (
                <button onClick={() => setValue(items[name])}
                    class={value === items[name] ? `${style.option} enabled` : style.option}>
                    {name}
                </button>
            ))
        }
    </>
);

export default Switcher;
