"use client";

export function ErrorMessage({ message }: { message: string | string[] | undefined }) {
  if (message === undefined) {
    return null;
  }
  if (typeof message === "string") {
    return <p className="px-1 text-error text-sm font-medium">{message}</p>;
  }
  return message.map((msg) => {
    return (
      <p key={msg} className="px-1 text-error text-sm font-medium">
        {msg}
      </p>
    );
  });
}
