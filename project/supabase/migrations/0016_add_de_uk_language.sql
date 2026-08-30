-- German and Ukrainian were added throughout the application (translation
-- dictionaries, language pickers, Gemini prompts) but the database enum
-- backing profiles.language and letters.language was never extended to
-- match — every attempt to save "de" or "uk" was failing at the database
-- layer with an invalid enum value error.
alter type public.app_language add value 'de';
alter type public.app_language add value 'uk';
