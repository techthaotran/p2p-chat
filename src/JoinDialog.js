import React, { useEffect, useState } from "react";
import SimplePeer from "simple-peer";
import { Dialog } from "use-dialog";

export function JoinDialog({ onConnect }) {
  const [open, setOpen] = useState(false);
  const [peer, setPeer] = useState(null);
  const [offer, setOffer] = useState("");
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    const p = new SimplePeer({
      initiator: false,
      trickle: false,
      objectMode: true
    });
    p.on("signal", data => {
      setAnswer(data);
    });
    p.on("connect", () => {
      onConnect(p);
    });

    setPeer(p);
  }, [onConnect]);

  useEffect(() => {
    if (peer && offer) {
      let offerObject;
      try {
        offerObject = JSON.parse(offer);
        peer.signal(offerObject);
      } catch (err) {
        console.warn("invalid offer");
      }
    }
  }, [offer, peer]);

  return (
    <>
      <Dialog state={[open, setOpen]}>
        <h2>Join Room</h2>
        <p>
          Paste an offer from a peer below, send them your answer, then wait for
          them to connect.
        </p>
        <form method="dialog">
          <label>
            <b>Offer</b>
            <textarea
              style={{ width: "100%" }}
              rows="6"
              value={offer}
              onChange={evt => {
                setOffer(evt.target.value);
              }}
            />
          </label>

          <label>
            <b>Answer</b>
            <textarea
              style={{ width: "100%" }}
              readOnly
              rows="6"
              value={JSON.stringify(answer)}
            />
          </label>

          <button>Cancel</button>
        </form>
      </Dialog>
      <button onClick={() => setOpen(true)}>Join Room</button>
    </>
  );
}
