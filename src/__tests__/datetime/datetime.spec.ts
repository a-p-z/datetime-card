import { getState, resetDate } from "../../datetime/datetime";
import type { IHass } from "../../types";
import { setDatetimeServiceFactory } from "../../hass";

jest.mock("../../hass");

const setDatetimeServiceFactoryMock = setDatetimeServiceFactory as jest.MockedFunction<typeof setDatetimeServiceFactory>

describe("datetime", () => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const tenDaysAgo = new Date();
    tenDaysAgo.setUTCDate(tenDaysAgo.getUTCDate() - 10);
    [
        { hass: { states: { test: { attributes:{}, state: yesterday.toISOString().split("T")[0] } } }, entity: { id: "test", max:42 }, expected: 1 },
        { hass: { states: { test: { attributes:{}, state: tenDaysAgo.toISOString().split("T")[0] } } }, entity: { id: "test", max:42 }, expected: 10 },
    ].forEach(({ hass, entity, expected }) => {
        test(`when hass=${JSON.stringify(hass)} and entity=${JSON.stringify(entity)}`, () => {
            expect(getState(hass, entity)).toEqual(expected);
        });
    });


    test("when resetDate", async () => {
        const localDate = new Date().toISOString().split("T")[0];
        const target = document.createElement("div");
        const event = { target } as any;
        const hass = { states: { test: { attributes: { friendly_name: "friendly name" } } } } as any;
        const entity = { id: "test", max: 42 } as any;
        const element = document.createElement("ha-call-service-button") as any;
        element._buttonTapped = jest.fn();
        setDatetimeServiceFactoryMock.mockReturnValue(element);

        resetDate(entity, event, hass, 0);

        expect(setDatetimeServiceFactoryMock).toBeCalledWith(hass, `Do you want to reset friendly name to ${localDate}?`, "test", expect.anything());
        expect(element._buttonTapped).toBeCalled();
    });
});