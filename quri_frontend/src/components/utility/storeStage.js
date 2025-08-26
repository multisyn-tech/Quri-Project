import { setUser, addStage } from "../../features/activity/activitySlice";
import { store } from "../../state/index"; // Redux store

function storeStage(stage, userId = null, tableId = null, restaurantId = null) {
  const state = store.getState().activity;

  if (!userId) userId = localStorage.getItem('user_id');
  if (!tableId) tableId = localStorage.getItem('tableId');
  if (!restaurantId) restaurantId = localStorage.getItem('RestaurantID');

  // console.log("StoreState:", state);
  // console.log("userId :", userId, 'rest id', restaurantId, 'tableid:', tableId);
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


function getOrderStatus() {
  const state = store.getState().activity;

  return {
    userId: state.userId,
    tableId: state.tableId,
    restaurantId: state.restaurantId,
    stages: state.stages,
    loading: state.loading,
    error: state.error
  };
}


export default { storeStage, getOrderStatus };