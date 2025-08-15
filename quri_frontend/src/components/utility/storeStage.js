import { setUser, addStage } from "../../features/activity/activitySlice";
import { store } from "../../state/index"; // Redux store

export default function storeStage(stage, userId = null, tableId = null, restaurantId = null) {
  const state = store.getState().activity;

  // If any of the IDs are provided and not yet in store, set them
  if (
    (userId && !state.userId) ||
    (tableId && !state.tableId) ||
    (restaurantId && !state.restaurantId)
  ) {
    store.dispatch(setUser({ userId, tableId, restaurantId }));
  }

  // Save stage to Redux + DB
  store.dispatch(addStage(stage));
}
