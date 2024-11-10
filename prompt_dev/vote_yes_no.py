# vote_yes_no.py

from openai import OpenAI
import time
from pathlib import Path
import json

from pydantic import BaseModel

# load the key from openai_key.dat
with open("openai_key.dat", "r") as f:
    api_key = f.readlines()[0].strip()

client = OpenAI(api_key=api_key)


class YesNoResponse(BaseModel):
    reason: str
    yesno: bool


def create_vote_prompt(player, player_type, backstory, transcript, target_player):
    """This function creates the prompt for querying the LLM to determine a player's vote in a game of Mafia.

    Args:
        player: The player who must decide their vote
        player_type: The type of player who is voting
        backstory: The backstory of the player voting
        transcript: The transcript of the game
        target_player: The player to be voted on

    Returns:
        A tuple containing the system message and the user prompt
    """
    system_message = (
        "You are the dungeon master for a game of Mafia. You are trying to determine how a player would vote "
        "in a game of Mafia. Please respond only with JSON."
    )
    user_prompt = (
        f"Game Transcript: {transcript}\n"
        f"Consider a player named {player}, who is a {player_type} with the following backstory: {backstory}. "
        f"Would this player, {player}, vote to toss {target_player}? Respond only in JSON format with the following structure:\n"
        f"{{\n"
        f'  "reason": "<reason for their choice>",\n'
        f'  "vote": "<yes or no>"\n'
        f"}}"
    )
    return system_message, user_prompt


def query_mafia_vote(
    player,
    player_type,
    backstory,
    transcript,
    target_player,
    expected_output=None,
    debug=True,
):
    """This function queries the LLM to determine how a player would vote in a game of Mafia.

    Args:
        player: The player who must decide their vote
        player_type: The type of player who is voting
        backstory: The backstory of the player voting
        transcript: The transcript of the game
        target_player: The player to be voted on
        debug: Whether to log the query for later inspection

    """
    system_message, user_prompt = create_vote_prompt(
        player, player_type, backstory, transcript, target_player
    )
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt},
        ],
        response_format=YesNoResponse,
    )
    # Parse JSON response from the LLM output
    response = completion.choices[0].message.parsed

    result = {
        "prompt": user_prompt,
        "response": completion.choices[0].message.parsed.json(),
        "expected_output": expected_output,
        "reason": response.reason,
        "binary_response": response.yesno,
    }

    if debug:
        # dump a json representation of the prompt, response, and binary evaluation

        timestamp = int(time.time() * 1000)
        log_path = f"logging/vote_yes_no/{timestamp}.json"
        Path(log_path).parent.mkdir(parents=True, exist_ok=True)

        with open(log_path, "w") as f:
            json.dump(result, f)

    return result
