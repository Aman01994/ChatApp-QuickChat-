graph TD


```mermaid
flowchart
%% ROUTERS
subgraph Routers
    A1[User Router]
    A2[Message Router]
end

%% CONTROLLERS
subgraph Controllers
    B1[signup]
    B2[login]
    B3[updateProfile]
    B4[checkAuth]
    B5[getUsersForSidebar]
    B6[getMessage]
    B7[markMessageAsSeen]
    B8[sendMessage]
end

%% MIDDLEWARE
C1[protectRoute]:::middleware

%% MODELS
subgraph Models
    D1[User Model]
    D2[Message Model]
end

%% UTILITIES
subgraph Utils
    F1[generateToken()]:::utility
    F2[cloudinary config]:::utility
    F3[ConnectDb()]:::utility
end

%% External Services
E1[JWT Verification]
E2[MongoDB Atlas]
E3[Cloudinary]

%% Router to Controllers
A1 -->|POST /signup| B1
A1 -->|POST /login| B2
A1 -->|PUT /update-profile| C1 --> B3
A1 -->|GET /check| C1 --> B4

A2 -->|GET /user| C1 --> B5
A2 -->|GET /:id| C1 --> B6
A2 -->|PUT /mark/:id| C1 --> B7
A2 -->|POST /send/:id| C1 --> B8

%% Controllers to Models
B1 --> D1
B2 --> D1
B3 --> D1
B4 --> D1
B5 --> D1
B5 --> D2
B6 --> D2
B7 --> D2
B8 --> D2

%% Middleware to JWT
C1 -->|jwt.verify| E1 --> D1

%% Utilities Usage
B1 --> F1
B2 --> F1
F1 --> E1

B3 --> F2
F2 --> E3

F3 --> D1
F3 --> D2
F3 --> E2

%% DB Models to DB
D1 --> E2
D2 --> E2

%% Styles
classDef middleware fill=#f9f,stroke=#333,stroke-width=2;
classDef utility fill=#cff,stroke=#333,stroke-width=2;

```