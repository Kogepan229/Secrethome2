import Link from "next/link";
import { BasicButton } from "../BasicButton";

export function FormSubmitCalcel({
  cancelText,
  hrefCancel,
  submitText,
  dirty,
  disabled,
}: {
  cancelText: string;
  hrefCancel: string;
  submitText: string;
  dirty: boolean;
  disabled?: boolean;
}) {
  function handleClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (dirty) {
      const confirmed = confirm("このページから移動しますか？入力内容は破棄されます。");
      if (!confirmed) {
        e.preventDefault();
      }
    }
  }

  return (
    <div className="flex w-full mt-2 justify-between">
      <Link href={hrefCancel}>
        <BasicButton type="button" onClick={handleClickCancel} color="whiteRed" className="w-fit min-w-15">
          {cancelText}
        </BasicButton>
      </Link>
      <BasicButton type="submit" disabled={disabled} className="w-fit min-w-15">
        {submitText}
      </BasicButton>
    </div>
  );
}
