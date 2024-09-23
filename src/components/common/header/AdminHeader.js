import { Link } from "react-router-dom";
import {Button, UserProfile} from '../../ui'
import { Navbar } from '..'

const AdminHeader = ({ toggleSidebar }) => {
  const navbarItem = [ 
    {
      title: "Product",
      items: [
        { label: 'Categorys', href: '/admin/category' },
        { label: 'Products', href: '/admin/product' },
      ]
    },
    {
      title: "Order",
      items: [
        { label: 'Orders', href: '/admin/orders' }
      ]
    },
    {
      title: "Account",
      items: [
        { label: 'Managers', href: '/admin/managers' },
        { label: 'Customers', href: '/admin/customers' },
        { label: 'Types', href: '/admin/types' }
      ]
    },
    {
      title: "Statistic",
      items: [
        { label: 'Product', href: '/admin/statistic/product' },
        { label: 'Customer', href: '/admin/statistic/customer' },
      ]
    },
  ]


  return (
    <>
    <header className="bg-green-700 p-4 sm:pb-1 items-center justify-between w-full">
    <div className="grid grid-cols-8 sm:grid-cols-4">
      <div className="col-span-1 col-start-1 hidden sm:block justify-start">
        {/* <img src="/path/to/your/logo.png" alt="Logo" className="h-8" /> */}
        <span className="text-white text-lg font-semibold ml-2 hidden md:block">
          Pharma Shop
        </span>
      </div>

      <div className="col-span-1 justify-center m-auto md:hidden">
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

      <div className="hidden md:flex col-span-1 col-start-4 items-center justify-end">
        <Button primary className="rounded-lg mr-2">
          <Link to="/admin">Dashboard</Link>
        </Button>
        <div className="md:flex hidden items-center">
          <UserProfile />
        </div>
      </div>
      
    </div>
      
      <Navbar datas = {navbarItem}/>
    </header>
    </>
  );
};

export default AdminHeader;
