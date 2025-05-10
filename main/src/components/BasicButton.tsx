import type { ButtonHTMLAttributes, ReactNode } from "react";
import { type VariantProps, tv } from "tailwind-variants";

export const buttonStyle = tv({
  base: "h-9 px-1.5 py-1 rounded-lg shadow cursor-pointer text-base",
  variants: {
    color: {
      white:
        "bg-white border border-border-primary text-black hover:bg-hover-gray active:bg-active-gray disabled:text-disabled-gray disabled:border-border-dark-gray disabled:bg-hover-gray",
      whiteRed:
        "bg-white border border-red-400 text-black hover:bg-hover-gray active:bg-active-gray disabled:text-disabled-gray disabled:border-border-dark-gray disabled:bg-hover-gray",
      primary: "bg-primary text-white-primary hover:bg-hover-primary",
      lightPrimary: "bg-light-primary text-white-primary hover:bg-hover-primary",
    },
  },
  defaultVariants: {
    color: "white",
  },
});

type ButtonType = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyle> & {
    children: ReactNode;
  };

export function BasicButton({ children, className, type = "button", ...props }: ButtonType) {
  return (
    <button {...props} type={type} className={buttonStyle({ class: className, ...props })}>
      {children}
    </button>
  );
}
