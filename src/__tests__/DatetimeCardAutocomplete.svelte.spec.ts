import { render, fireEvent } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeCardAutocomplete from '../DatetimeCardAutocomplete.svelte';
import { tick } from "svelte";

jest.mock("../svelte");

describe("DatetimeCardAutocomplete.svelte", () => {
    const items = [
        { primaryText: "AbCd primary", secondaryText: "AbCd secondary", value: "AbCd" },
        { primaryText: "primary", secondaryText: "aBcDef secondary", value: "aBcDef" },
        { primaryText: "?.+${[(\\bcd/)]}^-*|", value: "?.+${[(\\bcd/)]}^-*|" },
    ];

    test("when items, label and value are not defined", () => {
        const { getByTestId } = render(DatetimeCardAutocomplete);
        expect(getByTestId("text-field")).toHaveAttribute("label", "");
        expect(getByTestId("text-field")).toHaveAttribute("value", "");
    });

    describe("when items, label and value are defined", () => {
        let getByTestId: any;
        let eventDispatcher: any;
        let queryAllByRole: any;
        let queryByRole: any;
        let getByRole: any;

        beforeEach(() => {
            const result = render(DatetimeCardAutocomplete, { items, label: "label", value: "value" });
            getByTestId = result.getByTestId;
            queryAllByRole = result.queryAllByRole;
            queryByRole = result.queryByRole;
            getByRole = result.getByRole;
        });

        test("label should be 'label'", () => {
            expect(getByTestId("text-field")).toHaveAttribute("label", "label");
        });

        test("value should be 'value'", () => {
            expect(getByTestId("text-field")).toHaveAttribute("value", "value");
        });

        ["", "a", "ab", "Ab", "bC"].forEach((value) => {
            test(`when value='${value}' is shorter than 3 chars`, async () => {
                getByTestId("text-field").value = value;

                await fireEvent.input(getByTestId("text-field"));

                expect(queryByRole("listitem")).not.toBeInTheDocument();
                expect(eventDispatcher).toHaveBeenCalledWith("change", { value })
            });
        });

        test("when there are no match", async () => {
            const value = "dcb";
            getByTestId("text-field").value = value;

            await fireEvent.input(getByTestId("text-field"));

            expect(queryByRole("listitem")).not.toBeInTheDocument();
            expect(eventDispatcher).toHaveBeenCalledWith("change", { value })
        });

        test("when there is a match", async () => {
            const value = " BCd ";
            getByTestId("text-field").value = value;

            await fireEvent.input(getByTestId("text-field"));

            expect(queryAllByRole("listitem")).toHaveLength(3);
            expect(queryAllByRole("listitem")[0]).toContainHTML("A<strong>bCd</strong> primary");
            expect(queryAllByRole("listitem")[0]).toContainHTML("A<strong>bCd</strong> secondary");
            expect(queryAllByRole("listitem")[1]).toContainHTML("primary");
            expect(queryAllByRole("listitem")[1]).toContainHTML("a<strong>BcD</strong>ef secondary");
            expect(queryAllByRole("listitem")[2]).toContainHTML("?.+${[(\\<strong>bcd</strong>/)]}^-*|");

            expect(eventDispatcher).toHaveBeenCalledWith("change", { value })
        });

        [
            { value: "?.+${[(\\bcd/)]}^-*", html: "<strong>?.+${[(\\bcd/)]}^-*</strong>|" },
            { value: ".+${[(\\bcd/)]}^-*|", html: "?<strong>.+${[(\\bcd/)]}^-*|</strong>" },

        ].forEach(({ value, html }) => {
            test(`when value is '${value}' autocomplete should contain '${html}'`, async () => {
                getByTestId("text-field").value = value;

                await fireEvent.input(getByTestId("text-field"));

                expect(getByRole("listitem")).toContainHTML(html);
            });
        });

        test("when the value is equal to the the only one autocomplete item", async () => {
            const value = "?.+${[(\\bcd/)]}^-*|";
            getByTestId("text-field").value = value;

            await fireEvent.input(getByTestId("text-field"));

            expect(queryByRole("listitem")).not.toBeInTheDocument();
            expect(eventDispatcher).toHaveBeenCalledWith("change", { value })
        });

        test("when click on an item", async () => {
            const value = "abcde";
            getByTestId("text-field").value = value;

            await fireEvent.input(getByTestId("text-field"));

            getByRole("listitem").click();

            expect(eventDispatcher).lastCalledWith("change", { value: "aBcDef" });
        });

        test("when click on outside", async () => {
            jest.useFakeTimers();

            const value = "abcde";
            getByTestId("text-field").value = value;

            await fireEvent.input(getByTestId("text-field"));

            expect(queryAllByRole("listitem")).toHaveLength(1);

            getByTestId("text-field").click();

            jest.advanceTimersByTime(500);

            await tick();

            expect(eventDispatcher).lastCalledWith("change", { value });
            expect(queryByRole("listitem")).not.toBeInTheDocument();

            jest.useRealTimers();
        });
    });
});