<svelte:options customElement="datetime-label"/>

<script lang="ts">
    import type {IEntity, IHass} from "../types";
    import {formatDayString, getState, resetDate} from "./datetime";
    import {hold} from "../actions/hold";

    type Props = {
        entity: IEntity;
        formatLabel: boolean;
        hass: IHass;
        resetForward: boolean;
    };

    let { entity, formatLabel, hass, resetForward } = $props<Props>();

    let label = $derived<string>(formatDayString(getState(hass, entity), formatLabel));
</script>

<div
        data-testid="days"
        title="hold to reset"
        use:hold
        onhold={(event) => resetDate(entity, event, hass, resetForward ? 1 : 0)}
>
    {label}
</div>

<style>
    div {
        white-space: nowrap;
        cursor: pointer;
    }
</style>
