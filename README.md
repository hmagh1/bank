📌 API Routes – eBank
🔐 Auth
POST   /api/auth/login
POST   /api/auth/register-client
POST /api/auth/register-self(client)

👤 User
GET    /api/users/me
GET    /api/users/clients

🧑‍💼 Agent (ROLE_AGENT)
POST   /api/accounts/create
POST   /api/accounts/deposit
POST   /api/accounts/withdraw
POST   /api/accounts/transfer
PATCH  /api/accounts/{accountNumber}/block
PATCH  /api/accounts/{accountNumber}/unblock
PATCH  /api/accounts/{accountNumber}/close
GET    /api/accounts/{accountNumber}/operations

🧑 Client (ROLE_CLIENT)
GET    /api/dashboard
POST   /api/accounts/deposit
POST   /api/accounts/withdraw
POST   /api/accounts/transfer
GET    /api/accounts/{accountNumber}/operations

📄 Pagination (Operations)
GET    /api/accounts/{accountNumber}/operations?page={page}&size={size}
=======================================================
=======================================================
======================================================


🔐 Auth (avant tout)

React appelle :

POST /api/auth/login


➡️ reçoit un JWT
➡️ stocke le token (localStorage / memory)
➡️ ajoute le header :

Authorization: Bearer <token>


sur toutes les autres requêtes

🧑‍💼 AGENT (ROLE_AGENT)
🎯 Cas d’usage React
Écran React	Route API
Login agent	/api/auth/login
Liste clients	GET /api/users/clients
Créer client	POST /api/auth/register-client
Dépôt	POST /api/accounts/deposit
Retrait	POST /api/accounts/withdraw
Virement	POST /api/accounts/transfer
Bloquer compte	PATCH /api/accounts/{rib}/block
Débloquer compte	PATCH /api/accounts/{rib}/unblock
Clôturer compte	PATCH /api/accounts/{rib}/close
Historique	GET /api/accounts/{rib}/operations

➡️ Toutes ces routes sont appelées depuis React

🧑 CLIENT (ROLE_CLIENT)
🎯 Cas d’usage React
Écran React	Route API
Login client	/api/auth/login
Dashboard	GET /api/dashboard
Dépôt	POST /api/accounts/deposit
Retrait	POST /api/accounts/withdraw
Virement	POST /api/accounts/transfer
Historique	GET /api/accounts/{rib}/operations?page=&size=
Profil	GET /api/users/me
