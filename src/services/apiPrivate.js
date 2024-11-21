import { useDispatch } from 'react-redux';
import {getCookie} from '../utils/cookie'
import { useEffect } from 'react';
import { appJsonPostApi } from '../configs/axios';

const apiPrivate = (axiosPrivate) => {
    const accessToken = getCookie("accessToken");
    axiosPrivate.interceptors.request.use(
        (config) => {
          if (!config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
          }
          config.withCredentials = true;
          return config;
        },
        (error) => Promise.reject(error)
      );
      return axiosPrivate;
  };

export default apiPrivate;