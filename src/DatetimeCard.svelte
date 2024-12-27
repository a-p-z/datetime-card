<svelte:options
  customElement={{
    tag: "datetime-card",
    props: { config: { type: "Object" } },
    extend: (customElementConstructor) => {
      return class extends customElementConstructor {
        setConfig(config) {
          this.config = config;
        }

        static getConfigElement() {
          return document.createElement("datetime-card-editor");
        }
      };
    },
  }}
/>

<script module lang="ts">
  import { getState } from "./datetime/datetime";
  import type { IEntity, IHass } from "./types";

  function getDefaultEntities(hass: IHass): IEntity[] {
    const states = hass?.states || {};
    const id = Object.keys(states).find((id) =>
      id.startsWith("input_datetime"),
    );

    const max = 2 * getState(hass, { id } as IEntity);
    return id ? [{ id, max }] : [];
  }
</script>

<script lang="ts">
  import { isExpired } from "./datetime/datetime";
  import type { IConfig } from "./types";

  type Props = {
    config: IConfig;
    hass: IHass;
  };

  let { config, hass } = $props<Props>();

  let entities = $derived<IEntity[]>(
    config.entities || getDefaultEntities(hass),
  );
  let flexDirection = $derived<
    "column" | "column-reverse" | "row" | "row-reverse"
  >(config.flex_direction || "row");
  let formatLabel = $derived<boolean>(config.format_label || false);
  let header = $derived<string>(config.title || "Datetime Card");
  let resetForward = $derived<boolean>(config.reset_forward || false);
  let showExpiredOnly = $derived<boolean>(config.show_expired_only || false);
  let showNames = $derived<boolean>(config.show_names || false);
  let src = $derived<string>(
    config.image !== undefined
      ? config.image
      : "https://demo.home-assistant.io/stub_config/t-shirt-promo.png",
  );
</script>

<ha-card>
  {#if !!header}
    <h1 class="card-header">{header}</h1>
  {/if}

  <div
    data-testid="card-content"
    class="card-content"
    style:flex-direction={flexDirection}
  >
    {#if !!src}
      <img {src} alt="card-pict" />
    {/if}

    <div class="grid">
      {#each entities as entity}
        {#if !showExpiredOnly || isExpired(entity.max, resetForward, getState(hass, entity))}
          <datetime-icon role="listitem" {entity} {hass} {resetForward}
          ></datetime-icon>

          <datetime-bar
            {entity}
            friendlyName={entity.friendly_name}
            {hass}
            {resetForward}
            {showNames}
          ></datetime-bar>

          <datetime-label {entity} {formatLabel} {hass} {resetForward}
          ></datetime-label>
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
