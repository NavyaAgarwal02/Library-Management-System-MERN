import { useEffect, useState } from "react";
import profileImage from "../../assets/defaultProfilePicture.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Account({ to }: Props) {
    const {user, isPending, errMessage} = useSelector((state: RootState) => state.user);
    console.log(user);
    const [error, setError] = useState(null);

    useEffect(() => {}, []);

    return (
        <>
            <div className="content-section mx-auto text-center p-4">
                <img
                    className="rounded-full w-1/4 mx-auto mt-3"
                    src={profileImage}
                    alt="No Image"
                />
                <h1 className="text-4xl mt-3">{user.name}</h1>
                <div className="flex justify-center mt-3">
                    <i className="bi bi-person-circle mr-1 text-3xl"></i>
                    <h3 className="text-3xl">{user.username}</h3>
                </div>
                <div className="flex justify-center mt-3">
                    <i className="bi bi-envelope mr-1 text-3xl mt-1"></i>
                    <h3 className="text-3xl">{user.email}</h3>
                </div>
                <div className="flex justify-center mt-6">
                    <NavLink to={`/${to}/edit`}>
                        <button className="btn btn-blue mr-10 text-base ml-2">
                            <i className="bi bi-pencil-square text-lg"></i>
                            Edit Profile
                        </button>
                    </NavLink>
                    <NavLink to={`/${to}/change-password`}>
                        <button className="btn btn-success mr-10 text-base">
                            <i className="bi bi-arrow-clockwise text-xl"></i>
                            Change Password
                        </button>
                    </NavLink>
                    <button
                        className="btn btn-error text-base"
                        onClick={() => {}}
                    >
                        <i className="bi bi-person-x text-xl"></i>
                        Delete Profile
                    </button>
                </div>
                <button className="btn btn-active mt-6 mb-4 text-base">
                    <i className="bi bi-box-arrow-right text-lg"></i>
                    Logout
                </button>
            </div>
        </>
    );
}

export default Account;
