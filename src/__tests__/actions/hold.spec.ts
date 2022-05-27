import { hold } from "../../actions/hold";

describe('hold', () => {
    const startingEvents = [
        new MouseEvent("mousedown"),
        new TouchEvent("touchstart")];

    const endingEvents = [
        new MouseEvent("mousemove"),
        new MouseEvent("mouseup"),
        new TouchEvent("touchcancel"),
        new TouchEvent("touchend"),
        new TouchEvent("touchmove")
    ];

    const listener = () => holded = true;

    let element: HTMLElement;
    let holded: boolean;
    let destroy: () => void;

    beforeEach(() => {
        jest.useFakeTimers();

        element = document.createElement("div");
        element.addEventListener("hold", listener);

        holded = false;
        destroy = hold(element).destroy;
    });

    afterEach(() => {
        element.removeEventListener("hold", listener)
        destroy();
        jest.useRealTimers();
    });

    startingEvents.forEach((event) => {
        test(`when hold start due to ${event.type} and time advances by 500ms without any cancelling event`, () => {
            element.dispatchEvent(event);
            jest.advanceTimersByTime(500);
            endingEvents.forEach((event) => element.dispatchEvent(event));

            expect(holded).toBeTruthy();
        });
    });

    startingEvents.forEach((startingEvemt) => {
        endingEvents.forEach((endingEvent) => {
            test(`when hold start due to ${startingEvemt.type} and ${endingEvent.type} is dispatched in 500ms`, () => {
                element.dispatchEvent(startingEvemt);
                jest.advanceTimersByTime(499);
                element.dispatchEvent(endingEvent);
                jest.advanceTimersByTime(10);

                expect(holded).toBeFalsy();
            });
        });
    });
});