/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import { Form, Table, Input, Button, Space, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';

import { InboxOutlined, SaveOutlined } from '@ant-design/icons';

import './list.css';

interface Record {
  id: string;
  drawer_id: string;
  box_id: string;
  create_time: string;
}

function AllListPage() {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [allRecordList, setAllRecordList] = useState([]);

  useEffect(() => {
    forceUpdate({});
  }, []);

  const history = useHistory();

  const getDateString = (timestamp: string) => {
    const time: number = parseInt(timestamp, 10);
    const date = new Date(time);
    const year = date.getFullYear(); // 获取完整的年份(4位,1970)
    const month = date.getMonth(); // 获取月份(0-11,0代表1月,用的时候记得加上1)
    const day = date.getDate(); // 获取日(1-31)
    const hour = date.getHours(); // 获取小时数(0-23)
    const minute = date.getMinutes(); // 获取分钟数(0-59)
    const second = date.getSeconds(); // 获取秒数(0-59)
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  const columns: ColumnsType<Record> = [
    {
      title: '血样编号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '抽屉编号',
      dataIndex: 'drawer_id',
      key: 'drawer_id',
      align: 'center',
    },
    {
      title: '箱子编号',
      dataIndex: 'box_id',
      key: 'box_id',
      align: 'center',
    },
    {
      title: '入库时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      render: (text, record, index) => {
        return getDateString(record.create_time);
      },
    },
  ];

  const onFinish = (values: any) => {
    const { boxId, drawerId } = values;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = window.electron.ipcRenderer.sendMsg('query_by_drawer_id', {
      box_id: boxId,
      drawer_id: drawerId,
    });
    const { result, error } = res;
    if (error) {
      message.warn(`查询失败，请检查输入:${error}`);
    } else {
      message.success(`查询成功`);
      setAllRecordList(result);
    }
  };

  return (
    <div className="all_list_container">
      <div className="all_list_title">所有血样报告</div>
      <div className="all_list_query_container">
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item
            name="boxId"
            rules={[{ required: true, message: '请输入血样箱子编号!' }]}
          >
            <Input
              size="large"
              prefix={<InboxOutlined className="site-form-item-icon" />}
              placeholder="血样箱子编号"
            />
          </Form.Item>
          <Form.Item
            name="drawerId"
            rules={[{ required: true, message: '请输入血样抽屉编号!' }]}
          >
            <Input
              size="large"
              prefix={<SaveOutlined className="site-form-item-icon" />}
              placeholder="血样抽屉编号"
            />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => (
              <Space>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !form.isFieldsTouched(true) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                >
                  查询
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    history.push('/');
                  }}
                >
                  返回
                </Button>
              </Space>
            )}
          </Form.Item>
        </Form>
      </div>
      <div className="all_list_result_container">
        <Table
          columns={columns}
          dataSource={allRecordList}
          className="all_list_result_table"
          pagination={{ defaultPageSize: 200 }}
        />
      </div>
    </div>
  );
}

export default AllListPage;
