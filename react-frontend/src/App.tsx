import React, {
  useState
} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  window.document.addEventListener('myCustomEvent', handleEvent, false)
  function handleEvent(e: any) {
    console.log(e.detail) // outputs: {foo: 'bar'}
  }

  const [hideLogo, setHideLogo] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{display: hideLogo ? 'none' : 'unset'}}/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div onClick={() => setHideLogo(true)}>hi</div>
      </header>
    </div>
  );
}

export default App;
