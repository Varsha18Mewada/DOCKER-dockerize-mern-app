import AxiosInstance from './AxiosInstance';

export const request = async ({
  url,
  method = 'get',
  body = {},
  params = null,
  headers = {},
  responseType = 'json',
}) => {
  const queryString = params ? params : '';

  try {
    const response = await AxiosInstance({
      method,
      params: queryString,
      url,
      data: body,
      headers,
      responseType,
    });
    const res = response?.data;
    return res;
  } catch (error) {
    return error?.response?.data;
  }
};
