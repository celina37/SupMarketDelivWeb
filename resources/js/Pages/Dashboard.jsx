import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import '~css/app.css';

import Content from '@/Components/Content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inventory from '@/Pages/Inventory';
import Sections from '@/Pages/Sections';
import AddProducts from '@/Pages/AddProducts';
import ManageSalads from '@/Pages/ManageSalads';

export default function Dashboard() {
  return (
    <AuthenticatedLayout>
      <Router>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <div className="content-container">
            <Head title="Dashboard" />
            <div className="content">
              <Routes>
                <Route path="/" element={<Inventory />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/sections" element={<Sections />} />
                <Route path="/add-products" element={<AddProducts />} />
                <Route path="/salads" element={<ManageSalads />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthenticatedLayout>
  );
}
