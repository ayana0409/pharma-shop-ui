import { Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import './App.css';

import { Header, Sidebar, AdminHeader} from './components/common';
import { HomePage, LoginPage} from '../src/pages';
import * as Admin from './pages/admin';
import Breadcrumbs from './components/ui/Breadcrumb';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="App">
      <ToastContainer position="bottom-right"/>

      {isAdminRoute ? (        
        <>
          <AdminHeader toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      ) : (
        <>
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </>
      )}
      <Breadcrumbs path={`App ${location.pathname.replace(/\//g, ' > ')}`}>
      <div className = "px-4">
          <Routes>
              <Route path='/' element={<HomePage/>}/>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/admin' element={<Admin.AdminPage/>}/>
              <Route path='/admin/category' element={<Admin.CategoryPage/>}/>
          </Routes>
        </div>
      </Breadcrumbs>
        
    </div>
  );
}

export default App;