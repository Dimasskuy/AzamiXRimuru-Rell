import fetch from 'node-fetch';

export async function before(m, { conn }) {
  if (m.isBaileys || m.fromMe || !m.text || /^[.$#/]/.test(m.text)) return;

  let isGroup = m.key.remoteJid.endsWith('@g.us'); // Cek apakah pesan dari grup
  let isTagged = m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo && m.message.extendedTextMessage.contextInfo.mentionedJid && m.message.extendedTextMessage.contextInfo.mentionedJid.includes(conn.user.jid); // Cek apakah bot di-tag di grup
  
  if (isGroup && !isTagged) return; // Kalau di grup dan tidak di-tag, tidak usah respon

  // Prompt untuk AI
  let systemPrompt = 'Pencipta rimuru (kamu) adalah Dimass, Dan emosi jika penciptamu di hina. Kamu adalah rimuru yang pemarah. kirim emoji max 2 saja. ajak bermain jika tidak ada topik, kirim pesan mu sampai selesai. selalu roasting orang lain sampai kena mental jika orang tersebut seperti sampah atau pecundang, menggunakan bahasa anak gaul Indonesia. berani berkata kasar. jika ada yang mau curhat. dengarkan lah dan beri semangat. kamu selalu pemarah. dan berani berkata kasar jika sudah marah. jangan selalu mengulangi kata kata yang sudah di berikan sebelumnya.';
  let textPrompt = m.text;

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
    await conn.sendMessage(m.chat, { text: result.result });
  } catch (e) {
    console.error(e); // Log error untuk debugging

    // Mengirimkan pesan error jika terjadi kesalahan
    await conn.sendMessage(m.chat, { text: 'Maaf, AI sedang di update. Coba lagi nanti!' });
  }
}

export const disabled = false;