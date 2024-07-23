 
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw(`Contoh:\n${usedPrefix}${command} Halo?`);   
  let ouh = await fetch(`https://api.ssateam.my.id/api/gemini?message=${text}`)
  let gyh = await ouh.json() 
  await conn.sendMessage(m.chat, {
  text: `${gyh.data.response}`,
      contextInfo: {
      externalAdReply: {
        title: 'G O O G L E',
        body: 'G E M I N I',
        thumbnailUrl: 'https://i.pinimg.com/originals/d8/a7/8e/d8a78ed85e6232c4137ce0e4850bea98.png',
        sourceUrl: 'https://whatsapp.com/channel/0029VaCvaNgBPzjcfrTixA1U',
        mediaType: 1,
        renderLargerThumbnail: false, 
        showAdAttribution: true
      }}
  })}
handler.command = /^(gemini|bard)$/i
handler.menuopenai = ['gemini']
handler.tagsopenai = ['openai']
handler.premium = false

export default handler;
//Thanks to SSA Team:
//https://whatsapp.com/channel/0029VaDs0ba1SWtAQnMvZb0U
//Follow my channel:
//https://whatsapp.com/channel/0029VaF8RYn9WtC16ecZws0H