export const TICK = {
    QUANTA: 25,
    MINIMUM: 25,
    MAXIMUM: 2500,
    DEFAULT: 250,
    DOT: 1,
    DASH: 3
}

export const INSTRUCTIONS = "Copyright © 2026 Vayu.\n \
        Press 'connect' to retrieve translation.\n \
        Press 'connect' twice to establish interchange - \
        blinking stops and translations are retrieved automatically.\n \
        \n"

export function getElement(id: string) {
    let element = null;
    if (typeof document !== 'undefined') {
        element = document.getElementById(id);
    }

    return element;
}

export function displayTick(tick: number) {
    let element = getElement("tick");
    if (element) {
        element.innerHTML = tick.toString() + "ms";
    }
}

export function displayCode(code: string) {
    let element = getElement("code");
    if (element) {
        element.innerHTML = code;
    }
}

// Duration in seconds
export function play(frequency: number, duration: number, type: OscillatorType = "square") {
    const context = new window.AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(0.5, context.currentTime);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
};
