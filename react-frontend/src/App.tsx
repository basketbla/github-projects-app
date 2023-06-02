import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SelectProjects from './components/SelectProjects';
import TestSortable from './components/SortableList';

function App() {

  return (
    <div id="app-container">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/select-projects' element={<SelectProjects/>}/>
        <Route path='*' element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
