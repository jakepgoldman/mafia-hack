# Develop the prompt for nominate_toss
#
# This prompt is designed to query the LLM to determine which player a given player would nominate to be tossed in a game of Mafia.

from openai import OpenAI
import time
from pathlib import Path
import json

# load the key from openai_key.dat
with open("openai_key.dat", "r") as f:
    api_key = f.readlines()[0].strip()

client = OpenAI(api_key=api_key)


def render_determine_nominate_prompt(
    player,
    player_type,
    backstory,
    transcript,
    all_players,
):
    """This prompt queries the LLM with the full transcript to who a player would nominate to be tossed in a game of Mafia.

    First we concatenate a player, player type, and their backstory. then, we include the transcript of the game so far. Finally,
    We query the LLM, asking what such a player would do in this situation.

    Would they nominate anyone to toss?

    Args:
        player: The player considering making a nomination
        player_type: The type of player to be voted on
        backstory: The backstory of the player to be voted on
        transcript: The transcript of the game
        all_players: The names of all players in the game
    """
    all_players_str = ", ".join(all_players)
    prompt = (
        f"Game Transcript: {transcript}\n"
        f"Consider player named {player}. {player} is a {player_type} with the following backstory: {backstory}. "
        f"Which of the following players {all_players_str}, if any, would they nominate? Give a short reason, and then a [[name]] or [[none]]."
    )
    return prompt


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
        player: The player who must decided their nomination
        player_type: The type of player who is nominating
        backstory: The backstory of the player nominating
        transcript: The transcript of the game
        all_players: The names of all players in the game
        debug: Whether to log the query for later inspection

    """
    prompt = render_determine_nominate_prompt(
        player, player_type, backstory, transcript, all_players
    )
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are the dungeon master for a game of Mafia. You are trying to determine how a player would vote "
                    "in a game of Mafia. In this game, the mafia win if most of the townspeople have been voted out, and "
                    "the townspeople win if the mafia have all been voted out."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    )

    # Determine whether an appropriate answer is given:
    for player in all_players:
        if f"[[{player}]]" in completion.choices[0].message.content:
            binary_response = player
            break
        if "[[none]]" in completion.choices[0].message.content:
            binary_response = "none"

    result = {
        "prompt": prompt,
        "response": completion.choices[0].message.content,
        "expected_output": expected_output,
        "binary_response": binary_response,
    }

    if debug:
        # dump a json representation of the prompt, response, and binary evaluation

        timestamp = int(time.time() * 1000)
        log_path = f"logging/nominate_toss/{timestamp}.json"
        Path(log_path).parent.mkdir(parents=True, exist_ok=True)

        with open(log_path, "w") as f:
            json.dump(result, f)

    return result
