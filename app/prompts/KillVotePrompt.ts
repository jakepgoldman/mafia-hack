function createVotePrompt(
    player: string, 
    playerType: string, 
    backstory: string, 
    transcript: string, 
    targetPlayer: string
) {
    const systemMessage = 
        "You are the dungeon master for a game of Mafia. You are trying to " +
        "determine how a player would vote in a game of Mafia. Please respond " +
        "only with JSON.";

    const userPrompt = 
        `Game Transcript: ${transcript}\nConsider a player named ${player}, ` +
        `who is a ${playerType} with the following backstory: ${backstory}. ` +
        `Would this player, ${player}, vote to toss ${targetPlayer}? Respond ` +
        `only in JSON format with the following structure:\n{\n  "reason": ` +
        `"<reason for their choice>",\n  "vote": "<yes or no>"\n}`;

    return {
        systemMessage,
        userPrompt
    };
}