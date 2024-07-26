import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Masukkan alamat IP!\n\n*Contoh:* ${usedPrefix}${command} 8.8.8.8`;
  try {
    const waiting = `_Sedang mencari informasi IP untuk ${text}..._`;
    m.reply(waiting);    
    let response = await fetch(`https://ipinfo.io/${text}/json`);
    let data = await response.json();
    const mapLink = `https://www.google.com/maps?q=${data.loc}`;
    m.reply(
      `Informasi IP untuk ${text}:\n` + 
      `🌍 Negara: ${data.country}\n` +
      `🌆 Wilayah: ${data.region}\n` +
      `🏙️ Kota: ${data.city}\n` +
      `📍 Koordinat: ${data.loc}\n` +
      `🔌 ISP: ${data.org}\n` +
      `🕒 Waktu zona: ${data.timezone}\n` +
      `📡 Nama kota: ${data.city}\n` +
      `🗺️ Nama wilayah: ${data.region}\n` +
      `🏞️ Nama negara: ${data.country}\n` +
      `🔗 Alamat IP publik: ${data.ip}\n` +
      `🗺️ [Google Maps Link](${mapLink})`
    );
  } catch (error) {
    console.error(error);
    m.reply('Terjadi error saat mencari informasi IP, silakan coba lagi nanti');
  }
};

handler.command = ['ip'];
handler.help = ['ip'];
handler.tags = ['tools'];

export default handler;