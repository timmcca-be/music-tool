import { h } from 'preact';

function RangeSelect({ label, value, setValue, min, max }) {
    const options = [];
	for(let i = min || 1; i <= max; i++) {
		options[i] = <option value={i}>{i}</option>;
    }
    
    return (
        <>
            <label for="select">{label}: </label>
            <select name="select" value={value} onChange={event => setValue(Number.parseInt(event.target.value, 10))}>
                {options}
            </select>
        </>
    )
}

export default RangeSelect;
