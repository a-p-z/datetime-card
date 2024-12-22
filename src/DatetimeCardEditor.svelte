<svelte:options customElement="datetime-card-editor"/>

<script lang="ts">
    import type {IAutocompleteItem, IConfig, IEntity, IHass} from "./types";
    import {createEventDispatcher} from "./svelte";
    import {dndzone} from "svelte-dnd-action";
    import {DraggableEntity} from "./draggable-entity";
    import {flip} from "svelte/animate";

    export let hass: IHass = undefined;

    export function setConfig(config: IConfig): void {
        column = config.flex_direction?.includes("column");
        draggableEntities = toDraggableEntities(config.entities);
        format_label = config.format_label || false;
        image = config.image || "";
        reset_forward = config.reset_forward || false;
        reverse = config.flex_direction?.includes("reverse");
        show_expired_only = config.show_expired_only || false;
        show_names = config.show_names || false;
        title = config.title || "";
    }

    $: autocompleteItems = Object.keys(hass?.states || {})
        .filter((entity_id) => entity_id.startsWith("input_datetime"))
        .map((entity_id) => toAutocompleteItem(entity_id));

    const dropTargetStyle = {outline: "var(--primary-color) solid 2px"};
    const flipDurationMs = 200;
    const svelteDispatch = createEventDispatcher();

    let column = false;
    let dragDisabled = true;
    let draggableEntities: DraggableEntity[] = [new DraggableEntity(1)];
    let format_label = false;
    let image: string;
    let key = 1;
    let reset_forward = false;
    let reverse = false;
    let show_expired_only = false;
    let show_names: boolean;
    let title: string;

    function consider(event: any): void {
        draggableEntities = event.detail.items;
    }

    function dispatchConfigChanged(): void {
        const type = "custom:datetime-card";
        const entities = draggableEntities.map(toEntity);
        const flex_direction =
            (column ? "column" : "row") + (reverse ? "-reverse" : "");
        const config = {
            entities,
            flex_direction,
            format_label,
            image,
            reset_forward,
            show_expired_only,
            show_names,
            title,
            type,
        };
        svelteDispatch("config-changed", {config});
    }

    function finalize(event: CustomEvent): void {
        draggableEntities = event.detail.items;
        dragDisabled = true;
        dispatchConfigChanged();
    }

    function newKey(): number {
        return key++;
    }

    function push(): void {
        draggableEntities = [
            ...draggableEntities,
            new DraggableEntity(newKey()),
        ];
    }

    function splice(_key: number): void {
        draggableEntities = draggableEntities.filter(({key}) => key !== _key);
        dispatchConfigChanged();
    }

    function startDrag(): void {
        if (draggableEntities.length < 2) {
            return;
        }

        dragDisabled = false;
    }

    function stopDrag(): void {
        dragDisabled = true;
    }

    function toAutocompleteItem(entity_id: string): IAutocompleteItem {
        const primaryText = hass.states[entity_id].attributes.friendly_name;
        const secondaryText = entity_id;
        return {primaryText, secondaryText, value: entity_id};
    }

    function toDraggableEntities(entities: IEntity[]): DraggableEntity[] {
        if (!entities) {
            return [new DraggableEntity(newKey())];
        }

        if (entities.length !== draggableEntities.length) {
            return entities.map(toDraggableEntity);
        }

        const result = [...draggableEntities];
        for (let i = 0; i < entities.length; i++) {
            const max = entities[i].max > 0 ? entities[i].max.toString() : "";
            result[i].friendly_name = entities[i].friendly_name || "";
            result[i].id = entities[i].id;
            result[i].max = max;
        }
        return result;
    }

    function toDraggableEntity({friendly_name, id, max}: IEntity): DraggableEntity {
        return {friendly_name, id, key: newKey(), max: max > 0 ? max.toString() : ""};
    }

    function toEntity({friendly_name, id, max}: DraggableEntity): IEntity {
        return {friendly_name, id, max: parseInt(max) || 0};
    }

    function updateColumn(event: Event): void {
        column = (<HTMLInputElement>event.target).checked;
        dispatchConfigChanged();
    }

    function updateFriendlyName(event: Event, entity: DraggableEntity): void {
        const value = (<HTMLInputElement>event.target).value;
        entity.friendly_name = value ? value : undefined;
        dispatchConfigChanged();
    }

    function updateShowExpiredOnly(event: Event): void {
        show_expired_only = (<HTMLInputElement>event.target).checked;
        dispatchConfigChanged();
    }

    function updateId(event: CustomEvent, entity: DraggableEntity): void {
        entity.id = event.detail.value;
        dispatchConfigChanged();
    }

    function updateImage(event: Event): void {
        image = (<HTMLInputElement>event.target).value;
        dispatchConfigChanged();
    }

    function updateMax(event: Event, entity: DraggableEntity): void {
        const value = Number((<HTMLInputElement>event.target).value);

        if (!Number.isInteger(value) || value < 0) {
            (<HTMLInputElement>event.target).value = entity.max;
            return;
        }

        (<HTMLInputElement>event.target).value = value.toString();
        entity.max = value.toString();
        dispatchConfigChanged();
    }

    function updateFormatLabel(event: Event): void {
        format_label = (<HTMLInputElement>event.target).checked;
        dispatchConfigChanged();
    }

    function updateResetForward(event: Event): void {
        reset_forward = (<HTMLInputElement>event.target).checked;
        dispatchConfigChanged();
    }

    function updateReverse(event: Event): void {
        reverse = (<HTMLInputElement>event.target).checked;
        dispatchConfigChanged();
    }

    function updateShowNames(event: Event): void {
        show_names = (<HTMLInputElement>event.target).checked;
        dispatchConfigChanged();
    }

    function updateTitle(event: Event): void {
        title = (<HTMLInputElement>event.target).value;
        dispatchConfigChanged();
    }
</script>

<ha-textfield
        data-testid="title"
        label="Title (optional)"
        value={title}
        on:input={updateTitle}
></ha-textfield>

<ha-textfield
        data-testid="image"
        label="Image (optional)"
        value={image}
        on:input={updateImage}
></ha-textfield>

<section class="switches">
    <ha-switch
            id="column-switch"
            aria-label="Column"
            checked={column}
            on:change={updateColumn}
    ></ha-switch>
    <label for="column-switch">Column</label>

    <ha-switch
            id="format-label-switch"
            aria-label="Format label"
            checked={format_label}
            on:change={updateFormatLabel}
    ></ha-switch>
    <label for="format-label-switch">Format label</label>

    <ha-switch
            id="reset-forward-switch"
            aria-label="Reset forward"
            checked={reset_forward}
            on:change={updateResetForward}
    ></ha-switch>
    <label for="reset-forward-switch">Reset forward</label>

    <ha-switch
            id="reverse-switch"
            aria-label="Reverse"
            checked={reverse}
            on:change={updateReverse}
    ></ha-switch>
    <label for="reverse-switch">Reverse</label>

    <ha-switch
            id="show-expired-only-switch"
            aria-label="Show expired only"
            checked={show_expired_only}
            on:change={updateShowExpiredOnly}
    ></ha-switch>
    <label for="show-expired-only-switch">Show expired only</label>

    <ha-switch
            id="show-names-switch"
            aria-label="Show names"
            checked={show_names}
            on:change={updateShowNames}
    ></ha-switch>
    <label for="show-names-switch">Show names</label>
</section>

<h3>Entities (required)</h3>

<section
        data-testid="entities"
        class="entities"
        use:dndzone={{
		items: draggableEntities,
		dragDisabled,
		dropTargetStyle,
		flipDurationMs,
	}}
        on:consider={consider}
        on:finalize={finalize}
>
    {#each draggableEntities as entity, index (entity.key)}
        <div
                role="listitem"
                class="entity"
                animate:flip={{ duration: flipDurationMs }}
        >
            <ha-icon
                    data-testid="handle-{index}"
                    class="handle"
                    icon="mdi:drag"
                    role="menuitem"
                    on:mousedown={startDrag}
                    on:touchstart={startDrag}
                    on:mouseup={stopDrag}
                    on:touchend={stopDrag}
            ></ha-icon>
            <datetime-card-autocomplete
                    data-testid="datetime-card-autocomplete-{index}"
                    label="Entity"
                    items={autocompleteItems}
                    value={entity.id}
                    on:change={(event) => updateId(event, entity)}
            ></datetime-card-autocomplete>

            <ha-textfield
                    data-testid="max-{index}"
                    class="max-textfield"
                    label="Max"
                    value={entity.max}
                    on:input={(event) => updateMax(event, entity)}
            ></ha-textfield>

            {#if draggableEntities.length > 1}
                <ha-icon-button
                        data-testid="delete-{index}"
                        role="menuitem"
                        on:click={() => splice(entity.key)}
                        on:keypress={()=>{}}
                >
                    <ha-icon icon="mdi:delete"></ha-icon>
                </ha-icon-button>
            {:else }
                <div></div>
            {/if}
            <div></div>
            <ha-textfield
                    data-testid="friendly-name-{index}"
                    class="friendly-name"
                    label="Friendly name"
                    value={entity.friendly_name}
                    on:input={(event) => updateFriendlyName(event, entity)}
            ></ha-textfield>
            <div></div>
            <div></div>
        </div>
    {/each}
</section>
<div class="plus">
    <ha-icon-button data-testid="plus" class="plus"
                    role="button"
                    on:click={push} on:keypress={()=>{}}>
        <ha-icon icon="mdi:plus"></ha-icon>
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

    ha-switch {
        margin-left: 30px;
    }

    .entity {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        margin-bottom: 5px;
    }

    .handle {
        cursor: grab;
        padding-right: 8px;
        width: 32px;
    }

    .max-textfield {
        margin: 0 0 0 5px;
        max-width: 60px;
    }

    .plus {
        display: flex;
        justify-content: flex-end;
    }

    .switches {
        display: flex;
        flex-wrap: wrap;
        gap: 16px 6px;
        margin: 16px 0;
    }
</style>
