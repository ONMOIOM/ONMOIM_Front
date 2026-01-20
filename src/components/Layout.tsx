import { Outlet } from 'react-router-dom';
import NavBar from './common/NavBar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
