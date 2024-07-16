import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "./index";

const Dropdown = ({title, items,...props }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div {...props} onMouseLeave={closeDropdown}>
      <Button
        primary
        onClick={toggleDropdown}
        className="py-2 px-4 rounded inline-flex items-center bg-green-700 "
      >
        {title}
        <svg
          className="h-5 w-5 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 12l-8-8 1.5-1.5L10 9.75l6.5-6.25L18 4z"
            clipRule="evenodd"
          />
        </svg>
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 min-w-80 top-8 bg-white rounded-md shadow-lg z-10"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
        {items.map((item, index) => {
          return (<Link key={index} to={item.href}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
            {item.label}
            </Link>)
        })}
          
        </div>
      )}
    </div>
  );
};

export default Dropdown;
