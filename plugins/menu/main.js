import db from '../../lib/database.js'
import { plugins } from '../../lib/plugins.js'
import { readMore, ranNumb, padLead, runtimes } from '../../lib/func.js'
import { xpRange } from '../../lib/levelling.js'
import { promises } from 'fs'
import { join } from 'path'
import moment from 'moment-timezone'
import os from 'os'

let tags = {
	'submenu': '*MENU*',
	'searching': '*SEARCH*',
	'information': '*INFORMATION*',
	'entertainment': '*ENTERTAINMENT*',
	'primbon': '*PRIMBON*',
	'creator': '*CREATOR*',
	'tools': '*TOOLS MENU*',
}

const defaultMenu = {
	before: `
 *Hai, %ucapan %name 👋🏻*

> *T I M E*
> %wib WIB
> %wita WITA
> %wit WIT

> *D A T E*
> *Hari*: %week
> *Tanggal*: %date
> *Tanggal Islam*: %dateIslamic
> *Tahun Baru*: -%dateCountdown

> *B O T   I N F O*
> *Memory*: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
> *Platform*: %platformInfo
> *Informasi*: %infomem
> *Free Memory*: %freemem
> *Total Memory*: %totalmem
> *Uptime*: %uptime (%muptime)
> *Database*: %totalreg dari %rtotalreg

> *U S E R   I N F O*
> *Limit*: %limit
> *Level*: %level
> *XP*: %totalexp

*NOTE* :
Jika Ada Fitur Yang Error, Tolong Segera Lapor Kepada Owner. Dengan Menghubungi Email : rimurubetaa@gmail.com

`.trimStart(),
	header: '╭─「 %category 」',
	body: '┊ • %cmd',
	footer: '╰────────────\n',
}

let handler = async (m, { conn, usedPrefix: _p, __dirname, isPrems }) => {
	try {
		let meh = padLead(ranNumb(43), 3)
		let nais = 'https://telegra.ph/file/1ebd24b9805d70b9ba5c4.jpg';
		let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
		let { limit, role, level, exp } = db.data.users[m.sender]
		let { min, xp, max } = xpRange(level, global.multiplier)
		let name = await conn.getName(m.sender).replaceAll('\n','')
		let uptime = runtimes(process.uptime())
		let osuptime = runtimes(os.uptime())
		

		let d = new Date(new Date + 3600000)
		let locale = 'id'
		const wib = moment.tz('Asia/Jakarta').format("HH:mm:ss")
		const wita = moment.tz('Asia/Makassar').format("HH:mm:ss")
		const wit = moment.tz('Asia/Jayapura').format("HH:mm:ss")
		let week = d.toLocaleDateString(locale, { weekday: 'long' })
		let date = d.toLocaleDateString(locale, {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
		let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(d)

		const targetDate = new Date('January 1, 2025 00:00:00')
		const currentDate = new Date()
		const remainingTime = targetDate.getTime() - currentDate.getTime()
		const seconds = Math.floor(remainingTime / 1000) % 60
		const minutes = Math.floor(remainingTime / 1000 / 60) % 60
		const hours = Math.floor(remainingTime / 1000 / 60 / 60) % 24
		const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24)
		let dateCountdown = `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik lagi menuju tahun baru!`

		let totalreg = Object.keys(db.data.users).length
		let rtotalreg = Object.values(db.data.users).filter(user => user.registered == true).length
		let _muptime
        if (process.send) {
        process.send('uptime')
        _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
         }) * 1000
        }
        let muptime = clockString(_muptime)

		const platform = os.platform()
		const arch = os.arch()
		const release = os.release()
		const totalMem = os.totalmem() / (1024 * 1024 * 1024)
		const freeMem = os.freemem() / (1024 * 1024 * 1024)

		const platformInfo = `${platform}`
		const infomem = `Architecture ${arch}, ${release}`
		const totalmem = `${totalMem.toFixed(2)} GB`
		const freemem = `${freeMem.toFixed(2)} GB`

		let help = Object.values(plugins).filter(plugin => !plugin.disabled).map(plugin => {
			return {
				help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
				tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
				prefix: 'customPrefix' in plugin,
				limit: plugin.limit,
				premium: plugin.premium,
				enabled: !plugin.disabled,
			}
		})
		for (let plugin of help)
			if (plugin && 'tags' in plugin)
				for (let tag of plugin.tags)
					if (!(tag in tags) && tag) tags[tag] = tag
		conn.menu = conn.menu ? conn.menu : {}
		let before = conn.menu.before || defaultMenu.before
		let header = conn.menu.header || defaultMenu.header
		let body = conn.menu.body || defaultMenu.body
		let footer = conn.menu.footer || defaultMenu.footer
		let _text = [
			before.replace(': *%limit', `${isPrems ? ': *Infinity' : ': *%limit'}`),
			...Object.keys(tags).map(tag => {
				return header.replace(/%category/g, tags[tag]) + '\n' + [
					...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
						return menu.help.map(help => {
							return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
								.replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
								.replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '')
								.trim()
						}).join('\n')
					}),
					footer
				].join('\n')
			}),
		].join('\n')
		let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
		let replace = {
			'%': '%',
			p: _p, uptime, muptime,
			me: conn.getName(conn.user.jid),
			ucapan: ucapan(),
			github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
			totalexp: exp,
			level, limit, name, role,
			wib, wita, wit, week, date, dateIslamic, dateCountdown, platformInfo, infomem, totalmem, freemem, totalreg, rtotalreg,
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
		await conn.sendFThumb(m.chat, db.data.datas.maingroupname, text.trim(), nais, db.data.datas.linkgc, m)
	} catch (e) {
		console.log(e)
	}
}

handler.command = /^((m(enu)?|help)(list)?|\?)$/i


export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}


function ucapan() {
        const hour_now = moment.tz('Asia/Jakarta').format('HH')
        var ucapanWaktu = 'Pagi kak'
        if (hour_now >= '03' && hour_now <= '10') {
          ucapanWaktu = 'Pagi kak'
        } else if (hour_now >= '10' && hour_now <= '15') {
          ucapanWaktu = 'Siang kak'
        } else if (hour_now >= '15' && hour_now <= '17') {
          ucapanWaktu = 'Sore kak'
        } else if (hour_now >= '17' && hour_now <= '18') {
          ucapanWaktu = 'Selamat Petang kak'
        } else if (hour_now >= '18' && hour_now <= '23') {
          ucapanWaktu = 'Malam kak'
        } else {
          ucapanWaktu = 'Selamat Malam!'
        }	
        return ucapanWaktu
}