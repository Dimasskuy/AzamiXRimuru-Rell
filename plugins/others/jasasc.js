let handler = async (m, { conn, command }) => {
	conn.reply(m.chat, ` Bot Ini Menggunakan Base Ori :
• https://github.com/HelgaIlham/ZukaBet`, m)
}

handler.command = /^(sc|sourcecode)$/i

export default handler