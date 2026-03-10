# PROMPT DE CONTEXTE COMPLET - PROJET C15 TOUR

## 📱 CONTEXTE GÉNÉRAL DU PROJET

Tu vas travailler sur le projet **C15 Tour**, une application mobile hybride (iOS/Android) destinée à organiser et guider des convois de véhicules Citroën C15. Le projet est porté par Killiane LETELLIER dans le cadre d'un statut étudiant-entrepreneur (Pépite).

---

## 🎯 OBJECTIF PRINCIPAL

Créer une application complète permettant :
1. **Aux organisateurs** : Planifier et gérer des événements de convois routiers
2. **Aux participants** : Rejoindre et suivre ces convois en temps réel SANS créer de compte

---

## 👥 LES ACTEURS

### 1. **Organisateur / Administrateur** (Authentifié)
- Doit créer un compte et se connecter
- Rôle : Créer des événements, planifier des trajets, gérer les convois
- Accès à toutes les fonctionnalités d'administration
- Peut consulter l'historique de ses événements

### 2. **Participant** (NON authentifié - TRÈS IMPORTANT)
- **N'a PAS besoin de créer de compte**
- Accède à l'application avec un simple **code d'événement**
- Peut suivre le trajet GPS, recevoir notifications et écouter l'audio
- Expérience totalement anonyme et simplifiée

### 3. **Acteurs techniques**
- Système GPS (localisation temps réel)
- API de cartographie (calcul d'itinéraires, affichage carte)
- Serveur audio (diffusion de flux en direct)

---

## 🏗️ ARCHITECTURE DE L'APPLICATION

### Stack technique suggérée :
- **Frontend** : React Native ou Flutter (application hybride)
- **Backend** : Node.js + Express OU Python + FastAPI
- **Base de données** : PostgreSQL (avec PostGIS pour les données géographiques)
- **Temps réel** : WebSocket ou Socket.io
- **Cartographie** : Mapbox, Google Maps API, ou OpenStreetMap
- **Audio** : WebRTC ou service de streaming audio

---

## 📊 MODÈLE DE DONNÉES - ENTITÉS PRINCIPALES

### 1. **Utilisateur (User)**
```
Attributs :
- id (UUID)
- nom, prenom, email (unique), motDePasse (hashé)
- telephone, photoProfile
- role (ADMINISTRATEUR, PARTICIPANT)
- dateInscription, derniereConnexion, estActif

Méthodes :
- creerCompte(), seConnecter(), modifierProfil()
- changerMotDePasse(), supprimerCompte()
```

### 2. **Événement (Event)**
```
Attributs :
- id (UUID)
- titre, description
- codePartage (unique, 6-8 caractères) ← CLÉ IMPORTANTE
- dateCreation, dateDebut, dateFin
- dureeEstimeeMinutes, distanceTotaleKm
- statut (BROUILLON, PLANIFIE, EN_COURS, TERMINE, ANNULE)
- nombreParticipantsMax, nombreParticipantsActuels
- urlFluxAudio, estFluxAudioActif
- organisateurId (FK → Utilisateur)

Méthodes :
- creerEvenement(), modifierEvenement(), annulerEvenement()
- demarrerEvenement(), terminerEvenement()
- genererCodePartage() ← Génère le code pour les participants
- exporterTrajet(format) // GPX, PDF, JSON
- calculerDureeEstimee(), calculerDistanceTotale()
- activerFluxAudio(), desactiverFluxAudio()
- envoyerNotificationParticipants()
```

### 3. **Trajet (Route)**
```
Attributs :
- id (UUID)
- evenementId (FK → Événement)
- nom, description
- distanceTotaleKm, dureeEstimeeMinutes
- typeRoute (NATIONALE, DEPARTEMENTALE, AUTOROUTE, MIXTE)
- niveauDifficulte (FACILE, MOYEN, DIFFICILE)
- dateCreation, dateModification

Méthodes :
- creerTrajet(), modifierTrajet()
- ajouterPoint(), supprimerPoint(), reordonnerPoints()
- calculerItineraire()
- exporterGPX(), exporterPDF(), exporterJSON()
```

### 4. **Point (Waypoint)**
```
Attributs :
- id (UUID)
- trajetId (FK → Trajet)
- type (PASSAGE, INTERET, PAUSE) ← 3 types de points
- ordre (Integer) ← Position dans le trajet
- latitude, longitude
- nom, description, adresse
- dureePauseMinutes (obligatoire si type = PAUSE)
- tempsEstimeDepuisPrecedentMinutes
- distanceDepuisPrecedentKm
- heureArriveeEstimee
- estAtteint (Boolean)

Méthodes :
- creerPoint(), modifierPoint(), supprimerPoint()
- calculerDistanceDepuisPrecedent()
- calculerTempsDepuisPrecedent()
- marquerCommeAtteint()
```

**IMPORTANT** : Les 3 types de points :
- **PASSAGE** : Point obligatoire du trajet (départ, arrivée, étapes)
- **INTERET** : Point d'information (monument, lieu remarquable)
- **PAUSE** : Arrêt prévu avec durée définie (restaurant, aire de repos)

### 5. **Participation** (Classe d'association)
```
Attributs :
- id (UUID)
- utilisateurId (FK → Utilisateur) ← Peut être NULL pour participant anonyme
- evenementId (FK → Événement)
- identifiantAnonyme (String) ← Généré pour participants sans compte
- dateInscription
- statut (INSCRIT, EN_COURS, TERMINE, ABANDONNE)
- positionActuelleLat, positionActuelleLon
- dernierePositionMiseAJour
- pointActuelId (FK → Point)
- progression (Float 0-100%)
- aTermine (Boolean)

Méthodes :
- rejoindreEvenement(code) ← Méthode CRITIQUE
- quitterEvenement()
- mettreAJourPosition(lat, lon)
- obtenirProgressionTrajet()
- marquerPointAtteint(pointId)
```

### 6. **Segment** (Liaison entre 2 points)
```
Attributs :
- id (UUID)
- trajetId (FK → Trajet)
- pointDepart (FK → Point)
- pointArrivee (FK → Point)
- ordre (Integer)
- distanceKm, dureeEstimeeMinutes
- coordonneesGPS (Array de {lat, lon}) // Polyline pour tracer
- typeRoute (NATIONALE, DEPARTEMENTALE, AUTOROUTE)

Méthodes :
- creerSegment()
- calculerDistance(), calculerDuree()
- obtenirPolyline()
- verifierProgression(position)
```

### 7. **PositionEnTempsReel**
```
Attributs :
- id (UUID)
- participationId (FK → Participation)
- latitude, longitude
- vitesse (km/h), cap (degrés), altitude
- precision (mètres)
- timestamp (DateTime)

Méthodes :
- enregistrerPosition()
- obtenirDernierePosition()
- calculerEcartRoute()
- detecterErreurNavigation()
```

### 8. **CorrectionNavigation**
```
Attributs :
- id (UUID)
- participationId (FK → Participation)
- positionErreurLat, positionErreurLon
- pointCibleId (FK → Point)
- distanceEcartMetres
- itineraireCorrection (Array de coordonnées)
- dateDetection
- estCorrectionAcceptee (Boolean)

Méthodes :
- detecterErreur()
- calculerItineraireCorrection()
- proposerCorrection()
- appliquerCorrection()
```

### 9. **Notification**
```
Attributs :
- id (UUID)
- utilisateurId (FK) ← Peut être NULL si participant anonyme
- participationId (FK) ← Pour cibler un participant anonyme
- evenementId (FK)
- type (INFO, ALERTE, FIN_TRAJET, NOUVEAU_POINT, ERREUR_NAVIGATION)
- titre, message
- dateEnvoi
- estLue (Boolean)
- priorite (BASSE, MOYENNE, HAUTE)

Méthodes :
- creer(), envoyer()
- marquerCommeLue()
```

### 10. **FluxAudio**
```
Attributs :
- id (UUID)
- evenementId (FK → Événement)
- url (String)
- estActif (Boolean)
- dateDebut, dateFin
- qualite (BASSE, MOYENNE, HAUTE)
- codec (String)

Méthodes :
- demarrer(), arreter()
- pauseFlux(), reprendreFlux()
- changerQualite()
```

### 11. **HistoriqueEvenement**
```
Attributs :
- id (UUID)
- evenementId (FK → Événement)
- utilisateurId (FK → Utilisateur, l'organisateur)
- dateEvenement
- dureeReelleMinutes, distanceReelleKm
- nombreParticipants
- noteEvenement (Float 1-5)
- commentaire
- meteoConditions
- problemesTechniques (Array)

Méthodes :
- creerHistorique()
- ajouterCommentaire()
- noterEvenement()
- exporterRapport()
```

---

## 🔗 RELATIONS ENTRE ENTITÉS

### Relations principales (cardinalités) :

1. **Utilisateur → Événement** : 1:N (Un organisateur crée plusieurs événements)
2. **Événement → Trajet** : 1:1 (Un événement a UN trajet)
3. **Trajet → Point** : 1:N (Un trajet contient plusieurs points ordonnés)
4. **Point → Segment** : M:N (Les segments relient les points)
5. **Utilisateur ↔ Événement** : N:M via **Participation** (Plusieurs utilisateurs participent à plusieurs événements)
6. **Participation → PositionEnTempsReel** : 1:N (Une participation génère plusieurs positions)
7. **Participation → CorrectionNavigation** : 1:N (Une participation peut avoir plusieurs corrections)
8. **Événement → FluxAudio** : 1:1 (Un événement peut avoir un flux audio)
9. **Événement → HistoriqueEvenement** : 1:1 (Un événement a un historique)

---

## 📋 FONCTIONNALITÉS PRINCIPALES

### 🔵 POUR L'ORGANISATEUR (Authentifié)

#### **Phase 1 : Création de l'événement**
1. **Se connecter** à son compte
2. **Créer un événement** : 
   - Saisir : titre, description, date/heure de départ
   - Définir : nombre max de participants
   - Le système génère automatiquement un **code unique** (ex: "C15TOU")

#### **Phase 2 : Planification du trajet**
3. **Accéder à la carte interactive**
4. **Ajouter des points** sur le trajet :
   - Cliquer sur la carte pour placer un point
   - Choisir le type : PASSAGE, INTERET, ou PAUSE
   - Si PAUSE : définir la durée (ex: 30 minutes)
   - Ajouter nom, description, adresse
5. **Réordonner les points** (drag & drop ou numéros d'ordre)
6. **Calculer l'itinéraire** :
   - Le système calcule automatiquement :
     - Distance totale (ex: 85 km)
     - Durée totale estimée (ex: 2h15)
     - Temps entre chaque point
     - Heure d'arrivée estimée à chaque point
7. **Afficher les critères** :
   - Types de routes privilégiées
   - Éviter autoroutes (option)
   - Vitesse moyenne estimée

#### **Phase 3 : Partage**
8. **Exporter le trajet** :
   - Format GPX (pour GPS)
   - Format PDF (document imprimable)
   - Format JSON (données brutes)
9. **Partager le code** aux participants :
   - Via message, email, réseaux sociaux
   - Affichage QR code (optionnel)

#### **Phase 4 : Le jour J - Gestion en direct**
10. **Démarrer l'événement** (le jour J à l'heure prévue)
11. **Activer la diffusion audio** (optionnel) :
    - Diffuser de la musique, commentaires en direct
    - Possibilité d'automatiser via API
12. **Surveiller la progression** :
    - Voir positions de tous les participants sur la carte
    - Voir qui est à quel point
    - Détecter les participants en retard/perdus
13. **Envoyer des notifications** :
    - Alertes générales (ex: "Pause dans 5 min")
    - Messages spécifiques à certains participants
    - Alertes de sécurité
14. **Terminer l'événement** :
    - Clôturer officiellement
    - Notification automatique de fin à tous
    - Archivage dans l'historique

#### **Phase 5 : Après l'événement**
15. **Consulter l'historique** :
    - Voir tous les événements passés
    - Statistiques : durée réelle, distance, nombre de participants
    - Possibilité d'ajouter des commentaires

---

### 🟢 POUR LE PARTICIPANT (NON authentifié)

#### **IMPORTANT : Pas de création de compte requise**

#### **Phase 1 : Rejoindre l'événement**
1. **Recevoir le code** de l'organisateur (ex: "C15TOU")
2. **Ouvrir l'application** C15 Tour
3. **Saisir le code** sur l'écran d'accueil
4. **Valider** → Accès immédiat à l'événement
5. **Consulter les détails** :
   - Titre, description de l'événement
   - Date et heure de départ
   - Itinéraire prévu avec tous les points
   - Distance totale et durée estimée

#### **Phase 2 : Préparation**
6. **Autoriser la localisation GPS** (obligatoire pour le guidage)
7. **Consulter la liste des points** :
   - Voir tous les points de passage, intérêt, pauses
   - Voir durées de pause prévues
   - Voir estimations de temps

#### **Phase 3 : Pendant le convoi**
8. **Suivre le trajet en temps réel** :
   - Carte interactive avec position actuelle
   - Itinéraire tracé en surbrillance
   - Prochain point à atteindre affiché
   - Distance et temps restants
9. **Recevoir le guidage GPS** :
   - Instructions vocales (optionnel)
   - Flèches de direction
   - Alertes de changement de direction
10. **Bénéficier de la correction automatique** :
    - Si déviation détectée → Alerte
    - Nouvel itinéraire calculé automatiquement
    - Guidage vers le bon chemin
11. **Écouter le flux audio** (si activé) :
    - Connexion automatique au flux
    - Contrôle du volume
    - Pause/reprise possible
12. **Recevoir les notifications** :
    - Alertes de l'organisateur
    - Notifications de changement
    - Alertes de sécurité

#### **Phase 4 : Fin du convoi**
13. **Recevoir notification de fin** :
    - Quand dernier point atteint
    - OU quand organisateur termine l'événement
14. **Voir récapitulatif** :
    - Distance parcourue
    - Temps total
    - Points visités
15. **Quitter l'événement** :
    - Aucune déconnexion nécessaire
    - Simplement fermer l'application

---

## 🔑 FONCTIONNALITÉS CRITIQUES À IMPLÉMENTER

### 1. **Système de code d'événement**
```
Génération :
- Algorithme : Chaîne aléatoire de 6-8 caractères
- Format : Majuscules + Chiffres (ex: C15AB7, TOUR24)
- Vérification d'unicité dans la base de données
- Stockage hashé (optionnel pour sécurité)

Validation :
- Vérifier existence du code
- Vérifier si événement actif
- Vérifier si places disponibles
- Retourner événementId si valide

Partage :
- Copier dans presse-papier
- Générer lien : c15tour.app/join/C15AB7
- Générer QR code (optionnel)
```

### 2. **Calcul automatique d'itinéraire**
```
Algorithme :
1. Récupérer tous les points ordonnés du trajet
2. Pour chaque paire de points consécutifs :
   - Appeler API de cartographie (ex: Mapbox Directions)
   - Obtenir : distance, durée, polyline (coordonnées détaillées)
   - Créer un Segment
3. Stocker tous les segments
4. Calculer totaux :
   - Distance totale = somme distances segments
   - Durée totale = somme durées segments + somme durées pauses
5. Mettre à jour l'événement

Paramètres configurables :
- Type de route (éviter autoroutes)
- Vitesse moyenne
- Temps de pause sur points PAUSE
```

### 3. **Détection et correction d'erreur de navigation**
```
Algorithme (temps réel) :
1. Récupérer position actuelle du participant
2. Récupérer le segment en cours (entre point N et point N+1)
3. Calculer distance perpendiculaire entre position et polyline du segment
4. SI distance > seuil (ex: 500 mètres) :
   a. Déclencher alerte "Vous vous êtes éloigné du trajet"
   b. Calculer nouvel itinéraire de position actuelle vers point N+1
   c. Afficher nouvel itinéraire en surbrillance
   d. Sauvegarder CorrectionNavigation pour statistiques
5. SINON : Continuer normalement

Déclenchement :
- Vérification toutes les 10-30 secondes
- Ou à chaque mise à jour de position GPS
```

### 4. **Diffusion de flux audio**
```
Technologies possibles :
- WebRTC (peer-to-peer)
- Server-sent Events (SSE)
- WebSocket avec chunks audio
- Service tiers (Agora, Twilio)

Fonctionnement :
1. Organisateur démarre flux :
   - Sélectionne source audio (micro, fichier, streaming)
   - Le serveur crée un canal de diffusion
   - URL du flux générée : wss://audio.c15tour.app/event/C15AB7
2. Participants se connectent automatiquement :
   - WebSocket établi au démarrage de l'événement
   - Réception du flux en temps réel
   - Bufferisation pour éviter coupures
3. Contrôles disponibles :
   - Volume (côté participant)
   - Mute/unmute (côté participant)
   - Stop flux (côté organisateur)
```

### 5. **Suivi de progression**
```
Pour chaque participant :
1. Calculer progression = (points atteints / points totaux) × 100
2. Identifier point actuel :
   - Dernier point dont distance < X mètres (ex: 50m)
   - Marquer comme atteint
3. Estimer temps restant :
   - Distance restante / vitesse moyenne
   - + durées de pause restantes
4. Afficher sur carte organisateur :
   - Icône personnalisée par participant
   - Couleur selon progression (vert OK, orange retard, rouge perdu)
```

---

## 🎨 INTERFACE UTILISATEUR - ÉCRANS PRINCIPAUX

### Pour l'ORGANISATEUR

1. **Écran d'accueil** (après connexion)
   - Liste des événements : À venir, En cours, Terminés
   - Bouton "+ Créer un événement"

2. **Écran "Créer événement"**
   - Formulaire : Titre, Description, Date/Heure, Nb max participants
   - Bouton "Suivant → Planifier le trajet"

3. **Écran "Planification trajet"** (LE PLUS IMPORTANT)
   - Carte plein écran avec contrôles
   - Barre latérale avec liste des points
   - Boutons :
     - "Ajouter point de passage"
     - "Ajouter point d'intérêt"
     - "Ajouter point de pause"
   - Panneau infos : Distance totale, Durée totale
   - Boutons : "Calculer itinéraire", "Valider"

4. **Écran "Détails événement"**
   - Infos générales
   - Code de partage (grand, copiable)
   - Carte avec trajet complet
   - Liste des points avec détails
   - Boutons : "Exporter GPX/PDF", "Partager code"
   - Bouton : "Démarrer l'événement" (si date atteinte)

5. **Écran "Événement en direct"**
   - Carte avec positions de tous les participants (pins)
   - Panneau participants : Liste avec progression %
   - Bouton "Diffuser audio"
   - Bouton "Envoyer notification"
   - Statistiques temps réel
   - Bouton "Terminer événement"

6. **Écran "Historique"**
   - Liste des événements passés
   - Pour chaque événement : Date, Participants, Distance, Durée

### Pour le PARTICIPANT

1. **Écran d'accueil** (première ouverture)
   - Logo C15 Tour
   - Champ de saisie : "Entrez le code de l'événement"
   - Bouton "Rejoindre"
   - Optionnel : Bouton "Scanner QR code"

2. **Écran "Détails événement"** (après code valide)
   - Titre et description
   - Date et heure de départ
   - Carte avec trajet complet
   - Liste des points avec icônes (passage/intérêt/pause)
   - Distance totale, Durée estimée
   - Bouton "Prêt à démarrer" (si événement lancé)

3. **Écran "Navigation en direct"** (ÉCRAN PRINCIPAL)
   - Carte plein écran avec :
     - Position actuelle (pin bleu)
     - Trajet en surbrillance
     - Prochain point en évidence
   - En-tête : "Prochain point : [Nom]"
   - Indicateurs : "🚗 850m - ⏱️ 12 min"
   - Barre de progression en bas
   - Bouton "🔊 Audio" (si flux actif)
   - Bouton "❓ Aide"

4. **Écran "Liste des points"**
   - Liste scrollable avec tous les points
   - Pour chaque point :
     - Icône selon type
     - Nom
     - Distance depuis départ
     - Temps estimé
     - ✅ si atteint

5. **Pop-up "Notification"**
   - Apparaît en overlay
   - Titre + Message de l'organisateur
   - Bouton "OK"

6. **Pop-up "Correction"**
   - "Vous vous êtes éloigné du trajet"
   - Carte mini avec nouvel itinéraire
   - Bouton "Me guider"

---

## 🚀 FLUX TECHNIQUES CRITIQUES

### Flux 1 : Rejoindre un événement (participant)
```
1. Participant ouvre l'app → Écran accueil
2. Saisit code "C15TOU" → Clic "Rejoindre"
3. Frontend envoie : POST /api/events/join
   Body : { code: "C15TOU" }
4. Backend :
   a. Vérifie si code existe en DB
   b. Vérifie si événement actif
   c. Vérifie places disponibles
   d. Génère identifiantAnonyme unique
   e. Crée entrée Participation :
      - evenementId
      - identifiantAnonyme
      - statut: INSCRIT
   f. Retourne : eventDetails + participationId
5. Frontend :
   - Stocke participationId en local (AsyncStorage)
   - Affiche écran détails événement
```

### Flux 2 : Démarrage du guidage GPS
```
1. Événement démarre (organisateur clique "Démarrer")
2. Notification push envoyée à tous les participants
3. Participant ouvre app → Détecte événement en cours
4. Demande permission GPS
5. Active géolocalisation :
   - navigator.geolocation.watchPosition()
   - Fréquence : toutes les 5-10 secondes
6. À chaque position reçue :
   a. Envoie au backend : POST /api/positions
      Body : { participationId, lat, lon, timestamp }
   b. Backend sauvegarde PositionEnTempsReel
   c. Backend vérifie écart de route
   d. Si écart > seuil : Déclenche CorrectionNavigation
7. Frontend affiche position sur carte
8. Frontend calcule guidage vers prochain point
```

### Flux 3 : Calcul d'itinéraire
```
1. Organisateur ajoute points et clique "Calculer itinéraire"
2. Frontend envoie : POST /api/routes/{routeId}/calculate
3. Backend :
   a. Récupère tous les points ordonnés
   b. Pour chaque paire (Point N, Point N+1) :
      i. Appelle API Mapbox :
         GET https://api.mapbox.com/directions/v5/mapbox/driving/
             {lon1},{lat1};{lon2},{lat2}
      ii. Récupère : distance, duration, geometry (polyline)
      iii. Crée Segment en DB :
          - pointDepart = Point N
          - pointArrivee = Point N+1
          - distanceKm = distance
          - dureeEstimeeMinutes = duration
          - coordonneesGPS = decode(geometry)
   c. Calcule totaux :
      - Distance totale = SUM(segments.distance)
      - Durée totale = SUM(segments.duree) + SUM(pauses.duree)
   d. Met à jour Event en DB
   e. Retourne : { segments, distanceTotale, dureeTotale }
4. Frontend affiche trajet complet sur carte
```

### Flux 4 : Diffusion audio
```
1. Organisateur clique "Activer flux audio"
2. Frontend envoie : POST /api/events/{eventId}/audio/start
3. Backend :
   a. Initialise serveur streaming (WebSocket)
   b. Crée FluxAudio en DB :
      - url : wss://audio.c15tour.app/stream/{eventId}
      - estActif : true
   c. Retourne URL flux
4. Frontend organisateur :
   - Demande permission micro
   - Capture audio : navigator.mediaDevices.getUserMedia()
   - Envoie chunks au WebSocket
5. Backend reçoit chunks audio :
   - Broadcast à tous les participants connectés
6. Frontend participants :
   - WebSocket établi au démarrage événement
   - Écoute event 'audio-chunk'
   - Joue audio via Web Audio API ou <audio> element
7. Organisateur clique "Arrêter flux" :
   - POST /api/events/{eventId}/audio/stop
   - Backend ferme WebSocket
   - FluxAudio.estActif = false
```

---

## 🔐 SÉCURITÉ ET CONSIDÉRATIONS

### Données des participants anonymes
- Générer un `identifiantAnonyme` UUID v4
- Ne jamais demander d'email, nom, téléphone
- Stocker positions GPS de manière éphémère
- Supprimer toutes les données après X jours de fin d'événement (RGPD)

### Limitation du nombre de participants
- Vérifier à chaque `rejoindreEvenement()`
- Si `nombreParticipantsActuels >= nombreParticipantsMax` → Refuser
- Incrémenter compteur atomiquement (éviter race conditions)

### Validation du code événement
- Code doit être unique en base
- Vérifier statut événement (ne pas rejoindre si TERMINE ou ANNULE)
- Expiration possible après X heures de fin

### Protection API
- Rate limiting sur `/api/events/join` (éviter brute-force)
- Rate limiting sur `/api/positions` (éviter spam)
- Authentication JWT pour organisateurs
- Token session pour participants (basé sur participationId)

---

## 📱 ASPECTS TEMPS RÉEL

### WebSockets / Socket.io
Événements à gérer :
```javascript
// Côté participant
socket.on('event-started', (data) => {
  // Afficher notification "L'événement a démarré"
  // Activer guidage GPS
});

socket.on('notification', (data) => {
  // Afficher popup avec message organisateur
});

socket.on('audio-stream', (audioChunk) => {
  // Jouer audio en temps réel
});

socket.on('event-ended', (data) => {
  // Afficher notification fin
  // Arrêter guidage
});

// Côté organisateur
socket.on('participant-position', (data) => {
  // Mettre à jour position sur carte
  // participantId, lat, lon, timestamp
});

socket.on('participant-joined', (data) => {
  // Notification nouveau participant
  // Incrémenter compteur
});
```

---

## 🧪 FONCTIONNALITÉS AVANCÉES (Phase 2)

### 1. Mode hors ligne
- Télécharger carte et trajet avant départ
- Guidage GPS fonctionnel sans réseau
- Synchronisation des positions à la reconnexion

### 2. Chat entre participants
- Chat textuel en temps réel
- Visible par tous les participants
- Modéré par l'organisateur

### 3. Photos partagées
- Participants peuvent prendre photos durant le trajet
- Photos géolocalisées sur la carte
- Galerie partagée après l'événement

### 4. Système de notation
- Participants notent l'événement (1-5 étoiles)
- Commentaires post-événement
- Statistiques pour l'organisateur

### 5. Météo intégrée
- Affichage météo sur chaque point
- Alertes si mauvais temps prévu
- Suggestion report si conditions dangereuses

---

## 📊 MÉTRIQUES ET ANALYTICS

### Pour l'organisateur
- Nombre total d'événements créés
- Taux de participation (inscrits vs présents réels)
- Distance moyenne par événement
- Durée moyenne par événement
- Points les plus populaires
- Taux d'abandon en cours de route

### Pour le système
- Nombre d'utilisateurs actifs (organisateurs)
- Nombre de participants anonymes par mois
- Nombre d'événements par région
- Taux d'utilisation du flux audio
- Nombre de corrections de navigation
- Performance des APIs externes (temps réponse)

---

## 🐛 GESTION DES ERREURS COURANTES

### Erreur 1 : Code événement invalide
```
Message : "Code invalide. Vérifiez et réessayez."
Action : Permettre nouvelle saisie
```

### Erreur 2 : Événement complet
```
Message : "Cet événement a atteint sa capacité maximale."
Action : Afficher nombre de participants max
```

### Erreur 3 : GPS désactivé
```
Message : "Veuillez activer la localisation pour suivre le trajet."
Action : Ouvrir paramètres système
```

### Erreur 4 : Perte de connexion réseau
```
Message : "Connexion perdue. Guidage en mode local."
Action : Basculer en mode offline avec dernières données
```

### Erreur 5 : API cartographie indisponible
```
Message : "Impossible de calculer l'itinéraire. Réessayez plus tard."
Action : Logger erreur, notifier développeurs
```

---

## 🎯 PRIORITÉS DE DÉVELOPPEMENT

### MVP (Version 1.0) - Fonctionnalités essentielles
✅ Authentification organisateur
✅ Création événement simple
✅ Ajout de points (3 types)
✅ Calcul itinéraire basique
✅ Génération code partage
✅ Rejoindre événement sans compte
✅ Guidage GPS basique
✅ Notifications push simples
✅ Terminer événement

### Version 1.1 - Améliorations
✅ Correction automatique navigation
✅ Diffusion flux audio
✅ Surveillance positions temps réel
✅ Export GPX/PDF
✅ Historique événements

### Version 2.0 - Fonctionnalités avancées
⏳ Mode hors ligne
⏳ Chat participants
⏳ Photos partagées
⏳ Système de notation
⏳ Intégration météo
⏳ Analytics avancées

---

## 💡 CONSEILS DE DÉVELOPPEMENT

1. **Commence par le MVP** : Focus sur les fonctionnalités critiques
2. **Tests avec vrais utilisateurs** : Organise des convois tests rapidement
3. **Performance GPS** : Optimise la fréquence d'envoi des positions (balance précision/batterie)
4. **UX participant** : Rendre l'onboarding ULTRA simple (moins de 30 secondes)
5. **Gestion d'erreurs** : Prévoir tous les cas (pas de réseau, GPS désactivé, etc.)
6. **Documentation API** : Documente chaque endpoint (Swagger/OpenAPI)
7. **Tests automatisés** : Unit tests + E2E tests critiques
8. **Monitoring** : Intégrer Sentry ou équivalent pour tracking erreurs production

---

## 📞 QUESTIONS À CLARIFIER AVEC L'ÉQUIPE

1. Quelle API de cartographie privilégier ? (Mapbox vs Google Maps vs OSM)
2. Budget pour APIs tierces ?
3. Hébergement backend ? (AWS, Google Cloud, OVH, etc.)
4. Durée de conservation des données anonymes ? (RGPD)
5. Langues supportées ? (FR uniquement ou multilingue ?)
6. Versions mobiles cibles ? (iOS 13+, Android 8+ ?)
7. Besoin d'une version web desktop pour organisateurs ?
8. Limite max de participants par événement ?

---

## 🎬 RÉSUMÉ POUR L'IA

**Tu dois développer une application qui :**

1. Permet à un **organisateur authentifié** de créer des événements de convois routiers, planifier des trajets avec différents types de points, et gérer ces événements en temps réel.

2. Permet à des **participants NON authentifiés** de rejoindre ces événements simplement avec un code, suivre le trajet GPS en direct, recevoir guidage et corrections automatiques, écouter un flux audio, et recevoir des notifications.

3. Le système doit gérer :
   - La génération de codes uniques par événement
   - Le calcul automatique d'itinéraires via API cartographie
   - Le suivi temps réel des positions GPS
   - La détection et correction automatique d'erreurs de navigation
   - La diffusion de flux audio en direct
   - L'envoi de notifications push
   - L'archivage des événements dans un historique

4. **Contrainte CRITIQUE** : Les participants ne doivent PAS avoir besoin de créer un compte. Accès anonyme uniquement via code événement.

5. Stack technique : Application hybride (React Native/Flutter) + Backend API REST + WebSockets pour temps réel + Base PostgreSQL + API cartographie (Mapbox/Google Maps)

---

**Utilise ce contexte pour toutes tes réponses concernant ce projet. Si tu as besoin de clarifications, demande-moi !**
