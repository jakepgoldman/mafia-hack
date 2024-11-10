export function createPlayerKilledStory(
    nameOfPlayerKilled: string, 
    remainingPlayers: string[],
    transcript: string
) {
    const remainingPlayersStr = remainingPlayers.join(", ");
    const systemMessage =
        `You are the moderator of a mafia game. You speak slowly and powerfully, like Mufasa from Lion King. You present the findings of the game in a humorous way.`;

    const userPrompt =
        // `The game has just returned to day, and the mafia have chosen to kill ${nameOfPlayerKilled}. `
        `Here is the trancript of what has happened so far up to the current moment: ${transcript}` +
        `Come up with a funny death story that relates ${nameOfPlayerKilled} being killed.` +
        `The remaining players are: ${remainingPlayersStr}. Please be concise. 2-3 sentences maximum` +
        `Respond in JSON format as:\n{\n  "narration": ` +
        `"<game narration speech>"}`;

    return {
        systemMessage,
        userPrompt
    };
}

export function createPlayerKilledByNomination(
    nameOfPlayerKilled: string, 
    typeOfPlayerKilled: string,
    remainingPlayers: string[],
    transcript: string
) {
    const remainingPlayersStr = remainingPlayers.join(", ");
    const systemMessage =
        `You are the moderator of a mafia game. You speak slowly and powerfully, like Mufasa from Lion King. You present the findings of the game in a humorous way.`;

    const userPrompt =
        // `The game has just returned to day, and the mafia have chosen to kill ${nameOfPlayerKilled}. `
        `Here is the trancript of what has happened so far up to the current moment: ${transcript}` +
        `Explain that ${nameOfPlayerKilled} was voted killed, and that they are type ${typeOfPlayerKilled}` +
        `The remaining players are: ${remainingPlayersStr}. Please be concise. 2-3 sentences maximum` +
        `Respond in JSON format as:\n{\n  "narration": ` +
        `"<game narration speech>"}`;

    return {
        systemMessage,
        userPrompt
    };
}