import { materials, vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  padding: "4px",
  border: "1px solid",
  borderColor: vars.color.borderDarkGray,
  borderRadius: "4px",
});

export const add_button = style([
  materials.button.WhitePrimary,
  {
    height: "28px",
    lineHeight: "16px",
    margin: "4px 0",
    boxShadow: "none",
  },
]);

export const list = style({
  listStyle: "none",
});

export const list_item = style({
  width: "100%",
  display: "flex",
  margin: "4px 0",
});

export const button = style({
  width: "28px",
  height: "28px",
  paddingTop: "2px",
  backgroundColor: "white",
  border: "1px solid",
  borderColor: vars.color.primary3,
  borderRadius: "4px",

  ":hover": {
    backgroundColor: vars.color.hoverGray,
  },
});

export const button_container = style({
  display: "flex",
  gap: "4px",
  marginLeft: "4px",
});
