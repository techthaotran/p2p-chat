import React, { useEffect, useState } from "react";
import SimplePeer from "simple-peer";
import { Dialog } from "use-dialog";

export function CreateDialog({ onConnect }) {
  const [open, setOpen] = useState(false);
  const [peer, setPeer] = useState(null);
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const p = new SimplePeer({
      initiator: true,
      trickle: false,
      objectMode: true
    });
    p.on("signal", data => {
      setOffer(data);
    });
    p.on("connect", () => {
      onConnect(p);
    });
    setPeer(p);
  }, [onConnect]);

  return (
    <>
      <Dialog state={[open, setOpen]}>
        <h2>Create Room</h2>
        <p>
          Send your offer to a peer, then paste their answer below to connect.
        </p>
        <form method="dialog">
          <label>
            <b>Offer</b>
            <textarea
              style={{ width: "100%" }}
              readOnly
              rows="6"
              value={JSON.stringify(offer)}
            />
          </label>

          <label>
            <b>Answer</b>
            <textarea
              style={{ width: "100%" }}
              rows="6"
              value={answer}
              onChange={evt => setAnswer(evt.target.value)}
            />
          </label>

          <button>Cancel</button>
          <button
            onClick={() => {
              if (peer && answer) {
                let answerObject;
                try {
                  answerObject = JSON.parse(answer);
                  peer.signal(answerObject);
                } catch (err) {
                  console.warn("invalid answer");
                }
              }
            }}
          >
            Connect
          </button>
        </form>
      </Dialog>
      <button onClick={() => setOpen(true)}>Create Room</button>
    </>
  );
}
