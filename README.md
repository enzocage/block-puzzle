# Sokoban Block Puzzle 🧩

Ein modernes, elegantes und interaktives Sokoban-Rätselspiel für den Browser, entwickelt mit reinem HTML5, CSS3 und Vanilla JavaScript. Das Spiel besticht durch ein responsives Premium-Design, lebendige CSS-Animationen und ein flexibles Kamera-System (Zoom & Pan).

---

## 🌟 Features

- **Premium-Optik & 3D-Design**: Modernes, harmonisches Farbschema mit weichem 3D-Schattenwurf und eleganten Farbübergängen.
- **10 handgefertigte Level**: Garantiert lösbare, ansteigend anspruchsvolle Sokoban-Rätsel.
- **Interaktive Kamera-Steuerung**:
  - **Zoom**: Stufenloses Zoomen per Mausrad oder Pinch-to-Zoom-Geste auf Mobilgeräten.
  - **Pan**: Verschieben des Spielfelds (Drag-to-Pan) per Mausklick & Ziehen oder Wischen auf Touchscreens.
  - **Fokus-Button**: Setzt Kamera und Zoom sofort optimal auf das aktuelle Level zurück.
- **Lebendige Charaktere**: Animierte Augen auf der Spielfigur und den Boxen, die blinzeln und sich neugierig in die jeweilige Bewegungsrichtung umschauen.
- **Micro-Animationen**: Sanfte Bewegungs-Übergänge und elastisches visuelles Feedback (Bump-Effekt) beim Anstoßen an Wände.
- **Mobile-Support**: Automatisches mobiles Steuerkreuz (D-Pad) für komfortables Spielen auf Touchscreens.
- **Saubere Codebasis**: Modularer Code mit strikter Trennung von Struktur/Design (`index.html`) und strukturierter Spiellogik (`game.js`).

---

## 🎮 Steuerung & Bedienung

| Aktion | Desktop-PCs | Mobilgeräte (Touch) |
| :--- | :--- | :--- |
| **Spielfigur bewegen** | `W`/`A`/`S`/`D` oder Pfeiltasten | Virtuelles D-Pad (▲/◀/▶/▼) |
| **Kamera verschieben** | Linke Maustaste gedrückt halten & ziehen | Mit einem Finger ziehen (Drag) |
| **Kamera zoomen** | Mausrad scrollen | Pinch-to-Zoom (zwei Finger zusammenziehen) |
| **Kamera zentrieren** | "Fokus"-Button anklicken | "Fokus"-Button anklicken |
| **Level neu starten** | "Neustart"-Button anklicken | "Neustart"-Button anklicken |

---

## 🛠️ Technische Details & Struktur

Das Projekt besteht aus zwei Kernkomponenten und benötigt keine Build-Tools oder Frameworks (reines Web-Frontend):

1. **[index.html](index.html)**:
   - Definiert die DOM-Struktur des Spielfelds, des Headers, Overlays und des mobilen Steuerkreuzes.
   - Enthält das gesamte responsive CSS-Layout mit CSS-Variablen (`--color-wall`, `--color-box` etc.), Schlüsselbild-Animationen für das Blinzeln und die Kollisions-Effekte.
2. **[game.js](game.js)**:
   - Beinhaltet die kompletten 10 Level-Matrizen.
   - Verwaltet den Spielzustand, die Bewegungs- und Kollisionsphysik.
   - Steuert das dynamische Autotiling der Wände und die Echtzeit-Berechnung des 3D-Schattenwurfs (Lichteinfall aus Richtung unten-rechts).
   - Implementiert die Event-Handler für Tastatur, Maus-Drag, Mausrad-Zoom und Touch-Gesten (inkl. Pinch-to-Zoom).

---

## 🚀 Installation & Lokaler Start

Da das Spiel rein im Browser läuft, ist keine Installation erforderlich:

1. Klone das Repository:
   ```bash
   git clone https://github.com/enzocage/block-puzzle.git
   ```
2. Navigiere in den Projektordner:
   ```bash
   cd block-puzzle
   ```
3. Öffne die `index.html` direkt in einem beliebigen modernen Webbrowser (z. B. Chrome, Firefox, Safari oder Edge).
