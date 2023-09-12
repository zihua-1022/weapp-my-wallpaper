import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import navBarReducer from "./navBar";
import tabBarReducer from "./tabBar";
import profileReducer from "./profile";
import categoryReducer from "./category";

const rootReducer = combineReducers({
  navBar: navBarReducer,
  tabBar: tabBarReducer,
  profile: profileReducer,
  category: categoryReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
