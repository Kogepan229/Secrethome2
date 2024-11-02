import type { FormMetadata } from "@conform-to/react";
import { useEffect } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function usePreventResetForm(form: FormMetadata<any>) {
  useEffect(() => {
    const preventDefault = (event: Event) => {
      // Make sure the reset event is dispatched on the corresponding form element
      if (event.target === document.forms.namedItem(form.id)) {
        // Tell Conform to ignore the form reset event
        event.preventDefault();
      }
    };

    document.addEventListener("reset", preventDefault, true);

    return () => {
      document.removeEventListener("reset", preventDefault, true);
    };
  }, [form.id]);
}
