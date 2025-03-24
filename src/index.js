let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection"); 
  const addToyForm = document.querySelector(".add-toy-form"); 


  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys")
  .then((response)=>response.json())
  .then((toys)=>{

    console.log(toys)

    toys.forEach((toy) => {
  const toyCard = document.createElement("div");
  toyCard.className = "card";

  const toyName = document.createElement("h2");
  toyName.textContent = toy.name;
  toyCard.appendChild(toyName);

  const toyImage = document.createElement("img");
  toyImage.src = toy.image;
  toyImage.className = "toy-avatar";
  toyCard.appendChild(toyImage);

  const toyLikes = document.createElement("p");
  toyLikes.textContent = `${toy.likes} Likes`;
  toyCard.appendChild(toyLikes);

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.id = toy.id; 
  likeButton.textContent = "Like ❤️";
  likeButton.addEventListener("click", (event) => {
    event.preventDefault();
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: toy.likes + 1, 
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        toyLikes.textContent = `${updatedToy.likes} Likes`;
      })
      .catch((error) => {
        console.error("Error updating likes:", error);
      });
  });
  toyCard.appendChild(likeButton);

  toyCollection.appendChild(toyCard);
    });

  });


  addToyForm.addEventListener("submit", (event) => {
    event.preventDefault(); 

    // Get the form data
    const formData = new FormData(addToyForm);
    const name = formData.get("name");
    const image = formData.get("image");

    if (!name || !image) {
      alert("Please fill out all fields!");
      return;
    }

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((newToy) => {
      
        displayToy(newToy);
        
        addToyForm.reset();
      })
      .catch((error) => {
        console.error("Error adding new toy:", error);
      });
  });

});



