import { useEffect } from 'preact/hooks';

export default function useKeyDown(handler) {
    useEffect(() => {
        const keyDown = event => handler(event.key, event);
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keydown', keyDown);
		};
    });
}
