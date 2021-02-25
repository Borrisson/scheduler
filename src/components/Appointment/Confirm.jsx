import React from "react";

import Button from "components/Button";

export default function Confirm({ id, message, onConfirm, onCancel }) {
  return (
    <main className="appointment__card appointment__card--confirm">
      <h1 className="text--semi-bold">Delete the appointment?</h1>
      <section className="appointment__actions">
        <Button onClick={onCancel} danger>
          Cancel
        </Button>
        <Button onClick={() => onConfirm(id)} danger>
          Confirm
        </Button>
      </section>
    </main>
  );
}
