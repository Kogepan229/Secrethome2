import { style } from "@vanilla-extract/css";
import { vars } from "@/theme.css";

export const input_video = style({
  appearance: "none",
  outline: "none",
  display: "block",
  width: "100%",
  fontSize: "16px",
});

export const video = style({
  marginTop: 4,
  width: "100%",
});

export const input_thumbnail = style({
  appearance: "none",
  outline: "none",
  display: "block",
  width: "100%",
  fontSize: "16px",
});

export const thumbnail = style({
  marginTop: 4,
  width: "100%",
});

export const empty_thumbnail_area = style({
  display: "flex",
  alignItems: "center",
  width: "100%",
  marginTop: 4,
  aspectRatio: "16 / 9",
  border: "2px solid",
  borderColor: vars.color.borderGray,
  borderRadius: 8,
  justifyContent: "center",
  color: vars.color.textBlack,

  ":active": {
    backgroundColor: vars.color.hoverGray,
  },
});
