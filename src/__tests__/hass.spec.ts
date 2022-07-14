import { setDatetimeServiceFactory } from "../hass";
import type { IHass } from "../types";

describe("hass", () => {
    const hass = { localize: (key: string) => key, states: {} };
    const entity_id = "entity_id";
    const date = new Date().toISOString().split("T")[0];

    test("when setDatetimeHiddenButtonFactory", () => {
        const element = setDatetimeServiceFactory(hass, "confirmation", entity_id, date) as any;

        expect(element).toHaveProperty("hass", hass);
        expect(element).toHaveProperty("confirmation", "confirmation");
        expect(element).toHaveProperty("domain", "input_datetime");
        expect(element).toHaveProperty("service", "set_datetime");
        expect(element).toHaveProperty("serviceData", { entity_id, date })
        expect(element).toHaveProperty("style.display", "none");
    });
});