import { textValidationMessages, createAxios } from "../../utils";
import { FieldError, useForm } from "react-hook-form";
import { useState } from "react";
import { usernameRegex, passwordRegex } from "../../utils/regex";
import { useNavigate, NavLink } from "react-router-dom";
import { userPromise } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

interface Props {}

function Login({}: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [error, setError] = useState<Error | null>(null);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const dispatch: Dispatch<any> = useDispatch();

    const navigate = useNavigate();

    const formSubmit = async (data: Partial<User>) => {
        try {
            const mainAxios = createAxios("");
            const res = await mainAxios.post("/login", data);
            const { user, token } = res.data;
            localStorage.setItem("token", token);
            const actionObj = userPromise(token);
            dispatch(actionObj);
            navigate(`/${user.role}/sections`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="content-section width-45 mx-auto pt-4 pb-4 px-5 mt-28 text-center">
                <h1 className="text-4xl">Login</h1>
                <hr className="border-t-1 border-base-content mt-3 mb-4 mx-4" />
                <form
                    noValidate
                    className="mx-auto"
                    onSubmit={handleSubmit(formSubmit)}
                >
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
                                className="input text-xl w-full input-md border-2 input-bordered"
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
                            htmlFor="password"
                            className="text-2xl mr-4 mt-1 ml-1"
                        >
                            Password:
                        </label>
                        <div className="flex-col w-2/3 ml-1">
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
                    <NavLink
                        className="block text-lg text-start ml-10 mt-5  text-blue-600"
                        to="/reset-password"
                    >
                        Forgot Password?
                    </NavLink>
                    <div className="flex justify-center w-5/6 mx-auto mt-2 mb-4">
                        <div className="col-md-6 text-end">
                            <button
                                className="btn btn-success text-lg"
                                type="submit"
                            >
                                <i className="bi bi-box-arrow-in-right text-xl"></i>
                                Login
                            </button>
                        </div>
                    </div>
                    <NavLink
                        className="block text-start ml-10 text-lg mt-5 mb-5  text-blue-600"
                        to="/register"
                    >
                        Don't have an Account?
                    </NavLink>
                </form>
            </div>
        </>
    );
}

export default Login;
