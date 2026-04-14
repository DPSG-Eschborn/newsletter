'use client';

import React, { useState, useEffect } from 'react';
import { Send, Eye, PenLine, SendHorizontal, Mail, Info, X } from 'lucide-react';

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(
    '# NEUE AUSGABE\n\n## Hallo!\n\nDas ist der neue Newsletter der DPSG Eschborn.\n\nDu kannst hier Text schreiben, Bilder einfügen oder Links integrieren.\n\n[Mehr erfahren](https://dpsg-eschborn.de/ "button")'
  );
  
  const [subject, setSubject] = useState<string>('Neuigkeiten aus dem Stamm');
  const [issueNumber, setIssueNumber] = useState<string>('01');
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Lade Abonnentenzahl beim Start
  useEffect(() => {
    fetch('/api/subscribers/count')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          setSubscriberCount(data.count);
        }
      })
      .catch(err => console.error("Could not fetch subscriber count", err));
  }, []);

  // Debounce the preview update
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: markdown, subject: subject, issueNumber }),
      })
        .then((res) => res.text())
        .then((html) => setHtmlPreview(html))
        .catch((err) => console.error('Failed to update preview:', err));
    }, 500);

    return () => clearTimeout(timer);
  }, [markdown, subject, issueNumber]);

  const handleSend = async () => {
    if (!subject || !markdown) {
      alert('Bitte fülle den Betreff und den Inhalt aus.');
      return;
    }
    
    if (subscriberCount === 0 || subscriberCount === null) {
      alert('Es sind keine Abonnenten in der Datenbank vorhanden.');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content: markdown, issueNumber }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Newsletter erfolgreich versendet!');
      } else {
        alert(`Fehler beim Senden: ${data.error?.message || data.error || 'Unbekannter Fehler'}`);
      }
    } catch (error) {
      alert('Kritischer Fehler beim Versenden des Newsletters.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-neutral-100 flex flex-col font-sans overflow-hidden text-neutral-900">
      {/* Header - Serious DPSG Corporate Blue */}
      <header className="bg-[#001a33] text-white px-6 py-4 shadow-md flex justify-between items-center z-20 shrink-0">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="DPSG Eschborn Logo" className="h-10 object-contain" />
          <h1 className="text-lg font-semibold tracking-wide border-l border-white/20 pl-4 hidden sm:block">Newsletter-Tool</h1>
        </div>
      </header>

      {/* Action Bar - Clean configuration row */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 shrink-0 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-24 flex flex-col gap-1.5 shrink-0">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ausgabe</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">#</span>
            <input
              type="text"
              className="border border-neutral-300 bg-white text-neutral-900 pl-7 pr-3 py-2 rounded focus:ring-2 focus:ring-[#001a33] focus:border-[#001a33] outline-none transition-all w-full text-sm font-bold"
              value={issueNumber}
              onChange={(e) => setIssueNumber(e.target.value)}
              placeholder="01"
            />
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Betreff der E-Mail</label>
          <input
            type="text"
            className="border border-neutral-300 bg-white text-neutral-900 px-3 py-2 rounded focus:ring-2 focus:ring-[#00305e] focus:border-[#00305e] outline-none transition-all w-full text-sm"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Betreff..."
          />
        </div>
        <div className="w-full md:w-auto flex flex-col gap-1.5 shrink-0 min-w-[200px]">
          <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Verteiler</label>
          <div className="flex items-center h-[38px] px-3 bg-neutral-100 border border-neutral-200 rounded text-sm text-neutral-600 font-medium">
            {subscriberCount !== null ? (
              <span>Versand an <strong>{subscriberCount}</strong> Abonnenten</span>
            ) : (
              <span>Lade Datenbank...</span>
            )}
          </div>
        </div>
        <div className="w-full md:w-auto pt-2 md:pt-0">
          <button
            onClick={handleSend}
            disabled={isSending}
            className="bg-[#001a33] hover:bg-[#000d1a] transition-colors text-white font-medium px-6 py-2 rounded w-full md:w-auto shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 text-sm h-[38px]"
          >
            <SendHorizontal className="w-4 h-4" />
            {isSending ? 'Sende...' : 'Jetzt versenden'}
          </button>
        </div>
      </div>

      {/* Mobile Tabs Toggle */}
      <div className="md:hidden flex bg-white border-b border-neutral-200 shrink-0">
        <button 
          onClick={() => setIsMobilePreview(false)} 
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${!isMobilePreview ? 'text-[#001a33] border-b-2 border-[#001a33] bg-blue-50/50' : 'text-neutral-500 hover:bg-neutral-50'}`}
        >
          <PenLine className="w-4 h-4" /> Editor
        </button>
        <button 
          onClick={() => setIsMobilePreview(true)} 
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${isMobilePreview ? 'text-[#001a33] border-b-2 border-[#001a33] bg-blue-50/50' : 'text-neutral-500 hover:bg-neutral-50'}`}
        >
          <Eye className="w-4 h-4" /> Vorschau
        </button>
      </div>

      {/* Main Content Area - Split Panes */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0 bg-neutral-100">
        
        {/* Editor Pane */}
        <div className={`w-full md:w-1/2 flex flex-col border-r border-neutral-200 bg-white transition-all absolute md:relative h-full ${isMobilePreview ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto z-0' : 'z-10'}`}>
          <div className="bg-white px-4 py-2 text-xs font-bold text-neutral-500 tracking-wider flex justify-between items-center border-b border-neutral-200 shrink-0 uppercase">
            <span>Markdown Editor</span>
            <button 
              onClick={() => setShowInfo(true)}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-[#001a33] transition-colors"
            >
              <Info className="w-4 h-4" /> Info & Formatierung
            </button>
          </div>
          <textarea
            className="flex-1 w-full p-5 resize-none outline-none font-mono text-sm leading-relaxed text-neutral-900 bg-white placeholder-neutral-400"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Schreibe den Newsletter in Markdown..."
          />
          <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500 shrink-0">
            <strong>Tipp für Buttons:</strong> Setze ein <code className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-mono text-[11px]">"button"</code> hinter die URL in der Klammer: <code className="bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-mono text-[11px]">[Hier Klicken](https://url.de "button")</code>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className={`w-full md:w-1/2 flex flex-col bg-white transition-all absolute md:relative h-full ${!isMobilePreview ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto z-0' : 'z-10'}`}>
           <div className="bg-white px-4 py-2 text-xs font-bold text-neutral-500 tracking-wider flex justify-between items-center border-b border-neutral-200 shrink-0 uppercase">
            <span>Desktop & Mobile Vorschau</span>
          </div>
          {/* Flex wrapper ensuring absolute boundaries for iframe */}
          <div className="flex-1 w-full relative p-0 overflow-hidden flex justify-center bg-white">
            <div className="w-full h-full flex flex-col relative">
               {htmlPreview ? (
                  <iframe 
                    title="Email Preview"
                    srcDoc={htmlPreview}
                    className="w-full h-full border-none absolute inset-0 bg-white"
                  />
               ) : (
                 <div className="flex-1 flex justify-center items-center text-neutral-400 font-medium text-sm">
                   Live-Vorschau wird geladen...
                 </div>
               )}
            </div>
          </div>
        </div>

      </div>

      {/* Markdown Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-neutral-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h2 className="text-lg font-bold text-[#001a33] flex items-center gap-2">
                <Info className="w-5 h-5" /> Markdown Hilfe & Cheat-Sheet
              </h2>
              <button onClick={() => setShowInfo(false)} className="text-neutral-400 hover:text-neutral-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto text-sm text-neutral-700 font-sans space-y-6">
              <div>
                <h3 className="font-bold text-neutral-900 mb-2 uppercase text-xs tracking-wider border-b pb-1">1. Überschriften</h3>
                <div className="grid grid-cols-[150px_1fr] gap-2 items-center bg-neutral-50 p-3 rounded">
                  <code className="text-[#001a33] font-mono text-xs"># Großer Titel</code>
                  <span>Erzeugt den dicken, blauen Titel (Ebene 1).</span>
                  <code className="text-[#001a33] font-mono text-xs">## Hallo!</code>
                  <span>Erzeugt die reguläre Textüberschrift (Ebene 2).</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 mb-2 uppercase text-xs tracking-wider border-b pb-1">2. Links & Buttons (Wichtig)</h3>
                <div className="grid grid-cols-[160px_1fr] gap-x-2 gap-y-3 items-center bg-neutral-50 p-3 rounded">
                  <code className="text-[#001a33] font-mono text-xs">[Linktext](https://...)</code>
                  <span>Erzeugt einen gelben Textlink im Fließtext.</span>
                  <code className="text-[#001a33] font-mono text-xs">[Button-Text](url "button")</code>
                  <span>Das angehängte <strong>"button"</strong> wandelt den Link in einen anklickbaren, blauen Call-To-Action (CTA) Button um.</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 mb-2 uppercase text-xs tracking-wider border-b pb-1">3. Textgestaltung & Listen</h3>
                <div className="grid grid-cols-[150px_1fr] gap-2 items-center bg-neutral-50 p-3 rounded">
                  <code className="text-[#001a33] font-mono text-xs">**Fett** oder *Kursiv*</code>
                  <span>Hebt bestimmte Textstellen dick oder schräg hervor.</span>
                  <code className="text-[#001a33] font-mono text-xs">- Punkt 1</code>
                  <span>Bindestrich erzeugt eine einfache Aufzählungsliste.</span>
                  <code className="text-emerald-700 font-mono text-xs">&gt; Zitat-Text</code>
                  <span>Rückt den Satz ein wie eine Zitier-Box.</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 mb-2 uppercase text-xs tracking-wider border-b pb-1">4. Bilder einfügen</h3>
                <div className="bg-neutral-50 p-3 rounded space-y-2">
                  <p>Um ein Bild einzufügen, brauchst du einen Link zum Bild (es muss im Internet liegen, z.B. auf eurer Nextcloud oder Webseite):</p>
                  <code className="text-[#001a33] font-mono text-xs block">![Bildbeschreibung](https://dpsg-eschborn.de/bild.png)</code>
                  <p className="text-xs text-neutral-500 mt-1">Hinweis: Das Ausrufezeichen am Anfang markiert es als Bild statt als Link.</p>
                </div>
              </div>

            </div>
            
            <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 text-right">
              <button 
                onClick={() => setShowInfo(false)}
                className="bg-[#001a33] text-white px-6 py-2 rounded font-medium text-sm hover:bg-[#000d1a]"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
