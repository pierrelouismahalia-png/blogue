# État de l'outil Préparation aux valeurs québécoises

## ✓ ÉTAPE 1 — TERMINÉE (Français seul)

**Commit :** `9a6c8ec` - "Ajout outil gratuit preparation valeurs quebecoises (FR)"

**Fichier :** `preparation-valeurs-quebecoises.html` (684 lignes)

**Contenu validé :**
- ✓ Guide d'étude : 6 sections (L'attestation + 5 Clés)
- ✓ Cartes mémoire : 20 cartes (flip 3D + shuffle)
- ✓ Quiz : 50 questions avec correction immédiate et clés de référence
- ✓ Révision rapide : 20 faits essentiels
- ✓ Avertissement officiel MIFI + 3 liens
- ✓ CTA MDPL avec lien Setmore
- ✓ Navigation complète (breadcrumb, header, footer)
- ✓ Responsive design (mobile/tablet/desktop)
- ✓ Guillemets ASCII droits uniquement
- ✓ Aucun emoji, accès libre, aucun lien de paiement

**État des réponses :** Distribution 10-22-18-0 (non optimale). À corriger en ÉTAPE 2.

---

## ⏳ ÉTAPE 2 — À FAIRE (Anglais + Rééquilibrage)

### 2a. Traduction anglaise
- Ajouter traductions EN via data-i18n pour interface (boutons, labels)
- Restructurer les 6 sections du guide en objets JS `{fr: "...", en: "..."}`
- Restructurer les 20 flashcards en objets `{q: {fr, en}, a: {fr, en}}`
- Restructurer les 50 questions du quiz en objets `{q: {fr, en}, opts: [{fr, en}, ...], ...}`
- Restructurer les 20 faits de révision en objets `{fr: "...", en: "..."}`
- Ajouter MutationObserver pour écouter changements de langue (pattern existant : test-citoyennete.html)

### 2b. Rééquilibrage des réponses quiz
**MÉTHODE CORRECTE (critique — ne pas oublier !) :**
1. Pour chaque question à 4 choix SEULEMENT (les 8 Vrai/Faux restent inchangées)
2. Permuter l'ordre des choix dans le tableau (Fisher-Yates déterministe, seed=42)
3. Recalculer l'index de la bonne réponse EN FONCTION DE SA NOUVELLE POSITION
4. Vérifier que la bonne réponse pointe toujours sur le MÊME TEXTE

**Cible :** Environ 10-11 bonnes réponses par position sur les 42 questions à 4 choix
(actuellement : Position 0: 10, Position 1: 22, Position 2: 18, Position 3: 0)

**DANGER :** Changer l'index seul = fausses réponses. Inacceptable pour un outil pédagogique.

### 2c. Second commit
"Ajout outil valeurs quebecoises (EN + rééquilibrage des réponses)"

---

## ⏭️ ÉTAPE 3 — À FAIRE (Intégration site)

### 3a. Ajouter la carte dans outils.html
- Cloner design de l'une des 4 cartes existantes
- Titre : "Préparation aux valeurs québécoises"
- Description : "Guide d'étude interactif, 50 questions et révision rapide. Gratuit."
- Lien : `preparation-valeurs-quebecoises.html`

### 3b. Mettre à jour le menu « Nos outils »
- Sur TOUTES les pages du site
- Ajouter nouvelle entrée : "Préparation aux valeurs québécoises"
- Insérer dans la liste du dropdown nav-dropdown-menu (après "Programme préparatoire à l'examen de citoyenneté")
- Tester navigation sur au moins 3 pages (accueil, un article, contact)

### 3c. Troisième commit
"Ajouter carte et menu pour outil préparation valeurs québécoises"

---

## 📝 Notes pour la prochaine session

- **Session précédente (17 juil 2026)** : ÉTAPE 1 seule = 684 lignes, 50 questions, 0 erreur
- **Token utilisé cette session** : ~93 % (close au limit)
- **Savepoint commit** : 752688d (avant création de l'outil)
- **Premier commit outil** : 9a6c8ec (après validation ÉTAPE 1)
- **SPEC du contenu** : SPEC-outil-valeurs-quebecoises.md (source unique, ne rien inventer)

---

## Ressources

- **Template structure** : [test-citoyennete.html](test-citoyennete.html) — cloner son style header/nav/footer
- **CSS** : [assets/styles.css](assets/styles.css) — variables `--navy`, `--gold`, `--beige`, `--white`
- **Fonts** : Playfair Display (headers), Cormorant Garamond (body), Jost (UI)
- **i18n pattern** : [test-citoyennete.html](test-citoyennete.html) MutationObserver (lignes ~300-350)
- **Lien Setmore** : `https://mdplimmigration.setmore.com/r3731150a46bca7648410cd349784a64f6980c813`

---

**Prochaine session :** Commencer par ÉTAPE 2a (traduction EN).
