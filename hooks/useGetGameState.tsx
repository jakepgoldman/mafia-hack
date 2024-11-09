import { useQuery } from "react-query";

import { getGameState } from "../server/gamestate";

import { GET_GAME_STATE } from "./queries";

export const useGetGameState = () => {
    const {
        data: gameState,
        isLoading: isLoadingGameState,
        error: gameStateError,
    } = useQuery([GET_GAME_STATE], async () => {
        return getGameState();
    });

    return {
        gameState,
        isLoadingGameState,
        gameStateError
    };
};
