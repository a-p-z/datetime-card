import { get_current_component } from "svelte/internal";
import * as svelte from "svelte";

function createEventDispatcher(): (name: string, detail: any) => void {
    const component = get_current_component()
    const eventDispatcher = svelte.createEventDispatcher();
    return (name: string, detail: any): void => {
        eventDispatcher(name, detail);
        component.dispatchEvent(new CustomEvent(name, { detail }));
    }
}

export { createEventDispatcher };