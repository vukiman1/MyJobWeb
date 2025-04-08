import httpRequest from '../utils/httpRequest';

const myjobService = {

  async getPopup()  {
    const url = '/api/myjob/web/popup/';
    return httpRequest.get(url);
  },

  createUserBanner(data) {
    const url = '/api/myjob/web/banner/user/';
    return httpRequest.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getFeedbacks: () => {
    const url = '/api/myjob/web/feedbacks/';

    return httpRequest.get(url);
  },
  createFeedback: (data) => {
    const url = '/api/myjob/web/feedbacks/';

    return httpRequest.post(url, data);
  },
  sendSMSDownloadApp: (data) => {
    const url = '/api/myjob/web/sms-download-app/';

    return httpRequest.post(url, data);
  },
  getBanners: (params = {}) => {
    const url = '/api/myjob/web/banner/';

    return httpRequest.get(url, { params: params });
  },
};

export default myjobService;
