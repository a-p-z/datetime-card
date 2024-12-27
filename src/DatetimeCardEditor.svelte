<svelte:options
  customElement={{
    tag: "datetime-card-editor",
    props: { config: { type: "Object" } },
    extend: (customElementConstructor) => {
      return class extends customElementConstructor {
        setConfig(config) {
          this.config = config;
        }
      };
    },
  }}
/>

<script lang="ts">
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { draggable, droppable, type DragDropState } from "@thisux/sveltednd";
  import type { IAutocompleteItem, IConfig, IEntity, IHass } from "./types";
  import { DraggableEntity } from "./draggable-entity";

  type Props = {
    config: IConfig;
    hass: IHass;
  };
  type InputEvent = {
    target: HTMLInputElement;
  };

  const FLIP_DURATION = 200;
  const FADE_DURATION = 150;

  let { config, hass } = $props<Props>();

  let column = $state<boolean>(false);
  let dragDisabled = $state<boolean>(true);
  let draggableEntities = $state<DraggableEntity[]>([]);
  let formatLabel = $state<boolean>(false);
  let image = $state<string>("");
  let key = $state<number>(1);
  let resetForward = $state<boolean>(false);
  let reverse = $state<boolean>(false);
  let showExpiredOnly = $state<boolean>(false);
  let showNames = $state<boolean>(false);
  let title = $state<string>("");

  let autocompleteItems = $derived(
    Object.keys(hass.states || {})
      .filter((entity_id) => entity_id.startsWith("input_datetime"))
      .map((entity_id) => toAutocompleteItem(entity_id)),
  );

  $effect(() => {
    setTimeout(() => {
      column = config.flex_direction?.includes("column");
      draggableEntities = config.entities?.map(toDraggableEntity) || [
        { id: "", key: (() => key)(), max: "" },
      ];
      formatLabel = config.format_label || false;
      image = config.image || "";
      resetForward = config.reset_forward || false;
      reverse = config.flex_direction?.includes("reverse");
      showExpiredOnly = config.show_expired_only || false;
      showNames = config.show_names || false;
      title = config.title || "";
    }, 0);
  });

  function addDraggableEntity(): void {
    draggableEntities = [...draggableEntities, new DraggableEntity(newKey())];
  }

  function deleteDraggableEntity(k: number): void {
    draggableEntities = draggableEntities.filter(({ key }) => key !== k);
    dispatchConfigChanged();
  }

  function dispatchConfigChanged(): void {
    const type = "custom:datetime-card";
    const entities = draggableEntities.map(toEntity);
    const flex_direction =
      (column ? "column" : "row") + (reverse ? "-reverse" : "");
    const config = {
      entities,
      flex_direction,
      format_label: formatLabel,
      image,
      reset_forward: resetForward,
      show_expired_only: showExpiredOnly,
      show_names: showNames,
      title,
      type,
    };

    $host().dispatchEvent(
      new CustomEvent("config-changed", { detail: { config } }),
    );
  }

  function handleDrop(state: DragDropState<DraggableEntity>) {
    const { draggedItem, targetContainer } = state;
    const dragIndex = draggableEntities.findIndex(
      (entity: DraggableEntity) => entity.key === draggedItem.key,
    );
    const dropIndex = parseInt(targetContainer ?? "0");

    if (dragIndex !== -1 && !isNaN(dropIndex)) {
      const [entity] = draggableEntities.splice(dragIndex, 1);
      draggableEntities.splice(dropIndex, 0, entity);
    }
    dispatchConfigChanged();
  }

  function newKey(): number {
    return ++key;
  }

  function toAutocompleteItem(entity_id: string): IAutocompleteItem {
    const primaryText = hass.states[entity_id].attributes.friendly_name;
    const secondaryText = entity_id;
    return { primaryText, secondaryText, value: entity_id };
  }

  function toDraggableEntity({
    friendly_name,
    id,
    max,
  }: IEntity): DraggableEntity {
    return {
      friendly_name,
      id,
      key: newKey(),
      max: max > 0 ? max.toString() : "",
    };
  }

  function toEntity({ friendly_name, id, max }: DraggableEntity): IEntity {
    return { friendly_name, id, max: parseInt(max) || 0 };
  }

  function updateColumn({ target }: InputEvent): void {
    column = target.checked;
    dispatchConfigChanged();
  }

  function updateId(id: string, entity: DraggableEntity): void {
    draggableEntities = draggableEntities.map((e) =>
      e === entity ? { ...e, id: id } : e,
    );
    dispatchConfigChanged();
  }

  function updateFormatLabel({ target }: InputEvent): void {
    formatLabel = target.checked;
    dispatchConfigChanged();
  }

  function updateFriendlyName(
    { target }: InputEvent,
    entity: DraggableEntity,
  ): void {
    const friendly_name = target.value;
    draggableEntities = draggableEntities.map((e) =>
      e === entity ? { ...e, friendly_name } : e,
    );
    dispatchConfigChanged();
  }

  function updateImage({ target }: InputEvent): void {
    image = target.value;
    dispatchConfigChanged();
  }

  function updateMax({ target }: InputEvent, entity: DraggableEntity): void {
    const value = Number(target.value);

    if (!Number.isInteger(value) || value < 0) {
      input.value = entity.max;
      return;
    }

    target.value = value.toString();
    entity.max = value;
    dispatchConfigChanged();
  }

  function updateResetForward({ target }: InputEvent): void {
    resetForward = target.checked;
    dispatchConfigChanged();
  }

  function updateReverse({ target }: InputEvent): void {
    reverse = target.checked;
    dispatchConfigChanged();
  }

  function updateShowExpiredOnly({ target }: InputEvent): void {
    showExpiredOnly = target.checked;
    dispatchConfigChanged();
  }

  function updateShowNames({ target }: InputEvent): void {
    showNames = target.checked;
    dispatchConfigChanged();
  }

  function updateTitle({ target }: InputEvent): void {
    title = target.value;
    dispatchConfigChanged();
  }
</script>

<ha-textfield
  data-testid="title"
  label="Title (optional)"
  value={title}
  oninput={updateTitle}
></ha-textfield>

<ha-textfield
  data-testid="image"
  label="Image (optional)"
  value={image}
  oninput={updateImage}
></ha-textfield>

<section class="switches">
  <ha-switch
    id="column-switch"
    aria-label="Column"
    checked={column}
    onchange={updateColumn}
  ></ha-switch>
  <label for="column-switch">Column</label>

  <ha-switch
    id="format-label-switch"
    aria-label="Format label"
    checked={formatLabel}
    onchange={updateFormatLabel}
  ></ha-switch>
  <label for="format-label-switch">Format label</label>

  <ha-switch
    id="reset-forward-switch"
    aria-label="Reset forward"
    checked={resetForward}
    onchange={updateResetForward}
  ></ha-switch>
  <label for="reset-forward-switch">Reset forward</label>

  <ha-switch
    id="reverse-switch"
    aria-label="Reverse"
    checked={reverse}
    onchange={updateReverse}
  ></ha-switch>
  <label for="reverse-switch">Reverse</label>

  <ha-switch
    id="show-expired-only-switch"
    aria-label="Show expired only"
    checked={showExpiredOnly}
    onchange={updateShowExpiredOnly}
  ></ha-switch>
  <label for="show-expired-only-switch">Show expired only</label>

  <ha-switch
    id="show-names-switch"
    aria-label="Show names"
    checked={showNames}
    onchange={updateShowNames}
  ></ha-switch>
  <label for="show-names-switch">Show names</label>
</section>

<h3>Entities (required)</h3>

<section data-testid="entities" class="entities">
  {#each draggableEntities as entity, index (entity.key)}
    <div
      role="listitem"
      class="entity"
      animate:flip={{ duration: FLIP_DURATION }}
      in:fade={{ duration: FADE_DURATION }}
      out:fade={{ duration: FADE_DURATION }}
      use:draggable={{
        container: index.toString(),
        disabled: dragDisabled,
        dragData: entity,
      }}
      use:droppable={{
        container: index.toString(),
        callbacks: { onDrop: handleDrop },
      }}
    >
      {#if draggableEntities.length > 1}
        <div class="handle">
          <ha-icon
            data-testid="handle-{index}"
            icon="mdi:drag"
            role="menuitem"
            tabindex="0"
            onmousedown={() => (dragDisabled = false)}
            ontouchstart={() => (dragDisabled = false)}
            onmouseup={() => (dragDisabled = true)}
            ontouchend={() => (dragDisabled = true)}
          ></ha-icon>
        </div>
      {:else}
        <div class="handle"></div>
      {/if}
      <datetime-card-autocomplete
        data-testid="datetime-card-autocomplete-{index}"
        label="Entity"
        items={autocompleteItems}
        value={entity.id}
        updateId={(id) => updateId(id, entity)}
      ></datetime-card-autocomplete>
      <ha-textfield
        data-testid="max-{index}"
        class="max-textfield"
        label="Max"
        value={entity.max}
        oninput={(event) => updateMax(event, entity)}
      ></ha-textfield>

      {#if draggableEntities.length > 1}
        <ha-icon-button
          class="delete"
          data-testid="delete-{index}"
          role="menuitem"
          tabindex="0"
          onclick={() => deleteDraggableEntity(entity.key)}
          onkeydown={() => {}}
        >
          <ha-icon icon="mdi:delete"></ha-icon>
        </ha-icon-button>
      {:else}
        <div class="delete"></div>
      {/if}

      <div></div>

      <ha-textfield
        data-testid="friendly-name-{index}"
        label="Friendly name"
        value={entity.friendly_name || ""}
        oninput={(event) => updateFriendlyName(event, entity)}
      ></ha-textfield>
      <div></div>
      <div></div>
    </div>
  {/each}
</section>
<div class="plus">
  <ha-icon-button
    data-testid="plus"
    class="plus"
    role="button"
    tabindex="0"
    onclick={addDraggableEntity}
    onkeydown={() => {}}
  >
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

  .delete {
    padding-right: 8px;
    width: 32px;
  }

  .entity {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    margin-bottom: 5px;
  }

  .handle {
    padding-right: 8px;
    padding-top: 16px;
    width: 32px;
  }

  .handle > ha-icon {
    cursor: grab;
  }

  :global(.dragging > .handle > ha-icon) {
    cursor: grabbing;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
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
