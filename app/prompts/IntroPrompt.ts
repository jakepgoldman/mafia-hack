import Player from "../game/player";

export function createIntroPrompt(
    player: string,
    playerType: string,
    backstory: string,
    allPlayers: string[]
) {
    const allPlayersStr = allPlayers.join(", ");
    const systemMessage =
        `You are playing a digital game of mafia. Here's your backstory: ${backstory}` +
        `Respond with structured output.`;

    const userPrompt =
        `Introduce yourself to the user in a few sentences and then mention something about how you're about to play mafia.` +
        `You can reference which of the other characters you might already be suspicious of. Here's the list: ${allPlayersStr}. Please be concise.` +
        `Respond in JSON format as:\n{\n  "intro": ` +
        `"<introduction speech and mafia reference>"}`;

    return {
        systemMessage,
        userPrompt
    };
}