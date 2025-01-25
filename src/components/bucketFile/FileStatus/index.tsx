import { Tag, UploadFile } from 'antd';
import { useMemo } from 'react';

type FileStatusProps = {
  status: UploadFile['status'];
};

const FileStatus: React.FC<FileStatusProps> = props => {
  const statusText = useMemo(() => {
    switch (props.status) {
      case 'done':
        return '已完成';
      case 'error':
        return '失败';
      case 'removed':
        return '已删除';
      case 'uploading':
        return '上传中';
      default:
        return '等待中';
    }
  }, [props.status]);

  const statusColor = useMemo(() => {
    switch (props.status) {
      case 'done':
        return 'success';
      case 'error':
        return 'error';
      case 'removed':
        return '#d9d9d9';
      case 'uploading':
        return 'waiting';
      default:
        return '#d9d9d9';
    }
  }, [props.status]);

  return (
    <Tag color={statusColor} bordered={false}>
      {statusText}
    </Tag>
  );
};

export default FileStatus;
