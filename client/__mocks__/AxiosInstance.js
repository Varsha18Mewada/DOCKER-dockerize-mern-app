// __mocks__/AxiosInstance.js
const axios = jest.requireActual('axios');

const AxiosInstance = axios.create({
  baseURL: process.env.VITE_BASE_URL,
});

export default AxiosInstance;
