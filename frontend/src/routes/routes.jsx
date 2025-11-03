import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/homePage';

function App() {
  return (
    <HomePage />
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}