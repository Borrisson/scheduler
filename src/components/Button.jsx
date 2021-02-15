import React from "react";

import "components/Button.scss";

import classNames from "classnames";

export default function Button(props) {
  return (
    <button
      className={classNames("button", {
        ["button--confirm"]: props.confirm,
        ["button--danger"]: props.danger,
      })}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
