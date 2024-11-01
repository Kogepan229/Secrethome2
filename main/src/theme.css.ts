import { createGlobalTheme, style } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    primary1: "#0192a8",
    primary2: "#4dbdce",
    primary3: "#1ca1b6",
    textWhite: "#f0f0f0",
    textMutedGray: "#656d76",
    borderGray: "#e3e3e3",
    borderDarkGray: "#9e9e9e",
    hoverGray: "#ebebeb",
    error: "#f54c36",
  },
  size: {
    headerHeight: "48px",
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
  button: {
    WhitePrimary: style({
      padding: "6px",
      backgroundColor: "white",
      border: "1px solid",
      borderColor: vars.color.primary3,
      borderRadius: "8px",
      color: "black",
      boxShadow: "rgba(213, 217, 217, 0.5) 0 2px 5px 0",
      cursor: "pointer",
      fontSize: "16px",

      ":hover": {
        backgroundColor: vars.color.hoverGray,
      },

      ":disabled": {
        borderColor: vars.color.borderDarkGray,
        backgroundColor: vars.color.hoverGray,
      },
    }),
    WhiteRed: style({
      padding: "6px",
      backgroundColor: "white",
      border: "1px solid",
      borderColor: vars.color.error,
      borderRadius: "8px",
      color: vars.color.error,
      boxShadow: "rgba(213, 217, 217, 0.5) 0 2px 5px 0",
      cursor: "pointer",
      fontSize: "16px",

      ":hover": {
        backgroundColor: vars.color.hoverGray,
      },
    }),
  },
};
