import sectionImage from "../../assets/defaultSectionPicture.jpeg";
import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import { NavLink } from "react-router-dom";
import { specialDelete } from "../librarian/utils";
import { useParams } from "react-router-dom";
import { createAxios } from "../../utils";

function Section({ to }: Props) {
    const [section, setSection] = useState<Section | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const { sectionSlug } = useParams();

    useEffect(() => {
        const mainAxios = createAxios("");
        mainAxios.get(`/section/${sectionSlug}`)
            .then((res) => {
                const fetchedSection = res.data;
                if (to === "librarian") {
                    fetchedSection.books.push({ title: "Add Book" });
                }
                setSection(fetchedSection);
            })
            .catch((err) => setError(err));
    }, [to, sectionSlug]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!section) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="content-section mx-auto">
                <div className="flex mt-4 px-3 mb-4">
                    <div>
                        <img
                            src={sectionImage}
                            alt="No Image"
                            className="special-card mb-3 h-60"
                        />
                    </div>
                    <div className="ml-6">
                        <h1 className="text-4xl font-semibold">
                            {section.title}
                        </h1>
                        <p className="text-xl mt-1 mb-6">
                            {section.description}
                        </p>
                        {to === "librarian" && (
                            <>
                                <NavLink
                                    to={`/librarian/section/${section.slug}/book/add`}
                                >
                                    <button
                                        className={
                                            "btn btn-success mb-3 w-1/2 text-base ml-1" +
                                            (section.title === "Miscellaneous"
                                                ? " mt-2"
                                                : "")
                                        }
                                    >
                                        <i className="bi bi-plus-square text-lg"></i>
                                        Add Book
                                    </button>
                                </NavLink>
                                {section.title !== "Miscellaneous" && (
                                    <div className="flex">
                                        <div className="">
                                            <button
                                                className="btn btn-error mr-2 text-base"
                                                onClick={() => {
                                                    specialDelete(
                                                        "section",
                                                        section.slug
                                                    );
                                                }}
                                            >
                                                <i className="bi bi-trash text-lg"></i>
                                                Delete
                                            </button>
                                        </div>
                                        <NavLink
                                            to={`/librarian/section/${section.slug}/edit`}
                                        >
                                            <button className="btn btn-blue text-base">
                                                <i className="bi bi-pencil-square text-lg"></i>
                                                Edit
                                            </button>
                                        </NavLink>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <hr className="border-t-1 border-base-content mx-2" />
                <div className="px-3">
                    <h1 className="text-4xl mt-4">Books</h1>
                    <div className="flex justify-start mt-3 mb-6">
                        {section.books && section.books.length > 0 ? (
                            section.books.map((book, index) => {
                                return (
                                    <BookCard
                                        to={to}
                                        key={index}
                                        section={section}
                                        book={book}
                                    />
                                );
                            })
                        ) : (
                            <h4>No books available</h4>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Section;
