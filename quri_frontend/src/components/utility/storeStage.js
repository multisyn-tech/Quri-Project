import { setUser, addStage } from "../../features/activity/activitySlice";
import {store} from "../../state/index"; // Redux store


export default function storeStage(stage, userId = null) {
  const state = store.getState().activity;

  // If userId is provided and not yet in store, set it
  if (userId && !state.userId) {
    store.dispatch(setUser(userId));
  }

  // Dispatch async thunk to save stage in Redux + DB
  store.dispatch(addStage(stage));
}
