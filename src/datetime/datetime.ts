import type { IEntity, IHass } from "../types";
import { setDatetimeServiceFactory } from "../hass";

const MS_IN_A_DAY = 1000 * 60 * 60 * 24;

function getState(hass: IHass, entity: IEntity): number {
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localDateTime = Date.now() - tzOffset;
    const date = Date.parse(hass?.states?.[entity?.id]?.state) || localDateTime;
    return Math.floor((localDateTime - date) / MS_IN_A_DAY);
}

function resetDate($event: Event, hass: IHass, entity: IEntity): void {
    const friendly_name = hass.states[entity.id].attributes.friendly_name;
    const entity_id = entity.id;
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localDateTime = new Date(Date.now() - tzOffset);
    const localDate = localDateTime.toISOString().split("T")[0];
    const confirmation = `Do you want to reset ${friendly_name}?`;
    const element = setDatetimeServiceFactory(
        hass,
        confirmation,
        entity_id,
        localDate
    );
    (<any>$event.target).appendChild(element);
    (<any>element)._buttonTapped();
    (<any>$event.target).removeChild(element);
}

export { getState, resetDate }