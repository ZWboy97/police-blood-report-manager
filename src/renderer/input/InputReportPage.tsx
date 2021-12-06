/* eslint-disable no-console */
import { useHistory } from 'react-router-dom';
import { Button, Input, Switch, message, Form } from 'antd';

import './input.css';
import { useState } from 'react';

const InputReportPage = () => {
  const history = useHistory();
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  let submittedInputs = { recordId: '' };

  const onBackClick = () => {
    history.push('index');
  };

  const onSubmitClick = (values: any) => {
    console.log({ values });
    const { recordId, drawerId, boxId } = values;
    console.log({ recordId }, { drawerId }, { boxId });
    if (recordId === '' || drawerId === '' || boxId === '') {
      message.error('输入存在空值，请检查');
      return;
    }
    const res = window.electron.ipcRenderer.sendMsg('insert_record_info', {
      id: recordId,
      drawer_id: drawerId,
      box_id: boxId,
    });
    const { error } = res;
    console.log({ res });
    if (error == null) {
      message.success('添加成功');
      submittedInputs = values;
    } else {
      message.error(`添加失败，检查是否重复添加或者参数错误。${error.message}`);
    }
  };

  const onAutoSubmitClick = (allValues: any) => {
    if (!isAutoSubmit) {
      return;
    }
    if (allValues.recordId === submittedInputs.recordId) {
      return;
    }
    console.log({ allValues });
    onSubmitClick(allValues);
  };

  return (
    <div className="input_page_container">
      <div className="input_page_title">血样报告入库</div>
      <div className="input_page_inputs_container">
        <Form
          className="input_page_inputs"
          size="large"
          name="basic"
          labelCol={{ span: 4, offset: 2 }}
          wrapperCol={{ span: 14 }}
          onFinish={onSubmitClick}
          onValuesChange={(changedFields, allFields) => {
            console.log({ changedFields }, { allFields });
            const hasRecordIdChanged = Object.prototype.hasOwnProperty.call(
              changedFields,
              'recordId'
            );
            if (hasRecordIdChanged) {
              onAutoSubmitClick(allFields);
            }
          }}
          autoComplete="off"
        >
          <Form.Item
            label="箱子编号"
            name="boxId"
            rules={[{ required: true, message: '请输入箱子编号!' }]}
          >
            <Input
              className="input"
              size="large"
              placeholder="请输入箱子号码"
            />
          </Form.Item>
          <Form.Item
            label="抽屉编号"
            name="drawerId"
            rules={[{ required: true, message: '请输入抽屉编号!' }]}
          >
            <Input
              className="input"
              size="large"
              placeholder="请输入抽屉号码"
            />
          </Form.Item>
          <Form.Item
            label="报告编号"
            name="recordId"
            rules={[{ required: true, message: '请输入报告编号!' }]}
          >
            <Input
              className="input"
              size="large"
              placeholder="请输入报告编号"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <div>
              <div className="input_page_check_container">
                扫码枪自动提交：
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  defaultChecked={isAutoSubmit}
                  onChange={(status) => {
                    if (status) {
                      message.info(
                        '自动提交已打开，当检测到报告编号变更则自动提交'
                      );
                      message.warn(
                        '注意每次对报告编号的变更都将产生一次新的提交'
                      );
                      setIsAutoSubmit(true);
                    } else {
                      setIsAutoSubmit(false);
                    }
                  }}
                />
              </div>
              <div className="input_page_button_container">
                <Button size="large" htmlType="submit">
                  ➕添加
                </Button>
                <Button size="large" onClick={onBackClick}>
                  ◀返回
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default InputReportPage;
