<svelte:options tag="datetime-card" />

<script context="module" lang="ts">
	const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
	const DEFAULT_SRC =
		"https://demo.home-assistant.io/stub_config/t-shirt-promo.png";
	const DEFAULT_TITLE = "Datetime Card";

	function getDefaultEntities(hass: IHass): IEntity[] {
		const states = hass?.states || {};
		const id = Object.keys(states).find((entity) =>
			entity.startsWith("input_datetime")
		);
		const date = Date.parse(hass?.states[id]?.state) || Date.now();
		const max = 2 * Math.floor((Date.now() - date) / MS_IN_A_DAY);
		return !!id ? [{ id, max }] : [];
	}
</script>

<script lang="ts">
	import type { IConfig, IEntity, IHass } from "./types";

	export let hass: IHass = undefined;

	export function setConfig(config: IConfig): void {
		entities = config.entities;
		header = config.title !== undefined ? config.title : DEFAULT_TITLE;
		src = config.image !== undefined ? config.image : DEFAULT_SRC;
	}

	$: entities = entities || getDefaultEntities(hass);

	let header: string;
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
		<div class="datetime-bars">
			{#each entities as entity}
				<datetime-bar role="listitem" {entity} {hass} />
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

	.datetime-bars {
		flex-grow: 1;
		margin-left: 5px;
	}
</style>
