import { useHistory } from 'react-router-dom';
import { Button, Input } from 'antd';

const InputReportPage = () => {
  const history = useHistory();

  const onClick = () => {
    history.push('index');
  };

  return (
    <div>
      <Input />
      <Button size="large" onClick={onClick}>
        返回
      </Button>
    </div>
  );
};

export default InputReportPage;
