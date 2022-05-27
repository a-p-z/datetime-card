import { fireEvent, render } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeBar from '../DatetimeBar.svelte'
import { setDatetimeServiceFactory } from "../hass";

jest.mock("../hass");

const setDatetimeServiceFactoryMock = setDatetimeServiceFactory as jest.MockedFunction<typeof setDatetimeServiceFactory>

describe('DatetimeBar.svelte', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const elevenDaysAgo = new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const rgbBlue = "rgb(68, 115, 158)";
    const rgbGreen = "rgb(13, 160, 53)";
    const rgbRed = "rgb(223, 76, 30)";
    const xRed = "#df4c1e";
    const xGreen = "#0da035";
    const friendly_name = "friendly name";
    const icon = "mdi:water";

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
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });

        test("content should be '0 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity });
            expect(getByTestId("content")).toHaveTextContent("0 days");
        });

        test("and shownames is true bar height should be 3px", () => {
            const { getByTestId } = render(DatetimeBar, { entity, shownames: true });
            expect(getByTestId("internal-bar")).toHaveStyle("height: 3px");
        });

        test("and shownames is true friendly-name should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { entity, shownames: true });
            expect(queryByTestId("friendly-name")).not.toBeInTheDocument();
        });
    });

    describe('when entity is undefined', () => {
        const hass = {
            states: { input_datetime_test: { state: "2022-05-11", attributes: { icon } } }
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
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });

        test("content should be '0 days'", () => {
            const { getByTestId } = render(DatetimeBar, { hass });
            expect(getByTestId("content")).toHaveTextContent("0 days");
        });

        test("and shownames is true bar height should be 3px", () => {
            const { getByTestId } = render(DatetimeBar, { hass, shownames: true });
            expect(getByTestId("internal-bar")).toHaveStyle("height: 3px");
        });

        test("and shownames is true friendly-name should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { hass, shownames: true });
            expect(queryByTestId("friendly-name")).not.toBeInTheDocument();
        });
    });

    describe('when hass does not contain the entity', () => {
        const hass = {
            states: { input_datetime_test: { state: "2022-05-11", attributes: { icon } } }
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
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });

        test("content should be '0 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("0 days");
        });

        test("and shownames is true bar height should be 3px", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass, shownames: true });
            expect(getByTestId("internal-bar")).toHaveStyle("height: 3px");
        });

        test("and shownames is true friendly-name should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { entity, hass, shownames: true });
            expect(queryByTestId("friendly-name")).not.toBeInTheDocument();
        });
    });

    describe('when hass contains the entity and max is undefined', () => {
        const hass = {
            states: { input_datetime_test: { state: yesterday, attributes: { icon } } }
        };

        const entity = { id: "input_datetime_test" };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", icon);
        });

        test("icon should have color blue", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${rgbBlue}`);
        });

        test("internal-bar width should be 0%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0%");
        });

        test("internal-bar background should be green", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });

        test("content should be '1 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("1 days");
        });
    });

    describe('when hass contains the entity and state < max', () => {
        const hass = {
            states: { input_datetime_test: { state: yesterday, attributes: { friendly_name, icon } } }
        };

        const entity = { id: "input_datetime_test", max: 10 };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", icon);
        });

        test("icon should have color blue", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${rgbBlue}`);
        });

        test("internal-bar width should be 10%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 10%");
        });

        test("internal-bar background should be green", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });

        test("content should be '1 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("1 days");
        });

        test("friendly-name should contain 'friendly name'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass, shownames: true });
            expect(getByTestId("friendly-name")).toHaveStyle(`filter: drop-shadow(1px 1px 1px ${xGreen})`);
        });
    });

    describe('when hass contains the entity and state == max', () => {
        const hass = {
            states: { input_datetime_test: { state: tenDaysAgo, attributes: { friendly_name, icon } } }
        };

        const entity = { id: "input_datetime_test", max: 10 };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", icon);
        });

        test("icon should have color red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${rgbRed}`);
        });

        test("internal-bar width should be 100%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 100%");
        });

        test("internal-bar background should be red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbRed}`);
        });

        test("content should be '10 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("10 days");
        });

        test("friendly-name should contain 'friendly name'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass, shownames: true });
            expect(getByTestId("friendly-name")).toHaveStyle(`filter: drop-shadow(1px 1px 1px ${xRed})`);
        });
    });

    describe('when hass contains the entity and state > max', () => {
        const hass = {
            states: { input_datetime_test: { state: elevenDaysAgo, attributes: { friendly_name, icon } } }
        };

        const entity = { id: "input_datetime_test", max: 10 };

        test("icon should be mdi:water", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveAttribute("icon", icon);
        });

        test("icon should have color red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${rgbRed}`);
        });

        test("internal-bar width should be 100%", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle("width: 100%");
        });

        test("internal-bar background should be red", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbRed}`);
        });

        test("content should be '11 days'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            expect(getByTestId("content")).toHaveTextContent("11 days");
        });

        test("when hold state should be reset", async () => {
            const element = document.createElement("ha-call-service-button") as any;
            element.buttonTapped = jest.fn();
            const { getByTestId } = render(DatetimeBar, { entity, hass });
            setDatetimeServiceFactoryMock.mockReturnValue(element);

            await fireEvent(getByTestId("content"), new CustomEvent("hold"));

            expect(setDatetimeServiceFactoryMock).toBeCalledWith(hass, "Do you want to reset friendly name?", "input_datetime_test", expect.anything());
            expect(element.buttonTapped).toBeCalled();
        });

        test("friendly-name should contain 'friendly name'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass, shownames: true });
            expect(getByTestId("friendly-name")).toHaveStyle(`filter: drop-shadow(1px 1px 1px ${xRed})`);
        });
    });

    describe('when hass contains the entity and attributes are no present', () => {
        const hass = {
            states: { input_datetime_test: { state: yesterday } }
        };

        const entity = { id: "input_datetime_test" };

        test("icon should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { entity, hass });
            expect(queryByTestId("icon")).not.toBeInTheDocument();
        });

        test("and shownames is true bar height should be 3px", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass, shownames: true });
            expect(getByTestId("internal-bar")).toHaveStyle("height: 3px");
        });

        test("and shownames is true friendly-name should not be in the document", () => {
            const { queryByTestId } = render(DatetimeBar, { entity, hass, shownames: true });
            expect(queryByTestId("friendly-name")).not.toBeInTheDocument();
        });
    });

    describe('when hass contains the entity and attributes are present', () => {
        const hass = {
            states: { input_datetime_test: { state: yesterday, attributes: { friendly_name, icon } } }
        };

        const entity = { id: "input_datetime_test" };

        const shownames = true

        test("friendly-name should contain 'friendly name'", () => {
            const { getByTestId } = render(DatetimeBar, { entity, hass, shownames });
            expect(getByTestId("friendly-name")).toHaveTextContent(friendly_name);
        });
    });
});
