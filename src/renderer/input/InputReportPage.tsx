import { useHistory } from 'react-router-dom';
import { Button, Input, Switch, message } from 'antd';

import './input.css';

const InputReportPage = () => {
  const history = useHistory();

  const onBackClick = () => {
    history.push('index');
  };
  const onSubmitClick = () => {
    message.success('添加成功');
  };

  return (
    <div className="input_page_container">
      <div className="input_page_title">血样报告入库</div>
      <div className="input_page_inputs">
        <Input className="input" size="large" placeholder="请输入箱子号码" />
        <Input className="input" size="large" placeholder="请输入抽屉号码" />
        <Input className="input" size="large" placeholder="请输入报告编号" />
      </div>
      <div>
        <div className="input_page_check_container">
          扫码枪自动提交：
          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked
          />
        </div>
        <div className="input_page_button_container">
          <Button size="large" onClick={onSubmitClick}>
            ➕添加
          </Button>
          <Button size="large" onClick={onBackClick}>
            ◀返回
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InputReportPage;
