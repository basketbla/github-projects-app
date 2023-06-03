import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import SelectProjects from './components/SelectProjects';
import TestSortable from './components/SortableList';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import SlideRoutes from 'react-slide-routes';

function App() {

  const location = useLocation();

  return (
    <div id="app-container">
      {/* <Routes> */}
      <SlideRoutes duration={2000}>
        <Route path='/' element={<Home/>}/>
        <Route path='/select-projects' element={<SelectProjects/>}/>
        <Route path='*' element={<Home/>}/>
      </SlideRoutes>
      {/* </Routes> */}
    </div>
  );
}

export default App;
