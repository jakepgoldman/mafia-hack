function createSpeakPrompt(
    player: string, 
    playerType: string, 
    backstory: string, 
    transcript: string
) {
    const prompt = `Game Transcript: ${transcript}\nConsider player named ${player}. ` +
        `${player} is a ${playerType} with the following backstory: ${backstory}. ` +
        `What would this player, ${player}, say? Give a short reason, and then end ` +
        `with [[speak]] followed by what they would say.`;

    const payload = {
        // Add model to payload before invoking
        // model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are the dungeon master for a game of Mafia. You are trying " +
                    "to determine how a player would vote in a game of Mafia. In this " +
                    "game, the mafia win if most of the townspeople have been voted out, " +
                    "and the townspeople win if the mafia have all been voted out."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    };

    return payload;
}
