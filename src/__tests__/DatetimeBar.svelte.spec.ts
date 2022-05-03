import { fireEvent, render } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeBar from '../DatetimeBar.svelte'

describe('DatetimeBar.svelte', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const elevenDaysAgo = new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const blue = "rgb(68, 115, 158)";
    const green = "rgb(13, 160, 53)";
    const red = "rgb(223, 76, 30)";

    test("callServiceButtonFactory should create a call service button", () => {
        const { component } = render(DatetimeBar);
        expect(component.callServiceButtonFactory()).toBeDefined;
    });

    describe('when hass is undefined', () => {
        const entity = { id: "input_datetime_test", max: 10 };

        test("icon should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { entity });
            expect(queryByTestId("icon")).not.toBeInTheDocument();
        });

        test("internal-bar width should be 0%", () => {
            const { getByTestId } = render(DatetimeBar, { entity });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0%");
        });

        test("internal-bar background should be green", () => {
            const { getByTestId } = render(DatetimeBar, { entity });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${green}`);
        });

        test("content should be '0 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity });
            expect(getByTestId("content")).toHaveTextContent("0 days");
        });
    });

    describe('when entity is undefined', () => {
        const hass = {
            states: { input_datetime_test: { state: "2022-05-11", attributes: { icon: "mdi:water" } } }
        };

        test("icon should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { hass });
            expect(queryByTestId("icon")).not.toBeInTheDocument();
        });

        test("internal-bar width should be 0%", () => {
            const { getByTestId } = render(DatetimeBar, { hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0%");
        });

        test("internal-bar background should be green", () => {
            const { getByTestId } = render(DatetimeBar, { hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${green}`);
        });

        test("content should be '0 days'", () => {
            const { getByTestId } = render(DatetimeBar, { hass });
            expect(getByTestId("content")).toHaveTextContent("0 days");
        });
    });

    describe('when hass does not contain the entity', () => {
        const hass = {
            states: { input_datetime_test: { state: "2022-05-11", attributes: { icon: "mdi:water" } } }
        };

        const entity = { id: "input_datetime_test_2", max: 10 };

        test("icon should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { entity, hass });
            expect(queryByTestId("icon")).not.toBeInTheDocument();
        });

        test("internal-bar width should be 0%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0%");
        });

        test("internal-bar background should be green", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${green}`);
        });

        test("content should be '0 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("0 days");
        });
    });

    describe('when hass contains the entity and max is undefined', () => {
        const hass = {
            states: { input_datetime_test: { state: yesterday, attributes: { icon: "mdi:water" } } }
        };

        const entity = { id: "input_datetime_test" };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", "mdi:water");
        });

        test("icon should have color blue", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${blue}`);
        });

        test("internal-bar width should be 0%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0%");
        });

        test("internal-bar background should be green", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${green}`);
        });

        test("content should be '1 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("1 days");
        });
    });

    describe('when hass contains the entity and state < max', () => {
        const hass = {
            states: { input_datetime_test: { state: yesterday, attributes: { icon: "mdi:water" } } }
        };

        const entity = { id: "input_datetime_test", max: 10 };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", "mdi:water");
        });

        test("icon should have color blue", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${blue}`);
        });

        test("internal-bar width should be 10%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 10%");
        });

        test("internal-bar background should be green", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${green}`);
        });

        test("content should be '1 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("1 days");
        });
    });

    describe('when hass contains the entity and state == max', () => {
        const hass = {
            states: { input_datetime_test: { state: tenDaysAgo, attributes: { icon: "mdi:water" } } }
        };

        const entity = { id: "input_datetime_test", max: 10 };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", "mdi:water");
        });

        test("icon should have color red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${red}`);
        });

        test("internal-bar width should be 100%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 100%");
        });

        test("internal-bar background should be red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("background: rgb(223, 76, 30)");
        });

        test("content should be '10 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("10 days");
        });
    });

    describe('when hass contains the entity and state > max', () => {
        const hass = {
            states: { input_datetime_test: { state: elevenDaysAgo, attributes: { icon: "mdi:water", friendly_name: "Test" } } }
        };

        const entity = { id: "input_datetime_test", max: 10 };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", "mdi:water");
        });

        test("icon should have color red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${red}`);
        });

        test("internal-bar width should be 100%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 100%");
        });

        test("internal-bar background should be red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("background: rgb(223, 76, 30)");
        });

        test("content should be '11 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("11 days");
        });

        test("when hold state should be reset", async () => {
            const callServiceButton = document.createElement("ha-call-service-button") as any;
            callServiceButton.buttonTapped = jest.fn(() => {
                hass.states[callServiceButton.serviceData.entity_id].state = callServiceButton.serviceData.date;
            });
            const { getByTestId } = render(DatetimeBar, { entity, hass, callServiceButtonFactory: () => callServiceButton });
            await fireEvent(getByTestId("content"), new CustomEvent("hold"));
            expect(callServiceButton.hass).toEqual(hass);
            expect(callServiceButton.confirmation).toEqual("Do you want to reset Test?");
            expect(callServiceButton.domain).toEqual("input_datetime");
            expect(callServiceButton.service).toEqual("set_datetime");
            expect(callServiceButton.serviceData).toEqual({ entity_id: "input_datetime_test", date: new Date().toISOString().split("T")[0] });
            expect(callServiceButton).toHaveStyle("display: none");
            expect(callServiceButton.buttonTapped).toHaveBeenCalled();
        });
    });

    describe('when hass contains the entity has no attributes', () => {
        const hass = {
            states: { input_datetime_test: { state: yesterday } }
        };

        const entity = { id: "input_datetime_test" };

        test("icon should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { entity, hass });
            expect(queryByTestId("icon")).not.toBeInTheDocument();
        });
    });
});
