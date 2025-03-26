import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import { NavLink } from "react-router-dom";
import SectionCard from "./SectionCard";
import { createAxios } from "../../utils";

function Books({ to }: Props) {
    const [sections, setSections] = useState<Partial<Section>[] | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const mainAxios = createAxios("");
        mainAxios.get("/books")
            .then((res) => {
                const fetchedSections = res.data;
                let updatedSections: Partial<Section>[] | null = null;
                if (to === "librarian") {
                    updatedSections = fetchedSections.map(
                        (section: Section) => ({
                            ...section,
                            books: [...section.books, { title: "Add Book" }]
                        })
                    );
                    updatedSections &&
                        updatedSections.push({ title: "Add Section" });
                } else {
                    updatedSections = fetchedSections;
                }
                console.log(updatedSections);
                setSections(updatedSections);
            })
            .catch((err) => setError(err));
    }, [to]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!sections) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="content-section mx-auto">
                {sections.map((section, index) => {
                    return (
                        <div key={index} className="mb-8 mt-4">
                            <NavLink
                                to={`/${to + (to ? "/" : "")}section/${
                                    section.title === "Add Section"
                                        ? "add"
                                        : section.slug
                                }`}
                            >
                                <h2 className="text-3xl ml-4">
                                    {section.title}
                                </h2>
                            </NavLink>
                            {section.title === "Add Section" && (
                                <div
                                    key={index}
                                    className="flex flex-wrap justify-start"
                                >
                                    <SectionCard
                                        to="librarian"
                                        section={section}
                                    />
                                </div>
                            )}
                            {section.books &&
                                (section.books.length > 4 ? (
                                    <div className="flex flex-nowrap ml-4 mt-4">
                                        {section.books.map((book, index) => {
                                            return (
                                                <BookCard
                                                    section={section}
                                                    book={book}
                                                    to={to}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : section.books.length > 0 ? (
                                    <div className="flex justify-start ml-4 mt-4">
                                        {section.books.map((book, index) => {
                                            return (
                                                <BookCard
                                                    section={section}
                                                    book={book}
                                                    to={to}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <h3 className="ml-4 mt-3 text-2xl">
                                        There are no Books in this Section
                                    </h3>
                                ))}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Books;
