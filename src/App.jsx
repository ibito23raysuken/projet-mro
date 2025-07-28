// Dans votre fichier de routes principal (ex: App.jsx)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import  Home from './Pages/home';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Ajoutez d'autres routes ici */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}