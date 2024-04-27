import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = (props) => {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Header />
      <main style={{ minHeight: "calc(100vh - 120px)", padding: "20px 0px 60px 0px" }}>
        {props.children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
