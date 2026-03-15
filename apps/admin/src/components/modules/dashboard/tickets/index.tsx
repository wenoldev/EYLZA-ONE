import { Outlet } from 'react-router-dom';

const VendorTickets = () => {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <Outlet />
    </div>
  );
};

export default VendorTickets;
