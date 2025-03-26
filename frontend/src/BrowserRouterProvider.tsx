import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom";
import {
    Layout,
    Login,
    Sections,
    Section,
    Books,
    Book,
    ViewBook,
    Statistics,
    Account,
    AddOrEditUser,
    ChangePassword
} from "./components/common";
import {
    Requests,
    AddOrEditSection,
    AddOrEditBook
} from "./components/librarian";
import { MyBooks } from "./components/user";
import { RedirectIfNotAuthenticated } from "./utils";
import { useSelector } from "react-redux";

interface Props {
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

function BrowserRouterProvider({ setTheme }: Props) {
    const user = useSelector((state: RootState) => state.user);
    const isAuthenticated = user!==null;

    const BrowserRouter = createBrowserRouter([
        {
            path: "/",
            element: <Layout to="" setTheme={setTheme} />,
            children: [
                {
                    path: "sections",
                    element: <Sections to="" />
                },
                {
                    path: "section/:sectionSlug",
                    element: <Section to="" />
                },
                {
                    path: "books",
                    element: <Books to="" />
                },
                {
                    path: "section/:sectionSlug/book/:bookSlug",
                    element: <Book to="" />
                },
                {
                    path: "register",
                    element: <AddOrEditUser to="add" to1="user" />
                },
                {
                    path: "login",
                    element: <Login />
                },
                {
                    path: "",
                    element: <Navigate to="sections" />
                }
            ]
        },
        {
            path: "/user",
            element: (
                <RedirectIfNotAuthenticated
                    component={<Layout to="user" setTheme={setTheme} />}
                    isAuthenticated={isAuthenticated}
                    role="user"
                />
            ),
            children: [
                {
                    path: "sections",
                    element: <Sections to="user" />
                },
                {
                    path: "section/:sectionSlug",
                    element: <Section to="user" />
                },
                {
                    path: "books",
                    element: <Books to="user" />
                },
                {
                    path: "section/:sectionSlug/book/:bookSlug",
                    element: <Book to="user" />
                },
                {
                    path: "section/:sectionSlug/book/view/:bookSlug",
                    element: <ViewBook to="user" />
                },
                {
                    path: "my-books",
                    element: <MyBooks />
                },
                {
                    path: "stats",
                    element: <Statistics to="user" />
                },
                {
                    path: "account",
                    element: <Account to="user" />
                },
                {
                    path: "edit",
                    element: <AddOrEditUser to="edit" to1="user" />
                },
                {
                    path: "change-password",
                    element: <ChangePassword to="user" />
                },
                {
                    path: "",
                    element: <Navigate to="sections" />
                }
            ]
        },
        {
            path: "librarian",
            element: (
                <RedirectIfNotAuthenticated
                    component={<Layout to="librarian" setTheme={setTheme} />}
                    isAuthenticated={isAuthenticated}
                    role="librarian"
                />
            ),
            children: [
                {
                    path: "sections",
                    element: <Sections to="librarian" />
                },
                {
                    path: "section/:sectionSlug",
                    element: <Section to="librarian" />
                },
                {
                    path: "section/add",
                    element: <AddOrEditSection to="add" />
                },
                {
                    path: "section/:sectionSlug/edit",
                    element: <AddOrEditSection to="edit" />
                },
                {
                    path: "books",
                    element: <Books to="librarian" />
                },
                {
                    path: "section/:sectionSlug/book/:bookSlug",
                    element: <Book to="librarian" />
                },
                {
                    path: "section/:sectionSlug/book/:bookSlug/view",
                    element: <ViewBook to="librarian" />
                },
                {
                    path: "section/:sectionSlug/book/add",
                    element: <AddOrEditBook to="add" />
                },
                {
                    path: "section/:sectionSlug/book/:bookSlug/edit",
                    element: <AddOrEditBook to="edit" />
                },
                {
                    path: "requests",
                    element: <Requests />
                },
                {
                    path: "stats",
                    element: <Statistics to="librarian" />
                },
                {
                    path: "account",
                    element: <Account to="librarian" />
                },
                {
                    path: "edit",
                    element: <AddOrEditUser to="edit" to1="librarian" />
                },
                {
                    path: "change-password",
                    element: <ChangePassword to="librarian" />
                },
                {
                    path: "",
                    element: <Navigate to="sections" />
                }
            ]
        }
    ]);

    return (
        <>
            <RouterProvider router={BrowserRouter} />
        </>
    );
}

export default BrowserRouterProvider;
