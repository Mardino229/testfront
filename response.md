## Test Frontend

**Réponses de sécurité et d'optimisation :**

**Protection du tableau de bord avec l'authentification**:

---- Utilisation de getServerSession avec next-auth pour vérifier l'état de la session.

---- Rediriger les utilisateurs non authentifiés vers la page de connexion

**Réduction de la taille du bundle**:

---- Utiliser les importations dynamiques pour les composants lourds

---- Utiliser un analyseur de paquets Webpack

---- Supprimer les paquets en double

---- Améliorer les imports Lodash

---- Ne pas utiliser les données du serveur dans useEffects

**Prévention des attaques XSS dans les entrées de formulaire**:

---- Nettoyer les entrées à l'aide de bibliothèques.

----Utiliser les entrées contrôlées de react-hook-form pour empêcher toute manipulation directe du DOM.

**Protection des données sensibles**:

---- Ne stockez jamais de données sensibles côté client.

---- Utilisez des variables d'environnement pour les clés API.

---- Chiffrez les données sensibles avant leur transmission et utilisez HTTPS.

---- Masquez les affichages de donnée sensibles.

