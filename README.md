# 📅 EventEase — Application Mobile de Gestion d'Événements

> **Projet d'évaluation React Native (Expo + TypeScript)**  
> Développé dans le cadre de la formation ForEach (Octobre 2026) — Projet individuel.

---

## 📌 Présentation du Projet

### Pour qui a été conçue l'application ?
**EventEase** a été pensée pour les **associations, clubs locaux et communautés** souhaitant faciliter la rencontre entre leurs membres. Elle s'adresse :
- **Aux membres / participants** : pour découvrir les prochains événements associatifs, s'inscrire ou se désinscrire en un clic, et consulter les détails pratiques.
- **Aux organisateurs / animateurs** : pour planifier rapidement une nouvelle rencontre, ajuster les informations d'un événement existant ou le supprimer en toute sécurité.

### Ce que fait l'application :
EventEase est une application mobile cross-platform (iOS, Android et Web) offrant une expérience fluide, chaleureuse et sécurisée pour organiser des moments de partage.

---

## ✨ Fonctionnalités Principales

### 1. 🔐 Authentification & Session Locale
- **Inscription & Connexion** : Création de compte simplifiée avec contrôle des doublons d'e-mail, normalisation (`minuscules/trim`) et validation du mot de passe (6 caractères minimum).
- **Affichage dynamique du mot de passe** : Bascule de visibilité via une icône interactive (œil).
- **Persistance de session** : Mémorisation de l'utilisateur connecté via `AsyncStorage` pour un accès direct à l'ouverture de l'application.
- **Déconnexion sécurisée** : Remplacement de la pile de navigation (`navigation.replace`) empêchant tout retour arrière intempestif.

### 2. 📋 Gestion Complète des Événements (CRUD)
- **Liste chronologique** : Les événements sont automatiquement classés du plus proche au plus lointain grâce à un tri par timestamp.
- **Création d'événement** : Formulaire guidé avec masquage intelligent du clavier (`FormContainer`) et validation stricte des champs.
- **Saisie assistée de la date** : Formatage dynamique `JJ/MM/AAAA` (insertion automatique des `/` sur pavé numérique) avec vérification de la validité du calendrier réel.
- **Modification préremplie** : Chargement asynchrone des données de l'événement avec gestion du cas limite « événement introuvable » (bouton d'enregistrement désactivé et message explicite).
- **Suppression avec modale sur-mesure** : Remplacement des alertes natives par un composant `DeleteModal` personnalisé, réutilisable et identique sur Web et Mobile.

### 3. 🤝 Participation en un Clic
- Statut interactif « Inscrit / S'inscrire » mis à jour en temps réel et conservé lors du redémarrage.

### 4. 🎨 Charte Graphique & Ergonomie
- **Identité visuelle soignée** inspirée de la maquette Figma officielle :
  - **Couleurs** : Sarcelle (`#125B50`), Corail (`#FF735C`), Sable (`#F4F1DE`), Blanc (`#FFFFFF`).
  - **Typographies** : Famille Google Fonts *Nunito* (Regular, SemiBold, Bold).
  - **Retours visuels** : Messages d'erreurs textuels explicites en rouge, sans boîtes de dialogue bloquantes.

---

## 🛠️ Choix Techniques & Architecture

| Domaine | Technologie retenue | Justification |
| :--- | :--- | :--- |
| **Framework** | **React Native avec Expo (SDK 57)** | Écosystème stable, compatible Expo Go et Web. |
| **Langage** | **TypeScript (mode strict)** | Typage fort pour sécuriser la manipulation des données (`EventItem`, `User`). |
| **Navigation** | **React Navigation (Native Stack v7)** | Navigation native fluide, entièrement typée via `RootStackParamList`. |
| **Persistance** | **AsyncStorage** | Stockage local persistant, isolé dans un dossier `storage` dédié (aucun appel direct dans les composants UI). |
| **Gestion Clavier** | **KeyboardAvoidingView + ScrollView** | Composant réutilisable `FormContainer` pour garantir la visibilité des champs sur Android et iOS. |
| **Icônes** | **@expo/vector-icons (Feather)** | Icônes vectorielles légères et modernes. |

---

## 📁 Structure du Projet

```text
EventEase/
├── assets/                  # Logos, icônes et images de l'application
│   └── images/              # Logo officiel et miniatures EventEase
├── src/
│   ├── components/          # Composants réutilisables (EventCard, DeleteModal, FormContainer)
│   ├── navigation/          # Configuration de la pile de navigation (AppNavigator)
│   ├── screens/             # Écrans de l'application (Login, Register, EventList, EventForm)
│   ├── storage/             # Services d'accès à AsyncStorage (eventStorage, userStorage)
│   ├── styles/              # Thème centralisé (theme.ts) et styles partagés (commonStyles.ts)
│   ├── types/               # Définitions TypeScript (EventItem, User)
│   └── utils/               # Fonctions utilitaires (dateUtils pour la validation et conversion ISO)
├── app.json                 # Configuration Expo (icône, splash screen, permissions)
├── App.tsx                  # Point d'entrée : chargement des polices Nunito et statut bar
└── package.json             # Dépendances et scripts du projet
```

---

## 🚀 Installation et Lancement

### Prérequis
- [Node.js](https://nodejs.org/) (version LTS recommandée)
- Smartphone Android ou iOS avec l'application **Expo Go** installée, ou un navigateur Web récent.

### 1. Cloner et installer les dépendances
Dans un terminal (PowerShell, Bash ou terminal VS Code) :

```bash
# Se placer dans le dossier du projet
cd EventEase

# Installer les dépendances du projet
npm install
```

### 2. Démarrer le serveur de développement

```bash
npx expo start
```

### 3. Tester l'application
- **Sur Téléphone (Expo Go)** :
  1. Assurez-vous que votre téléphone et votre ordinateur sont connectés au **même réseau Wi-Fi** (sans VPN).
  2. Ouvrez l'application **Expo Go** et scannez le QR code affiché dans le terminal.
- **Sur Navigateur Web** :
  - Dans le terminal Expo, appuyez simplement sur la touche **`w`** (ou lancez `npx expo start --web`).

---

## 🔍 Contrôles Qualité & Commandes Utiles

Le projet respecte les normes strictes de typage et de linting :

```bash
# Vérification du typage TypeScript (doit renvoyer 0 erreur)
npx tsc --noEmit

# Vérification du linter ESLint (doit renvoyer 0 avertissement)
npx eslint

# Diagnostic de santé des dépendances Expo
npx expo-doctor

# Vider le cache et redémarrer
npx expo start --clear
```

---

## 💡 Recommandations d'Utilisation

1. **Données de démonstration** :
   - Si la liste est vide au premier lancement, un bouton **« Charger des exemples de test »** permet de peupler instantanément 3 événements pour explorer l'interface.
2. **Saisie des dates** :
   - Utilisez le pavé numérique pour renseigner la date : les slashes `/` s'insèrent automatiquement au fur et à mesure de votre frappe.
3. **Limite assumée du prototype (mention soutenance)** :
   - L'application stocke les données localement dans `AsyncStorage` sans serveur backend distant. Les mots de passe et événements sont enregistrés sur l'appareil dans le cadre de ce prototype de démonstration.

---

## 👤 Auteur
Projet réalisé dans le cadre de l'évaluation React Native — ForEach 2026.

