import { type Ref, useCallback } from "react";

export const useCombinedRefs = <T>(...refs: Array<Ref<T> | undefined | null>): Ref<T> =>
  useCallback(
    (element: T) =>
      refs.forEach((ref) => {
        if (!ref) {
          return;
        }
        if (typeof ref === "function") {
          ref(element);
        } else {
          ref.current = element;
        }
      }),
    [refs],
  );
