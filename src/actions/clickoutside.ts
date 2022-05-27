export function clickoutside(element: HTMLElement): { destroy?: () => void } {

    const handleClick = ($event) => {
        if (element && !element.contains($event.target) && !$event.defaultPrevented) {
            element.dispatchEvent(new CustomEvent('clickoutside'));
        }
    };

    document.addEventListener('click', handleClick, true);

    return {
        destroy(): void {
            document.removeEventListener('click', handleClick, true);
        }
    }
}