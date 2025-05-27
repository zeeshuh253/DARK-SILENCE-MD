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
      let viewOnceData = quoted.message.viewOnceMessageV2.message;
      let mediaType = Object.keys(viewOnceData)[0];

      if (mediaType === "imageMessage") {
        console.log("Quoting an image");
        let caption = viewOnceData.imageMessage.caption;
        let savedPath = await conn.downloadAndSaveMediaMessage(viewOnceData.imageMessage);
        return conn.sendMessage(mek.chat, { image: { url: savedPath }, caption: caption });
      } else if (mediaType === "videoMessage") {
        let caption = viewOnceData.videoMessage.caption;
        let savedPath = await conn.downloadAndSaveMediaMessage(viewOnceData.videoMessage);
        return conn.sendMessage(mek.chat, { video: { url: savedPath }, caption: caption });
      } else if (mediaType === "audioMessage") {
        let savedPath = await conn.downloadAndSaveMediaMessage(viewOnceData.audioMessage);
        return conn.sendMessage(mek.chat, { audio: { url: savedPath }});
      }
    } else {
      return reply("This is not a ViewOnce message");
    }
  } catch (error) {
    console.log("Error processing viewOnce message:", error);
  }
});
