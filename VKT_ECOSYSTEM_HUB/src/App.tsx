import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Home } from './pages/Home';

// Tải chậm Component Admin để tối ưu hiệu suất trang chủ
const Admin = lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-indigo-500 font-bold">Đang tải tài nguyên...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Suspense>
  );
}

export default App;
