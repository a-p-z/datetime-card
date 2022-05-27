import { clickoutside } from "../../actions/clickoutside";

describe('clickoutside', () => {
    const listener = () => clickedoutside = true;

    let element: HTMLElement;
    let clickedoutside: boolean;
    let destroy: () => void;

    beforeEach(() => {
        clickedoutside = false;
        element = document.createElement("div");
        element.addEventListener("clickoutside", listener);

        destroy = clickoutside(element).destroy;
    });

    afterEach(() => {
        element.removeEventListener("hold", listener)
        destroy();
    });

    test('when click outside', () => {
        element.contains = jest.fn().mockReturnValue(false);
        document.dispatchEvent(new MouseEvent("click"));

        expect(clickedoutside).toBeTruthy();
        element.removeEventListener("clickoutside", listener)
    });

    test('when click insideside', () => {
        element.contains = jest.fn().mockReturnValue(true);
        document.dispatchEvent(new MouseEvent("click"));

        expect(clickedoutside).toBeFalsy();
        element.removeEventListener("clickoutside", listener)
    });
});