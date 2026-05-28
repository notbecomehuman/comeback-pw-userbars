export class BackgroundManager {
    defaultBackgrounds = [
        "sakura_garden.png",
        "cold_mountain.png",
    ]
    current = 0;

    getCurrent() {
        return this.defaultBackgrounds[this.current];
    }
    next() {
        this.current = this.current + 1 === this.defaultBackgrounds.length ? 0 : this.current + 1;
    }
    previous() {
        this.current = this.current - 1 === -1 ? this.defaultBackgrounds.length - 1 : this.current - 1;
    }
}