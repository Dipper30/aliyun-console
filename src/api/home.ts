import { $get } from './http';

class HomeAPI {
  async getCurrentActiveUsers() {
    return $get<{
      total: number
      users: UserListItem[]
    }>('/cau', {
      fallbackResponse: {
        total: 0,
        users: [],
      },
    });
  }

  async getDailyActiveUsers() {
    return $get<{ dau: number[][] }>('/dau', {
      fallbackResponse: {
        dau: [],
      },
    });
  }

  async getMonthlyActiveUsers() {
    return $get<{
      mau: number[][]
    }>('/mau', {
      fallbackResponse: {
        mau: [],
      },
    });
  }
}

export default new HomeAPI();
