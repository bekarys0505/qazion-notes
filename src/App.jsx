import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  // Supabase-тен жазбаларды алу
  async function getNotes() {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Жазбаларды алу қатесі:", error);
      return;
    }

    setNotes(data);
  }

  // Жаңа жазба қосу
  async function addNote() {
    if (!text.trim()) return;

    const { error } = await supabase
      .from("notes")
      .insert({
        text: text.trim(),
      });

    if (error) {
      console.error("Жазба қосу қатесі:", error);
      alert("Жазба қосылмады 😕");
      return;
    }

    setText("");
    getNotes();
  }

  // Жазбаны өшіру
  async function deleteNote(id) {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Өшіру қатесі:", error);
      return;
    }

    getNotes();
  }

  // Сайт ашылған кезде жазбаларды жүктеу
  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="app">
      <div className="container">

        <h1>📝 QAZION Notes</h1>

        <p className="subtitle">
          Менің жеке жазбаларым
        </p>

        <div className="input-box">
          <input
            type="text"
            placeholder="Жаңа жазба жаз..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNote();
              }
            }}
          />

          <button onClick={addNote}>
            Қосу
          </button>
        </div>

        <div className="notes">

          {notes.length === 0 ? (
            <div className="empty">
              Әзірге жазба жоқ 👀
            </div>
          ) : (
            notes.map((note) => (
              <div className="note" key={note.id}>

                <div>
                  <p>{note.text}</p>

                  <small>
                    {new Date(note.created_at).toLocaleString("kk-KZ")}
                  </small>
                </div>

                <button
                  className="delete"
                  onClick={() => deleteNote(note.id)}
                >
                  🗑️
                </button>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default App;