import os

BASE_DIR = r"C:\Users\Varun A K\Desktop\Projects\casino_games\backend"

structure = {
    "src": {
        "config": [
            "db.js",
            "env.js",
        ],
        "modules": {
            "auth": [
                "auth.routes.js",
                "auth.controller.js",
                "auth.service.js",
            ],
            "games": [
                "games.routes.js",
                "games.controller.js",
                "games.service.js",
            ],
            "favorites": [
                "favorites.routes.js",
                "favorites.controller.js",
                "favorites.service.js",
            ],
        },
        "middlewares": [
            "auth.middleware.js",
            "error.middleware.js",
        ],
        "utils": [
            "password.js",
            "jwt.js",
        ],
        "": [
            "app.js",
            "server.js",
            "routes.js",
        ],
    },
    "seed": [
        "seedGames.js",
    ],
    "": [
        "package.json",
    ],
}

def create_structure(base_path, tree):
    for folder, contents in tree.items():
        current_path = os.path.join(base_path, folder) if folder else base_path
        os.makedirs(current_path, exist_ok=True)

        if isinstance(contents, dict):
            create_structure(current_path, contents)
        else:
            for file in contents:
                file_path = os.path.join(current_path, file)
                if not os.path.exists(file_path):
                    with open(file_path, "w", encoding="utf-8"):
                        pass

if __name__ == "__main__":
    create_structure(BASE_DIR, structure)
    print("✅ Backend folder structure created successfully.")
