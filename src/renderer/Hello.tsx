import { useHistory, withRouter } from 'react-router-dom';
import { Button } from 'antd';
import icon from '../../assets/icon.svg';
import './App.css';

const Hello = () => {
  const history = useHistory();

  const insertButtonClick = () => {
    history.push('/input/');
  };

  const searchButtonClick = () => {
    history.push('/search/');
  };

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <div className="Hello">血样报告管理</div>
      <div className="Hello Hello-Button">
        <Button size="large" onClick={insertButtonClick}>
          <span role="img" aria-label="books">
            📚
          </span>
          血样入库
        </Button>
        <Button size="large" onClick={searchButtonClick}>
          <span role="img" aria-label="books">
            🔍
          </span>
          血样查询
        </Button>
      </div>
    </div>
  );
};

export default withRouter(Hello);
