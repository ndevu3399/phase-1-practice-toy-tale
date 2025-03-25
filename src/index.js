let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Toggle toy form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch all toys from the server
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach(renderToy);
      });
  }

  // Render a single toy card
  function renderToy(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Add event listener for the like button
    card.querySelector(".like-btn").addEventListener("click", () => {
      increaseLikes(toy, card);
    });

    toyCollection.appendChild(card);
  }

  // Add a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const toyData = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0,
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toyData),
    })
      .then((response) => response.json())
      .then((newToy) => {
        renderToy(newToy);
        toyForm.reset();
        toyFormContainer.style.display = "none";
        addToy = false; // Hide the form after submission
      });
  });

  // Increase likes for a toy
  function increaseLikes(toy, card) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        toy.likes = updatedToy.likes;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Load all toys when the page loads
  fetchToys();
});
