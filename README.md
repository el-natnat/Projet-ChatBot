# ChatBot
Projet de Service Web 2022 par 
BREUIL Nathan,
GUERIN Florent



## Outils nécessaires 
- Un IDE (Visual Studio Code)
- Une console pour exécuter des commandes 

## Installation 
1) Télécharger le répertoire git "Projet-Chatbot" sur votre machine
2) Placer votre console dans le répertoire Projet-ChatBot/server

3) Exécuter les commandes suivantes pour installer express 
```bash
npm install express
```
Il faudra potentiellement installer de quoi lancer un serveur NodeJS et npm si ce n'est pas déjà fait

## Lancer l'interface du Projet

1) Se placer dans le répertoire Projet-ChatBot
2) Lancer le serveur nodeJS avec la commande :
```bash
node ./server/index.mjs
```
3) La page d'accueil est maintenant accessible en ouvrant le fichier : Projet-ChatBot/client/index.html avec un navigateur Web (Mozilla Firefox par exemple)

## Utilisation de l'interface 
1) Accéder à l'onglet : "Gestion des bots", vous avez accès à la liste des bots créés. Vous allez pouvoir créer des Bots et en supprimer. 

Pour ajouter un nouveau bot, cliquez sur "Ajouter un nouveau ChatBot" et renseignez les caractéristiques du Bot.

Si vous souhaitez activer l'implémentation Discord du Bot, vous devez ajouter un Bot sur un serveur Discord au préalable avec les permissions requises. Dans l'interface, il vous sera demander de renseigner le token de création du Bot.

2) Une fois le ou les Bots créés, vous pouvez accéder à l'onglet "Communiquer avec les Bots" pour sélectionner un des bots créés et discuter avec lui.

Le champ "username" est obligatoire pour pouvoir converser avec les chatbots.




