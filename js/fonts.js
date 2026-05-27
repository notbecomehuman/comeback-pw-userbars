export class FontsManager {
    links = [
        "https://fonts.googleapis.com/css2?family=WDXL+Lubrifont+JP+N&display=swap",
        "https://fonts.googleapis.com/css2?family=Hachi+Maru+Pop&display=swap",
        "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap",
        "https://fonts.googleapis.com/css2?family=Marck+Script&display=swap",
        "https://fonts.googleapis.com/css2?family=Tektur&display=swap",
        "https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap",
        "https://fonts.googleapis.com/css2?family=Lobster&display=swap"
    ]
    fonts = [
        'Georgia'
    ];
    current = "Georgia";

    setCurrentFont(font) {
         if (!this.fonts.includes(font)) throw new Error('Шрифт не найден');

         this.current = font;
    }
    async load() {
        for (let element of this.links) {
            try {
                const link = document.createElement('link');

                link.rel = 'stylesheet';

                link.href = element;

                document.head.appendChild(link);

                const match = element.match(/family=([^&]+)/);
                const fontName = match[1].replace(/\+/g, ' ');
                await new Promise((resolve, reject) => { link.onload = resolve; link.onerror = reject; });

                this.fonts.push(fontName);
                await document.fonts.load(`30px ${fontName}`, "Test - тест");
                await document.fonts.load(`20px ${fontName}`, "Test - тест");
            } catch (e) {
                console.log("Ошибка при загрузке шрифта: ", e);
            }
        }
        await document.fonts.ready;

    }
    async addFont(font) {
        try {
            if (this.links.includes(font)) throw new Error("Шрифт уже есть в списке");


            const link = document.createElement('link');

            link.rel = 'stylesheet';

            link.href = font;

            document.head.appendChild(link);
            const match = font.match(/family=([^&]+)/);
            const fontName = match[1].replace(/\+/g, ' ');
            await new Promise((resolve, reject) => { link.onload = resolve; link.onerror = reject; });

            this.fonts.push(fontName);
            await document.fonts.load(`30px ${fontName}`, "Test - тест");
            await document.fonts.load(`20px ${fontName}`, "Test - тест");
        } catch (e) {
            throw e;
        }
    }
}