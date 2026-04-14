import fs from 'fs';
import path from 'path';

// Wir nutzen den /data Ordner im Basisverzeichnis, damit er in Docker leicht als Volume gemounted werden kann.
const dataDirectory = path.join(process.cwd(), 'data');
const subscribersFile = path.join(dataDirectory, 'subscribers.json');

// Hilfsfunktion: Stellt sicher, dass Datei existiert
const ensureDbExists = () => {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
  if (!fs.existsSync(subscribersFile)) {
    fs.writeFileSync(subscribersFile, JSON.stringify([]), 'utf-8');
  }
};

export const getSubscribers = (): string[] => {
  ensureDbExists();
  try {
    const data = fs.readFileSync(subscribersFile, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Datenbank Lesefehler:", error);
    return [];
  }
};

export const addSubscriber = (email: string): boolean => {
  if (!email || typeof email !== 'string' || !email.includes('@')) return false;
  
  const cleanEmail = email.toLowerCase().trim();
  const currentSubscribers = getSubscribers();
  
  // Deduplizierung: Nur hinzufügen wenn noch nicht vorhanden
  if (currentSubscribers.includes(cleanEmail)) {
    return true; // Bereits drin, aber Erfolg melden (Security Best-Practice)
  }
  
  currentSubscribers.push(cleanEmail);
  
  try {
    fs.writeFileSync(subscribersFile, JSON.stringify(currentSubscribers, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Datenbank Schreibfehler:", error);
    return false;
  }
};
