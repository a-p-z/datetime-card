import type { HaCallServiceButton, IHass } from "./types";

function setDatetimeServiceFactory(
  hass: IHass,
  confirmation: string,
  entity_id: string,
  date: string,
): HaCallServiceButton {
  // https://github.com/home-assistant/frontend/blob/dev/src/components/buttons/ha-call-service-button.ts
  const element = document.createElement(
    "ha-call-service-button",
  ) as HaCallServiceButton;
  element.hass = hass;
  element.confirmation = confirmation;
  element.domain = "input_datetime";
  element.service = "set_datetime";
  element.data = { entity_id, date };
  element.style.display = "none";
  return element;
}

export { setDatetimeServiceFactory };
