# DepenseEasy — Intelligent Personal Finance Platform

## 1. Project Description

DepenseEasy est une plateforme SaaS fintech intelligente permettant et aider aux utilisateurs de gérer leurs finances personnelles via un tableau de bord avancé, des outils IA (assistant, OCR, prévisions, détection d'anomalies), et des modules de gestion complète (budgets, objectifs, abonnements, calendrier financier).

Ce projet est développé dans le cadre d’un projet académique.

L’application propose :

Une interface utilisateur moderne
Une gestion complète des finances personnelles
Des fonctionnalités intelligentes basées sur l’IA.


Objectifs
-Automatiser la gestion financière personnelle
-Centraliser toutes les données financières
-Aider à la prise de décision grâce à l’IA
-Détecter les anomalies et dépenses inutiles
-Offrir une interface simple, intuitive et moderne


 Équipe
-Robleh Houssein Robleh
-Ziad Hassan Houssein 
-Abdirahim MOHAMED ABDI
-Abdifatah elmi

Encadré par : Dr. Moubarik Barre Hassan

**3 espaces distincts :**
- Landing page marketing 
- Espace utilisateur (tableau de bord + modules financiers complets)
- Panneau administrateur (KPIs globaux agrégés, gestion système — sans accès aux données privées)

---

## 2. Page Structure

### Public
- `/` — Landing page (✅ créée)
- `/login` — Connexion / Inscription (Phase 1)
- `/contact` — Contact
- `/securite` — Sécurité
- `/apropos` — À propos

### Espace Utilisateur (`/app/*`)
- `/app/dashboard` — Dashboard principal
- `/app/revenus` — Gestion des revenus
- `/app/depenses` — Gestion des dépenses
- `/app/comptes` — Comptes financiers
- `/app/budgets` — Budgets par catégorie
- `/app/historique` — Historique & recherche avancée
- `/app/ia` — Assistant IA Financier (chat)
- `/app/ocr` — Scan de reçus OCR
- `/app/previsions` — Prévisions cashflow
- `/app/abonnements` — Suivi abonnements & charges récurrentes
- `/app/objectifs` — Objectifs d'épargne
- `/app/sante` — Score de santé financière
- `/app/calendrier` — Calendrier financier
- `/app/categories` — Catégories personnalisables
- `/app/parametres` — Paramètres du compte

### Espace Admin (`/admin/*`)
- `/admin/dashboard` — Dashboard admin (KPIs agrégés)
- `/admin/utilisateurs` — Gestion utilisateurs
- `/admin/roles` — Rôles & permissions (RBAC)
- `/admin/abonnements` — Plans & revenus
- `/admin/statistiques` — Statistiques globales
- `/admin/securite` — Connexions, IP, sessions, incidents
- `/admin/logs` — Logs système filtrables & exportables
- `/admin/sauvegardes` — Backups & restauration
- `/admin/ia-ocr` — Métriques IA & OCR
- `/admin/conformite` — Audit logs & traçabilité
- `/admin/sante` — Uptime, latence, performance
- `/admin/qualite` — Qualité des données
- `/admin/adoption` — Adoption produit & rétention

---

## 3. Core Features

### Espace Utilisateur
- [ ] Auth (connexion / inscription / mot de passe oublié)
- [ ] Dashboard KPI (revenus, dépenses, solde, épargne)
- [ ] CRUD Revenus
- [ ] CRUD Dépenses + filtres avancés
- [ ] Comptes financiers (courant, épargne, investissement)
- [ ] Catégories personnalisables
- [ ] Budgets globaux et par catégorie (suivi temps réel)
- [ ] Historique avec recherche multi-critères
- [ ] Assistant IA (chat financier)
- [ ] Scan OCR reçus (extraction + validation)
- [ ] Prévisions cashflow 7/30 jours
- [ ] Détection anomalies & fuites financières
- [ ] Suivi abonnements & alertes prélèvement
- [ ] Objectifs d'épargne avec progression
- [ ] Score santé financière /100
- [ ] Calendrier financier
- [ ] Finances partagées
- [ ] Règles automatiques
- [ ] Défis d'épargne
- [ ] Dettes & remboursements

### Espace Admin (données agrégées uniquement — pas de données privées)
- [ ] Dashboard KPIs globaux (nb users, transactions agrégées, MRR)
- [ ] Gestion utilisateurs (statut, plan, ban)
- [ ] RBAC (rôles, matrice permissions)
- [ ] Suivi abonnements & revenus
- [ ] Statistiques globales (croissance, engagement, adoption)
- [ ] Sécurité (logs connexion, IP, sessions, incidents)
- [ ] Logs système (filtrables, exportables)
- [ ] Sauvegardes & restauration
- [ ] Métriques IA/OCR (précision, volume, erreurs)
- [ ] Conformité & audit logs
- [ ] Santé plateforme (uptime, latence, services)
- [ ] Qualité des données (taux catégorisation, doublons)
- [ ] Adoption produit (usage features, rétention)

---

 Technologies utilisées
Frontend : HTML, CSS, JavaScript
Backend : Node.js
Base de données : PostgreSQL
Outils : Supabase (mock), OCR simulation, IA simulation

---

## 6. Development Phase Plan

### Phase 1: Auth — Page Connexion/Inscription ✅ En cours
- Goal: Créer la page login/register avec image à gauche, formulaire à droite
- Deliverable: `/login` fonctionnel (mock auth)

### Phase 2: Layout Espace Utilisateur
- Goal: Sidebar + Topbar responsive de l'espace /app
- Deliverable: Shell de navigation prêt avec routing

### Phase 3: Dashboard Utilisateur
- Goal: KPI cards + graphiques revenus/dépenses + insights IA
- Deliverable: `/app/dashboard` avec données mock réalistes

### Phase 4: Core Finance
- Goal: CRUD Revenus, Dépenses, Comptes, Catégories, Budgets
- Deliverable: 5 modules fonctionnels avec formulaires et listes

### Phase 5: Historique & Modules Avancés
- Goal: Historique, assistant IA chat, OCR mock, prévisions, abonnements, objectifs, score santé
- Deliverable: Modules avancés complets

### Phase 6: Layout Admin
- Goal: Sidebar admin + Topbar + routing sécurisé
- Deliverable: Shell admin prêt

### Phase 7: Modules Admin Complets
- Goal: Dashboard, users, logs, sécurité, métriques, conformité
- Deliverable: Admin panel complet (données agrégées uniquement)

Installation
Cloner le projet :
git clone https://github.com/ton-username/depenseeasy.git
Installer les dépendances
Configurer la base de données PostgreSQL
Lancer le projet :
npm start
Accéder à l’application :
http://localhost:3000

🧪 Tests

Tests réalisés :

Tests unitaires
Tests fonctionnels
Tests d’intégration

Résultat : ✔️ Application fonctionnelle avec données mock

⚠️ Limites
Données simulées (pas de backend réel connecté)
OCR simulé (pas de vrai traitement)
IA basée sur réponses mock
Pas de paiement ou intégration bancaire réelle
🔮 Améliorations futures
Intégration backend réel (API + base de données PostgreSQL)
Connexion à des services bancaires
IA avancée (prédictions réelles)
OCR réel avec reconnaissance automatique
Notifications (email / mobile)
Déploiement cloud
Application mobile
📄 Licence

Projet académique

🙏 Remerciements

Merci à l’encadrant pour son accompagnement et ses conseils.
