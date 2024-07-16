import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";

import * as request from "../../utils/request";
import { handleLogout as logout } from "../../constants";
import { useStore, actions } from '../../store'
import { getToken } from '../../constants';
import Button from "./Button";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({fullName: "User", point: 0, type: "none"});
  const [state, dispatch] = useStore()
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = getToken();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(actions.setToken(''))
    logout(navigate);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    useLayoutEffect(() => {
        if (state.token !== ''){
            request
                .get("user/getuserinfo")
                .then((response) => {
                    setUser(response)
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            setUser ({fullName: "User", point: 0, type: "none"})
        }
    }, [state.token])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button
        onClick={toggleDropdown}
        primary
        className="inline-flex justify-center rounded-lg"
      >
        <span>{user.fullName}</span>
      </Button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-green-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className={clsx( "py-1", token ? "hidden" : "block" )}>
            <Link to="/login" className="block text-gray-300 hover:bg-green-500 px-4 py-2">
              Login
            </Link>
          </div>
          <div className={clsx( "py-1", token ? "block" : "hidden" )}>
            <span className="block text-gray-300 px-4 py-2">
                Hi {user.fullName}
            </span>
            <span className="block text-gray-300 px-4 py-2">
                Type: {user.type} | Point: {user.point}
            </span>
            <div className="border-b"></div>
            <span className="block text-gray-300 hover:bg-green-500 px-4 py-2" onClick={handleLogout} >
            Logout
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
