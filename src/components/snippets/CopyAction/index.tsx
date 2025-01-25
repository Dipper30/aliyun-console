import { errorMessage, successMessage } from '@/utils';
import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { CopyTwoTone, CheckSquareTwoTone } from '@ant-design/icons';
import { Tooltip } from 'antd';

type CopyActionProps = {
  text: string;
  tooltip?: string;
  okMsg?: string;
  errorMsg?: string;
  render?: () => React.ReactNode;
};

const CopyAction: React.FC<CopyActionProps> = props => {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (copy(props.text)) {
      successMessage(props.okMsg || '复制成功');
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } else {
      errorMessage('复制失败');
    }
  };

  return props.render ? (
    props.render()
  ) : !copied ? (
    props.tooltip ? (
      <Tooltip title={props.tooltip} mouseEnterDelay={0.2}>
        <CopyTwoTone onClick={onCopy} />
      </Tooltip>
    ) : (
      <CopyTwoTone onClick={onCopy} />
    )
  ) : (
    <CheckSquareTwoTone twoToneColor='#76d0a3' />
  );
};

export default CopyAction;
