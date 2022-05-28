import DatetimeCard from './DatetimeCard.svelte'
import { overrideItemIdKeyNameBeforeInitialisingDndZones } from "svelte-dnd-action";

export * from './DatetimeBar.svelte'
export * from './DatetimeCard.svelte'
export * from './DatetimeCardAutocomplete.svelte'
export * from './DatetimeCardEditor.svelte'

declare global {
    interface Window {
        customCards?: any[]; // Todo: Find correct type
    }
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "datetime-card",
    name: "Datetime Card",
    preview: true,
    description: "Datetime card",
});

(<any>DatetimeCard).getConfigElement = () => document.createElement("datetime-card-editor");
overrideItemIdKeyNameBeforeInitialisingDndZones("key");