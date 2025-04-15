
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/b1441a30-c373-4713-9817-e7bb7ebc2478.png" 
        alt="kita.de Logo" 
        className="h-9"
      />
    </Link>
  );
};

export default Logo;
