import { StrictMode } from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";


import "./index.css";


import App from "./App.jsx";


import {
  ThemeProvider,
} from "./context/ThemeContext";


import {
  LanguageProvider,
} from "./context/LanguageContext";


import {
  TranslationProvider,
} from "./context/TranslationContext";


// ==================================================
// APPLICATION ROOT
// ==================================================

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    {/* ============================================== */}
    {/* THEME PROVIDER */}
    {/* ============================================== */}

    <ThemeProvider>


      {/* ============================================ */}
      {/* LANGUAGE PROVIDER */}
      {/* ============================================ */}

      <LanguageProvider>


        {/* ========================================== */}
        {/* TRANSLATION PROVIDER */}
        {/* ========================================== */}

        <TranslationProvider>


          {/* ======================================== */}
          {/* ROUTER */}
          {/* ======================================== */}

          <BrowserRouter>

            <App />

          </BrowserRouter>


        </TranslationProvider>


      </LanguageProvider>


    </ThemeProvider>


  </StrictMode>

);