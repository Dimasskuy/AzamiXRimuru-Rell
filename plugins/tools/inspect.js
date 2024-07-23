import * as baileys from '@whiskeysockets/baileys'

let handler = async (m, { conn, text }) => {
	let [, code] = text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i) || []
	if (!code) throw 'Invalid Group WA URL'
	let res = await conn.query({ tag: 'iq', attrs: { type: 'get', xmlns: 'w:g2', to: '@g.us' }, content: [{ tag: 'invite', attrs: { code } }] }),
	data = extractGroupMetadata(res),
	txt = Object.keys(data).map(v => `*${v.capitalize()} :* ${data[v]}`).join('\n').replace('*Desc :*','\n*Desc :* \n'),
	pp = await conn.profilePictureUrl(data.id, 'image').catch(console.error)
	if (pp) {
		await conn.sendFile(m.chat, pp, '', txt, m)
	} else {
		m.reply(txt)
	}
}

handler.help = ['inspect <url>']
handler.tags = ['tools']
handler.command = /^(inspect(link(gc|group)?)?)$/i

export default handler

const extractGroupMetadata = (result) => {
	const group = baileys.getBinaryNodeChild(result, 'group')
	const descChild = baileys.getBinaryNodeChild(group, 'description')
	let desc
	if (descChild) desc = baileys.getBinaryNodeChild(descChild, 'body')?.content
	const metadata = {
		id: group.attrs.id.includes('@') ? group.attrs.id : baileys.jidEncode(group.attrs.id, 'g.us'),
		subject: group.attrs.subject,
		creation: new Date(+group.attrs.creation * 1000).toLocaleString('id', { timeZone: 'Asia/Jakarta' }),
		owner: group.attrs.creator ? 'wa.me/' + baileys.jidNormalizedUser(group.attrs.creator).split('@')[0] : undefined,
		desc
	}
	return metadata
}