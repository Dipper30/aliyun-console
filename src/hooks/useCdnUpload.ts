import { cdnApi } from '@/api';
import { errorMessage, handleResult, successMessage } from '@/utils';
import { UploadFile } from 'antd';

import { UploadFileStatus } from 'antd/lib/upload/interface';
import { useCallback, useEffect, useState } from 'react';

declare module 'antd' {
  interface UploadFile {
    customName?: string;
    cacheControl?: number;
  }
}

/**
  * 指定该Object被下载时网页的缓存行为。取值如下：
    no-cache：不可直接使用缓存，而是先到服务端验证Object是否已更新。如果Object已更新，表明缓存已过期，需从服务端重新下载Object；如果Object未更新，表明缓存未过期，此时将使用本地缓存。
    no-store：所有内容都不会被缓存。
    public：所有内容都将被缓存。
    private：所有内容只在客户端缓存。
    max-age=<seconds>：缓存内容的相对过期时间，单位为秒。此选项仅在HTTP 1.1中可用。
    默认值：无
 */
/**
 * 上传 CDN hook，
 */
const useCdnUpload = (options: { onSuccess?: (file: UploadFile) => void }) => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  // useEffect(() => {
  //   reset();
  // }, [options.bucketName, options.bucketRegion]);

  // const reset = () => {
  //   setFileList([]);
  // };

  const changeStatus = (uid: string, status: UploadFileStatus, msg?: string) => {
    setFileList(prev => [
      ...prev.map(f => {
        if (f.uid === uid) {
          f.status = status;
          if (status === 'done') {
            options?.onSuccess?.(f);
          }
        }
        return f;
      }),
    ]);
    if (status === 'error') {
      errorMessage(`文件上传失败：${msg}`);
    } else if (status === 'done') {
      successMessage('文件上传成功');
    }
  };

  const upload = async (
    file: UploadFile,
    data: {
      dirId?: string | null;
      prefix: string;
      cacheControl?: number;
      bucketName: string;
      bucketRegion: string;
    },
  ) => {
    if (!data.bucketName || !data.bucketRegion) {
      errorMessage('存储空间信息异常');
      return;
    }

    setFileList(prev => {
      file.status = 'uploading';
      const d = [file, ...prev.filter(f => f.uid !== file.uid)];
      return d;
    });
    try {
      const filename = `${data.prefix}${file.name}`.replaceAll('?', '');
      const presignRes = await cdnApi.getPresignedUrl({
        fileType: file.type!,
        fileName: filename,
        bucketName: data.bucketName,
        bucketRegion: data.bucketRegion,
        method: 'PUT',
      });
      if (handleResult(presignRes, { errorMessage: '预签生成失败' }) && presignRes.data) {
        const formData = new FormData();
        formData.append('file', file as any);
        const response = await fetch(presignRes.data, {
          method: 'PUT',
          headers: new Headers({
            'Content-Type': file.type!,
            'Cache-Control': data.cacheControl ? ` max-age=${data.cacheControl}` : 'no-cache',
          }),
          body: file as any,
        });
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        // console.log(`文件已上传: ${response.url}`);
        const res = await cdnApi.saveFile({
          fileName: file.name,
          fileUrl: response.url.split('?OSS')[0],
          fileType: file.type!,
          size: file.size!,
          cacheControl: data.cacheControl,
          dirId: data.dirId,
          bucketName: data.bucketName,
          bucketRegion: data.bucketRegion,
        });
        if (handleResult(res)) {
          return changeStatus(file.uid, 'done');
        } else {
          return changeStatus(file.uid, 'error', res.msg);
        }
      }
    } catch (error: any) {
      console.error('文件上传错误 ', error);
      return changeStatus(file.uid, 'error', error?.message);
    }
  };

  return {
    fileList,
    setFileList,
    upload,
  };
};

export default useCdnUpload;
