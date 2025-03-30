import { configureStore } from "@reduxjs/toolkit";
import productPricesReducer from "../features/ProducSlice";
import authReducer from "../features/AuthSlice";
import clientReducer from "../features/ClientAuthSlice";

export default configureStore({
  reducer: {
    productPrices: productPricesReducer,
    auth: authReducer,
    authClient: clientReducer,
  },
});
