import Link from "next/link";
import * as css from "./form.css";

export function FormSubmitCalcel({
  cancelText,
  hrefCancel,
  submitText,
  dirty,
  disabled,
}: { cancelText: string; hrefCancel: string; submitText: string; dirty: boolean; disabled?: boolean }) {
  function handleClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (dirty) {
      const confirmed = confirm("このページから移動しますか？入力内容は破棄されます。");
      if (!confirmed) {
        e.preventDefault();
      }
    }
  }

  return (
    <div className={css.action_container}>
      <Link href={hrefCancel}>
        <button type="button" onClick={handleClickCancel} className={css.cancel_button}>
          {cancelText}
        </button>
      </Link>
      <button type="submit" className={css.submit_button} disabled={disabled}>
        {submitText}
      </button>
    </div>
  );
}
