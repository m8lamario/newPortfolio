# M8LA Portfolio — Mobile Implementation Plan

## 1. Obiettivo

Realizzare una versione mobile progettata specificamente per smartphone,
non una semplice riduzione del layout desktop, mantenendo:

- palette dark-wine e design system esistente;
- branding M8LA, font, geometrie e linguaggio glass/pixel;
- contenuti, tono di voce e identità del portfolio;
- landing page a scroll verticale senza hamburger, sidebar o bottom navigation;
- sezione Contact invariata;
- compatibilità con il layout desktop già presente.

Il piano copre implementazione, accessibilità, performance, QA e deployment.
Non prevede modifiche al codice durante la fase di pianificazione.

## 2. Analisi dello stato attuale

### Stack e composizione

Il progetto usa Next.js 14 con App Router, React 18, TypeScript, CSS Modules,
Framer Motion, Lenis e Canvas API. I punti principali sono:

| Area | File | Stato rilevato |
|---|---|---|
| Composizione pagina | `app/page.tsx` | Hero, About, WebDev, Experience, Projects, Skills, Contact |
| Layout globale | `app/layout.tsx`, `components/layout/ClientLayout.tsx` | Font, provider della griglia, preloader e smooth scroll |
| Sfondo | `components/background/GridCanvas.tsx`, `lib/gridRenderer.ts` | Griglia animata guidata dal mouse |
| Hero | `components/sections/Hero.tsx`, `Hero.module.css` | Scramble text, PixelTitle, CTA e indicatore di scroll |
| Competenze tecniche | `components/sections/WebDev.tsx`, `WebDev.module.css` | Lista verticale con skill attiva durante lo scroll |
| Esperienza | `components/sections/Experience.tsx`, `Experience.module.css` | Timeline verticale già coerente con la specifica |
| Progetti | `components/sections/Projects.tsx`, `Projects.module.css` | Grid desktop e una colonna mobile |
| Altre passioni | `components/sections/Skills.tsx`, `Skills.module.css` | Fotografia con loop via RAF e stampa 3D guidata dallo scroll |
| Dati | `lib/constants.ts` | `SKILL_CATEGORIES`, `PROJECTS`, `EXPERIENCES`, contatti e ruoli Hero |
| Token globali | `app/globals.css` | Palette, glass blur, spacing, font e timing |
| Scroll | `components/layout/SmoothScroll.tsx` | Lenis globale con `touchMultiplier: 2` |

### Gap rispetto a `MOBILE_REDESIGN.md`

1. `GridCanvas` riduce la densità su mobile ma cerca ancora un punto mouse;
   su touch non esiste una sorgente di interazione equivalente.
2. Hero ha una buona base di animazioni ma non possiede una logica visuale
   mobile dedicata per rendere vivo il background.
3. `Projects` diventa una grid a una colonna, non un carousel orizzontale con
   card quasi full-width e card successiva parzialmente visibile.
4. La specifica parla di Skills in chip, ma nel repository la sezione tecnica
   è `WebDev`; `Skills` è invece la macro-sezione “Oltre il codice”.
5. Le animazioni di fotografia, blur e shadow possono consumare risorse su
   Android di fascia media.
6. Le media query esistenti si concentrano su 1024, 768 e 375 px; serve una
   strategia fluida verificata anche a 320, 360, 390, 412 e 430 px.
7. Le card e i pulsanti hanno stati hover desktop che devono avere un feedback
   equivalente e utile al tocco.

## 3. Vincoli e decisioni architetturali

### Invarianti

- Non cambiare palette, font, branding, contenuti editoriali o tone of voice.
- Non cambiare `Contact` né introdurre una nuova navigazione.
- Non duplicare le fonti dati: le competenze devono essere ricondotte a
  `lib/constants.ts`, evitando di mantenere liste divergenti dentro i
  componenti.
- Non aggiungere una libreria gesture/carousel finché il comportamento nativo
  del browser è sufficiente.
- Non introdurre breakpoint per ogni viewport: usare layout fluidi, `clamp()`,
  `min()`, `max()` e poche soglie funzionali.
- Preservare il comportamento desktop, isolando le varianti mobile con CSS e
  condizioni runtime soltanto dove servono.

### Scelta del carousel

Usare un contenitore orizzontale nativo con:

- `overflow-x: auto`;
- `scroll-snap-type: x mandatory`;
- `scroll-snap-align: start`;
- card con larghezza fluida vicina alla viewport;
- padding laterale coerente con il container;
- `overscroll-behavior-x: contain`;
- indicazione visiva della card successiva tramite peek naturale.

Il drag manuale custom non è necessario: il gesto nativo è più leggero,
accessibile e affidabile su iOS e Android. Lenis dovrà essere verificato per
non interferire con lo scroll orizzontale; se necessario il carousel sarà
marcato con l’attributo di prevenzione previsto da Lenis.

## 4. Piano di implementazione

### Fase 0 — Baseline e preparazione

**File da esaminare**

- `package.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- tutti i componenti e moduli CSS citati nella sezione di analisi

**Attività**

1. Eseguire la baseline con gli script già presenti:
   `npm run lint` e `npm run build`.
2. Verificare che il comportamento desktop corrente sia il riferimento da
   preservare.
3. Inventariare le animazioni attive in Hero, canvas, Experience, Projects,
   WebDev e Skills.
4. Confermare che gli asset fotografici e i percorsi usati da `Skills.tsx`
   siano coerenti con quelli presenti in `public`.
5. Definire una matrice di verifica per 320, 360, 375, 390, 412, 430 e 768 px,
   oltre alla viewport desktop di riferimento.

**Output**

- baseline registrata;
- elenco delle superfici da modificare;
- nessuna modifica comportamentale alla Contact section.

### Fase 1 — Infrastruttura mobile del GridCanvas

**File principali**

- `lib/gridRenderer.ts`
- `components/background/GridCanvas.tsx`
- `components/background/GridContext.tsx` solo se necessario per separare
  il dato mouse dalla modalità autonoma
- `components/sections/CanvasMirror.tsx` per mantenere compatibilità con il
  renderer condiviso

**Progetto della modalità mobile**

1. Estendere `GridConfig` con parametri espliciti per la modalità autonoma,
   densità, ampiezza dell’onda, velocità, durata del pulse e intensità del
   glow.
2. Conservare il renderer mouse-driven per desktop senza alterarne la
   relazione tra distanza, scala, falloff e lerp.
3. Aggiungere un renderer o una funzione distinta per il mobile che calcoli
   il target di ogni quadrato usando:
   - onda sinusoidale lenta che attraversa la griglia;
   - pulse locale periodico;
   - lieve movimento organico non sincronizzato su tutta la superficie;
   - posizione temporale comune passata dal loop RAF, senza timer per cella.
4. Selezionare la modalità con `matchMedia`/feature detection touch e
   larghezza, evitando di basarsi solo sull’assenza di eventi mouse.
5. Gestire correttamente il cambio di orientamento e il resize ricostruendo
   la griglia con parametri mobile o desktop appropriati.
6. Limitare la densità e il costo dei calcoli su mobile; valutare un limite
   ragionevole al device pixel ratio per evitare canvas enormi sui device ad
   alta densità.
7. Mettere in pausa il loop quando la pagina non è visibile e ripristinarlo
   senza creare più RAF concorrenti.
8. Rispettare `prefers-reduced-motion`: mantenere una presenza visiva minima,
   ma ridurre ampiezza e velocità invece di lasciare un’animazione pesante.
9. Pulire listener, RAF e riferimenti nel cleanup del componente.
10. Verificare che `CanvasMirror` continui a compilare e a usare il renderer
    mouse-driven quando viene attivato da hover desktop.

**Criteri di accettazione**

- Su touch il background non è statico e non dipende dal cursore.
- Su desktop il follow-mouse conserva l’aspetto e la risposta attuali.
- Un resize o un cambio orientamento non lascia quadrati fuori scala né loop
  duplicati.
- Il canvas non blocca scroll, tap o link.

### Fase 2 — Hero e sistema di motion mobile

**File principali**

- `components/sections/Hero.tsx`
- `components/sections/Hero.module.css`
- `components/sections/PixelTitle.tsx`
- `components/sections/CanvasMirror.tsx` se la resa del titolo interattivo
  richiede una variante touch
- `app/globals.css` per token di durata/easing

**Attività**

1. Mantenere headline, subheadline e due CTA nella gerarchia verticale:
   titolo, sottotitolo, CTA, animazione/background.
2. Usare il GridCanvas autonomo come effetto “wow” principale su mobile,
   evitando di simulare un hover che il dispositivo non può fornire.
3. Ridurre delay cumulativi, durata e distanza dei reveal per diminuire il
   tempo prima che il contenuto sia leggibile.
4. Garantire CTA con area di tocco almeno 44x44 px, distanza sufficiente e
   focus visibile.
5. Verificare che lo scroll indicator non occupi spazio utile o intercetti
   eventi touch.
6. Applicare `useReducedMotion` o una strategia equivalente alle animazioni
   Framer Motion più elaborate, mantenendo comunque la gerarchia visiva.
7. Evitare di introdurre nuove particelle, blur o filtri continui solo per
   aumentare l’effetto iniziale.

**Criteri di accettazione**

- Il primo viewport comunica subito identità e contenuto.
- Il titolo è leggibile a 320 px senza overflow orizzontale.
- Il background è vivo ma non compete con il testo.
- Il percorso CTA verso Projects e Contact continua a funzionare con Lenis.

### Fase 3 — Design system e layout mobile comune

**File principali**

- `app/globals.css`
- moduli CSS di Hero, About, WebDev, Experience, Projects e Skills
- `components/ui/Button.module.css`
- `components/ui/Card.tsx` e `Card.module.css` se usati dalle superfici
  interessate

**Attività**

1. Aggiungere token mobile separati per blur, shadow, padding di sezione,
   gap e durata, senza modificare i valori desktop.
2. Ridurre il `backdrop-filter` delle superfici glass su viewport mobili e
   preferire contrasto, border e opacity quando il blur è superfluo.
3. Ridurre shadow e glow continui; lasciare solo quelli utili a gerarchia e
   feedback.
4. Usare tipografia fluida con line-height maggiore, max-width testuale più
   stretto e padding laterale generoso.
5. Consolidare una soglia mobile principale e una eventuale soglia stretta
   per 320–360 px; intervenire sulle singole dimensioni solo quando la
   matrice lo dimostra necessario.
6. Aggiungere `:focus-visible`, stati `:active` e feedback touch dove oggi
   esiste solo `:hover`.
7. Controllare `100vw`, elementi sticky, SVG PixelLabel e dividers per evitare
   overflow orizzontale.
8. Verificare `env(safe-area-inset-*)` per padding superiori/laterali solo se
   il layout lo richiede su dispositivi con notch.

### Fase 4 — Riprogettazione della sezione tecnica in chip

**File principali**

- `components/sections/WebDev.tsx`
- `components/sections/WebDev.module.css`
- `lib/constants.ts`

**Decisione di mapping**

La specifica chiama questa area “Skills”, ma nel codice la sezione tecnica
reale è `WebDev` con `id="skills"`. `Skills.tsx` non va trasformato in chip:
rappresenta “Oltre il codice” e contiene fotografia/stampa 3D. Il redesign
chip sarà quindi applicato a `WebDev`.

**Attività**

1. Eliminare la lista tecnica duplicata locale o riallinearla a
   `SKILL_CATEGORIES` in `lib/constants.ts`.
2. Mantenere nomi e categorie previste dalla Project Spec:
   Frontend, Backend / DB, Tools & Other.
3. Conservare su desktop una presentazione coerente con l’attuale identità;
   su mobile sostituire il grande elenco verticale con gruppi compatti di
   chip in flex-wrap.
4. Rendere ogni chip leggibile a 320 px, con contrasto sufficiente, padding
   tattile e testo che non richieda hover per essere compreso.
5. Sostituire l’ascolto globale di `scroll` per il comportamento mobile con
   `IntersectionObserver`/reveal viewport quando possibile.
6. Applicare reveal progressivo leggero usando opacity e transform, con
   stagger breve e fallback ridotto per `prefers-reduced-motion`.
7. Evitare descrizioni obbligatorie nascoste dietro hover; le informazioni
   essenziali devono restare visibili.

**Criteri di accettazione**

- La sezione è identificabile come competenze tecniche.
- I chip sono compatti, leggibili e ordinati per categoria.
- Non esiste una lista duplicata di skill divergente da `constants.ts`.
- L’animazione di ingresso non causa ritardi percepibili durante lo scroll.

### Fase 5 — Projects come carousel mobile

**File principali**

- `components/sections/Projects.tsx`
- `components/sections/Projects.module.css`
- `components/ui/Button.module.css` solo per uniformare i target touch
- `components/layout/SmoothScroll.tsx` solo se serve una configurazione di
  interazione con lo scroll orizzontale

**Attività**

1. Mantenere la grid a due colonne desktop.
2. Su mobile trasformare `.grid` in un contenitore orizzontale con scroll
   nativo e scroll-snap.
3. Impostare card con larghezza fluida vicina alla viewport, lasciando visibile
   una porzione della card successiva per comunicare il gesto.
4. Conservare prima i tre progetti `featured`; il toggle “Altri progetti”
   deve continuare a mostrare gli altri elementi nello stesso carousel senza
   cambiare il modello dati.
5. Mantenere su ogni card titolo, descrizione, stack, tag, anno e link
   disponibili. I link assenti devono non lasciare vuoti ambigui.
6. Ridurre padding, blur, glow e durata dell’entrata su mobile.
7. Rimuovere la dipendenza funzionale da hover: border, active state e
   pulsanti devono funzionare con tap e tastiera.
8. Dare al contenitore un nome accessibile e mantenere l’ordine DOM dei
   progetti. Non aggiungere autoplay, perché interferirebbe con il gesto.
9. Verificare che Lenis non trasformi il gesto orizzontale in scroll verticale;
   applicare il meccanismo di prevenzione documentato solo al carousel.
10. Verificare focus da tastiera e scroll automatico della card focalizzata
    senza introdurre una gestione manuale complessa.

**Criteri di accettazione**

- Una card occupa quasi tutta la viewport e la successiva è parzialmente
  visibile.
- Il gesto swipe è nativo, fluido e non sposta accidentalmente la pagina in
  modo imprevedibile.
- `scroll-snap` funziona in Safari iOS e Chrome Android.
- Desktop resta una grid senza overflow orizzontale.

### Fase 6 — About ed Experience

**File principali**

- `components/sections/About.module.css`
- `components/sections/Experience.module.css`
- relativi componenti TypeScript solo se servono piccoli aggiustamenti

**About**

- Conservare bio e facts esistenti.
- Passare a una singola colonna leggibile su mobile.
- Usare padding e line-height più generosi senza creare blocchi testuali
  troppo larghi.
- Evitare PixelLabel sticky o elementi decorativi che comprimano il contenuto
  sotto 768 px.
- Mantenere l’ordine semantico e il contatore senza dipendere dall’hover.

**Experience**

- Conservare la timeline verticale richiesta dalla specifica.
- Ridurre rumore grafico, dimensione dei glow e intensità dei pulse.
- Rendere linea, dot, periodo, ruolo e descrizione leggibili senza collisioni.
- Usare reveal una tantum basato sulla viewport, con trasformazioni leggere.
- Verificare che le descrizioni lunghe non producano overflow a 320 px.

### Fase 7 — Alleggerimento della sezione “Oltre il codice”

**File principali**

- `components/sections/Skills.tsx`
- `components/sections/Skills.module.css`

Questa sezione non è la superficie dei chip, ma contribuisce direttamente alla
fluidità mobile e va adattata senza cambiare il suo contenuto.

**Attività**

1. Ridurre o sostituire il loop fotografico di altezza `400vh` sui viewport
   stretti con una sequenza più corta e prevedibile.
2. Evitare un RAF continuo quando la sezione non è visibile; usare viewport,
   visibilità della pagina e cleanup rigoroso.
3. Ridurre il numero di elementi duplicati e il costo di trasformazione delle
   righe fotografiche su mobile.
4. Conservare l’effetto di movimento della stampa 3D, ma limitarne ampiezza,
   numero di elementi visibili e lavoro per frame.
5. Disattivare o semplificare il movimento non essenziale con
   `prefers-reduced-motion`.
6. Verificare dimensioni degli asset, layout e fallback nel caso in cui un
   file immagine non sia disponibile.

**Criteri di accettazione**

- Fotografia e 3D restano riconoscibili e coerenti con il branding.
- La sezione non introduce lunghe attese o scroll artificiale su mobile.
- Nessun RAF resta attivo dopo lo smontaggio o quando la pagina è nascosta.

### Fase 8 — Contact e superfici escluse

**File**

- `components/sections/Contact.tsx`
- `components/sections/Contact.module.css`

La Contact section non deve essere modificata secondo la specifica. Va solo
verificata nella matrice responsive per assicurare che gli interventi globali
non ne alterino involontariamente spacing, link o accessibilità. Se una
regola globale crea una regressione, la correzione deve essere isolata fuori
dalla Contact section quando possibile.

## 5. Responsive matrix

| Viewport | Verifiche principali |
|---|---|
| 320 px | nessun overflow, Hero leggibile, chip e CTA non collassano, card carousel usabile |
| 360 px | spacing minimo, descrizioni e link, timeline |
| 375 px | riferimento mobile stretto, dimensioni card e peek |
| 390 px | fluidità dei padding e titoli |
| 412 px | card quasi full-width e chip con wrapping naturale |
| 430 px | equilibrio tra contenuto e peek, nessun vuoto eccessivo |
| 768 px | passaggio tablet, desktop grid dove previsto, canvas e sezioni stabili |
| Desktop | regressione visiva, mouse canvas, grid Projects, layout WebDev |

Le misure devono essere verificate sia in portrait sia, dove utile, in
landscape. Il controllo deve includere zoom browser e font rendering standard.

## 6. Performance budget e accessibilità

### Performance

- Preferire opacity, transform, `translate3d`, scale e `requestAnimationFrame`
  condiviso.
- Evitare layout read/write ripetuti nello stesso frame.
- Ridurre blur, box-shadow, filtri e paint continui su mobile.
- Limitare densità, DPR effettivo e calcoli per il canvas.
- Mettere in pausa canvas/loop non visibili o quando il documento è nascosto.
- Controllare che Lenis, canvas e motion non competano inutilmente sul main
  thread.
- Target di verifica: Lighthouse Mobile > 90, FCP < 2.5 s, LCP < 4 s, CLS <
  0.1 e assenza di jank percettibile durante scroll e swipe.
- Misurare i frame del canvas su un Android di fascia media; il target
  operativo è una resa stabile prossima a 60 FPS, con semplificazione se il
  budget non viene rispettato.

### Accessibilità e touch

- Focus visibile per link e button.
- Target interattivi di almeno 44x44 px e distanza sufficiente.
- Contrasto verificato su sfondo dark-wine e glass.
- Testo e controlli comprensibili senza hover.
- `prefers-reduced-motion` applicato a Framer Motion e keyframe CSS.
- Carousel identificabile da screen reader senza annunci automatici invasivi.
- Ordine DOM e heading level coerenti con la landing page.
- Link esterni mantengono `target="_blank"` e `rel="noopener noreferrer"`.

## 7. Strategia di verifica

### Verifica automatica già disponibile

Eseguire senza introdurre nuovi strumenti:

1. `npm run lint`
2. `npm run build`

Dopo ogni fase che modifica TypeScript o CSS eseguire almeno lint; al termine
eseguire entrambi gli script sull’insieme delle modifiche.

### Verifica manuale

1. Testare la matrice responsive sopra indicata.
2. Verificare scroll verticale, CTA, focus da tastiera e link esterni.
3. Verificare swipe e snap del carousel su Safari iOS e Chrome Android.
4. Verificare il canvas su desktop con mouse e su mobile senza mouse.
5. Verificare cambiamento orientamento, resize e ritorno da background tab.
6. Attivare `prefers-reduced-motion` e controllare che il contenuto resti
   completo e leggibile.
7. Controllare assenza di overflow orizzontale fuori dal carousel.
8. Eseguire Lighthouse Mobile e raccogliere FCP, LCP, CLS e performance score.
9. Ripetere il controllo su un Android di fascia media e su Safari iOS.

## 8. Deployment e criteri di completamento

1. Creare una preview Vercel del branch di implementazione.
2. Ripetere i test mobile sulla preview, non solo in sviluppo locale.
3. Controllare font, asset fotografici, URL dei progetti e comportamento del
   preloader in condizioni di rete lenta.
4. Verificare che `.next` e altri artefatti generati non vengano inclusi
   intenzionalmente nel changeset.
5. Considerare il redesign completo solo quando:
   - i requisiti specifici di GridCanvas, Hero, Projects e WebDev sono coperti;
   - Contact, branding e desktop non hanno regressioni;
   - tutte le viewport della matrice sono utilizzabili;
   - lint e build passano;
   - performance e accessibilità rispettano il budget concordato;
   - la preview Vercel è navigabile su iOS e Android.

## 9. Sequenza e dipendenze

```text
Baseline
  |
  +--> Token/performance globali
  |       |
  |       +--> GridCanvas mobile
  |       |       |
  |       |       +--> Hero motion mobile
  |       |
  |       +--> WebDev chip
  |       +--> Projects carousel
  |       +--> About/Experience responsive
  |       +--> Skills passioni alleggerita
  |
  +--> QA responsive/accessibilità
          |
          +--> Lighthouse e device testing
                  |
                  +--> Preview Vercel e verifica finale
```

Projects, WebDev e le sezioni responsive possono essere sviluppati in parallelo
dopo aver stabilito token e regole comuni; il canvas va stabilizzato prima
della rifinitura Hero perché è il principale effetto condiviso.

## 10. File coinvolti

### Modifiche previste

- `lib/gridRenderer.ts`
- `components/background/GridCanvas.tsx`
- `components/background/GridContext.tsx` se richiesto dall’API
- `components/sections/Hero.tsx`
- `components/sections/Hero.module.css`
- `components/sections/WebDev.tsx`
- `components/sections/WebDev.module.css`
- `components/sections/Projects.tsx`
- `components/sections/Projects.module.css`
- `components/sections/About.module.css`
- `components/sections/Experience.module.css`
- `components/sections/Skills.tsx`
- `components/sections/Skills.module.css`
- `app/globals.css`
- `components/layout/SmoothScroll.tsx` solo se necessario per Lenis/carousel
- `lib/constants.ts` per la fonte unica delle skill, se il refactoring lo
  conferma necessario

### Verifica senza modifica intenzionale

- `components/sections/Contact.tsx`
- `components/sections/Contact.module.css`
- `app/page.tsx`
- `app/layout.tsx`
- `components/loader/*`
- `components/ui/*`, salvo adeguamenti touch isolati

### Dipendenze

Non sono previste nuove dipendenze. Framer Motion, Lenis, CSS Modules e
Canvas API esistenti sono sufficienti per il redesign.
