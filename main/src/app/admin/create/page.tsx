"use client";
import { RoomForm } from "@/features/admin/components/RoomForm";

export default function CreateRoomPage() {
  return (
    <main>
      <RoomForm backText="戻る" backUrl="/admin" submitText="作成" successMessage="作成しました" />
    </main>
  );
}
