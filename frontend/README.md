# SmartMarket — Frontend (React + Vite + Tailwind)

Écrans d'accès : **inscription**, **vérification du code reçu par e-mail**, **connexion**, **profil protégé**.

## Lancer

```powershell
cd frontend
npm install
copy .env.example .env      # adresse du backend (VITE_API_URL)
npm run dev                 # http://localhost:5173
```

Le backend doit tourner sur `http://localhost:8000` (`uvicorn app.main:app --reload`)
et MongoDB doit être démarré. `CORS_ORIGINS` du backend doit contenir `http://localhost:5173`.

## Parcours

| Écran | Route | Rôle |
|---|---|---|
| Inscription | `/inscription` | Rôle acheteur/vendeur, contrôle du mot de passe, envoi du code |
| Vérification | `/verification` | Code à 6 chiffres, renvoi après 60 s, 5 essais côté serveur |
| Connexion | `/connexion` | E-mail + mot de passe (aucun code), gestion « e-mail non vérifié » |
| Profil | `/profil` | Route protégée : infos du compte, rôle, expiration de la session |

Sécurité côté écran : jeton JWT conservé et validé auprès du backend au chargement,
déconnexion automatique à l'expiration, jeton invalide supprimé, pages d'accès interdites
aux utilisateurs déjà connectés, `ProtectedRoute roles={["admin"]}` pour limiter par rôle.

## Changer les couleurs, l'image, le logo

Tout est dans **`src/config/theme.js`** :

- couleurs : modifiez les valeurs de `colors` (boutons, dégradés, fond, texte) ;
- image : copiez votre fichier dans `public/images/` puis `hero: "/images/mon-image.jpg"`
  (une image différente par écran est possible dans `images.pages`) ;
- logo : copiez le fichier dans `public/images/` puis `logoImage: "/images/logo.png"` ;
- nom et slogan : `brand.name`, `brand.tagline` ;
- domaines e-mail acceptés : `allowedEmailDomains` (identique à `ALLOWED_EMAIL_DOMAINS` du backend).

## Structure

```
src/
  config/theme.js        thème modifiable
  lib/api.js             appels au backend + messages d'erreur
  context/AuthContext.jsx  jeton, utilisateur, connexion/déconnexion
  components/            Logo, AuthLayout, Field, CodeInput, RouteGuards...
  pages/                 Register, Verify, Login, Profile
```

## Connexion avec Google

1. Console Google Cloud > Identifiants > ID client OAuth (type « Application Web »),
   origine JavaScript autorisée : `http://localhost:5173`.
2. Frontend : `VITE_GOOGLE_CLIENT_ID=<ID client>` dans `.env`, puis relancez `npm run dev`.
3. Backend : copiez `google_auth_backend.py` dans `app/`, ajoutez dans `app/main.py`
   `app.include_router(google_router)`, et mettez le **même** ID dans `GOOGLE_CLIENT_ID` du `.env` du backend.
4. Installez : `pip install httpx pyjwt motor`.
