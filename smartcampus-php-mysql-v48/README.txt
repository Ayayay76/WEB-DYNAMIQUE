SMARTCAMPUS - VERSION v48 PHP / MYSQL
=====================================

Technos : React CDN + PHP + MySQL.
Projet prévu pour MAMP / phpMyAdmin.

BASE DE DONNÉES
---------------
- Base MySQL : smartcampus_v48
- Fichier à importer : database_v48.sql
- Copie identique fournie : database.sql

INSTALLATION
------------
1. Copier le dossier smartcampus-php-mysql-v48 dans :
   C:\MAMP\htdocs\

2. Ouvrir phpMyAdmin.

3. Importer :
   database_v48.sql

4. Vérifier api/config.php :
   define('DB_NAME', 'smartcampus_v48');
   define('DB_USER', 'root');
   define('DB_PASS', 'root');

5. Ouvrir :
   http://localhost/smartcampus-php-mysql-v48

COMPTES DE TEST
---------------
Admin :
- email : admin
- mot de passe : 0000

Étudiant :
- email : emma@ece.fr
- mot de passe : 1234

Enseignant :
- email : mohamed.ali@ece.fr
- mot de passe : 1234

VÉRIFICATION SUJET / GRILLE
---------------------------
La version v48 couvre les espaces administrateur, étudiant et enseignant, la navigation par rôle, les comptes, les étudiants, les enseignants, les cours, les modules, les classes, les inscriptions, les notes, les présences, l'emploi du temps, les messages et notifications.

Points renforcés pour la démonstration :
- calendrier dynamique type HyperPlanning ;
- conflits de salle et conflits de classe bloqués côté interface, API et base SQL ;
- notes limitées de 0 à 20 ;
- statut de note toujours modifiable ;
- notes verrouillées si statut final, déverrouillées si retour à Pas terminé ;
- inscriptions par classe/module, avec contrôle des capacités et des conflits horaires ;
- cours affichés une seule fois même s'il existe plusieurs séances ;
- profils accessibles depuis le nom en haut à droite ;
- QR/code de présence uniquement générés côté enseignant ;
- scan QR côté étudiant avec demande d'autorisation caméra.

CORRECTIONS v48
---------------
- Suppression de l'onglet Statistiques côté administrateur.
- Ajout d'un onglet Événements dans Inscriptions.
- L'administrateur peut créer un événement, choisir les niveaux autorisés ING1 à ING5, définir une capacité et éventuellement lier l'événement à un cours.
- L'administrateur peut inscrire ou désinscrire un étudiant à un événement.
- L'étudiant voit les événements disponibles selon son niveau et ses cours, puis peut s'inscrire lui-même.
- Les inscriptions aux événements sont enregistrées en base dans events et event_registrations.

FICHIERS IMPORTANTS
-------------------
- index.html : charge React, Babel et la librairie QR.
- app.js : interface React et logique front-end.
- style.css : interface visuelle.
- api/api.php : API PHP / MySQL.
- api/config.php : configuration MySQL.
- database_v48.sql : script SQL à importer.

REMARQUE DÉMO
-------------
Pour tester le scan QR :
1. Se connecter comme enseignant.
2. Aller dans Présences.
3. Créer un accès de présence avec QR code.
4. Se connecter comme étudiant sur un autre onglet/appareil.
5. Aller dans Présence puis cliquer sur Scanner QR code.
6. Autoriser la caméra du navigateur.


CORRECTIONS v48 - SESSION ET INTERFACE
- Connexion conservée après actualisation de la page grâce à la session PHP et au cookie PHPSESSID.
- L'application restaure automatiquement l'utilisateur connecté au chargement.
- Déconnexion : suppression propre de la session et du cookie.
- Suppression des textes explicatifs inutiles dans la partie étudiant, notamment sous Mes notes.

CORRECTIONS v48
- Session isolée avec cookie SMARTCAMPUS_V48_SESSION pour éviter une connexion automatique héritée d'une ancienne version ou d'un ancien dossier.
- La session reste active après actualisation, mais l'application ne récupère plus les anciens cookies PHPSESSID des versions précédentes.
- Partie enseignant : ajout de l'onglet Classes pour consulter les classes et étudiants associés aux cours du professeur.
- Partie enseignant : suppression complète de la gestion des justificatifs dans l'espace professeur. Les justificatifs restent gérés par l'administration / scolarité.
- Présences enseignant : le calendrier s'ouvre par défaut par classe quand des classes sont disponibles.
- Présences enseignant : le bouton Afficher des accès code / QR met maintenant à jour le panneau affiché, les choix code/QR et la séance sélectionnée.
- Ajout d'un cache-busting app.js?v=47 et style.css?v=47 pour éviter que le navigateur garde l'ancien code.


CORRECTIONS v48 - FILTRAGE ET NOTES
-----------------------------------
- Gestion des cours : ajout de filtres par enseignant et par semestre, avec recherche et tri conservés.
- Notes : possibilité d'ajouter plusieurs notes détaillées dans Suivi, DS ou Projet.
- Chaque note détaillée possède un pourcentage interne à son type.
- La moyenne finale est calculée avec les pourcentages.
- Les notes détaillées sont enregistrées en base dans grade_components.


CORRECTIONS v48 - ÉTUDIANTS ET ÉVÉNEMENTS
-----------------------------------------
- Création/modification étudiant : le niveau ING1 à ING5 est choisi dans une liste.
- Événements : l’administrateur peut maintenant modifier un événement existant.
- Inscription événement : un étudiant ne peut pas s’inscrire si un cours se chevauche avec l’événement.
- Le même blocage est appliqué côté étudiant, côté administration et côté API PHP.

CORRECTIONS v48 - PONDÉRATION DES NOTES PAR TYPE
------------------------------------------------
- Le pourcentage final est défini par type : Suivi, DS et Projet.
- Chaque note détaillée possède aussi un pourcentage interne à son type.
- Le total interne d'un type ne peut pas dépasser 100%.
- La moyenne de chaque type est calculée avec les pourcentages internes des notes de ce type.
- La moyenne finale est calculée avec les moyennes Suivi, DS et Projet, puis leurs pourcentages finaux.

CORRECTIONS v48
- Semestre remplacé par une liste S1 à S10 dans la création des modules et des cours.
- Règle pédagogique ajoutée : ING1 = S1/S2, ING2 = S3/S4, ING3 = S5/S6, ING4 = S7/S8, ING5 = S9/S10.
- Une classe ne peut plus être inscrite à un module dont le semestre ne correspond pas à son niveau.
- Le semestre d'un cours doit correspondre au semestre du module auquel il est affecté.
- Emploi du temps étendu à 7 jours avec ajout du dimanche.

CORRECTIONS v48
- Ajout du coefficient de module.
- Création de module : le coefficient est maintenant saisi par l'administration.
- Notes : modification possible du nom, de la note /20 et du pourcentage interne de chaque note détaillée.
- Enseignant : peut saisir/modifier les notes de ses classes/cours, mais ne peut plus valider ou invalider un module.
- Administration : garde la validation finale des notes.
- Lorsqu'une classe est inscrite à un module, les lignes de notes des étudiants sont générées automatiquement pour les cours du module.
- Lorsqu'un cours est créé dans un module, les lignes de notes sont générées pour les classes déjà inscrites au module.
- Moyenne générale étudiant calculée avec les coefficients des modules.
