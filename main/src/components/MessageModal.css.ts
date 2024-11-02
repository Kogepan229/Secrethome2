import { materials, vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const dialog = style({
  width: "600px",
  height: "300px",
  margin: "auto",
  border: "none",
  borderRadius: "4px",

  "::backdrop": {
    background: "rgba(0, 0, 0, 0.6)",
  },
});

export const message_container = style({
  display: "flex",
  height: "200px",
});

export const message = style({
  margin: "auto",
  fontSize: "25px",
  fontWeight: "bold",
  color: vars.color.textBlack,
});

export const button_wrapper = style({
  width: "fit-content",
  margin: "auto",
});

export const button = style([
  materials.button.WhitePrimary,
  {
    minWidth: "64px",
    margin: "auto",
  },
]);
