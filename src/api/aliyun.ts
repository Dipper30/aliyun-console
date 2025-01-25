import { aliyunHttp as http } from './http';

class AliyunAPI {
  // async getBuckets() {
  //   return http.$post<{ buckets: OSS.Bucket[] }>('aliyun/cdn/bucket/query', {
  //     fallback: {
  //       buckets: [],
  //     },
  //   });
  // }
}

export default new AliyunAPI();
