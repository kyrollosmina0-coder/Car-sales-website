let selectedBuyer = "";
let selectedCar = "";
let selectedPrice = "";

function openReceipt(carName, carPrice) {
  const buyerInput = document.getElementById("buyerName");
  const buyerName = buyerInput.value.trim();

  if (buyerName === "") {
    alert("Please write the buyer name first.");
    return;
  }

  selectedBuyer = buyerName;
  selectedCar = carName;
  selectedPrice = carPrice;

  document.getElementById("receiptBuyer").textContent = selectedBuyer;
  document.getElementById("receiptCar").textContent = selectedCar;
  document.getElementById("receiptPrice").textContent = selectedPrice;
  document.getElementById("receiptBox").style.display = "flex";
}

async function savePurchase(paymentStatus) {
  const purchase = {
    buyer: selectedBuyer,
    car: selectedCar,
    price: selectedPrice,
    payment: paymentStatus
  };

  await fetch("/api/purchases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(purchase)
  });

  document.getElementById("receiptBox").style.display = "none";
  document.getElementById("buyerName").value = "";
  alert("Purchase saved in db/database.json");
}

async function saveReview(event) {
  event.preventDefault();

  const review = {
    name: document.getElementById("reviewName").value,
    car: document.getElementById("reviewCar").value,
    comment: document.getElementById("reviewText").value
  };

  await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review)
  });

  document.querySelector(".review-form").reset();
  showReviews();
}

async function showReviews() {
  const reviewsList = document.getElementById("reviewsList");

  if (!reviewsList) {
    return;
  }

  const response = await fetch("/api/reviews");
  const reviews = await response.json();

  if (reviews.length === 0) {
    reviewsList.innerHTML = "<div class='review-card'>No reviews yet.</div>";
    return;
  }

  reviewsList.innerHTML = "";

  reviews.forEach(function(review) {
    reviewsList.innerHTML += `
      <div class="review-card">
        <strong>${review.name}</strong> reviewed <em>${review.car}</em>
        <p>${review.comment}</p>
      </div>
    `;
  });
}

showReviews();
