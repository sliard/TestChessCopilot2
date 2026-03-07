# Feature : Échiquier Interactif

> 📝 **Statut** : Ready
> 
> 📅 **Date de création** : 2026-02-15
> 
> 👤 **Auteur** : Équipe Chess Training

## 📋 Résumé

Implémenter un composant d'échiquier interactif permettant de visualiser et naviguer dans les coups d'une ouverture. Ce composant est réutilisable dans différentes parties de l'application (consultation publique, gestion personnelle, mode entraînement futur).

## 🎯 Objectifs

- [x] Afficher un échiquier standard avec pièces
- [x] Naviguer dans les coups (suivant, précédent, début, fin)
- [x] Afficher la notation algébrique des coups
- [x] Interface responsive (desktop et mobile)
- [x] Animations fluides lors des déplacements
- [x] Réutilisable dans toute l'application

## 👥 User Stories

### US1 : Visualisation de l'échiquier
**En tant que** utilisateur (authentifié ou non),  
**je veux** voir un échiquier clair avec les pièces positionnées correctement,  
**afin de** comprendre visuellement la position.

**Critères d'acceptation :**
- [x] Échiquier 8x8 avec alternance cases blanches/noires
- [x] Pièces affichées avec des symboles Unicode ou images
- [x] Coordonnées visibles (a-h, 1-8)
- [x] Taille adaptative selon l'écran
- [x] Lisible sur mobile (minimum 300px)

### US2 : Navigation dans les coups
**En tant que** utilisateur,  
**je veux** naviguer séquentiellement dans les coups d'une ouverture,  
**afin de** comprendre la progression de l'ouverture.

**Critères d'acceptation :**
- [x] Boutons : |◀ (début), ◀ (précédent), ▶ (suivant), ▶| (fin)
- [x] État initial : position de départ des échecs
- [x] Chaque clic sur "suivant" joue le coup suivant
- [x] Chaque clic sur "précédent" annule le dernier coup
- [x] Animation fluide du déplacement de la pièce
- [x] Désactivation des boutons aux extrémités (début/fin)

### US3 : Affichage de la notation
**En tant que** utilisateur,  
**je veux** voir les coups joués en notation algébrique,  
**afin de** apprendre la notation standard.

**Critères d'acceptation :**
- [x] Liste des coups en notation algébrique (ex: 1.e4 e5 2.Nf3 Nc6)
- [x] Mise en surbrillance du coup actuel
- [x] Possibilité de cliquer sur un coup pour sauter à cette position
- [x] Scroll automatique pour garder le coup actuel visible
- [x] Format lisible : numéros de coups + coups blancs/noirs

### US4 : Modes d'affichage
**En tant que** utilisateur,  
**je veux** pouvoir changer l'orientation de l'échiquier,  
**afin de** voir la position du point de vue des noirs ou des blancs.

**Critères d'acceptation :**
- [x] Toggle pour inverser l'échiquier (blancs en bas / noirs en bas)
- [x] Bouton clair pour changer l'orientation
- [x] Coordonnées adaptées selon l'orientation
- [x] État sauvegardé pendant la session

### US5 : Responsive et accessibilité
**En tant que** utilisateur mobile,  
**je veux** utiliser l'échiquier confortablement sur mon téléphone,  
**afin de** étudier les ouvertures en déplacement.

**Critères d'acceptation :**
- [x] Échiquier adapté à la largeur de l'écran mobile
- [x] Boutons de contrôle accessibles au pouce
- [x] Pas de scroll horizontal nécessaire
- [x] Touches clavier (←/→) pour navigation (desktop)
- [x] Attributs ARIA pour accessibilité

## 🏗️ Conception technique

### Backend

**Aucun endpoint spécifique pour cette feature** — L'échiquier est un composant frontend pur qui reçoit les coups en paramètre depuis les features 002 et 003.

### Frontend

#### Composants principaux

##### `Chessboard`
Composant principal de l'échiquier.

**Props :**
```typescript
interface ChessboardProps {
  moves: string;  // ex: "1.e4 e5 2.Nf3 Nc6"
  orientation?: 'white' | 'black';  // default: 'white'
  showCoordinates?: boolean;  // default: true
  showControls?: boolean;  // default: true
  onMoveChange?: (moveIndex: number) => void;
  className?: string;
}
```

**State :**
```typescript
const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
const [position, setPosition] = useState(new Chess());
const [flipped, setFlipped] = useState(false);
```

**Fonctionnalités :**
- Initialise chess.js avec position de départ
- Parse les coups et les stocke dans un tableau
- Applique les coups jusqu'à currentMoveIndex
- Gère la navigation (next, prev, first, last)

##### `ChessboardSquare`
Composant pour une case de l'échiquier.

**Props :**
```typescript
interface ChessboardSquareProps {
  piece?: Piece;  // { type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k', color: 'w' | 'b' }
  position: string;  // ex: 'e4'
  isLight: boolean;
  isHighlighted?: boolean;
}
```

##### `ChessboardControls`
Composant des contrôles de navigation.

**Props :**
```typescript
interface ChessboardControlsProps {
  currentMove: number;
  totalMoves: number;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  disabled?: boolean;
}
```

##### `MovesList`
Composant affichant la liste des coups.

**Props :**
```typescript
interface MovesListProps {
  moves: string[];  // ['e4', 'e5', 'Nf3', 'Nc6', ...]
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}
```

#### Hooks

##### `useChessboard(moves: string)`
Hook personnalisé gérant la logique de l'échiquier.

```typescript
interface UseChessboardReturn {
  position: Chess;
  currentMove: number;
  totalMoves: number;
  parsedMoves: string[];
  goToMove: (index: number) => void;
  nextMove: () => void;
  previousMove: () => void;
  firstMove: () => void;
  lastMove: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const useChessboard = (moves: string): UseChessboardReturn => {
  // Logique de parsing et navigation
};
```

##### `useKeyboardNavigation(callbacks)`
Hook pour navigation au clavier.

```typescript
export const useKeyboardNavigation = ({
  onNext,
  onPrevious,
  onFirst,
  onLast
}: KeyboardCallbacks) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'Home') onFirst();
      if (e.key === 'End') onLast();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, onFirst, onLast]);
};
```

#### Utilitaires

##### `movesParser.ts`
Parse la notation algébrique.

```typescript
export const parseMoves = (movesString: string): string[] => {
  // "1.e4 e5 2.Nf3 Nc6" => ['e4', 'e5', 'Nf3', 'Nc6']
  return movesString
    .split(/\s+/)
    .filter(move => !/^\d+\./.test(move))  // Retirer numéros
    .filter(Boolean);
};
```

##### `pieceRenderer.ts`
Rendu des pièces.

```typescript
const PIECE_SYMBOLS = {
  'wp': '♙', 'wn': '♘', 'wb': '♗', 'wr': '♖', 'wq': '♕', 'wk': '♔',
  'bp': '♟', 'bn': '♞', 'bb': '♝', 'br': '♜', 'bq': '♛', 'bk': '♚'
};

export const getPieceSymbol = (piece: Piece): string => {
  return PIECE_SYMBOLS[`${piece.color}${piece.type}`] || '';
};
```

#### Styles (CSS/Tailwind)

```css
/* Échiquier responsive */
.chessboard {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  aspect-ratio: 1;
  max-width: 600px;
  border: 2px solid #333;
}

.square {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(2rem, 5vw, 4rem);
  transition: background-color 0.3s;
}

.square.light {
  background-color: #f0d9b5;
}

.square.dark {
  background-color: #b58863;
}

.square.highlighted {
  background-color: rgba(255, 255, 0, 0.5);
}
```

#### Alternatives : Utiliser react-chessboard

Si le temps de développement est limité, utiliser la librairie `react-chessboard` :

```tsx
import { Chessboard } from 'react-chessboard';

const ChessOpeningViewer = ({ moves }: { moves: string }) => {
  const [position, setPosition] = useState(new Chess());
  const [currentMove, setCurrentMove] = useState(0);
  const parsedMoves = parseMoves(moves);

  const goToMove = (index: number) => {
    const chess = new Chess();
    for (let i = 0; i <= index; i++) {
      chess.move(parsedMoves[i]);
    }
    setPosition(chess);
    setCurrentMove(index);
  };

  return (
    <div>
      <Chessboard position={position.fen()} />
      <ChessboardControls
        currentMove={currentMove}
        totalMoves={parsedMoves.length}
        onNext={() => goToMove(currentMove + 1)}
        onPrevious={() => goToMove(currentMove - 1)}
        // ...
      />
    </div>
  );
};
```

## 🎨 Maquettes / Wireframes

### Desktop - Mode Normal
```
┌───────────────────────────────────────────┐
│                                           │
│   ┌─────────────────────┐  ┌───────────┐│
│   │ a  b  c  d  e  f  g  h│  │ Coups:    ││
│   │ ┌──┬──┬──┬──┬──┬──┬──┐│  │           ││
│ 8 │ │♜ │♞ │♝ │♛ │♚ │♝ │♞ │♜││  │ 1. e4 e5  ││
│   │ ├──┼──┼──┼──┼──┼──┼──┤│  │ 2. Nf3 Nc6││
│ 7 │ │♟ │♟ │♟ │♟ │  │♟ │♟ │♟││  │ 3. Bb5    ││
│   │ ├──┼──┼──┼──┼──┼──┼──┤│  │           ││
│ 6 │ │  │  │  │  │  │  │  │ ││  └───────────┘│
│   │ ├──┼──┼──┼──┼──┼──┼──┤│                 │
│ 5 │ │  │  │  │  │♟ │  │  │ ││  [🔄 Inverser]│
│   │ ├──┼──┼──┼──┼──┼──┼──┤│                 │
│ 4 │ │  │  │  │  │♙ │  │  │ ││                 │
│   │ ├──┼──┼──┼──┼──┼──┼──┤│                 │
│ 3 │ │  │  │  │  │  │  │  │ ││                 │
│   │ ├──┼──┼──┼──┼──┼──┼──┤│                 │
│ 2 │ │♙ │♙ │♙ │♙ │  │♙ │♙ │♙││                 │
│   │ ├──┼──┼──┼──┼──┼──┼──┤│                 │
│ 1 │ │♖ │♘ │♗ │♕ │♔ │♗ │♘ │♖││                 │
│   │ └──┴──┴──┴──┴──┴──┴──┘│                 │
│   └─────────────────────┘                 │
│                                           │
│   [|◀] [◀] Coup 2/5 [▶] [▶|]            │
│                                           │
└───────────────────────────────────────────┘
```

### Mobile - Mode Compact
```
┌─────────────────────────┐
│ ┌─────────────────────┐ │
│ │    Échiquier        │ │
│ │     (8x8)           │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ Coups: 1.e4 e5 2.Nf3... │
│                         │
│ [|◀] [◀] 2/5 [▶] [▶|]  │
└─────────────────────────┘
```

## 📊 Données de test

```json
{
  "testCases": [
    {
      "name": "Ouverture courte",
      "moves": "1.e4 e5",
      "expectedMoves": ["e4", "e5"],
      "expectedFinalFen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
    },
    {
      "name": "Ruy Lopez",
      "moves": "1.e4 e5 2.Nf3 Nc6 3.Bb5",
      "expectedMoves": ["e4", "e5", "Nf3", "Nc6", "Bb5"],
      "expectedFinalFen": "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"
    }
  ]
}
```

## ⚠️ Risques et dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| Dépendance à chess.js | Élevé | Librairie mature et stable |
| Performance sur mobile | Moyen | Optimisation rendering, React.memo |
| Affichage des symboles Unicode | Faible | Fallback sur images si problème |
| Complexité animations | Moyen | Utiliser CSS transitions simples |
| Support navigateurs anciens | Faible | Focus sur navigateurs modernes |

## 📝 Notes

- **Option 1 (Recommandée)** : Utiliser `react-chessboard` + `chess.js` pour gagner du temps
- **Option 2** : Développer un composant custom pour contrôle total (mais plus long)
- Les animations complexes (déplacement fluide des pièces) peuvent être ajoutées en V1.1
- Considérer l'ajout d'un mode "analyse" avec flèches et surbrillances en V2.0
- Prévoir l'intégration d'un moteur d'échecs (Stockfish) pour analyse future

## ✅ Definition of Done

- [x] Composant Chessboard réutilisable créé
- [x] Parsing des coups en notation algébrique fonctionnel
- [x] Navigation dans les coups (next, prev, first, last)
- [x] Affichage correct de la position pour chaque coup
- [x] Liste des coups avec surbrillance du coup actuel
- [x] Contrôles clavier (←/→) fonctionnels
- [x] Responsive (desktop et mobile)
- [x] Tests unitaires du hook useChessboard
- [x] Tests d'intégration du composant
- [x] Documentation du composant (props, exemples)
- [x] Intégré dans Features 002 et 003
- [x] Accessibilité validée (ARIA labels)

