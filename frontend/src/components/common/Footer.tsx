function Footer() {
    return (
        <>
            <footer
                className={
                    "section bg-footer " +
                    (localStorage.getItem("theme") &&
                    localStorage.getItem("theme") === "light"
                        ? "bg-base-200"
                        : "bg-base-300 ")
                }
            >
                <div className="flex justify-between px-16">
                    <div>
                        <h6
                            className={
                                "uppercase text-lg border-b " +
                                (localStorage.getItem("theme") === "light"
                                    ? "border-gray-900"
                                    : "border-gray-300")
                            }
                        >
                            Information
                        </h6>
                        <ul className="list-unstyled mt-1">
                            <li>
                                <a href="">Sections</a>
                            </li>
                            <li>
                                <a href="">Books</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h6
                            className={
                                "uppercase text-lg border-b " +
                                (localStorage.getItem("theme") === "light"
                                    ? "border-gray-900"
                                    : "border-gray-300")
                            }
                        >
                            Resources
                        </h6>
                        <ul className="list-unstyled mt-2">
                            <li>
                                <a href="">Wikipedia </a>
                            </li>
                            <li>
                                <a href="">React blog</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h6
                            className={
                                "uppercase text-lg border-b " +
                                (localStorage.getItem("theme") === "light"
                                    ? "border-gray-900"
                                    : "border-gray-300")
                            }
                        >
                            Help
                        </h6>
                        <ul className="list-unstyled mt-2">
                            <li>
                                <a href="">Sign Up </a>
                            </li>
                            <li>
                                <a href="">Login</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h6
                            className={
                                "uppercase text-lg border-b " +
                                (localStorage.getItem("theme") === "light"
                                    ? "border-gray-900"
                                    : "border-gray-300")
                            }
                        >
                            Contact Us
                        </h6>
                        <p className="mt-2">
                            Contact us if need help with anything
                        </p>
                        <p className="mt-1">+91 6301516021</p>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <p>2024 © VNRVJIET, All Rights Reserved</p>
                </div>
            </footer>
        </>
    );
}

export default Footer;
