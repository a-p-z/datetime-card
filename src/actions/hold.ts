export function hold(
  element: HTMLElement,
  threshold = 500,
): { destroy?: () => void } {
  const handle_hold = () => {
    const timeout = setTimeout(() => {
      element.dispatchEvent(new CustomEvent("hold"));
      element.removeEventListener("mousemove", cancel);
      element.removeEventListener("mouseup", cancel);
      element.removeEventListener("touchcancel", cancel);
      element.removeEventListener("touchend", cancel);
      element.removeEventListener("touchmove", cancel);
    }, threshold);

    const cancel = () => {
      clearTimeout(timeout);
      element.removeEventListener("mousemove", cancel);
      element.removeEventListener("mouseup", cancel);
      element.removeEventListener("touchcancel", cancel);
      element.removeEventListener("touchend", cancel);
      element.removeEventListener("touchmove", cancel);
    };

    element.addEventListener("mousemove", cancel);
    element.addEventListener("mouseup", cancel);
    element.addEventListener("touchcancel", cancel);
    element.addEventListener("touchend", cancel);
    element.addEventListener("touchmove", cancel);
  };

  element.addEventListener("mousedown", handle_hold);
  element.addEventListener("touchstart", handle_hold);

  return {
    destroy(): void {
      element.removeEventListener("mousedown", handle_hold);
      element.removeEventListener("touchstart", handle_hold);
    },
  };
}
