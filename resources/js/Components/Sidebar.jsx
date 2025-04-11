import { NavLink } from 'react-router-dom';
import '~css/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <ul>
          <li>
            <NavLink 
              to="/inventory" 
              className={({ isActive }) => (isActive ? 'selected' : '')}
            >
              Inventory
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sections" 
              className={({ isActive }) => (isActive ? 'selected' : '')}
            >
              Manage Sections
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/add-products" 
              className={({ isActive }) => (isActive ? 'selected' : '')}
            >
              Add Products
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/salads" 
              className={({ isActive }) => (isActive ? 'selected' : '')}
            >
              Manage Salads
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
