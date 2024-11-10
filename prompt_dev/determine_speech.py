# determine_speech.py

from openai import OpenAI
import time
from pathlib import Path
import json

from pydantic import BaseModel

# load the key from openai_key.dat
with open("openai_key.dat", "r") as f:
    api_key = f.readlines()[0].strip()

client = OpenAI(api_key=api_key)


class SpeechResponse(BaseModel):
    reason: str
    speech: str  # The player name or "none" if no one is nominated


def render_determine_speech_prompt(player, player_type, backstory, transcript):
    """This prompt queries the LLM with the full transcript to see what they would strategically say in this situation.

    First we concatenate a player, player type, and their backstory. Then, we include the transcript of the game so far. Finally,
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
        f"Consider a player named {player}, who is a {player_type} with the following backstory: {backstory}. "
        f"Describe in JSON format what {player} would say in this situation. "
        f"Respond only with JSON in the following structure:\n"
        f"{{\n"
        f'  "reason": "<reason for their choice>",\n'
        f'  "speech": "<the player\'s actual speech>"\n'
        f"}}"
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
    """This function queries the LLM to determine how a player would speak in a game of Mafia.

    Args:
        player: The player who will speak
        player_type: The type of player who is speaking
        backstory: The backstory of the player speaking
        transcript: The transcript of the game
        debug: Whether to log the query for later inspection

    """
    prompt = render_determine_speech_prompt(player, player_type, backstory, transcript)
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are the dungeon master for a game of Mafia. You are trying to determine how a player would respond strategically "
                    "in a game of Mafia. Please respond only with JSON."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        response_format=SpeechResponse,
    )

    response = completion.choices[0].message.parsed

    result = {
        "prompt": prompt,
        "response": completion.choices[0].message.content,
        "reason": response.reason,
        "speech": response.speech,
    }

    if debug:
        # dump a json representation of the prompt, response, and binary evaluation
        timestamp = int(time.time() * 1000)
        log_path = f"logging/determine_speech/{timestamp}.json"
        Path(log_path).parent.mkdir(parents=True, exist_ok=True)

        with open(log_path, "w") as f:
            json.dump(result, f)

    return result
