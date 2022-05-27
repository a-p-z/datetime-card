/// <reference types="svelte" />

declare namespace svelte.JSX {
    interface DOMAttributes<T extends EventTarget> {
        onclickoutside?: EventHandler<UIEvent, T> | undefined | null;
        onhold?: EventHandler<UIEvent, T> | undefined | null;
    }
}