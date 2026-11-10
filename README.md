# catch_me

Un mini-jeu minimaliste en HTML, CSS et JavaScript (canvas), sans aucune dépendance.

Tu déplaces ton curseur avec la souris. Chaque fois que quelques secondes passent, un fantôme apparaît et rejoue exactement le trajet que tu as fait au début de la partie, avec du retard. Plus tu survis, plus il y a de fantômes à l'écran, et tous suivent des chemins que tu as toi-même dessinés. Le seul adversaire, c'est ton propre passé.

## Principe du jeu

- L'image contrôlé par la souris est ton curseur actuel.
- Les cercles colorés sont des fantômes : chacun rejoue ta position d'il y a un certain nombre de secondes.
- Un nouveau fantôme apparaît à intervalle régulier.
- Un fantôme est inoffensif et semi-transparent pendant sa première seconde, pour te laisser le temps de t'écarter.
- Tu perds si ton curseur touche un fantôme.
- Ton score est le nombre de secondes survécues. Le meilleur score est conservé tant que la page reste ouverte.

Conseil : rester immobile est la pire stratégie, car le fantôme qui rejoue ta position d'il y a quelques secondes finira par arriver sur toi. Il faut occuper tout l'écran et varier ses trajectoires.

## Commandes

- Déplacer la souris : contrôler le curseur.
- Cliquer : démarrer une partie, ou en relancer une après une défaite. Le clic n'a aucun effet pendant la partie.

## Installation

Aucune installation n'est nécessaire : il n'y a ni module, ni requête réseau, ni serveur à lancer.

1. Récupérer le projet (téléchargement du dossier, ou clonage si le projet est sur un dépôt Git).
2. Vérifier que l'arborescence ressemble à ceci :

```
echo/
├── index.html
├── style.css
├── script.js
└── Images/
    ├── player.png
    └── background.jpeg
```

3. Ouvrir `index.html` dans un navigateur récent (Firefox, Chrome, Edge, etc.).

Les noms de fichiers et de dossiers sont sensibles à la casse sous Linux : `Images/` n'est pas la même chose que `images/`.

## Images optionnelles

Le jeu fonctionne même sans les images :

- Si `player.png` est introuvable, le joueur est affiché sous forme de cercle gris.
- Si `background.jpeg` est introuvable, le fond prend la couleur définie dans `style.css`.

Pour utiliser tes propres images, remplace simplement ces deux fichiers en gardant les mêmes noms, ou modifie les chemins dans `script.js`. Un PNG à fond transparent donne le meilleur résultat pour le joueur.

## Personnalisation

Les réglages se trouvent en haut de `script.js` :

| Variable | Rôle |
|---|---|
| `ghost_spawn_delay` | Délai entre deux apparitions de fantômes, en images (120 images, soit 2 secondes à 60 images par seconde). Plus petit, plus difficile. |
| `loading_ghost` | Durée pendant laquelle un fantôme est inoffensif après son apparition, en images (60 images, soit 1 seconde). |
| `player_size` | Taille de l'image du joueur, en pixels. |
| `player_radius` | Rayon de collision du joueur. |
| `ghost_radius` | Rayon des fantômes, en pixels. |

Les couleurs (fond, texte, fantômes) sont définies par des variables CSS dans `style.css` : `--bg`, `--fg` et `--ghostColor`. Le jeu gère automatiquement le thème clair et le thème sombre du navigateur.

## Fonctionnement technique

À chaque image (environ 60 fois par seconde), la position de la souris est ajoutée à un tableau. Le fantôme numéro `k` affiche la position enregistrée il y a `(k + 1) * ghost_spawn_delay` images. La collision est testée par la distance entre les deux centres : si elle est inférieure à la somme des rayons, la partie est perdue.

Le projet tient en trois fichiers :

- `index.html` : la structure de la page et le canvas.
- `style.css` : l'affichage plein écran et les couleurs.
- `script.js` : l'enregistrement des positions, les fantômes, les collisions et l'affichage.