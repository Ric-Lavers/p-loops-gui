import axios, { AxiosResponse, AxiosError } from "axios"

const axiosConfig = {
  baseURL: "http://192.168.1.220:5000",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  data: {},
}

const Axios = (config = {}) => {
  const urlService = axios.create({ ...axiosConfig, ...config })
  urlService.interceptors.response.use(
    (res: AxiosResponse) => res.data,
    // this will returned undefined on network error
    (error: AxiosError) => Promise.reject(error),
  )
  return urlService
}

export default Axios
