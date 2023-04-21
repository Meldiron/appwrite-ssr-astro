import React, { useState } from "react";
import {AppwriteService} from './AppwriteService.js';
import Card from './Card.jsx';

export default function Content(props) {
  const [isLoading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  function onCloseModal() {
    const dialog = document.getElementById("dialog");

    setModalMessage("");
    setModalType("");
    dialog.close();
  }

  async function onCreateSession(event) {
    event.preventDefault();

    setLoading(true);
    try {
      const res = await fetch("/login", {
        method: "POST",
        body: "",
      });

      setModalType("success");
      setModalMessage("Session created! Refresh page to run SSR check, or re-fetch to run CSR cehck.");
      dialog.showModal();
    } catch (err) {
      setModalType("error");
      setModalMessage(err.message);
      dialog.showModal();
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteSession(event) {
    event.preventDefault();

    setLoading(true);
    try {
      await AppwriteService.signOut();

      setModalType("success");
      setModalMessage("Session deleted! Refresh page to run SSR check, or re-fetch to run CSR cehck.");
      dialog.showModal();
    } catch (err) {
      setModalType("error");
      setModalMessage(err.message);
      dialog.showModal();
    } finally {
      setLoading(false);
    }
  }

  const modalTitle =
    modalType === "error" ? (
      <React.Fragment>
        <div className="avatar is-color-orange is-medium">
          <span className="icon-exclamation" aria-hidden="true" />
        </div>
        <h4 className="modal-title heading-level-5">Error 🚨</h4>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className="avatar is-color-green is-medium">
          <span className="icon-check" aria-hidden="true" />
        </div>
        <h4 className="modal-title heading-level-5">Success 🎉</h4>
      </React.Fragment>
    );

  const action = isLoading ? (
    <div className="loader" />
  ) : (
    <React.Fragment>
      <form onSubmit={onCreateSession}>
        <button className="button" type="submit">
          Create Anonymous Account
        </button>
      </form>

      <form onSubmit={onDeleteSession}>
        <button className="button is-secondary" type="submit">
          Sign Out
        </button>
      </form>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <main className="main-content">
        <div className="top-cover u-padding-block-end-56">
          <div className="container">
            <div className="u-flex u-gap-16 u-flex-justify-center u-margin-block-start-16">
              <h1 className="heading-level-1">Appwrite Loves Svelte Kit</h1>
              <code className="u-un-break-text" />
            </div>
            <p
              className="body-text-1 u-normal u-margin-block-start-8"
              style={{
                maxWidth: "50rem",
              }}
            >
              This is demo application. Use button below to create account.
              Notice both server-side rendering, and client-side requests are
              authorized. The whole process uses 1st party secure cookies.
            </p>
          </div>
        </div>
        <div className="container u-margin-block-start-negative-56">
          <ul
            className="grid-box"
            style={{
              "--grid-gap": "2rem",
              "--grid-item-size": "24rem",
              "--grid-item-size-small-screens": "16rem",
            }}
          >
            <li><Card isCsr={false} account={undefined} /></li>
            <li><Card isCsr={true} /></li>
          </ul>
        </div>
        <div className="container">
          <div className="gradient-border">
            <article
              className="card u-grid u-cross-center u-width-full-line common-section"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--p-card-bg-color)) 0%, hsl(var(--p-card-bg-color)) 12%, hsl(var(--p-body-bg-color)) 100%)",
                border: "none",
              }}
            >
              <div className="u-flex u-flex-vertical u-cross-center u-gap-32 u-margin-block-start-40 u-padding-block-end-56">
                <div className="u-text-center">
                  <h2 className="heading-level-3">Manage Authorization</h2>
                  <p className="body-text-2 u-bold u-margin-block-start-8">
                    This component is not aware of auth status.
                  </p>
                </div>
                <div className="u-flex u-gap-16 u-main-center u-flex-vertical-mobile u-cross-center">
                  {action}
                </div>
              </div>
            </article>
          </div>
          <div className="u-margin-block-end-50" />
        </div>
      </main>

      <div>
        <dialog className="modal is-small" id="dialog">
          <form className="modal-form" method="dialog">
            <header
              className="modal-header u-flex u-gap-12 u-cross-center"
              style={{
                flexDirection: "row",
              }}
            >
              {modalTitle}
            </header>
            <div className="modal-content u-small">{modalMessage}</div>
            <div className="modal-footer">
              <div className="u-flex u-main-end u-gap-16">
                <button onClick={onCloseModal} className="button is-secondary">
                  <span className="text">Close</span>
                </button>
              </div>
            </div>
          </form>
        </dialog>
      </div>
    </React.Fragment>
  );
}
