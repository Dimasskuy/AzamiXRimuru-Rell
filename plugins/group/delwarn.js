import db from '../../lib/database.js'

let handler = async (m, { conn, args, groupMetadata}) => {
        let who
        if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
        else who = m.chat
        if (!who) throw `✳️ Memberi label atau menyebut seseorang`
        if (!(who in db.data.users)) throw `✳️ Pengguna hilang dari database saya`
       let warn = db.data.users[who].warn
       if (warn > 0) {
         db.data.users[who].warn -= 1
         m.reply(`⚠️ *PERINGATAN*
         
▢ Memperingatkan: *-1*
▢ Total Memperingatkan: *${warn - 1}*`)
         m.reply(`✳️ Seorang admin mengurangi peringatannya, sekarang Anda memiliki *${warn - 1}*`, who)
         } else if (warn == 0) {
            m.reply('✳️ Pengguna tidak memiliki peringatan')
        }

}
handler.menugroup = ['delwarn @user']
handler.tagsgroup = ['group']
handler.command = ['delwarn', 'unwarn'] 
handler.group = true
handler.owner = false
handler.admin = true
handler.botAdmin = true

export default handler;