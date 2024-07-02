document.addEventListener("DOMContentLoaded", function () {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFZT1IWuvf-kv1QACsHkLGlK2a3lStzcXuYxHgN8dZxZ30X2yA-B4IQUKG5b8LewukJ0xOdCH2j5jK/pub?output=csv";
  let allCards = [];

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.text();
    })
    .then((data) => {
      const rows = data.split(/\r?\n/).slice(1);
      const container = document.getElementById("card-container");

      if (!container) {
        throw new Error('Container element with ID "card-container" not found');
      }

      for (let i = rows.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rows[i], rows[j]] = [rows[j], rows[i]];
      }

      rows.forEach((row, index) => {
        if (row.trim()) {
          const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
          const card = document.createElement("li");
          card.className = "collection-01__item";
          card.dataset.category = cols[3];

          card.innerHTML = `
            <div class="collection-01__item">
              <a target="_blank" href="${cols[2].replace(/"/g, "")}">
                <div class="collection-01__title-box">
                  <div class="collection-01__title-inner-box">
                    <img class="collection-01__logo" src="${cols[4].replace(
                      /"/g,
                      ""
                    )}" alt="${cols[0].replace(/"/g, "")} logo" />
                    <h3 class="collection-01__title">${cols[0].replace(
                      /"/g,
                      ""
                    )}</h3>
                  </div>
                  <div class="collection-01__rating">
                    <i class="far fa-star"></i>
                    <span class="collection-01__rating-text">${cols[1].replace(
                      /"/g,
                      ""
                    )}</span>
                  </div>
                </div>
                <div class="collection-01__text content_box">
                  <p>${cols[5].replace(/"/g, "")}</p>
                </div>
              </a>
            </div>
          `;

          allCards.push(card);
          container.appendChild(card);
        }
      });

      const tags = new Set();
      rows.forEach((row) => {
        if (row.trim()) {
          const cols = row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
          const categoryTags = cols[3].split(";").map((tag) => tag.trim());
          categoryTags.forEach((tag) => tags.add(tag));
        }
      });

      const sortedTags = Array.from(tags).sort((a, b) => a.localeCompare(b));
      const tagsContainer = document.getElementById("tag-buttons-container");

      if (!tagsContainer) {
        throw new Error('Tags container element with ID "tag-buttons-container" not found');
      }

      sortedTags.unshift("All");
      sortedTags.forEach((tag) => {
        const button = document.createElement("button");
        button.classList.add("collection-01__tag-button");
        button.textContent = tag;
        button.dataset.category = tag;
        tagsContainer.appendChild(button);
      });

      tagsContainer.addEventListener("click", function (event) {
        const tag = event.target.dataset.category;
        if (!tag) return;

        tagsContainer
          .querySelectorAll(".collection-01__tag-button")
          .forEach((button) => {
            button.classList.remove("is-selected");
          });
        event.target.classList.add("is-selected");

        allCards.forEach((card) => {
          const cardTags = card.dataset.category
            .split(";")
            .map((tag) => tag.trim());
          if (tag === "All" || cardTags.includes(tag)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });

      const searchInput = document.getElementById("search-input");
      if (!searchInput) {
        throw new Error('Search input element with ID "search-input" not found');
      }

      searchInput.addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        allCards.forEach((card) => {
          const title = card
            .querySelector(".collection-01__title")
            .textContent.toLowerCase();
          const text = card
            .querySelector(".collection-01__text")
            .textContent.toLowerCase();
          const tags = card.dataset.category.toLowerCase();

          if (
            title.includes(searchText) ||
            text.includes(searchText) ||
            tags.includes(searchText)
          ) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });

        tagsContainer
          .querySelectorAll(".collection-01__tag-button")
          .forEach((button) => {
            const tag = button.dataset.category.toLowerCase();
            if (tag.includes(searchText) || searchText === "") {
              button.style.display = "inline-block";
            } else {
              button.style.display = "none";
            }
          });
      });

      const hamburgerMenu = document.getElementById("hamburger-menu");
      if (!hamburgerMenu) {
        throw new Error('Hamburger menu element with ID "hamburger-menu" not found');
      }

      hamburgerMenu.addEventListener("click", function () {
        this.classList.toggle("open");
        document
          .getElementById("tag-buttons-container")
          .classList.toggle("open");
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});
