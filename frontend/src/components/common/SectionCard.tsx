import sectionImage from "../../assets/defaultSectionPicture.jpeg";
import { NavLink } from "react-router-dom";
import { specialDelete } from "../librarian/utils";

interface Props {
    to: "" | "librarian" | "user";
    section: Partial<Section>;
}

function SectionCard({ to, section }: Props) {
    return (
        <>
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                {section.title === "Add Section" ? (
                    <>
                        <div
                            className="card special-card bg-base-100 w-11/12 h-full flex justify-center items-center pb-4"
                            style={{ minHeight: "22rem" }}
                        >
                            <NavLink to="/librarian/section/add">
                                <i className="bi bi-plus-circle text-9xl text-green-600"></i>
                            </NavLink>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="card special-card bg-base-100 w-11/12 h-full pb-4">
                            <NavLink
                                to={`/${to + (to ? "/" : "")}section/${
                                    section.slug
                                }`}
                            >
                                <img
                                    className={
                                        "card-img-top w-full " +
                                        (to === "librarian" ? "h-52" : "h-48")
                                    }
                                    src={sectionImage}
                                    alt="Card Image Cap"
                                />
                                <div className="card-body p-4">
                                    <h4 className="card-title text-2xl font-semibold">
                                        {section.title}
                                    </h4>
                                    <p className="card-text text-base">
                                        {section.description}
                                    </p>
                                </div>
                            </NavLink>
                            {to === "librarian" && (
                                <div className="px-4">
                                    <NavLink
                                        to={`/librarian/section/${section.slug}/book/add`}
                                    >
                                        <button className="btn btn-success w-full mb-2 text-base">
                                            <i className="bi bi-plus-square text-lg"></i>
                                            Add Book
                                        </button>
                                    </NavLink>
                                    {section.title !== "Miscellaneous" && (
                                        <div className="flex justify-between">
                                            <button
                                                className="btn btn-error flex-1 mr-2 text-base"
                                                onClick={() => {
                                                    specialDelete(
                                                        "section",
                                                        section.slug || ""
                                                    );
                                                }}
                                            >
                                                <i className="bi bi-trash text-lg"></i>
                                                Delete
                                            </button>
                                            <NavLink
                                                to={`/librarian/section/${section.slug}/edit`}
                                                className="flex-1"
                                            >
                                                <button className="btn btn-primary btn-blue w-full text-base">
                                                    <i className="bi bi-pencil-square text-lg"></i>
                                                    Edit
                                                </button>
                                            </NavLink>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default SectionCard;
