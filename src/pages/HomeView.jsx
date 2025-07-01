import { useNavigate } from "react-router-dom";

export default function HomeView() {
  const navigate = useNavigate();

  return (
    <div className="bg-body-tertiary">
      <div className="section1">
        <section className="text-center mb-5 pt-5">
          <h1 className="pt-4">Welcome to the website for petsitting!</h1>
          <div>
            <button className="button1" onClick={() => navigate("/listing")}>
              Find a PetSitter
            </button>
            <button className="button1" onClick={() => navigate("/register")}>
              Be a PetSitter
            </button>
          </div>
        </section>
      </div>
      <section className="text-center my-5">
        <h3>Leave your friend in safe hands</h3>

        <section className="container my-5">
          <div className="row g-4 justify-content-center">
            <div className="col-md-4 ">
              <div className="card border shadow h-100 beige card-body text-center m-1">
                  <i className="bi bi-search-heart display-4 mb-3 brown"></i>
                  <h5 className="card-title">1. Find your perfect sitter</h5>
                  <p className="card-text">
                    Browse trusted profiles, read real reviews, and choose a pet
                    sitter who fits your pet’s needs and your schedule.
                  </p>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="card border shadow h-100 beige card-body text-center m-1">
                  <i className="bi bi-calendar-check display-4 mb-3 brown"></i>
                  <h5 className="card-title">2. Arrange a meet & greet</h5>
                  <p className="card-text">
                    Connect with the sitter to introduce your pet, ask
                    questions, and make sure it’s a perfect match before
                    booking.
                  </p>
              </div>
            </div>
            <div className="col-md-4 ">
              <div className="card border shadow h-100 beige card-body text-center m-1">
                  <i className="bi bi-pencil-square display-4 mb-3 brown"></i>
                  <h5 className="card-title">3. Confirm & enjoy your trip</h5>
                  <p className="card-text">
                    Secure the booking, pack your bags, and relax knowing your
                    pet is in safe hands while you’re away.
                  </p>
                </div>
              </div>
            </div>
        </section>
      </section>


      <div className="text-center my-5">
        <h3><b>1500+</b> happy pets and owners</h3>
        <img
          src="/Images/5pics.png"  
          alt="Happy pets and sitters"
          style={{ 
            width: "100%",
            height: "auto",
            maxWidth: "1200px",
            //i can add animation here if i have time
          }}
        />
      </div>
      
      <section className="container my-5">
        <h3 className="text-center mb-4">Made with care :)</h3>
        <h5 className="text-center mb-5">
          Join a community of caring pet lovers. Read real reviews, share experiences, and support local animal lovers.
        </h5>
        <div className="row g-4">
          <div className="col-md-6 d-flex flex-column justify-content-between">
            <div className="card border shadow mb-4 beige flex-fill">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-shield-check display-5 me-4 brown"></i>
                <div>
                  <h5 className="card-title mb-1">Screened & Trusted</h5>
                  <p className="card-text mb-0">
                    All sitters are carefully screened, reviewed, and rated by real pet parents. You can feel confident leaving your pet in safe hands.
                  </p>
                </div>
              </div>
            </div>
            <div className="card border shadow beige flex-fill">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-clock-history display-5 me-4 brown"></i>
                <div>
                  <h5 className="card-title mb-1">Flexible Services</h5>
                  <p className="card-text mb-0">
                    Whether you need a weekend sitter, a daily walker, or vacation-long care — PetSitter offers flexible services tailored to your schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-between">
            <div className="card border shadow mb-4 beige flex-fill">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-chat-dots display-5 me-4 brown"></i>
                <div>
                  <h5 className="card-title mb-1">Easy Communication</h5>
                  <p className="card-text mb-0">
                    Arrange a meeting, chat with the sitter, and confirm your booking — all in one place. It's hassle-free and secure.
                  </p>
                </div>
              </div>
            </div>
            <div className="card border shadow beige flex-fill">
              <div className="card-body d-flex align-items-center">
                <i className="bi bi-cash-coin display-5 me-4 brown"></i>
                <div>
                  <h5 className="card-title mb-1">Transparent Pricing</h5>
                  <p className="card-text mb-0">
                    No hidden fees. See prices upfront, compare sitters, and choose what fits your budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="border-bottom text-center">
        <h3 style={{ display: "inline-block" }}>Until the next petsitting...</h3>
        <img src="/CatG.gif" alt="CatGif" style={{ width: "300px" }} />
      </section>
    </div>
  );
}
