/// <reference types="svelte" />

declare namespace svelte.JSX {
    interface DOMAttributes<T extends EventTarget> {
        onhold?: EventHandler<UIEvent, T> | undefined | null;
    }
}