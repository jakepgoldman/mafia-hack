# nominate_toss.py

from openai import OpenAI
from pydantic import BaseModel
import time
from pathlib import Path
import json

# load the key from openai_key.dat
with open("openai_key.dat", "r") as f:
    api_key = f.readlines()[0].strip()

client = OpenAI(api_key=api_key)


class NominationResponse(BaseModel):
    reason: str
    nomination: str  # The player name or "none" if no one is nominated


def create_nominate_prompt(player, player_type, backstory, transcript, all_players):
    """This function creates the prompt for querying the LLM to determine a player's nomination in a game of Mafia.

    Args:
        player: The player considering making a nomination
        player_type: The type of player to be voted on
        backstory: The backstory of the player to be voted on
        transcript: The transcript of the game
        all_players: The names of all players in the game

    Returns:
        A tuple containing the system message and the user prompt
    """
    all_players_str = ", ".join(all_players)
    system_message = (
        "You are the dungeon master for a game of Mafia. You are trying to determine how a player would nominate "
        "another player in the game. Respond with structured output."
    )
    user_prompt = (
        f"Game Transcript: {transcript}\n"
        f"Consider a player named {player}, who is a {player_type} with the following backstory: {backstory}. "
        f"Which of the following players ({all_players_str}), if any, would they nominate to be tossed? "
        f"Respond in JSON format as:\n"
        f"{{\n"
        f'  "reason": "<reason for their choice>",\n'
        f'  "nomination": "<player name or \'none\'>"\n'
        f"}}"
    )
    return system_message, user_prompt


def query_mafia_nominate(
    player,
    player_type,
    backstory,
    transcript,
    all_players,
    expected_output=None,
    debug=True,
):
    """This function queries the LLM to determine who a player would nominate in a game of Mafia.

    Args:
        player: The player who must decide their nomination
        player_type: The type of player who is nominating
        backstory: The backstory of the player nominating
        transcript: The transcript of the game
        all_players: The names of all players in the game
        debug: Whether to log the query for later inspection
    """
    system_message, user_prompt = create_nominate_prompt(
        player, player_type, backstory, transcript, all_players
    )

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt},
        ],
        response_format=NominationResponse,
    )

    # Access the parsed structured output
    response = completion.choices[0].message.parsed

    result = {
        "prompt": user_prompt,
        "response": completion.choices[0].message.content,
        "expected_output": expected_output,
        "reason": response.reason,
        "nomination": response.nomination,
    }

    if debug:
        # Dump a JSON representation of the prompt, response, and binary evaluation
        timestamp = int(time.time() * 1000)
        log_path = f"logging/nominate_toss/{timestamp}.json"
        Path(log_path).parent.mkdir(parents=True, exist_ok=True)

        with open(log_path, "w") as f:
            json.dump(result, f)

    return result
