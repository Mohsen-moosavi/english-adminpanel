import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import { changeStatusOfTicketFunc, deleteTicketFunc, deleteTicketMessageFunc, getTicketDetailsFunc, getTicketsFunc, sendAnswerToTicketFunc } from "../../services/ticket.services";


export const getTickets = createAsyncThunk(
    'ticket/getTicketS',
    async (
        { offset, limit, status, subject, userId },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getTicketsFunc(offset, limit, status, subject, userId))

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

export const deleteTicket = createAsyncThunk(
    'ticket/deleteTicket',
    async (
        { id, offset, limit, status, subject, userId},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteTicketFunc(id,offset, limit ,status, subject, userId));

        if (response) {
            toast.success(response?.data?.message);
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

export const getTicketDetails = createAsyncThunk(
    'ticket/getTicketDetails',
    async (
        { id, setTicketDetails , navigate },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getTicketDetailsFunc(id))

        if (response) {
            setTicketDetails(response.data?.data?.ticket)
            return response.data;
        }
        if (error?.response?.status === 401) {
                        window.location.assign('/login');
        } else {
            toast.error(error?.response?.data?.message);
            navigate("/tickets")
        }
        return rejectWithValue(error);
    }
);

export const sendAnswerToTicket = createAsyncThunk(
    'ticket/sendAnswer',
    async (
        { id, message , setTicketDetails ,setTextBoxReseter },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(sendAnswerToTicketFunc(id,message))

        if (response) {
            setTicketDetails(response.data?.data?.ticket)
            toast.success(response.data?.message)
            setTextBoxReseter(prev=>!prev)
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

export const deleteTicketMessage = createAsyncThunk(
    'ticket/deleteMessage',
    async (
        { ticketId, messageId , setTicketDetails , navigate },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteTicketMessageFunc(ticketId,messageId))

        if (response) {
            toast.success(response.data?.message)
            if(response.data?.data?.isTicketDeleted){
                navigate("/tickets")
            }
            setTicketDetails(response.data?.data?.ticket)
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

export const changeStatus = createAsyncThunk(
    'ticket/changeStatus',
    async (
        { id, setTicketDetails },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(changeStatusOfTicketFunc(id));

        if (response) {
            setTicketDetails(response.data?.data?.ticket)
            toast.success(response?.data?.message);
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

const setStatusAction = (state, action) => {
    state.status = action.payload;
}

const setSubjecthAction = (state, action) => {
    state.subject = action.payload;
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}

const ticketSlice = createSlice({
    name: "ticket",
    initialState: {
        tickets: [],
        ticketsCount: 0,
        status: "",
        subject: "",
        offset: 0,
        limit: 10,
        isLoading: false,
    },
    reducers: {
        setStatus: setStatusAction,
        setOffset: setOffsetAction,
        setSubjecth: setSubjecthAction,
    },
    extraReducers: builder => {
        builder
            .addCase(getTickets.pending, state => {
                state.isLoading = true;
            })
            .addCase(getTickets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = action.payload?.data?.tickets;
                state.ticketsCount = action.payload?.data?.count;
            })
            .addCase(getTickets.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteTicket.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tickets = action.payload?.data?.tickets;
                state.ticketsCount = action.payload?.data?.count;
            })
            .addCase(deleteTicket.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(getTicketDetails.pending, state => {
                state.isLoading = true;
            })
            .addCase(getTicketDetails.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(getTicketDetails.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(changeStatus.pending, state => {
                state.isLoading = true;
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(changeStatus.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(sendAnswerToTicket.pending, state => {
                state.isLoading = true;
            })
            .addCase(sendAnswerToTicket.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(sendAnswerToTicket.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteTicketMessage.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteTicketMessage.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(deleteTicketMessage.rejected, (state, action) => {
                state.isLoading = false;
            })
    },
});

export const { setStatus, setOffset, setSubjecth } = ticketSlice.actions;

export default ticketSlice.reducer;