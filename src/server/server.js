const express = require('express');
const app = express();
const port = 5000; // Vous pouvez choisir un autre port si nécessaire
const path = require('path');

// Chemin du dossier contenant les fichiers statiques
const staticFilesPath = path.join(__dirname, '..', 'renderer', 'main_window');

// Définir le dossier pour les fichiers statiques
app.use(express.static(staticFilesPath));

// Route spécifique pour servir index.js
app.get('/main_window/index.js', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.js'));
});

// Route par défaut pour servir le fichier index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticFilesPath, 'index.html'));
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
