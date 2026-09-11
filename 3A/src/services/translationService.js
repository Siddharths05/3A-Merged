// ==================================================
// API BASE URL
// ==================================================

const API_URL =
  "http://localhost:8000";


// ==================================================
// TRANSLATE TEXT
// ==================================================

export async function translateText(
  text,
  targetLanguage
) {

  // ==================================================
  // DO NOT TRANSLATE EMPTY TEXT
  // ==================================================

  if (
    !text ||
    !text.trim()
  ) {

    return text;

  }


  // ==================================================
  // ENGLISH DOES NOT NEED TRANSLATION
  // ==================================================

  if (
    targetLanguage === "en"
  ) {

    return text;

  }


  // ==================================================
  // API REQUEST
  // ==================================================

  const response =
    await fetch(
      `${API_URL}/api/translate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          text: text,
          target_language:
            targetLanguage,
        }),

      }
    );


  // ==================================================
  // HANDLE API ERROR
  // ==================================================

  if (!response.ok) {

    throw new Error(
      "Translation request failed"
    );

  }


  // ==================================================
  // RESPONSE
  // ==================================================

  const data =
    await response.json();


  return data.translated_text;

}