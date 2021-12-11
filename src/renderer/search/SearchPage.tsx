/* eslint-disable no-console */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input, message, Popconfirm } from 'antd';
import './search.css';

const SearchPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [resultVisible, setResultVisible] = useState(false);
  const [boxNum, setBoxNum] = useState(0);
  const [drawerIndex, setDrawerIndex] = useState(0);
  const [hasResult, setHasResult] = useState(true);

  const history = useHistory();

  const onBackClick = () => {
    history.push('index');
  };

  const onSearchClick = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = window.electron.ipcRenderer.sendMsg(
      'query_by_record_id',
      inputValue
    );
    console.log({ res });
    const { result } = res;
    if (result) {
      message.success('查找成功');
      setBoxNum(result.box_id);
      setDrawerIndex(result.drawer_id);
      setResultVisible(true);
      setHasResult(true);
    } else {
      message.info('未查找到');
      setBoxNum(0);
      setDrawerIndex(0);
      setResultVisible(false);
      setHasResult(false);
    }
  };

  const onDeleteReport = (e: any) => {
    e.preventDefault();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = window.electron.ipcRenderer.sendMsg(
      'delete_by_record_id',
      inputValue
    );
    console.log({ res });
    const { error } = res;
    if (!error) {
      message.success('删除成功');
      setBoxNum(0);
      setDrawerIndex(0);
      setResultVisible(false);
      setHasResult(false);
    }
  };

  return (
    <div className="search_page_container">
      <div className="search_page_header">
        <div className="search_page_title">血样报告查询</div>
        <Input
          onChange={(e) => {
            setInputValue(e.target.value.toString());
          }}
          size="large"
          placeholder="输入血样报告编号"
        />
        <div className="button_container">
          <Button size="large" onClick={onSearchClick}>
            🔍查询
          </Button>
          <Button size="large" onClick={onBackClick}>
            ◀返回
          </Button>
        </div>
      </div>
      <div className="search_result">
        {resultVisible ? (
          <div>
            <div>
              报告位置在：
              <span className="result_num">{boxNum}</span> 号箱子{' ,'}
              <span className="result_num">{drawerIndex}</span>号抽屉
            </div>
            <div>
              对报告操作：
              <Popconfirm
                title="确定取出并删除该报告？"
                onConfirm={(e) => {
                  onDeleteReport(e);
                }}
                okText="确定"
                cancelText="取消"
              >
                <a href="http://">取出删除报告</a>
              </Popconfirm>
            </div>
          </div>
        ) : (
          ''
        )}
        {!hasResult ? <div>未查询到符合的血样报告</div> : ''}
      </div>
    </div>
  );
};

export default SearchPage;
