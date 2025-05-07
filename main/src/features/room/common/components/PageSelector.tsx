import { BasicButton } from "@/components/BasicButton";
import Link from "next/link";
import { CONTENTS_NUM_PER_PAGE, getAvailableContentsCount } from "../utils/contents";

export async function PageSelector({
  roomId,
  baseURL,
  currentPageIndex,
}: {
  roomId: string;
  baseURL: string;
  currentPageIndex: number;
}) {
  const count = await getAvailableContentsCount(roomId);
  const totalPageNum = count === 0 ? 1 : Math.ceil(count / CONTENTS_NUM_PER_PAGE);

  let pageNums = [];
  if (totalPageNum <= 5) {
    for (let i = 1; i <= totalPageNum; i++) {
      pageNums.push(i);
    }
  } else if (currentPageIndex <= 2) {
    pageNums = [1, 2, 3, totalPageNum - 1, totalPageNum];
  } else if (currentPageIndex >= totalPageNum - 1) {
    pageNums = [1, 2, totalPageNum - 2, totalPageNum - 1, totalPageNum];
  } else {
    pageNums = [1, currentPageIndex - 1, currentPageIndex, currentPageIndex + 1, totalPageNum];
  }

  const buttons = pageNums.map((num) => {
    let url = baseURL;
    if (num !== 1) {
      const params = new URLSearchParams();
      params.set("page", num.toString());
      if (url.includes("?")) {
        url = `${url}&${params.toString()}`;
      } else {
        url = `${url}?${params.toString()}`;
      }
    }

    return (
      <Link href={url} key={num}>
        <BasicButton className="w-12 h-11" color={currentPageIndex === num ? "primary" : "lightPrimary"}>
          {num}
        </BasicButton>
      </Link>
    );
  });

  if (buttons.length === 0) {
    return null;
  }

  return <div className="flex w-full justify-center gap-1">{buttons}</div>;
}
