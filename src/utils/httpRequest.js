import axios from 'axios';
import queryString from 'query-string';
import tokenService from '../services/tokenService';

const notAuthenticationURL = ['api/auth/token/', 'api/auth/convert-token/'];

const httpRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: (params) => {
      return queryString.stringify(params, { arrayFormat: 'bracket' });
    },
  },
});

httpRequest.interceptors.request.use(
  (config) => {
    const accessToken = tokenService.getAccessTokenFromCookie();

    if (accessToken && !notAuthenticationURL.includes(config.url)) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // const originalConfig = error.config;

    // Access Token was expired
    if (error.response.status === 401) {
      tokenService.removeAccessTokenAndRefreshTokenFromCookie();
      // const refreshTokenCookie = tokenService.getRefreshTokenFromCookie();
    }

    return Promise.reject(error);
  }
);

export default httpRequest;
