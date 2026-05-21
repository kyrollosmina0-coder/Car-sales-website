const h = React.createElement;
const { useEffect, useState } = React;

const cars = [
  {
    name: "Toyota Camry",
    price: "$25,000",
    image: "https://www.thedrive.com/wp-content/uploads/2024/04/18/2025_Camry_XSE-AWD_HeavyMetalBlackRoof_003-1.jpg"
  },
  {
    name: "Honda Civic",
    price: "$22,000",
    image: "https://cdn.motor1.com/images/mgl/AkBE9P/s1/new-honda-civic-e-hev-hybrid-europe.jpg"
  },
  {
    name: "BMW 3 Series",
    price: "$40,000",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"
  }
];

const features = [
  {
    title: "Home Page",
    text: "Introduces the website with a simple welcome section and car background."
  },
  {
    title: "Cars Page",
    text: "Shows available cars with photos, prices, and a buy button."
  },
  {
    title: "Review Page",
    text: "Allows customers to add reviews and save them in the database file."
  }
];

function renderReact(id, component) {
  const element = document.getElementById(id);
  if (element) {
    ReactDOM.createRoot(element).render(component);
  }
}

function FeatureCards() {
  return h("div", { className: "row g-4" },
    features.map(function(feature) {
      return h("div", { className: "col-md-4", key: feature.title },
        h("div", { className: "card h-100 shadow-sm" },
          h("div", { className: "card-body" },
            h("h3", { className: "card-title h5 text-primary" }, feature.title),
            h("p", { className: "card-text" }, feature.text)
          )
        )
      );
    })
  );
}

function CarsGrid() {
  return h("div", { className: "row g-4" },
    cars.map(function(car) {
      return h("div", { className: "col-md-4", key: car.name },
        h("div", { className: "card car-card h-100 shadow-lg" },
          h("img", { className: "card-img-top", src: car.image, alt: car.name }),
          h("div", { className: "card-body card-info" },
            h("h3", { className: "card-title h5" }, car.name),
            h("p", { className: "card-text" }, "Price: " + car.price),
            h("button", {
              className: "btn btn-primary",
              onClick: function() { openReceipt(car.name, car.price); }
            }, "Buy Car")
          )
        )
      );
    })
  );
}

function ReviewApp() {
  const [name, setName] = useState("");
  const [car, setCar] = useState(cars[0].name);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");

  async function loadReviews() {
    const response = await fetch("/api/reviews");
    const data = await response.json();
    setReviews(data);
  }

  useEffect(function() {
    loadReviews();
  }, []);

  async function submitReview(event) {
    event.preventDefault();

    if (name.trim() === "" || comment.trim() === "") {
      setMessage("Please complete all fields.");
      return;
    }

    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, car: car, comment: comment })
    });

    setName("");
    setCar(cars[0].name);
    setComment("");
    setMessage("Review saved in db/database.json");
    loadReviews();
  }

  return h(React.Fragment, null,
    h("h2", null, "Submit a Review"),
    message && h("div", { className: "alert alert-info text-center", role: "alert" }, message),
    h("form", { className: "review-form card shadow", onSubmit: submitReview },
      h("div", { className: "card-body" },
        h("input", {
          className: "form-control mb-3",
          type: "text",
          placeholder: "Your name",
          value: name,
          onChange: function(event) { setName(event.target.value); },
          required: true
        }),
        h("select", {
          className: "form-select mb-3",
          value: car,
          onChange: function(event) { setCar(event.target.value); },
          required: true
        },
          cars.map(function(item) {
            return h("option", { key: item.name, value: item.name }, item.name);
          })
        ),
        h("textarea", {
          className: "form-control mb-3",
          placeholder: "Write your review",
          value: comment,
          onChange: function(event) { setComment(event.target.value); },
          required: true
        }),
        h("button", { className: "btn btn-primary", type: "submit" }, "Submit Review")
      )
    ),
    h("h3", null, "All Reviews"),
    h("div", { className: "reviews-list" },
      reviews.length === 0
        ? h("div", { className: "review-card card card-body" }, "No reviews yet.")
        : reviews.map(function(review, index) {
            return h("div", { className: "review-card card card-body shadow-sm", key: index },
              h("strong", null, review.name),
              h("span", null, " reviewed ", h("em", null, review.car)),
              h("p", { className: "mb-0 mt-2" }, review.comment)
            );
          })
    )
  );
}

function ProjectFooter() {
  return h("span", null, "Car Sales Website Project");
}

renderReact("featuresRoot", h(FeatureCards));
renderReact("carsRoot", h(CarsGrid));
renderReact("reviewRoot", h(ReviewApp));
renderReact("reactFooter", h(ProjectFooter));
