const API_URL = "http://localhost:5000/api/dvds";

document.addEventListener("DOMContentLoaded", () => {
  loadDvds();

  document.getElementById("dvdForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;

    if (title && year) {
      const newDvd = { title, year: parseInt(year) };

      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDvd),
      });

      document.getElementById("title").value = "";
      document.getElementById("year").value = "";

      loadDvds();
    }
  });
});

async function loadDvds() {
  const response = await fetch(API_URL);
  const dvds = await response.json();

  const list = document.getElementById("dvdList");
  list.innerHTML = "";

  dvds.forEach((dvd, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${dvd.title}</strong>
      <span>${dvd.year}</span>
      <div>
        <button class="edit" onclick="editDvd(${index}, '${dvd.title}', ${dvd.year})">✏️ Modifier</button>
        <button class="delete" onclick="deleteDvd(${index})">🗑️ Supprimer</button>
      </div>
    `;
    list.appendChild(li);
  });
}

async function deleteDvd(index) {
  if (confirm("Voulez-vous vraiment supprimer ce DVD ?")) {
    await fetch(`${API_URL}/${index}`, {
      method: "DELETE",
    });
    loadDvds();
  }
}

function editDvd(index, currentTitle, currentYear) {
  const newTitle = prompt("Titre:", currentTitle);
  const newYear = prompt("Année:", currentYear);

  if (newTitle && newYear) {
    const updatedDvd = { title: newTitle, year: parseInt(newYear) };

    fetch(`${API_URL}/${index}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDvd),
    }).then(() => loadDvds());
  }
}
