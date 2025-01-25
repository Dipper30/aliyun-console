import { Button, Modal, Upload, UploadProps, Form, Input, FormProps, InputNumber, Select, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import { ChangeEventHandler, forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { UploadChangeParam } from 'antd/es/upload';
import useQuery from '@/hooks/useQuery';
import { cdnApi } from '@/api';
import { errorMessage, handleResult } from '@/utils';
import { getCdnDirName } from '@/utils/tools';
const { Option } = Select;

export type CreateDirectoryModalRef = {
  openModal: () => void;
};

type CreateDirectoryModalProps = {
  bucketInfo: BucketDetail;
  dirContext: {
    parents: ModelType.BucketFileDir[];
    current?: ModelType.BucketFileDir;
    children: ModelType.BucketFileDir[];
  };
  refetch?: () => void;
};

type FieldType = {
  name: string;
  description?: string;
};

const CreateDirectoryModal = forwardRef<CreateDirectoryModalRef, CreateDirectoryModalProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const uploaderRef = useRef<HTMLInputElement>(null);
  const [form] = Form.useForm<FieldType>();

  const openModal = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => {
    return {
      openModal,
    };
  }, []);

  const onFileChange = (info: UploadChangeParam<UploadFile>) => {
    console.log('info ', info);
    // setFileList(newFileList);
  };

  const handleSelectFiles = () => {
    uploaderRef.current?.click();
  };

  const disableDefaultUpload = () => {
    return false;
  };

  // 表单

  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    const params = {
      ...form.getFieldsValue(),
      bucketName: props.bucketInfo.name,
      bucketRegion: props.bucketInfo.location,
      parentDirId: props.dirContext.current?.id || null,
    };
    if (isLoading) return;
    try {
      setIsLoading(true);
      const res = await cdnApi.createDirectory(params);
      if (
        handleResult(res, {
          successMessage: '创建成功',
        })
      ) {
        setVisible(false);
        props.refetch?.();
      }
    } catch (error) {
      errorMessage(`服务错误：${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentDirName = useMemo(() => {
    return getCdnDirName(props.dirContext);
  }, [props.dirContext]);

  return (
    <Modal
      title='新建文件夹'
      width={1200}
      open={visible}
      onClose={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      closable={true}
      onOk={handleSubmit}
      forceRender
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <Form
        name='create-directory'
        form={form}
        layout='vertical'
        style={{ maxWidth: '1000px', minWidth: '660px' }}
        initialValues={{ name: '', bucketName: props.bucketInfo.name, bucketRegion: props.bucketInfo.location }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item<FieldType>
          label='文件夹名称'
          name='name'
          rules={[
            { required: true, message: '请输入文件夹名称!' },
            { pattern: new RegExp(/^[a-z0-9A-Z\-]+$/), message: '请输入英文字符或数字或-，eg: file-dir-01' },
          ]}
        >
          <Input prefix={currentDirName} placeholder='输入英文字符或数字或-' maxLength={50} showCount></Input>
        </Form.Item>
        <Form.Item<FieldType> label='文件夹描述' name='description'>
          <Input placeholder='输入描述内容'></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default CreateDirectoryModal;
