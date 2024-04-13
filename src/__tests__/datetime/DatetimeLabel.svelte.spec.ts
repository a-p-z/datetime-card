import { render, fireEvent } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeLabel from '../../datetime/DatetimeLabel.svelte'
import { formatDayString, getState, resetDate } from "../../datetime/datetime";

jest.mock("../../datetime/datetime");

const formatDayStringMock = formatDayString as jest.MockedFunction<typeof formatDayString>
const getStateMock = getState as jest.MockedFunction<typeof getState>
const resetDateMock = resetDate as jest.MockedFunction<typeof resetDate>

describe('DatetimeLabel.svelte', () => {
    const resetforward = false;
    const entity = {};
    const hass = { localize: (key: string, params: any) => `${params["count"]} ${key}` };

    test("when hass and entity are undefined", () => {
        expect(render(DatetimeLabel)).toBeDefined();
    });

    test("when state is 1", () => {
        getStateMock.mockReturnValue(1);
        formatDayStringMock.mockReturnValue("1 day")
        const { getByTestId } = render(DatetimeLabel, { entity, hass });
        expect(getByTestId("days")).toHaveTextContent("1 day");
    });

    [0, 2, 3].forEach((state) => {
        test("when state is not 1", () => {
            getStateMock.mockReturnValue(state);
            formatDayStringMock.mockReturnValue(`${state} days`)
            const { getByTestId } = render(DatetimeLabel, { entity, hass });
            expect(getByTestId("days")).toHaveTextContent(`${state} days`);
        });
    });

    test("when hold state should be reset", async () => {
        const event = new CustomEvent("hold");
        const { getByTestId } = render(DatetimeLabel, { entity, hass, resetforward });

        await fireEvent(getByTestId("days"), event);

        expect(resetDateMock).toBeCalledWith(entity, event, hass, 0);
    });
});
