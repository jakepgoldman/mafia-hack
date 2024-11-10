function createSpeechPrompt(
    player: string, 
    playerType: string, 
    backstory: string, 
    transcript: string
): [string, string] {
    const systemMessage = 
        "You are the dungeon master for a game of Mafia. You are trying to " +
        "determine how a player would respond strategically in a game of Mafia. " +
        "Please respond only with JSON.";

    const userPrompt = 
        `Game Transcript: ${transcript}\n` +
        `Consider a player named ${player}, who is a ${playerType} with the ` +
        `following backstory: ${backstory}. Describe in JSON format what ` +
        `${player} would say in this situation. Respond only with JSON in the ` +
        `following structure:\n{\n  "reason": "<reason for their choice>",\n  ` +
        `"speech": "<the player's actual speech>"\n}`;

    return [systemMessage, userPrompt];
}