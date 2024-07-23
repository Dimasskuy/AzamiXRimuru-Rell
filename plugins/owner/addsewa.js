import db from '../../lib/database.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[0])) throw `Masukkan Angka Mewakili Jumlah Hari !\n*Misal : ${usedPrefix + command} 30*`

    let who
    if (m.isGroup) who = args[1] ? args[1] : m.chat
    else who = args[1]

    var jumlahHari = 86400000 * args[0]
    var now = new Date() * 1
    if (now < db.data.chats[who].expired) db.data.chats[who].expired = jumlahHari
    else db.data.chats[who].expired = now + jumlahHari
    conn.reply(m.chat, `
    👾Sewa Bot👾
    
    Selama ${args[0]} Hari.
    Hitung Mundur : ${msToDate(db.data.chats[who].expired - now)}
`, m)
}
handler.menuowner = ['addsewa']
handler.tagsowner = ['owner']
handler.command = /^(addsewa)$/i
handler.rowner = true
handler.group = true

export default handler

function msToDate(ms) {
    let temp = ms
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Hari " + hours + " Jam " + minutes + " Menit";
    // +minutes+":"+sec;
}