import { h } from 'preact';
import { useState } from 'preact/hooks';
import style from './style';
import Scale from '../../components/scale/scale';
import { stopChord } from '../../utils/playChord';

function formatNote(note) {
	return note.replace(/bb/g, '𝄫').replace(/b/g, '♭').replace(/ss/g, '𝄪').replace(/s/g, '♯');
}

function Scales({matches: { keyCenter }}) {
    const formattedKey = formatNote(keyCenter);
    if(typeof window !== 'undefined') {
        document.title = `Key of ${formattedKey}`;
    }
	const [addSevenths, setAddSevenths] = useState(false);
	
	const scales = [];
	for(let i = 0; i < 7; i++) {
		const mode = (3 + 4 * i) % 7;
		scales[i] = <Scale key={i} keyCenter={keyCenter} mode={mode} addSevenths={addSevenths} />;
	}

	const onBackgroundClick = event => {
		if(event.target.tagName !== 'BUTTON') {
			stopChord();
		}
	};

	return (
		<main onClick={onBackgroundClick}>
			<h1>Key of {formattedKey}</h1>
			<button onClick={() => setAddSevenths(!addSevenths)}
				class={addSevenths ? style.toggle : `${style.toggle} ${style.toggleOn}`}>
				{addSevenths ? 'Remove' : 'Add'} sevenths
			</button>
			{ scales }
		</main>
	)
}

export default Scales;
