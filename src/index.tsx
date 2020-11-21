import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { inspect } from "@xstate/inspect"

inspect({
  // options
  url: "https://statecharts.io/inspect", // (default)
  iframe: false,
  // () =>  document.querySelector("iframe[data-xstate]") as HTMLIFrameElement,
})

ReactDOM.render(
  <React.StrictMode>
    <>
      <App />
    </>
  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
