import { render } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeIcon from '../../datetime/DatetimeIcon.svelte'
import {getState, isExpired} from "../../datetime/datetime";

jest.mock("../../datetime/datetime");

const getStateMock = getState as jest.MockedFunction<typeof getState>
const isExpiredMock = isExpired as jest.MockedFunction<typeof isExpired>

describe('DatetimeIcon.svelte', () => {
    const hass = { states: { test: { attributes: { friendly_name: "friendly name", icon: "mdi:water" } } } };
    const entity = { id: "test", max: 10 };
    const blue = "rgb(68, 115, 158)";
    const red = "rgb(223, 76, 30)";

    [{ hass: undefined, entity: undefined },
    { hass: {}, entity: undefined },
    { hass: { state: {} }, entity: undefined },
    { hass: { state: { test: {} } }, entity: undefined },
    { hass: { state: { test: { attributes: {} } } }, entity: undefined },
    { hass: { state: { test: { attributes: {} } } }, entity: {} },
    { hass: { state: { test: { attributes: {} } } }, entity: { id: "test" } },
    ].forEach(({ hass, entity }) => {
        test("when hass and entity are undefined", () => {
            const { getByTestId } = render(DatetimeIcon, { entity, hass });
            expect(getByTestId("icon")).not.toHaveAttribute("icon", "mdi:water");
            expect(getByTestId("icon")).not.toHaveAttribute("title", "friendly name");
        });
    });

    test("when icon is present it should be set", () => {
        const hass = { states: { test: { attributes: { icon: "mdi:water" } } } };
        getStateMock.mockReturnValue(1);
        isExpiredMock.mockReturnValue(false);
        const { getByTestId } = render(DatetimeIcon, { entity, hass });
        expect(getByTestId("icon")).toHaveAttribute("icon", "mdi:water");
    });

    test("when friendly name is present title should be set", () => {
        const hass = { states: { test: { attributes: { friendly_name: "friendly name" } } } };
        getStateMock.mockReturnValue(1);
        isExpiredMock.mockReturnValue(false);
        const { getByTestId } = render(DatetimeIcon, { entity, hass });
        expect(getByTestId("icon")).toHaveAttribute("title", "friendly name");
    });

    test("when state is 1", () => {
        getStateMock.mockReturnValue(1);
        isExpiredMock.mockReturnValue(false);
        const { getByTestId } = render(DatetimeIcon, { entity, hass });
        expect(getByTestId("icon")).toHaveStyle(`color: ${blue}`);
    });

    [10, 11].forEach((state) => {
        test("when state >= max", () => {
            getStateMock.mockReturnValue(state);
            isExpiredMock.mockReturnValue(true);
            const { getByTestId } = render(DatetimeIcon, { entity, hass });
            expect(getByTestId("icon")).toHaveStyle(`color: ${red}`);
        });
    });
});
