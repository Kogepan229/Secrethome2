import { createGlobalTheme, style } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    primary1: "#0192a8",
    primary2: "#4dbdce",
    primary3: "#1ca1b6",
    textWhite: "#f0f0f0",
    textMutedGray: "#656d76",
    borderGray: "#e3e3e3",
    borderDarkGray: "#d0d0d0",
    hoverGray: "ebebeb",
  },
  size: {
    headerHeight: "40px",
  },
});

export const materials = {
  font: {
    oswaldBold: style({
      fontFamily: "'Oswald', 'Oswald Fallback'",
      fontWeight: 700,
      fontStyle: "normal",
    }),
  },
};
