import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { answerToContactsFunc, changeStatusContactsFunc, deleteContactsFunc, getContactsFunc } from "../../services/contact.service";


export const getContacts = createAsyncThunk(
    'contact/getContacts',
    async (
        { limit, offset, status, answering },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getContactsFunc(limit, offset, status, answering))

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
            window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const answerToContact = createAsyncThunk(
    'contact/answerToContact',
    async (
        { limit, offset, status, answering ,contactId,email,message},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(answerToContactsFunc(limit, offset, status, answering,contactId,email,message))

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
            window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const deleteContact = createAsyncThunk(
    'contact/deleteContact',
    async (
        { limit, offset, status, answering ,contactId},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteContactsFunc(limit, offset, status, answering,contactId))

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
            window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const changeStatusContact = createAsyncThunk(
    'contact/changeStatusContact',
    async (
        { limit , offset , status ,answering ,contactId,newStatus},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(changeStatusContactsFunc(limit, offset, status, answering,contactId,newStatus))

        if (response) {
            return response.data;
        }

        if (error?.response?.status === 401) {
            window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

const setAnsweingAction = (state, action) => {
    state.answering = action.payload;
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}

const setStatusAction = (state, action) => {
    state.status = action.payload;
}


const contactSlice = createSlice({
    name: "contact",
    initialState: {
        contacts: [],
        contactCount: 0,
        limit: 10,
        offset: 0,
        answering: null,
        status: null,
        isLoading: false,

    },
    reducers: {
        setAnswering: setAnsweingAction,
        setOffset: setOffsetAction,
        setStatus: setStatusAction,
    },
    extraReducers: builder => {
        builder
            .addCase(getContacts.pending, state => {
                state.isLoading = true;
            })
            .addCase(getContacts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.contacts = action.payload.data.contacts;
                state.contactCount = action.payload.data.count;
            })
            .addCase(getContacts.rejected, (state) => {
                state.isLoading = false;
            })


        .addCase(answerToContact.pending, state => {
            state.isLoading = true;
        })
        .addCase(answerToContact.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success(action.payload.message)
            state.contacts = action.payload.data.contacts;
            state.contactCount = action.payload.data.count;
        })
        .addCase(answerToContact.rejected, (state) => {
            state.isLoading = false;
        })


        .addCase(deleteContact.pending, state => {
            state.isLoading = true;
        })
        .addCase(deleteContact.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success(action.payload.message)
            state.contacts = action.payload.data.contacts;
            state.contactCount = action.payload.data.count;
        })
        .addCase(deleteContact.rejected, (state, action) => {
            state.isLoading = false;
        })


        .addCase(changeStatusContact.pending, state => {
            state.isLoading = true;
        })
        .addCase(changeStatusContact.fulfilled, (state, action) => {
            state.isLoading = false;
            toast.success(action.payload.message)
            state.contacts = action.payload.data.contacts;
            state.contactCount = action.payload.data.count;
        })
        .addCase(changeStatusContact.rejected, (state, action) => {
            state.isLoading = false;
        })
    },
});

export const { setAnswering, setOffset, setStatus, } = contactSlice.actions;

export default contactSlice.reducer;