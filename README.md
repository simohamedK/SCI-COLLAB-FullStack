
# 🔬 Sci-Collab : Réseau Social Scientifique

> **Projet - Master 2 Technologies de l'Hypermédia (THYP)**
> **Université Paris 8**

**Sci-Collab** est une plateforme collaborative conçue pour aider les chercheurs à résoudre leurs blocages techniques. Contrairement aux réseaux classiques (LinkedIn, ResearchGate) axés sur la publication de résultats finis, Sci-Collab se concentre sur la **résolution de problèmes en temps réel** grâce à un algorithme de matching de compétences.

---

## 🚀 Fonctionnalités Clés

### 🧠 Intelligence & Matching
* **Algorithme de Recommandation :** Mise en relation automatique entre un problème posté et les experts possédant les compétences requises (Comparaison Tags du post vs Skills du profil).
* **Fil d'Actualité Hybride :**
    * 🕒 **Vue "Récents" :** Tous les posts de la communauté triés chronologiquement.
    * 🎯 **Vue "Recommandés" :** Un flux personnalisé filtré par l'algorithme de matching.

### 🤝 Social & Collaboration
* **Système d'Amis :** Gestion complète du réseau (Envoyer demande, Accepter, Refuser, Liste d'amis).
* **Messagerie Instantanée :** Chat privé en temps réel entre utilisateurs connectés (Amis).
* **Entraide Communautaire :**
    * **Commentaires :** Discussions publiques sous les problèmes.
    * **Votes (Like/Dislike) :** Système d'évaluation des solutions avec gestion du changement d'avis.
* **Cycle de Vie du Problème :** Possibilité pour l'auteur de marquer un problème comme **"Résolu" ✅** (feedback visuel immédiat).

### 🛡️ Sécurité & Profil
* **Authentification Forte :** Utilisation de JWT (JSON Web Tokens) et hachage des mots de passe avec Bcrypt.
* **Profils Enrichis :** Gestion de l'identité (Bio, Institution) et des compétences techniques (Hard Skills).

---

## 🛠️ Stack Technique

Le projet repose sur une architecture **N-Tiers** stricte séparant le client et le serveur :

| Composant | Technologie | Détails |
| :--- | :--- | :--- |
| **Frontend** | ![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white) | **Angular 17**, Bootstrap 5, RxJS (Observables) |
| **Backend** | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) | **Node.js**, TypeScript, Architecture Modulaire |
| **Base de Données** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | **MySQL 8.0**, Relations Complexes (N:N, Polymorphic, Self-Join) |
| **ORM** | ![TypeORM](https://img.shields.io/badge/TypeORM-FE0C05?style=flat-square&logo=typeorm&logoColor=white) | Gestion des entités, synchronisation et QueryBuilder |

---

## ⚙️ Installation et Démarrage

Suivez ces étapes pour lancer le projet localement.

### Prérequis
* Node.js (v16+)
* MySQL Server (local ou distant)
* Git

### 1. Clonage du projet
```bash
git clone https://github.com/simohamedK/SCI-COLLAB-FullStack.git
cd SCI-COLLAB-FullStack

```

### 2. Configuration de la Base de Données

Créez une base de données vide dans votre outil MySQL (phpMyAdmin, Workbench, DBeaver) nommée `sci_collab_db`.

### 3. Installation et Lancement du Backend

```bash
cd backend

# Installation des dépendances
npm install

# Configuration BDD
# (Vérifiez le fichier src/app.module.ts pour vos identifiants root/password)

# Lancement du serveur (Mode développement)
npm run start:dev

```

> Le serveur backend démarrera sur `http://localhost:3000`.
> *Note : Au premier lancement, TypeORM créera automatiquement toutes les tables.*

### 4. Installation et Lancement du Frontend

Ouvrez un **nouveau terminal** à la racine du projet :

```bash
cd frontend

# Installation des dépendances
npm install

# Lancement de l'application
ng serve

```

> L'application sera accessible sur `http://localhost:4200`.

---

## 🗄️ Structure de la Base de Données

Le projet gère des relations complexes pour supporter les fonctionnalités sociales :

* **`users`** : Comptes chercheurs.
* **`skills`** : Référentiel de compétences (Lié via `user_skills` et `post_skills`).
* **`posts`** : Problèmes scientifiques.
* **`comments`** : Réponses aux problèmes.
* **`votes`** : Table gérant les Likes/Dislikes (Relation polymorphique vers Post ou Comment).
* **`friendships`** : Table d'auto-jointure sur `users` pour gérer le graphe social.
* **`messages`** : Historique des conversations privées.

---

## 👤 Auteur

**Mohamed KAMLI**

* Master 2 Informatique - THYP
* Université Paris 8
* Année Universitaire 2024-2025

---

*Ce projet a été réalisé dans un cadre académique.*

