import { vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const header = style({
  width: "100%",
  height: "40px",
  lineHeight: "40px",
  padding: "0 10px",
  backgroundColor: vars.color.primary1,
  color: vars.color.textWhite,
  fontSize: "18px",
});
