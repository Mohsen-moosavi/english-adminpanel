import { appJsonPostApi } from "../configs/axios";
import apiPrivate from "./apiPrivate";

const createSaleByAdminFunc = (courseId,userId,price) => {
    return (
        async () => {
            try {
                const response = await apiPrivate(appJsonPostApi).post(`/sale`,{courseId,userId,price});
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const getSalesFunc = (limit,offset,search='',status,saleStatus,priceStatus,userId,startDate,endDate) => {
    return (
        async ()=>{
            try {
                let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
                status && (queryString += `&status=${status}`)
                saleStatus && (queryString += `&saleStatus=${saleStatus}`)
                priceStatus && (queryString += `&priceStatus=${priceStatus}`)
                userId && (queryString += `&userId=${userId}`)

                const body = {}
                startDate && (body.startDate = startDate);
                endDate && (body.endDate = endDate);
        
                const response = await apiPrivate(appJsonPostApi).post(`/sale/get-all/${queryString}`,body);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

const deleteSaleFunc = (id,limit,offset,search='',status,saleStatus,priceStatus,userId,startDate,endDate) => {
    return (
        async ()=>{
            try {
                let queryString = `?limit=${limit}&offset=${offset}&search=${search}`
                status && (queryString += `&status=${status}`)
                saleStatus && (queryString += `&saleStatus=${saleStatus}`)
                priceStatus && (queryString += `&priceStatus=${priceStatus}`)
                userId && (queryString += `&userId=${userId}`)

                const body = {}
                startDate && (body.startDate = startDate);
                endDate && (body.endDate = endDate);
        
                const response = await apiPrivate(appJsonPostApi).post(`/sale/delete/${id}${queryString}`,body);
                return { response };
            } catch (error) {
                return { error };
            }
        }
    )
}

export {
    createSaleByAdminFunc,
    getSalesFunc,
    deleteSaleFunc
}