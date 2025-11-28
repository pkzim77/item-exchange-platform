import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import RegisterScreen from './pages/registerScreen';
import LoginScreen from './pages/loginScreen';
import CreateAdvertisementScreen from './pages/createAdvertisementScreen';
import AdvertisementDetailsScreen from './pages/advertisementDetailsScreen';
import { UserProvider } from './contexts/UserContext';
import './App.css'
import ReviewScreen from './pages/reviewScreen';

export default function AppRoutes() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/createAdvertisement" element={<CreateAdvertisementScreen />} />
          <Route path="/advertisementDetails/:id" element={<AdvertisementDetailsScreen />} />
          <Route path="/reviewScreen/:id" element={<ReviewScreen />} />
        </Routes>
      </BrowserRouter>
  );
}
