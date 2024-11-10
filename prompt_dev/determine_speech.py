# determine_speech.py

from openai import OpenAI
import time
from pathlib import Path
import json

from pydantic import BaseModel

# load the key from openai_key.dat
# with open("openai_key.dat", "r") as f:
#     api_key = f.readlines()[0].strip()

client = OpenAI()


class SpeechResponse(BaseModel):
    reason: str
    speech: str  # The player name or "none" if no one is nominated


def create_speech_prompt(player, player_type, backstory, transcript):
    """This function creates the prompt for querying the LLM to determine a player's speech in a game of Mafia.

    Args:
        player: The player who must speak
        player_type: The type of player who is speaking
        backstory: The backstory of the player speaking
        transcript: The transcript of the game

    Returns:
        A tuple containing the system message and the user prompt
    """
    system_message = (
        "You are the dungeon master for a game of Mafia. You are trying to determine how a player would respond strategically "
        "in a game of Mafia. Please respond only with JSON."
    )
    user_prompt = (
        f"Game Transcript: {transcript}\n"
        f"Consider a player named {player}, who is a {player_type} with the following backstory: {backstory}. "
        f"Describe in JSON format what {player} would say in this situation. "
        f"Respond only with JSON in the following structure:\n"
        f"{{\n"
        f'  "reason": "<reason for their choice>",\n'
        f'  "speech": "<the player\'s actual speech>"\n'
        f"}}"
    )
    return system_message, user_prompt


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
    system_message, user_prompt = create_speech_prompt(
        player, player_type, backstory, transcript
    )
    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt},
        ],
        response_format=SpeechResponse,
    )

    response = completion.choices[0].message.parsed

    result = {
        "prompt": user_prompt,
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
