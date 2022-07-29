import Artibot, { Global, Module } from "artibot";
import Localizer from "artibot-localizer";
import { GatewayIntentBits } from "discord.js";

import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

/**
 * Module to give a role to people in a vocal channel
 * @author GoudronViande24
 * @license MIT
 */
export default new Module({
	id: "vcrole",
	name: "VC Role",
	version,
	intents: [
		GatewayIntentBits.GuildVoiceStates
	],
	langs: [
		"fr",
		"en"
	],
	repo: "GoudronViande24/artibot-vc-role",
	packageName: "artibot-vc-role",
	parts: [
		new Global({
			id: "vcrole",
			mainFunction
		})
	]
})

/**
 * Executed when bot is started
 * @param {Artibot} artibot
 */
function mainFunction({ client, log, config }) {
	const localizer = new Localizer({
		lang: config.lang,
		filePath: path.resolve(__dirname, "locales.json")
	});

	// Config verification
	if (!config.vcrole) config.vcrole = {};
	if (!config.vcrole.role) config.vcrole.role = "Vocal";

	log("VC Role", localizer._("Ready."));

	client.on("voiceStateUpdate", (oldState, newState) => {
		const role = newState.guild.roles.cache.find(role => role.name.toLowerCase() == config.vcrole.role.toLowerCase());

		if (!role && config.debug) {
			log("VC Role", localizer.__("Cannot find [[0]] role in server [[1]]", { placeholders: [config.role, newState.guild.name] }), "debug");
		}

		if (!role) return;

		if (newState.channelId) {
			newState.member.roles.add(role);
		} else {
			newState.member.roles.remove(role);
		}
	});
}