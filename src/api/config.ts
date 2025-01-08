import { logApiResult } from '@/decorators/methods';
import { handleResult } from '@/utils';
import { getLocalStorage, mixMessage } from '@/utils/tools';
import { $get, $post, $put, $delete } from './http';
import { STORAGE_KEY } from '@/config/constants';

class ConfigAPI {
  @logApiResult
  async login(p: { username: string; password: string }) {
    return $post<LoginData>('/login', {
      params: { username: p.username, password: mixMessage(p.password) },
    });
  }

  async loginByToken() {
    const token = getLocalStorage(STORAGE_KEY.TOKEN);
    return $post<{ user: any; token: string }>('/autoLogin', {
      params: {
        token,
      },
    });
  }

  async logout() {
    return $post('/logout');
  }

  async getUserById(id: number) {
    return $get<UserDetail>(`/user/${id}`, undefined);
  }

  @logApiResult
  async getUsers(p?: { rid?: number; id?: number; username?: string; page?: number; size?: number }) {
    return $post<{ rows: UserListItem[]; count: number }>('/users/query', { params: p });
  }

  /**
   * 新建用户账号
   */
  async createUser(p: { username: string; password: string; rid: number }) {
    return $post('/account', { params: p });
  }

  /**
   * 修改用户权限
   */
  @logApiResult
  async updateUserAuth(p: { uid: number; auth: number[] }) {
    return $put('/userAuth', {
      params: p,
    });
  }

  @logApiResult
  async updateUserInfo(p: { username?: string; password?: string; newPassword?: string }) {
    return $put<{ user: any; token: string }>('/account', {
      params: p,
    });
  }

  async getAuths(p?: { id?: number; name?: string }) {
    return $get('/authorities', {
      queries: p,
    });
  }

  async getRoles(p?: { id?: number }) {
    return $get<{ roles: RoleItem[] }>('/roles', {
      queries: p,
      fallbackResponse: { roles: [] },
    });
  }

  /**
   * 仅过去管理员角色
   */
  async getAdminRoles() {
    return $get<{ roles: RoleItem[] }>('/adminRoles');
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
    return $post('/authority', { params: p });
  }

  @logApiResult
  async updateAuthById(p: { id: number; name?: string; description?: string }) {
    return $put('/authority', { params: p });
  }

  async createRole(p: { id: number; name: string; description?: string; auth: number[] }) {
    return $post('/role', { params: p });
  }

  async updateRoleById(p: { id: number; name?: string; description?: string; auth?: number[] }) {
    return $put('/role', { params: p });
  }

  async updateUserRole(p: { id: number; rid: number }) {
    return $put('/user/role', { params: p });
  }

  @logApiResult
  async deleteRoleById(p: { id: number }) {
    return $delete('/role', { params: p });
  }

  @logApiResult
  async deleteAuthById(p: { id: number }) {
    return $delete('/authority', { params: p });
  }

  @logApiResult
  async deleteUserById(p: { id: number }) {
    return $delete('/user', { params: p });
  }
}

export default new ConfigAPI();
