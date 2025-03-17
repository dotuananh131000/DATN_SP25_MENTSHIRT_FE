import { configureStore } from "@reduxjs/toolkit";
import productPricesReducer from "../features/ProducSlice";
import authReducer from "../features/AuthSlice";

export default configureStore({
  reducer: {
    productPrices: productPricesReducer,
    auth: authReducer,
  },
});
