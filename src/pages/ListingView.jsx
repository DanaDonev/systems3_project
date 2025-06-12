export default function ListingView() {
    return <>
        <div className="container mt-4">
            <div className="p-3 rounded shadow">
                <div className="row">
                    {/* Filter Sidebar */}
                    <div className="col-md-3 bg-light p-3 filter-scrollable">
                        <h5>Filter</h5>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">City</label>
                            <select className="form-select">
                                <option>Select City</option>
                                <option>Ljubljana</option>
                                <option>Maribor</option>
                                <option>Koper</option>
                                {/* Add all cities in Slovenia */}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Pet Type</label>
                            {[
                                "Dog",
                                "Cat",
                                "Parrot",
                                "Snake",
                                "Spider",
                                "Lizard",
                                "Rabbit",
                                "Hamster",
                                "Other",
                            ].map((type) => (
                                <div className="form-check" key={type}>
                                    <input className="form-check-input" type="checkbox" id={type} />
                                    <label className="form-check-label" htmlFor={type}>
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Time Period</label>
                            <div className="mb-2">
                                <input type="date" className="form-control mb-2" />
                                <input type="date" className="form-control" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Rating</label>
                            {[2, 3, 4, 5].map((rating) => (
                                <div className="form-check" key={rating}>
                                    <input className="form-check-input" type="checkbox" id={`rating-${rating}`} />
                                    <label className="form-check-label" htmlFor={`rating-${rating}`}>
                                        {rating}+
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">Price</label>
                            <div className="d-flex gap-2">
                                <input type="number" className="form-control" placeholder="Min" />
                                <input type="number" className="form-control" placeholder="Max" />
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-md-9">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <label className="form-label mb-0 fw-semibold">Search</label>
                                <input type="text" className="form-control w-50" />
                            </div>
                            <div>
                                <button className="btn btn-light">Sort by</button>
                            </div>
                        </div>

                        {/* Grid of Cards */}
                        <div className="row row-cols-1 row-cols-md-3 g-3">
                            {[...Array(6)].map((_, index) => (
                                <div className="col" key={index}>
                                    <div className="card bg-light card-height" />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="text-center mt-2">
                            <div className="btn-group" role="group" aria-label="Pagination">
                                <button type="button" className="btn btn-outline-secondary">&lt;</button>
                                {[1, 2, 3, 4].map((page) => (
                                    <button type="button" className="btn btn-outline-secondary" key={page}>
                                        {page}
                                    </button>
                                ))}
                                <button type="button" className="btn btn-outline-secondary">&gt;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}