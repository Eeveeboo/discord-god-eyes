import env from "./env";
import axios from "axios";
import eris from "eris";
import http from "http";
if (!env.WEBHOOK_URL?.endsWith("?wait=true")) env.WEBHOOK_URL += "?wait=true";
const client = new eris.Client(env.DISCORD_TOKEN!);
client.on("messageCreate", message => {
  if (message.guildID !== env.GUILD_ID || message.webhookID) return;
  var log: eris.MessageContent & {
    username: string, avatar_url: string, allowed_mentions: { parse: [] }, embeds: eris.Embed[]
  } = {
    username: `${message.author.username}#${message.author.discriminator} #${(message.channel as eris.GuildTextableChannel).name}`,
    avatar_url: message.author.avatarURL || message.author.defaultAvatarURL,
    allowed_mentions: { parse: [] },
    content: message.attachments.length ? message.attachments.map(a => `[${a.filename}, ${a.size}] ${a.url}`).join("\n") : message.content,
    flags: message.flags,
    embeds: message.attachments.length ? [{
      type: "rich",
      description: message.content
    }, ...message.embeds.slice(0, 8), {
      type: "rich",
      description: `<#${message.channel.id}> <@${message.author.id}> [Link](https://discord.com/channels/${message.guildID}/${message.channel.id}/${message.id})`
    }] : [...message.embeds.slice(0, 9), {
      type: "rich",
      description: `<#${message.channel.id}> <@${message.author.id}> [Link](https://discord.com/channels/${message.guildID}/${message.channel.id}/${message.id})`
    }]
  }
  axios({
    url: env.WEBHOOK_URL,
    method: 'post',
    data: log
  }).catch(console.error);
});
client.on("messageReactionAdd", async (_message, emoji) => {
  if (_message.guildID !== env.GUILD_ID) return;
  var message = await client.getMessage(_message.channel.id, _message.id).catch(e => undefined);
  if (!message) return;
  var regex = /<#\d+> <@!?\d+> \[Link\]\(https:\/\/discord.com\/channels\/(\d+)\/(\d+)\/(\d+)\)/;
  if (!message.webhookID || !message.embeds.length) return;
  var match = message.embeds[message.embeds.length - 1].description?.match(regex);
  if (!match) return;
  client.deleteMessage(match[2], match[3]).then(() => {
    client.addMessageReaction(message!.channel.id, message!.id, "🗑");
  }).catch(() => { });
});
client.connect();
http.createServer((_, res) => { res.end("Discord God Eyes is Running."); }).listen(8080);