import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthPages, IUserState } from './types';
import { UsersRoles } from '../API/types/types';
import { IUser } from '../components/Auth/types';

const initialState: IUserState = {
    user: null,
    role: UsersRoles.Guest, // значение по умолчанию
    isAuthUser: false,
    authPage: AuthPages.Auth
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, { payload }: PayloadAction<IUser | null>) {
            state.user = payload;
            if (payload) {
                state.role = payload.role
                state.isAuthUser = true;
            } else {
                state.role = UsersRoles.Guest
                state.isAuthUser = false;
            }
        },
        changeAuthPage(state, { payload }: PayloadAction<AuthPages>) {
            state.authPage = payload;
        },
    },
});

export const { setUser, changeAuthPage } = authSlice.actions;
export const authReducer = authSlice.reducer;
export default authSlice;