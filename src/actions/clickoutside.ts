export function clickoutside(element: HTMLElement): { destroy?: () => void } {

    const handleClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (element && !element.contains(target) && !event.defaultPrevented) {
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