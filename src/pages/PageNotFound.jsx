import { Link } from "react-router-dom";

export default function PageNotFound() {
    return (
        <div>
            404 NOT FOUND
            <Link to="/">Home</Link>
        </div>
    );
}