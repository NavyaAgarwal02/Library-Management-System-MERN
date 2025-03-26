import { Navigate } from "react-router-dom";

interface Props {
    isAuthenticated: boolean;
    component: JSX.Element;
    role: "user" | "librarian";
}

function RedirectIfNotAuthenticated({
    isAuthenticated,
    component,
    role
}: Props) {
    return (
        <>
            {isAuthenticated ? (
                component
            ) : role === "user" ? (
                <Navigate to="/user/login" />
            ) : (
                <Navigate to="/librarian/login" />
            )}
        </>
    );
}

export default RedirectIfNotAuthenticated;
