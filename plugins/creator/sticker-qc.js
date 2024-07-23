import { sticker } from '../../lib/sticker.js';
import axios from 'axios';

const handler = async (m, { conn, args }) => {
    let text;
    let apiColor;

    if (args.length >= 1) {
        if (args[args.length - 1].startsWith('-')) {
            const color = args.pop().substr(1).toLowerCase();
            switch (color) {
                case 'red':
                    apiColor = '#ef1a11';
                    break;
                case 'blue':
                    apiColor = '#89cff0';
                    break;
                case 'dark':
                    apiColor = '#660000';
                    break;
                case 'green':
                    apiColor = '#87a96b';
                    break;
                case 'light':
                    apiColor = '#e9f6ff';
                    break;
                case 'white':
                    apiColor = '#ffffff';
                    break;
                case 'pink':
                    apiColor = '#ffc0cb';
                    break;
                case 'purple':
                    apiColor = '#ca86b0';
                    break;
                case 'dark blue':
                    apiColor = '#83a3ee';
                    break;
                case 'dark green':
                    apiColor = '#abcc88';
                    break;
                case 'light green':
                    apiColor = '#80bd76';
                    break;
                case 'light blue':
                    apiColor = '#6a84bd';
                    break;
                case 'brown':
                    apiColor = '#530101';
                    break;
                case 'dark purple':
                    apiColor = '#863434';
                    break;
                case 'black':
                    apiColor = '#000000';
                    break;
                case 'grey':
                    apiColor = '#2f3641';
                    break;
                case 'light pink':
                    apiColor = '#cc4291';
                    break;
                case 'dark red':
                    apiColor = '#7c4848';
                    break;
                case 'light purple':
                    apiColor = '#8a496b';
                    break;
                case 'orange':
                    apiColor = '#ffa500';
                    break;
                case 'navy':
                    apiColor = '#000080';
                    break;
                case 'teal':
                    apiColor = '#008080';
                    break;
                case 'maroon':
                    apiColor = '#800000';
                    break;
                case 'olive':
                    apiColor = '#808000';
                    break;
                case 'lime':
                    apiColor = '#00FF00';
                    break;
                case 'aqua':
                    apiColor = '#00FFFF';
                    break;
                case 'fuchsia':
                    apiColor = '#FF00FF';
                    break;
                case 'silver':
                    apiColor = '#C0C0C0';
                    break;
                case 'gold':
                    apiColor = '#FFD700';
                    break;
                case 'coral':
                    apiColor = '#FF7F50';
                    break;
                case 'salmon':
                    apiColor = '#FA8072';
                    break;
                case 'khaki':
                    apiColor = '#F0E68C';
                    break;
                case 'lavender':
                    apiColor = '#E6E6FA';
                    break;
                case 'plum':
                    apiColor = '#DDA0DD';
                    break;
                default:
                    apiColor = getRandomColor();
            }
        } else {
            apiColor = getRandomColor();
        }
        text = args.join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else throw "Input text or reply to the text you want to convert to a quote!";
    if (!text) return m.reply('Please enter text');
    if (text.length > 2000) return m.reply('Maximum 2000 characters!');

    const pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');

    let replyMessage = {};
    if (m.quoted && m.quoted.text) {
        const quotedPP = await conn.profilePictureUrl(m.quoted.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
        replyMessage = {
            "id": 2,
            "name": m.quoted.name || m.quoted.sender,
            "photo": {
                "url": quotedPP
            },
            "text": m.quoted.text
        };
    }

    const obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": apiColor,
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
                "id": 1,
                "name": m.name,
                "photo": {
                    "url": pp
                }
            },
            "text": text,
            "replyMessage": replyMessage
        }]
    };
    const json = await axios.post('https://qc.botcahx.eu.org/generate', obj, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const buffer = Buffer.from(json.data.result.image, 'base64');
    let stiker = await sticker(buffer, false, global.packname, global.author);
    if (stiker) return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m);
};

handler.help = ['qc <text>'];
handler.tags = ['creator'];
handler.command = /^(qc|quotely)$/i;
handler.limit = true;

export default handler;

function getRandomColor() {
    const randomColor = ['#ef1a11', '#89cff0', '#660000', '#87a96b', '#e9f6ff', '#ffe7f7', '#ca86b0', '#83a3ee', '#abcc88', '#80bd76', '#6a84bd', '#5d8d7f', '#530101', '#863434', '#013337', '#133700', '#2f3641', '#cc4291', '#7c4848', '#8a496b', '#722f37', '#0fc163', '#2f3641', '#e7a6cb', '#64c987', '#e6e6fa', '#ffa500', '#000080', '#008080', '#800000', '#808000', '#00FF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#FFD700', '#FF7F50', '#FA8072', '#F0E68C', '#E6E6FA', '#DDA0DD'];
    return randomColor[Math.floor(Math.random() * randomColor.length)];
}