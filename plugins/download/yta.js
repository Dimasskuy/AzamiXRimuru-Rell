import { youtube } from 'btch-downloader';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} https://www.youtube.com/watch?v=Z28dtg_QmFw`; 
  try {
    const data = await youtube(text);
    await conn.sendMessage(m.chat, { 
      audio: { url: data.mp3 }, 
      mimetype: 'audio/mpeg' 
    }, { quoted: m });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

handler.menudownload = ['ytaudio <url>'];
handler.tagsdownload = ['search'];
handler.command = /^(yt(a(udio)?|mp3))$/i;
handler.exp = 0;
handler.limit = true;
handler.premium = false;

export default handler;