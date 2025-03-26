import bookImage from "../../assets/defaultBookPicture.png";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { specialDelete } from "../librarian/utils";
import FeedbackCard from "./FeedbackCard";
import { createAxios } from "../../utils";

function Book({ to }: Props) {
    const [book, setBook] = useState<Book | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const { bookSlug } = useParams();

    useEffect(() => {
        const mainAxios = createAxios("");
        mainAxios.get(`/book/${bookSlug}`)
            .then((res) => {
                setBook(res.data);
            })
            .catch((err) => setError(err));
    }, [bookSlug]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="content-section mx-auto">
                <div className="flex px-3 mt-4 mb-4">
                    <div>
                        <img
                            src={bookImage}
                            alt="No Image"
                            className="special-card mb-3 h-64"
                        />
                    </div>
                    <div className="ml-6">
                        <h2 className="text-4xl">{book.title}</h2>
                        <h3 className="text-2xl mt-1">{book.author}</h3>
                        <NavLink
                            to={`/${to + (to ? "/" : "")}section/${
                                book.section?.slug
                            }`}
                        >
                            <h4 className="text-xl mt-1">
                                {book.section.title}
                            </h4>
                        </NavLink>
                        <p className="text-lg mb-3">{book.description}</p>
                        {to === "librarian" ? (
                            <>
                                <NavLink
                                    to={`/librarian/section/${book.section.slug}/book/${book.slug}/view`}
                                >
                                    <button className="btn btn-success w-1/2 ml-2 mb-2 text-base">
                                        <i className="bi bi-eye text-lg"></i>
                                        View
                                    </button>
                                </NavLink>
                                <div className="flex">
                                    <div>
                                        <button
                                            className="btn btn-error mr-2 text-base"
                                            onClick={() => {
                                                specialDelete(
                                                    "book",
                                                    book.slug || ""
                                                );
                                            }}
                                        >
                                            <i className="bi bi-trash text-lg"></i>
                                            Delete
                                        </button>
                                    </div>
                                    <NavLink
                                        to={`/librarian/section/${book.section.slug}/book/${book.slug}/edit`}
                                    >
                                        <button className="btn btn-blue text-base">
                                            <i className="bi bi-pencil-square text-lg"></i>
                                            Edit
                                        </button>
                                    </NavLink>
                                </div>
                            </>
                        ) : (
                            <NavLink
                                to={`/user/${
                                    to === "user" ? "request" : "login"
                                }`}
                            >
                                <button className="btn btn-success text-base">
                                    <i className="bi bi-send"></i>
                                    Request
                                </button>
                            </NavLink>
                        )}
                    </div>
                </div>
                <hr className="border-t-1 border-base-content mx-2" />
                <div className="px-3">
                    <h2 className="text-center mt-2 text-4xl">Preview</h2>
                </div>
                <hr className="border-t-1 border-base-content mx-2 mt-4 mb-4" />
                <div className="px-3">
                    <h2 className="mt-2 text-4xl">Feedbacks</h2>
                    {book.feedbacks && book.feedbacks.length > 0 ? (
                        <div className="mb-4">
                            {book.feedbacks.map((feedback, index) => (
                                <div className="" key={index}>
                                    <FeedbackCard feedback={feedback} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h4 className="text-2xl mt-2 mb-4">
                            No feedbacks available
                        </h4>
                    )}
                </div>
            </div>
        </>
    );
}

export default Book;
