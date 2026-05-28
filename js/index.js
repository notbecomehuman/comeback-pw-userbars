import {FontsManager} from "./classes/fonts-manager.js";
import {CLASSES} from "./config/classes.js";
import {VERSIONS} from "./config/versions.js";
import {UserBar} from "./classes/userbar.js";
import {BackgroundManager} from "./classes/background-manager.js";

const userBar = new UserBar();
const fontsManager = new FontsManager();
const backgroundManager = new BackgroundManager();

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
    updateImageOnVersionChange();
});

getNodeById('username-color-shadow').addEventListener('input', (event) => {
    userBar.colors.shadow = event.target.value;
    updateImageOnVersionChange();
});

getNodeById('username-color-guild').addEventListener('input', (event) => {
    userBar.colors.guild = event.target.value;
    updateImageOnVersionChange();
});

getNodeById('username-color-class').addEventListener('input', (event) => {
    userBar.colors.class = event.target.value;
    updateImageOnVersionChange();
});

getNodeById('version').addEventListener('input', (event) => {
    userBar.setVersion(event.target.value);
    userBar.setClass(VERSIONS[userBar.version].classes[0]);
    userBar.setGuild("Нет");
    updateSelectOptions("class", userBar.getClasses());
    updateSelectOptions("guild", VERSIONS[userBar.version].icons.map(x => x.n));
    updateImageOnVersionChange();
});

getNodeById('font').addEventListener('input', (event) => {
    fontsManager.setCurrentFont(event.target.value);
    updateImageOnVersionChange();
});

getNodeById('username').addEventListener('input', (event) => {
    userBar.setUsername(event.target.value);
    updateImageOnVersionChange();
});

getNodeById('level').addEventListener('input', (event) => {
    userBar.setLevel(event.target.value);
    updateImageOnVersionChange();
});

getNodeById('class').addEventListener('input', (event) => {
    userBar.setClass(event.target.value);
    updateImageOnVersionChange();
});

getNodeById('guild').addEventListener('input', (event) => {
    userBar.setGuild(event.target.value);
    updateImageOnVersionChange();
});

getNodeById('hide-character').addEventListener('input', (event) => {
    userBar.hideCharacter = event.target.checked;
    updateImageOnVersionChange();
});

getNodeById('search-guild').addEventListener('input', (event) => {
    updateSelectOptions("guild", VERSIONS[userBar.version].icons.map(x => x.n).filter(x => x.toLowerCase().includes(event.target.value.toLowerCase())));
    getNodeById('guild').value = "";
});

getNodeById('previous-background').addEventListener('click', (event) => {
    backgroundManager.previous();
    updateImageOnVersionChange();
});

getNodeById('next-background').addEventListener('click', (event) => {
    backgroundManager.next();
    updateImageOnVersionChange();
});

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
});

getNodeById('download').addEventListener('click', (event) => {
    const canvas = getNodeById('result');
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${userBar.username}_userbar.png`;

        link.click();

        URL.revokeObjectURL(url);
    }, 'image/png');
});

getNodeById('upload-background').addEventListener('click', (event) => {
    getNodeById("upload-input").click();
});

getNodeById('upload-input').addEventListener('change', (event) => {
    const file = getNodeById('upload-input').files[0];
    if (!file) return;

    backgroundManager.addCustomBackground(URL.createObjectURL(file));
    updateImageOnVersionChange();
});

getNodeById('round-background').addEventListener('click', (event) => {
    backgroundManager.setRound(event.target.checked);
    updateImageOnVersionChange();
})

function updateImageOnVersionChange() {
    const canvasBackground = new Image();
    const currentSrc = backgroundManager.getCurrent();
    canvasBackground.src = currentSrc.includes("blob:") ? currentSrc : `/comeback-pw-userbars/images/backgrounds/${currentSrc}`;


    const ctx = userBar.canvas.getContext("2d");
    return new Promise(resolveFinal => {
        new Promise(resolve => {
            ctx.clearRect(0, 0, userBar.canvas.width, userBar.canvas.height);
            canvasBackground.onload = () => {
                userBar.canvas.width = 750;
                userBar.canvas.height = 329;

                if (backgroundManager.roundBackground) {
                    ctx.beginPath();
                    ctx.roundRect(0, 0, userBar.canvas.width, userBar.canvas.height, 30);
                    ctx.clip();
                }
                ctx.drawImage(canvasBackground, 0, 0, 750, 329);
                ctx.restore();

                resolve();
            }
        })
            .then(() => {
                return new Promise(resolve => {
                    const imageEntities = new Image();
                    imageEntities.src = `/comeback-pw-userbars/images/backgrounds/default_${userBar.version}.png`;
                    imageEntities.onload = () => {
                        ctx.drawImage(imageEntities, 0, 0);

                        ctx.font = `30px ${fontsManager.current}`;
                        ctx.textAlign = "center";
                        ctx.shadowColor = userBar.colors.shadow;
                        ctx.shadowBlur = 30;
                        ctx.fillStyle = userBar.colors.username;
                        ctx.fillText(userBar.username, 490, 130);
                        ctx.font = `20px ${fontsManager.current}`;
                        ctx.fillStyle = userBar.colors.class;
                        ctx.fillText(`${userBar.class}, ур. ${userBar.level}`, 490, 120 + (2 * 50));
                        ctx.fillStyle = userBar.colors.guild;
                        ctx.fillText(`${userBar.guild.n}`, 490, 125 + 50);
                        ctx.shadowBlur = 0;
                        resolve();
                    }
                })
            })
            .then(() => {
                return new Promise(resolve => {
                    if (userBar.guild.i === "no_icon") return resolve();

                    const imageGuild = new Image();
                    imageGuild.src = userBar.guild.special ? userBar.guild.i : `https://${userBar.version}.comeback.pw/img/ico_guilds/${userBar.guild.i}`;
                    imageGuild.onload = () => {
                        const guildNameLength = ctx.measureText(`${userBar.guild.n}`);
                        ctx.drawImage(imageGuild, 455 - guildNameLength.width / 2, 105 + 50, 25, 25);
                        resolve();
                    }
                    imageGuild.onerror = () => resolve();
                })
            })
            .then(() => {
                const imageCharacter = new Image();
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

    updateImageOnVersionChange();
});