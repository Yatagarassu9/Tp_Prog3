import "../../styles/layout.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuth } from "../../context/AuthContext";

function Layout({ children }) {
  const { user } = useAuth();
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-main">{children}</main>
      {user?.role !== "barber" && <Footer />}
    </div>
  );
}

export default Layout;
