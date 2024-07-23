import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Use ${usedPrefix + command} [!url]`;
  conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

  try {
    const res = await igdl(text);
    conn.sendFile(m.chat, res.media[0], '', "success", m);
  } catch (e) {
    console.log(e);
    conn.reply(m.chat, "An error occured", m);
  }
};

// please follow the channel https://whatsapp.com/channel/0029VaddOXtAInPl84jp7Q1p for the next feature

handler.menudownload = ['ig <url>'];
handler.tagsdownload = ['search'];
handler.command = /^(ig|igdl|instagram)$/i;

export default handler;

async function igdl(url) {
  return new Promise(async (resolve, reject) => {
    const payload = new URLSearchParams(
      Object.entries({
        url: url,
        host: "instagram",
      }),
    );
    await axios
      .request({
        method: "POST",
        baseURL: "https://saveinsta.io/core/ajax.php",
        data: payload,
        headers: {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          cookie: "PHPSESSID=rmer1p00mtkqv64ai0pa429d4o",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
        },
      })
      .then((response) => {
        const $ = cheerio.load(response.data);
        const mediaURL = $(
          "div.row > div.col-md-12 > div.row.story-container.mt-4.pb-4.border-bottom",
        )
          .map((_, el) => {
            return (
              "https://saveinsta.io/" +
              $(el).find("div.col-md-8.mx-auto > a").attr("href")
            );
          })
          .get();
        const res = {
          status: 200,
          media: mediaURL,
        };
        resolve(res);
      })
      .catch((e) => {
        console.log(e);
        throw {
          status: 400,
          message: "error",
        };
      });
  });
}