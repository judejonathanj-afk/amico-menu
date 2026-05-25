# Amico — Menu QR & SaaS

Application SaaS pour le restaurant **Amico** : menu visible via QR code sur table, espace admin protégé par mot de passe, mises à jour en temps réel.

## Fonctionnalités

- **Menu public** (`/menu/amico`) — optimisé mobile, rafraîchi toutes les 3 secondes
- **Espace admin** (`/admin`) — modifier plats, prix, visibilité, ajouter/supprimer
- **Plats du jour** — section dédiée en tête du menu client
- **QR code** (`/admin/qr`) — téléchargement PNG pour impression sur tables

## Démarrage rapide

```bash
cd amico-saas
npm install
npm run db:setup
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Identifiants Amico (démo)

| Champ | Valeur |
|-------|--------|
| Identifiant | `amico` |
| Mot de passe | `Amico2026!` |

**Changez le mot de passe en production** (voir ci-dessous).

## URLs

| Page | URL |
|------|-----|
| Accueil | `/` |
| Menu client (QR) | `/menu/amico` |
| Connexion admin | `/admin/login` |
| Tableau de bord | `/admin` |
| QR code à imprimer | `/admin/qr` |

## QR code scannable par les clients

Le QR code **ne doit pas** pointer vers `localhost` (invisible depuis un téléphone client).

### Test sur le Wi‑Fi du restaurant (développement)

1. Lancez `npm run dev` (écoute sur tout le réseau : `0.0.0.0`)
2. Allez dans **Admin → QR Code** : l’URL affichée sera du type `http://192.168.x.x:3000/menu/amico`
3. Les téléphones des clients doivent être sur le **même Wi‑Fi** que l’ordinateur serveur

### Production (tous les téléphones, partout)

1. Déployez l’application (Vercel, Railway, VPS…)
2. Ajoutez dans `.env` :
   ```
   NEXT_PUBLIC_MENU_URL=https://votre-domaine.com
   ```
3. Régénérez le QR dans **Admin → QR Code**, ou collez l’URL dans le champ « URL personnalisée » puis **Appliquer**

## Déploiement (un serveur)

1. Héberger sur [Vercel](https://vercel.com), Railway, ou un VPS Node.js
2. Définir les variables d'environnement :
   - `DATABASE_URL` — pour la production, préférez PostgreSQL : `postgresql://...`
   - `AUTH_SECRET` — chaîne aléatoire longue (32+ caractères)
   - `NEXT_PUBLIC_MENU_URL` — URL publique HTTPS (ex. `https://amico-menu.vercel.app`)
3. `npm run db:setup` puis `npm run build && npm start`
4. Dans **Admin → QR Code**, téléchargez le PNG et imprimez-le pour les tables

## Changer le mot de passe

```bash
npx tsx -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
bcrypt.hash('VotreNouveauMotDePasse', 12).then(h =>
  p.restaurant.update({ where: { slug: 'amico' }, data: { passwordHash: h } })
    .then(() => { console.log('OK'); p.\$disconnect(); })
);
"
```

## Architecture SaaS

Chaque restaurant = un compte (`slug` + mot de passe hashé). Le modèle actuel est configuré pour **Amico** ; pour ajouter d'autres clients, dupliquez l'entrée `Restaurant` avec un nouveau `slug` et menu associé.
