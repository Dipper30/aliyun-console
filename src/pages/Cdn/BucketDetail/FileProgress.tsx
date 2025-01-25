import { UploadFile } from 'antd';
import './FileProgress.scss';
import { CloseOutlined } from '@ant-design/icons';
import { FileStatus } from '@/components/bucketFile';

type FileProgressProps = {
  fileList: UploadFile[];
};

const FileProgress: React.FC<FileProgressProps> = props => {
  if (!props.fileList.length) return <></>;
  return (
    <div className='bucket-file-progress-container'>
      <div className='bucket-file-progress-container-header'>
        <div className='bucket-file-progress-container-header-title'>上传列表</div>
        <div>
          <CloseOutlined />
        </div>
      </div>
      {props.fileList.map(f => (
        <div className='file-progress-row flex items-center justify-between' key={f.uid}>
          <div className='text-ellipsis file-name'>{f.name}</div>
          <FileStatus status={f.status} />
        </div>
      ))}
    </div>
  );
};

export default FileProgress;
