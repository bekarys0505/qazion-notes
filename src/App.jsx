jsx
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [showInstall, setShowInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem("qazion-notes");

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const installApp = async () => {
    if (isStandalone) {
      return;
    }

    // Android / Chrome
    if (deferredPrompt) {
      deferredPrompt.prompt();

      const result = await deferredPrompt.userChoice;

      if (result.outcome === "accepted") {
        setDeferredPrompt(null);
      }

      return;
    }

    // iPhone / iPad
    setShowInstall(true);
  };

  const addNote = () => {
    const text = prompt("Жаңа жазба:");

    if (!text || !text.trim()) return;

    const newNote = {
      id: Date.now(),
      text: text.trim(),
    };

    const updatedNotes = [...notes, newNote];

    setNotes(updatedNotes);
    localStorage.setItem("qazion-notes", JSON.stringify(updatedNotes));
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);

    setNotes(updatedNotes);
    localStorage.setItem("qazion-notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>📝 QAZION Notes</h1>
          <p>Менің жеке жазбаларым</p>
        </div>

        {!isStandalone && (
          <button className="install-button" onClick={installApp}>
            📲 Орнату
          </button>
        )}
      </header>

      <main className="content">
        <button className="add-button" onClick={addNote}>
          ＋ Қосу
        </button>

        {notes.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👀</div>
            <h2>Әзірге жазба жоқ</h2>
            <p>Алғашқы жазбаңды қосып көр</p>
          </div>
        ) : (
          <div className="notes">
            {notes.map((note) => (
              <div className="note" key={note.id}>
                <p>{note.text}</p>

                <button
                  className="delete-button"
                  onClick={() => deleteNote(note.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {showInstall && (
        <div className="modal-overlay" onClick={() => setShowInstall(false)}>
          <div className="install-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setShowInstall(false)}
            >
              ×
            </button>

            <div className="modal-icon">📲</div>

            <h2>QAZION-ды орнату</h2>

            {isIOS ? (
              <>
                <p>iPhone-ға қосымша ретінде орнату үшін:</p>

                <div className="steps">
                  <div>
                    <span>1</span>
                    <p>
                      Safari браузеріндегі <b>Share</b> батырмасын бас
                      <br />
                      <small>□↑</small>
                    </p>
                  </div>

                  <div>
                    <span>2</span>
                    <p>
                      <b>Add to Home Screen</b> таңда
                    </p>
                  </div>

                  <div>
                    <span>3</span>
                    <p>
                      <b>Add</b> батырмасын бас
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>
                  Браузер мәзірінен <b>Install QAZION Notes</b> таңдаңыз.
                </p>
              </>
            )}

            <button
              className="modal-ok"
              onClick={() => setShowInstall(false)}
            >
              Түсіндім
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

