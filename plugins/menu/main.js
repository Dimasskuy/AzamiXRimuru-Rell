import db from '../../lib/database.js'
import { plugins } from '../../lib/plugins.js'
import { readMore, ranNumb, padLead, runtimes } from '../../lib/func.js'
import { promises } from 'fs'
import { join } from 'path'
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
╭───「 *PROFILMU* 」
├ • Nama  : *%name*
├ • Role : *%role*
├ • Limit : *%limit*
╰───────────── %readmore`.trimStart(),
	header: '╭─「 %category 」',
	body: '┊ • %cmd',
	footer: '╰────────────\n',
}
let handler = async (m, { conn, usedPrefix: _p, __dirname, isPrems }) => {
	try {
		let meh = padLead(ranNumb(43), 3)
		let nais = 'https://telegra.ph/file/1ebd24b9805d70b9ba5c4.jpg';
		let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
		let { limit, role } = db.data.users[m.sender]
		let name = await conn.getName(m.sender).replaceAll('\n','')
		let uptime = runtimes(process.uptime())
		let osuptime = runtimes(os.uptime())
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
			p: _p, uptime, osuptime,
			me: conn.getName(conn.user.jid),
			github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
			limit, name, role,
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
		await conn.sendFThumb(m.chat, db.data.datas.maingroupname, text.trim(), nais, db.data.datas.linkgc, m)
	} catch (e) {
		console.log(e)
	}
}

handler.command = /^((m(enu)?|help)(list)?|\?)$/i

handler.exp = 3

export default handler