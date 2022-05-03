<svelte:options tag="datetime-card-editor" />

<script lang="ts">
	import type { IConfig, IEntity } from "./types";

	export function setConfig(config: IConfig): void {
		entities = config.entities || [{ id: "", max: 0 }];
		image = config.image || "";
		title = config.title || "";
	}

	// exported for testing purpose
	export function titleChanged($event: Event): void {
		title = ($event.target as HTMLInputElement).value;
		configChanged($event);
	}

	// exported for testing purpose
	export function imageChanged($event: Event): void {
		image = ($event.target as HTMLInputElement).value;
		configChanged($event);
	}

	// exported for testing purpose
	export function maxChanged($event: Event): void {
		const max = parseInt(($event.target as HTMLInputElement).value);
		const index = parseInt(
			($event.target as HTMLInputElement).attributes["index"]?.value
		);

		entities = [...entities];
		entities[index] = { ...entities[index], max };

		configChanged($event);
	}

	// exported for testing purpose
	export function idChanged($event: Event): void {
		const id = ($event.target as HTMLInputElement).value;
		const index = parseInt(
			($event.target as HTMLInputElement).attributes["index"]?.value
		);

		entities = [...entities];
		entities[index] = { ...entities[index], id };

		configChanged($event);
	}

	function configChanged({ target }): void {
		const type = "custom:datetime-card";
		const event = new Event("config-changed", {
			bubbles: true,
			composed: true,
		});

		(<any>event).detail = { config: { entities, image, title, type } };
		target.dispatchEvent(event);
	}

	function splice($event: Event): void {
		const index = parseInt(
			($event.target as HTMLInputElement).attributes["index"].value
		);

		entities = [...entities];
		entities.splice(index, 1);

		configChanged($event);
	}

	function add($event: Event): void {
		entities = [...entities, { id: "", max: 0 }];
		configChanged($event);
	}

	let entities: IEntity[] = [];
	let image: string;
	let title: string;
</script>

<ha-textfield
	data-testid="title"
	label="Title (optional)"
	value={title}
	on:input={titleChanged}
/>

<ha-textfield
	data-testid="image"
	label="Image (optional)"
	value={image}
	on:input={imageChanged}
/>

<h3>Entities (required)</h3>

<div class="entities">
	{#each entities as { id, max }, index}
		<div role="listitem" class="entity">
			<ha-icon class="handle" icon="mdi:drag" />
			<ha-textfield
				data-testid="entity-{index}"
				class="entity-textfield"
				label="Entity"
				{index}
				value={id}
				on:input={idChanged}
			/>
			<ha-textfield
				data-testid="max-{index}"
				class="max-textfield"
				label="Max"
				{index}
				value={max}
				on:input={maxChanged}
			/>
			{#if entities.length > 1}
				<ha-icon-button
					data-testid="delete-{index}"
					{index}
					on:click={splice}
				>
					<ha-icon icon="mdi:delete" {index} />
				</ha-icon-button>
			{/if}
		</div>
	{/each}
</div>
<div class="plus">
	<ha-icon-button data-testid="plus" class="plus" on:click={add}>
		<ha-icon icon="mdi:plus" />
	</ha-icon-button>
</div>

<style>
	:host {
		display: flex;
		flex-direction: column;
	}

	ha-textfield {
		margin-top: 3px;
		margin-bottom: 5px;
	}

	.entity {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
	}

	.handle {
		padding-right: 8px;
		cursor: move;
	}

	.entity-textfield {
		flex-grow: 1;
	}

	.max-textfield {
		margin-left: 5px;
		max-width: 60px;
	}

	.plus {
		display: flex;
		justify-content: flex-end;
	}
</style>
