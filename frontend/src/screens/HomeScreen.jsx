// frontend\src\screens\HomeScreen.jsx

import { useFlashMessageHook } from '../hooks/useFlashMessageHook';
import Hero from '../components/Hero';

const HomeScreen = () => {
  useFlashMessageHook();

  return (
    <>
      <Hero />
    </>
  );
};

export default HomeScreen;