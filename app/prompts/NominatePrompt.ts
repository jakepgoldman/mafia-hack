export function createNominatePrompt(
  player: string,
  playerType: string,
  backstory: string,
  transcript: string,
  allPlayers: string[],
  deadPlayers: string[]
) {
  const allPlayersStr = allPlayers.join(", ");
  const deadPlayersStr = deadPlayers.join(", ");
  console.log(allPlayersStr);
  const systemMessage =
    "You are the dungeon master for a game of Mafia. You are trying to " +
    "determine how a player would nominate another player in the game. " +
    "Respond with structured output.";

  const userPrompt =
    `Game Transcript: ${transcript}\nConsider a player named ${player}, ` +
    `who is a ${playerType} with the following backstory: ${backstory}. ` +
    `Which of the following players (${allPlayersStr}), if any, would they ` +
    `nominate to be tossed? You can only pick from this list.` +
    `You cannot nominate a dead player from this list: (${deadPlayersStr}). ` +
    `Respond in JSON format as:\n{\n  "reason": ` +
    `"<reason for their choice>",\n  "nomination": "<player name>"\n}`;

  return {
    systemMessage,
    userPrompt,
  };
}
