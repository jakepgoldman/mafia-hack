function createMafiaVotePayload(
    player: string,
    playerType: string,
    backstory: string,
    transcript: string,
    targetPlayer: string
) {
    const prompt = `Game Transcript: ${transcript}\nConsider player named ${player}. ` +
        `${player} is a ${playerType} with the following backstory: ${backstory}. ` +
        `Would this player, ${player}, vote to toss ${targetPlayer}? Give a short ` +
        `reason, and then a [[yes]] or [[no]] vote.`;

    const payload = {
        // Be sure to add model to payload before invoking
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
