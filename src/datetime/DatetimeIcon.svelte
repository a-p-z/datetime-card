<svelte:options tag="datetime-icon" />

<script lang="ts">
	import type { IEntity, IHass } from "../types";
	import { getState } from "./datetime";

	export let entity: IEntity = undefined;
	export let hass: IHass = undefined;

	$: icon = hass?.states?.[entity?.id]?.attributes?.icon;
	$: color = state >= max ? "#df4c1e" : "#44739e";
	$: max = entity?.max;
	$: state = getState(hass, entity);
	$: title = hass?.states?.[entity?.id]?.attributes?.friendly_name;
</script>

<ha-icon data-testid="icon" {icon} style:color {title} />

<style>
</style>
