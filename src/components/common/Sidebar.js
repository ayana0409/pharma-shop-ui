import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { getToken } from '../../constants';
import {handleLogout as logout} from '../../constants'; 

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const token = getToken();
  const navigate = useNavigate()

  const handleLogout = () => {
    toggleSidebar();
    logout(navigate);
  }

  return (
    <>
    <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      ></div>
    <div
      className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-green-800 w-64 p-4 z-50`}
    >
      <div>
      <div>
        <span className="text-white text-lg font-semibold ml-2">
          Pharma Shop
        </span>  
      </div>
      </div>
      <ul>
        <li><Link className="block text-gray-300 hover:text-white py-2" to="/" onClick={toggleSidebar}>Home</Link></li>
        <li><Link className={clsx("block text-gray-300 hover:text-white py-2", token ? "hidden" : "")} to="/login" onClick={toggleSidebar}>Login</Link></li>
        <li><span className={clsx("block text-gray-300 hover:text-white py-2", token ? "" : "hidden")} onClick={handleLogout}>Logout</span></li>
      </ul>
    </div>
    </>
  );
};

export default Sidebar;
