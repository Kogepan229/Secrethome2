import { vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

export const main = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: calc.subtract("100vh", vars.size.headerHeight),
  flexGrow: 1,
  flexBasis: 0,
  paddingTop: 48,
  paddingBottom: 48,
  paddingLeft: 20,
  paddingRight: 20,
});

export const item_container = style({
  display: "flex",
  flexGrow: 1,
  flexBasis: 0,
  overflowY: "hidden",
  gap: 20,
});

export const item_header = style({
  display: "block",
  marginBlock: 4,
  color: vars.color.primary3,
  fontWeight: "bold",
  fontSize: 18,
});

export const list_container = style({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  flexBasis: 0,
  width: "100%",
});

export const tag_group_container = style({
  width: "100%",
  border: "1px solid",
  borderRadius: "4px",
  borderColor: vars.color.borderLightGray,
  overflowY: "auto",
});

export const tag_group_item_wrapper = style({
  selectors: {
    "div+&": {
      borderTop: "1px solid",
      borderColor: vars.color.borderLightGray,
    },
  },
});

export const tag_group_item = style({
  padding: 8,

  ":hover": {
    backgroundColor: vars.color.hoverGray,
  },
});

export const tag_group_item_name = style({
  display: "block",
  fontWeight: "bold",
  color: vars.color.textBlack,
});

export const tag_group_item_desc = style({
  display: "block",
  height: 16,
  lineHeight: "16px",
  marginTop: 4,
  fontSize: 14,
  color: vars.color.textMutedGray,
});
