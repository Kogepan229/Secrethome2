import { type FieldMetadata, type FormMetadata, getInputProps } from "@conform-to/react";
import { createId } from "@paralleldrive/cuid2";
import { useMemo } from "react";
import ArrowDownIcon from "@/assets/button/arrow_down.svg";
import ArrowUpIcon from "@/assets/button/arrow_up.svg";
import TrashIcon from "@/assets/button/trash.svg";
import { BasicButton } from "@/components/BasicButton";
import { formStyles } from "@/components/form/formStyles";
import type { CreateRoomSchema, UpdateRoomSchema } from "../schema";
import type { CustomDescriptionCategory } from "../types";

function FormCustomDescriptionRow<Schema extends CreateRoomSchema | UpdateRoomSchema>({
  form,
  categories,
  category,
  index,
}: {
  form: FormMetadata<Schema, string[]>;
  categories: FieldMetadata<CustomDescriptionCategory[] | null | undefined, Schema, string[]>;
  category: FieldMetadata<CustomDescriptionCategory, Schema, string[]>;
  index: number;
}) {
  const categoryFields = category.getFieldset();
  const id = useMemo(() => createId(), []);

  return (
    <li key={category.key} className="flex w-full my-1">
      <input type="hidden" name={categoryFields.id.name} value={id} key={categoryFields.id.key} />
      <input
        {...getInputProps(categoryFields.label, { type: "text" })}
        key={categoryFields.label.key}
        className="w-full h-7 p-1 outline-none border border-border-dark-gray rounded-sm text-base focus:border-border-primary focus:shadow-sm"
      />
      <div className="flex gap-1 ml-1">
        <BasicButton
          {...form.reorder.getButtonProps({
            name: categories.name,
            from: index,
            to: index - 1,
          })}
          type="submit"
          className="w-7 h-7 rounded-sm p-[5px]"
        >
          <ArrowUpIcon width={16} height={16} />
        </BasicButton>
        <BasicButton
          {...form.reorder.getButtonProps({
            name: categories.name,
            from: index,
            to: index + 1,
          })}
          type="submit"
          className="w-7 h-7 rounded-sm p-[5px]"
        >
          <ArrowDownIcon width={16} height={16} />
        </BasicButton>
        <BasicButton
          {...form.remove.getButtonProps({
            name: categories.name,
            index,
          })}
          type="submit"
          className="w-7 h-7 rounded-sm p-[5px]"
        >
          <TrashIcon width={16} height={16} />
        </BasicButton>
      </div>
    </li>
  );
}

export function FormCustomDescriptions<Schema extends CreateRoomSchema | UpdateRoomSchema>({
  form,
  field,
}: {
  form: FormMetadata<Schema, string[]>;
  field: FieldMetadata<CustomDescriptionCategory[] | null | undefined, Schema, string[]>;
}) {
  const categories = field.getFieldList();
  const categoryElements = categories.map((category, index) => {
    return <FormCustomDescriptionRow form={form} categories={field} category={category} index={index} key={category.key} />;
  });

  return (
    <div className={formStyles.wrapper()}>
      <span className={formStyles.label()}>カスタム概要カテゴリ</span>
      <div className="p-1 border border-border-dark-gray rounded-sm">
        <BasicButton
          {...form.insert.getButtonProps({
            name: field.name,
          })}
          type="submit"
          className="h-8 leading-4 my-1"
        >
          カテゴリ追加
        </BasicButton>
        <ul className="">{categoryElements}</ul>
      </div>
    </div>
  );
}
