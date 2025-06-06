const { cmd } = require('../command');
const dl = require('@bochilteam/scraper')  
const ytdl = require('yt-search');
const fs = require('fs-extra')
var videotime = 60000 // 1000 min
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
cmd({
  pattern: "find",
  desc: "Find YouTube song link",
  category: "search",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    if (!quoted) return reply("Please reply to a message with a song name or audio");

    let msg = quoted.message;
    let caption = '';

    if (msg.imageMessage) {
      caption = msg.imageMessage.caption;
    } else if (msg.videoMessage) {
      caption = msg.videoMessage.caption;
    } else if (msg.conversation) {
      caption = msg.conversation;
    } else if (msg.extendedTextMessage) {
      caption = msg.extendedTextMessage.text;
    }

    if (!caption) {
      if (quoted.message.audioMessage) {
        caption = 'song'; // Default search query for audio messages
      } else {
        return reply("No song name found in the message");
      }
    }

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
