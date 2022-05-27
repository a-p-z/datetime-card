import { get_current_component } from "svelte/internal";
import * as svelte from "svelte";
import { createEventDispatcher } from "../svelte";

jest.mock("svelte/internal");
jest.mock("svelte");

const get_current_component_mock = get_current_component as jest.MockedFunction<typeof get_current_component>
const createEventDispatcherMock = svelte.createEventDispatcher as jest.MockedFunction<typeof svelte.createEventDispatcher>

describe("svelte", () => {

    test("when createEventDispatcher", () => {
        const component = { dispatchEvent: jest.fn() };
        const eventDispatcherMock = jest.fn();
        get_current_component_mock.mockReturnValue(component);
        createEventDispatcherMock.mockReturnValue(eventDispatcherMock);
        const svelteDispatch = createEventDispatcher()

        svelteDispatch("name", { detail: "detail" });

        expect(eventDispatcherMock).toHaveBeenCalledWith("name", { detail: "detail" });
        expect(component.dispatchEvent).toHaveBeenCalledWith(new CustomEvent("name", { detail: "detail" }));
    });
});