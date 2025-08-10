// Dans votre fichier de routes principal (ex: App.jsx)
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './Context/AppContext'
import Layout from './Layout';
import  Home from './Pages/home';
import Login from  './Pages/Auth/Login'; 
import Product from './Pages/Product/Product';
import CreateProduct from './Pages/Product/Create';
export default function App() {
  const { token } = useContext(AppContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={token ? <Product /> : <Home />} />
          <Route path="/login" element={token ? <Product /> : <Login />}/>
          <Route path="/ajout_produits" element={token ? <CreateProduct /> : <Login />}/>
        </Route>

        
      </Routes>
    </BrowserRouter>
  );
}