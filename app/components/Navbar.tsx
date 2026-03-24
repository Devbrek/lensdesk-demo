import React from "react";

const Navbar = () => {
  return (
    <div className="flex justify-between py-5 w-screen px-5 absolute z-10">
      <div className="text-white flex items-center gap-3  ">
        <img src="/icons/logo2.png" alt="logo" className="w-30" />{" "}
      </div>
    </div>
  );
};

export default Navbar;
