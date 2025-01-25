import { Button, Modal, Upload, UploadProps, Form, Input, FormProps, InputNumber, Select, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import { ChangeEventHandler, forwardRef, Ref, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { UploadChangeParam } from 'antd/es/upload';
import { getCdnDirName } from '@/utils/tools';
import { useForm } from 'antd/lib/form/Form';
const { Option } = Select;

export type SelectFileModalRef = {
  openModal: () => void;
};

type SelectFileModalProps = {
  dirContext: {
    parents: ModelType.BucketFileDir[];
    current?: ModelType.BucketFileDir;
    children: ModelType.BucketFileDir[];
  };
  addFile: (
    file: UploadFile,
    options: {
      cache?: number;
    },
  ) => void;
};

type FieldType = {
  cacheControl?: string;
  dirName?: string;
};

const SelectFileModal = forwardRef<SelectFileModalRef, SelectFileModalProps>((props, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const uploaderRef = useRef<HTMLInputElement>(null);
  const [form] = useForm<FieldType>();

  const currentDirName = useMemo(() => {
    return getCdnDirName(props.dirContext);
  }, [props.dirContext]);

  const openModal = () => {
    setVisible(true);
  };

  useImperativeHandle(ref, () => {
    return {
      openModal,
    };
  }, []);

  const onFileChange = (info: UploadChangeParam<UploadFile>) => {
    let cache = form.getFieldValue('cacheControl');
    if (cache) {
      if (cacheControlUnit === 'm') {
        cache *= 60;
      } else if (cacheControlUnit === 'h') {
        cache *= 3600;
      } else if (cacheControlUnit === 'd') {
        cache *= 3600 * 24;
      }
    }
    props.addFile(info.file, { cache });
    setVisible(false);
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

  const [cacheControlUnit, setCacheControlUnit] = useState('s');
  const cacheControlUnitOptions = [
    {
      value: 's',
      label: '秒',
    },
    {
      value: 'm',
      label: '分',
    },
    {
      value: 'h',
      label: '时',
    },
    {
      value: 'd',
      label: '天',
    },
  ];
  const cacheControlUnitSelector = (
    <Select
      value={cacheControlUnit}
      onChange={value => setCacheControlUnit(value)}
      defaultValue={cacheControlUnitOptions[0].value}
      style={{ width: 60 }}
    >
      {cacheControlUnitOptions.map(o => (
        <Option value={o.value} key={o.value}>
          {o.label}{' '}
        </Option>
      ))}
    </Select>
  );

  return (
    <Modal
      title='上传文件'
      width={1200}
      open={visible}
      onClose={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      closable={true}
      footer={null}
    >
      <Form
        name='upload-file-selector'
        layout='vertical'
        form={form}
        style={{ maxWidth: '1000px', minWidth: '660px' }}
        initialValues={{ cacheControl: 0 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item<FieldType> label='当前文件夹'>
          <Input disabled value={currentDirName}></Input>
        </Form.Item>
        <Form.Item<FieldType> label='自定义缓存头部' name='cacheControl'>
          <InputNumber addonAfter={cacheControlUnitSelector} />
        </Form.Item>
        <Form.Item<FieldType> label='选择文件'>
          <Dragger
            multiple={true}
            name='file'
            beforeUpload={disableDefaultUpload}
            onChange={onFileChange}
            fileList={[]}
          >
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>点击上传或将文件拖拽至此区域</p>
            <p className='ant-upload-hint'>支持图片/视频/PDF/Excel/Text/Json等文件格式 </p>
          </Dragger>
        </Form.Item>
      </Form>
      {/* <input type='file' accept='*' multiple style={{ display: 'none' }} ref={uploaderRef} onChange={handleChange} /> */}
    </Modal>
  );
});

export default SelectFileModal;
