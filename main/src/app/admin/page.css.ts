import { materials } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const main = style({
  width: "60%",
  margin: "auto",
});

export const create_button = style([
  materials.button.WhitePrimary,
  {
    width: "fit-content",
  },
]);
