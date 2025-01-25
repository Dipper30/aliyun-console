import { http } from './http';

class HomeAPI {
  async getCurrentActiveUsers() {
    return http.$get<{
      total: number;
      users: UserListItem[];
    }>('/cau', {
      fallback: {
        total: 0,
        users: [],
      },
    });
  }

  async getDailyActiveUsers() {
    return http.$get<{ dau: number[][] }>('/dau', {
      fallback: {
        dau: [],
      },
    });
  }

  async getMonthlyActiveUsers() {
    return http.$get<{
      mau: number[][];
    }>('/mau', {
      fallback: {
        mau: [],
      },
    });
  }
}

export default new HomeAPI();
