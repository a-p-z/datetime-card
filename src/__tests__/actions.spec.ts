import { hold } from "../actions";

describe('actions', () => {
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

    let div;

    beforeEach(() => {
        div = document.createElement("div");
        jest.spyOn(div, "dispatchEvent");
        jest.spyOn(div, "removeEventListener");
        jest.spyOn(div, "addEventListener");

        jest.useFakeTimers();

        hold(div);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    startingEvents.forEach((event) => {
        test(`when hold start due to ${event.type} and time advances by 500ms without any cancelling event`, () => {
            let holded = false;
            const listener = () => holded = true;
            div.addEventListener("hold", listener);

            hold(div);
            div.dispatchEvent(event);
            jest.advanceTimersByTime(500);
            endingEvents.forEach((event) => div.dispatchEvent(event));

            expect(holded).toBeTruthy();
            div.removeEventListener("hold", listener)
        });
    });

    startingEvents.forEach((startingEvemt) => {
        endingEvents.forEach((endingEvent) => {
            test(`when hold start due to ${startingEvemt.type} and ${endingEvent.type} is dispatched in 500ms`, () => {
                let holded = false;
                const listener = () => holded = true;
                div.addEventListener("hold", listener);

                hold(div);
                div.dispatchEvent(startingEvemt);
                jest.advanceTimersByTime(499);
                div.dispatchEvent(endingEvent);
                jest.advanceTimersByTime(10);

                expect(holded).toBeFalsy();
                div.removeEventListener("hold", listener)
            });
        });
    });
});