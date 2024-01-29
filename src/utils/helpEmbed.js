const { EmbedBuilder, Client } = require("discord.js");
const config = require("../config");

const helpEmbed = new EmbedBuilder();

/**
 *
 * @param {Client} client
 */
function buildHelpEmbed(client) {
  helpEmbed
    .setColor(config.embedColor)
    .addFields(
      client.commands.map((cmd) => {
        return {
          name: `\`/${cmd.data.name}\``,
          value: `> ${cmd.data.description}`,
        };
      })
    )
    .setTitle(`${client.user.username}'s Commands!`)
    .setFooter({
      text: `${client.user.username}'s Help Menu!`,
      iconURL: `${client.user.displayAvatarURL()}`,
    });

  return helpEmbed;
}

module.exports = buildHelpEmbed;
