export default function ForumInitialView() {
    return <>
        <section className="container text-center my-5" style={{ maxWidth: "70%" }}>
            <div className="p-3 rounded shadow">
                <h2 className="text-center mb-4">Forum</h2>

                <h5 className="mt-4">Choose pet</h5>
                <div className="d-flex justify-content-center flex-wrap">
                    {/* Pet Options */}
                    <input type="radio" name="pet" id="dog" className="image-radio" />
                    <label htmlFor="dog" className="image-label">
                        <img src="/Images/dog.png" alt="Dog" />
                    </label>

                    <input type="radio" name="pet" id="cat" className="image-radio" />
                    <label htmlFor="cat" className="image-label">
                        <img src="/Images/cat (2).png" alt="Cat" />
                    </label>

                    <input type="radio" name="pet" id="hamster" className="image-radio" />
                    <label htmlFor="hamster" className="image-label">
                        <img src="/Images/hamster.png" alt="Hamster" />
                    </label>

                    <input type="radio" name="pet" id="parrot" className="image-radio" />
                    <label htmlFor="parrot" className="image-label">
                        <img src="/Images/parrot.png" alt="Parrot" />
                    </label>

                    <input type="radio" name="pet" id="snake" className="image-radio" />
                    <label htmlFor="snake" className="image-label">
                        <img src="/Images/snake (1).png" alt="Snake" />
                    </label>

                    <input type="radio" name="pet" id="bunny" className="image-radio" />
                    <label htmlFor="bunny" className="image-label">
                        <img src="/Images/easter-bunny.png" alt="Bunny" />
                    </label>

                    <input type="radio" name="pet" id="lizard" className="image-radio" />
                    <label htmlFor="lizard" className="image-label">
                        <img src="/Images/lizard.png" alt="Lizard" />
                    </label>

                    <input type="radio" name="pet" id="spider" className="image-radio" />
                    <label htmlFor="spider" className="image-label">
                        <img src="/Images/spider.png" alt="Spider" />
                    </label>

                    <input type="radio" name="pet" id="unicorn" className="image-radio" />
                    <label htmlFor="unicorn" className="image-label">
                        <img src="/Images/unicorn.png" alt="Other" />
                    </label>
                </div>

                <h5 className="mt-4">Choose category</h5>
                <div className="d-flex justify-content-center flex-wrap">
                    {/* Category Options */}
                    <input type="radio" name="category" id="cat0" className="image-radio" />
                    <label htmlFor="cat0" className="image-label">
                        <img src="/Images/pet-care.png" alt="Category 1" />
                    </label>

                    <input type="radio" name="category" id="cat1" className="image-radio" />
                    <label htmlFor="cat1" className="image-label">
                        <img src="/Images/healthcare.png" alt="Category 2" />
                    </label>

                    <input type="radio" name="category" id="cat2" className="image-radio" />
                    <label htmlFor="cat2" className="image-label">
                        <img src="/Images/pet-food.png" alt="Category 3" />
                    </label>

                    <input type="radio" name="category" id="cat3" className="image-radio" />
                    <label htmlFor="cat3" className="image-label">
                        <img src="/Images/grooming.png" alt="Category 4" />
                    </label>

                    <input type="radio" name="category" id="cat4" className="image-radio" />
                    <label htmlFor="cat4" className="image-label">
                        <img src="/Images/walk-the-pet.png" alt="Category 5" />
                    </label>
                </div>

                <button className="btn btn-secondary mt-4">Next</button>
            </div>
        </section>
    </>
}