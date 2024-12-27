<svelte:options customElement="datetime-bar" />

<script lang="ts">
	import type {IEntity, IHass} from "../types";
	import { hold } from "../actions/hold";
	import { getState, isExpired, resetDate } from "./datetime";

	type Props = {
		entity: IEntity
		friendlyName: string;
		hass: IHass
		resetForward: boolean;
		showNames: boolean;
	};

	let { entity, friendlyName, hass, resetForward, showNames } = $props<Props>()

	let max = $derived<number>(entity?.max);
	let state = $derived<number>(getState(hass, entity));
	let barColor = $derived<"#df4c1e" | "#0da035">(isExpired(max, resetForward, state)	? "#df4c1e" : "#0da035");
	let barHeight = $derived<3 | 18>(showNames ? 18 : 3);
	let name = $derived<string>(friendlyName || hass?.states?.[entity?.id]?.attributes?.friendly_name);
	let barWidth = $derived<number>(Math.min(Math.abs((100 * (resetForward ? state + max : state)) / max), 100));
</script>

<div
	data-testid="external-bar"
	class="external-bar"
	style:height="{barHeight}px"
	title="hold to reset"
	use:hold
	onhold={(event) => resetDate(entity, event, hass, resetForward ? 1 : 0)}
>
	<div
		data-testid="internal-bar"
		class="internal-bar"
		style:width="{barWidth}%"
		style:height="{barHeight}px"
		style:background={barColor}
	></div>

	{#if showNames && !!name}
		<div
			data-testid="friendly-name"
			class="friendly-name"
			style:filter="drop-shadow(1px 1px 1px {barColor})"
		>
			{name}
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
