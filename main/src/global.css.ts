import { globalStyle } from "@vanilla-extract/css";

globalStyle("*", {
  boxSizing: "border-box",
  padding: 0,
  margin: 0,
});
globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});
globalStyle("button", {
  appearance: "none",
});
