import { type FormMetadata, getInputProps, type FieldMetadata } from "@conform-to/react";
import type { CustomDescriptionCategory } from "../types";
import type { CreateRoomSchema } from "../schema";
import ArrowUpIcon from "@/assets/button/arrow_up.svg";
import ArrowDownIcon from "@/assets/button/arrow_down.svg";
import TrashIcon from "@/assets/button/trash.svg";
import * as cssForm from "@/components/form/form.css";
import * as css from "./FormCustomDescriptions.css";
import { createId } from "@paralleldrive/cuid2";
import { useMemo } from "react";

function FormCustomDescriptionRow({
  form,
  categories,
  category,
  index,
}: {
  form: FormMetadata<CreateRoomSchema, string[]>;
  categories: FieldMetadata<CustomDescriptionCategory[] | null | undefined, CreateRoomSchema, string[]>;
  category: FieldMetadata<CustomDescriptionCategory, CreateRoomSchema, string[]>;
  index: number;
}) {
  const categoryFields = category.getFieldset();
  const id = useMemo(() => createId(), []);

  return (
    <li key={category.key} className={css.list_item}>
      <input type="hidden" name={categoryFields.id.name} value={id} key={categoryFields.id.key} />
      <input {...getInputProps(categoryFields.label, { type: "text" })} key={categoryFields.label.key} className={cssForm.input_text} />
      <div className={css.button_container}>
        <button
          {...form.reorder.getButtonProps({
            name: categories.name,
            from: index,
            to: index - 1,
          })}
          className={css.button}
        >
          <ArrowUpIcon width={16} height={16} />
        </button>
        <button
          {...form.reorder.getButtonProps({
            name: categories.name,
            from: index,
            to: index + 1,
          })}
          className={css.button}
        >
          <ArrowDownIcon width={16} height={16} />
        </button>
        <button
          {...form.remove.getButtonProps({
            name: categories.name,
            index,
          })}
          className={css.button}
        >
          <TrashIcon width={16} height={16} />
        </button>
      </div>
    </li>
  );
}

export function FormCustomDescriptions({
  form,
  field,
}: {
  form: FormMetadata<CreateRoomSchema, string[]>;
  field: FieldMetadata<CustomDescriptionCategory[] | null | undefined, CreateRoomSchema, string[]>;
}) {
  const categories = field.getFieldList();
  const categoryElements = categories.map((category, index) => {
    return <FormCustomDescriptionRow form={form} categories={field} category={category} index={index} key={category.key} />;
  });
  console.log(form.value);

  return (
    <div className={cssForm.wrapper}>
      <span className={cssForm.label}>カスタム概要カテゴリ</span>
      <div className={css.container}>
        <button
          {...form.insert.getButtonProps({
            name: field.name,
          })}
          className={css.add_button}
        >
          カテゴリ追加
        </button>
        <ul className={css.list}>{categoryElements}</ul>
      </div>
    </div>
  );
}
