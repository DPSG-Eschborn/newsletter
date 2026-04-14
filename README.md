# DPSG Eschborn Newsletter-System

Ein modernes, leichtgewichtiges Newsletter-System, gebaut mit Next.js, React Email und Tailwind CSS. Es generiert ein wunderschönes E-Mail-Layout für den DPSG Pfadfinderstamm, übersetzt Markdown in E-Mail-Templates und verwaltet Abonnenten lokal in einer strikt DSGVO-konformen JSON-Datenbank.

## Features
- **Split-Screen Editor**: Live-Vorschau (Desktop & Mobile) der E-Mail während du in Markdown tippst.
- **Automatische Empfänger-Verwaltung**: Keine CSV-Dateien mehr nötig; eine lokale JSON-Datenbank führt alle Abonnenten automatisch und duplikatsfrei.
- **DSGVO-Sicher**: E-Mail-Adressen werden nicht im Interface ans System gesendet. Kein Angreifer kann sich die Abonnenten-Liste abgreifen.

## Setup & Start

Damit du den Server starten und E-Mails via Resend verschicken kannst, brauchst du eine `.env` Datei im Stammverzeichnis:

1. Kopiere die Datei `.env.example` zu `.env` (falls vorhanden) oder erstelle eine `.env`.
2. Füge deinen Resend API-Key hinzu:
   ```env
   RESEND_API_KEY=re_DeinSchlüsselHier
   ```
3. Starte den Development Server:
   ```bash
   npm run dev
   ```
   Das Tool ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.


## Setup mit Docker

Wenn du das Projekt auf einem echten Server laufen lässt (z. B. via Docker), **musst du ein separates lokales Volume einrichten**, damit die Abonnenten beim Neuladen/Updaten des Servers nicht verloren gehen.

Mappe `/app/data` (oder das Verzeichnis, in dem die App auf dem Docker läuft) auf dein lokales System:
```yaml
volumes:
  - ./mein_daten_ordner:/app/data
```


---

## Integration: Newsletter-Anmeldung auf der Website einbauen

Um es euren Nutzern zu ermöglichen, sich für den Newsletter einzutragen, verfügt das Backend über eine **öffentliche, abhörsichere ReST-API**. 

Ihr müsst auf eurer WordPress/Nextcloud oder Webseite einfach nur ein kleines Formular einbauen, das z. B. auf Knopfdruck folgenden einfachen JavaScript `fetch()` Befehl ausführt.

### API-Spezifikation

* **Endpunkt:** `POST /api/subscribe`
* **Payload:** `{ "email": "pfadfinder@dpsg-eschborn.de" }`

**Beispiel-Snippet (JavaScript):**
```javascript
// Funktion, z.B. wenn jemand auf "Abonnieren" klickt
async function newsletterAbonnieren(eingabeEmail) {
    try {
        const response = await fetch("https://eure-newsletter-domain.de/api/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: eingabeEmail })
        });
        
        if(response.ok) {
            alert("Erfolgreich abonniert!");
        } else {
            alert("Fehler bei der Anmeldung.");
        }
    } catch (err) {
        console.error("Netzwerkfehler", err);
    }
}
```

**Sicherheitshinweis:**
Die API ist komplett *Write-Only* (Nur Schreiben). Egal, ob eine E-Mail bereits existiert oder noch nicht, die API gibt Angreifern **niemals** eine Bestätigung darüber, ob die Adresse in der Datenbank steht. Das System schluckt Duplikate stumm und antwortet immer mit `Status 200: Success`. Das verhindert sogenannte *E-Mail Enumeration Angriffe*.
