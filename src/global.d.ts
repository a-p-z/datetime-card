/// <reference types="svelte" />

declare namespace svelte.JSX {
    interface DOMAttributes<T extends EventTarget> {
        onclickoutside?: EventHandler<UIEvent, T> | undefined | null;
        onconsider?: any;
        onfinalize?: any;
        onhold?: EventHandler<UIEvent, T> | undefined | null;
    }
}