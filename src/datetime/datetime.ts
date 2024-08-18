import type {IEntity, IHass} from "../types";
import {setDatetimeServiceFactory} from "../hass";

function formatDayString(days: number, formatLabel: boolean): string {
    const sign = days >= 0 ? "" : "-";
    const absoluteDays = Math.abs(days);

    if (!formatLabel || absoluteDays < 30) {
        const dayString = absoluteDays !== 1 ? 'days' : 'day';
        return `${sign}${absoluteDays} ${dayString}`;
    }

    const months = Math.floor(absoluteDays / 30);
    const remainingDays = absoluteDays % 30;
    const monthString = months !== 1 ? 'months' : 'month';
    const dayString = remainingDays !== 1 ? 'days' : 'day';

    if (remainingDays === 0) {
        return `${sign}${months} ${monthString}`;
    }
    return `${sign}${months} ${monthString}, ${remainingDays} ${dayString}`;
}

function getState(hass?: IHass, entity?: IEntity): number {
    const entityDate = hass?.states?.[entity?.id]?.state ? new Date(hass.states[entity?.id].state) : new Date();
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - entityDate.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.floor(differenceInDays);
}

function isExpired(max: number, resetForward: boolean, state: number): boolean {
    return resetForward ? state >= 0 : state >= max;
}

function resetDate(entity: IEntity, event: Event, hass: IHass, resetForward: 0 | 1): void {
    const friendly_name = hass.states[entity.id].attributes.friendly_name;
    const entity_id = entity.id;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + resetForward * entity.max);
    const confirmation = `Do you want to reset ${friendly_name} to ${format(targetDate)}?`;
    const element = setDatetimeServiceFactory(
        hass,
        confirmation,
        entity_id,
        format(targetDate)
    );
    (<any>event.target).appendChild(element);
    (<any>element)._buttonTapped();
    (<any>event.target).removeChild(element);
}

function format(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthPadded = month.toString().padStart(2, '0');
    const dayPadded = day.toString().padStart(2, '0');
    return `${year}-${monthPadded}-${dayPadded}`;
}

export {formatDayString, getState, isExpired, resetDate}