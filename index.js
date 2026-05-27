import { icons_146, icons_136 } from "./guild_icons.js";

const CLASSES = {
    'Воин': [580, 0, 275, 350],
    'Маг': [560, 0, 250, 350],
    'Оборотень': [590, 0, 250, 350],
    'Друид': [550, 0, 250, 350],
    'Лучник': [500, 50, 400, 300],
    'Жрец': [570, 50, 300, 250],
    'Убийца': [580, 50, 250, 300],
    'Шаман': [580, 0, 250, 350],
    'Страж': [500, 0, 250, 350],
    'Мистик': [570, -10, 220, 350],
};

class Version {
    classes = [];
    icons = [{ n: 'Нет', i: "no_icon", special: true }, { n: "Comeback", i: "./images/gm_guild.png", special: true }];
    constructor(classes, icons) {
        this.classes = classes;
        this.icons = this.icons.concat(icons);
    }
}
const VERSIONS = {
    "136": new Version(Object.keys(CLASSES).slice(0, 6), icons_136),
    "146": new Version(Object.keys(CLASSES), icons_146),
}

class UserBar {
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
const userBar = new UserBar();

function getNodeById(id) {
    return document.getElementById(id);
}


function updateSelectOptions(nodeId, elements) {
    const selectNode = getNodeById(nodeId);
    selectNode.replaceChildren();
    for (const element of elements) {
        selectNode.append(new Option(element, element));
    }
}

getNodeById('username-color-text').addEventListener('input', (event) => {
    userBar.colors.username = event.target.value;
    updateImageOnVersionChange(userBar.version);
})
getNodeById('username-color-shadow').addEventListener('input', (event) => {
    userBar.colors.shadow = event.target.value;
    updateImageOnVersionChange(userBar.version);
})
getNodeById('username-color-guild').addEventListener('input', (event) => {
    userBar.colors.guild = event.target.value;
    updateImageOnVersionChange(userBar.version);
})
getNodeById('username-color-class').addEventListener('input', (event) => {
    userBar.colors.class = event.target.value;
    updateImageOnVersionChange(userBar.version);
})
getNodeById('version').addEventListener('input', (event) => {
    userBar.setVersion(event.target.value);
    userBar.setClass(VERSIONS[userBar.version].classes[0]);
    userBar.setGuild("Нет");
    updateSelectOptions("class", userBar.getClasses());
    updateSelectOptions("guild", VERSIONS[userBar.version].icons.map(x => x.n));
    updateImageOnVersionChange(userBar.version);
})
getNodeById('username').addEventListener('input', (event) => {
    userBar.setUsername(event.target.value);
    updateImageOnVersionChange(userBar.version);
})
getNodeById('level').addEventListener('input', (event) => {
    userBar.setLevel(event.target.value);
    updateImageOnVersionChange(userBar.version);
})
getNodeById('class').addEventListener('input', (event) => {
    userBar.setClass(event.target.value);
    updateImageOnVersionChange(userBar.version);
})
getNodeById('guild').addEventListener('input', (event) => {
    userBar.setGuild(event.target.value);
    updateImageOnVersionChange(userBar.version);
})
getNodeById('hide-character').addEventListener('input', (event) => {
    userBar.hideCharacter = event.target.checked;
    updateImageOnVersionChange(userBar.version);
})
getNodeById('search-guild').addEventListener('input', (event) => {
    updateSelectOptions("guild", VERSIONS[userBar.version].icons.map(x => x.n).filter(x => x.toLowerCase().includes(event.target.value.toLowerCase())));
    getNodeById('guild').value = "";
})

function updateImageOnVersionChange(version) {
    const image = new Image();
    image.src = `./images/default_${version}.png`;

    const imageCharacter = new Image();
    const imageGuild = new Image();

    const ctx = userBar.canvas.getContext("2d");
    const guildNameLength = ctx.measureText(`${userBar.guild.n}`);
    return new Promise(resolveFinal => {
        new Promise(resolve => {
            ctx.clearRect(0, 0, userBar.canvas.width, userBar.canvas.height);
            image.onload = () => {
                userBar.canvas.width = image.width;
                userBar.canvas.height = image.height;
                ctx.drawImage(image, 0, 0);

                ctx.font = `30px Georgia`;
                ctx.textAlign = "center";
                ctx.shadowColor = userBar.colors.shadow;
                ctx.shadowBlur = 30;
                ctx.fillStyle = userBar.colors.username;
                ctx.fillText(userBar.username, 490, 125);
                ctx.font = `20px Georgia`;
                ctx.fillStyle = userBar.colors.class;
                ctx.fillText(`${userBar.class}, ур. ${userBar.level}`, 490, 125 + (2 * 50));
                ctx.fillStyle = userBar.colors.guild;
                ctx.fillText(`${userBar.guild.n}`, 490, 125 + 50);
                ctx.shadowBlur = 0;
                resolve();
            }
        })
            .then(() => {
                return new Promise(resolve => {
                    if (userBar.guild.i === "no_icon") return resolve();

                    imageGuild.src = userBar.guild.special ? userBar.guild.i : `https://${userBar.version}.comeback.pw/img/ico_guilds/${userBar.guild.i}`;
                    imageGuild.onload = () => {
                        ctx.drawImage(imageGuild, 455 - guildNameLength.width / 2, 105 + 50, 25, 25);
                        resolve();
                    }
                    imageGuild.onerror = () => resolve();
                })
            })
            .then(() => {
                imageCharacter.src = `./images/classes/${userBar.class}.webp`;
                imageCharacter.onload = () => {
                    if (userBar.hideCharacter) return resolveFinal();

                    ctx.drawImage(imageCharacter, ...CLASSES[userBar.class]);
                    resolveFinal();
                }
            })
    })
}

window.addEventListener('DOMContentLoaded', async () => {
    updateSelectOptions("version", Object.keys(VERSIONS));
    updateSelectOptions("class", userBar.getClasses());
    updateSelectOptions("level", Array.from({ length: 105}, (_, i) => 105 - i));
    getNodeById('version').selectedIndex = 1;
    getNodeById('level').selectedIndex = 0;
    getNodeById('class').selectedIndex = 0;
    updateSelectOptions("guild", VERSIONS[userBar.version].icons.map(x => x.n));

    userBar.canvas = document.getElementById("result");

    updateImageOnVersionChange(userBar.version);
});