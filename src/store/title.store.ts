export const MODIFY_TITLE = 'MODIFY_TITLE';

interface ModifyTitleAction {
  type: typeof MODIFY_TITLE;
  title: string;
}

export function updateTitle(title: string): ModifyTitleAction {
  return {
    title,
    type: MODIFY_TITLE,
  };
}

export interface TitleState {
  title: string;
}

const initialState: TitleState = {
  title: '欢迎',
};

export function titleReducer(
  state = initialState,
  action: ModifyTitleAction,
): TitleState {
  switch (action.type) {
    case MODIFY_TITLE:
      return {
        ...state,
        title: action.title,
      };
    default:
      return state;
  }
}
