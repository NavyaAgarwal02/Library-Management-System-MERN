import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import BrowserRouterProvider from "./BrowserRouterProvider";

function App() {
    localStorage.setItem("theme", localStorage.getItem("theme") || "light");
    const [theme, setTheme] = useState<string>(
        localStorage.getItem("theme") || "light"
    );
    const [currentToastId, setCurrentToastId] = useState<
        string | number | null
    >(null);

    const [toastStyle, setToastStyle] = useState<{
        backgroundColor: string;
        color: string;
    }>(
        theme === "dark"
            ? { backgroundColor: "#1d232a", color: "#a6adbb" }
            : { backgroundColor: "#ffffff", color: "#1f2937" }
    );

    useEffect(() => {
        const newTheme = localStorage.getItem("theme");
        if (newTheme !== theme) {
            setTheme(newTheme || "light");
        }
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            setToastStyle({ backgroundColor: "#1d232a", color: "#a6adbb" });
        } else {
            setToastStyle({ backgroundColor: "#ffffff", color: "#1f2937" });
        }

        if (currentToastId !== null) {
            toast.dismiss(currentToastId);
            const newToastId = toast("This is a toast message!", {
                style: toastStyle
            });
            setCurrentToastId(newToastId);
        }
    }, [theme]);

    return (
        <>
            <div data-theme={theme}>
                <ToastContainer toastStyle={toastStyle} position="top-center" />
                <BrowserRouterProvider setTheme={setTheme} />
            </div>
        </>
    );
}

export default App;
