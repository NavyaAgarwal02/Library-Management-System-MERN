import { textValidationMessages, goBack } from "../../utils";
import { FieldError, useForm } from "react-hook-form";
import { useState } from "react";
import { passwordRegex } from "../../utils/regex";

function ChangePassword({ to }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();
    const [error, setError] = useState<Error | null>(null);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const formSubmit = (data: Partial<Book>) => {};

    return (
        <>
            <div className="content-section width-60 mx-auto pt-4 pb-4 px-5 text-center">
                <h1 className="text-4xl">Change Password</h1>
                <hr className="border-t-1 border-base-content mt-3 mb-4 mx-4" />
                <form
                    noValidate
                    className="mx-auto"
                    onSubmit={handleSubmit(formSubmit)}
                >
                    <div className="mt-8 flex justify-center ml-1">
                        <label
                            htmlFor="oldPassword"
                            className="text-2xl mr-4 mt-1"
                        >
                            Old Password:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="password"
                                className="input w-full text-xl input-md border-2 input-bordered"
                                maxLength={60}
                                {...register(
                                    "oldPassword",
                                    textValidationMessages(
                                        "Old Password",
                                        8,
                                        60,
                                        passwordRegex
                                    )
                                )}
                            />
                            {errors.oldPassword && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.oldPassword as FieldError).message}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <label
                            htmlFor="newPassword"
                            className="text-2xl mr-4 mt-1"
                        >
                            New Password:
                        </label>
                        <div className="flex-col w-2/3">
                            <input
                                type="password"
                                className="input w-full text-xl input-md border-2 input-bordered"
                                maxLength={60}
                                {...register(
                                    "newPassword",
                                    textValidationMessages(
                                        "New Password",
                                        8,
                                        60,
                                        passwordRegex
                                    )
                                )}
                            />
                            {errors.newPassword && (
                                <p className="text-red-500 mt-2 text-base ml-1 text-start">
                                    {(errors.newPassword as FieldError).message}
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
                                <i className="bi bi-arrow-clockwise"></i>
                                Change
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default ChangePassword;
