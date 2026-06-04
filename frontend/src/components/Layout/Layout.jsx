import "../../styles/layout.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
