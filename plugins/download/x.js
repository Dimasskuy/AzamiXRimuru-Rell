import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://twitter.com/gofoodindonesia/status/1229369819511709697`;
  if (!args[0].match(/https?:\/\/(www\.)?(twitter\.com|x\.com)/gi)) throw "URL Tidak Ditemukan!";
  
  try {
    const api = await fetch(`https://api.botcahx.eu.org/api/download/twitter2?url=${args[0]}&apikey=cFpSZBwN`);
    const res = await api.json();
    const mediaURLs = res.result.mediaURLs;
    for (let i of mediaURLs) {
      conn.sendFile(m.chat, i, null, `*ni udah bg*`, m);
    }
  } catch (e) {
    throw `*Server Down!*`;
  }
};

handler.menudownload = ['twitter <url>'];
handler.tagsdownload = ['search'];
handler.command = /^(twitter|twitterdl|xdl|twitdl)$/i;
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

export default handler;