import { useEffect } from 'preact/hooks';

export default function useKeyDown(handler, variables) {
    useEffect(() => {
        const keyDown = event => handler(event.key, event);
		document.addEventListener('keydown', keyDown);
		return () => {
			document.removeEventListener('keydown', keyDown);
		};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, variables);
}
