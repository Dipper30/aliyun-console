import { UserAction } from '@/types/store-action';

const initialState: UserDetail | null = null;

const userReducer = (preState: UserDetail | null = initialState, action: any): UserDetail | null => {
  const { type, data } = action;
  switch (type) {
    case UserAction.SET_USER:
      return { ...data };
    case UserAction.SET_AVATAR:
      return preState;
    default:
      return preState;
  }
};

export default userReducer;
