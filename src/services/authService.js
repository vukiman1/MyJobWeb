import httpRequest from "../utils/httpRequest";
import { AUTH_CONFIG } from "../configs/constants";

const authService = {
  getToken: (email, password, role_name) => {
    const url = "api/auth/token/";

    const data = {
      grant_type: AUTH_CONFIG.PASSWORD_KEY,
      client_id: "mQ7Lmjc7cPUhl2sOOoi8Ig5Dho7wXR2BS63Lzax3",
      client_secret:
        "PLms4dBIXyT07sTVIvSYwq9apaH0qlEmmFwbUkVhuMRCFgj4Jh4CwDSHUX4vASr5Nje2sGl9nr9akWLD1Hadd1QPvPLJVrYjvE00xXnWLsF4eqRdxwXmSFJKZFJ3cHK7",
      username: email,
      password: password,
      role_name: role_name,
    };

    return httpRequest.post(url, data);
  },
  convertToken: (clientId, clientSecrect, provider, token) => {
    const url = "api/auth/convert-token/";

    const data = {
      grant_type: AUTH_CONFIG.CONVERT_TOKEN_KEY,
      client_id: "mQ7Lmjc7cPUhl2sOOoi8Ig5Dho7wXR2BS63Lzax3",
      client_secret:
        "PLms4dBIXyT07sTVIvSYwq9apaH0qlEmmFwbUkVhuMRCFgj4Jh4CwDSHUX4vASr5Nje2sGl9nr9akWLD1Hadd1QPvPLJVrYjvE00xXnWLsF4eqRdxwXmSFJKZFJ3cHK7",
      backend: provider,
      token: token,
    };

    return httpRequest.post(url, data);
  },
  revokToken: (accessToken, backend) => {
    const url = "api/auth/revoke-token/";

    const data = {
      client_id: "mQ7Lmjc7cPUhl2sOOoi8Ig5Dho7wXR2BS63Lzax3",
      client_secret:
        "PLms4dBIXyT07sTVIvSYwq9apaH0qlEmmFwbUkVhuMRCFgj4Jh4CwDSHUX4vASr5Nje2sGl9nr9akWLD1Hadd1QPvPLJVrYjvE00xXnWLsF4eqRdxwXmSFJKZFJ3cHK7",
      token: accessToken,
      backend: backend,
    };

    return httpRequest.post(url, data);
  },
  checkCreds: (email, roleName) => {
    const url = "api/auth/check-creds/";

    const data = {
      email: email,
      roleName: roleName,
    };

    return httpRequest.post(url, data);
  },
  jobSeekerRegister: (data) => {
    const url = "api/auth/job-seeker/register/";

    return httpRequest.post(url, data);
  },
  employerRegister: (data) => {
    const url = "api/auth/employer/register/";

    return httpRequest.post(url, data);
  },
  getUserInfo: () => {
    const url = "api/auth/user-info/";

    return httpRequest.get(url);
  },
  updateUser: (data) => {
    const url = "api/auth/update-user/";

    return httpRequest.patch(url, data);
  },
  updateAvatar: (data) => {
    const url = "api/auth/avatar/";

    return httpRequest.put(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteAvatar: () => {
    const url = "api/auth/avatar/";

    return httpRequest.delete(url);
  },
  changePassword: (data) => {
    const url = "api/auth/change-password/";

    return httpRequest.put(url, data);
  },
  forgotPassword: (data) => {
    const url = "api/auth/forgot-password/";

    return httpRequest.post(url, data);
  },
  resetPassword: (data) => {
    const url = "api/auth/reset-password/";

    return httpRequest.post(url, data);
  },
  getUserSettings: () => {
    const url = "api/auth/settings/";

    return httpRequest.get(url);
  },
  updateUserSettings: (data) => {
    const url = "api/auth/settings/";

    return httpRequest.put(url, data);
  },
};

export default authService;
