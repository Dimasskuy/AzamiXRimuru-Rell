const handler = async (m, {
  conn,
  text,
  participants
}) => {
  let users = participants.map(u => u.id).filter(v => v !== conn.user.jid);
  if (!m.quoted) throw "✳️ Reply Pesan";
  conn.sendMessage(m.chat, {
    forward: m.quoted?.fakeObj,
    mentions: users
  });
};
handler.menugroup = ["totag"], handler.tagsgroup = ["group"], handler.command = /^(totag|tag)$/i,
  handler.admin = !0, handler.group = !0;
export default handler;
