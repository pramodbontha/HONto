import { Outlet } from "react-router-dom";
import Header from "./Header";

import SearchBar from "./SearchBar";

const Layout = () => {
  return (
    <div className="h-screen bg-gray-200">
      <Header />
      <div className="mt-8 ml-20 mr-20">
        <SearchBar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
