const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const DATA_FILE = path.join(__dirname, "data.json");

// Lire la liste des DVD
app.get("/api/dvds", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la lecture du fichier" });
    const dvds = JSON.parse(data);
    res.json(dvds);
  });
});

// Ajouter un DVD
app.post("/api/dvds", (req, res) => {
  const newDvd = req.body;

  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la lecture du fichier" });

    const dvds = JSON.parse(data);
    dvds.push(newDvd);

    fs.writeFile(DATA_FILE, JSON.stringify(dvds, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur lors de l'écriture du fichier" });
      res.status(201).json(newDvd);
    });
  });
});

// Supprimer un DVD
app.delete("/api/dvds/:index", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la lecture du fichier" });

    let dvds = JSON.parse(data);
    const index = parseInt(req.params.index);

    if (index < 0 || index >= dvds.length) {
      return res.status(404).json({ error: "DVD non trouvé" });
    }

    dvds.splice(index, 1);

    fs.writeFile(DATA_FILE, JSON.stringify(dvds, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur lors de la suppression" });
      res.status(204).send(); // Pas de contenu après la suppression
    });
  });
});

// Modifier un DVD
app.put("/api/dvds/:index", (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la lecture du fichier" });

    let dvds = JSON.parse(data);
    const index = parseInt(req.params.index);

    if (index < 0 || index >= dvds.length) {
      return res.status(404).json({ error: "DVD non trouvé" });
    }

    dvds[index] = req.body;

    fs.writeFile(DATA_FILE, JSON.stringify(dvds, null, 2), (err) => {
      if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour" });
      res.json(dvds[index]);
    });
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
