<svelte:options tag="datetime-card-editor" />

<script lang="ts">
	import type { IAutocompleteItem, IConfig, IEntity, IHass } from "./types";
	import { createEventDispatcher } from "./svelte";

	export let hass: IHass = undefined;

	export function setConfig(config: IConfig): void {
		entities = config.entities || [{ id: "", max: 0 }];
		show_names = config.show_names || false;
		image = config.image || "";
		title = config.title || "";
	}

	$: autocompleteItems = Object.keys(hass?.states || {})
		.filter((entity_id) => entity_id.startsWith("input_datetime"))
		.map((entity_id) => toAutocompleteItem(entity_id));

	const svelteDispatch = createEventDispatcher();

	let entities: IEntity[] = [];
	let image: string;
	let show_names: boolean;
	let title: string;

	function dispatchConfigChanged(): void {
		const type = "custom:datetime-card";
		const config = { entities, image, show_names, title, type };
		svelteDispatch("config-changed", { config });
	}

	function push(): void {
		entities = [...entities, { id: "", max: 0 }];
		dispatchConfigChanged();
	}

	function splice(index: number): void {
		entities = [...entities];
		entities.splice(index, 1);
		dispatchConfigChanged();
	}

	function toAutocompleteItem(entity_id: string): IAutocompleteItem {
		const primaryText = hass.states[entity_id].attributes.friendly_name;
		const secondaryText = entity_id;
		return { primaryText, secondaryText, value: entity_id };
	}

	function updateTitle($event: Event): void {
		title = (<HTMLInputElement>$event.target).value;
		dispatchConfigChanged();
	}

	function updateImage($event: Event): void {
		image = (<HTMLInputElement>$event.target).value;
		dispatchConfigChanged();
	}

	function updateShowNames($event: Event): void {
		show_names = (<HTMLInputElement>$event.target).checked;
		dispatchConfigChanged();
	}

	function updateId($event: CustomEvent, entity: IEntity): void {
		entity.id = $event.detail.value;
		dispatchConfigChanged();
	}

	function updateMax($event: Event, entity: IEntity): void {
		const value = Number((<HTMLInputElement>$event.target).value);

		if (!Number.isInteger(value) || value < 0) {
			(<HTMLInputElement>$event.target).value = entity.max.toString();
			return;
		}

		(<HTMLInputElement>$event.target).value = value.toString();
		entity.max = value;
		dispatchConfigChanged();
	}
</script>

<ha-textfield
	data-testid="title"
	label="Title (optional)"
	value={title}
	on:input={updateTitle}
/>

<ha-textfield
	data-testid="image"
	label="Image (optional)"
	value={image}
	on:input={updateImage}
/>

<section class="switches">
	<ha-switch
		aria-labelledby="show-names-switch-label"
		checked={show_names}
		on:change={updateShowNames}
	/>
	<label id="show-names-switch-label" for="show-names-switch"
		>Show names</label
	>
</section>

<h3>Entities (required)</h3>

<section class="entities">
	{#each entities as entity, index}
		<div role="listitem" class="entity">
			<ha-icon class="handle" icon="mdi:drag" />

			<datetime-card-autocomplete
				data-testid="datetime-card-autocomplete-{index}"
				label="Entity"
				items={autocompleteItems}
				value={entity.id}
				on:change={($event) => updateId($event, entity)}
			/>

			<ha-textfield
				data-testid="max-{index}"
				class="max-textfield"
				label="Max"
				value={entity.max}
				on:input={($event) => updateMax($event, entity)}
			/>

			{#if entities.length > 1}
				<ha-icon-button
					data-testid="delete-{index}"
					{index}
					on:click={() => splice(index)}
				>
					<ha-icon icon="mdi:delete" {index} />
				</ha-icon-button>
			{/if}
		</div>
	{/each}
</section>
<div class="plus">
	<ha-icon-button data-testid="plus" class="plus" on:click={push}>
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

	.switches {
		margin-top: 10px;
		margin-top: 15px;
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

	.max-textfield {
		margin-left: 5px;
		max-width: 60px;
	}

	.plus {
		display: flex;
		justify-content: flex-end;
	}
</style>
