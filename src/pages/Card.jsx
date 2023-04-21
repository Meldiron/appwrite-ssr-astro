import React, { useState } from "react";
import { AppwriteService } from "./AppwriteService";

export default function Card(props) {
  const [account, setAccount] = useState(props.account ?? undefined);
  const isCsr = props.isCsr;

  async function fetchAccount() {
    setAccount(true);

    try {
      setAccount(await AppwriteService.getAccount());
    } catch (err) {
      setAccount(null);
      account = null;
    }
  }

  const avatarElement =
    account === undefined || account === true || account === null ? (
      <div
        style={{
          "--p-avatar-border-color": "var(--color-neutral-120)",
        }}
        className="avatar is-color-empty"
      />
    ) : (
      <div className="avatar">
        <img
          src={AppwriteService.getAccountPicture(account.$id)}
          alt="Avatar"
        />
      </div>
    );

  let statusElement;

  if (account === undefined) {
    statusElement = <React.Fragment>Not Fetched Yet.</React.Fragment>;
  } else if (account === null) {
    statusElement = <React.Fragment>You are not signed in.</React.Fragment>;
  } else if (account === true) {
    statusElement = <React.Fragment>Fetching Account...</React.Fragment>;
  } else {
    statusElement = (
      <React.Fragment>
        Welcome{" "}
        <code className="u-un-break-text inline-code">{account.$id}</code>
      </React.Fragment>
    );
  }

  return (
    <div
      className={`card ${
        account === undefined || account === true
          ? "card-is-pending"
          : account === null
          ? "card-is-failed"
          : "card-is-complete"
      }`}
    >
      <div className="u-flex u-main-space-between u-cross-center">
        <div className="">
          <div className="eyebrow-heading-3">
            {isCsr ? "Client" : "Server"} Side
          </div>
        </div>

        <div
          style={{
            opacity: isCsr ? "100%" : "0%",
          }}
        >
          <div className="status">
            <button onClick={fetchAccount} className="tag">
              <span className="text">Fetch</span>
            </button>
          </div>
        </div>
      </div>

      <h2 className="heading-level-6 u-margin-block-start-2">
        {statusElement}
      </h2>

      <div className="u-flex u-main-space-between u-cross-end u-margin-block-start-40">
        {avatarElement}
        <div
          className={`status ${
            account === undefined || account === true
              ? "is-pending"
              : account === null
              ? "is-failed"
              : "is-complete"
          }`}
        >
          <span className="status-icon" />
        </div>
      </div>
    </div>
  );
}
