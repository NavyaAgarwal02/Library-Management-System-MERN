import {
    textValidationMessages,
    imageValidationMessages,
    goBack
} from "../../utils";
import { FieldError, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
    nameRegex,
    usernameRegex,
    emailRegex,
    passwordRegex
} from "../../utils/regex";
import { NavLink } from "react-router-dom";

interface Props {
    to: "add" | "edit";
    to1: "user" | "librarian";
}

function AddOrEditUser({ to, to1 }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();
    const [error, setError] = useState<Error | null>(null);

    if (to === "edit") {
        useEffect(() => {}, [setValue]);
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const formSubmit = (data: Partial<Book>) => {
        if (to === "edit") {
        } else {
        }
    };

    return (
        <>
            <div className="content-section width-60 mx-auto pt-4 pb-4 px-5 text-center">
                <h1 className="text-3xl">
                    {`${to === "add" ? "Register" : "Edit"} ${to1.charAt(0).toUpperCase()}${to1.slice(1)}`}
                </h1>
                <hr className="border-t-1 border-base-content mt-3 mb-4 mx-4" />
                <form
                    noValidate
                    className="mx-auto"
                    onSubmit={handleSubmit(formSubmit)}
                >
                    <div className="mt-8 flex justify-center">
                        <label
                            htmlFor="name"
                            className="text-2xl mr-4 mt-1 ml-10"
                        >
                            Name:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="text"
                                className="input w-full text-xl input-md border-2 input-bordered"
                                maxLength={60}
                                {...register(
                                    "name",
                                    textValidationMessages(
                                        "Name",
                                        3,
                                        60,
                                        nameRegex
                                    )
                                )}
                            />
                            {errors.name && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.name as FieldError).message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <label
                            htmlFor="username"
                            className="text-2xl mr-4 mt-1"
                        >
                            Username:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="text"
                                className="input w-full text-xl input-md border-2 input-bordered"
                                maxLength={32}
                                {...register(
                                    "username",
                                    textValidationMessages(
                                        "Username",
                                        5,
                                        32,
                                        usernameRegex
                                    )
                                )}
                            />
                            {errors.username && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.username as FieldError).message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <label
                            htmlFor="email"
                            className="text-2xl mr-4 mt-1 ml-12"
                        >
                            Email:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="email"
                                className="input w-full text-xl input-md border-2 input-bordered"
                                {...register("email", {
                                    required: `Email is required.`,
                                    pattern: {
                                        value: emailRegex,
                                        message: `Email can only have letters, digits and some special characters.`
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.email as FieldError).message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <label
                            htmlFor="profilePicture"
                            className="text-2xl mr-4 mt-2 ml-10"
                        >
                            Image:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="file"
                                className="file-input w-full text-lg file-input-md border-2 file-input-bordered mt-1"
                                accept="image/png,image/jpeg,image/jpg"
                                {...register(
                                    "profilePicture",
                                    imageValidationMessages()
                                )}
                            />
                            {errors.profilePicture && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {
                                        (errors.profilePicture as FieldError)
                                            .message
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <label
                            htmlFor="password"
                            className="text-2xl mr-4 mt-1 ml-2"
                        >
                            Password:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="password"
                                className="input w-full text-xl input-md border-2 input-bordered"
                                maxLength={60}
                                {...register(
                                    "password",
                                    textValidationMessages(
                                        "Password",
                                        8,
                                        60,
                                        passwordRegex
                                    )
                                )}
                            />
                            {errors.password && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.password as FieldError).message}
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
                                        "bi text-xl " +
                                        (to === "add"
                                            ? "bi-person-check"
                                            : "bi-pencil-square")
                                    }
                                ></i>
                                {to === "add" ? "Register" : "Edit"}
                            </button>
                        </div>
                    </div>
                    {to === "add" && (
                        <NavLink
                            className="block text-lg mt-5 mb-5 text-start ml-14  text-blue-600"
                            to="/login"
                        >
                            Already have an Account?
                        </NavLink>
                    )}
                </form>
            </div>
        </>
    );
}

export default AddOrEditUser;
