import { vars } from "@/theme.css";
import { style } from "@vanilla-extract/css";

export const container = style({
  marginBottom: 48,
  border: "1px solid",
  borderRadius: "4px",
  borderColor: vars.color.borderGray,
});

export const panel_wrapper = style({
  selectors: {
    "div+&": {
      borderTop: "1px solid",
      borderColor: vars.color.borderGray,
    },
  },
});

export const panel = style({
  padding: 16,
});

export const info_grid = style({
  display: "grid",
  columnGap: "0.5rem",
  gridTemplateColumns: "auto 1fr",
  marginTop: 8,
  wordBreak: "break-all",
  wordWrap: "break-word",

  "@media": {
    "(max-width: 639px)": {
      gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    },
  },
});

export const info_name = style({
  fontWeight: "bold",
});

export const info_title = style({
  fontWeight: "bold",
});
