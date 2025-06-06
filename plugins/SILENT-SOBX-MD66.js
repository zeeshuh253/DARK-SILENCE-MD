const { cmd } = require('../command');

cmd({
  pattern: "find",
  desc: "Find YouTube song link",
  category: "search",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    if (!quoted) return reply("Please reply to a message with a song name or audio");

    let msg = quoted.message;
    let caption = msg.imageMessage?.caption || msg.videoMessage?.caption || msg.conversation || msg.extendedTextMessage?.text;

    if (!caption) return reply("No song name found in the message");

    let search = await searchYouTube(caption);
    if (!search || search.length === 0) return reply("No song found with the given name");

    let song = search[0];
    let songDetails = `*Song Name:* ${song.title}\n*Artist:* ${song.channel}\n*Duration:* ${song.duration}\n*Link:* https://www.youtube.com/watch?v=${song.id}`;

    return conn.sendMessage(mek.chat, { text: songDetails });
  } catch (error) {
    console.log(error);
    return reply("An error occurred while searching for the song");
  }
});

async function searchYouTube(query) {
  const yts = require('yt-search');
  let search = await yts(query);
  return search.videos;
}
