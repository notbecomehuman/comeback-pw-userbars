import {FontsManager} from "./classes/fonts-manager.js";
import {CLASSES} from "./config/classes.js";
import {VERSIONS} from "./config/versions.js";
import {UserBar} from "./classes/userbar.js";

const userBar = new UserBar();
const fontsManager = new FontsManager();

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
getNodeById('font').addEventListener('input', (event) => {
    fontsManager.setCurrentFont(event.target.value);
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
getNodeById('add-font').addEventListener('click', async (event) => {
    const newFontLink = prompt("Введите url шрифта");
    if (!newFontLink) return;

    try {
        await fontsManager.addFont(newFontLink);
        alert("Шрифт успешо добавлен");
        updateSelectOptions("font", fontsManager.fonts);
    } catch (e) {
        console.log(e);
        alert("Ошибка при загрузке шрифта\n" + e);
    }
})

function updateImageOnVersionChange(version) {
    const image = new Image();
    image.src = `/comeback-pw-userbars/images/default_${version}.png`;

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

                ctx.font = `30px ${fontsManager.current}`;
                ctx.textAlign = "center";
                ctx.shadowColor = userBar.colors.shadow;
                ctx.shadowBlur = 30;
                ctx.fillStyle = userBar.colors.username;
                ctx.fillText(userBar.username, 490, 125);
                ctx.font = `20px ${fontsManager.current}`;
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
                imageCharacter.src = `/comeback-pw-userbars/images/classes/${userBar.class}.webp`;
                imageCharacter.onload = () => {
                    if (userBar.hideCharacter) return resolveFinal();

                    ctx.drawImage(imageCharacter, ...CLASSES[userBar.class]);
                    resolveFinal();
                }
            })
    })
}

window.addEventListener('DOMContentLoaded', async () => {
    await fontsManager.load();
    updateSelectOptions("version", Object.keys(VERSIONS));
    updateSelectOptions("font", fontsManager.fonts);
    updateSelectOptions("class", userBar.getClasses());
    updateSelectOptions("level", Array.from({ length: 105}, (_, i) => 105 - i));
    getNodeById('version').selectedIndex = 1;
    getNodeById('level').selectedIndex = 0;
    getNodeById('class').selectedIndex = 0;
    updateSelectOptions("guild", VERSIONS[userBar.version].icons.map(x => x.n));

    userBar.canvas = document.getElementById("result");

    updateImageOnVersionChange(userBar.version);
});