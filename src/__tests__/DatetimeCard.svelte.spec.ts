import { render } from "@testing-library/svelte";
import '@testing-library/jest-dom';
import DatetimeCard from '../DatetimeCard.svelte'

describe('DatetimeCard.svelte', () => {
    describe('when config is empty', () => {
        const config = { reset_forward: 0, type: "custom:datetime-card" };

        test("the default title should be in the document", async () => {
            const { component, getByRole } = render(DatetimeCard);
            await component.setConfig(config);
            expect(getByRole('heading')).toHaveTextContent("Datetime Card");
        });

        test("the default card-pict should be in the document", async () => {
            const { component, getByAltText } = render(DatetimeCard);
            await component.setConfig(config);
            expect(getByAltText('card-pict')).toHaveAttribute("src", "https://demo.home-assistant.io/stub_config/t-shirt-promo.png");
        });

        test("and hass is undefined listitems should be 0", async () => {
            const { component, queryAllByRole } = render(DatetimeCard);
            await component.setConfig(config);
            expect(queryAllByRole("listitem")).toHaveLength(0);
        });

        test("and hass does not contain any input_datetime entity listitems should be 0", async () => {
            const hass = { states: {} };
            const { component, queryAllByRole } = render(DatetimeCard, { hass });
            await component.setConfig(config);
            expect(queryAllByRole("listitem")).toHaveLength(0);
        });

        test("and hass contains a input_datetime entity entities listitems should be 1", async () => {
            const hass = { states: { input_datetime_test: { state: "2022-05-11" } } };
            const { component, getAllByRole } = render(DatetimeCard, { hass });
            await component.setConfig(config);
            expect(getAllByRole("listitem")).toHaveLength(1);
        });

        test("flex_direction should be row", async () => {
            const hass = { states: { input_datetime_test: { state: "2022-05-11" } } };
            const { component, getByTestId } = render(DatetimeCard, { hass });
            await component.setConfig(config);
            expect(getByTestId("card-content")).toHaveStyle("flex-direction: row");
        });
    });

    test("when config.title is defined title should be in the document", async () => {
        const { component, getByRole } = render(DatetimeCard);
        await component.setConfig({ type: "custom:datetime-card", title: "My Datetime Card" })
        expect(getByRole('heading')).toHaveTextContent("My Datetime Card");
    });

    test("when config.image is defined card-pict should be in the document", async () => {
        const { component, getByAltText } = render(DatetimeCard);
        await component.setConfig({ type: "custom:datetime-card", image: "/local/my-image.png" })
        expect(getByAltText('card-pict')).toHaveAttribute("src", "/local/my-image.png");
    });

    test("when config.flex_direction is defined the style should be applied", async () => {
        const { component, getByTestId } = render(DatetimeCard);
        await component.setConfig({ flex_direction: "column" });
        expect(getByTestId("card-content")).toHaveStyle("flex-direction: column");
    });

    test("when config.title is empty title should not be in the document", async () => {
        const { component, queryByRole } = render(DatetimeCard);
        await component.setConfig({ type: "custom:datetime-card", title: "" })
        expect(queryByRole('heading')).not.toBeInTheDocument();
    });

    test("when config.image is empty card-pict should not be in the document", async () => {
        const { component, queryByAltText } = render(DatetimeCard);
        await component.setConfig({ type: "custom:datetime-card", image: "" })
        expect(queryByAltText('card-pict')).not.toBeInTheDocument();
    });

    test("when config.entities is empty listitems should be 0", async () => {
        const { component, queryAllByRole } = render(DatetimeCard);
        await component.setConfig({ type: "custom:datetime-card", entities: [] })
        expect(queryAllByRole('listitem')).toHaveLength(0);
    });

    test("when config.entities is not empty listitems should be 1", async () => {
        const { component, queryAllByRole } = render(DatetimeCard);
        await component.setConfig({ type: "custom:datetime-card", entities: [{ id: "input_datetime_test", max: 30 }] })
        expect(queryAllByRole('listitem')).toHaveLength(1);
    });
});
