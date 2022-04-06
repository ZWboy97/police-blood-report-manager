/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useHistory } from 'react-router-dom';
import {
  Button,
  Input,
  Switch,
  message,
  Form,
  notification,
  Descriptions,
} from 'antd';

import './input.css';
import React, { useState } from 'react';

const InputReportPage = () => {
  const initInput = {
    recordId: '',
    drawerId: '',
    boxId: '',
  };
  const history = useHistory();
  const [isAutoSubmit, setIsAutoSubmit] = useState(false);
  const [latestSubmitted, setLatestSubmitted] = useState(initInput);
  const [form] = Form.useForm();

  let submittedInputs = initInput;
  const recordInputRef: React.LegacyRef<Input> = React.createRef();

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      setLatestSubmitted(submittedInputs);
      form.setFieldsValue({ ...submittedInputs, recordId: '' });
    } else {
      message.error(`添加失败，检查是否重复添加或者参数错误。${error.message}`);
      submittedInputs = initInput;
      setLatestSubmitted(submittedInputs);
    }
  };

  const onDeleteLatestSubmited = (e: any, recordId: string) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = window.electron.ipcRenderer.sendMsg(
      'delete_by_record_id',
      recordId
    );
    console.log({ res });
    const { error } = res;
    if (!error) {
      message.success('删除成功');
      submittedInputs = initInput;
      setLatestSubmitted(submittedInputs);
    }
  };

  return (
    <div className="input_page_container">
      <div className="input_page_title">血样入库</div>
      <div className="input_page_inputs_container">
        <Form
          className="input_page_inputs"
          size="large"
          name="basic"
          form={form}
          labelCol={{ span: 4, offset: 2 }}
          wrapperCol={{ span: 14 }}
          onFinish={onSubmitClick}
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
            label="血样编号"
            name="recordId"
            rules={[{ required: true, message: '请输入血样编号!' }]}
          >
            <Input
              className="input"
              size="large"
              ref={recordInputRef}
              placeholder="请输入血样编号"
              onPressEnter={(e) => {
                if (!isAutoSubmit) {
                  e.preventDefault();
                }
              }}
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
                      message.info('自动提交开启');
                      notification.open({
                        message: '自动提交注意事项',
                        description: (
                          <div>
                            <div>
                              1. 注意每次对血样编号的变更都将产生一次新的提交
                            </div>
                            <div>2. 扫码枪输入时候不要人为修改</div>
                            <div>3. 错误输入可通过血样编号查找删除</div>
                          </div>
                        ),
                      });
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
      <div className="last_submited_info">
        <div className="last_submited_title"> 上一次提交</div>
        <Descriptions className="last_submited_desc" size="small">
          <Descriptions.Item label="血样编号">
            <div style={{ color: 'white' }}>{latestSubmitted.recordId}</div>
          </Descriptions.Item>
          <Descriptions.Item label="箱子编号">
            <div style={{ color: 'white' }}>{latestSubmitted.boxId}</div>
          </Descriptions.Item>
          <Descriptions.Item label="抽屉编号">
            <div style={{ color: 'white' }}>{latestSubmitted.drawerId}</div>
          </Descriptions.Item>
          <Descriptions.Item label="操作">
            <a
              href="http://"
              onClick={(e) => {
                onDeleteLatestSubmited(e, latestSubmitted.recordId);
              }}
            >
              删除
            </a>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default InputReportPage;
