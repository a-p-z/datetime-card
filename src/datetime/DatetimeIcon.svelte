<svelte:options customElement="datetime-icon"/>

<script lang="ts">
    import type {IEntity, IHass} from "../types";
    import {getState, isExpired, resetDate} from "./datetime";
    import {hold} from "../actions/hold";

    type Props = {
        entity: IEntity;
        hass: IHass;
        resetForward: boolean;
    };

    let { entity, hass, resetForward}  = $props<Props>();

    let max = $derived<number>(entity?.max);
    let state = $derived<number>(getState(hass, entity));
    let icon = $derived<string>(hass?.states?.[entity?.id]?.attributes?.icon);
    let color = $derived<"#df4c1e" | "#44739e">(isExpired(max, resetForward, state) ? "#df4c1e" : "#44739e");
    let title = $derived<string>(hass?.states?.[entity?.id]?.attributes?.friendly_name);
</script>

<ha-icon data-testid="icon" {icon} style:color
         title="hold to reset {title}"
         use:hold
         onhold={(event) => resetDate(entity, event, hass, resetForward ? 1 : 0)}>
</ha-icon>

<style>
</style>
