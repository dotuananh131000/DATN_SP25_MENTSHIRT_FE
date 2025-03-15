import { configureStore } from "@reduxjs/toolkit";
import { setUser, logOutUser } from "../features/common/UserSlice";
import productPricesReducer from "../features/ProducSlice";
// const ConbinedReducer = {
//   // auth: authReducer,
//   // products: productReducer,
//   setUser: setUser,
//   logOutUser: logOutUser,
// };

export default configureStore({
  reducer: {
    // ConbinedReducer,
    productPrices: productPricesReducer,
  },
});
