import { fireEvent, render } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeBar from '../../datetime/DatetimeBar.svelte'
import {getState, isExpired, resetDate} from "../../datetime/datetime";

jest.mock("../../datetime/datetime");

const getStateMock = getState as jest.MockedFunction<typeof getState>
const isExpiredMock = isExpired as jest.MockedFunction<typeof isExpired>
const resetDateMock = resetDate as jest.MockedFunction<typeof resetDate>

describe('DatetimeBar.svelte', () => {
    const rgbGreen = "rgb(13, 160, 53)";
    const rgbRed = "rgb(223, 76, 30)";
    const xRed = "#df4c1e";
    const xGreen = "#0da035";
    const friendly_name = "friendly name";

    describe('when hass is undefined', () => {
        const resetforward = false;
        const entity = { id: "input_datetime_test", max: 10 };

        let getByTestId: any;

        beforeEach(() => {
            const result = render(DatetimeBar, { entity, resetforward });
            getByTestId = result.getByTestId;
        });

        test("internal-bar width should be 0%", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0");
        });

        test("internal-bar background should be green", () => {
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });
    });

    describe('when entity is undefined', () => {
        const hass = {
            states: { input_datetime_test: { state: "2022-05-11", attributes: {} } }
        };

        let getByTestId: any;

        beforeEach(() => {
            const resetforward = false;
            const result = render(DatetimeBar, { hass, resetforward });
            getByTestId = result.getByTestId;
        });


        test("internal-bar width should be 0%", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0");
        });

        test("internal-bar background should be green", () => {
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });

        test("and shownames is true bar height should be 3px", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("height: 3px");
        });
    });

    describe("when show_names is false", () => {
        const resetforward = false;
        const hass = { states: { input_datetime_test: { attributes: { friendly_name } } } };
        const entity = { id: "input_datetime_test", max: 10 };
        const shownames = false;

        let getByTestId: any;
        let queryByTestId: any;

        beforeEach(() => {
            const result = render(DatetimeBar, { entity, hass, resetforward, shownames });
            getByTestId = result.getByTestId;
            queryByTestId = result.queryByTestId;
        });

        test("bar height should be 3px", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("height: 3px");
        });

        test("friendly-name should not be in the document", () => {
            expect(queryByTestId("friendly-name")).not.toBeInTheDocument();
        });
    });

    describe("when show_names is true", () => {
        const resetforward = false;
        const hass = { states: { input_datetime_test: { attributes: { friendly_name } } } };
        const entity = { id: "input_datetime_test", max: 10 };
        const shownames = true;

        let getByTestId: any;

        beforeEach(() => {
            const result = render(DatetimeBar, { entity, hass, resetforward, shownames });
            getByTestId = result.getByTestId;
        });

        test("bar height should be 18px", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("height: 18px");
        });

        test("friendly-name should be in the document", () => {
            expect(getByTestId("friendly-name")).toHaveTextContent(friendly_name);
        });
    });

    describe('when hass does not contain the entity', () => {
        const hass = {
            states: { input_datetime_test: { state: "2022-05-11", attributes: {} } }
        };

        const entity = { id: "input_datetime_test_2", max: 10 };

        let getByTestId: any;

        beforeEach(() => {
            const resetforward = false;
            const result = render(DatetimeBar, { entity, hass, resetforward });
            getByTestId = result.getByTestId;
        });

        test("internal-bar width should be 0%", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0");
        });

        test("internal-bar background should be green", () => {
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });
    });

    describe('when hass contains the entity and max is undefined', () => {
        const hass = { states: { input_datetime_test: { attributes: {} } } };
        const entity = { id: "input_datetime_test" };

        let getByTestId: any;

        beforeEach(() => {
            const resetforward = false;
            const result = render(DatetimeBar, { entity, hass, resetforward });
            getByTestId = result.getByTestId;
        });

        test("internal-bar width should be 0%", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("width: 0");
        });

        test("internal-bar background should be green", () => {
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });
    });

    describe('when hass contains the entity and state < max', () => {
        const resetforward = false;
        const hass = { states: { input_datetime_test: { attributes: { friendly_name } } } };
        const entity = { id: "input_datetime_test", max: 10 };
        const shownames = true;

        let getByTestId: any;

        beforeEach(() => {
            getStateMock.mockReturnValue(1);
            isExpiredMock.mockReturnValue(false);
            const result = render(DatetimeBar, { entity, hass, resetforward, shownames });
            getByTestId = result.getByTestId;
        });

        test("internal-bar width should be 10%", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("width: 10%");
        });

        test("internal-bar background should be green", () => {
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbGreen}`);
        });

        test("friendly-name should contain 'friendly name'", () => {
            expect(getByTestId("friendly-name")).toHaveStyle(`filter: drop-shadow(1px 1px 1px ${xGreen})`);
        });
    });

    describe('when hass contains the entity and state == max', () => {
        const hass = { states: { input_datetime_test: { attributes: { friendly_name } } } };
        const entity = { id: "input_datetime_test", max: 10 };
        const resetforward = false;
        const shownames = true;

        let getByTestId: any;

        beforeEach(() => {
            getStateMock.mockReturnValue(10);
            isExpiredMock.mockReturnValue(true);
            const result = render(DatetimeBar, { entity, hass, resetforward, shownames });
            getByTestId = result.getByTestId;
        });

        test("internal-bar width should be 100%", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("width: 100%");
        });

        test("internal-bar background should be red", () => {
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbRed}`);
        });

        test("friendly-name should contain 'friendly name'", () => {
            expect(getByTestId("friendly-name")).toHaveStyle(`filter: drop-shadow(1px 1px 1px ${xRed})`);
        });
    });

    describe('when hass contains the entity and state > max', () => {
        const hass = { states: { input_datetime_test: { attributes: { friendly_name } } } };
        const entity = { id: "input_datetime_test", max: 10 };
        const shownames = true;

        let getByTestId: any;

        beforeEach(() => {
            getStateMock.mockReturnValue(11);
            isExpiredMock.mockReturnValue(true);
            const result = render(DatetimeBar, { hass, entity, shownames });
            getByTestId = result.getByTestId;
        });

        test("internal-bar width should be 100%", () => {
            expect(getByTestId("internal-bar")).toHaveStyle("width: 100%");
        });

        test("internal-bar background should be red", () => {
            expect(getByTestId("internal-bar")).toHaveStyle(`background: ${rgbRed}`);
        });

        test("friendly-name should contain 'friendly name'", () => {
            expect(getByTestId("friendly-name")).toHaveStyle(`filter: drop-shadow(1px 1px 1px ${xRed})`);
        });

        test("when hold state should be reset", async () => {
            const event = new CustomEvent("hold");

            await fireEvent(getByTestId("external-bar"), event);

            expect(resetDateMock).toBeCalledWith(entity, event, hass, 0);
        });
    });
});
