import React from 'react';
import {Dropdown} from '../ui';

const Navbar = ({datas}) => {
  return (
    <nav className="hidden sm:flex mt-1">
      {datas.map((data, index) => {
        return (<Dropdown key={index} title={data.title} items={data.items} className="relative mx-1"/>)
      })}
    </nav>
  );
};

export default Navbar;
