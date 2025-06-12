export default function SignInView() {
    return <>
        <section className="container my-5">
            <div className="p-3 rounded shadow" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h2 className="text-center mb-4">Sign in</h2>

                <form className="row g-3">
                    <div className="col-12">
                        <label htmlFor="inputUsername" className="form-label mb-0">
                            Username
                        </label>
                        <input type="text" className="form-control" id="inputUsername" />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputPassword" className="form-label mb-0">
                            Password
                        </label>
                        <input type="password" className="form-control" id="inputPassword" />
                    </div>

                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-secondary mt-4">
                            Sign In
                        </button>
                    </div>
                </form>

                <p className="text-center mb-0">Don't have an account?</p>
            </div>
        </section>
    </>
}