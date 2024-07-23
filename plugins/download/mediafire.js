import { mediafiredl } from '@bochilteam/scraper';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Use example ${usedPrefix}${command} https://www.mediafire.com/file/941xczxhn27qbby/GBWA_V12.25FF-By.SamMods-.apk/file`;
    let res = await mediafiredl(args[0]);
    let { url, url2, filename, ext, aploud, filesize, filesizeH } = res;
    let caption = `
*💌 Name:* ${filename}
*📊 Size:* ${filesizeH}
*🗂️ Extension:* ${ext}
*📨 Uploaded:* ${aploud}
`.trim();
    m.reply(caption);
    conn.sendMessage(m.chat, { document: { url: url }, mimetype: ext, fileName: filename }, { quoted: m });
};

handler.menudownload = ['mediafire'].map(v => v + ' <url>');
handler.tagsdownload = ['search'];
handler.command = /^(mediafire|mf)$/i;

handler.limit = true;

export default handler;