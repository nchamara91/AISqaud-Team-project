import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Dashboard</h1><p>You are logged in!</p></div>} />
        <Route path="*" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">404</h1><p>Page not found</p></div>} />
      </Routes>
    </div>
  );
}

export default App;
