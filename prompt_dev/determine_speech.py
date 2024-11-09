# Develop the prompt for the determine_speech prompt.
#
# This prompt is designed to query the LLM to determine what a player would strategically say in a game of Mafia.

from openai import OpenAI
import time
from pathlib import Path
import json

# load the key from openai_key.dat
with open("openai_key.dat", "r") as f:
    api_key = f.readlines()[0].strip()

client = OpenAI(api_key=api_key)


def render_determine_speech_prompt(player, player_type, backstory, transcript):
    """This prompt queries the LLM with the full transcript to see what they would strategically say in this situation.

    First we concatenate a player, player type, and their backstory. then, we include the transcript of the game so far. Finally,
    We query the LLM, asking what such a player would do in this situation.

    What would this player say? Would they accuse someone, defend themselves, make up an innocuous lie, say something insidious, or
    something else?

    Args:
        player: The player who must speak
        backstory: The backstory of the player speaking
        transcript: The transcript of the game
        player_type: The type of player who is speaking
    """
    prompt = (
        f"Game Transcript: {transcript}\n"
        f"Consider player named {player}. {player} is a {player_type} with the following backstory: {backstory}. "
        f"What would this player, {player}, say? Give a short reason, and then end with `[[speak]]` followed by what they would say."
    )
    return prompt


def query_mafia_speech(
    player,
    player_type,
    backstory,
    transcript,
    expected_output=None,
    debug=True,
):
    """This function queries the LLM to determine how a player would vote in a game of Mafia.

    Args:
        player: The player who will speak
        player_type: The type of player who is speaking
        backstory: The backstory of the player speaking
        transcript: The transcript of the game
        debug: Whether to log the query for later inspection

    """
    prompt = render_determine_speech_prompt(player, player_type, backstory, transcript)
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

    # Determine the speech from the completion (anything after the `[[speak]]` token)
    speech = completion.choices[0].message.content.split("[[speak]]")[1].strip()

    result = {
        "prompt": prompt,
        "response": completion.choices[0].message.content,
        "speech": speech,
    }

    if debug:
        # dump a json representation of the prompt, response, and binary evaluation
        timestamp = int(time.time() * 1000)
        log_path = f"logging/determine_speech/{timestamp}.json"
        Path(log_path).parent.mkdir(parents=True, exist_ok=True)

        with open(log_path, "w") as f:
            json.dump(result, f)

    return result
