export function createSpeechPrompt(
    player: string, 
    playerType: string, 
    backstory: string, 
    transcript: string,
    allPlayers: string[],
): [string, string] {
    const systemMessage = 
        "You are the dungeon master for a game of Mafia. You are trying to " +
        "determine how a player would respond strategically in a game of Mafia. " +
        "Please respond only with JSON.";

    const allPlayersStr = allPlayers.join(", ");
    
    const userPrompt = 
        `Game Transcript: ${transcript}\n` +
        `Consider a player named ${player}, who is a ${playerType} with the ` +
        `following backstory: ${backstory}. The following players are in the game ` +
        `(${allPlayersStr}). Please be concise with your answers. 2-3 sentences max. Describe in JSON format what ` +
        `${player} would say in this situation. Respond only with JSON in the ` +
        `following structure:\n{\n  "reason": "<reason for their choice>",\n  ` +
        `"speech": "<the player's actual speech>"\n}`;

    return [systemMessage, userPrompt];
}