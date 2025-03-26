import bookImage from "../../assets/defaultBookPicture.png";
import { NavLink } from "react-router-dom";
import { specialDelete } from "../librarian/utils";

interface Props {
    to: "" | "librarian" | "user";
    book: Book;
    section: Partial<Section>;
}

function BookCard({ to, book, section }: Props) {
    return (
        <>
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                {book.title === "Add Book" ? (
                    <>
                        <div
                            className="card special-card flex items-center justify-center h-full pb-4 mr-6"
                            style={{ minHeight: "24rem" }}
                        >
                            <NavLink
                                to={`/librarian/section/${section.slug}/book/add`}
                            >
                                <i className="bi bi-plus-circle text-9xl text-green-600"></i>
                            </NavLink>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="card special-card mr-6">
                            <NavLink
                                to={`/${to + (to ? "/" : "")}section/${
                                    section.slug
                                }/book/${book.slug}`}
                            >
                                <img
                                    className={
                                        "card-img-top w-full " +
                                        (to === "librarian" ? "h-56" : "h-52")
                                    }
                                    src={bookImage}
                                    alt="No Image"
                                />
                                <div className="card-body p-4">
                                    <h4 className="card-title text-xl font-semibold">
                                        {book.title}
                                    </h4>
                                    <h5 className="card-title text-lg font-semibold">
                                        {book.author}
                                    </h5>
                                    <p className="card-text text-base">
                                        {book.description}
                                    </p>
                                </div>
                            </NavLink>
                            <div className="mb-4">
                                {to === "librarian" ? (
                                    <>
                                        <div className="px-4">
                                            <NavLink
                                                to={`/librarian/section/${section.slug}/book/${book.slug}/view`}
                                            >
                                                <button className="btn btn-success w-full px-3 text-base">
                                                    <i className="bi bi-eye text-xl"></i>
                                                    View
                                                </button>
                                            </NavLink>
                                            <div className="flex justify-between mt-2">
                                                <button
                                                    className="btn btn-error flex-1 px-3 mr-2 text-base"
                                                    onClick={() => {
                                                        specialDelete(
                                                            "book",
                                                            book.slug
                                                        );
                                                    }}
                                                >
                                                    <i className="bi bi-trash text-lg"></i>
                                                    Delete
                                                </button>
                                                <NavLink
                                                    to={`/librarian/section/${section.slug}/book/${book.slug}/edit`}
                                                    className="flex-1"
                                                >
                                                    <button className="btn btn-blue px-3 w-full text-base">
                                                        <i className="bi bi-pencil-square text-lg"></i>
                                                        Edit
                                                    </button>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4">
                                            <NavLink
                                                to={`/user/${
                                                    to === "user"
                                                        ? "request"
                                                        : "login"
                                                }`}
                                            >
                                                <button className="btn btn-success w-full px-3 text-base">
                                                    <i className="bi bi-send me-1"></i>
                                                    Request
                                                </button>
                                            </NavLink>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default BookCard;
