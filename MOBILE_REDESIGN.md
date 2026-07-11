# 📱 M8LA Portfolio — Mobile Redesign Specification

Version: 1.0
Target: AI Developer
Project: M8LA Portfolio
Framework: Next.js + TypeScript + CSS Modules

---

# Obiettivo

Realizzare una versione mobile dedicata del portfolio.

NON deve essere una semplice versione responsive del desktop.

L'obiettivo è offrire un'esperienza nativa per smartphone mantenendo l'identità visiva, il linguaggio grafico e il branding del sito desktop.

Il redesign deve essere guidato dalla UX e non dalla semplice riduzione delle dimensioni.

---

# Filosofia del redesign

Prima di modificare qualsiasi componente, analizza quello esistente.

Per ogni sezione chiediti:

- funziona bene anche su mobile?
- l'esperienza è naturale?
- la gerarchia è corretta?
- è leggibile?
- l'animazione ha ancora senso?

Se la risposta è sì:

→ adattala.

Se la risposta è no:

→ riprogettala.

NON riscrivere tutto da zero.

NON copiare semplicemente il desktop.

L'obiettivo è ottenere la migliore esperienza possibile su smartphone mantenendo lo stile del progetto.

---

# Target utenti

Il sito mobile è pensato principalmente per:

- aziende
- recruiter
- potenziali clienti

L'utente deve percepire:

- professionalità
- cura del dettaglio
- competenze tecniche
- qualità del codice
- attenzione alla UX

Prima ancora di leggere il contenuto.

---

# Priorità

1. Fluidità
2. Performance
3. Design
4. Animazioni
5. Effetti

Mai il contrario.

---

# Performance

Il sito deve risultare perfettamente fluido anche su smartphone Android di fascia media.

Ogni scelta grafica deve essere valutata considerando:

- GPU
- CPU
- Battery
- FPS

Se un'animazione compromette la fluidità:

deve essere semplificata.

Mai eliminarla se può essere sostituita con una soluzione equivalente.

---

# Hero

La Hero è il momento più importante del sito.

Su mobile deve avere un forte effetto "wow".

L'utente deve fermarsi nei primi secondi.

---

## GridCanvas

Sul desktop il canvas segue il mouse.

Su mobile NON esiste il cursore.

Creare quindi una nuova logica.

Ad esempio:

- onde che attraversano la griglia
- pulse periodici
- movimento organico
- punto luminoso che si muove lentamente
- animazione autonoma

L'effetto deve sembrare vivo.

Mai statico.

---

## Obiettivi

L'utente non deve pensare:

"questa è la versione mobile"

ma

"questa sembra progettata apposta per il telefono."

---

# Animazioni

Ripensare tutte le animazioni.

NON limitarsi a ridurre quelle desktop.

Ogni animazione deve essere progettata considerando:

- gesture
- swipe
- scroll
- velocità del dito

Preferire:

- fade
- reveal
- scale
- opacity
- transform

Evitare:

- effetti troppo lunghi
- bounce esagerati
- animazioni pesanti

---

# Scroll

Lo scroll deve diventare parte dell'esperienza.

Ogni sezione deve comparire naturalmente.

L'utente non deve percepire stacchi.

---

# Layout

Non mantenere il layout desktop se questo penalizza il mobile.

Valutare ogni componente singolarmente.

È consentito:

- cambiare ordine interno
- cambiare disposizione
- cambiare dimensioni

Non è consentito:

- cambiare identità visiva
- cambiare palette
- cambiare stile

---

# Hero Layout

Privilegiare:

titolo

↓

sottotitolo

↓

CTA

↓

animazione

oppure

animazione

↓

titolo

↓

CTA

scegliere la soluzione che offre il maggiore impatto.

---

# Navigation

Non introdurre:

- hamburger
- sidebar
- bottom navigation

Il sito deve continuare ad essere una landing page con semplice scroll verticale.

---

# Projects

Questa sezione deve essere completamente ripensata.

Desktop:

grid.

Mobile:

carousel orizzontale.

L'utente deve poter effettuare swipe tra i progetti.

Ogni card deve occupare quasi tutta la larghezza dello schermo.

Mostrare leggermente la card successiva per suggerire lo swipe.

Utilizzare:

scroll-snap

oppure

carousel performante.

---

Ogni card deve avere:

- titolo
- breve descrizione
- stack
- tag
- pulsanti

Le animazioni devono essere leggere.

---

# Skills

Le skills non devono più apparire come nel desktop.

Utilizzare chip.

Devono risultare:

- compatte
- moderne
- facilmente leggibili

Animazione:

comparsa progressiva durante lo scroll.

---

# Experience

Mantenere timeline verticale.

Ridurre il rumore grafico.

Privilegiare la leggibilità.

---

# Contact

NON modificare.

La sezione attuale è già ottimizzata.

---

# Typography

Su mobile il testo deve risultare estremamente leggibile.

Preferire:

maggiore line-height

minore larghezza del testo

padding generosi

Mai creare blocchi enormi.

---

# Spacing

Aumentare gli spazi rispetto al responsive classico.

Il sito deve respirare.

---

# Touch

Ogni elemento cliccabile deve essere progettato per il tocco.

Valutare:

- dimensioni
- distanza
- feedback

---

# Motion

Le animazioni devono sembrare naturali.

Ispirazione:

Apple

Linear

Framer

Lando Norris website

NON copiarne lo stile.

Solo prendere ispirazione dal livello qualitativo.

---

# Responsive

Ottimizzare per:

320px

360px

375px

390px

412px

430px

768px

Non creare breakpoint inutili.

Usare layout fluidi.

---

# Performance Budget

Preferire:

opacity

transform

translate3d()

scale()

requestAnimationFrame

IntersectionObserver

CSS hardware acceleration

Ridurre:

blur pesanti

box-shadow enormi

filter inutili

paint continui

---

# Canvas

Versione mobile dedicata.

Ridurre:

- densità
- calcoli
- redraw

L'animazione deve continuare a sembrare premium.

---

# Coerenza

Ogni modifica deve rispettare il design system esistente.

Palette

Glass

Colori

Tipografia

Geometrie

Non introdurre componenti fuori stile.

---

# Regola principale

Ogni decisione deve essere presa seguendo questa domanda:

"Se il progetto fosse nato esclusivamente per smartphone, questo componente sarebbe progettato così?"

Se la risposta è no,

riprogettalo.

---

# Cosa NON modificare

- Palette
- Branding
- Identità
- Contact section
- Linguaggio grafico
- Font
- Tone of voice

---

# Cosa PUOI modificare

- disposizione
- gerarchia
- animazioni
- spaziature
- componenti
- interazioni
- reveal
- comportamento dello scroll
- comportamento del canvas
- layout delle sezioni

---

# Libertà progettuale

L'AI non deve limitarsi a fare responsive.

Deve comportarsi come un Senior Product Designer e Frontend Engineer.

Per ogni componente deve scegliere tra:

1. mantenerlo

2. adattarlo

3. riprogettarlo

motivando implicitamente le proprie scelte attraverso un'esperienza migliore.

---

# Obiettivo finale

Il risultato non deve sembrare un sito desktop adattato.

Deve sembrare un portfolio progettato prima per mobile e poi portato su desktop, pur mantenendo la piena coerenza con il design originale.

L'utente deve percepire:

- fluidità
- eleganza
- qualità
- attenzione ai dettagli
- modernità

senza sacrificare performance o usabilità.