import db from '../../lib/database.js'
import { readMore, ranNumb, padLead } from '../../lib/func.js'
import { plugins } from '../../lib/plugins.js'
import { promises } from 'fs'
import { join } from 'path'
import fs from 'fs'

let tagsopenai = {
	'openai': 'openai',
}
const defaultMenu = {
before: `
━ ━ *[ 🤖 OpenAi ]* ━ ━
`.trimStart(),
header: '╭─「 %category 」',
body: '│ • %cmd',
footer: '╰────\n',
}
let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
	try {
		let nais = 'https://telegra.ph/file/1ebd24b9805d70b9ba5c4.jpg'
		let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
		let menuopenai = Object.values(plugins).filter(plugin => !plugin.disabled).map(plugin => {
			return {
			menuopenai: Array.isArray(plugin.tagsopenai) ? plugin.menuopenai : [plugin.menuopenai],
			tagsopenai: Array.isArray(plugin.tagsopenai) ? plugin.tagsopenai : [plugin.tagsopenai],
			prefix: 'customPrefix' in plugin,
			enabled: !plugin.disabled,
			}
		})
		for (let plugin of menuopenai)
			if (plugin && 'tagsopenai' in plugin)
			for (let tag of plugin.tagsopenai)
				if (!(tag in tagsopenai) && tag) tagsopenai[tag] = tag
		conn.openaimenu = conn.openaimenu ? conn.openaimenu : {}
		let before = conn.openaimenu.before || defaultMenu.before
		let header = conn.openaimenu.header || defaultMenu.header
		let body = conn.openaimenu.body || defaultMenu.body
		let footer = conn.openaimenu.footer || defaultMenu.footer
		let _text = [
			before,
			...Object.keys(tagsopenai).map(tag => {
			return header.replace(/%category/g, tagsopenai[tag]) + '\n' + [
				...menuopenai.filter(openaimenu => openaimenu.tagsopenai && openaimenu.tagsopenai.includes(tag) && openaimenu.menuopenai).map(openaimenu => {
				return openaimenu.menuopenai.map(menuopenai => {
					return body.replace(/%cmd/g, openaimenu.prefix ? menuopenai : '%p' + menuopenai)
					.trim()
				}).join('\n')
				}),
				footer
			].join('\n')
			})
		].join('\n')
		let text = typeof conn.openaimenu == 'string' ? conn.openaimenu : typeof conn.openaimenu == 'object' ? _text : ''
		let replace = {
			p: _p,
			'%': '%',
			readmore: readMore
		}
		text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
		const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => './src/avatar_contact.png')
		await conn.sendFThumb(m.chat, db.data.datas.maingroupname, text.replace(`fire <url>`, `fire <url>${readMore}`).trim(), nais, db.data.datas.linkgc, m)
	} catch (e) {
		console.log(e)
	}
}

handler.help = ['menuai']
handler.tags = ['submenu']
handler.command = /^menuopenai|menuai$/i

export default handler