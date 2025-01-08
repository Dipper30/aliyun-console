import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user';
import commonReducer from './reducers/common';

const store = configureStore({
  reducer: {
    user: userReducer,
    common: commonReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
