import { Outlet } from "react-router-dom";

import Header from "./Header";


export default function Layout() {

  return (

    <div
      className="
        min-h-screen
        bg-background
        text-theme-text
        transition-colors
        duration-300
      "
    >


      {/* ==================================================
          TOP HEADER
      ================================================== */}

      <Header />


      {/* ==================================================
          PAGE CONTENT
      ================================================== */}

      <main
        className="
          min-h-[calc(100vh-64px)]
          p-4
          sm:p-6
          lg:p-8
        "
      >

        <Outlet />

      </main>


    </div>

  );

}