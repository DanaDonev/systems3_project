export default function HomeView() {
  return <>
      {/* Welcome Section */}
      <div className="section1">
        <section className="text-center mb-5 pt-5">
          <h2>Welcome to the website for petsitting!</h2>
          <div>
            <button className="button1">Find a PetSitter</button>
            <button className="button1">Be a PetSitter</button>
          </div>
        </section>
      </div>

      {/* How it Works Section */}
      <section className="text-center my-5">
        <h2>How it works?</h2>

        <div className="container px-4 text-center">
          <div className="row gx-5">
            <div className="m-3 col" style={{ backgroundColor: "rgb(215, 198, 172)" }}>
              <i className="bi bi-search-heart"></i>
              <div className="p-3 h5">1. Find your perfect sitter</div>
              <p>
                Browse trusted profiles, read real reviews, and choose a pet
                sitter who fits your pet’s needs and your schedule.
              </p>
            </div>
            <div className="m-3 col" style={{ backgroundColor: "rgb(215, 198, 172)" }}>
              <i className="bi bi-calendar-check"></i>
              <div className="p-3 h5">2. Arrange a meet & greet</div>
              <p>
                Connect with the sitter to introduce your pet, ask questions, and
                make sure it’s a perfect match before booking.
              </p>
            </div>
            <div className="m-3 col" style={{ backgroundColor: "rgb(215, 198, 172)" }}>
              <i className="bi bi-pencil-square"></i>
              <div className="p-3 h5">3. Confirm & enjoy your trip</div>
              <p>
                Secure the booking, pack your bags, and relax knowing your pet is
                in safe hands while you’re away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Made with Care Section */}
      <section className="text-center my-5">
        <h2>Made with care :)</h2>
        <h5>
          Join a community of caring pet lovers. Read real reviews, share experiences, and support local animal lovers.
        </h5>
        <div className="container text-center">
          <div className="row m-3">
            <div className="col-sm-6" style={{ backgroundColor: "rgb(215, 198, 172)" }}>
              All sitters are carefully screened, reviewed, and rated by real pet parents. You can feel confident leaving
              your pet in safe hands.
            </div>
          </div>
          <div className="row m-3">
            <div className="col-sm-6 offset-2" style={{ backgroundColor: "rgb(215, 198, 172)" }}>
              Whether you need a weekend sitter, a daily walker, or vacation-long care — PetSitter offers flexible services
              tailored to your schedule.
            </div>
          </div>
          <div className="row m-3">
            <div className="col-sm-6 offset-4" style={{ backgroundColor: "rgb(215, 198, 172)" }}>
              Arrange a meeting, chat with the sitter, and confirm your booking — all in one place. It's hassle-free and
              secure.
            </div>
            <div className="row m-3">
              <div className="col-sm-6 offset-6" style={{ backgroundColor: "rgb(215, 198, 172)" }}>
                No hidden fees. See prices upfront, compare sitters, and choose what fits your budget.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="border-bottom text-center">
        <h2 style={{ display: "inline-block" }}>Until next petsitting...</h2>
        <img src="/CatG.gif" alt="CatGif" style={{ width: "300px" }} />
      </section>
    </>
}
