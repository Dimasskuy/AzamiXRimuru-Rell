import axios from "axios";
import uploadImage from "../../lib/uploadImage.js";

const handler = async (m, { text, usedPrefix, command }, conn) => {
    const lister = [
        "v1",
        "v2",
        "v3",
        "v4",
        "v5",
        "v6",
        "v7"
    ];

    if (!conn || !conn.reply) {
        console.error("conn or conn.reply is not defined");
        return;
    }

    let [inputs, feature] = text.split(" ");
    let msg = `Masukkan tautan yang valid\n\n*Contoh:*\n${usedPrefix + command} link v2\n\n*Pilih versi yang ada:*\n${lister.map(v => "  ○ " + v.toUpperCase()).join("\n")}`;
    let LinkReg = /https?:\/\//.test(inputs) ? inputs : "https://" + inputs;
    if (!(text && inputs && LinkReg)) return conn.reply(m.chat, msg, m);
    feature = feature || "v5";
    if (!lister.includes(feature.toLowerCase())) return conn.reply(m.chat, msg, m);
    await conn.reply(m.chat, 'Sedang memproses, bang! 📸', m);
    try {
        let res;
        switch (feature) {
            case "v1":
                res = `https://shot.screenshotapi.net/screenshot?token=WCCYKR0-X5CMMV0-JB4G5Z5-P6SPC8R&url=${LinkReg}&full_page=true&fresh=true&output=image&file_type=jpg`;
                break;
            case "v2":
                res = `https://api.popcat.xyz/screenshot?url=${LinkReg}`;
                break;
            case "v3":
                res = `https://api.apiflash.com/v1/urltoimage?access_key=7eea5c14db5041ecb528f68062a7ab5d&wait_until=page_loaded&url=${LinkReg}`;
                break;
            case "v4":
                res = `https://image.thum.io/get/fullpage/${LinkReg}`;
                break;
            case "v5":
                let st = await ssweb(LinkReg, "full", "desktop");
                res = await uploadImage(st);
                break;
            case "v6":
                res = await ssweb2(LinkReg);
                break;
            case "v7":
                res = `https://mini.s-shot.ru/2560x1600/PNG/2560/Z100/?${LinkReg}`;
                break;
        }

        await conn.sendMessage(m.chat, {
            image: { url: res },
            caption: `*SCREENSHOT*\n- ${LinkReg}\n\n*Request:*\n- @${m.sender.split('@')[0]}`,
            mentions: [m.sender]
        }, { quoted: m });
        await conn.reply(m.chat, 'Berhasil! ✅', m);
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, 'Gagal! ❌', m);
    }
};

handler.help = ["ss", "ssf", "ssweb"];
handler.tags = ["tools"];
handler.command = /^ss(web|f)?$/i;
export default handler;

async function ssweb(url = "", full = false, type = "desktop") {
    type = type.toLowerCase();
    if (!["desktop", "tablet", "phone"].includes(type)) type = "desktop";
    let form = new URLSearchParams();
    form.append("url", url);
    form.append("device", type);
    if (!!full) form.append("full", "on");
    form.append("cacheLimit", 0);
    let res = await axios({
        url: "https://www.screenshotmachine.com/capture.php",
        method: "post",
        data: form
    });
    let cookies = res.headers["set-cookie"];
    let buffer = await axios({
        url: "https://www.screenshotmachine.com/" + res.data.link,
        headers: { "cookie": cookies.join("") },
        responseType: "arraybuffer"
    });
    return Buffer.from(buffer.data);
}

async function ssweb2(url) {
    let data = await axios.post("https://www.urlbox.io/api/render", { url });
    return data.data.screenshotUrl;
}