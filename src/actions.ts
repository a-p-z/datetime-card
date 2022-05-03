export function hold(div: HTMLDivElement, threshold = 500): { destroy?: () => void } {
    const handle_hold = () => {
        const timeout = setTimeout(() => {
            div.dispatchEvent(new CustomEvent("hold"));
            div.removeEventListener("mousemove", cancel);
            div.removeEventListener("mouseup", cancel);
            div.removeEventListener("touchcancel", cancel);
            div.removeEventListener("touchend", cancel);
            div.removeEventListener("touchmove", cancel);
        }, threshold);

        const cancel = () => {
            clearTimeout(timeout);
            div.removeEventListener("mousemove", cancel);
            div.removeEventListener("mouseup", cancel);
            div.removeEventListener("touchcancel", cancel);
            div.removeEventListener("touchend", cancel);
            div.removeEventListener("touchmove", cancel);
        };

        div.addEventListener("mousemove", cancel);
        div.addEventListener("mouseup", cancel);
        div.addEventListener("touchcancel", cancel);
        div.addEventListener("touchend", cancel);
        div.addEventListener("touchmove", cancel);
    };

    div.addEventListener("mousedown", handle_hold);
    div.addEventListener("touchstart", handle_hold);

    return {
        destroy(): void {
            div.removeEventListener("mousedown", handle_hold);
            div.removeEventListener("touchstart", handle_hold);
        },
    };
}