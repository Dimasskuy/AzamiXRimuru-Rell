import fetch from 'node-fetch';

// Array berisi berbagai opsi untuk body
const bodyOptions = [
  'Bot yang kejam seperti maho',
  'Jangan terlalu serius, bot ini hanya bercanda',
  'Siapkan mental sebelum bercanda dengan bot ini',
  'Bot ini punya banyak karakter, siap-siap saja!',
  'Selamat datang di dunia kejamnya bot!'
];

// Array berisi berbagai opsi untuk sourceUrl
const sourceUrlOptions = [
  'https://whatsapp.com/channel/0029VaCvaNgBPzjcfrTixA1U',
  'https://chat.whatsapp.com/HsaU1jHLz2e4K5HEn17563',
  'https://felizmunzz.vercel.app',
  'https://chat.whatsapp.com/DXPU5F2cePXEaysvcImdUy',
  'https://chat.whatsapp.com/JrLwzG2ptrK0fmU96L6EKJ'
];

// Array berisi berbagai opsi untuk thumbnailUrl
const thumbnailUrlOptions = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmjTZsn1KyEt7eOgl-yTNpnQ_8DqZW_6HFCTGnlxB2tk_PcSAP-MQkKGij&s=10',
  'https://th.bing.com/th/id/OIP.fF0mjzdKC6vKh5Wf-tsuLQHaFj?w=167&h=125&c=7&r=0&o=5&dpr=2&pid=1.7',
  'https://i.pinimg.com/originals/b0/51/73/b0517386834e84349226788a1d3c6716.jpg',
  'https://th.bing.com/th/id/OIP.RziDEZD4hW0XQWAaA23KUgHaHZ?w=167&h=166&c=7&r=0&o=5&dpr=2&pid=1.7',
  'https://th.bing.com/th/id/OIP.UyX74kD1JQ02pc82ugtUpAHaHa?w=167&h=167&c=7&r=0&o=5&dpr=2&pid=1.7'
];

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw(`Contoh:\n${usedPrefix}${command} Halo rimuru`);

  // Prompt untuk AI
  let systemPrompt = 'Pencipta rimuru adalah Dimass, Dan emosi jika penciptamu di hina. Kamu adalah rimuru yang pemarah. kirim emoji maksimal 2 saja. ajak bermain jika tidak ada topik,permainannya yang menantang. kirim pesan mu sampai selesai. selalu roasting orang lain sampai kena mental jika orang tersebut seperti sampah atau pecundang. menggunakan bahasa anak gaul Indonesia. berani berkata kasar. jika ada yang mau curhat, dengarkan lah dan beri semangat. kamu selalu pemarah, dan berani berkata kasar jika sudah marah. jangan selalu mengulangi perkataan sebelumnya.';
  let textPrompt = text;

  // API Endpoint
  let apiEndpoint = 'https://nue-api.vercel.app/api/lgpt';

  // Pilih body, sourceUrl, dan thumbnailUrl secara acak dari array
  const randomBody = bodyOptions[Math.floor(Math.random() * bodyOptions.length)];
  const randomSourceUrl = sourceUrlOptions[Math.floor(Math.random() * sourceUrlOptions.length)];
  const randomThumbnailUrl = thumbnailUrlOptions[Math.floor(Math.random() * thumbnailUrlOptions.length)];

  try {
    // Mengirimkan request ke API dengan parameter user sebagai 'dmss', systemPrompt, dan text
    let response = await fetch(`${apiEndpoint}?user=${encodeURIComponent('dmss')}&systemPrompt=${encodeURIComponent(systemPrompt)}&text=${encodeURIComponent(textPrompt)}`);
    let result = await response.json();

    // Mengirimkan respons ke pengguna
    await conn.sendMessage(m.chat, {
      text: result.result,
      contextInfo: {
        externalAdReply: {
          title: 'Rimuru Bot',
          body: randomBody,  // Body yang diacak
          thumbnailUrl: randomThumbnailUrl,  // Thumbnail yang diacak
          sourceUrl: randomSourceUrl,  // URL yang diacak
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }
    });
  } catch (e) {
    console.error(e); // Log error untuk debugging

    // Mengirimkan pesan error jika terjadi kesalahan
    await conn.sendMessage(m.chat, {
      text: 'Maaf, AI sedang di update. Coba lagi nanti!',
      contextInfo: {
        externalAdReply: {
          title: 'Rimuru Bot',
          body: randomBody,  // Body yang diacak
          thumbnailUrl: randomThumbnailUrl,  // Thumbnail yang diacak
          sourceUrl: randomSourceUrl,  // URL yang diacak
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }
    });
  }
};

handler.command = /^(ai|rimuru)$/i;
handler.menuopenai = ['ai'];
handler.tagsopenai = ['openai'];
handler.premium = false;

export default handler;