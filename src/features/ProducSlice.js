import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  const savedState = localStorage.getItem("productPrices");
  return savedState ? JSON.parse(savedState) : {};
};
const productPricesSlice = createSlice({
  name: "productPrices",
  initialState: loadFromLocalStorage(),
  reducers: {
    setMultipleProductPrices: (state, action) => {
      action.payload.forEach(({ productId, price }) => {
        if (state[productId - 1]) {
          state[productId - 1].oldPrice = state[productId - 1].price;
        }
        state[productId - 1] = { ...state[productId - 1], price };
      });

      localStorage.setItem("productPrices", JSON.stringify(state));
    },
  },
});

export const { setMultipleProductPrices } = productPricesSlice.actions;
export default productPricesSlice.reducer;
