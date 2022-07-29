import axios, { AxiosInstance } from 'axios'

const unsplashApiKey = process.env.REACT_APP_UNSPLASH_API_KEY
const baseURL = process.env.REACT_APP_UNSPLASH_BASE_URL

const createAxiosInstance = (baseURL: string) => {
  const instance: AxiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Client-ID ${unsplashApiKey}` },
  })

  return instance
}

const API = createAxiosInstance(baseURL ?? '')

const fetchPhotos = (pageNumber: number) =>
  API.get('/photos/?per_page=30&page=' + pageNumber)

export { fetchPhotos }
