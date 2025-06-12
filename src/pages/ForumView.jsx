export default function ForumView() {
    return <>
        <div className="container my-5" style={{ maxWidth: "70%" }}>
            <div className="p-3 rounded shadow">
                <h2 className="text-center mb-4">Posts</h2>

                {/* Forum Posts */}
                {[1, 2, 3].map((entry, index) => (
                    <div className="forum-entry" key={index}>
                        <div className="d-flex justify-content-between">
                            <span>
                                <strong>User</strong>
                            </span>
                            <span>
                                <strong>Date</strong>
                            </span>
                        </div>

                        <div className="d-flex">
                            <div className="row w-100">
                                <div className="col-md-4">
                                    <div className="forum-content-box">
                                        <img src="https://via.placeholder.com/100" alt="Post Image" />
                                        Sample post content goes here...
                                    </div>
                                </div>

                                <div
                                    className="col-md-8 d-flex flex-column justify-content-start"
                                    style={{ maxHeight: "180px", overflow: "hidden" }}
                                >
                                    <p>
                                        <strong>Comments</strong>
                                    </p>
                                    <div className="comments-box">
                                        <p>
                                            <strong>User</strong>
                                            <br />
                                            Sample comment text goes here...
                                        </p>
                                        <p>
                                            <strong>User2</strong>
                                            <br />
                                            Another comment to test layout...
                                        </p>
                                        <p>
                                            <strong>User2</strong>
                                            <br />
                                            Yet another sample comment text...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="likes">Likes</div>
                    </div>
                ))}

                {/* Pagination */}
                <div className="text-center">
                    <div className="btn-group" role="group" aria-label="Pagination">
                        <button type="button" className="btn btn-outline-secondary">
                            &lt;
                        </button>
                        <button type="button" className="btn btn-outline-secondary">
                            1
                        </button>
                        <button type="button" className="btn btn-outline-secondary">
                            2
                        </button>
                        <button type="button" className="btn btn-outline-secondary">
                            3
                        </button>
                        <button type="button" className="btn btn-outline-secondary">
                            4
                        </button>
                        <button type="button" className="btn btn-outline-secondary">
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}