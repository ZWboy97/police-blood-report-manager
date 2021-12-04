import { useHistory } from 'react-router-dom';
import { Button } from 'antd';

const SearchPage = () => {
  const history = useHistory();

  const onClick = () => {
    history.push('index');
  };

  return (
    <div>
      <Button onClick={onClick}>返回</Button>
    </div>
  );
};

export default SearchPage;
