<svelte:options tag="datetime-bar" />

<script context="module" lang="ts">
	const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
</script>

<script lang="ts">
	import type { IEntity, IHass } from "./types";
	import { hold } from "./actions";

	export let entity: IEntity = undefined;
	export let hass: IHass = undefined;
	export let shownames: boolean = undefined;

	// exported for testing purpose
	export let callServiceButtonFactory = () =>
		document.createElement("ha-call-service-button");

	$: bar_color = state >= max ? "#df4c1e" : "#0da035";
	$: bar_height = shownames && !!friendlyName ? 18 : 3;
	$: friendlyName = hass?.states[entity?.id]?.attributes?.friendly_name;
	$: bar_width = Math.min(Math.abs((100 * state) / max), 100);
	$: icon = hass?.states[entity?.id]?.attributes?.icon;
	$: icon_color = state >= max ? "#df4c1e" : "#44739e";
	$: max = entity?.max;
	$: state = getState(hass, entity);

	function getState(hass: IHass, entity: IEntity): number {
		const date = Date.parse(hass?.states[entity?.id]?.state) || Date.now();
		return Math.floor((Date.now() - date) / MS_IN_A_DAY);
	}

	function resetDate($event: Event): void {
		const friendly_name = hass.states[entity.id].attributes.friendly_name;
		const entity_id = entity.id;
		const date = new Date().toISOString().split("T")[0];
		const element = callServiceButtonFactory();
		(<any>element).hass = hass;
		(<any>element).confirmation = `Do you want to reset ${friendly_name}?`;
		(<any>element).domain = "input_datetime";
		(<any>element).service = "set_datetime";
		(<any>element).serviceData = { entity_id, date };
		element.style.display = "none";
		(<any>$event.target).appendChild(element);
		(<any>element).buttonTapped();
		(<any>$event.target).removeChild(element);
	}
</script>

<div data-testid="content" class="content" use:hold on:hold={resetDate}>
	{#if !!icon}
		<ha-icon data-testid="icon" {icon} style:color={icon_color} />
	{/if}

	<div class="external-bar" style:height="{bar_height}px">
		<div
			data-testid="internal-bar"
			class="internal-bar"
			style:width="{bar_width}%"
			style:height="{bar_height}px"
			style:background={bar_color}
		/>

		{#if shownames && !!friendlyName}
			<div
				data-testid="friendly-name"
				class="friendly-name"
				style:filter="drop-shadow(1px 1px 1px {bar_color})"
			>
				{friendlyName}
			</div>
		{/if}
	</div>

	<div class="value">{state} days</div>
</div>

<style>
	.content {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		cursor: pointer;
	}

	.external-bar {
		position: relative;
		height: 3px;
		background: #a0dea0;
		flex-grow: 1;
	}

	.internal-bar {
		width: 0%;
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

	.value {
		margin-left: 5px;
	}
</style>
