import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./index.css"
import { LangProvider } from "./i18n"
import App from "./App.jsx"
import LetsGoTogether from "./LetsGoTogether.jsx"
import { STRATEGY_CONFIRM_PATH } from "./routes"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path={STRATEGY_CONFIRM_PATH} element={<LetsGoTogether />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  </StrictMode>,
)
