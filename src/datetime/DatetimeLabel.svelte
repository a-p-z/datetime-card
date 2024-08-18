<svelte:options tag="datetime-label"/>

<script lang="ts">
    import type {IEntity, IHass} from "../types";
    import {formatDayString, getState, resetDate} from "./datetime";
    import {hold} from "../actions/hold";

    export let entity: IEntity = undefined;
    export let formatlabel: boolean;
    export let hass: IHass = undefined;
    export let resetforward: boolean;

    $: label = formatDayString(getState(hass, entity), formatlabel);
</script>

<div
        data-testid="days"
        title="hold to reset"
        use:hold
        on:hold={(event) => resetDate(entity, event, hass, resetforward ? 1 : 0)}
>
    {label}
</div>

<style>
    div {
        white-space: nowrap;
        cursor: pointer;
    }
</style>
