import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';

async function igdl(url) {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://v3.igdownloader.app/api/ajaxSearch',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*'
      },
      data: qs.stringify({
        recaptchaToken: '',
        q: url,
        t: 'media',
        lang: 'en'
      })
    });

    const $ = cheerio.load(response.data.data);
    const result = [];
    $('ul.download-box li').each((index, element) => {
      const thumbnail = $(element).find('.download-items__thumb img').attr('src');
      const options = [];
      let videoUrl = '';
      let audioUrl = '';
      let caption = $(element).find('.photo-caption').text().trim();
      $(element).find('.photo-option select option').each((i, opt) => {
        const resolution = $(opt).text();
        const url = $(opt).attr('value');
        if (resolution.toLowerCase().includes('video')) {
          videoUrl = url;
        } else if (resolution.toLowerCase().includes('audio')) {
          audioUrl = url;
        } else {
          options.push({
            resolution: resolution,
            url: url
          });
        }
      });
      const download = $(element).find('.download-items__btn a').attr('href');

      result.push({
        thumbnail: thumbnail,
        options: options,
        video: videoUrl,
        audio: audioUrl,
        download: download,
        caption: caption
      });
    });

    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`Gunakan perintah dengan URL Instagram.\nContoh: ${usedPrefix + command} https://www.instagram.com/p/xxxxx/`);
  }
  m.reply('Tunggu sebentar...');
  
  const result = await igdl(text);
  if (!result.length) {
    return m.reply('Gagal mengunduh media. Pastikan URL yang diberikan benar dan coba lagi.');
  }

  for (const item of result) {
    if (item.video) {
      await conn.sendFile(m.chat, item.video, 'video.mp4', item.caption, m);
    } else if (item.options.length) {
      const photoUrl = item.options[0].url;
      await conn.sendFile(m.chat, photoUrl, 'image.jpg', item.caption, m);
    } else {
      await conn.sendFile(m.chat, item.download, 'file', item.caption, m);
    }
    // Kirimkan audio jika tersedia
    if (item.audio) {
      await conn.sendFile(m.chat, item.audio, 'audio.mp3', 'Ini adalah audio dari media yang Anda minta.', m);
    }
  }
};

handler.menudownload = ['igdl <url>'];
handler.tagsdownload = ['downloader'];
handler.command = ["ig", "igdl", "instagram"];

export default handler;