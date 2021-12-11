import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import Hello from './Hello';
import InputReportPage from './input/InputReportPage';
import SearchPage from './search/SearchPage';
import AllListPage from './list/AllListPage';
import './App.css';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/index/" component={Hello} exact />
        <Route path="/search/" component={SearchPage} exact />
        <Route path="/input/" component={InputReportPage} exact />
        <Route path="/list/" component={AllListPage} exact />
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}
