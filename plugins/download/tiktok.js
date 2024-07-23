import axios from 'axios';

let handler = async (m, { conn, text }) => {
    if (!text) {
        // Jika tidak ada input, kirim pesan panduan
        await conn.sendMessage(m.chat, { text: 'Silakan masukkan URL TikTok untuk mengunduh.' });
        return;
    }

    try {
        // Panggil API Nue untuk mengunduh TikTok
        const response = await axios.get(`https://nue-api.vercel.app/api/tt-dl?url=${encodeURIComponent(text)}`);
        const data = response.data;

        if (data.status === 'success') {
            const result = data.result;
            let message = '';

            // Kirim deskripsi dengan emosi
            if (result.desc) {
                message += `Deskripsi: ${result.desc}\n\n`;
            }

            // Kirim informasi author dengan emosi
            if (result.author) {
                message += `👤Author: ${result.author.nickname}\n\n`;
            }

            // Kirim statistik
            if (result.statistics) {
                message += `Statistik:\n`;
                message += `Likes: ${result.statistics.likeCount} 👍\n`;
                message += `Comments: ${result.statistics.commentCount} 💬\n`;
                message += `Shares: ${result.statistics.shareCount} 📢\n\n`;
            }

            // Kirim link video dan audio
            if (result.type === 'video') {
                message += `📹Video: ${result.video}\n`;
            }
            if (result.music) {
                message += `🎵Audio: ${result.music}\n` ;
            }

            // Kirim pesan akhir
            await conn.sendMessage(m.chat, { text: message });

            // Kirim gambar/video
            if (result.type === 'image') {
                for (const image of result.images) {
                    await conn.sendMessage(m.chat, { image: { url: image } });
                }
            } else if (result.type === 'video') {
                await conn.sendMessage(m.chat, { video: { url: result.video } });
            }

            // Kirim audio
            if (result.music) {
                await conn.sendMessage(m.chat, { audio: { url: result.music } });
            }
        } else {
            await conn.sendMessage(m.chat, { text: 'Maaf, terjadi kesalahan dalam memproses permintaan.' });
        }

    } catch (error) {
        console.error('Error querying Nue API:', error);
        await conn.sendMessage(m.chat, { text: `Error: ${error.message}` });
    }
};

handler.menudownload = ['tiktok <url>'];
handler.tagsdownload = ['search'];
handler.limit = 2;
handler.command = /^(tiktok|tt|download)$/i;

export default handler;