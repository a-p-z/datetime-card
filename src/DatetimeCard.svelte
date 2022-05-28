<svelte:options tag="datetime-card" />

<script context="module" lang="ts">
	import { getState } from "./datetime/datetime";

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
	import type { IConfig, IEntity, IHass } from "./types";

	export let hass: IHass = undefined;

	export function setConfig(config: IConfig): void {
		entities = config.entities;
		header = config.title !== undefined ? config.title : DEFAULT_TITLE;
		shownames = config.show_names || false;
		src = config.image !== undefined ? config.image : DEFAULT_SRC;
	}

	$: entities = entities || getDefaultEntities(hass);

	let header: string;
	let shownames: boolean;
	let src: string;
</script>

<ha-card>
	{#if !!header}
		<h1 class="card-header">{header}</h1>
	{/if}

	<div class="card-content">
		{#if !!src}
			<img {src} alt="card-pict" />
		{/if}
		<div class="grid">
			{#each entities as entity}
				<datetime-icon role="listitem" {entity} {hass} />

				<datetime-bar {entity} {hass} {shownames} />

				<datetime-label {entity} {hass} />
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
		max-width: 50%;
	}

	.grid {
		display: grid;
		flex-grow: 1;
		grid-template-columns: 24px auto min-content;
		margin-left: 5px;
		gap: 10px;
		align-items: center;
	}

	datetime-label {
		justify-self: end;
	}
</style>
