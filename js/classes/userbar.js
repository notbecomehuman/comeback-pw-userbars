import {VERSIONS} from "../config/versions.js";
import {CLASSES} from "../config/classes.js";

export class UserBar {
    version = Object.keys(VERSIONS)[1];
    username = null;
    level = 105;
    guild = VERSIONS[this.version].icons[0];
    class = Object.keys(CLASSES)[0];
    canvas = null;
    hideCharacter = false;
    colors = {
        username: "white",
        shadow: "black",
        guild: "white",
        class: "white",
    }

    getClasses() {
        return VERSIONS[this.version].classes;
    }
    setVersion(newVersion) {
        if (!Object.keys(VERSIONS).includes(newVersion)) throw new Error("Неизвестная версия");

        this.version = newVersion;
    }
    setUsername(newUsername) {
        this.username = newUsername;
    }
    setLevel(newLevel) {
        this.level = newLevel;
    }
    setClass(newClass) {
        if (!VERSIONS[this.version].classes.includes(newClass)) throw new Error("Неизвестный класс");
        this.class = newClass;
    }
    setGuild(newGuild) {
        const guildInfo = VERSIONS[this.version].icons.find(x => x.n === newGuild);
        if (!guildInfo) throw new Error("Неизвестная гильдия");
        this.guild = guildInfo;
    }
}