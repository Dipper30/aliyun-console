import { ImageType } from '@/config/constants';
// import { handleResult } from '@/utils'
// import ImgSrcCache from '@/utils/cache'
// import { $get} from './http'

export type TReturnImage = {
  id: string;
  size: number;
  type: ImageType;
  data: string;
};

class UserAPI {
  /**
   * 根据id获取用户头像
   */
  // async getAvatarById(id: string): Promise<ImgResponse | null> {
  //   if (!id || id == 'null') return null
  //   const localImg = ImgSrcCache.getImgSrc(id)
  //   if (localImg) return localImg
  //   else {
  //     const res = await $get(`/avatar/${id}`)
  //     if (handleResult(res) && res.data) {
  //       ImgSrcCache.setImgSrc(res.data.id, res.data)
  //       return res.data
  //     } else return null
  //   }
  // }
  // async setAvatar(file: File): APIPromise<string> {
  //   return $upload('/file', [file])
  // }
}

export default new UserAPI();
