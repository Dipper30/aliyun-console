import { cdnHttp as http } from './http';
import OSS from 'ali-oss';

class CdnAPI {
  async getBuckets() {
    return http.$post<{ buckets: OSS.Bucket[] }>('/bucket/query', {
      fallback: {
        buckets: [],
      },
    });
  }

  async getBucketInfo(name: string) {
    return http.$get<BucketDetail>(`/bucket/${name}`);
  }

  async getPresignedUrl(data: {
    fileName: string;
    fileType: string;
    bucketName: string;
    bucketRegion: string;
    method: 'PUT' | 'GET';
  }) {
    return http.$post<string>('/presignedUrlForOss', {
      params: data,
    });
  }

  // async getFiles(params: {
  //   prefix?: string;
  //   continuationToken?: string;
  //   delimiter?: string;
  //   maxKeys?: string;
  //   bucketName: string;
  //   bucketRegion: string;
  // }) {
  //   return http.$post<{
  //     files: BucketFile[];
  //     nextMarker?: string;
  //     count: number;
  //   }>('/file/query', {
  //     params,
  //     fallback: {
  //       files: [],
  //       count: 0,
  //     },
  //   });
  // }

  async createDirectory(params: {
    name: string;
    bucketRegion: string;
    bucketName: string;
    parentDirId: string | null;
    description?: string;
  }) {
    return http.$post('/directory', {
      params,
    });
  }

  async getFilesByDirectory(params: {
    keyword?: string;
    fileType?: string;
    /** 用户 id */
    creator?: number;
    dirId?: string | null;
    bucketName: string;
    bucketRegion: string;
    pagination?: {
      size: number;
      page: number;
    };
  }) {
    return http.$post<{
      directory: {
        parents: ModelType.BucketFileDir[];
        current?: ModelType.BucketFileDir;
        children: ModelType.BucketFileDir[];
      };
      rows: ModelType.BucketFile[];
      count: number;
    }>('/file/query', {
      params,
      fallback: {
        directory: {
          parents: [],
          current: undefined,
          children: [],
        },
        rows: [],
        count: 0,
      },
    });
  }

  async saveFile(params: {
    fileUrl: string;
    fileName: string;
    fileType: string;
    size: number;
    bucketName: string;
    bucketRegion: string;
    dirId?: string | null;
    cacheControl?: number;
    description?: string;
  }) {
    return http.$post('/file', {
      params,
    });
  }

  async deleteFiles(params: { ids: string[] }) {
    return http.$delete<
      {
        fileId: string;
        fullUrl: string;
        bucketUrl: string;
        success: boolean;
        errMsg: string;
      }[]
    >('/files', {
      params,
    });
  }
}

export default new CdnAPI();
