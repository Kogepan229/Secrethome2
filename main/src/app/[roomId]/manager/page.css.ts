import { vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const main = style({
  maxWidth: "500px",
  margin: "auto",
  marginTop: "48px",
  marginBottom: "48px",
  paddingLeft: "20px",
  paddingRight: "20px",
});

export const link_item_container = style({
  border: "solid 1px",
  borderColor: vars.color.borderGray,
});

export const link_item_wrapper = style({
  selectors: {
    "div+&": {
      borderTop: "1px solid",
      borderColor: vars.color.borderGray,
    },
  },
});

export const link_item = style({
  width: "100%",
  paddingLeft: 20,
  height: 48,
  borderTop: 0,
  boxSizing: "border-box",
  lineHeight: "48px",
});
