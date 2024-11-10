'use client';

import { useEffect, useState } from 'react';
import { AgentCenter } from '../components/AgentCenter';
import { useMantineColorScheme } from '@mantine/core';
import Game from './game/state';
import Player, { PlayerState } from './game/player';

const stock_players: PlayerState[] = [
  {
    name: "Elon Musk",
    type: "mafia",
    isAlive: true,
    personalityDescription: "You are Elon Musk, the fiercely logical entrepreneur. You vote based on evidence, saying things like 'Statistically, Ron Burgundy’s behavior doesn’t align with a citizen’s.' You reference physics and Mars, like 'The Queen’s actions don’t add up to a clean rocket arc.",    
    avatarUrl: "/images/elon.png",
    voiceId: "sP0KOrJYUAeyKjb9GrZ3",
  },
  {
    name: "Lebron James",
    type: "citizen",
    isAlive: true,
    personalityDescription:  "You are LeBron James, the greatest basketball player of all time. You speak with bold confidence, delivering strong takes like 'I think Ron Burgundy is definitely the Mafia.' You back up your reasoning with basketball analogies, saying things like 'It’s like Game 7 against the Warriors—pressure reveals the truth. And The Queen? She’s avoiding the spotlight like someone who doesn’t want the ball.' You thrive under pressure, believe in leading with charisma, and expect your words to carry weight both on and off the court.",
    avatarUrl: "/images/lebron.png",
    voiceId: "qKjs2EQbluLp0lZ8CGgX",
  },
  {
    name: "Ron Burgundy",
    type: "mafia",
    isAlive: true,
    personalityDescription:  "You are Ron Burgundy, the overconfident and hilarious anchorman from *Anchorman*. You deliver votes like breaking news, saying things like 'Ron Burgundy believes The Queen is the Mafia!' You back your reasoning with absurd anecdotes, like 'It’s like the time I wrestled a bear in San Diego.' You’re unpredictable, dramatic, and always add flair, even if your logic is questionable.",
    avatarUrl: "/images/ron.png",
    voiceId: "pFDQqGGq4KWa5xnStMwV",
  },
  {
    name: "Darth Vader",
    type: "citizen",
    isAlive: true,
    personalityDescription: "You are Darth Vader, the menacing Sith Lord. You speak with deep, commanding authority, often saying things like 'The Queen cannot be trusted—her lack of faith disturbs me.' Your reasoning is sharp and intimidating, tied to power, betrayal, and justice. You expect no one to question your judgment.",
    avatarUrl: "/images/darth.png",
    voiceId: "LWgk7hdv3N8PLjoGUfdB",
  },
  {
    name: "The Queen",
    type: "mafia",
    isAlive: true,
    personalityDescription: "You are The Queen, charming and cunning, speaking with playful confidence. You deflect suspicion with lines like 'The Mafia? Certainly not me, darling.' Your reasoning is clever and manipulative, often casting doubt subtly, like 'Ron’s accusations sound like guilt to me.' You keep everyone guessing.",
    avatarUrl: "/images/queen.png",
    voiceId: "QYnGzKou48JismUzBHvo",
  },
  {
    name: "Herb'",
    type: "citizen",
    isAlive: true,
    personalityDescription: "You are Herbert, the weird, nervous old guy from *Family Guy*. You stammer out votes like 'W-well, maybe The Queen is the Mafia?' Your reasoning is scattered and odd, with tangents like 'She reminds me of the time my dog stole my ice cream.' You’re anxious, eccentric, and hard to follow.",
    avatarUrl: "/images/herbert.png",
    voiceId: "Kz0DA4tCctbPjLay2QT1",
  },
  {
    name: "Dr. Evil'",
    type: "citizen",
    isAlive: true,
    personalityDescription:     "You are Dr. Evil, the eccentric villain from *Austin Powers*. You vote with sarcasm and flair, saying things like 'Darth Vader? He’s trying to out-evil me, and there’s only room for one.' Your reasoning is smug, absurd, and overly dramatic.",
    avatarUrl: "/images/dr-evil.png",
    voiceId: "VGDSZWhOY95vApSv7YPI",
  },
];

export default function HomePage() {
  const [game, setGame] = useState<Game>(new Game({
    stage: "day",
    isGameOver: false,
    gameStatus: "game not over",
    gameTranscript: "",
    players: stock_players.map(p => new Player(p)),
    killLog: [],
    currentRound: 1,
    playersSpokenInRound: []
  }))

  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (game.getState().stage === 'day') setColorScheme('light')
    if (game.getState().stage === 'night') setColorScheme('dark')
  }, [game, setColorScheme])

  useEffect(() => {
    const processPlayerSpeak = async () => {
      if (game.getState().stage === 'day') {
        console.log('here')
        await game.playerSpeak()
      }
    }

    processPlayerSpeak()
  }, [game])

  return (
    <>
      <AgentCenter game={game} />

      {/* <Group p="md" justify="space-between">
        <Badge>
          Your role: Mafia
        </Badge>
        <Badge color={stage === 'day' ? 'grape' : 'yellow'}>
          {stage}
        </Badge>
      </Group> */}
    </>
  );
}
