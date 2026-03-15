import { Outlet } from 'react-router-dom';

const AdminThemes = () => {
  return (
    <div className="container mx-auto py-8">
      <Outlet />
    </div>
  );
};

export default AdminThemes;
