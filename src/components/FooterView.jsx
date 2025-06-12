export default function FooterView() {
    return <>
        <nav className="pt-4 text-black bg-body-tertiary">
            <div className="container text-center text-md-start">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5>PetSitter</h5>
                        <p>
                            Your trusted platform to find the perfect sitter for your furry
                            friend.
                        </p>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li>
                                <a href="/" className="text-black text-decoration-none">Home</a>
                            </li>
                            <li>
                                <a href="/howitworks" className="text-black text-decoration-none">How It Works</a>
                            </li>
                            <li>
                                <a href="#" className="text-black text-decoration-none">Contact</a>
                            </li>
                            <li>
                                <a href="#" className="text-black text-decoration-none">FAQ</a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-4 mb-3">
                        <h5>Connect with Us</h5>
                        <div className="d-flex align-items-center gap-3">
                            <a href="mailto:info@petsitter.com" className="text-black"><i className="bi bi-envelope"></i></a>
                            <a href="#" className="text-black"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-black"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="text-black"><i className="bi bi-twitter"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center p-3 mt-3 border-top">
                © 2025 PetSitter. All rights reserved.
            </div>
        </nav></>
}