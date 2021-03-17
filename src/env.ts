// Verify ENV
var env = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  GUILD_ID: process.env.GUILD_ID,
  WEBHOOK_URL: process.env.WEBHOOK_URL
};
var error = false;
// DISCORD_TOKEN
if (typeof env.DISCORD_TOKEN != 'string' || env.DISCORD_TOKEN.length < 32) {
  error = true;
  console.error("Enviroment Variable DISCORD_TOKEN Missing.");
}
// GUILD_ID
if (typeof env.GUILD_ID != 'string' || env.GUILD_ID.length < 17) {
  error = true;
  console.error("Enviroment Variable GUILD_ID Missing.");
}
// WEBHOOK_URL
if (typeof env.WEBHOOK_URL != 'string' || env.WEBHOOK_URL.length < 32) {
  error = true;
  console.error("Enviroment Variable WEBHOOK_URL Missing.");
}
// Export
if (error) process.exit(1);
export default env;