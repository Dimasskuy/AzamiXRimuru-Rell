import db from '../../lib/database.js'

export async function before(m) {
	if (!m.isGroup) return !1
	let user = db.data.users[m.sender]
	if (user?.afk > 0) {
		m.reply(`Kamu berhenti AFK${user.afkReason ? ` setelah ${user.afkReason}` : ''}\n  Selama ${clockString(new Date - user.afk)}`)
		user.afk = -1
		user.afkReason = ''
	}
	let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
	for (let jid of jids) {
		let user = db.data.users[jid]
		if (!user?.afk) continue
		if (user.afk > -1) m.reply(`Jangan tag dia!\n  Dia sedang AFK${user?.afkReason ? ` dengan alasan ${user.afkReason}` : ''}\n  Selama ${clockString(new Date - user.afk)}`)
	}
	return !0
}

function clockString(ms) {
	let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
	let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
	let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
	return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}