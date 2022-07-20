import React, { useCallback, useState } from "react";
import styles from "./App.module.css";
import { JoinDialog } from "./JoinDialog";
import { CreateDialog } from "./CreateDialog";

export default function App() {
  const [peer, setPeer] = useState(null);
  const [log, setLog] = useState([]);
  const [message, setMessage] = useState("");

  const onConnect = useCallback(p => {
    setPeer(p);
    p.on("data", data => {
      setLog(log => [{ local: false, action: "message", value: data }, ...log]);
    });
    p.on("close", data => {
      setLog(log => [{ local: false, action: "disconnect" }, ...log]);
    });
    p.on("error", data => {
      setLog(log => [{ local: false, action: "error", value: data }, ...log]);
    });
  }, []);

  return (
    <div className="App">
      <h1>Thao test:Serverless P2P Chat</h1>
      {peer ? (
        <>
          <div className={styles.chatLog}>
            {log.map(({ local, action, value }, idx) => (
              <div key={idx}>
                {action === "message" && (
                  <>
                    <span
                      className={
                        local ? styles.usernameLocal : styles.usernameRemote
                      }
                    >
                      {local ? "You" : "Stranger"}:{" "}
                    </span>
                    {value}
                  </>
                )}
                {action === "disconnect" && (
                  <span className={styles.usernameRemote}>
                    Stranger has disconnected.
                  </span>
                )}
                {action === "error" && (
                  <span className={styles.debugInfo}>{value.toString()}</span>
                )}
              </div>
            ))}
          </div>
          <form
            className={styles.chatForm}
            onSubmit={e => {
              e.preventDefault();
              try {
                peer.send(message);
                setLog([
                  { local: true, action: "message", value: message },
                  ...log
                ]);
                setMessage("");
              } catch (err) {
                setLog(log => [
                  {
                    local: false,
                    action: "error",
                    value: "Error: cannot send message"
                  },
                  ...log
                ]);
              }
            }}
          >
            <input
              autoFocus
              className={styles.chatInput}
              type="text"
              value={message}
              onChange={evt => setMessage(evt.target.value)}
            />
            <button>Send</button>
          </form>
        </>
      ) : (
        <>
          <CreateDialog onConnect={onConnect} />
          <JoinDialog onConnect={onConnect} />
        </>
      )}
    </div>
  );
}
