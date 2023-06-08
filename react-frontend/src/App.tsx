import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import SelectProjects from './components/SelectProjects';
import TestSortable from './components/SortableList';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import SlideRoutes from 'react-slide-routes';
import Preview from './components/Preview';

function App() {

  const location = useLocation();

  return (
    <div id="app-container">
      <SlideRoutes duration={2000}>
        <Route path='/' element={<Home/>}/>
        <Route path='/select-projects' element={<SelectProjects/>}/>
        <Route path='/:username' element={<Preview/>}/>
        <Route path='*' element={<Home/>}/>
      </SlideRoutes>
    </div>
  );
}

// Make slideroutes their own component and put in a route will that work?

export default App;
