import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        conn.reply(m.chat, `Masukkan teks,misalnya: ${usedPrefix}${command} kucing`, m);
        return;
    }

    let url = `https://api.fumifumi.xyz/api/text2img?query=${text}`;
    conn.sendFile(m.chat, url, null, `*Hasil Gambar dari ${text}*`, m);
}

handler.menuopenai = ['txt2img'];
handler.tagsopenai = ['openai'];
handler.command = /^(txt2img|aiimage|text2img)$/i;
handler.premium = false;
handler.limit = 3;

export default handler;