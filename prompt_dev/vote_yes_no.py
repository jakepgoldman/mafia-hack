# Develop the prompt for the vote_yes_no prompt.
#
# This prompt is designed to query the LLM to determine whether a player would vote to toss another player in a game of Mafia.

from openai import OpenAI
import time
from pathlib import Path
import json

# load the key from openai_key.dat
with open("openai_key.dat", "r") as f:
    api_key = f.readlines()[0].strip()

client = OpenAI(api_key=api_key)


def render_determine_vote_prompt(
    player, player_type, backstory, transcript, target_player
):
    """This prompt queries the LLM with the full transcript to see whether they would vote for a given player to be tossed.

    First we concatenate a player, player type, and their backstory. then, we include the transcript of the game so far. Finally,
    We query the LLM, asking what such a player would do in this situation.

    Would they vote to toss the target player?

    Args:
        player: The player who must decided their vote
        backstory: The backstory of the player voting
        transcript: The transcript of the game
        player_type: The type of player who is voting
    """
    prompt = (
        f"Game Transcript: {transcript}\n"
        f"Consider player named {player}. {player} is a {player_type} with the following backstory: {backstory}. "
        f"Would this player, {player}, vote to toss {target_player}? Give a short reason, and then a [[yes]] or [[no]] vote."
    )
    return prompt


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
        player: The player who must decided their vote
        player_type: The type of player who is voting
        backstory: The backstory of the player voting
        transcript: The transcript of the game
        target_player: The player to be voted on
        debug: Whether to log the query for later inspection

    """
    prompt = render_determine_vote_prompt(
        player, player_type, backstory, transcript, target_player
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

    # Determine whether the answer was yes / no
    if "[[yes]]" in completion.choices[0].message.content:
        binary_response = "yes"
    elif "[[no]]" in completion.choices[0].message.content:
        binary_response = "no"

    result = {
        "prompt": prompt,
        "response": completion.choices[0].message.content,
        "expected_output": expected_output,
        "binary_response": binary_response,
    }

    if debug:
        # dump a json representation of the prompt, response, and binary evaluation

        timestamp = int(time.time() * 1000)
        log_path = f"logging/vote_yes_no/{timestamp}.json"
        Path(log_path).parent.mkdir(parents=True, exist_ok=True)

        with open(log_path, "w") as f:
            json.dump(result, f)

    return result
