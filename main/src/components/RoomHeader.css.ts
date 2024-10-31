import { style } from "@vanilla-extract/css";
import { materials, vars } from "@/theme.css";

export const room_header = style({
  display: "flex",
  justifyContent: "center",
  position: "relative",
  width: "100%",
  height: vars.size.headerHeight,
  backgroundColor: vars.color.primary1,
});

export const logo = style([
  materials.font.oswaldBold,
  {
    position: "absolute",
    left: "20px",
    color: vars.color.textWhite,
    lineHeight: vars.size.headerHeight,
    fontSize: "25px",
    cursor: "pointer",
  },
]);

export const room_name = style([
  materials.font.oswaldBold,
  {
    color: vars.color.textWhite,
    lineHeight: vars.size.headerHeight,
    fontSize: "25px",
    cursor: "pointer",
  },
]);
