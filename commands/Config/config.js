const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, Colors } = require('discord.js');
const axios = require('axios');
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

        if (configData.id) {
            const file = new AttachmentBuilder('assets/banner/serverconfig.png');

            const configEmbed = new EmbedBuilder()
            .setTitle(`:gear: ${interaction.guild.name}'s Config`)
            .setColor(Colors.Blue)
            .setFields(
                { name: "Guild ID", value: `\`\`\`${configData.id}\`\`\``, inline: false },
                { name: "Loop", value: `\`\`\`${configData.loop}\`\`\``, inline: true },
                { name: "Speed", value: `\`\`\`x${configData.speed}\`\`\``, inline: true },
                { name: "Volume", value: `\`\`\`${configData.volume}\`\`\``, inline: true },
            )
            .setFooter({ text: `${client.user.displayName} | ${requestedLocalization.commands.version}: ${version}` })
            .setThumbnail(`${interaction.guild.iconURL({ extension: 'png' })}`)
            .setImage('attachment://serverconfig.png');

            return await interaction.reply({ embeds: [configEmbed], files: [file] });
        } else {
            const embed = new EmbedBuilder()
            .setTitle(`⚠️ Can't connect to server!`)
            .setDescription('Please try again later')
            .setTimestamp(Date.now())
            return await interaction.reply({ embeds: [embed]})
        }
    },
};
