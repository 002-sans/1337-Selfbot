# 1337 Project - Discord Selfbot Manager

## 📋 Description

Système de gestion de selfbots Discord avec un bot manager central. Ce projet permet de gérer plusieurs comptes Discord selfbot avec un système d'abonnement, de codes d'activation et de fonctionnalités avancées.

## ⚠️ Avertissement

L'utilisation de selfbots est contraire aux conditions d'utilisation de Discord et peut entraîner la suspension de votre compte. Ce projet est fourni à des fins éducatives uniquement.

## 🚀 Fonctionnalités

### Bot Manager
- Gestion centralisée des selfbots
- Système d'abonnement avec expiration
- Génération et validation de codes d'activation
- Whitelist et rôles staff
- Logs centralisés
- Chiffrement des tokens

### Selfbots
- Commandes personnalisées
- Gestion d'événements Discord
- Support multi-comptes
- Système de backup

## 📦 Installation

1. Cloner le repository
```bash
git clone https://github.com/002-sans/1337-selfbot
cd 1337-selfbot
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer le fichier `config.json`
```json
{
  "manager": "TOKEN_DU_BOT_MANAGER",
  "premium": false,
  "logo": "URL_DU_LOGO",
  "support": "LIEN_DISCORD_SUPPORT",
  "logChannel": "ID_CHANNEL_LOGS",
  "guild_id": "ID_SERVEUR_DISCORD",
  "staff_role": "ID_ROLE_STAFF",
  "whitelist_role": "ID_ROLE_WHITELIST",
  "owners": ["ID_PROPRIETAIRE"],
  "tokens": []
}
```

4. Lancer le bot
```bash
node index.js
```

## 📁 Structure du Projet

```
.
├── src/
│   ├── Manager/          # Bot manager principal
│   │   ├── commands/     # Commandes du manager
│   │   ├── events/       # Événements du manager
│   │   ├── buyers.json   # Base de données des acheteurs
│   │   └── codes.json    # Codes d'activation
│   ├── Selfbot/          # Selfbots clients
│   │   ├── commands/     # Commandes des selfbots
│   │   └── events/       # Événements des selfbots
│   └── structures/       # Classes et structures
├── utils/
│   ├── backups/          # Sauvegardes
│   └── db/               # Base de données
├── config.json           # Configuration principale
├── codes.json            # Codes d'activation
└── index.js              # Point d'entrée
```

## 🔐 Sécurité

- Les tokens sont chiffrés avec AES-256-CBC
- Système de whitelist pour contrôler l'accès
- Gestion des permissions par rôles
- Logs des actions importantes

## 🛠️ Technologies Utilisées

- **discord.js** (v14) - Bot manager
- **discord.js-selfbot-v13** - Selfbots
- **discord.js-backup-v13** - Système de backup
- **node-cron** - Tâches planifiées
- **speakeasy** - Authentification 2FA
- **canvas** - Génération d'images
- **archiver** - Compression de fichiers

## 📝 TODO

### Système de Stalk (En développement)
- `spy add` - Ajouter un espion avec WebSocket
- `spy list` - Lister les espions actifs
- `spy del` - Supprimer un espion
- `spy target` - Gérer les cibles
- Détection de présence vocale
- Surveillance des messages (création/modification/suppression)
- Surveillance des mises à jour utilisateur
- Surveillance des mises à jour de membres

## 📄 Licence

Ce projet est fourni tel quel, sans garantie. Utilisez-le à vos propres risques.

## 💬 Support

Pour toute question ou problème, rejoignez le serveur Discord de support configuré dans `config.json`.
