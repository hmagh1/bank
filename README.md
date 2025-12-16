📌 API Routes – eBank
🔐 Auth
POST   /api/auth/login
POST   /api/auth/register-client

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
