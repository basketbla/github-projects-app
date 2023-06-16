import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SelectProjects from './components/SelectProjects';
// import TestSortable from './components/SortableList';
// import { TransitionGroup, CSSTransition } from 'react-transition-group'
// import SlideRoutes from 'react-slide-routes';
import Preview from './components/Preview';
import TestingFirebase from './components/TestingFirebase';

function App() {

  // const location = useLocation();

  return (
    <div id="app-container">
      {/* <SlideRoutes duration={2000}>
        <Route path='/' element={<Home/>}/>
        <Route path='/select-projects' element={<SelectProjects/>}/>
        <Route path='*' element={<Home/>}/>
      </SlideRoutes> */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/select-projects' element={<SelectProjects/>}/>
        <Route path='/:username' element={<Preview/>}/>
        <Route path='/testing-firebase' element={<TestingFirebase/>}/>
        <Route path='*' element={<Home/>}/>
      </Routes>
    </div>
  );
}

// Make slideroutes their own component and put in a route will that work?

export default App;
