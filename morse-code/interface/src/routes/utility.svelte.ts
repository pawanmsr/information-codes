export const TICK = {
    QUANTA: 25,
    MINIMUM: 25,
    MAXIMUM: 2500,
    DEFAULT: 250
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
