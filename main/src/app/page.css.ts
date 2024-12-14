import { materials, vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const header = style({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  height: vars.size.headerHeight,
  backgroundColor: vars.color.primary1,
});

export const header_logo = style([
  materials.font.oswaldBold,
  {
    color: vars.color.textWhite,
    lineHeight: vars.size.headerHeight,
    fontSize: "25px",
    cursor: "pointer",
  },
]);

export const main = style({
  width: "60%",
  margin: "auto",
  marginTop: "48px",
});

export const submit_button = style([materials.button.WhitePrimary, { marginTop: "32px", width: "100%" }]);
