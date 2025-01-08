import { configApi } from '@/api';
import { errorMessage, handleResult } from '@/utils';
import { Button, Input, InputNumber, Modal } from 'antd';
import { useEffect, useState } from 'react';

type EditModalProps = {
  visible: boolean;
  authInfo: AuthItem | undefined;
  closeModal: () => void;
  setRefresh?: (refresh: boolean) => void;
};

const EditModal: React.FC<EditModalProps> = props => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (props.authInfo) {
      setName(props.authInfo.name);
      setDescription(props.authInfo.description);
    }
  }, [props.authInfo]);
  const onSubmit = async () => {
    if (!name) {
      errorMessage('请填写name');
      return;
    }
    if (!props.authInfo) return;
    setLoading(true);
    const res = await configApi.updateAuthById({
      id: props.authInfo.id,
      name,
      description,
    });
    setLoading(false);
    if (handleResult(res)) {
      props.closeModal();
      props.setRefresh && props.setRefresh(true);
    }
  };

  return (
    <Modal
      title='编辑权限'
      open={props.visible}
      onCancel={props.closeModal}
      footer={[
        <Button loading={loading} key='submit' type='primary' onClick={onSubmit}>
          确认修改
        </Button>,
      ]}
    >
      <div className='row'>
        <div className='label'> 权限id </div>
        <div className='input'>
          <InputNumber
            disabled={true}
            value={props.authInfo?.id}
            // value={id}
            // min={0}
            // onChange={setID}
          />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 权限名 </div>
        <div className='input'>
          <Input placeholder='auth_name' value={name} onInput={(e: any) => setName(e.target.value)} />
        </div>
      </div>

      <div className='row'>
        <div className='label'> 权限描述 </div>
        <div className='input'>
          <Input placeholder='description' value={description} onInput={(e: any) => setDescription(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
