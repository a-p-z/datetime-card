<svelte:options tag="datetime-label" />

<script lang="ts">
	import type { IEntity, IHass } from "../types";
	import { getState, resetDate } from "./datetime";
	import { hold } from "../actions/hold";

	export let entity: IEntity = undefined;
	export let hass: IHass = undefined;

	$: label = hass?.localize("ui.duration.day", {
		count: getState(hass, entity),
	});
</script>

<div
	data-testid="days"
	title="hold to reset"
	use:hold
	on:hold={($event) => resetDate($event, hass, entity)}
>
	{label}
</div>

<style>
	div {
		white-space: nowrap;
		cursor: pointer;
	}
</style>
