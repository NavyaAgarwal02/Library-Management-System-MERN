import { createAxios } from "../../../utils";

async function specialDelete(name: string, slug: string) {
    try {
        const librarianAxios = createAxios("librarian");
        await librarianAxios.delete(`/${name}/${slug}`);
    } catch (error) {}
};

export default specialDelete;