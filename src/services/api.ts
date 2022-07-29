import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const unsplashApiKey = process.env.REACT_APP_UNSPLASH_API_KEY
const baseURL = process.env.REACT_APP_UNSPLASH_BASE_URL

const createAxiosInstance = (baseURL: string, time: number) => {
  const instance: AxiosInstance = axios.create({
    baseURL,
  })
  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    config.headers = { Authorization: `Client-ID ${unsplashApiKey}` }
    return config
  })
  return instance
}

const API = createAxiosInstance(baseURL ?? '', 30000)

const fetchPhotos = (pageNumber: number) =>
  API.get('/photos/?per_page=30&page=' + pageNumber)

export { fetchPhotos }
