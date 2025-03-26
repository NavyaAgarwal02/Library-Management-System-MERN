import { NavLink, useLocation } from "react-router-dom";
import libraryLogo from "../../assets/libraryLogo.png";
import libraryLogoDark from "../../assets/libraryLogoDark.png";
import accountImage from "../../assets/defaultProfilePicture.png";
import { useEffect, useState } from "react";

interface Props {
    to: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

function Header({ to, setTheme }: Props) {
    const location = useLocation();
    const [themeLis, setThemeLis] = useState<[string, string]>(["", ""]);

    useEffect(() => {
        if (localStorage.getItem("theme") === "dark") {
            setThemeLis(["swap-on", "swap-off"]);
        } else {
            setThemeLis(["swap-off", "swap-on"]);
        }
    }, []);

    const isActiveChecker = (type: string) => {
        return `/${to + (to ? "/" : "")}${type}s` === location.pathname ||
            (location.pathname.includes(`/${type}/`) &&
                ((type === "section" &&
                    !location.pathname.includes("/book/")) ||
                    type === "book"))
            ? " active"
            : "";
    };

    return (
        <>
            <p>&nbsp;</p>
            <div
                className={
                    "fixed flex items-center top-0 h-20 z-50 w-full " +
                    (localStorage.getItem("theme") &&
                    localStorage.getItem("theme") === "light"
                        ? "bg-base-100"
                        : "bg-base-200")
                }
                style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
            >
                <div className="mx-auto flex justify-between items-center w-11/12">
                    <NavLink to={`/${to + (to ? "/" : "")}sections`} className="ml-5">
                        <img
                            className="h-12 ml-1"
                            src={
                                localStorage.getItem("theme") &&
                                localStorage.getItem("theme") === "light"
                                    ? libraryLogo
                                    : libraryLogoDark
                            }
                            alt="Library Logo"
                        />
                    </NavLink>
                    <div className="w-full max-w-md mx-auto">
                        <form className="search-form" action="" method="POST">
                            <div className="flex">
                                <input
                                    name="search_term"
                                    className="input input-md text-lg input-bordered border-2 border-r-0 w-full"
                                    type="search"
                                    placeholder="Search..."
                                    aria-label="Search"
                                    maxLength={60}
                                    style={{
                                        borderRadius: "0.5rem 0rem 0rem 0.5rem"
                                    }}
                                />
                                <button
                                    className="btn btn-blue"
                                    type="submit"
                                    style={{
                                        borderRadius: "0rem 0.5rem 0.5rem 0rem"
                                    }}
                                >
                                    <i className="bi bi-search text-lg"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="navbar-nav flex space-x-1">
                        <NavLink
                            className={
                                "nav-item btn btn-ghost px-3 text-lg " +
                                isActiveChecker("section")
                            }
                            to={`/${to + (to ? "/" : "")}sections`}
                        >
                            Sections
                        </NavLink>
                        <NavLink
                            className={
                                "nav-item btn btn-ghost px-3 text-lg " +
                                isActiveChecker("book")
                            }
                            to={`/${to + (to ? "/" : "")}books`}
                        >
                            Books
                        </NavLink>
                        {to === "" ? (
                            <NavLink
                                className={
                                    "nav-item btn btn-ghost px-3 text-lg " +
                                    (["/login", "/register"].some(
                                        (path) => path === location.pathname
                                    )
                                        ? "active"
                                        : "")
                                }
                                to="/login"
                            >
                                Login
                            </NavLink>
                        ) : (
                            <>
                                {to === "user" ? (
                                    <NavLink
                                        className="nav-item btn btn-ghost px-3 text-lg "
                                        to="/user/my-books"
                                    >
                                        MyBooks
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        className="nav-item btn btn-ghost px-3 text-lg "
                                        to="/librarian/requests"
                                    >
                                        Requests
                                    </NavLink>
                                )}
                                <NavLink
                                    className="nav-item btn btn-ghost px-3 text-lg"
                                    to={`/${to}/stats`}
                                >
                                    Stats
                                </NavLink>
                                <NavLink
                                    className={
                                        "btn rounded-full p-2  " +
                                        (location.pathname === `/${to}/account`
                                            ? "btn-blue"
                                            : "btn-ghost")
                                    }
                                    to={`/${to}/account`}
                                >
                                    <img
                                        className="rounded-full h-8 w-8"
                                        src={accountImage}
                                        alt="Account"
                                    />
                                </NavLink>
                            </>
                        )}
                    </div>
                    <label className="swap swap-rotate ml-3 ">
                        <input
                            type="checkbox"
                            className="theme-controller"
                            onChange={() => {
                                const newTheme =
                                    localStorage.getItem("theme") === "light"
                                        ? "dark"
                                        : "light";
                                setTheme(newTheme);
                                localStorage.setItem("theme", newTheme);
                            }}
                        />
                        <svg
                            className={"fill-current w-8 h-8 " + themeLis[0]}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                        <svg
                            className={"fill-current w-8 h-8 " + themeLis[1]}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>
                    </label>
                </div>
            </div>
        </>
    );
}

export default Header;
