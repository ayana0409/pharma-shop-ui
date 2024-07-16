import { useState } from "react";

const SelectionList = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleList = () => {
      setIsOpen(!isOpen);
    };
  
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={toggleList}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          {title}
        </button>
  
        {isOpen && (
          <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
            <ul className="py-1">
              {items.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default SelectionList;