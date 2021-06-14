const MongoDB = require('mongodb');
const { SnowflakeUtil } = require('discord.js');
const fetch = require('node-fetch');



class Backup {
	constructor(
		option = {
			url: undefined,
			name: undefined,
			collection: undefined ,
		}
	) {
		this.url = option.url;
		this.name = option.name || 'bot';
		this.collection = option.collection || 'backup';
		const DBClient = new MongoDB.MongoClient(this.url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		DBClient.connect().then(async () => {
			this.db = DBClient.db(this.name || 'bot').collection(this.collection || 'backup');
			console.log('[Backup] MongoDB Connected.')
		});
	}
	
	async create(
    guild= Guild,options= {backupID: null,maxMessagesPerChannel: 10,jsonSave: true,jsonBeautify: true,doNotBackup: [],saveImages: ''}) {
		const backupData = {
			 name: guild.name,
			 region: guild.region,
			 verificationLevel: guild.verificationLevel,
			 explicitContentFilter: guild.explicitContentFilter,
			 defaultMessageNotifications: guild.defaultMessageNotifications,
			 afk: guild.afkChannel ? { name: guild.afkChannel.name, timeout: guild.afkTimeout } : null,
			 widget: {
				  enabled: guild.widgetEnabled,
				  channel: guild.widgetChannel ? guild.widgetChannel.name : null
			 },
			 channels: { categories: [], others: [] },
			 roles: [],
			 bans: [],
			 emojis: [],
			 createdTimestamp: Date.now(),
			 guildID: guild.id,
			 id: options.backupID ?? SnowflakeUtil.generate(Date.now())
		};
		
		if (guild.iconURL()) {
			if (options && options.saveImages && options.saveImages === 'base64') {
				  backupData.iconBase64 = (
						await fetch(guild.iconURL({ dynamic: true })).then((res) => res.buffer())
				  ).toString('base64');
			 }
			 backupData.iconURL = guild.iconURL({ dynamic: true });
		}
		if (guild.splashURL()) {
			 if (options && options.saveImages && options.saveImages === 'base64') {
				  backupData.splashBase64 = (await fetch(guild.splashURL()).then((res) => res.buffer())).toString(
						'base64'
				  );
			 }
			 backupData.splashURL = guild.splashURL();
		}
		if (guild.bannerURL()) {
			 if (options && options.saveImages && options.saveImages === 'base64') {
				  backupData.bannerBase64 = (await fetch(guild.bannerURL()).then((res) => res.buffer())).toString(
						'base64'
				  );
			 }
			 backupData.bannerURL = guild.bannerURL();
		}
		if (!options || !(options.doNotBackup || []).includes('bans')) {
			 backupData.bans = await createMaster.getBans(guild);
		}
		if (!options || !(options.doNotBackup || []).includes('roles')) {
			 backupData.roles = await createMaster.getRoles(guild);
		}
		if (!options || !(options.doNotBackup || []).includes('emojis')) {
			 backupData.emojis = await createMaster.getEmojis(guild, options);
		}
		if (!options || !(options.doNotBackup || []).includes('channels')) {
			 backupData.channels = await createMaster.getChannels(guild, options);
		}
		if (!options || options.jsonSave === undefined || options.jsonSave) {
			 // Convert Object to JSON
			 const backupJSON = options.jsonBeautify
				  ? JSON.stringify(backupData, null, 4)
				  : JSON.stringify(backupData);
			 // Save the backup
			 await writeFileAsync(`${backups}${sep}${backupData.id}.json`, backupJSON, 'utf-8');
		}
		console.log(backupData)
	};
	async fetch(backupID) {
		console.log(backupID)
	}
	async remove(backupID) {
		
	}
}

module.exports = Backup