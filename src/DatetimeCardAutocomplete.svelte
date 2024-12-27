<svelte:options customElement="datetime-card-autocomplete" />

<script lang="ts">
    import { clickoutside } from "./actions/clickoutside";
    import type { IAutocompleteItem } from "./types";

    type Props = {
		items: IAutocompleteItem[];
        label: string;
        updateId: (value: string) => void;
        value: string;
	};

    let { items=[], label="", updateId, value="" } = $props<Props>();

    let filteredItems = $state<IAutocompleteItem[]>([]);

    function filter({ target }: { target: HTMLInputElement }): void {
        value = target.value;
        updateId(value);

        const filterText = value
            .trim()
            .replace(/[\-\[\]\/{}()*+?.\\^$|]/g, "\\$&");

        if (filterText.length < 3) {
            filteredItems = [];
            return;
        }

        const regex = new RegExp(filterText, "gi");

        filteredItems = items
            .filter((item) => test(item, regex))
            .map((item) => highlightMatch(item, regex));
    }

    function highlightMatch(item: IAutocompleteItem, regex: RegExp): IAutocompleteItem {
        const primaryText = item.primaryText.replace(
            regex,
            (match: string) => `<strong>${match}</strong>`
        );

        const secondaryText = item.secondaryText?.replace(
            regex,
            (match: string) => `<strong>${match}</strong>`
        );

        const value = item.value;

        return { primaryText, secondaryText, value };
    }

    function test(item: IAutocompleteItem, regex: RegExp): boolean {
        return regex.test(item.primaryText) || regex.test(item.secondaryText);
    }

    function reset(): void {
        setTimeout(() => (filteredItems = []), 100);
    }
</script>

<ha-textfield
    data-testid="text-field"
    {label}
    {value}
    oninput={filter}
></ha-textfield>

{#if filteredItems.length > 0 && value !== filteredItems[0].value}
    <ul
        class="items-list"
        use:clickoutside
        onclickoutside={reset}
    >
        {#each filteredItems as { primaryText, secondaryText, value }}
            <li class="item" role="menuitem" onclick={() => updateId(value)} onkeydown={()=>{}}>
                <span class="primary-text">{@html primaryText}</span>
                {#if !!secondaryText}
                    <span class="secondary-text">{@html secondaryText}</span>
                {/if}
            </li>
        {/each}
    </ul>
{/if}

<style>
    :host {
        flex-grow: 1;
        height: 56px;
    }

    ha-textfield {
        width: 100%;
    }

    .items-list {
        margin: 0;
        padding: 0;
        position: relative;
        z-index: 1;
        border-left: 1px solid var(--input-outlined-idle-border-color);
        border-right: 1px solid var(--input-outlined-idle-border-color);
        border-bottom: 1px solid var(--input-outlined-idle-border-color);
    }

    .item {
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 10px 10px 10px 25px;
        cursor: pointer;
    background-color: var(--material-background-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item:hover {
    background-color: var(--material-secondary-background-color);
    }

    .primary-text {
        color: var(--mdc-dialog-content-ink-color, rgba(0, 0, 0, 0.6));
    }

    .secondary-text {
        font-size: 0.9em;
        color: var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6));
    }
</style>
