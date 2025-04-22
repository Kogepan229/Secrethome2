import { input_text } from "@/components/form/form.css";
import { materials, vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const form = style({
  display: "flex",
  gap: 8,
});

export const input_wrapper = style({
  flexGrow: 1,
});

export const label = style({
  display: "block",
});

export const input = style([input_text, { height: 24 }]);

export const button_wrapper = style({
  position: "relative",
  width: "60px",
});

export const submit_button = style([
  materials.button.WhitePrimary,
  {
    position: "absolute",
    bottom: 0,
    width: "60px",
    height: 32,
    padding: 2,
  },
]);
