import { useNavigate } from "react-router-dom";

export default function goBack(url: string) {
    const navigate = useNavigate();
    return () => (window.history.length > 1 ? navigate(-1) : navigate(url));
}
