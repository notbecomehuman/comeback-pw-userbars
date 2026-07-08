import {icons_136, icons_146} from "./guild_icons.js";
import { CLASSES } from "./classes.js";

class Version {
    classes = [];
    icons = [{ n: 'Нет', i: "no_icon", special: true }, { n: "Comeback", i: "/comeback-pw-userbars/images/gm_guild.png", special: true }, { n: "No Fate", i: "2_4761.png" }];
    constructor(classes, icons) {
        this.classes = classes;
        this.icons = this.icons.concat(icons);
    }
}
export const VERSIONS = {
    "136": new Version(Object.keys(CLASSES).slice(0, 6), icons_136),
    "146": new Version(Object.keys(CLASSES), icons_146),
}