# Oprawa gier – zasady refinementu

Dokument opisuje, jak zamieniamy POC gry w wersję z pełną oprawą („tryb immersyjny”): własne tło całej strony, postacie, animacje, dźwięki i, tam gdzie pasują, prawdziwe zdjęcia. Na końcu są wytyczne dla gier, które jeszcze czekają na oprawę.

## 1. Cel i stałe założenia

- **Mechanika zostaje bez zmian.** Zasady, punktacja, maksymalny wynik i logika botów są takie jak w POC. Refinement zmienia wyłącznie to, jak gra wygląda, brzmi i jak się w nią gra (feedback, czytelność, mobile). Jeśli przy okazji wychodzi błąd w mechanice, naprawiamy go i opisujemy w podsumowaniu.
- **Jedna gra na raz, w kolejności z [`registry.ts`](../src/games/registry.ts).**
- **Bez nowych zależności.** Wystarcza to, co jest: React 19, Tailwind v4, shadcn/ui, `motion` (`motion/react`), `canvas-confetti`, `@dnd-kit/core`, fonty `@fontsource/bebas-neue` i `@fontsource/caveat`. Canvas, Pixi czy biblioteki 3D nie są potrzebne.
- **Grafika to własne SVG i CSS.** Emoji znikają z interfejsu gry (zostają tylko w `shareLine` udostępnianego wyniku). Jedyny wyjątek to OpenMoji (CC BY-SA 4.0) w Podłodze, bo tam obrazki są treścią zagadek.
- **Postacie są fikcyjne.** Prowadzący, jurorzy, handlarze i uczestnicy to nasze własne postacie w SVG, z polskimi imionami. Nie rysujemy ani nie podpisujemy prawdziwych osób z telewizji (żadnej Gessler, Szelągowskiej itp.), a format programu jest tylko inspiracją.
- **Zdjęcia tylko na wolnych licencjach** (CC0, domena publiczna, CC BY, CC BY-SA), z autorem i licencją przy zdjęciu. Bez zdjęć rozpoznawalnych ludzi.
- **Mobile jest pełnoprawny.** Każdy ekran musi działać w 390 px bez poziomego przewijania, z przyciskami w zasięgu kciuka.
- **Ograniczony ruch jest obsługiwany.** `prefers-reduced-motion` zatrzymuje animacje tła, a sekwencje gry przyspieszają.
- **Język interfejsu i planów: polski.** Kod, nazwy i identyfikatory: angielski.

## 2. Stan

| Gra | Klimat | Prefiks CSS | Ilustracje |
| --- | --- | --- | --- |
| Podłoga | studio TV ze świecącą podłogą LED | `studio-`, `floor-` | OpenMoji, flagi |
| Co to za ustrojstwo? | sortownia paczek | `wh-` | zdjęcia CC gadżetów |
| Zonk! | studio z lat 90. z filtrem VHS | `zk-` | zdjęcia CC nagród i zonków |
| Ukryte kryterium | zagracony domek zadań | `uk-` | własne SVG, sędzia na tronie |
| Paleta w ciemno | dzienny plac za hurtownią | `pw-` | zdjęcia CC, handlarze SVG |
| Ile za tego grata? | komis „U Zbyszka” pod wieczór | `gr-` | zdjęcia CC aut, handlarz SVG |
| Ściema z ogłoszenia | nocna redakcja śledcza | `sc-` | zdjęcia CC aut, reporterka SVG |
| Rajskie Rozdanie | willa: dzień przy basenie, ceremonia nocą | `rr-` | 7 uczestników SVG |
| Zdrajca | szkocki zamek nocą | `zd-` | 8 postaci SVG + plan zamku |

Zostało 11 gier (sekcja 10).

## 3. Proces pracy nad jedną grą

1. **Rozpoznanie (tryb planu).** Przeczytaj `index.tsx`, `logic.ts` i `data.json` gry. Spisz fazy, stałe punktacji, postacie z mechaniki i źródła danych.
2. **Najwyżej 1–2 pytania do użytkownika** (`AskQuestion`), tylko o decyzje, które naprawdę zmieniają plan. Zwykle są to:
   - klimat i miejsce akcji (2–3 propozycje, rekomendowana pierwsza);
   - forma ilustracji: zdjęcia CC czy własne SVG (przy ludziach zawsze SVG).
3. **Plan po polsku** w `~/.cursor/plans/`, w tym układzie:
   - **Dobór technologii** – co budujemy czym (SVG/CSS, motion, confetti, Web Audio z listą próbek i syntez, fonty);
   - **Przepływ gry** – diagram mermaid faz;
   - **Tło całej strony** – elementy sceny i tryby `data-mood`;
   - **Układ ekranu** – desktop, 390 px, `data-testid` kluczowych elementów;
   - **Zmiany w plikach** – lista plików nowych i zmienianych;
   - **Assety** – próbki i zdjęcia;
   - **Weryfikacja** – co i jak sprawdzamy.

   Do tego 7 todo w stałej kolejności: logika i testy → dźwięki → tło → postacie → komponenty gry → przepływ w `index.tsx` → weryfikacja i commit.
4. **Implementacja** w tej samej kolejności. Pliku planu nie edytujemy.
5. **Weryfikacja** (sekcja 8), poprawki, ponowna weryfikacja.
6. **Lokalny commit**, np. `Ściema z ogłoszenia: oprawa redakcji śledczej nocą (zdjęcia aut, reporterka, stoper, dźwięki)`. Bez `git push`: wypchnięcie to osobna decyzja użytkownika.
7. **Krótkie podsumowanie po polsku**: co zmieniono, jak sprawdzono i co odbiega od planu.

## 4. Struktura plików gry

```text
src/games/<slug>/
  index.tsx            fazy gry, stan, dźwięki, układ ekranu
  logic.ts             stałe, czysta logika, funkcja miny postaci (testowana)
  data.json            treści (+ id i photo przy zdjęciach, komentarze postaci)
  sfx.ts               createSfx({ slug, samples, synth })
  <Miejsce>Backdrop.tsx  tło całej strony z trybami data-mood
  <miejsce>.css        wszystkie style gry z prefiksem 2–3 liter
  <Postać>.tsx         postać SVG z minami i dymkiem
  <Rekwizyt>.tsx       kluczowe rekwizyty (karta, wydruk, stoper, bramka…)
public/<slug>/
  sfx/*.mp3            próbki dźwięków
  <kategoria>/*.jpg    zdjęcia 4:3, ok. 800 px szerokości
```

Do tego `immersive: true` w `registry.ts` i testy w [`src/games/scoring.test.ts`](../src/games/scoring.test.ts).

## 5. Wzorce implementacyjne

### Tryb immersyjny i tło

- `immersive: true` przełącza [`GameShell`](../src/shared/GameShell.tsx) na ciemny układ na całą stronę: górny pasek z tytułem (z miejscem na przycisk dźwięku) i `main` o szerokości `max-w-5xl`.
- Tło to `<Miejsce>Backdrop` z klasami `pointer-events-none fixed inset-0 -z-10 overflow-hidden`, atrybutem `data-mood` i `data-testid="<miejsce>-backdrop"`. Eksportuje `type Mood`.
- Tryby (`data-mood`) odpowiadają fazom i reakcjom: zawsze `idle` (lobby) i `result`, a pomiędzy nimi stany specyficzne dla gry (np. `reading | hit | miss | urgent | review`). `index.tsx` liczy tryb w jednej funkcji `backdropMood()`.
- Scena to zwykle jedno SVG `viewBox="0 0 1600 900"` z `preserveAspectRatio="xMidYMax slice"`. Na telefonie widać tylko środek, mniej więcej x 590–1010, więc ważne elementy powinny tam trafić.
- **Pora dnia i nastrój:**
  - nocą działa warstwa `mix-blend-mode: multiply` z granatem, a nad nią osobne SVG ze światłami (okna, płomienie, księżyc), żeby światła nie ciemniały;
  - zmiany robimy przejściami `opacity` i `transform`, bez przeliczania kolorów w JS.
- Winieta (`radial-gradient`) na wierzchu tła poprawia czytelność treści.

### Lobby, dźwięk, ruch

- Pierwszy ekran to lobby z nadtytułem w Caveat, tytułem w Bebas Neue (`font-display`), dwoma zdaniami zasad i dużym przyciskiem w klimacie, np. „Wchodzę do redakcji”. Przycisk wywołuje `sfx.unlock()`, bo przeglądarka wpuszcza dźwięk dopiero po geście.
- `<MuteButton sfx={sfx} />` zaraz pod tłem.
- Całość opakowana w `<MotionConfig reducedMotion="user">`.
- `const pace = useReducedMotion() ? 0.15 : 1`, a wszystkie opóźnienia sekwencji to `ms * pace`.
- W CSS blok `@media (prefers-reduced-motion: reduce)` wyłącza zapętlone animacje tła (deszcz, palmy, ogień, oddychanie postaci).
- `confetti(...)` zawsze z `disableForReducedMotion: true`.

### Postacie

- Jedna postać to jeden komponent SVG (zwykle `viewBox` 120×150 albo 160×200) z mapami min:
  - `BROWS` i `MOUTHS` (`Record<Mood, string>` ze ścieżkami SVG);
  - komponent `Eyes`;
  - dodatki zależne od miny (rumieńce, łza, serca).
- Wiele postaci tego samego typu to jeden komponent z `LOOKS` według imienia (skóra, fryzura, strój, dodatek).
- **Mina jest liczona czystą funkcją w `logic.ts`** (`reporterMood`, `dealerMood`, `judgeMood`, `contestantMood`) i ma testy. Chwilowe reakcje po akcji gracza trzymamy w stanie i czyścimy po 1,4–1,6 s. Token w `useRef` chroni przed wyścigiem timerów:

  ```ts
  const token = ++reactionToken.current
  setReactions(next)
  setTimeout(() => {
    if (reactionToken.current === token) setReactions({})
  }, 1600)
  ```

- Dymek z komentarzem (`AnimatePresence`) i imię postaci. Teksty komentarzy trzymamy w `data.json` w grupach (`hit`, `miss`, `timeout`…), a losuje je `pickLine`.
- Na ekranie wyniku postać wraca jako `children` w `ResultScreen`, z miną zależną od wyniku.

### Przepływ i stan

- Fazy to unia stringów (`'lobby' | 'arrive' | 'reading' | 'review'`), a sekwencje to `setTimeout` skalowane przez `pace`.
- Odliczanie przez `useCountdown(seconds, running, onExpire)`; `running` jest prawdą tylko w fazie gry.
- Czas na „dojście” stanu: gdy rekwizyt wjeżdża, przyciski są `disabled`, dopóki faza się nie zmieni.
- Pasek statusu w klimacie gry (winieta gazety, pasek „na żywo”, tablica wyników) zastępuje `Hud` i `Progress`.
- Stopka z podziękowaniami na dole: `Dźwięki: Kenney (CC0) · Zdjęcia: Wikimedia Commons, autorzy przy zdjęciach · <co jest fikcyjne>`.

### Testowalność

- `data-testid` dostają: przycisk wejścia z lobby, kluczowe przyciski akcji, elementy rozgrywki (np. `ad-segment`, `contestant`, `vote-token`), stany do sprawdzenia (`stamp`, `timer`, `ceremony-result`), tło i postać.
- Stan widoczny w atrybutach `data-mood`, `data-state`, `data-selected` i `data-value`, żeby Playwright mógł go sprawdzić bez parsowania tekstu.

### CSS

- Jeden plik CSS na grę, importowany w tle. Wszystkie klasy z prefiksem gry (sekcja 2), a nowe prefiksy nie mogą się powtarzać.
- Tailwind do układu w JSX, własny CSS do sceny, rekwizytów, animacji i reguł mobile (`@media (max-width: 767px)` albo `1023px`).
- Klasa odręczna `.<prefiks>-hand` z Caveat 700.

### Mobile (390 px)

- Układ przestawiany przez `grid-template-areas`, np. postać i stoper obok siebie na górze, a rekwizyt na całą szerokość.
- Główne akcje w dolnym pasku (`position: sticky; bottom`) w zasięgu kciuka.
- Pasek statusu w jednej linii, a mniej ważne etykiety znikają.
- Kliknięcia w testach mobile przez `dispatchEvent('click')`.

## 6. Dźwięk

- Wspólny moduł [`src/shared/sfx.ts`](../src/shared/sfx.ts):
  - `createSfx({ slug, samples, synth })` ładuje `/<slug>/sfx/<nazwa>.mp3` i pamięta wyciszenie per gra;
  - syntezy piszemy przez `tone(ctx, type, freq, dur, vol, delay)` i `noise(ctx, freq, dur, vol, q, delay)`.
- Każda gra ma `sfx.ts` z `export const sfx = createSfx(...)` i `export const play = sfx.play`.
- **Próbki: paczki Kenney (CC0)** z kenney.nl: Impact Sounds, Casino Audio, Interface Sounds, Music Jingles i Digital Audio. Ostatnio leżały rozpakowane w `/tmp/kenney/{impact,casino,interface,jingles,digital}/Audio`. `/tmp` jest ulotne, więc w razie braku trzeba je pobrać ponownie.
- Konwersja ffmpegiem (`ffmpeg-static` z npm wystarczy):

  ```sh
  ffmpeg -nostdin -loglevel error -y -i źródło.ogg -ac 1 -b:a 96k public/<slug>/sfx/<nazwa>.mp3
  ```

- Typowy zestaw na grę to 5–7 próbek (wejście rekwizytu, akcja, błąd, mocny akcent, jingle `good` i `bad`) plus 2–4 syntezy (tykanie, szum, werbel, stukot).
- **Jingle `good` i `bad` dobieramy analizą przebiegu wysokości dźwięku** (autokorelacja na ramkach po 2048 próbek). `good` musi wyraźnie rosnąć (stosunek końca do początku > 1,15), a `bad` wyraźnie opadać (< 0,8). Zestaw dobieramy do klimatu: Sax do noir i studia, Steel do tropików, Pizzicato do komedii, 8-Bit do retro.
- **Nie powtarzamy plików jingli między grami.** Na pewno są już zajęte:
  - Sax: SAX00, SAX01, SAX02, SAX05, SAX10, SAX14, SAX15, SAX16;
  - Steel: STEEL01, STEEL02, STEEL15;
  - Pizzicato: PIZZI01, PIZZI02;
  - 8-Bit: NES11, NES12.

  Po każdej grze dopisz tu nowe.

## 7. Zdjęcia

- **Źródła:**
  - Wikimedia Commons przez API (`generator=search`, `gsrnamespace=6`, `prop=imageinfo`, `iiprop=url|extmetadata`, `iiurlwidth=330` do wyboru, 960 px do kadrowania);
  - albo Flickr z licencją CC.
- **Commons zwraca 429 przy szybkich seriach,** więc między żądaniami robimy przerwy i ustawiamy własny `User-Agent`. Pobieranie (GET) jest w porządku, za to żadnych uploadów ani edycji.
- **Wybór:**
  - kandydatów oglądamy na montażu (Pillow), a nie pojedynczo;
  - sprawdzamy, czy zdjęcie pokazuje właściwy model lub generację (np. Fiesta Mk7 przed i po liftingu);
  - odrzucamy zdjęcia z ludźmi, tablicami rejestracyjnymi na pierwszym planie i znakami wodnymi.
- **Obróbka:** kadr 4:3, ok. 800 px szerokości, JPG, nazwa = `id` z `data.json`.
- **Dane:** każdy element ze zdjęciem ma w `data.json` `id` i `photo: { author, license, source }`. W interfejsie podpis jest przy zdjęciu (`data-testid="photo-credit"`).
- **Test** pilnuje kompletu plików i podpisów:

  ```ts
  const photos = import.meta.glob('/public/<slug>/<kategoria>/*.jpg')
  expect(items.filter((i) => !photos[`/public/<slug>/<kategoria>/${i.id}.jpg`]).map((i) => i.id)).toEqual([])
  expect(items.filter((i) => !i.photo.author || !i.photo.license || !i.photo.source).map((i) => i.id)).toEqual([])
  ```

- **Kiedy nie zdjęcia:** ludzie (zawsze SVG), rzeczy, których jest bardzo dużo (np. >100 składników; wtedy OpenMoji albo własne ikony SVG), i sceny, które muszą się animować.

## 8. Weryfikacja

- **Statyczne:**

  ```sh
  npx tsc -b && npx oxlint && npx vitest run && npm run build
  ```

  oxlint ma obecnie 4 ostrzeżenia bazowe (shadcn `badge` i `button` oraz `Math.random` w handlerach Express za dolara i Rajskiego Rozdania). Nowa gra nie może dodać żadnego.
- **Dev server:** `npm run dev -- --port 5199`, gra pod `http://localhost:5199/gra/<slug>`.
- **Playwright przez `mcporter`** (`mcporter call playwright.browser_run_code_unsafe filename=<skrypt.js> --timeout <ms>`). Skrypty trzymamy w `~/Library/Caches/playwright-mcp/` (np. `slop-sc-real.js`, `slop-rr-full.js`, `slop-reg.js`).
  - Dwa konteksty: desktop 1280×860 i telefon 390×844 z `isMobile: true, hasTouch: true, deviceScaleFactor: 2`.
  - Pełne gry na prawdziwym czasie, z każdą ścieżką mechaniki: trafienie, błąd, koniec czasu, każda karta mocy, wygrana i przegrana. Gdy coś jest losowe, rozgrywamy kilka gier, aż wszystkie ścieżki wystąpią.
  - Jedna z gier z `page.emulateMedia({ reducedMotion: 'reduce' })`.
  - Asercje na `data-*` (mina, stan, liczba żetonów, pieczątka, wynik), zebrane do tablicy `problems`. Do tego `errors` z `pageerror` i `console.error`, sprawdzenie, że zdjęcia się załadowały (`naturalWidth > 0`), i brak poziomego przewijania (`scrollWidth > innerWidth`).
  - Zrzuty ekranu każdej fazy na obu rozmiarach, oglądane na montażu (Pillow), a nie pojedynczo.
  - Zrzuty regresji lobby dwóch wcześniej zrobionych gier (`slop-reg.js`).
- **Pułapki narzędzi:**
  - `page.clock.runFor` zamraża animacje `motion`, także po `resume()`. Ścieżki z odliczaniem testujemy prawdziwym czekaniem.
  - „Browser is already in use” rozwiązuje `mcporter daemon restart` przed uruchomieniem skryptu.
  - Narzędzie do podglądu obrazów potrafi pokazać starą wersję nadpisanego pliku, więc każdy nowy montaż zapisujemy pod nową nazwą (`-v2`, `-v3`).

## 9. Pułapki techniczne

- **`motion` na elementach SVG nadpisuje `transform-origin`.** Do obrotów i skalowania SVG używamy CSS z `transform-box: view-box` i jawnym `transform-origin: Xpx Ypx` (np. palmy, płomienie, wskazówki). Wskazówkę stopera najprościej ustawić atrybutem `transform="rotate(a cx cy)"`.
- **`transform-box: fill-box` liczy się z całej grupy,** razem z poświatą. Jeśli grupa ma blask wokół płomienia, punkt obrotu ustawiamy jawnie.
- **`only-export-components`:** pliki komponentów eksportują tylko komponenty i typy. Funkcje i stałe idą do `logic.ts`.
- **Reguła `react(purity)`:** nie wywołujemy `Math.random()` w trakcie renderu. Losujemy w handlerach albo w inicjalizatorze `useState(() => ...)`.
- **Nie przypisujemy zmiennych w trakcie renderu** (lint). Wartości pochodne liczymy jako `const`.
- **`opacity` powyżej 1 jest niepoprawne.** Rozjaśnienie robimy przez `filter: brightness()`.
- **Elementy nakładane na tekst** (elipsy markera, pieczątki) pozycjonujemy względem wrappera tekstu (`width: fit-content`), a nie całego wiersza z notatkami.
- **Zdjęcia w ramkach ograniczamy przez `max-width` z `aspect-ratio: 4/3`.** `max-height` z `object-fit: cover` ucina za dużo.
- **Typ `CSSProperties` importujemy z `react`.** Globalna przestrzeń `React` nie jest dostępna.

## 10. Wytyczne dla gier bez oprawy

Kolejność zgodna z `registry.ts`. Przy każdej grze jest obecna mechanika (ta zostaje), propozycja oprawy i rzeczy do rozstrzygnięcia. Propozycje to punkt wyjścia do pytań w trybie planu, a nie gotowa decyzja.

### 10.1 Zdrajca (`zdrajca`, inspiracja: The Traitors)

Zrobiona (sekcja 2). Poniżej pierwotne wytyczne.

- **Mechanika:**
  - 9 mieszkańców (gracz i 8 botów), wśród nich 2 losowych zdrajców;
  - dzień: zeznania z alibi, potem głosowanie nad wygnaniem; noc: zdrajcy zabijają jednego lojalnego;
  - koniec, gdy wszyscy zdrajcy są wygnani, zdrajców jest co najmniej tylu co lojalnych albo gracz ginie;
  - punkty: +50 za zdrajcę, −10 za wygnanego niewinnego, maksimum 100.
  - Kod: `logic.ts` z `createCastle`, `planDay`, `botVotes`, `banish`, `nightVictim`, `gameStatus`, bez testów; `data-testid`: `statements`, `verdict`, `suspect`.
- **Klimat:** szkocki zamek nocą. Wielka sala z kominkiem, okrągły stół przy świecach, witraże i zbroje. Rano jadalnia ze śniadaniem, na którym jednego krzesła brakuje.
- **Tło i tryby:**
  - `idle` – brama zamku we mgle;
  - `morning` – szare światło przez witraże;
  - `statements` – ogień w kominku;
  - `vote` – świece przygasają;
  - `banish` – sztandar opada;
  - `night` – księżyc, kruki, gasnące świece;
  - `result`.
- **Postacie:** 8 postaci SVG z jednego komponentu z `LOOKS`:
  - Hrabina Zofia, Kucharz Bogdan, Ogrodnik Staś, Lady Pamela, Profesor Wit, Influencerka Mia, Major Ryszard, Lokaj Alfred;
  - wszyscy w pelerynach, każdy z rekwizytem: wachlarz, chochla, sekator, perły, monokl, telefon, wąsy, taca;
  - miny: `calm | nervous | offended | suspicious | out`; zdrajcy na koniec zakładają kaptur.
- **Kluczowe animacje:**
  - zeznania to karteczki przypięte do planu zamku (pokoje z `LOCATIONS`), a sprzeczne alibi łączy czerwona nitka po kliknięciu dwóch kartek;
  - głosowanie to łupkowe tabliczki z imieniem pisanym kredą, odwracane kolejno;
  - wygnanie: postać wychodzi, a jej sztandar odsłania kolor (czerwony to zdrajca, biały to lojalny);
  - noc: zdmuchnięta świeca, rano list z woskową pieczęcią przy pustym krześle.
- **Dźwięki:** drzwi i drewno (Impact), kreda (Interface scratch), gong przy werdykcie (impactBell). Syntezy: wiatr, bicie serca przy głosowaniu, trzask kominka. Jingle z niewykorzystanych Sax lub Pizzicato (mroczny humor).
- **Logika i testy:** `residentMood` w `logic.ts`; testy `gameStatus` (warunki końca) i `banish` (punkty).
- **Do rozstrzygnięcia:** czy plan zamku pokazuje lokalizacje z alibi graficznie (zalecane), czy zostaje lista.

### 10.2 Express za dolara (`express-za-dolara`, inspiracja: Azja Express)

- **Mechanika:**
  - 5 etapów z Bali do Singapuru; transport na każdym etapie: autostop (3–14 h), praca (9 h, +1 $) albo bus (5 h, −3 $);
  - boty robią po 5–11 h na etap; w 40% etapów zdarzenie z `data.json`;
  - eliminacja najwolniejszej drużyny po etapach 2 i 4, amulet ratuje raz; +1 $ dziennie;
  - punkty: 100, 60 albo 30 za miejsce na mecie, przy odpadnięciu 10 za każdy etap; maksimum 100.
  - Kod: `logic.ts` z `travel`, `botLegHours`, `slowestTeam`, `placeOf`, bez testów; mapa SVG trasy (`route-map`).
- **Klimat:** podróżniczy notes. Mapa narysowana w notesie, plecak, bilety i znaczki. Tło zmienia się per etap:
  - Bali: plaża i świątynia;
  - Jawa: wulkan;
  - Sumatra: dżungla;
  - Malezja: nocna ulica z neonami i straganami;
  - Singapur: panorama zatoki.
- **Tło i tryby:** `idle` (lotnisko), `choose`, `travel-hitch`, `travel-work`, `travel-bus`, `event`, `elimination` (czerwona koperta prowadzącego), `finish`, `result`.
- **Postacie:** drużyny jako pary SVG – „Wy”, „Siostry z Mazur”, „Ojciec i syn” – i pionki na mapie. Fikcyjna prowadząca z czerwoną kopertą przy eliminacji.
- **Kluczowe animacje:**
  - wybór transportu jako trzy przedmioty do wybrania: kartka z kciukiem, fartuch, bilet;
  - przerywana linia trasy rysuje się `pathLength`, a pionki jadą po niej w tempie godzin;
  - zegarek liczy godziny, a słoik z monetami pokazuje dolary;
  - zdarzenie to pocztówka, która się odwraca; amulet świeci.
- **Grafika:** sceny etapów jako SVG (zalecane). Ewentualnie jedno zdjęcie CC na etap (krajobraz bez ludzi) w pocztówce.
- **Dźwięki:** klakson busa (synteza), monety (Casino), stempel paszportu (Impact), szum dżungli i ulicy (noise). Jingle 8-Bit albo Steel, niewykorzystane.
- **Logika i testy:** `travel` (koszty i godziny), `slowestTeam` przy remisie, `placeOf`.
- **Do rozstrzygnięcia:** pocztówki ze zdjęciami czy wyłącznie SVG.

### 10.3 Uratuj knajpę (`uratuj-knajpe`, inspiracja: Kuchenne rewolucje)

- **Mechanika:**
  - 6 scen fabularnych, 3 statystyki (jakość, atmosfera, kasa; 0–10, start 3);
  - wybory zmieniają statystyki, a jeden wybór od razu kończy grę źle;
  - wynik to suma statystyk (maksimum 30), przy złym zakończeniu 0.
  - Kod: tylko `index.tsx` i `data.json`, bez `logic.ts`.
- **Klimat:** podupadła knajpa w Pcimiu Dolnym. Sala z odklejoną tapetą, ceratami i migającą świetlówką, za wahadłowymi drzwiami kuchnia. **Wygląd sali zmienia się ze statystykami:**
  - jakość: czystsza kuchnia, para z garnków;
  - atmosfera: nowe lampy, obrusy, kwiaty, goście przy stolikach;
  - kasa: pełniejsza kasetka, szyld odnowiony.
- **Tło i tryby:** `idle` (szyld przed knajpą), `scene`, `good` (cieplejsze światło), `bad` (świetlówka mruga), `fail` (kartka „Zamknięte”), `revisit` (wizyta po miesiącu, drzwi się otwierają), `result`.
- **Postacie:**
  - fikcyjna rewolucjonistka kuchni (np. „Szefowa Bożena”, apaszka, wielkie okulary; **nie** prawdziwa osoba) z minami `appalled | stern | approving | delighted`;
  - właściciele z danych (Halina, Zbyszek, Marian, Kamil) jako drugoplanowe SVG.
- **Kluczowe animacje:** wybory jako kartki z bloczka kelnerskiego; statystyki jako trzy wskaźniki w klimacie (termometr na garnku, serce z neonu, kasetka); zmiana statystyki to „+1” lecące do wskaźnika; finał przy drzwiach i powolne odsłanianie sali.
- **Dźwięki:** talerze i sztućce (Impact), drzwi wahadłowe, dzwonek na zamówienie (impactBell), skwierczenie (noise), kasa (Casino). Jingle Pizzicato, niewykorzystane.
- **Logika i testy:**
  - nowy `logic.ts` z `applyEffects` (przycinanie 0–10), `endingFor` i `chefMood`, z testami;
  - `ResultScreen` dostaje `maxScore={30}` (w POC go brak).
- **Do rozstrzygnięcia:** jak bardzo sala ma się zmieniać, czyli ile wariantów każdego elementu.

### 10.4 Danie po składnikach (`danie-po-skladnikach`, inspiracja: MasterChef)

- **Mechanika:**
  - jedna potrawa dziennie (`dailyRng`, blokada w localStorage), potem tryb treningowy;
  - składniki odsłaniają się po jednym (do 6); zła odpowiedź albo „kolejny składnik” odsłania następny;
  - punkty: 7 minus liczba odsłoniętych przy wygranej (1–6), 0 przy porażce;
  - 22 potrawy i ok. 114 różnych składników; dopasowanie przez `matchesAnswer`.
- **Klimat:** studio kulinarne. Stanowiska ze stali, światła nad blatem, deska do krojenia na środku, a składniki wyjeżdżają spod srebrnego klosza.
- **Tło i tryby:** `idle`, `reveal` (klosz się unosi), `wrong` (płomień buchnął), `close` (napięcie, zegar), `correct` (konfetti z mąki), `fail`, `result`.
- **Postacie:** trójka fikcyjnych jurorów SVG (surowy szef, ciepła cukierniczka, młody kucharz molekularny) z minami według liczby odsłoniętych składników: im mniej, tym bardziej zachwyceni.
- **Kluczowe animacje:** klosz unosi się nad każdym składnikiem; składniki układają się na desce; zła odpowiedź jako kartka zmięta do kosza; na koniec talerz z gotowym daniem.
- **Grafika:**
  - składniki jako **OpenMoji** (jak w Podłodze, CC BY-SA 4.0, skrypt pobierający SVG) albo własne ikony; zdjęcia odpadają, bo jest ich za dużo;
  - danie końcowe jako zdjęcie CC (22 zdjęcia, test kompletu).
- **Dźwięki:** krojenie (Impact), skwierczenie (noise), dzwonek kuchenny przy trafieniu (impactBell), uniesienie klosza (Interface), tykanie przy ostatnim składniku. Jingle Pizzicato, niewykorzystane.
- **Logika i testy:** nowy `logic.ts` z `dishScore(revealed)` i `juryMood`; test kompletu zdjęć dań i ikon składników.
- **Do rozstrzygnięcia:** OpenMoji czy własne ikony; czy dodać zdjęcie dania na koniec.

### 10.5 Stylizacja w 60 sekund (`stylizacja`, inspiracja: Top Model, Love the Look)

- **Mechanika:**
  - 3 rundy po 60 s, motyw z puli (pożądane i zakazane tagi);
  - 5 slotów: głowa, góra, dół, buty, dodatek; 29 rzeczy przeciąganych przez dnd-kit albo klikanych;
  - 4 jurorów ocenia 1–10, maksimum 120.
  - Kod: `logic.ts` z `themeFit`, `jurorScore`, `jurorComment`, `JURY`, bez testów.
- **Klimat:** kulisy pokazu mody. Lustro z żarówkami, wieszaki, wybieg z fleszami, a ocena na scenie przed jury.
- **Tło i tryby:** `idle`, `dressing`, `urgent` (ostatnie 10 s, czerwone światło „na scenę!”), `runway` (flesze), `jury`, `result`.
- **Postacie:**
  - manekin lub modelka SVG z warstwami ubrań;
  - jury z danych jako SVG (Projektantka awangardowa, Babcia z klasą, Influencer, Surowy krytyk), z tabliczkami 1–10 podnoszonymi kolejno i minami według oceny.
- **Kluczowe animacje:** rzeczy jako ilustracje SVG, które przy upuszczeniu „wskakują” na manekina; przejście po wybiegu z fleszami; tabliczki ocen podnoszone po kolei; suma liczona na tablicy.
- **Grafika:** **29 rzeczy jako własne SVG** dopasowane do slotów manekina (każda musi pasować do jednej sylwetki). To największa część pracy, a zdjęcia nie wchodzą w grę, bo muszą się nakładać na postać.
- **Dźwięki:** migawka (synteza), szelest ubrań (noise), wieszak (Impact metal), oklaski (noise w seriach), werbel przed oceną. Jingle Sax, niewykorzystane.
- **Logika i testy:** `themeFit` i `jurorScore` dla motywu; `jurorMood` w `logic.ts`.
- **Do rozstrzygnięcia:** manekin czy modelka; jedna sylwetka czy dwie.

### 10.6 Poukładani: upchnij to (`poukladani`, inspiracja: Poukładani)

- **Mechanika:**
  - 3 poziomy pakowania klocków (poliomino) na planszy, losowe obroty na starcie;
  - maksimum 100 pkt na poziom (minimum 20), −5 za każdy ruch ponad liczbę klocków; razem 300.
  - Kod: `logic.ts` z testami; `data-testid`: `piece-*`, `cell-r-c`, `board`, `level-solved`.
- **Klimat:** mieszkanie w bloku. Otwarta szafa, regał albo bagażnik jako plansza na kolejnych poziomach (np. szafa w przedpokoju, regał w pokoju dziecka, bagażnik przed wakacjami).
- **Tło i tryby:** `idle`, `packing`, `fit` (klocek wskakuje), `blocked` (nie pasuje), `solved` (drzwi szafy się zamykają, naklejka „Poukładane!”), `result`.
- **Postacie:** fikcyjna organizatorka przestrzeni SVG (np. „Pani Ola”, notes z metką, miarka) z minami `doubtful | pleased | proud`, zależnymi od liczby nadmiarowych ruchów.
- **Kluczowe animacje:** klocki jako przedmioty narysowane w SVG (stos książek, karton, zwinięte swetry, pudło zabawek) z teksturą zamiast koloru i emoji; obrót z lekkim przechyleniem; trafienie na miejsce ze sprężynką; plansza z drewnianymi półkami.
- **Dźwięki:** karton (Impact soft), drewno (Impact wood), zamknięcie szafy, metka (Interface). Jingle Pizzicato, niewykorzystane.
- **Logika i testy:** istniejące zostają; dodać `organizerMood(extraMoves)`.
- **Do rozstrzygnięcia:** czy każdy poziom ma inny mebel (zalecane).

### 10.7 Gdzie jest Martyna? (`gdzie-jest-martyna`, inspiracja: Kobieta na krańcu świata)

- **Mechanika:**
  - 5 rund z ok. 21 miejsc; zgadywanie kliknięciem na mapie Leaflet;
  - punkty: 5000 × exp(−km/2000), maksimum 25 000.
  - Zdjęcia pobierane na żywo z API Wikipedii, kafelki mapy z OpenStreetMap; `logic.ts` z testami.
- **Klimat:** dziennik podróżniczki. Biurko z rozłożonym notesem, polaroidem z miejsca, paszportem, kompasem i biletami; mapa jak wklejona do notesu.
- **Tło i tryby:** `idle`, `guess`, `reveal` (samolot leci przerywaną linią od typu do celu), `close` (stempel „Brawo!”), `far`, `result` (rozkładówka paszportu ze stemplami).
- **Postacie:** fikcyjna Martyna SVG (plecak, kapelusz, aparat), która wysyła pocztówkę z każdego miejsca i komentuje odległość.
- **Kluczowe animacje:** polaroid wywołuje się przy wejściu; linia lotu rysuje się `pathLength`; licznik kilometrów jak w drogomierzu; stempel kraju w paszporcie.
- **Grafika:**
  - **zdjęcia pobrać do `public/`** z podpisami (koniec zależności od Wikipedii w trakcie gry, ten sam schemat i test co w innych grach);
  - mapa zostaje na Leaflet z atrybucją OSM, a filtr CSS (sepia lub nasycenie) daje wygląd vintage.
- **Dźwięki:** przelot samolotu (noise sweep), stempel (Impact), migawka polaroidu (synteza), szelest kartek. Jingle Steel albo 8-Bit, niewykorzystane.
- **Logika i testy:** istniejące zostają; dodać `travelerMood(km)` i test kompletu zdjęć.
- **Do rozstrzygnięcia:** czy zostawić kafelki OSM (wymagają sieci), czy przejść na własną mapę świata w SVG (np. Natural Earth, domena publiczna). Kafelki OSM mają limity użycia.

### 10.8 Prawda czy ściema? (`prawda-czy-sciema`, inspiracja: Fakty, Szkło kontaktowe)

- **Mechanika:**
  - talia 10 nagłówków (5 prawdziwych i 5 zmyślonych) z puli 24;
  - przesunięcie w lewo lub prawo, przycisk albo strzałki; 1 pkt za trafienie, maksimum 10.
  - Kod: tylko `index.tsx` i `data.json`.
- **Klimat:** satyryczne studio wiadomości późnym wieczorem. Biurko prezentera, ekrany w tle, pasek „PILNE” na dole, depesze z dalekopisu.
- **Tło i tryby:** `idle`, `reading`, `swipe-true`, `swipe-false`, `correct`, `wrong` (ekrany w tle zakłócone), `result`.
- **Postacie:** fikcyjny prezenter SVG (marynarka, krawat, plik kartek) z minami `deadpan | smug | shocked`; po każdej odpowiedzi rzuca suchy komentarz.
- **Kluczowe animacje:** nagłówek jako depesza wysuwana z dalekopisu; przeciągnięcie kartki z pieczątką „PRAWDA” albo „ŚCIEMA” przy krawędzi; pasek „PILNE” przewija wyjaśnienie.
- **Dźwięki:** jingiel serwisu (synteza, krótki akord), dalekopis (stukot noise), pieczątka (Impact), szum ekranu. Jingle 8-Bit albo Hit, niewykorzystane.
- **Logika i testy:**
  - `logic.ts` z `buildDeck` (zawsze 5+5) i testem;
  - przy prawdziwych nagłówkach dodać pole `source` (link do artykułu) i pokazać je w wyjaśnieniu.
- **Do rozstrzygnięcia / ryzyko:** prawdziwość nagłówków trzeba zweryfikować przed dodaniem źródeł.

### 10.9 Kto to powiedział? (`kto-to-powiedzial`, inspiracja: Kuba Wojewódzki, Gogglebox)

- **Mechanika:**
  - 10 cytatów, 3 źródła do wyboru: „Gwiazda na kanapie”, „Rodzina sprzed telewizora”, „Generator bełkotu”;
  - 1 pkt za trafienie, maksimum 10; wszystkie cytaty są fikcyjne (komunikat w interfejsie).
- **Klimat:** salon jak w Gogglebox. Kanapa, telewizor z cytatem jako napisem, lampa i paczka chipsów; telewizor przełącza kanały między cytatami.
- **Tło i tryby:** `idle`, `quote` (szum przełączania kanału), `correct`, `wrong`, `result`.
- **Postacie:** trzy źródła jako trzy SVG do kliknięcia:
  - gwiazda na kanapie talk-show (okulary, futro);
  - rodzina na kanapie (babcia, tata, nastolatka);
  - generator bełkotu jako retro robot lub terminal.

  Wybrane źródło reaguje, a pozostałe patrzą z boku.
- **Kluczowe animacje:** cytat wypisywany jak napisy; szum przełączania; trafienie zapala „ON AIR”, pudło robi przewrócenie oczami rodziny.
- **Dźwięki:** szum TV (noise), klik pilota (Interface), bip robota (tone), tusz (synteza). Jingle Hit, niewykorzystane.
- **Logika i testy:** `logic.ts` z doborem talii i testem, że każde źródło występuje.
- **Do rozstrzygnięcia:** nic krytycznego. Komunikat o fikcyjności zostaje.

### 10.10 To Pan tego nie wie (`to-pan-tego-nie-wie`, inspiracja: Dzień Dobry TVN)

- **Mechanika:**
  - 5 haseł, 3 próby na każde, dziecięca definicja jako podpowiedź;
  - punkty 3, 2 albo 1 zależnie od próby, maksimum 15;
  - etykieta „hasła dnia”, ale bez blokady w localStorage.
- **Klimat:** poranne studio śniadaniowe. Kanapa, kubki, okno na miasto o poranku, kolorowe poduszki.
- **Tło i tryby:** `idle`, `definition`, `wrong` (dziecko się chichra), `correct` (konfetti z kredek), `reveal`, `result`.
- **Postacie:** dzieci z danych (Antoś, Zosia…) jako SVG z jednego komponentu z `LOOKS`, siedzące na za dużym fotelu; definicja w dymku pismem Caveat. Do tego fikcyjna prowadząca.
- **Kluczowe animacje:** dziecko „mówi” (dymek wypisuje się po słowie); hasło jako kafelki liter odsłaniane przy kolejnych próbach (pierwsza litera po drugim błędzie); trafienie podnosi kartkę z rysunkiem dziecka.
- **Dźwięki:** ksylofon (Pizzicato, niewykorzystane), klik długopisu, „pop” przy literze (tone). Jingle Pizzicato.
- **Logika i testy:** `logic.ts` z `pointsFor(attempt)` i `hintFor(word, attempt)`, z testami.
- **Do rozstrzygnięcia:** czy hasła dnia mają blokadę jak w „Danie po składnikach”, czy etykieta „dnia” znika.

### 10.11 Pogodynka (`pogodynka`, inspiracja: prognoza pogody TVN24)

- **Mechanika:**
  - typ jutrzejszego maksimum w 5 miastach Polski; 10 pkt za miasto, −2 za każdy stopień błędu, maksimum 50 dziennie;
  - prawdziwe dane z Open-Meteo, typy w localStorage, rozliczenie przy kolejnym wejściu.
  - Kod: `logic.ts` z testami; `data-testid` `pending-prediction`.
- **Klimat:** studio prognozy pogody. Mapa Polski na ekranie z ikonami pogody, prezenterka ze wskaźnikiem.
- **Tło i tryby:** `idle`, `forecast` (typowanie), `waiting` (typ zapisany, zegar do jutra), `settle` (rozliczenie z animacją termometrów), `result`.
- **Postacie:** fikcyjna prezenterka pogody SVG (żakiet, wskaźnik) z minami według trafności typów.
- **Kluczowe animacje:**
  - typowanie suwakiem lub pokrętłem termometru przy każdym mieście na mapie;
  - ikony pogody animowane w SVG (słońce się obraca, deszcz pada) według prognozy z API;
  - rozliczenie: słupki typ kontra rzeczywistość rosną obok siebie.
- **Grafika:** kontur Polski w SVG z domeny publicznej (np. Natural Earth) z miastami według współrzędnych z `CITIES`.
- **Dźwięki:** jingiel prognozy (synteza), klik pokrętła (Interface), deszcz i wiatr w tle (noise, ciche). Jingle Steel albo 8-Bit, niewykorzystane.
- **Logika i testy:** istniejące zostają; dodać `presenterMood(points)`. W stopce „Dane: Open-Meteo (CC BY 4.0)”.
- **Do rozstrzygnięcia / ryzyko:**
  - gra rozlicza się dopiero następnego dnia, więc lobby i ekran „czekam na jutro” muszą jasno pokazywać stan;
  - test Playwright wymaga podstawienia odpowiedzi API (`page.route`), żeby rozliczenie dało się sprawdzić bez czekania doby.

### 10.12 Co się zaraz stanie? (`co-sie-zaraz-stanie`, inspiracja: Co tu się odjechało?)

- **Mechanika:**
  - 6 scen z puli 8, scena zatrzymana sekundę przed zdarzeniem, 3–4 odpowiedzi do wyboru;
  - po odpowiedzi scena odgrywa się przez 2 s; 1 pkt za trafienie, maksimum 6;
  - aktorzy to emoji przesuwane po pasie drogi (`actors[{ emoji, x, y, toX, toY }]`).
- **Klimat:** nagranie z kamerki samochodowej. Ramka z datą i godziną, „REC”, lekkie linie skanowania i zniekształcenie obiektywu; między scenami przewijanie taśmy.
- **Tło i tryby:** `idle`, `paused` (stopklatka, migające „PAUZA”), `playing`, `correct`, `wrong`, `result`.
- **Postacie:** fikcyjny instruktor jazdy SVG (kamizelka, notes) komentujący zdarzenie z `comment`, z minami `calm | facepalm | approving`.
- **Kluczowe animacje:** sceny drogowe jako SVG (miasto, parking, wieś) z pojazdami i pieszymi SVG zamiast emoji; ruch po ścieżkach `toX`/`toY` z prawdziwym przyspieszeniem; uderzenie trzęsie kadrem.
- **Grafika:** własne SVG pojazdów (osobówka, bus, rower, hulajnoga, ciągnik, pieszy, pies…), po jednym komponencie na typ aktora, z kolorem z danych.
- **Dźwięki:** pisk opon (noise sweep), klakson (tone), stłuczka (Impact metal), szum silnika w tle, klik pauzy. Jingle 8-Bit albo Hit, niewykorzystane.
- **Logika i testy:** `logic.ts` z tasowaniem odpowiedzi i przemapowaniem indeksu poprawnej (test, że poprawna odpowiedź zostaje poprawna).
- **Do rozstrzygnięcia:** czy `data.json` przechodzi z emoji na typy aktorów (zalecane, np. `kind: 'car' | 'bike' | ...`).
