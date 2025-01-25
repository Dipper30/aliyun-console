import { logApiResult } from '@/decorators/methods';
import { handleResult } from '@/utils';
import { getLocalStorage, mixMessage } from '@/utils/tools';
import { http } from './http';
import { STORAGE_KEY } from '@/config/constants';

class ConfigAPI {
  @logApiResult
  async login(p: { username: string; password: string }) {
    return http.$post<LoginData>('/login', {
      params: { username: p.username, password: mixMessage(p.password) },
    });
  }

  async loginByToken() {
    const token = getLocalStorage(STORAGE_KEY.TOKEN);
    return http.$post<{ user: any; token: string }>('/autoLogin', {
      params: {
        token,
      },
    });
  }

  async logout() {
    return http.$post('/logout');
  }

  async getUserById(id: number) {
    return http.$get<UserDetail>(`/user/${id}`, undefined);
  }

  @logApiResult
  async getUsers(p?: { rid?: number; id?: number; username?: string; page?: number; size?: number }) {
    return http.$post<{ rows: UserListItem[]; count: number }>('/users/query', {
      params: p,
      fallback: { rows: [], count: 0 },
    });
  }

  /**
   * 新建用户账号
   */
  async createUser(p: { username: string; password: string; rid: number }) {
    return http.$post('/account', { params: p });
  }

  /**
   * 修改用户权限
   */
  @logApiResult
  async updateUserAuth(p: { uid: number; auth: number[] }) {
    return http.$put('/userAuth', {
      params: p,
    });
  }

  @logApiResult
  async updateUserInfo(p: { username?: string; password?: string; newPassword?: string }) {
    return http.$put<{ user: any; token: string }>('/account', {
      params: p,
    });
  }

  async getAuths(p?: { id?: number; name?: string }) {
    return http.$get('/authorities', {
      queries: p,
    });
  }

  async getRoles(p?: { id?: number }) {
    return http.$get<{ roles: RoleItem[] }>('/roles', {
      queries: p,
      fallback: { roles: [] },
    });
  }

  /**
   * 仅过去管理员角色
   */
  async getAdminRoles() {
    return http.$get<{ roles: RoleItem[] }>('/adminRoles');
  }

  async getRoleOptions(fn: (p?: any) => any): Promise<{ label: string; value: any }[]> {
    const res = await fn();
    if (!handleResult(res)) return [];
    const options = res.data.roles.map((v: any) => ({
      label: v.description || v.name,
      value: v.id,
    }));
    return options;
  }

  async createAuth(p: { id: number; name: string; description?: string }) {
    return http.$post('/authority', { params: p });
  }

  @logApiResult
  async updateAuthById(p: { id: number; name?: string; description?: string }) {
    return http.$put('/authority', { params: p });
  }

  async createRole(p: { id: number; name: string; description?: string; auth: number[] }) {
    return http.$post('/role', { params: p });
  }

  async updateRoleById(p: { id: number; name?: string; description?: string; auth?: number[] }) {
    return http.$put('/role', { params: p });
  }

  async updateUserRole(p: { id: number; rid: number }) {
    return http.$put('/user/role', { params: p });
  }

  @logApiResult
  async deleteRoleById(p: { id: number }) {
    return http.$delete('/role', { params: p });
  }

  @logApiResult
  async deleteAuthById(p: { id: number }) {
    return http.$delete('/authority', { params: p });
  }

  @logApiResult
  async deleteUserById(p: { id: number }) {
    return http.$delete('/user', { params: p });
  }
}

export default new ConfigAPI();
