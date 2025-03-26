import { useEffect, useState } from "react";
import SectionCard from "./SectionCard";
import { createAxios } from "../../utils";

function Sections({ to }: Props) {
    const [sections, setSections] = useState<Section[] | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const mainAxios = createAxios("");
        mainAxios
            .get("/sections")
            .then((res) => {
                const fetchedSections = res.data;
                if (to === "librarian") {
                    fetchedSections.push({ title: "Add Section" });
                }
                setSections(fetchedSections);
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
                <div className="flex flex-wrap justify-start">
                    {sections &&
                        sections.map((section) => {
                            return <SectionCard section={section} to={to} />;
                        })}
                </div>
            </div>
        </>
    );
}

export default Sections;
