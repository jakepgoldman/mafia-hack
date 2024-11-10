function createNominatePrompt(
    player: string, 
    playerType: string, 
    backstory: string, 
    transcript: string, 
    allPlayers: string[]
) {
    const allPlayersStr = allPlayers.join(", ");
    const systemMessage = 
        "You are the dungeon master for a game of Mafia. You are trying to " +
        "determine how a player would nominate another player in the game. " +
        "Respond with structured output.";
    
    const userPrompt = 
        `Game Transcript: ${transcript}\nConsider a player named ${player}, ` +
        `who is a ${playerType} with the following backstory: ${backstory}. ` +
        `Which of the following players (${allPlayersStr}), if any, would they ` +
        `nominate to be tossed? Respond in JSON format as:\n{\n  "reason": ` +
        `"<reason for their choice>",\n  "nomination": "<player name or 'none'>"\n}`;

    return {
        systemMessage,
        userPrompt
    };
}