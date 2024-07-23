import db from '../../lib/database.js'
import { isNumber, somematch } from '../../lib/func.js'

const cooldown = 60000

let handler = async (m, { conn, participants, usedPrefix, command, args, isOwner, isPrems, isAdmin }) => {
	let admins = []
	for (let i of participants) { if (i.admin == 'admin') admins.push(i.id) }
	if ((!m.quoted && !args[1]) || (m.quoted && !args[0])) throw `Format : ${usedPrefix + command} <timer> <@tag/quote>\n1 = 1 menit\n5 = 5 menit ... dst.\n\nContoh : *${usedPrefix + command} 10 @Alan*`
	let total = Math.floor(isNumber(args[0]) ? Math.min(Math.max(parseInt(args[0]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1
	let who = args[1] ? args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : !m.isGroup ? m.chat : m.quoted ? m.quoted.sender : m.mentionedJid ? m.mentionedJid[0] : ''
	if (!who) throw 'Tag salah satu lah'
	let ow = db.data.datas
	let data = [...ow.rowner.filter(([id, isCreator]) => id && isCreator), ...ow.owner.filter(([id, isCreator]) => id && isCreator)].map(v => v[0] + '@s.whatsapp.net')
	if (somematch(data, who) || who == conn.user.jid) throw `Gaboleh gitu :v`
	if (isOwner || isAdmin || isPrems) {
		if (somematch(admins, who) && !isOwner) throw `Gaboleh gitu sesama admin :v`
		if (total > 200 && !isPrems) throw `_... >> not premium ..._\n[!] Maksimal ${command} : 200 menit.`
		if (total > 400 && !isOwner) throw `[!] Maksimal ${command} : 400 menit.`
		let users = db.data.users[who]
		if (!users) throw `User tidak ada dalam database.`
		if (users.permaban) throw `[!] Tidak perlu *${command}* karena sudah di *ban*`
		if (users.banned) return m.reply(`Dia sudah di *mute* sebelumnya.`)
		users.banned = true
		users.lastbanned = new Date * 1
		users.bannedcd = cooldown * total
		users.spamcount = 0
		await conn.reply(who, `User @${who.split('@')[0]} di *mute* selama ${total} menit.`, fliveLoc, { mentions: [who] })
	} else {
		m.reply(`*「ADMIN GROUP ONLY」*`)
	}
}

handler.menugroup = ['diem <timer> @tag']
handler.tagsgroup = ['group']
handler.command = /^(di(e|a)m|silent)$/i

export default handler