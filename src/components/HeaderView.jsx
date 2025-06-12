import { Link } from "react-router-dom"

export default function HeaderView() {
    return <>
        {/* <nav className="navbar bg-body-tertiary" style="margin-right: auto"> */}
        <nav className="navbar bg-body-tertiary" >
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    {/* <img src="../Frontend/Images/logo.png" alt="Logo" className="d-inline-block align-text-bottom" /> */}
                    <img src='/logo.png' alt="Logo" height="35px" className="d-inline-block align-text-bottom" />
                    Petsitter
                </a>

                <ul className="nav nav-pills justify-content-end">
                    <li className="nav-item">
                        <a className="nav-link text-black" href="/forum">Forum</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-black" href="/aboutus">About Us</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-black" href="/howitworks">How it works?</a>
                    </li>
                    <li className="nav-item">
                        <a className="btn btn-secondary" href="/register">Sign Up</a>
                        {/* <Link to="/register" className="btn btn-secondary" aria-current="page">
                            Sign Up
                        </Link> */}
                        {/* <button type="button" className="btn btn-secondary" aria-current="page" href="/register" onClick={ }>Sign Up</button> */}
                    </li>
                </ul>
            </div>
        </nav></>
}