import { vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const label = style({
  display: "block",
  marginTop: "16px",
  color: vars.color.primary3,
  fontWeight: "bold",
  fontSize: "16px",
});

export const input_text = style({
  appearance: "none",
  outline: "none",
  display: "block",
  width: "100%",
  height: "28px",
  padding: "4px",
  border: "1px solid",
  borderColor: vars.color.borderDarkGray,
  borderRadius: "4px",
  fontSize: "16px",

  ":focus": {
    borderColor: vars.color.primary3,
    boxShadow: "rgba(213, 217, 217, 0.5) 0 2px 5px 0",
  },
});

export const input_textarea = style({
  appearance: "none",
  outline: "none",
  display: "block",
  width: "100%",
  height: "64px",
  padding: "4px",
  border: "1px solid",
  borderColor: vars.color.borderDarkGray,
  borderRadius: "4px",
  resize: "vertical",
  fontSize: "16px",

  ":focus": {
    borderColor: vars.color.primary3,
    boxShadow: "rgba(213, 217, 217, 0.5) 0 2px 5px 0",
  },
});
