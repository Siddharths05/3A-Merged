import {
  useEffect,
  useState,
} from "react";

import {
  useTranslation,
} from "../context/TranslationContext";


// ==================================================
// USE TRANSLATE HOOK
// ==================================================

export default function useTranslate(
  text,
  fallback
) {

  // ==================================================
  // TRANSLATION CONTEXT
  // ==================================================

  const {
    language,
    t,
    translateText,
  } = useTranslation();


  // ==================================================
  // LOCAL TRANSLATION
  // ==================================================

  const localTranslation =
    t(
      text,
      undefined
    );


  // ==================================================
  // CHECK IF TRANSLATION EXISTS
  // ==================================================

  const hasLocalTranslation =
    localTranslation !== text;


  // ==================================================
  // TRANSLATED TEXT STATE
  // ==================================================

  const [
    translatedText,
    setTranslatedText,
  ] = useState(() => {

    if (hasLocalTranslation) {

      return localTranslation;

    }


    return fallback ??
      text;

  });


  // ==================================================
  // UPDATE WHEN LANGUAGE OR TEXT CHANGES
  // ==================================================

  useEffect(() => {

    // ================================================
    // EMPTY VALUE
    // ================================================

    if (
      text === null ||
      text === undefined ||
      text === ""
    ) {

      setTranslatedText(text);

      return;

    }


    // ================================================
    // USE LOCAL TRANSLATION
    // ================================================

    if (hasLocalTranslation) {

      setTranslatedText(
        localTranslation
      );

      return;

    }


    // ================================================
    // ENGLISH FALLBACK
    // ================================================

    if (language === "en") {

      setTranslatedText(
        fallback ??
        text
      );

      return;

    }


    // ================================================
    // API TRANSLATION FALLBACK
    // ================================================

    let isCancelled =
      false;


    const translate = async () => {

      try {

        const result =
          await translateText(
            fallback ??
            text
          );


        if (!isCancelled) {

          setTranslatedText(
            result
          );

        }

      } catch (error) {

        console.error(
          "Translation error:",
          error
        );


        if (!isCancelled) {

          setTranslatedText(
            fallback ??
            text
          );

        }

      }

    };


    translate();


    // ================================================
    // CLEANUP
    // ================================================

    return () => {

      isCancelled =
        true;

    };

  }, [
    text,
    fallback,
    language,
    localTranslation,
    hasLocalTranslation,
    translateText,
  ]);


  // ==================================================
  // RETURN TRANSLATION
  // ==================================================

  return translatedText;

}