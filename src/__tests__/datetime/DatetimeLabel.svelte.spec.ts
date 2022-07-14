import { render, fireEvent } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeLabel from '../../datetime/DatetimeLabel.svelte'
import { getState, resetDate } from "../../datetime/datetime";

jest.mock("../../datetime/datetime");

const getStateMock = getState as jest.MockedFunction<typeof getState>
const resetDateMock = resetDate as jest.MockedFunction<typeof resetDate>

describe('DatetimeLabel.svelte', () => {
    const entity = {};
    const hass = { localize: (key: string, params: any) => `${params["count"]} ${key}` };

    test("when hass and entity are undefined", () => {
        expect(render(DatetimeLabel)).toBeDefined();
    });

    test("when state is 1", () => {
        getStateMock.mockReturnValue(1);
        const { getByTestId } = render(DatetimeLabel, { entity, hass });
        expect(getByTestId("days")).toHaveTextContent("1 ui.duration.day");
    });

    [0, 2, 3].forEach((state) => {
        test("when state is not 1", () => {
            getStateMock.mockReturnValue(state);
            const { getByTestId } = render(DatetimeLabel, { entity, hass });
            expect(getByTestId("days")).toHaveTextContent(`${state} ui.duration.day`);
        });
    });

    test("when hold state should be reset", async () => {
        const $event = new CustomEvent("hold");
        const { getByTestId } = render(DatetimeLabel, { entity, hass });

        await fireEvent(getByTestId("days"), $event);

        expect(resetDateMock).toBeCalledWith($event, hass, entity);
    });
});
