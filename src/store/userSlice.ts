import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    id: number | null;
    username: string | null;
    email: string | null;
    profilePicture: string | null;
    birthday: string | null;
    about: string | null;
    isAuth: boolean;
}

const initialState: UserState = {
    id: null,
    username: null,
    email: null,
    profilePicture: null,
    birthday: null,
    about: null,
    isAuth: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.profilePicture = action.payload.profilePicture;
            state.isAuth = true;
            state.birthday = action.payload.birthday;
            state.about = action.payload.about;
        },

        logout(state) {
            state.username = null;
            state.email = null;
            state.profilePicture = null;
            state.isAuth = false;
            state.birthday = null;
            state.about = null;
        }
    }
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;