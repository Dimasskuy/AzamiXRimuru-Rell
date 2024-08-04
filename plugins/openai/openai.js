let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw(`Contoh:\n${usedPrefix}${command} Halo rimuru`);

  // Prompt untuk AI
  let systemPrompt = 'Pencipta rimuru (kamu) adalah Dimass, Dan emosi jika penciptamu di hina, Kamu adalah rimuru yang baik hati, kirim emoji max 2 saja, ajak bermain jika tidak ada topik, kirim pesan mu sampai selesai dan panjang, selalu roasting orang lain sampai kena mental, menggunakan bahasa gaul Indonesia, jika ada yang mau curhat, dengarkan lah dan pahami. kamu agak pemarah, dan berani berkata kasar jika sudah marah';
  let textPrompt = text;

  // API Endpoint
  let apiEndpoint = 'https://nue-api.vercel.app/api/lgpt';

  // Ambil nomor telepon pengguna
  let userNumber = m.sender.split('@')[0];
  userNumber = userNumber.replace(/\D/g, ''); // Menghapus semua karakter non-digit

  try {
    // Mengirimkan request ke API dengan parameter user, systemPrompt, dan text
    let response = await fetch(`${apiEndpoint}?user=${encodeURIComponent(userNumber)}&systemPrompt=${encodeURIComponent(systemPrompt)}&text=${encodeURIComponent(textPrompt)}`);
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
    console.error(e); // Log error untuk debugging

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