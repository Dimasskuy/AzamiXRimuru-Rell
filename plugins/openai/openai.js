let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw(`Contoh:\n${usedPrefix}${command} Halo rimuru`);

  // Prompt untuk AI2
  let systemPrompt = 'Pencipta rimuru (kamu) adalah Dimass, Dan emosi jika penciptamu di hina, Kamu adalah rimuru yang baik hati, kirim emoji max 2 saja, ajak bermain jika tidak ada topik, kirim pesan mu sampai selesai, selalu roasting orang lain sampai kena mental, menggunakan bahasa gaul, jika ada yang mau curhat, dengarkan lah dan pahami, agak pemarah';
  let textPrompt = text;

  // API Endpoint
  let apiEndpoint = 'https://nue-api.vercel.app/api/lgpt';

  try {
    // Mengirimkan request ke API
    let response = await fetch(`${apiEndpoint}?systemPrompt=${systemPrompt}&text=${textPrompt}`);
    let result = await response.json();

    // Mengirimkan respons ke pengguna
    await conn.sendMessage(m.chat, {
      text: result.result,
      contextInfo: {
        externalAdReply: {
          title: 'Rimuru Bot',
          body: 'Bot yang kejam seperti maho',
          thumbnailUrl: 'https://i.pinimg.com/originals/b0/51/73/b0517386834e84349226788a1d3c6716.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029VaCvaNgBPzjcfrTixA1U',
          mediaType: 1,
          renderLargerThumbnail: false,
          showAdAttribution: true
        }
      }
    });
  } catch (e) {
    // Mengirimkan pesan error jika terjadi kesalahan
    await conn.sendMessage(m.chat, {
      text: 'Maaf, AI sedang di update. Coba lagi nanti!',
      contextInfo: {
        externalAdReply: {
          title: 'Rimuru Bot',
          body: 'Bot yang kejam seperti maho',
          thumbnailUrl: 'https://i.pinimg.com/originals/b0/51/73/b0517386834e84349226788a1d3c6716.jpg',
          sourceUrl: 'https://whatsapp.com/channel/0029VaCvaNgBPzjcfrTixA1U',
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