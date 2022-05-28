import { render, fireEvent } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeCardEditor from '../DatetimeCardEditor.svelte'
import { createEventDispatcher } from "../svelte";
import type { IConfig, IEntity } from "../types";

jest.mock("../svelte");

const createEventDispatcherMock: jest.MockedFunction<typeof createEventDispatcher> = createEventDispatcher as jest.MockedFunction<typeof createEventDispatcher>;

describe('DatetimeCardEditor.svelte', () => {
    test('when hass is not defined', async () => {
        const { component, getByTestId } = render(DatetimeCardEditor);
        await component.setConfig({});
        expect(getByTestId("datetime-card-autocomplete-0")).toHaveAttribute("value", "");
    });

    describe('when hass is defined', () => {
        const hass = { states: { "input_datetime.test_1": { attributes: { friendly_name: "friendly name" } } } };

        let component: any;
        let getByTestId: any;
        let getAllByRole: any;
        let queryByTestId: any;
        let getByLabelText: any;
        let eventDispatcher: any;

        beforeEach(() => {
            eventDispatcher = jest.fn();
            createEventDispatcherMock.mockReturnValue(eventDispatcher);

            const result = render(DatetimeCardEditor, { hass });
            component = result.component;
            getByTestId = result.getByTestId;
            getAllByRole = result.getAllByRole;
            queryByTestId = result.queryByTestId;
            getByLabelText = result.getByLabelText;
        });

        describe('when config is empty', () => {
            beforeEach(async () => {
                await component.setConfig({});
            });

            test("title should be empty", () => {
                expect(getByTestId("title")).toHaveAttribute("value", "");
            });

            test("image should be empty", () => {
                expect(getByTestId("image")).toHaveAttribute("value", "");
            });

            test("entities should contain one empty item", () => {
                expect(getAllByRole("listitem")).toHaveLength(1);
                expect(getByTestId("datetime-card-autocomplete-0")).toHaveAttribute("value", "");
                expect(getByTestId("max-0")).toHaveAttribute("value", "");
            });

            test("no entities should be deletable", () => {
                expect(queryByTestId("delete-0")).not.toBeInTheDocument();
            });

            test("when title changes config should change", async () => {
                getByTestId("title").value = "My Datetime Card";

                await fireEvent.input(getByTestId("title"));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ "id": "", "max": 0 }],
                        flex_direction: "row",
                        image: "",
                        show_names: false,
                        title: "My Datetime Card",
                        type: "custom:datetime-card",
                    }
                });
            });

            test("when image changes config should change", async () => {
                getByTestId("image").value = "/local/image.png";

                await fireEvent.input(getByTestId("image"));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ id: "", max: 0 },],
                        flex_direction: "row",
                        image: "/local/image.png",
                        show_names: false,
                        type: "custom:datetime-card",
                        title: ""
                    }
                });
            });

            test("when show names changes config should change", async () => {
                getByLabelText("Show names").checked = true;

                await fireEvent.change(getByLabelText("Show names"));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ id: "", max: 0 },],
                        flex_direction: "row",
                        image: "",
                        show_names: true,
                        type: "custom:datetime-card",
                        title: ""
                    }
                });
            });

            test("when column changes config should change", async () => {
                getByLabelText("Column").checked = true;

                await fireEvent.change(getByLabelText("Column"));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ id: "", max: 0 },],
                        flex_direction: "column",
                        image: "",
                        show_names: false,
                        type: "custom:datetime-card",
                        title: ""
                    }
                });
            });

            test("when reverse changes config should change", async () => {
                getByLabelText("Reverse").checked = true;

                await fireEvent.change(getByLabelText("Reverse"));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ id: "", max: 0 },],
                        flex_direction: "row-reverse",
                        image: "",
                        show_names: false,
                        type: "custom:datetime-card",
                        title: ""
                    }
                });
            });

            test("when column and reverse change config should change", async () => {
                getByLabelText("Column").checked = true;
                getByLabelText("Reverse").checked = true;

                await fireEvent.change(getByLabelText("Column"));
                await fireEvent.change(getByLabelText("Reverse"));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ id: "", max: 0 },],
                        flex_direction: "column-reverse",
                        image: "",
                        show_names: false,
                        type: "custom:datetime-card",
                        title: ""
                    }
                });
            });

            test("when click on plus a new entity should be added", async () => {
                await fireEvent.click(getByTestId("plus"));

                expect(getAllByRole("listitem")).toHaveLength(2);
                expect(queryByTestId("delete-0")).toBeInTheDocument();
                expect(queryByTestId("delete-1")).toBeInTheDocument();
            });
        });

        test("when config.title is not empty title should not be empty", async () => {
            await component.setConfig({ title: "My Datetime Card" });

            expect(getByTestId("title")).toHaveAttribute("value", "My Datetime Card");
        });

        test("when config.image is not empty image should not be empty", async () => {
            await component.setConfig({ image: "/local/image.png" });

            expect(getByTestId("image")).toHaveAttribute("value", "/local/image.png");
        });

        test("when config.show_names is not undefined show_names set", async () => {
            await component.setConfig({ show_names: true });

            expect(getByLabelText("Show names")).toHaveAttribute("checked", "true");
        });

        [{ flex_direction: "column", column: "true", reverse: "false" },
        { flex_direction: "row", column: "false", reverse: "false" },
        { flex_direction: "column-reverse", column: "true", reverse: "true" },
        { flex_direction: "row-reverse", column: "false", reverse: "true" }
        ].forEach(({ flex_direction, column, reverse }) => {
            test(`when flex_direction is ${flex_direction}`, async () => {
                const config = { flex_direction };
                await component.setConfig(config);

                expect(getByLabelText("Column")).toHaveAttribute("checked", column);
                expect(getByLabelText("Reverse")).toHaveAttribute("checked", reverse);
            });
        });

        describe("when config.entities is not empty", () => {
            let entity1: IEntity;
            let entity2: IEntity;
            let config: IConfig;

            beforeEach(async () => {
                entity1 = { id: "input_datetime.test_1", max: 10 };
                entity2 = { id: "input_datetime.test_2", max: 20 };
                config = { entities: [entity1, entity2] } as IConfig;

                await component.setConfig(config);
            });

            test("listitem should contain the items should be 2", () => {
                expect(getAllByRole("listitem")).toHaveLength(2);
                expect(getByTestId("datetime-card-autocomplete-0")).toHaveAttribute("value", "input_datetime.test_1");
                expect(getByTestId("max-0")).toHaveAttribute("value", "10");
                expect(getByTestId("datetime-card-autocomplete-1")).toHaveAttribute("value", "input_datetime.test_2");
                expect(getByTestId("max-1")).toHaveAttribute("value", "20");
            });

            test("when set config a second time", async () => {
                entity1 = { id: "input_datetime.test_1", max: 0 };
                entity2 = { id: "input_datetime.test_2", max: 0 };
                config = { entities: [entity1, entity2] } as IConfig;
                await component.setConfig(config);

                expect(getAllByRole("listitem")).toHaveLength(2);
                expect(getByTestId("datetime-card-autocomplete-0")).toHaveAttribute("value", "input_datetime.test_1");
                expect(getByTestId("max-0")).toHaveAttribute("value", "");
                expect(getByTestId("datetime-card-autocomplete-1")).toHaveAttribute("value", "input_datetime.test_2");
                expect(getByTestId("max-1")).toHaveAttribute("value", "");
            });

            test("when id changes config should change", async () => {
                await fireEvent(getByTestId("datetime-card-autocomplete-0"), new CustomEvent("change", { detail: { value: "input_datetime.test" } }));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ id: "input_datetime.test", "max": 10 }, entity2],
                        flex_direction: "row",
                        image: "",
                        show_names: false,
                        title: "",
                        type: "custom:datetime-card",
                    }
                });
            });

            test("when max changes with a valid value config should change", async () => {
                getByTestId("max-0").value = "20";

                await fireEvent.input(getByTestId("max-0"))

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ "id": "input_datetime.test_1", "max": 20 }, entity2],
                        flex_direction: "row",
                        image: "",
                        show_names: false,
                        title: "",
                        type: "custom:datetime-card",
                    }
                });
            });

            test("when max changes with not a valid value config should change", async () => {
                getByTestId("max-0").value = "2O";

                await fireEvent.input(getByTestId("max-0"))

                expect(getByTestId("max-0").value).toEqual("10");
            });

            test("when click on delete the entity should be removed and config should change", async () => {
                await fireEvent.click(getByTestId("delete-0"));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [{ "id": "input_datetime.test_2", "max": 20, }],
                        flex_direction: "row",
                        image: "",
                        show_names: false,
                        title: "",
                        type: "custom:datetime-card",
                    }
                });
            });

            test("when consider", async () => {
                await fireEvent(getByTestId("entities"), new CustomEvent("consider", { detail: { items: [] } }));
            });

            test("when finalize", async () => {
                await fireEvent(getByTestId("entities"), new CustomEvent("finalize", { detail: { items: [] } }));

                expect(eventDispatcher).toHaveBeenCalledWith("config-changed", {
                    config: {
                        entities: [],
                        flex_direction: "row",
                        image: "",
                        show_names: false,
                        title: "",
                        type: "custom:datetime-card",
                    }
                });
            });

            test("when drag start", async () => {
                await fireEvent(getByTestId("handle-0"), new MouseEvent("mousedown"));
            });

            test("when drag stop", async () => {
                await fireEvent(getByTestId("handle-0"), new MouseEvent("mouseup"));
            });
        });
    });
});