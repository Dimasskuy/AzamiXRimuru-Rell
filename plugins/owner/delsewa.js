import db from '../../lib/database.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let who
    if (m.isGroup) who = args[1] ? args[1] : m.chat
    else who = args[1]

    if (new Date() * 1 < db.data.chats[who].expired) db.data.chats[who].expired = false
    else db.data.chats[who].expired = false
    conn.reply(m.chat, `Berhasil Menghapus Hari Kadaluarsa Untuk Grup Ini`, m)
}
handler.menuowner = ['delsewa']
handler.tagsowner = ['owner']
handler.command = /^(delsewa)$/i
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
    return days + " hari " + hours + " jam " + minutes + " menit";
    // +minutes+":"+sec;
}