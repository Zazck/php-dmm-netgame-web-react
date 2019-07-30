import { IGameInfo } from '../types/dmm';

export const UPDATE_GENERAL_GAME_LIST = 'UPDATE_GENERAL_GAME_LIST';
export const UPDATE_ADULT_GAME_LIST = 'UPDATE_ADULT_GAME_LIST';

interface UpdateGeneralGameListAction {
  type: typeof UPDATE_GENERAL_GAME_LIST;
  list: IGameInfo[];
}

interface UpdateAdultGameListAction {
  type: typeof UPDATE_ADULT_GAME_LIST;
  list: IGameInfo[];
}

export function updateGeneralGameList(list: IGameInfo[]): UpdateGeneralGameListAction {
  return {
    list,
    type: UPDATE_GENERAL_GAME_LIST,
  };
}

export function updateAdultGameList(list: IGameInfo[]): UpdateAdultGameListAction {
  return {
    list,
    type: UPDATE_ADULT_GAME_LIST,
  };
}

export interface GameListState {
  general: IGameInfo[];
  adult: IGameInfo[];
}

const initialState: GameListState = {
  general: [],
  adult: [],
};

export function gameListReducer(
  state = initialState,
  action: UpdateGeneralGameListAction & UpdateAdultGameListAction,
): GameListState {
  switch (action.type) {
    case UPDATE_GENERAL_GAME_LIST:
      return {
        ...state,
        general: action.list,
      };
    case UPDATE_ADULT_GAME_LIST:
      return {
        ...state,
        adult: action.list,
      };
    default:
      return state;
  }
}
