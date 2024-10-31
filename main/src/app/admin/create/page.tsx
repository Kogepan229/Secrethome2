import { createRoomAction } from "@/features/admin/actions";
import * as css from "./page.css";
import { FormText } from "@/components/form/Text";
import { materials } from "@/theme.css";
import { FormTextArea } from "@/components/form/TextArea";

export default function AdminPage() {
  return (
    <main>
      <form action={createRoomAction} className={materials.form}>
        <FormText title="ID" name="id" />
        <FormText title="名前" name="name" />
        <FormTextArea title="概要" name="description" />
      </form>
    </main>
  );
}
