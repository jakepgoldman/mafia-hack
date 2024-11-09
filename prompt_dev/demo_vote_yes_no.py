# demo_prompts_dev.py
#
# Executes demos of prompts used for the mafia game.

from vote_yes_no import query_mafia_vote
from pathlib import Path
import yaml

# Collect test cases for the vote_yes_no prompt
test_files = Path("prompts/vote_yes_no/").glob("*.yml")

# for each file, load the `setup` and the list of `test_cases
case_count = 0
for test_file in test_files:
    test_file_data = yaml.safe_load(test_file.read_text())
    config = test_file_data["setup"]
    for test_case in test_file_data["test_cases"]:
        case_count += 1
        config.update(test_case)
        expected_result = config.pop("expected_output")

        res = query_mafia_vote(
            **config,
            debug=True,
        )
        actual_result = res["binary_response"]

        consistent = expected_result == actual_result

        # Print the result vs the expected result
        print(
            f"[{case_count}]: Expected {expected_result}, Actual {actual_result} == {'Pass' if consistent else 'Fail'}"
        )