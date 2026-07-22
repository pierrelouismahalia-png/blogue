# SPÉCIFICATION – Outil gratuit : préparation à l'attestation des valeurs (AVDQ)

## OBJECTIF

Créer un nouvel outil **gratuit** sur le site MDPL Immigration pour aider les candidats à 
préparer l'**attestation d'apprentissage des valeurs démocratiques et des valeurs québécoises**
exigée par le MIFI (programmes d'immigration économique du Québec, dont le PSTQ).

L'outil doit offrir **quatre façons d'étudier**, sur le modèle du programme préparatoire de
citoyenneté :

1. **Guide d'étude** – 6 sections (l'attestation + les 5 clés)
2. **Cartes mémoire** – 20 flashcards qui se retournent au clic
3. **Quiz de 50 questions** – correction immédiate après chaque réponse
4. **Révision rapide** – 20 faits essentiels avant l'évaluation

**Important : cet outil est entièrement GRATUIT.** Aucun paiement, aucun compte, aucune
protection d'accès Supabase. C'est un aimant à clients (SEO + notoriété) qui mène vers la
consultation MDPL.

---

## RÈGLES COMMUNES

- **Gabarit** : cloner `test-citoyennete.html` pour garder exactement le même ADN visuel
  (en-tête, bannière du haut, menu déroulant complet, pied de page, `assets/styles.css`,
  `assets/script.js`).
- **Aucun emoji**, nulle part.
- **Aucun accès protégé** : la page est publique.
- **Délimiteurs de chaîne ASCII** dans le JS. **Échapper toutes les apostrophes françaises.**
- **SEO complet** : `<title>`, meta description, H1 unique, hiérarchie H2/H3, canonical, alt
  descriptif sur l'image.
- **Responsive** : irréprochable sur téléphone et tablette, aucun débordement horizontal.
- **N'INVENTE AUCUN CONTENU** au-delà de ce fichier. Tout le contenu ci-dessous provient du
  *Guide pratique* officiel du MIFI (édition 2024).

### Langue
**Version française pour le v1.** Le contenu officiel de référence est en français et
l'évaluation porte sur les valeurs d'une société francophone. Structure le code pour qu'une
version anglaise puisse être ajoutée plus tard (données de questions/cartes dans des objets JS,
pas en dur dans le HTML). Ne traduis pas maintenant.

---

## FICHIER

`preparation-valeurs-quebecoises.html`

## TITRE / H1

- `<title>` : Préparation à l'attestation des valeurs québécoises – Guide et 50 questions gratuites | MDPL Immigration
- H1 : Préparez votre attestation des valeurs démocratiques et québécoises
- Sous-titre : Guide d'étude, cartes mémoire et 50 questions de pratique. Gratuit.
- Fil d'Ariane : Accueil / Nos outils / Préparation aux valeurs québécoises
- Eyebrow : Outil interactif gratuit

## MENU

Ajouter une entrée dans le menu déroulant « Nos outils » :
`Préparation aux valeurs québécoises (gratuit)` → `preparation-valeurs-quebecoises.html`

Ajouter aussi une carte sur `outils.html`, **identique aux autres cartes** (même design, aucun
style ajouté, aucun badge) :
- Titre : Préparation aux valeurs québécoises
- Description : Guide d'étude, cartes mémoire et 50 questions de pratique pour l'attestation
  des valeurs démocratiques et québécoises exigée par le MIFI. Gratuit.
- Bouton : Commencer

## STRUCTURE DE LA PAGE

- En-tête + hero (même gabarit)
- Une barre d'onglets : **Guide d'étude · Cartes mémoire · Quiz (50 questions) · Révision rapide**
- Une seule page, les onglets affichent/masquent les sections (pas de rechargement)
- Encadré d'avertissement + liens officiels (voir plus bas), toujours visible en bas
- CTA MDPL en bas : « Votre demande au PSTQ mérite un accompagnement professionnel » → bouton
  « Prendre rendez-vous » (lien Setmore existant)

---

# 1. GUIDE D'ÉTUDE (6 sections)

Chaque section contient : un texte d'étude, un encadré « Points clés » et un encadré
« À retenir » (le fait le plus important, en doré).

---

## Section 0 – L'attestation et l'évaluation

**Texte d'étude**

Depuis le 1er janvier 2020, toute personne qui présente une demande de sélection permanente
dans un programme d'immigration économique du Québec doit obtenir une attestation
d'apprentissage des valeurs démocratiques et des valeurs québécoises. La condition s'applique
aussi à votre époux ou conjoint et à vos enfants à charge de 18 ans et plus qui vous
accompagnent.

Après avoir reçu la communication du MIFI contenant le lien et votre identifiant, vous avez
60 jours pour obtenir l'attestation. À défaut, la demande de sélection permanente est rejetée.

Deux moyens existent : réussir l'évaluation en ligne, ou participer à la session d'information
Objectif Intégration au Québec (24 heures réparties sur quelques jours).

L'évaluation en ligne comporte 20 questions tirées au hasard d'une banque de questions. Il faut
15 bonnes réponses sur 20 (seuil de 75 %). Vous disposez de trois heures. En cas d'échec, un
délai minimal de deux semaines doit s'écouler avant un nouvel essai. Après deux échecs, selon
votre situation, vous pourrez faire un troisième et dernier essai ou devrez participer à Objectif
Intégration. L'attestation est valide deux ans.

**Points clés**
- 20 questions, tirées au hasard
- Seuil de passage : 15 sur 20 (75 %)
- Trois heures pour répondre
- Deux semaines minimum entre chaque essai
- 60 jours pour obtenir l'attestation après la communication du MIFI
- Attestation valide deux ans
- Alternative : la session Objectif Intégration (24 heures, au Québec)

**À retenir** – 15 / 20 : le seuil de passage de l'évaluation en ligne.

---

## Section 1 – Clé 1 : Le Québec est une société francophone

**Texte d'étude**

Le français est au cœur de l'identité québécoise. Le Québec est la seule société
majoritairement francophone en Amérique du Nord, où l'on estime à seulement 2 % la proportion
de francophones. C'est ce qui fait du Québec une société distincte.

En 1977, le Québec a adopté la Charte de la langue française, aussi appelée loi 101. C'est la
principale mesure qui protège et valorise le français. Elle fait du français la langue de l'État
et de la Loi, ainsi que la langue normale et habituelle du travail, de l'enseignement, des
communications, du commerce et des affaires. La seule langue officielle du Québec est le
français.

Le français est la langue d'accueil et d'intégration des personnes immigrantes, la langue de la
communication interculturelle et la langue de la cohésion sociale. Le gouvernement du Québec
offre gratuitement des cours de français, à temps plein ou à temps partiel, ainsi qu'une aide
financière. Les ordres professionnels ne délivrent des permis qu'aux personnes ayant une
connaissance du français appropriée à l'exercice de leur profession. Sauf exception, les enfants
des personnes immigrantes doivent fréquenter l'école de langue française jusqu'à la fin de leurs
études secondaires.

**Points clés**
- Le français est la seule langue officielle du Québec
- Charte de la langue française (loi 101), adoptée en 1977
- Langue de l'État, de la Loi, du travail, de l'enseignement, du commerce et des affaires
- Environ 2 % de francophones en Amérique du Nord
- Cours de français gratuits offerts par le gouvernement du Québec
- École française obligatoire pour les enfants des personnes immigrantes, sauf exception

**À retenir** – 1977 : l'adoption de la Charte de la langue française (loi 101).

---

## Section 2 – Clé 2 : Le Québec est une société démocratique

**Texte d'étude**

Le régime démocratique permet à la population de choisir ses représentantes et représentants
lors d'une élection. Le territoire québécois est divisé en 125 circonscriptions. Dans chacune,
la candidate ou le candidat qui obtient le plus de votes devient députée ou député. Les 125
députés siègent à l'Assemblée nationale, à Québec, capitale nationale : c'est pourquoi le Québec
est une démocratie représentative.

Le parti qui fait élire le plus grand nombre de députés forme généralement le gouvernement, et
son chef ou sa cheffe devient premier ministre ou première ministre. Les autres partis forment
l'opposition. Un résultat d'élection ne peut jamais être contesté par la force ou la violence :
on peut demander un dépouillement judiciaire, c'est-à-dire un recomptage sous supervision du
tribunal.

Pour voter, il faut notamment être âgé de 18 ans et plus, avoir la citoyenneté canadienne et
être domicilié au Québec depuis six mois. Le vote est libre et confidentiel. Personne ne peut
empêcher une personne de voter, l'obliger à voter pour un candidat, ni l'obliger à révéler son
choix – y compris au sein d'une même famille. Une personne sans citoyenneté canadienne ne peut
pas voter, mais peut s'impliquer dans un parti politique.

La primauté du droit est un principe fondamental : chaque personne, tout comme l'État, doit
respecter la loi. Personne n'est au-dessus de la loi.

L'État québécois repose sur trois pouvoirs. Le pouvoir législatif adopte les lois : c'est le
Parlement, composé de l'Assemblée nationale et du lieutenant-gouverneur, qui sanctionne les
projets de loi. Le pouvoir exécutif est le gouvernement (premier ministre et ministres). Le
pouvoir judiciaire est celui des tribunaux, qui interprètent et font respecter la loi.

La Constitution canadienne prévoit deux ordres de gouvernement. Le fédéral, à Ottawa, exerce
notamment la défense militaire, la politique étrangère et le droit criminel. Le Québec est
responsable notamment de l'éducation, des municipalités, de la propriété et des droits civils.
L'immigration et l'agriculture sont des compétences partagées. Le Québec compte onze nations
autochtones.

La Charte des droits et libertés de la personne protège deux libertés fondamentales au cœur de
la démocratie : la liberté d'expression, qui comprend la liberté de presse, et la liberté
d'association et de réunion pacifique. La liberté d'expression implique une responsabilité : il
est illégal d'inciter à commettre un crime, de nuire à la réputation d'autrui ou de propager des
propos discriminants ou haineux.

**Points clés**
- 125 circonscriptions, 125 députés à l'Assemblée nationale
- Démocratie représentative
- Voter : 18 ans et plus, citoyenneté canadienne, domicile au Québec depuis six mois
- Vote libre et confidentiel : nul ne peut obliger quiconque à voter d'une certaine façon
- Primauté du droit : personne n'est au-dessus de la loi
- Trois pouvoirs : législatif, exécutif, judiciaire
- Fédéral : défense, politique étrangère, droit criminel. Québec : éducation, municipalités,
  propriété et droits civils. Partagé : immigration, agriculture
- Onze nations autochtones au Québec
- Libertés : expression (incluant la presse), association et réunion pacifique

**À retenir** – 125 : le nombre de circonscriptions et de députés à l'Assemblée nationale.

---

## Section 3 – Clé 3 : L'égalité entre les femmes et les hommes

**Texte d'étude**

La Charte des droits et libertés de la personne consacre l'égalité des sexes : les droits et
libertés y sont garantis également aux femmes et aux hommes. L'égalité est une valeur
fondamentale profondément enracinée dans la société québécoise. Les femmes et les hommes ont les
mêmes droits, les mêmes obligations et les mêmes responsabilités, dans la vie privée comme dans
la vie publique.

Les Québécoises comme les Québécois peuvent voter, signer des contrats, se marier et divorcer,
avoir le contrôle sur leur corps – notamment pour les femmes, avoir recours ou non à
l'avortement –, décider d'avoir ou non des enfants, étudier, travailler et recevoir un salaire
égal pour un travail équivalent, se porter candidat aux élections et posséder ou gérer une
entreprise.

Les femmes et les hommes ont le droit de se marier ou de s'unir librement avec la personne de
leur choix. L'âge minimal pour consentir au mariage sans autorisation d'un tribunal est de
18 ans. La loi québécoise considère le mariage comme l'union de deux personnes, de sexe
différent ou de même sexe. Les mariages bigames ou polygames sont interdits. En cas de divorce,
la femme et l'homme ont les mêmes droits et les mêmes responsabilités.

Les responsabilités familiales se partagent : la gestion des biens et des finances, le choix du
lieu de résidence, l'éducation des enfants. Autant la femme que l'homme a le droit de choisir le
nom de son enfant. La société québécoise encourage fortement une participation égale du couple
aux tâches domestiques et aux soins des enfants.

L'accès aux programmes d'études est égalitaire : les femmes peuvent être admises à des
programmes traditionnellement masculins comme la construction, l'ingénierie ou le pilotage
d'avion, et les hommes à des programmes comme les soins infirmiers. Sur le marché du travail,
tout employeur doit s'assurer de ne pas faire de discrimination fondée sur le sexe. Les femmes
ont accès à tous les postes politiques et sont encouragées à occuper des postes de direction.

**Points clés**
- L'égalité femmes-hommes est inscrite dans la Charte des droits et libertés de la personne
- Âge minimal pour se marier sans autorisation du tribunal : 18 ans
- Le mariage est l'union de deux personnes, de sexe différent ou de même sexe
- Mariages bigames et polygames interdits
- Salaire égal pour un travail équivalent
- Responsabilités familiales partagées ; les deux parents choisissent le nom de l'enfant
- Autonomie économique complète des femmes

**À retenir** – 18 ans : l'âge minimal pour consentir au mariage sans autorisation d'un tribunal.

---

## Section 4 – Clé 4 : Les droits et les responsabilités

**Texte d'étude**

La Charte des droits et libertés de la personne est une loi adoptée par l'Assemblée nationale.
Elle se situe au-dessus des autres lois et règlements du Québec : toutes les lois québécoises
doivent la respecter. Elle s'applique à toutes les personnes qui se trouvent au Québec, ainsi
qu'aux groupes, organismes, entreprises et au gouvernement.

Les droits s'exercent en société et ont donc des limites. Ils ne doivent pas entrer en conflit
avec les valeurs démocratiques, la laïcité de l'État, l'importance accordée à la protection du
français, l'ordre public et le bien-être de la population québécoise.

Chaque personne a droit à la vie, à la sûreté et à l'intégrité. Il est interdit d'utiliser la
force pour porter atteinte à la vie, à l'intégrité ou à la liberté d'une personne. Toute
personne dont la vie est menacée a le droit d'être secourue, et chacun doit lui porter secours,
sauf si la situation est dangereuse pour soi-même ou pour autrui. Tous les actes visant à nuire
physiquement, psychologiquement ou émotionnellement sont interdits : punitions corporelles avec des
objets, harcèlement sexuel, harcèlement moral.

Le consentement doit être clair, libre et éclairé – ce sont les trois conditions de sa validité.
Une personne ne peut pas consentir si elle est incapable de le formuler clairement, par exemple
en raison d'une intoxication sévère ou d'une perte de conscience. Le consentement n'est pas
valide s'il est obtenu par la menace, la force, la fraude, une position d'autorité ou en
profitant de la vulnérabilité d'autrui. Une personne peut cesser de consentir à tout moment, et
le consentement doit être donné à chaque geste. L'âge du consentement à une relation sexuelle
est de 16 ans.

La Charte protège la dignité, l'honneur, la réputation et la vie privée. Il est interdit de
publier des informations fausses pour nuire à quelqu'un, de révéler des renseignements
personnels d'autrui, ou de diffuser des images intimes d'une autre personne sans son
consentement. Le domicile est inviolable.

Le droit à l'égalité protège contre la discrimination, interdite dans tous les domaines de la
vie quotidienne : emploi, logement, accès aux commerces et aux lieux publics. Il y a
discrimination lorsque trois éléments sont réunis : une distinction, une exclusion ou une
préférence ; fondée sur une caractéristique personnelle énumérée dans la Charte (race, couleur,
sexe, identité ou expression de genre, grossesse, orientation sexuelle, état civil, âge,
religion, convictions politiques, langue, origine ethnique ou nationale, condition sociale,
handicap) ; qui nuit à l'exercice des droits en toute égalité. Une personne qui croit être
victime de discrimination peut porter plainte à la Commission des droits de la personne et des
droits de la jeunesse. Les thérapies de conversion sont interdites.

Les droits économiques et sociaux couvrent notamment l'éducation, la protection des enfants, des
personnes âgées et des personnes handicapées, des conditions de travail sécuritaires,
l'assistance financière et le droit de vivre dans un environnement sain. La Loi sur la
protection de la jeunesse rend obligatoire le signalement de toute situation pouvant
compromettre la sécurité ou le développement d'une personne de moins de 18 ans.

Les droits judiciaires protègent les personnes arrêtées ou accusées : connaître les motifs de
son arrestation, prévenir ses proches, recourir à un avocat, être traité avec humanité. Les
policiers ne peuvent fouiller ou perquisitionner sans mandat, sauf exception. Toute personne a
droit à un procès juste et équitable, est présumée innocente jusqu'à preuve du contraire, et a
le droit de garder le silence.

**Points clés**
- La Charte se situe au-dessus des autres lois du Québec
- Limites aux droits : valeurs démocratiques, laïcité, protection du français, ordre public,
  bien-être de la population
- Consentement : clair, libre et éclairé – et révocable à tout moment
- Âge du consentement sexuel : 16 ans
- Devoir de porter secours à une personne dont la vie est en danger
- Discrimination : distinction + motif de la Charte + atteinte à l'exercice des droits
- Plainte : Commission des droits de la personne et des droits de la jeunesse
- Signalement obligatoire (protection de la jeunesse) pour les moins de 18 ans
- Présomption d'innocence et droit au silence

**À retenir** – Clair, libre et éclairé : les trois conditions d'un consentement valide.

---

## Section 5 – Clé 5 : Le Québec est une société laïque

**Texte d'étude**

L'État québécois et ses institutions sont laïques : leurs décisions et leurs actions sont
indépendantes des pouvoirs religieux. Il n'en a pas toujours été ainsi – l'Église catholique a
joué un rôle important, surtout en santé et en éducation. À partir des années 1960, l'influence
de la religion a diminué dans la vie collective et les institutions se sont laïcisées
progressivement.

La laïcité de l'État repose sur la séparation de l'État et des religions, sur sa neutralité
religieuse, sur l'égalité de toutes les citoyennes et de tous les citoyens, ainsi que sur la
liberté de conscience et la liberté de religion. Chaque personne a le droit d'avoir les
croyances religieuses de son choix, de les pratiquer et de les exprimer. La religion fait partie
des motifs pour lesquels la discrimination et le harcèlement sont interdits.

En 2019, le Québec a adopté la Loi sur la laïcité de l'État. Depuis le 27 mars 2019, elle
interdit le port d'un signe religieux, dans l'exercice de leurs fonctions, à certaines personnes
en situation d'autorité : notamment les nouvelles policières et nouveaux policiers, les
nouvelles procureures et nouveaux procureurs aux poursuites criminelles et pénales, ainsi que
les nouvelles enseignantes et nouveaux enseignants des écoles publiques primaires et
secondaires. Les personnes qui portaient un signe religieux et qui étaient en poste le
27 mars 2019 conservent le droit de le porter, tant qu'elles exercent la même fonction au sein
de la même organisation.

À des fins de vérification d'identité ou de sécurité, une personne doit avoir le visage
découvert pour recevoir certains services gouvernementaux, et le personnel du gouvernement doit
offrir les services à visage découvert.

Le Québec est le seul État d'Amérique du Nord à avoir inscrit la laïcité dans ses lois. La
laïcité de l'État est enchâssée dans la Charte des droits et libertés de la personne.

**Points clés**
- Laïcité : séparation de l'État et des religions, neutralité religieuse, égalité, liberté de
  conscience et de religion
- Loi sur la laïcité de l'État adoptée en 2019
- Depuis le 27 mars 2019 : interdiction du signe religieux pour les nouveaux policiers,
  procureurs et enseignants du public primaire et secondaire, dans l'exercice de leurs fonctions
- Droit acquis pour les personnes en poste le 27 mars 2019, même fonction et même organisation
- Visage découvert exigé pour certains services gouvernementaux
- Seul État d'Amérique du Nord à avoir inscrit la laïcité dans ses lois

**À retenir** – 2019 : l'adoption de la Loi sur la laïcité de l'État.

---

# 2. CARTES MÉMOIRE (20 flashcards)

Recto = question (fond marine), verso = réponse (fond doré). Se retournent au clic, animation
3D discrète. Sur mobile, elles s'empilent en une colonne. Ajouter un bouton « Mélanger les
cartes ».

| # | Recto (question) | Verso (réponse) |
|---|---|---|
| 1 | Quelle est la langue officielle du Québec ? | Le français. C'est la seule langue officielle. |
| 2 | Qu'est-ce que la loi 101 ? | La Charte de la langue française, adoptée en 1977. |
| 3 | En combien de circonscriptions le Québec est-il divisé ? | 125 circonscriptions, donc 125 députés. |
| 4 | Où siègent les députés du Québec ? | À l'Assemblée nationale, dans la ville de Québec. |
| 5 | Que signifie la primauté du droit ? | Chaque personne, tout comme l'État, doit respecter la loi. Personne n'est au-dessus de la loi. |
| 6 | Quels sont les trois pouvoirs ? | Législatif (adopte les lois), exécutif (le gouvernement), judiciaire (les tribunaux). |
| 7 | Quelles conditions faut-il remplir pour voter ? | Avoir 18 ans et plus, la citoyenneté canadienne, et être domicilié au Québec depuis six mois. |
| 8 | Combien de nations autochtones compte le Québec ? | Onze. |
| 9 | Quel est l'âge du consentement à une relation sexuelle ? | 16 ans. |
| 10 | Quelles sont les trois conditions d'un consentement valide ? | Il doit être clair, libre et éclairé. |
| 11 | Quel est l'âge minimal pour se marier sans autorisation d'un tribunal ? | 18 ans. |
| 12 | Qu'est-ce que le mariage selon la loi québécoise ? | L'union de deux personnes, de sexe différent ou de même sexe. |
| 13 | Quelle loi encadre la laïcité au Québec ? | La Loi sur la laïcité de l'État, adoptée en 2019. |
| 14 | Depuis le 27 mars 2019, qui ne peut porter de signe religieux au travail ? | Notamment les nouveaux policiers, procureurs et enseignants des écoles publiques primaires et secondaires. |
| 15 | Où porter plainte si l'on croit être victime de discrimination ? | À la Commission des droits de la personne et des droits de la jeunesse. |
| 16 | Quelles sont les cinq clés du guide ? | Société francophone, société démocratique, égalité femmes-hommes, droits et responsabilités, société laïque. |
| 17 | Quelle est la place de la Charte des droits et libertés de la personne ? | Elle se situe au-dessus des autres lois et règlements du Québec. |
| 18 | Quel salaire pour un travail équivalent ? | Les femmes et les hommes ont droit au même salaire et aux mêmes conditions. |
| 19 | Existe-t-il un devoir de porter secours ? | Oui. Toute personne dont la vie est menacée a le droit d'être secourue, sauf si la situation est dangereuse pour soi ou pour autrui. |
| 20 | Quelles sont les limites aux droits de la personne ? | Les valeurs démocratiques, la laïcité de l'État, la protection du français, l'ordre public et le bien-être de la population. |

---

# 3. QUIZ – 50 QUESTIONS

## Fonctionnement

- Les 50 questions à la suite, une à la fois.
- **Correction immédiate** dès qu'on clique une réponse : la bonne réponse passe au vert, une
  mauvaise réponse choisie passe au rouge, et un court message apparaît avec la référence de la
  clé (ex. « Clé 2 – Société démocratique »).
- Une question ne peut être répondue qu'une seule fois.
- Bouton « Question suivante ».
- Bouton « Voir mon score maintenant » disponible en tout temps.
- Score final sur 50, avec l'équivalence : « Le vrai examen exige 75 % (15 sur 20). »
- Barre de progression (question X sur 50).

## IMPORTANT – Équilibrer les réponses

Après avoir intégré les questions, **mélange l'ordre des choix de façon déterministe** pour que
la position de la bonne réponse soit répartie à environ 25 % par position (A, B, C, D), et
recalcule l'index de la bonne réponse. Sinon le quiz devient devinable. Les questions vrai/faux
sont exclues de cet équilibrage.

## Les questions

Format : question, choix, **bonne réponse en gras**, clé de référence.

### L'attestation et l'évaluation

1. Combien de questions comporte l'évaluation en ligne ? – 15 / **20** / 25 / 50 – *L'attestation*
2. Quel est le seuil de passage de l'évaluation ? – 50 % / 60 % / **75 %** / 90 % – *L'attestation*
3. Combien de bonnes réponses faut-il pour réussir ? – 10 sur 20 / 12 sur 20 / **15 sur 20** / 18 sur 20 – *L'attestation*
4. Combien de temps avez-vous pour réaliser l'évaluation ? – 1 heure / 90 minutes / **3 heures** / Aucune limite – *L'attestation*
5. Combien de temps l'attestation est-elle valide ? – 6 mois / 1 an / **2 ans** / 5 ans – *L'attestation*
6. En cas d'échec, quel délai minimal doit s'écouler avant un nouvel essai ? – 48 heures / 1 semaine / **2 semaines** / 1 mois – *L'attestation*

### Clé 1 – Société francophone

7. Quelle est la langue officielle du Québec ? – L'anglais / **Le français** / Le français et l'anglais / L'espagnol – *Clé 1*
8. En quelle année le Québec a-t-il adopté la Charte de la langue française ? – 1867 / **1977** / 1995 / 2019 – *Clé 1*
9. Comment appelle-t-on aussi la Charte de la langue française ? – La loi 21 / La loi 96 / **La loi 101** / La Charte des droits – *Clé 1*
10. Le Québec est la seule société majoritairement francophone en Amérique du Nord. – **Vrai** / Faux – *Clé 1*
11. On estime à quelle proportion le nombre de francophones en Amérique du Nord ? – **2 %** / 10 % / 25 % / 50 % – *Clé 1*
12. Les cours de français offerts par le gouvernement du Québec aux personnes immigrantes sont : – payants / **gratuits** / réservés aux étudiants / offerts à Montréal seulement – *Clé 1*
13. Sauf exception, les enfants des personnes immigrantes doivent fréquenter l'école de langue française jusqu'à la fin de leurs études secondaires. – **Vrai** / Faux – *Clé 1*
14. Selon la Charte de la langue française, le français est : – la langue de l'État seulement / la langue du travail seulement / **la langue de l'État et de la Loi, ainsi que la langue normale et habituelle du travail, de l'enseignement, des communications, du commerce et des affaires** / une langue parmi d'autres – *Clé 1*

### Clé 2 – Société démocratique

15. En combien de circonscriptions le territoire québécois est-il divisé ? – 75 / 100 / **125** / 338 – *Clé 2*
16. Où siègent les députées et les députés du Québec ? – À Ottawa / **À l'Assemblée nationale** / Au Sénat / À la Cour du Québec – *Clé 2*
17. Qui devient premier ministre ou première ministre ? – La personne la plus âgée de l'Assemblée / **Le chef ou la cheffe du parti qui fait élire le plus grand nombre de députés** / La personne nommée par le lieutenant-gouverneur / La personne élue directement par toute la population – *Clé 2*
18. Pour voter au Québec, il faut notamment : – avoir 16 ans / **avoir 18 ans et plus, la citoyenneté canadienne, et être domicilié au Québec depuis six mois** / payer des impôts au Québec / parler français – *Clé 2*
19. Il est permis d'obliger un membre de sa famille à voter pour un candidat en particulier. – Vrai / **Faux** – *Clé 2*
20. Que signifie la primauté du droit ? – Les lois s'appliquent différemment selon les personnes / L'État est au-dessus de la loi / **Chaque personne, tout comme l'État, doit respecter la loi** / Seuls les juges doivent respecter la loi – *Clé 2*
21. Quels sont les trois pouvoirs fondamentaux de l'État québécois ? – Municipal, provincial, fédéral / **Législatif, exécutif, judiciaire** / Politique, religieux, économique / Civil, criminel, administratif – *Clé 2*
22. Qui adopte les lois au Québec ? – Le gouvernement / Les tribunaux / **Le Parlement** / Les municipalités – *Clé 2*
23. Une personne qui souhaite faire réexaminer le résultat d'une élection dans une circonscription peut : – organiser une manifestation violente / **demander un dépouillement judiciaire du vote** / refuser le résultat / exiger une nouvelle élection – *Clé 2*
24. Combien de nations autochtones compte le Québec ? – 5 / 8 / **11** / 15 – *Clé 2*
25. Une personne qui n'a pas la citoyenneté canadienne peut : – voter aux élections provinciales / **s'impliquer dans un parti politique, même si elle ne peut pas voter** / se présenter comme candidate / ne rien faire en politique – *Clé 2*
26. Quelles compétences relèvent du gouvernement fédéral ? – L'éducation / Les municipalités / **La défense militaire, la politique étrangère et le droit criminel** / La propriété et les droits civils – *Clé 2*

### Clé 3 – Égalité entre les femmes et les hommes

27. Au Québec, les femmes et les hommes ont les mêmes droits, et cette égalité est notamment inscrite dans la Charte des droits et libertés de la personne. – **Vrai** / Faux – *Clé 3*
28. Quel est l'âge minimal pour consentir au mariage sans devoir obtenir l'autorisation d'un tribunal ? – 14 ans / 16 ans / **18 ans** / 21 ans – *Clé 3*
29. Selon la loi québécoise, le mariage est : – l'union d'un homme et d'une femme seulement / **l'union de deux personnes, de sexe différent ou de même sexe** / permis entre plusieurs personnes / interdit aux personnes immigrantes – *Clé 3*
30. Les mariages bigames ou polygames au Québec sont : – permis / permis avec autorisation / **interdits** / permis s'ils ont été célébrés à l'étranger – *Clé 3*
31. Pour un travail équivalent, les femmes et les hommes ont droit : – **au même salaire et aux mêmes conditions de travail** / À un salaire selon la situation familiale / À des salaires différents / À un salaire négocié par la famille – *Clé 3*
32. Qui a le droit de choisir le nom de l'enfant ? – Le père seulement / La mère seulement / **Autant la femme que l'homme** / Les grands-parents – *Clé 3*
33. Une femme peut être admise à un programme d'études considéré comme traditionnellement masculin, comme l'ingénierie ou la construction. – **Vrai** / Faux – *Clé 3*
34. En cas de divorce, la femme et l'homme ont : – **les mêmes droits et les mêmes responsabilités** / des droits selon leur revenu / des droits selon leur religion / aucun droit – *Clé 3*

### Clé 4 – Droits et responsabilités

35. La Charte des droits et libertés de la personne : – est une loi comme les autres / **se situe au-dessus des autres lois et règlements du Québec** / ne s'applique qu'aux citoyens canadiens / s'applique seulement au gouvernement – *Clé 4*
36. Quel est l'âge du consentement à une relation sexuelle au Québec ? – 14 ans / **16 ans** / 18 ans / 21 ans – *Clé 4*
37. Pour être valide, le consentement doit être : – écrit / donné devant témoin / **clair, libre et éclairé** / donné une seule fois pour toute la relation – *Clé 4*
38. Une personne peut arrêter de consentir à une activité sexuelle à tout moment. – **Vrai** / Faux – *Clé 4*
39. Laquelle de ces situations constitue de la discrimination ? – Refuser un emploi à une personne qui n'a pas le diplôme requis / **Refuser un emploi à une personne en raison de son origine ethnique** / Refuser un emploi à une personne qui n'a pas l'expérience demandée / Refuser un emploi après une entrevue – *Clé 4*
40. Les punitions corporelles avec des objets ou pouvant causer des blessures sont : – permises pour les parents / **interdites** / permises à la maison seulement / permises jusqu'à un certain âge – *Clé 4*
41. Toute personne dont la vie est menacée a le droit d'être secourue, et chaque personne doit lui porter secours, sauf si la situation est dangereuse pour elle-même ou pour autrui. – **Vrai** / Faux – *Clé 4*
42. Publier ou diffuser des images intimes d'une autre personne sans son consentement est : – permis entre conjoints / permis si l'image est ancienne / **interdit** / permis dans un groupe privé – *Clé 4*
43. Où une personne qui croit être victime de discrimination peut-elle déposer une plainte ? – À l'Office québécois de la langue française / **À la Commission des droits de la personne et des droits de la jeunesse** / Au ministère de l'Immigration / À sa municipalité – *Clé 4*
44. Au Québec, les thérapies de conversion sont : – permises avec le consentement de la personne / **interdites** / permises en milieu religieux / permises pour les adultes – *Clé 4*
45. Les droits de la personne ne doivent pas entrer en conflit avec, notamment : – **les valeurs démocratiques, la laïcité de l'État, la protection du français, l'ordre public et le bien-être de la population** / l'opinion de la majorité / les traditions familiales / les croyances religieuses individuelles – *Clé 4*

### Clé 5 – Société laïque

46. En quelle année le Québec a-t-il adopté la Loi sur la laïcité de l'État ? – 1977 / 2001 / **2019** / 2024 – *Clé 5*
47. Depuis le 27 mars 2019, le port d'un signe religieux dans l'exercice de leurs fonctions est interdit notamment : – À tous les fonctionnaires / **aux nouveaux policiers, aux nouveaux procureurs aux poursuites criminelles et pénales et aux nouveaux enseignants des écoles publiques primaires et secondaires** / À toute la population / aux étudiants – *Clé 5*
48. Les personnes qui portaient un signe religieux et qui étaient en poste le 27 mars 2019 conservent le droit de le porter tant qu'elles exercent la même fonction au sein de la même organisation. – **Vrai** / Faux – *Clé 5*
49. Pour recevoir certains services gouvernementaux, à des fins de vérification d'identité ou de sécurité, une personne doit : – présenter un passeport / **avoir le visage découvert** / parler français / avoir la citoyenneté – *Clé 5*
50. La laïcité de l'État repose notamment sur : – l'interdiction de toute religion / **la séparation de l'État et des religions, sa neutralité religieuse, l'égalité de toutes les personnes ainsi que la liberté de conscience et la liberté de religion** / la promotion d'une religion officielle / l'interdiction de pratiquer sa religion – *Clé 5*

---

# 4. RÉVISION RAPIDE – 20 faits essentiels

Section « Révision 5 minutes » : une liste numérotée, claire, à relire juste avant l'évaluation.

1. Le français est la seule langue officielle du Québec.
2. La Charte de la langue française (loi 101) a été adoptée en 1977.
3. Le Québec est la seule société majoritairement francophone en Amérique du Nord (environ 2 % des francophones du continent).
4. Le territoire québécois compte 125 circonscriptions et 125 députés.
5. Les députés siègent à l'Assemblée nationale, dans la ville de Québec.
6. Pour voter : 18 ans et plus, citoyenneté canadienne, domicile au Québec depuis six mois.
7. Le vote est libre et confidentiel : nul ne peut obliger quiconque à voter d'une certaine façon ni à révéler son choix.
8. Primauté du droit : personne n'est au-dessus de la loi, pas même l'État.
9. Trois pouvoirs : législatif (adopte les lois), exécutif (gouverne), judiciaire (interprète et fait respecter la loi).
10. Le Québec compte onze nations autochtones.
11. L'immigration et l'agriculture sont des compétences partagées entre Québec et Ottawa.
12. L'égalité entre les femmes et les hommes est inscrite dans la Charte des droits et libertés de la personne.
13. Le mariage est l'union de deux personnes, de sexe différent ou de même sexe. L'âge minimal sans autorisation du tribunal est de 18 ans.
14. Les mariages bigames ou polygames sont interdits.
15. Salaire égal pour un travail équivalent.
16. La Charte des droits et libertés de la personne se situe au-dessus des autres lois du Québec.
17. L'âge du consentement sexuel est de 16 ans. Le consentement doit être clair, libre et éclairé, et peut être retiré à tout moment.
18. Une plainte pour discrimination se dépose à la Commission des droits de la personne et des droits de la jeunesse.
19. La Loi sur la laïcité de l'État a été adoptée en 2019. Depuis le 27 mars 2019, les nouveaux policiers, procureurs et enseignants du public primaire et secondaire ne peuvent porter de signe religieux dans l'exercice de leurs fonctions.
20. L'évaluation : 20 questions, 15 bonnes réponses exigées (75 %), 3 heures, attestation valide 2 ans.

---

# 5. AVERTISSEMENT ET LIENS OFFICIELS

Encadré à afficher en bas de la page, toujours visible :

> Cet outil de pratique est offert gratuitement à titre informatif par MDPL Immigration. Il ne
> remplace ni le Guide pratique officiel du ministère de l'Immigration, de la Francisation et de
> l'Intégration, ni l'évaluation officielle. Les questions présentées ici ne sont pas les
> questions de l'évaluation officielle. Vérifiez toujours l'information à jour auprès du MIFI.

Liens officiels (vérifier qu'ils fonctionnent) :
- Obtenir une attestation d'apprentissage des valeurs – https://www.quebec.ca/immigration/obtenir-attestation-valeurs
- Évaluation en ligne – https://www.quebec.ca/immigration/obtenir-attestation-valeurs/evaluation-en-ligne-attestation-valeurs
- Guide pratique officiel (PDF) – https://cdn-contenu.quebec.ca/cdn-contenu/immigration/publications/fr/GUI_Pratique_Valeurs_FR.pdf

# 6. CTA MDPL

En bas de page, encadré sobre :

> **Votre demande au PSTQ mérite un accompagnement professionnel.**
> L'attestation des valeurs n'est qu'une des conditions à remplir. MDPL Immigration vous
> accompagne dans l'ensemble de votre démarche de sélection permanente au Québec.
> [Prendre rendez-vous]

---

# VÉRIFICATION FINALE (avant de dire « c'est fait »)

- `node -c assets/script.js` – aucune erreur de syntaxe.
- Les 4 onglets fonctionnent (Guide, Cartes mémoire, Quiz, Révision rapide).
- Le guide contient bien les 6 sections, chacune avec texte, points clés et encadré « À retenir ».
- 20 cartes mémoire, qui se retournent au clic, et le bouton « Mélanger » fonctionne.
- Le quiz contient exactement **50 questions**, aucune dupliquée.
- La correction immédiate s'affiche à chaque réponse, avec la clé de référence.
- La position des bonnes réponses est équilibrée (environ 25 % par position, questions à
  4 choix seulement).
- Le score final s'affiche sur 50.
- La révision rapide contient 20 faits.
- La carte apparaît sur `outils.html`, avec le même design que les autres.
- L'entrée apparaît dans le menu déroulant « Nos outils ».
- **Aucun emoji.** Aucune protection d'accès. Aucun lien de paiement.
- Aucun débordement sur téléphone et tablette, aucun lien ni image cassés, aucune erreur console.
