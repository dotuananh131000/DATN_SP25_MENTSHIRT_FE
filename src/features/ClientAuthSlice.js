import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    client: JSON.parse(localStorage.getItem("client")) || null,
};

const authClient = createSlice({
    name: "authClient",
    initialState,
    reducers:{
        loginClientSuccess:(state, action)=>{
            state.client = action.payload;
            localStorage.setItem("client", JSON.stringify(action.payload));
        },
        logOutClientSuccess:(state)=>{
            state.client = null;
            localStorage.removeItem("client");
        }
    },
});
export const {loginClientSuccess, logOutClientSuccess} = authClient.actions;
export default authClient.reducer;