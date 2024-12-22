<svelte:options customElement="datetime-bar" />

<script lang="ts">
	import type {IEntity, IHass} from "../types";
	import { hold } from "../actions/hold";
	import { getState, isExpired, resetDate } from "./datetime";

	export let entity: IEntity = undefined;
	export let friendlyname: string = undefined;
	export let hass: IHass = undefined;
	export let resetforward: boolean;
	export let shownames: boolean = undefined;

	$: barColor = isExpired(max, resetforward, state) ? "#df4c1e" : "#0da035";
	$: barHeight = shownames && !!friendlyName ? 18 : 3;
	$: friendlyName = friendlyname || hass?.states?.[entity?.id]?.attributes?.friendly_name;
	$: barWidth = Math.min(Math.abs((100 * (resetforward ? state + max : state)) / max), 100);
	$: max = entity?.max;
	$: state = getState(hass, entity);
</script>

<div
	data-testid="external-bar"
	class="external-bar"
	style:height="{barHeight}px"
	title="hold to reset"
	use:hold
	on:hold={(event) => resetDate(entity, event, hass, resetforward ? 1 : 0)}
>
	<div
		data-testid="internal-bar"
		class="internal-bar"
		style:width="{barWidth}%"
		style:height="{barHeight}px"
		style:background={barColor}
	/>

	{#if shownames && !!friendlyName}
		<div
			data-testid="friendly-name"
			class="friendly-name"
			style:filter="drop-shadow(1px 1px 1px {barColor})"
		>
			{friendlyName}
		</div>
	{/if}
</div>

<style>
	.external-bar {
		position: relative;
		height: 3px;
		background: #a0dea0;
		flex-grow: 1;
		cursor: pointer;
	}

	.internal-bar {
		width: 0;
		height: 3px;
		max-width: 100%;
	}

	.friendly-name {
		position: absolute;
		top: 0;
		margin-left: 3px;
		color: white;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
