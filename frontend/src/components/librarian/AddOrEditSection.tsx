import { FieldError, useForm } from "react-hook-form";
import {
    textValidationMessages,
    imageValidationMessages,
    goBack,
    createAxios
} from "../../utils";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { titleRegex, descriptionRegex } from "../../utils/regex";

interface Props {
    to: "add" | "edit";
}

function AddOrEditSection({ to }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const [error, setError] = useState<Error | null>(null);
    const { sectionSlug } = useParams();
    const navigate = useNavigate();

    if (to === "edit") {
        useEffect(() => {
            const mainAxios = createAxios("");
            mainAxios
                .get(`/section/${sectionSlug}/`)
                .then((res) => {
                    const section = res.data;
                    setValue("title", section.title);
                    setValue("description", section.description);
                })
                .catch((error) => setError(error));
        }, [sectionSlug, setValue]);
    }

    const formSubmit = (data: Partial<Section>) => {
        const librarianAxios = createAxios("librarian");
        if (to === "edit") {
            librarianAxios
                .put(`/section/${sectionSlug}`, data)
                .then((res) => {
                    goBack("/librarian/sections");
                })
                .catch((err) => setError(err));
        } else {
            librarianAxios
                .post("/section", data)
                .then((res) => {
                    goBack("/librarian/sections");
                })
                .catch((err) => setError(err));
        }
    };

    return (
        <>
            <div className="content-section width-60 mx-auto pt-4 pb-4 px-5 text-center">
                <h1 className="text-3xl">
                    {`${to.charAt(0).toUpperCase()}${to.slice(1)} `}
                    Section
                </h1>
                <hr className="border-t-1 border-base-content mt-3 mb-4 mx-4" />
                <form
                    noValidate
                    className="mx-auto"
                    onSubmit={handleSubmit(formSubmit)}
                >
                    <div className="mt-8 flex justify-center">
                        <label
                            htmlFor="title"
                            className="text-2xl mr-4 mt-1 ml-16"
                        >
                            Title:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="text"
                                className="input w-full text-xl input-md border-2 input-bordered"
                                maxLength={60}
                                {...register(
                                    "title",
                                    textValidationMessages(
                                        "Title",
                                        3,
                                        60,
                                        titleRegex
                                    )
                                )}
                            />
                            {errors.title && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.title as FieldError).message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <label
                            htmlFor="picture"
                            className="text-2xl mr-4 mt-2 ml-12"
                        >
                            Image:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="file"
                                className="file-input w-full text-lg file-input-md border-2 file-input-bordered mt-1"
                                accept="image/png,image/jpeg,image/jpg"
                                {...register(
                                    "picture",
                                    imageValidationMessages()
                                )}
                            />
                            {errors.picture && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.picture as FieldError).message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <label
                            htmlFor="description"
                            className="text-2xl mr-4 mt-5"
                        >
                            Description:
                        </label>
                        <div className="flex-col w-2/3">
                            <textarea
                                className="textarea w-full text-lg textarea-md border-2 textarea-bordered"
                                maxLength={240}
                                {...register(
                                    "description",
                                    textValidationMessages(
                                        "Description",
                                        10,
                                        240,
                                        descriptionRegex
                                    )
                                )}
                            />
                            {errors.description && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.description as FieldError).message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between w-5/6 mx-auto mt-10 mb-4">
                        <div className="col-md-6">
                            <button
                                className="btn btn-error text-lg"
                                onClick={goBack("/librarian/sections")}
                            >
                                <i className="bi bi-x-circle"></i>Cancel
                            </button>
                        </div>
                        <div className="col-md-6 text-end">
                            <button
                                className="btn btn-success text-lg"
                                type="submit"
                            >
                                <i
                                    className={
                                        "bi " +
                                        (to === "add"
                                            ? "bi-plus-square"
                                            : "bi-pencil-square")
                                    }
                                ></i>
                                {`${to.charAt(0).toUpperCase()}${to.slice(1)} `}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddOrEditSection;
