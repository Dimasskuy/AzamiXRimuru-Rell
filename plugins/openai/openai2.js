import axios from 'axios';

let handler = async (m, { conn, text }) => {
    if (!text) {
        // Jika tidak ada input, kirim pesan panduan
        await conn.sendMessage(m.chat, { text: 'Silakan masukkan teks untuk berbicara dengan OpenAI.' });
        return;
    }

    try {
        // Panggil API OpenAI
        const response = await axios.get(`https://widipe.com/openai?text=${encodeURIComponent(text)}`);
        const data = response.data;

        if (data.status) {
            const result = data.result;
            await conn.sendMessage(m.chat, { text: result });
        } else {
            await conn.sendMessage(m.chat, { text: 'Maaf, terjadi kesalahan dalam memproses permintaan.' });
        }

    } catch (error) {
        console.error('Error querying OpenAI API:', error);
        await conn.sendMessage(m.chat, { text: `Error: ${error.message}` });
    }
};

handler.menu = ['ai2'];
handler.tags = ['ai'];
handler.limit = 1;
handler.command = /^(openai2|ai2)$/i;

export default handler;