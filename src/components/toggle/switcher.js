import { h } from 'preact';
import style from './toggleStyle';

const Switcher = ({ value, setValue, items }) => (
    <>
        {
            items.map(item => (
                <button onClick={() => setValue(item.value)}
                    class={value === item.value ? `${style.option} ${style.enabled}` : style.option}>
                    {item.name}
                </button>
            ))
        }
    </>
);

export default Switcher;
