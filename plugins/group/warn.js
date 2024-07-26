import db from '../../lib/database.js'

let war = global.maxwarn
let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {      
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        if (!who) throw `✳️ Memberi label atau menyebut seseorang\n\n📌 Contoh : ${usedPrefix + command} @user`
        if (!(who in db.data.users)) throw `✳️ Pengguna hilang dari database saya`
        let name = conn.getName(m.sender)
        let warn = db.data.users[who].warn
        if (warn < war) {
            db.data.users[who].warn += 1
            m.reply(`
⚠️ *Pengguna yang Diperingatkan* ⚠️

▢ *Admin:* ${name}
▢ *Pengguna:* @${who.split`@`[0]}
▢ *Memperingatkan:* ${warn + 1}/${war}
▢ *Alasan:* ${text}`, null, { mentions: [who] }) 
            m.reply(`
⚠️ *PERINGATAN* ⚠️
Anda menerima peringatan dari admin

▢ *Memperingatkan:* ${warn + 1}/${war} 
Jika Anda menerima *${war}* Peringatan bahwa Anda akan dihapus secara otomatis dari grup`, who)
        } else if (warn == war) {
            db.data.users[who].warn = 0
            m.reply(`⛔ Pengguna melebihi peringatan *${war}* karena itu akan dihapus`)
            await time(3000)
            await conn.groupParticipantsUpdate(m.chat, [who], 'remove')
            m.reply(`♻️ Anda tersingkir dari grup *${groupMetadata.subject}* karena Anda telah diperingatkan *${war}* kali`, who)
        }
}
handler.menugroup = ['warn']
handler.tagsgroup = ['group']
handler.command = ['warn'] 
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler;

const time = async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }