const { cmd, commands } = require('../command')
const { generateWAMessageFromContent, downloadContentFromMessage, generateWAMessageContent, } = require("@whiskeysockets/baileys");

cmd({ 
  pattern: "vv3", 
  react: "✅", 
  desc: "read vv", 
  category: "download", 
  filename: __filename 
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    // Cheack is owner and bot number
    if (!isOwner && senderNumber !== botNumber) return reply('This command is only for the bot owner and bot number.');

    if (!quoted) return reply("Please reply to a ViewOnce message");

    if (quoted.mtype === "viewOnceMessageV2") {
      let mediaType = Object.keys(quoted.message.viewOnceMessageV2.message)[0];
      let savedPath = await conn.downloadAndSaveMediaMessage(quoted.message.viewOnceMessageV2.message[mediaType]);
      
      if (mediaType === "imageMessage") {
        return conn.sendMessage(mek.chat, { image: { url: savedPath }, caption: quoted.message.viewOnceMessageV2.message[mediaType].caption });
      } else if (mediaType === "videoMessage") {
        return conn.sendMessage(mek.chat, { video: { url: savedPath }, caption: quoted.message.viewOnceMessageV2.message[mediaType].caption });
      } else if (mediaType === "audioMessage") {
        return conn.sendMessage(mek.chat, { audio: { url: savedPath }});
      }
    } else {
      return reply("This is not a ViewOnce message");
    }
  } catch (error) {
    console.log("Error processing viewOnce message:", error);
  }
});
