import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Input } from 'antd';
import './search.css';

const SearchPage = () => {
  const [resultVisible, setResultVisible] = useState(false);
  const [boxNum, setBoxNum] = useState(0);
  const [drawerIndex, setDrawerIndex] = useState(0);
  const [hasResult, setHasResult] = useState(true);

  const history = useHistory();

  const onBackClick = () => {
    history.push('index');
  };

  const onSearchClick = () => {
    setResultVisible(true);
  };

  return (
    <div className="search_page_container">
      <div className="search_page_header">
        <div className="search_page_title">血样报告查询</div>
        <Input size="large" placeholder="输入血样报告编号" />
        <div className="button_container">
          <Button size="large" onClick={onSearchClick}>
            查询
          </Button>
          <Button size="large" onClick={onBackClick}>
            返回
          </Button>
        </div>
      </div>
      <div className="search_result">
        {resultVisible ? (
          <div>
            报告位置在：
            <span className="result_num">{boxNum}</span> 号箱子{' ,'}
            <span className="result_num">{drawerIndex}</span>号抽屉
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
