import { Link, useNavigate } from "react-router-dom";
import { Button, Input, UserProfile } from "../../ui";
import { Navbar } from "..";
import { useEffect, useState } from "react";
import * as request from "../../../utils/request";

const Header = ({ toggleSidebar }) => {
  const [navbarItems, setNavbarItems] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [itemsCount, setItemsCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    request
      .get("shop/getnavbar")
      .then((response) => {
        const nav = response.map(category => ({
          ...category,
          items: [
              { label: "All", href: `products/category/${category.id}` },
              ...category.items
          ]
      }));
        setNavbarItems(nav);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    request
      .get("cart/getitemscount")
      .then((response) => {
        setItemsCount(response)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [itemsCount])

  const handleSearch = () => {
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    }
  };

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

          <div className="sm:col-span-2 sm:col-start-2 sm:block col-span-7 col-start-1">
            <div className="sm:px-8 flex">
              <Input
                type="text"
                placeholder="Search..."
                className="rounded-r-none px-1"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
              />
              <Button onClick={handleSearch} className="rounded-l-none">Search</Button>
            </div>
          </div>

          <div className="col-span-1 justify-center m-auto md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
              <Link to="/">Home</Link>
            </Button>
            <Button primary className="rounded-lg mr-2">
              <Link to="/cart">Cart <span>({itemsCount})</span></Link>
            </Button>
            <div className="md:flex hidden items-center">
              <UserProfile />
            </div>
          </div>
        </div>

        <Navbar datas={navbarItems} />
      </header>
    </>
  );
};

export default Header;
