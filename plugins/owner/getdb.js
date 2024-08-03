import fs from 'fs';

const handler = async (m, { conn, text }) => {
    m.reply('Tunggu Sebentar, Sedang mengambil file Database');
    let sesi = await fs.readFileSync('./database.json');
    return await conn.sendMessage(m.chat, {
        document: sesi,
        mimetype: 'application/json',
        fileName: 'database.json'
    }, {
        quoted: m
    });
}

handler.menuowner = ['getdb'];
handler.tagsowner = ['owner'];
handler.command = /^(getdb)$/i;

handler.rowner = true;

export default handler;