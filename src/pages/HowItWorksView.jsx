import { useState } from "react";

export default function HowItWorksView() {

    let [toggle, setToggle] = useState("petsitting");

    const steps = {
        petsitting: [
            { title: "Sign Up", text: "Create an account as a pet owner or a pet sitter. Fill in your personal info and add your pet's profile or your experience details." },
            { title: "Browse Listings", text: "Use filters like city, type of pet, and availability to find the perfect sitter for your pet." },
            { title: "Meet & Greet", text: "Contact sitters and schedule a meeting to ensure it’s the right fit for both sides." },
            { title: "Make a Deal", text: "Agree on the care period and pet needs. This deal acts as your digital agreement." },
            { title: "Pet Drop-off & Payment", text: "Deliver your pet to the sitter and pay directly in person — no online payment needed." },
            { title: "Stay Connected", text: "Use the mobile app to stay in touch and receive updates during the sitting." },
            { title: "Leave a Review", text: "After the care period, rate the sitter and share your experience with others." }
        ],
        forum: [
            { title: "Join the Community", text: "Register on the platform to access the forum. Only verified users can post or comment." },
            { title: "Ask a Question", text: "Post questions related to pet health, behavior, or care. Add a photo if it helps explain your situation." },
            { title: "Choose Response Type", text: "Decide if you want answers from everyone or only certified vets. Filter replies accordingly." },
            { title: "Engage in Discussion", text: "Comment on other posts, offer help from your experience, or clarify your needs in your own thread." },
            { title: "Stay Notified", text: "Receive notifications when someone replies to your post or when your question gets resolved." }
        ]
    };

    return <>
        <div className="container my-5" style={{ maxWidth: "70%" }}>
            <div className="p-3 rounded shadow">
                <h2 className="text-center">How It Works</h2>

                <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group" role="group" aria-label="Help type">

                        {/* {["petsitting", "forum"].map((step) =>(
                            <div key={step}>
                            <input
                            type="radio"
                            className="btn-check"
                            name="helpType"
                            id={step}
                            autoComplete="off"
                            checked={toggle === step}
                            onChange={() => setToggle(step)}
                        />
                        <label className="btn btn-outline-secondary" htmlFor={step}>
                        {step === "petsitting" ? "Pet Sitting" : "Forum"}
                        </label>
                        </div>
                        ))} */}
                        <input
                            type="radio"
                            className="btn-check"
                            name="helpType"
                            id="petsitting"
                            autoComplete="off"
                            checked={toggle === "petsitting"}
                            onChange={() => setToggle("petsitting")}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="petsitting">
                            Pet Sitting
                        </label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="helpType"
                            id="forum"
                            autoComplete="off"
                            checked={toggle === "forum"}
                            onChange={() => setToggle("forum")}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="forum">
                            Forum
                        </label>
                    </div>
                </div>

                <div className="tab-content" id="howTabsContent">
                    {steps[toggle].map((step, index) => (
                        <Step key={index} number={index + 1} title={step.title}>
                            {step.text}
                        </Step>
                    ))}
                </div>

                <p className="text-muted small mt-4">
                    Simple. Safe. Stress-free — for you and your pet.
                </p>
            </div>
        </div>
    </>
}

function Step({ number, title, children }) {
    return (
        <div className="step mb-3">
            <div className="step-title fw-bold">{number}. {title}</div>
            <p>{children}</p>
        </div>
    );
}