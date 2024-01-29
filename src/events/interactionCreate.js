require("colors");
const { Events, Client, Interaction, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  /**
   *
   * @param {Interaction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.guild)
      return interaction.reply({
        content: "Slash commands can only be used in guilds",
      });

    if (!interaction.isCommand()) return;
    const config = client.config;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const embed = new EmbedBuilder();

    if (command.memberPerms) {
      if (!interaction.member.permissions.has(command.memberPerms)) {
        return interaction.reply({
          embeds: [
            embed
              .setColor(config.errorColor)
              .setDescription(
                `${config.emojis.error} **You do not have permission to use this command.**`
              ),
          ],
          ephemeral: true,
        });
      }
    }

    const bot = interaction.guild.members.me;

    if (command.botPerms) {
      if (!bot.permissions.has(command.botPerms)) {
        return interaction.reply({
          embeds: [
            embed
              .setColor(config.errorColor)
              .setDescription(
                `${config.emojis.error} **I do not have permission to execute this command.**`
              ),
          ],
          ephemeral: true,
        });
      }
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.log(`Command Error - ${error}`.red);
      await interaction.deferReply({ ephemeral: true }).catch(() => {});
      await interaction
        .editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(config.errorColor)
              .setTitle("An Error Occured While Using This Command.")
              .setDescription(
                `Please report this error: \n\`\`\`js\n${error}\`\`\``
              ),
          ],
          ephemeral: true,
        })
        .catch(() => {});
    }
  },
};
