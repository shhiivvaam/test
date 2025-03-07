import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

import * as Sentry from "@sentry/react";

import "react-toastify/dist/ReactToastify.css";

import reportWebVitals from "./reportWebVitals";
import { store } from "./redux/store";
import "./index.css";
import "animate.css";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase/firebase";
import App from "./App";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://0e57d723f24f1beabca8e50fd793c91f@o494560.ingest.sentry.io/4506807881826304",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer toastClassName="poppins-medium" />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

function sendToAnalytics({ id, name, value }: any) {
  logEvent(analytics, "web_vitals", {
    event_category: "Web Vitals",
    event_action: name,
    event_value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    event_label: id, // id unique to current page load
    non_interaction: true, // avoids affecting bounce rate
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendToAnalytics);
