// frontend\src\App.tsx

import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Debug from './components/Debug';


const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <div className='mx-auto px-4'>
        <Outlet />
      </div>
      <Debug />
    </>
  );
};

export default App;
