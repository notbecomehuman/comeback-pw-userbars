export class BackgroundManager {
    defaultBackgrounds = [
        "sakura_garden.png",
        "cold_mountain.png"
    ]
    current = 0;
    roundBackground = true;

    getCurrent() {
        return this.defaultBackgrounds[this.current];
    }
    setRound(round) {
        this.roundBackground = round;
    }
    addCustomBackground(customBackground) {
        if (this.defaultBackgrounds.includes(customBackground)) return;

        this.defaultBackgrounds.push(customBackground);
        this.current = this.defaultBackgrounds.length - 1;
    }
    next() {
        this.current = this.current + 1 === this.defaultBackgrounds.length ? 0 : this.current + 1;
    }
    previous() {
        this.current = this.current - 1 === -1 ? this.defaultBackgrounds.length - 1 : this.current - 1;
    }
}