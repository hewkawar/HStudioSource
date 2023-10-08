const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const configFile = require('../../config.json');
const config = configFile.app[configFile.appName] || configFile.app.debug;
const { version } = require('../../package.json')
const lang = require('../../lang.json');

async function getConfig(guildID) {
    try {
        const response = await axios.get(`https://api.hewkawar.xyz/app/hstuido/config?id=${guildID}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription(lang.default.commands.config.description)
        .setDescriptionLocalizations({
            th: lang.th.commands.config.description,
        }),
    async execute(interaction, client) {
        const requestedLocalization = lang[interaction.locale] || lang.default;

        const configData = await getConfig(interaction.guild.id);

        const configEmbed = new EmbedBuilder()
            .setTitle(`:gear: ${interaction.guild.name}'s Config`)
            .setColor(config.color)
            .setFields(
                { name: "Guild ID", value: `\`\`\`${configData.id}\`\`\``, inline: false },
                { name: "Loop", value: `\`\`\`${configData.loop}\`\`\``, inline: true },
                { name: "Speed", value: `\`\`\`x${configData.speed}\`\`\``, inline: true },
                { name: "Volume", value: `\`\`\`${configData.volume}\`\`\``, inline: true },
            )
            .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
            .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`);

        await interaction.reply({ embeds: [configEmbed] });
    },
};