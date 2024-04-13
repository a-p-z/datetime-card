<svelte:options tag="datetime-icon"/>

<script lang="ts">
    import type {IEntity, IHass} from "../types";
    import {getState, isExpired, resetDate} from "./datetime";
    import {hold} from "../actions/hold";

    export let entity: IEntity = undefined;
    export let hass: IHass = undefined;
    export let resetforward: boolean;

    $: icon = hass?.states?.[entity?.id]?.attributes?.icon;
    $: color = isExpired(max, resetforward, state) ? "#df4c1e" : "#44739e";
    $: max = entity?.max;
    $: state = getState(hass, entity);
    $: title = hass?.states?.[entity?.id]?.attributes?.friendly_name;
</script>

<ha-icon data-testid="icon" {icon} style:color
         title="hold to reset {title}"
         use:hold
         on:hold={(event) => resetDate(entity, event, hass, resetforward ? 1 : 0)}/>

<style>
</style>
