export function hold(
  element: HTMLElement,
  threshold = 500,
): { destroy?: () => void } {
  const handle_hold = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    const timeout = setTimeout(() => {
      element.dispatchEvent(new CustomEvent("hold"));
      cleanup();
    }, threshold);

    const cancel = () => {
      clearTimeout(timeout);
      cleanup();
    };

    const cleanup = () => {
      element.removeEventListener("pointermove", cancel);
      element.removeEventListener("pointerup", cancel);
      element.removeEventListener("pointercancel", cancel);
    };

    element.addEventListener("pointermove", cancel);
    element.addEventListener("pointerup", cancel);
    element.addEventListener("pointercancel", cancel);
  };

  element.addEventListener("pointerdown", handle_hold);

  return {
    destroy(): void {
      element.removeEventListener("pointerdown", handle_hold);
    },
  };
}
