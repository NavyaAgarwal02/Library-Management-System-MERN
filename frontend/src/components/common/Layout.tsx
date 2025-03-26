import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
    to: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

function Layout({ to, setTheme }: Props) {
    return (
        <>
            <header>
                <Header to={to} setTheme={setTheme} />
            </header>
            <div className="mt-24" style={{ minHeight: "60vh" }}>
                <Outlet />
            </div>
            <footer className="mt-14">
                <Footer />
            </footer>
        </>
    );
}

export default Layout;
