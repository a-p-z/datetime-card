<svelte:options tag="datetime-card" />

<script context="module" lang="ts">
	import { getState } from "./datetime/datetime";
	import type { IEntity, IHass } from "./types";

	const DEFAULT_SRC =
		"https://demo.home-assistant.io/stub_config/t-shirt-promo.png";
	const DEFAULT_TITLE = "Datetime Card";

	function getDefaultEntities(hass: IHass): IEntity[] {
		const states = hass?.states || {};
		const id = Object.keys(states).find((id) =>
			id.startsWith("input_datetime")
		);

		const max = 2 * getState(hass, { id } as IEntity);
		return !!id ? [{ id, max }] : [];
	}
</script>

<script lang="ts">
	import type { IConfig } from "./types";
	import { isExpired } from "./datetime/datetime";

	export let hass: IHass = undefined;

	export function setConfig(config: IConfig): void {
		entities = config.entities;
		flex_direction = config.flex_direction || "row";
		formatlabel = config.format_label || false;
		header = config.title !== undefined ? config.title : DEFAULT_TITLE;
		resetforward = config.reset_forward || false;
		showExpiredOnly = config.show_expired_only || false;
		shownames = config.show_names || false;
		src = config.image !== undefined ? config.image : DEFAULT_SRC;
	}

	$: entities = entities || getDefaultEntities(hass);

	let flex_direction = "row";
	let formatlabel: boolean;
	let header: string;
	let resetforward: boolean;
	let showExpiredOnly: boolean;
	let shownames: boolean;
	let src: string;
</script>

<ha-card>
	{#if !!header}
		<h1 class="card-header">{header}</h1>
	{/if}

	<div
		data-testid="card-content"
		class="card-content"
		style:flex-direction={flex_direction}
	>
		{#if !!src}
			<img {src} alt="card-pict" />
		{/if}

		<div class="grid">
			{#each entities as entity}
                {#if !showExpiredOnly || isExpired(entity.max, resetforward, getState(hass, entity)) }
                    <datetime-icon role="listitem" {entity} {hass} {resetforward} />

                    <datetime-bar {entity} friendlyname="{entity.friendly_name}" {hass} {resetforward} {shownames} />

                    <datetime-label {entity} {formatlabel} {hass} {resetforward}/>
                {/if}
			{/each}
		</div>
	</div>
</ha-card>

<style>
	.card-header {
		overflow: hidden;
		text-overflow: ellipsis !important;
		white-space: nowrap;
	}

	.card-content {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	img {
		max-width: 40%;
	}

	.grid {
		display: grid;
		flex-grow: 1;
		grid-template-columns: 24px auto min-content;
		margin: 10px;
		gap: 10px;
		align-items: center;
		width: 100%;
	}

	datetime-label {
		justify-self: end;
	}
</style>
