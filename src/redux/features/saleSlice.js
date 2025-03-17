import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authRequest } from "../../services/authApi.service";
import toast from "react-hot-toast";
import gregorian from 'react-date-object/calendars/gregorian'
import {createSaleByAdminFunc, deleteSaleFunc, getSalesFunc} from '../../services/sale.Services'


export const getSales = createAsyncThunk(
    'sale/getSales',
    async (
        { limit,offset,search,status,saleStatus,priceStatus,userId,startDate,endDate },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(getSalesFunc(limit,offset,search,status,saleStatus,priceStatus,userId,startDate,endDate)) 
        
        
        if(response){
            return response.data
        }
        
        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

export const createSaleByAdmin = createAsyncThunk(
    'sale/createSaleByAdmin',
    async (
        { courseId , userId , price, navigate },
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(createSaleByAdminFunc(courseId,userId,price))

        if(response){
            navigate(`/users/${userId}`)
            toast.success(response.data.message)
            return response.data
        }

        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }

        return rejectWithValue(error);
    }
);

export const deleteSale = createAsyncThunk(
    'sale/deleteSale',
    async (
        { id,limit,offset,search,status,saleStatus,priceStatus,userId,startDate,endDate},
        { rejectWithValue }
    ) => {
        const { response, error } = await authRequest(deleteSaleFunc(id, limit,offset,search,status,saleStatus,priceStatus,userId,startDate,endDate))

        if(response){
            return response.data
        }
        
        if (error?.response?.status === 401) {
            localStorage.setItem('isLoggin', false);
        } else {
            toast.error(error?.response?.data?.message);
        }
        return rejectWithValue(error);
    }
);

const setSearchWordAction = (state, action) => {
    state.search = action.payload;
}

const setOffsetAction = (state, action) => {
    state.offset = action.payload;
}

const setStatusAction = (state, action) => {
    state.status = action.payload;
}

const setUserIdAction = (state, action) => {
    state.userId = action.payload
}

const setStartDateAction = (state, action) => {
    state.startDate = action.payload
}

const setEndDateAction = (state, action) => {
    state.endDate = action.payload
}

const setPriceStatusAction = (state, action) => {
    state.priceStatus = action.payload
}

const setSaleStatusAction = (state, action) => {
    state.saleStatus = action.payload
}

const saleSlice = createSlice({
    name: "sale",
    initialState: {
        sales: [],
        salesCount: 0,
        totalPrice : 0,
        status: '',
        priceStatus : '',
        saleStatus : '',
        userId : '',
        startDate : '',
        endDate : '',
        search: '',
        offset: 0,
        limit: 10,
        isLoading: false,
    },
    reducers: {
        setSearch: setSearchWordAction,
        setOffset: setOffsetAction,
        setStatus: setStatusAction,
        setUserId: setUserIdAction,
        setStartDate: setStartDateAction,
        setEndDate: setEndDateAction,
        setPriceStatus : setPriceStatusAction,
        setSaleStatus : setSaleStatusAction
        
    },
    extraReducers: builder => {
        builder
            .addCase(getSales.pending, state => {
                state.isLoading = true;
            })
            .addCase(getSales.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sales = action.payload?.data?.sales;
                state.totalPrice = action.payload?.data?.totalPrice;
                state.salesCount = action.payload?.data?.count;
            })
            .addCase(getSales.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(deleteSale.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteSale.fulfilled, (state, action) => {
                state.isLoading = false;
                state.sales = action.payload?.data?.sales;
                state.totalPrice = action.payload?.data?.totalPrice;
                state.salesCount = action.payload?.data?.count;
            })
            .addCase(deleteSale.rejected, (state, action) => {
                state.isLoading = false;
            })


            .addCase(createSaleByAdmin.pending, state => {
                state.isLoading = true;
            })
            .addCase(createSaleByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(createSaleByAdmin.rejected, (state, action) => {
                state.isLoading = false;
            })

    },
});

export const { setSearch, setOffset, setStatus, setUserId, setStartDate, setEndDate, setPriceStatus,setSaleStatus } = saleSlice.actions;

export default saleSlice.reducer;