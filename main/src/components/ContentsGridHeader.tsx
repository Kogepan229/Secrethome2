import * as css from "./ContentsGridHeader.css";

export const ContentsGridHeader = ({ title }: { title: string }) => {
  return <h1 className={css.header}>{title}</h1>;
};
