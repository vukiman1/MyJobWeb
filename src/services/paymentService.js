import httpRequest from '../utils/httpRequest';

const paymentService = {
  generateQrCode: async (method, amount) => {
    try {
      const response = await httpRequest.post('/api/payment/generateQr', {
        method,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Error generating QR code:', error);
      let errorMessage = 'Không thể tạo mã QR';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Vui lòng chọn phương thức và số tiền thanh toán';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi hệ thống khi tạo mã QR. Vui lòng thử lại sau';
      }
      
      throw new Error(errorMessage);
    }
  },

  checkTransaction: async (paymentId, amount, method) => {
    const url = "api/payment/checkTransaction";
    const data = {
      paymentId,
      amount,
      method
    };
    return httpRequest.post(url, data);
  },

  getTransactionHistory: async () => {
    const url = "api/payment/getHistory";

    return httpRequest.get(url);
  },

  getCurrentBalance: async () => {
    const url = "api/payment/getCurrentMoney";

    return httpRequest.get(url);
  }
};

export default paymentService;
