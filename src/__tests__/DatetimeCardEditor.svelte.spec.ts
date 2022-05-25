import { render, fireEvent } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeCardEditor from '../DatetimeCardEditor.svelte'

describe('DatetimeCardEditor.svelte', () => {
    describe('when config is empty', () => {
        const config = { type: "custom:datetime-card" };

        test("title should be empty", async () => {
            const { component, getByTestId } = render(DatetimeCardEditor);
            await component.setConfig(config);
            expect(getByTestId("title")).toHaveAttribute("value", "");
        });

        test("image should be empty", async () => {
            const { component, getByTestId } = render(DatetimeCardEditor);
            await component.setConfig(config);
            expect(getByTestId("image")).toHaveAttribute("value", "");
        });

        test("entities should contain one empty item", async () => {
            const { component, getAllByRole, getByTestId, queryByTestId } = render(DatetimeCardEditor);
            await component.setConfig(config);
            expect(getAllByRole("listitem")).toHaveLength(1);
            expect(getByTestId("entity-0")).toHaveAttribute("index", "0");
            expect(getByTestId("entity-0")).toHaveAttribute("value", "");
            expect(getByTestId("max-0")).toHaveAttribute("value", "0");
            expect(getByTestId("max-0")).toHaveAttribute("index", "0");
        });

        test("no entities should be deletable", async () => {
            const { component, getAllByRole, getByTestId, queryByTestId } = render(DatetimeCardEditor);
            await component.setConfig(config);
            expect(queryByTestId("delete-0")).not.toBeInTheDocument();
        });
    });

    test("when config.title is not empty title should not be empty", async () => {
        const { component, getByTestId } = render(DatetimeCardEditor);
        await component.setConfig({ title: "My Datetime Card" });
        expect(getByTestId("title")).toHaveAttribute("value", "My Datetime Card");
    });

    test("when config.image is not empty image should not be empty", async () => {
        const { component, getByTestId } = render(DatetimeCardEditor);
        await component.setConfig({ image: "/local/image.png" });
        expect(getByTestId("image")).toHaveAttribute("value", "/local/image.png");
    });

    test("when config.entities is not empty entities should contain the items", async () => {
        const { component, getByTestId, getAllByRole } = render(DatetimeCardEditor);
        await component.setConfig({ entities: [{ id: "input_datetime_test_1", max: 10 }, { id: "input_datetime_test_2", max: 20 }] });
        expect(getAllByRole("listitem")).toHaveLength(2);
        expect(getByTestId("entity-0")).toHaveAttribute("index", "0");
        expect(getByTestId("entity-0")).toHaveAttribute("value", "input_datetime_test_1");
        expect(getByTestId("max-0")).toHaveAttribute("index", "0");
        expect(getByTestId("max-0")).toHaveAttribute("value", "10");
        expect(getByTestId("entity-1")).toHaveAttribute("index", "1");
        expect(getByTestId("entity-1")).toHaveAttribute("value", "input_datetime_test_2");
        expect(getByTestId("max-1")).toHaveAttribute("index", "1");
        expect(getByTestId("max-1")).toHaveAttribute("value", "20");
    });

    test("when title changes config should change", async () => {
        const target = document.createElement("input");
        target.value = "My Datetime Card";
        const listener = (event: Event) => detail = (<any>event).detail;
        let detail: any;
        target.addEventListener("config-changed", listener);
        const { component } = render(DatetimeCardEditor);
        await component.setConfig({ entities: [{ id: "input_datetime_test_1", max: 10 }] });

        component.titleChanged({ target })

        expect(detail).toEqual({
            config: {
                entities: [{ "id": "input_datetime_test_1", "max": 10 }],
                image: "",
                show_names: false,
                title: "My Datetime Card",
                type: "custom:datetime-card",
            }
        });
        target.removeEventListener("config-changed", listener);
    });

    test("when image changes config should change", async () => {
        const target = document.createElement("input");
        target.value = "/local/image.png";
        const listener = (event: Event) => detail = (<any>event).detail;
        let detail: any;
        target.addEventListener("config-changed", listener);
        const { component } = render(DatetimeCardEditor);
        await component.setConfig({ entities: [{ id: "input_datetime_test_1", max: 10 }] });

        component.imageChanged({ target })

        expect(detail).toEqual({
            config: {
                entities: [{ "id": "input_datetime_test_1", "max": 10 }],
                image: "/local/image.png",
                show_names: false,
                title: "",
                type: "custom:datetime-card",
            }
        });
        target.removeEventListener("config-changed", listener);
    });

    test("when show names changes config should change", async () => {
        const target = document.createElement("input");
        target.checked = true;
        const listener = (event: Event) => detail = (<any>event).detail;
        let detail: any;
        target.addEventListener("config-changed", listener);
        const { component } = render(DatetimeCardEditor);
        await component.setConfig({ entities: [{ id: "input_datetime_test_1", max: 10 }] });

        component.showNamesChanged({ target })

        expect(detail).toEqual({
            config: {
                entities: [{ "id": "input_datetime_test_1", "max": 10 }],
                image: "",
                show_names: true,
                title: "",
                type: "custom:datetime-card",
            }
        });
        target.removeEventListener("config-changed", listener);
    });

    test("when max changes config should change", async () => {
        const target = document.createElement("input");
        target.setAttribute("index", "0");
        target.value = "20";
        const listener = (event: Event) => detail = (<any>event).detail;
        let detail: any;
        target.addEventListener("config-changed", listener);
        const { component } = render(DatetimeCardEditor);
        await component.setConfig({ entities: [{ id: "input_datetime_test_1", max: 10 }] });

        component.maxChanged({ target })

        expect(detail).toEqual({
            config: {
                entities: [{ "id": "input_datetime_test_1", "max": 20 }],
                image: "",
                show_names: false,
                title: "",
                type: "custom:datetime-card",
            }
        });
        target.removeEventListener("config-changed", listener);
    });

    test("when id changes config should change", async () => {
        const target = document.createElement("input");
        target.setAttribute("index", "0");
        target.value = "input_datetime_test_2";
        const listener = (event: Event) => detail = (<any>event).detail;
        let detail: any;
        target.addEventListener("config-changed", listener);
        const { component } = render(DatetimeCardEditor);
        await component.setConfig({ entities: [{ id: "input_datetime_test_1", max: 10 }] });

        component.idChanged({ target })

        expect(detail).toEqual({
            config: {
                entities: [{ "id": "input_datetime_test_2", "max": 10 }],
                image: "",
                show_names: false,
                title: "",
                type: "custom:datetime-card",
            }
        });
        target.removeEventListener("config-changed", listener);
    });

    test("when click on delete the entity should be removed and config should change", async () => {
        const listener = (event: Event) => detail = (<any>event).detail;
        let detail: any;
        addEventListener("config-changed", listener);
        const { component, getByTestId, getAllByRole } = render(DatetimeCardEditor);
        await component.setConfig({ entities: [{ id: "input_datetime_test_1", max: 10 }, { id: "input_datetime_test_2", max: 20 }] });
        await fireEvent.click(getByTestId("delete-0"));
        expect(getAllByRole("listitem")).toHaveLength(1);
        expect(getByTestId("entity-0")).toHaveAttribute("index", "0");
        expect(getByTestId("entity-0")).toHaveAttribute("value", "input_datetime_test_2");
        expect(getByTestId("max-0")).toHaveAttribute("index", "0");
        expect(getByTestId("max-0")).toHaveAttribute("value", "20");
        expect(detail).toEqual({
            config: {
                entities: [{ "id": "input_datetime_test_2", "max": 20, }],
                image: "",
                show_names: false,
                title: "",
                type: "custom:datetime-card",
            }
        });
        removeEventListener("config-changed", listener);
    });

    test("when click on plus a new entity should be added and config should change", async () => {
        const listener = (event: Event) => detail = (<any>event).detail;
        let detail: any;
        addEventListener("config-changed", listener);
        const { component, getAllByRole, getByTestId, queryByTestId } = render(DatetimeCardEditor);
        await component.setConfig({});
        await fireEvent.click(getByTestId("plus"));
        expect(getAllByRole("listitem")).toHaveLength(2);
        expect(queryByTestId("delete-0")).toBeInTheDocument();
        expect(queryByTestId("delete-1")).toBeInTheDocument();
        expect(detail).toEqual({
            config: {
                entities: [{ "id": "", "max": 0, }, { "id": "", "max": 0, }],
                image: "",
                show_names: false,
                title: "",
                type: "custom:datetime-card",
            }
        });
        removeEventListener("config-changed", listener);
    });
});