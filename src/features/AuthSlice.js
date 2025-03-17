import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        loginSuccess:(state, action)=>{
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logOutSuccess:(state)=>{
            state.user = null;
            localStorage.removeItem("user");
        }
    },
});
export const {loginSuccess, logOutSuccess} = authSlice.actions;
export default authSlice.reducer;