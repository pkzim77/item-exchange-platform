import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/homePage';
import RegisterScreen from '../pages/registerScreen';
import CreateAdvertisementScreen from '../pages/createAdvertisementScreen'

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
        <Route path="/registerScreen" element={<RegisterScreen />} />
        <Route path="/loginScreen" element={<RegisterScreen />} />
        <Route path="/createAdvertisement" element={<CreateAdvertisementScreen />} />
      </Routes>
    </BrowserRouter>
  );
}