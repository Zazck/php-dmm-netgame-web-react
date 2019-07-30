import { combineReducers, createStore } from 'redux';
import { titleReducer, updateTitle } from './title.store';
import { gameListReducer, updateGeneralGameList, updateAdultGameList } from './game-list.store';

const rootReducer = combineReducers({
  title: titleReducer,
  gameList: gameListReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export const mapStateToProps = (state: AppState) => ({
  titleState: state.title,
  gameListState: state.gameList,
});

export default function configureStore() {
  const store = createStore(
    rootReducer,
  );

  return store;
}

export type AppStore = ReturnType<typeof mapStateToProps> & {
  updateTitle: typeof updateTitle;
  updateGeneralGameList: typeof updateGeneralGameList;
  updateAdultGameList: typeof updateAdultGameList;
};
