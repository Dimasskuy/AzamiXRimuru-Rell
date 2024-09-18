import { youtube } from 'btch-downloader';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*Example:* ${usedPrefix + command} https://www.youtube.com/watch?v=Z28dtg_QmFw`; 
  try {
    const data = await youtube(text);
    await conn.sendMessage(m.chat, { 
      video: { url: data.mp4 }, 
      mimetype: 'video/mp4' 
    }, { quoted: m });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

handler.menudownload = ['ytvideo <url>']
handler.tagsdownload = ['search']
handler.command = /^(yt(v(ideo)?|mp4))$/i

handler.premium = false
handler.limit = true

export default handler