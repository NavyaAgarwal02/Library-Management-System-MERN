import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

const reduxStore = configureStore({
    reducer: {
        user: userReducer
    }
});

export default reduxStore;
