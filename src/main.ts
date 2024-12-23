import DatetimeCard from './DatetimeCard.svelte'
import { overrideItemIdKeyNameBeforeInitialisingDndZones } from "svelte-dnd-action";

export * from './datetime/DatetimeBar.svelte'
export * from './datetime/DatetimeIcon.svelte'
export * from './datetime/DatetimeLabel.svelte'
export * from './DatetimeCard.svelte'
export * from './DatetimeCardAutocomplete.svelte'
export * from './DatetimeCardEditor.svelte'

type CustomCard = {
    type: string;
    name: string;
    preview?: boolean;
    description?: string;
    documentationURL: string;
}

declare global {
    interface Window {
        customCards?: CustomCard[];
    }
}

window.customCards = window.customCards || [];
window.customCards.push({
    type: "datetime-card",
    name: "Datetime Card",
    preview: true,
    description: "Datetime card",
    documentationURL: "https://github.com/a-p-z/datetime-card",
});

(<any>DatetimeCard).getConfigElement = () => document.createElement("datetime-card-editor");
overrideItemIdKeyNameBeforeInitialisingDndZones("key");