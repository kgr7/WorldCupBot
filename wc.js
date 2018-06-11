const Discord = require('discord.js');
const client = new Discord.Client();
// const creds = require('./creds.json');
const r = require('request');
const flags = require('./flag_dict.json');

let url = "https://fantasy.fifa.com/services/api/feed/players?gamedayId=1&optType=1&language=en&buster=default";

async function search_player(target, message){

	r(url, {json: true}, (err, res, body) => {

		let players = body.Data.Value.playerList;

		if (err){ 
			return console.log(err);
		}

		else{
			players.forEach( function(player) {
				if (player.PlayerFullName == target){

					let player_embed = new Discord.RichEmbed();
					let nextMatch = player.UpComingMatchesList[0];
					let oppCtryShort = nextMatch.VsCountryCode;
					let plrCtryShort = player.teamShortCode;

					let plrFlag = flags[plrCtryShort];
					let oppFlag = flags[oppCtryShort];
					
					player_embed.setTitle(`${player.PlayerDisplayName}`);
					player_embed.setColor('0x990001');
					player_embed.setFooter('fantasy.fifa.com', 'https://api.fifa.com/api/v1/picture/tournaments-sq-4/254645_w');
					player_embed.addField('Stats', `Goals: ${player.goalScored}` + '\n' + `Assists: ${player.goalAssist}` + '\n' + `Position: ${player.skillDesc}` + '\n' + `Country: ${plrFlag} (${player.TeamName})` + '\n' + `Captained: ${player.PlayerCapCount} (${player.SelectedCapPer}%)` + '\n' + `Gameday Pts: ${player.CurrGamedayPoints}` + '\n' + `Selected By: ${player.SelectedPercentage}%` + '\n' + `Value: €${player.value}M`);

					

					player_embed.addBlankField();
					player_embed.addField(`\nNext Game: ${oppFlag} (${oppCtryShort})`, `\nKick-off: ${player.UpComingMatchesList[0].MatchDate}`, true);
					player_embed.setThumbnail("https://www.fifa.com/assets/img/tournaments/common/player-placeholder--sqr.jpg");
					message.channel.send(player_embed);
				}
			});
		}
	});
}

client.on('ready', () => {
	console.log(`${client.user.tag} running.`);
});

client.on('message', (message) => {
	if (message.content.startsWith('>>wc')){
		target = message.content.replace('>>wc ', '');
		search_player(target.toUpperCase(), message);
	}
});


client.login(process.env.BOT_TOKEN);
