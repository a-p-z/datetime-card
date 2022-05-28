import type { IEntity, IHass } from "../types";
import { setDatetimeServiceFactory } from "../hass";

const MS_IN_A_DAY = 1000 * 60 * 60 * 24;

function getState(hass: IHass, entity: IEntity): number {
    const date = Date.parse(hass?.states?.[entity?.id]?.state) || Date.now();
    return Math.floor((Date.now() - date) / MS_IN_A_DAY);
}

function resetDate($event: Event, hass: IHass, entity: IEntity): void {
    const friendly_name = hass.states[entity.id].attributes.friendly_name;
    const entity_id = entity.id;
    const date = new Date().toISOString().split("T")[0];
    const confirmation = `Do you want to reset ${friendly_name}?`;
    const element = setDatetimeServiceFactory(
        hass,
        confirmation,
        entity_id,
        date
    );
    (<any>$event.target).appendChild(element);
    (<any>element).buttonTapped();
    (<any>$event.target).removeChild(element);
}

export { getState, resetDate }