export default function AboutUsView() {
    return <>
        <div className="container about-section" style={{ maxWidth: "70%" }}>
            <div className="p-3 rounded shadow my-5">
                <h2 className="text-center">About Us</h2>
                <p className="subtitle mb-4">
                    Because your pet deserves a second home, not just a place to stay.
                </p>
                <div className="gif-heart-frame">
                    <img
                        src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnF4ZW56aXI0YzJhZXE3anlkcDh0bHZia2lsMmp3NWQ3YjRmMmNoMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hX3fhNF2UzCyOIbQKK/giphy.gif"
                        alt="Happy pet gif"
                    />
                </div>
                <div>
                    <p>
                        We know how much your pet means to you. That’s why we built{" "}
                        <span className="highlight">PetSitter</span> — a platform that connects pet owners with trusted sitters who
                        treat animals like their own family.
                    </p>
                    <p>
                        Whether you’re heading out for a trip or just need temporary help, we make it easy to find someone who will
                        love and care for your pet in a home-like setting.
                    </p>
                    <p>
                        No more impersonal kennels or unreliable favors. With PetSitter, you get peace of mind, and your pet gets
                        comfort, safety, and love.
                    </p>
                </div>
                <p className="mt-4 text-muted small" style={{ textAlign: "center" }}>
                    Serving pet lovers in Koper, Slovenia, and beyond. One happy tail at a time.
                </p>
            </div>
        </div>
    </>
}