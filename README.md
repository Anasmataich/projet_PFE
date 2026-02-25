# GED — Plateforme Intelligente de Gestion Documentaire

**Système de Gestion Électronique des Documents** pour la Direction des Systèmes d'Information (DSI) du Ministère de l'Éducation Nationale, du Préscolaire et des Sports du Maroc.

[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green)](./backend)
[![AI Service](https://img.shields.io/badge/AI%20Service-FastAPI%20%2B%20Python-blue)](./ai-service)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61dafb)](./frontend)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2016-336791)](./database)

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [🚀 Quick Start Guide (Docker)](#2--quick-start-guide-docker)
3. [Credentials par défaut](#3-credentials-par-défaut)
4. [URLs des services](#4-urls-des-services)
5. [Architecture technique](#5-architecture-technique)
6. [Fonctionnalités principales](#6-fonctionnalités-principales)
7. [Installation manuelle (sans Docker)](#7-installation-manuelle-sans-docker)
8. [Health Check](#8-health-check)
9. [Références](#9-références)

---

## 1. Vue d'ensemble

La plateforme GED est une **solution numérique sécurisée et intelligente** de gestion documentaire conçue pour centraliser, sécuriser et exploiter les documents stratégiques du Ministère.

### Objectifs principaux

- **Centralisation** — Un dépôt unique et organisé pour les documents sensibles
- **Sécurité** — MFA, chiffrement AES-256-GCM, RBAC, traçabilité complète
- **Automatisation** — Classification IA, versioning, workflows de validation
- **Intelligence** — Recherche sémantique, OCR, résumés automatiques
- **Conformité** — Journalisation exhaustive, audit, standards cybersécurité

### Structure du projet

```
ged-platforme/
├── frontend/          # React 18 + TypeScript + Tailwind CSS (Vite)
├── backend/           # Node.js (Express) + TypeScript — API principale
├── ai-service/        # FastAPI (Python) — Microservice IA
├── database/          # PostgreSQL — Schéma, migrations, seeds
├── storage/           # Configuration MinIO / S3
├── security/          # CORS, CSP, SSL
├── infrastructure/    # Nginx, Kubernetes, scripts
└── docs/              # Documentation technique, API spec, UML
```

---

## 2. 🚀 Quick Start Guide (Docker)

La méthode la plus rapide pour démarrer l'ensemble de la plateforme est d'utiliser Docker Compose.

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24.x
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2.x (inclus dans Docker Desktop)
- Minimum 4 Go de RAM alloués à Docker (8 Go recommandés pour le service IA)

### Étape 1 — Cloner le dépôt

```bash
git clone <repo-url>
cd ged-platforme
```

### Étape 2 — Configurer les variables d'environnement

```bash
cp .env.example .env
```

Le fichier `.env.example` contient des valeurs par défaut pour un **run local** (PostgreSQL, Redis, MinIO, JWT, chiffrement). Vous pouvez lancer avec `cp .env.example .env` sans modification.

Pour la **production**, remplacez par des secrets générés :

```bash
# Générer JWT_ACCESS_SECRET (64 octets hex)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Générer JWT_REFRESH_SECRET (différent du précédent)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Générer ENCRYPTION_KEY (32 octets hex)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Étape 3 — Construire et démarrer tous les services

```bash
# Développement (avec hot-reload pour backend et frontend)
docker compose up --build

# Ou en arrière-plan
docker compose up --build -d
```

> Le premier démarrage peut prendre **5 à 15 minutes** (téléchargement des images, compilation TypeScript, téléchargement des modèles IA).

### Étape 4 — Vérifier que tout est opérationnel

```bash
docker compose ps
```

Tous les services doivent être à l'état `healthy` ou `running` :

```
NAME              STATUS
ged-postgres      healthy
ged-redis         healthy
ged-minio         healthy
ged-minio-init    exited (0)   ← normal, tâche ponctuelle
ged-backend       healthy
ged-ai-service    healthy
ged-frontend      running
ged-mailhog       running
```

### Démarrage production (avec Nginx + SSL)

```bash
# Placer les certificats SSL dans security/ssl/
# (fullchain.pem et privkey.pem)
docker compose -f docker-compose.prod.yml up --build -d
```

### Arrêter les services

```bash
docker compose down              # Arrêter les conteneurs
docker compose down -v           # Arrêter + supprimer les volumes (reset complet)
```

---

## 3. Credentials par défaut

> ⚠️ **Changez impérativement ces credentials en production.**

### Compte administrateur (Plateforme GED)

| Champ     | Valeur              |
|-----------|---------------------|
| Email     | `admin@ged.gov.ma`  |
| Mot de passe | `Admin@GED2024` |
| Rôle      | `ADMIN`             |

> Le hash bcrypt de ce mot de passe est pré-calculé dans `database/seeds/seed_admin.sql`. Pour le changer, régénérez le hash : `node -e "const b=require('bcryptjs');b.hash('NouveauMotDePasse',12).then(console.log)"`

### Base de données PostgreSQL

| Champ     | Valeur (défaut .env.example)          |
|-----------|---------------------------------------|
| Host      | `localhost:5432` (exposé par Docker)  |
| Database  | `ged_db`                              |
| User      | `ged_user`                            |
| Password  | `POSTGRES_PASSWORD` dans `.env`       |

### MinIO (stockage objet)

| Champ           | Valeur (défaut .env.example) |
|-----------------|-------------------------------|
| Root User       | `minioadmin`                  |
| Root Password   | `minioadmin123` (≥ 8 caractères requis) |
| Bucket          | `ged-documents`               |

### Redis

| Champ     | Valeur                            |
|-----------|-----------------------------------|
| Host      | `localhost:6379`                  |
| Password  | `REDIS_PASSWORD` dans `.env`      |

### MailHog (capture d'emails en développement)

| Champ     | Valeur                    |
|-----------|---------------------------|
| SMTP      | `localhost:1025`          |
| Web UI    | `http://localhost:8025`   |
| Auth      | Aucune (dev uniquement)   |

---

## 4. URLs des services

### Environnement de développement (docker compose up)

| Service              | URL                                  | Description                        |
|----------------------|--------------------------------------|------------------------------------|
| **Frontend**         | http://localhost:3000                | Interface React (Vite dev server)  |
| **Backend API**      | http://localhost:5000/api/v1         | API REST principale                |
| **Backend Health**   | http://localhost:5000/health         | Health check du backend            |
| **AI Service**       | http://localhost:8000                | Microservice FastAPI (Python)      |
| **AI Docs (Swagger)**| http://localhost:8000/docs           | Documentation interactive de l'API IA |
| **AI ReDoc**         | http://localhost:8000/redoc          | Documentation alternative          |
| **MinIO Console**    | http://localhost:9001                | Interface web MinIO                |
| **MinIO API**        | http://localhost:9000                | API S3-compatible                  |
| **MailHog**          | http://localhost:8025                | Capture des emails (SMTP)          |

### Environnement de production (docker-compose.prod.yml)

| Service              | URL                     | Description                     |
|----------------------|-------------------------|---------------------------------|
| **Frontend + API**   | https://\<votre-domaine\> | Via Nginx (reverse proxy + SSL) |
| **MinIO Console**    | Accès direct désactivé  | Accès via proxy uniquement      |

---

## 5. Architecture technique

| Couche              | Technologies                                            |
|---------------------|---------------------------------------------------------|
| **Frontend**        | React 18, TypeScript, Tailwind CSS, Vite 5, Zustand     |
| **Backend**         | Node.js 20, Express, TypeScript, JWT, Multer            |
| **IA**              | FastAPI (Python 3.11), HuggingFace Transformers, spaCy, Tesseract OCR |
| **Base de données** | PostgreSQL 16 (pool de connexions, transactions)        |
| **Cache / sessions**| Redis 7 (blacklist tokens, rate limiting)               |
| **Stockage**        | MinIO / Amazon S3 (AWS SDK v3)                          |
| **Auth**            | JWT (access + refresh), bcryptjs, speakeasy (TOTP/MFA)  |
| **Proxy**           | Nginx 1.25 (SSL/TLS, rate limiting, SPA routing)        |

### Modules backend (`backend/src/`)

```
src/
├── app.ts, server.ts       # Entrée Express + démarrage gracieux
├── config/                 # database, redis, storage, jwt, env
├── modules/
│   ├── auth/               # Authentification JWT + MFA (TOTP)
│   ├── users/              # CRUD utilisateurs, gestion des rôles
│   ├── documents/          # Upload, métadonnées, versioning
│   ├── workflow/           # Validation hiérarchique des documents
│   ├── audit/              # Journalisation des actions
│   ├── notifications/      # Notifications in-app et email
│   └── permissions/        # RBAC : rôles, permissions, middleware
├── middlewares/            # authenticate, authorize, errorHandler, sanitize
├── shared/                 # ApiResponse, AppError, enums
└── utils/                  # encryption, logger, fileUtils
```

### RBAC — Rôles et accès

| Rôle          | Upload | Approuver | Admin | IA Tools |
|---------------|--------|-----------|-------|----------|
| `ADMIN`       | ✓      | ✓         | ✓     | ✓        |
| `CADRE`       | ✓      | ✓         | ✗     | ✓        |
| `INSPECTEUR`  | ✓      | ✓         | ✗     | ✓        |
| `RH`          | ✓      | ✗         | ✗     | ✓        |
| `COMPTABLE`   | ✓      | ✗         | ✗     | ✓        |
| `CONSULTANT`  | ✗      | ✗         | ✗     | ✓        |

---

## 6. Fonctionnalités principales

### Authentification & Sécurité

- **JWT** — Access tokens (15 min) + Refresh tokens (7 jours, rotation sécurisée)
- **MFA (TOTP)** — Authentification à deux facteurs via Google Authenticator / Authy
- **Redis** — Blacklist des tokens révoqués lors du logout
- **Rate limiting** — Protection brute-force (5 req/min sur `/auth/login`)
- **Chiffrement** — AES-256-GCM pour les fichiers sensibles

### Gestion documentaire

- Upload sécurisé avec validation MIME et limite 50 Mo
- Versioning automatique avec historique complet
- Niveaux de confidentialité : `PUBLIC`, `INTERNE`, `CONFIDENTIEL`, `SECRET`
- Stockage chiffré dans MinIO avec URLs signées (expirables)

### Workflow de validation

- Soumission → Validation N1 → Validation N2 → Approbation → Publication
- Traçabilité complète avec raisons de rejet
- Notifications email et in-app automatiques

### Microservice IA

- **Classification** automatique des documents (décision, circulaire, rapport…)
- **Extraction NER** — Entités nommées (personnes, organisations, dates, montants)
- **Résumé automatique** — Résumés abstractifs en français
- **OCR** — Extraction de texte depuis PDF/images (Tesseract)
- **Recherche sémantique** — Embeddings multilingues (sentence-transformers)

---

## 7. Installation manuelle (sans Docker)

### Prérequis locaux

- Node.js 20+, npm
- Python 3.11+, pip
- PostgreSQL 16+
- Redis 7+
- MinIO (ou compte AWS S3)
- Tesseract OCR (`apt install tesseract-ocr tesseract-ocr-fra`)

### Backend

```bash
cd backend
npm install
cp ../.env.example ../.env   # puis configurer .env
npm run dev                   # Démarre sur http://localhost:5000
```

### AI Service

```bash
cd ai-service
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download fr_core_news_md
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
# Créer frontend/.env avec VITE_API_URL=http://localhost:5000/api/v1
npm run dev                   # Démarre sur http://localhost:3000
```

### Base de données

```bash
psql -U postgres -c "CREATE USER ged_user WITH PASSWORD 'votre_mot_de_passe';"
psql -U postgres -c "CREATE DATABASE ged_db OWNER ged_user;"
psql -U ged_user -d ged_db -f database/schema.sql
psql -U ged_user -d ged_db -f database/seeds/seed_roles.sql
psql -U ged_user -d ged_db -f database/seeds/seed_admin.sql
psql -U ged_user -d ged_db -f database/seeds/seed_categories.sql
```

---

## 8. Health Check

### Vérification rapide (tous les services)

```bash
# Depuis la racine du projet (Linux/Mac)
bash scripts/health-check.sh

# Depuis la racine du projet (Windows PowerShell)
.\scripts\health-check.ps1
```

### Vérification manuelle service par service

```bash
# Backend
curl http://localhost:5000/health

# AI Service
curl http://localhost:8000/health

# Frontend
curl -I http://localhost:3000

# PostgreSQL (depuis Docker)
docker exec ged-postgres pg_isready -U ged_user -d ged_db

# Redis (depuis Docker)
docker exec ged-redis redis-cli -a "$REDIS_PASSWORD" ping

# MinIO
curl http://localhost:9000/minio/health/live
```

### Logs des conteneurs

```bash
# Suivre les logs d'un service en temps réel
docker compose logs -f backend
docker compose logs -f ai-service
docker compose logs -f frontend

# Tous les services
docker compose logs -f
```

---

## 9. Références

- **Architecture détaillée** : [`docs/architecture.md`](docs/architecture.md)
- **Spécification API** : [`docs/api-spec.yaml`](docs/api-spec.yaml)
- **Schéma BDD** : [`database/schema.sql`](database/schema.sql)
- **Documentation IA** : [`ai-service/README.md`](ai-service/README.md)
- **Documentation Sécurité** : [`security/README.md`](security/README.md)
- **Diagrammes UML** : [`docs/uml/`](docs/uml/)
- **Guide de déploiement** : [`docs/deployment-guide.md`](docs/deployment-guide.md)
