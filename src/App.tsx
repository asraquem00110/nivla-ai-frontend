import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const dog = 'test';

  return (
    <>
      <h1 className="text-xl font-normal text-green-400 underline">Hello world! {dog}</h1>
    </>
  );
}

export default App;
