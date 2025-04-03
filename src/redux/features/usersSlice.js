import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import { changeUserRoleFunc, getFinderParamsFunc, getRolesFunc, getUserDetailsFunc, getUsersFunc, removeUserProfileFunc, updateProfileAvatarFunc } from "../../services/user.services";
import toast from "react-hot-toast";

export const getUsers = createAsyncThunk(
    'users/getUsers',
    async (
        { searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority, limit, offset },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getUsersFunc(searchName, searchPhone, roleStatus, purchaseStatus, scoreStatus, levelStatus, deletedUser, scorePriority, limit, offset));

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const getFinders = createAsyncThunk(
    'users/getFinders',
    async (
        { setAllRoles,setAllLevels},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getFinderParamsFunc());

        if (response) {
            setAllRoles(response.data.data.roles)
            setAllLevels(response.data.data.levels)
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const getUserDetails = createAsyncThunk(
    'users/getUserDetails',
    async (
        { id,setUserData},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getUserDetailsFunc(id));

        if (response) {
            setUserData(response.data.data.user)
            console.log('userData====>' , response.data.data.user)
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const getRoles = createAsyncThunk(
    'users/getRoles',
    async (
        { setRoles},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getRolesFunc());

        if (response) {
            setRoles(response.data.data.roles)
            return response.data;
        }

        toast.error(error?.response?.data?.message);
        return rejectWithValue(error);
    }
);

export const changeUserRole = createAsyncThunk(
    'users/changeUserRole',
    async (
        { userId, roleId, setUserData},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(changeUserRoleFunc(userId , roleId));

        if (response) {
            setUserData(response.data?.data?.user)
            toast.success(response.data.message)
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const removeUserProfile = createAsyncThunk(
    'users/removeUserProfile',
    async (
        { userId, setUserData},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(removeUserProfileFunc(userId));

        if (response) {
            setUserData(response.data?.data?.user)
            toast.success(response.data.message)
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const updateUserAvtar = createAsyncThunk(
    'users/updateUserAvatar',
    async (
        { userId, avatar, setUserData , setShowLoader},
        { rejectWithValue }
    ) => {
        setShowLoader(true)
        const { response, error } = await authRequest(updateProfileAvatarFunc(userId,avatar));

        if (response) {
            setUserData(response.data?.data?.user)
            toast.success(response.data.message)
            setShowLoader(false)
            return response.data;
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        setShowLoader(false)
        return rejectWithValue(error);
    }
);

const setSearchNameAction = (state, action) => {
    state.searchName = action.payload;
}

const setSearchPhoneAction = (state, action) => {
    state.searchPhone = action.payload;
}

const setRoleStatusAction = (state, action) => {
    state.roleStatus = action.payload;
}

const setPurchaseStatusAction = (state, action) => {
    state.purchaseStatus = action.payload;
}

const setScoreStatusAction = (state, action) => {
    state.scoreStatus = action.payload;
}

const setLevelStatusAction = (state, action) => {
    state.levelStatus = action.payload;
}

const setDeletedUserAction = (state, action) => {
    state.deletedUser = action.payload;
}

const setScorePriorityAction = (state, action) => {
    state.scorePriority = action.payload;
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}


const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: {},
        usersCount: 0,
        searchName: '',
        searchPhone: '',
        roleStatus: '',
        purchaseStatus: '',
        scoreStatus: '',
        levelStatus: '',
        deletedUser: 0,
        scorePriority: 0,
        offset: 0,
        limit: 10,
        isLoading: false,
    },
    reducers: {
        setSearchName: setSearchNameAction,
        setSearchPhone: setSearchPhoneAction,
        setRoleStatus: setRoleStatusAction,
        setPurchaseStatus: setPurchaseStatusAction,
        setScoreStatus: setScoreStatusAction,
        setLevelStatus: setLevelStatusAction,
        setDeletedUser: setDeletedUserAction,
        setScorePriority: setScorePriorityAction,
        setOffset: setOffsetAction,
    },
    extraReducers: builder => {
        builder
            .addCase(getUsers.pending, state => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload?.data?.users;
                state.usersCount = action.payload?.data?.count;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});


export const { setSearchName, setSearchPhone, setRoleStatus, setPurchaseStatus, setScoreStatus, setLevelStatus, setDeletedUser, setScorePriority, setOffset } = usersSlice.actions;

export default usersSlice.reducer;