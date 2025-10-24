import { useEffect } from 'react';
import GameContainer from './components/GameContainer';

function App() {
  // Verify API URL is configured
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.warn('VITE_API_URL is not configured. Using default: http://localhost:3000');
    } else {
      console.log('API URL configured:', apiUrl);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameContainer />
    </div>
  );
}

export default App;
