import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { APP_COPY } from "@/lib/i18n/copy";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { textDirection } from "@/lib/letters/locale";

// A server component, unlike error.tsx (which Next requires to be a client
// component), so it can resolve the language the same way the root layout
// does rather than reading it back from the DOM.
export default async function LetterNotFound() {
  const language = await getPreAuthLanguage();
  const copy = APP_COPY[language].letters;

  return (
    <main
      dir={textDirection(language)}
      className="mx-auto max-w-2xl flex-1 bg-background px-6 py-16"
    >
      <EmptyState
        icon={FileQuestion}
        title={copy.notFoundTitle}
        description={copy.notFoundDescription}
        action={{ label: APP_COPY[language].header.backToDashboard, href: "/dashboard" }}
      />
    </main>
  );
}
