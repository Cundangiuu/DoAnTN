"use client";

import { HeaderContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useIntersectionObserver, useWindowSize } from "usehooks-ts";

type Props = {
  children?: React.ReactNode;
  title?: React.ReactNode;
  backUrl?: string;
  isEdit?: boolean
};

const HeaderContent = function HeaderContent({
  children,
  title,
  backUrl,
}: Readonly<Props>) {
  const { width } = useWindowSize();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex-grow">
      <div className="w-full flex justify-between flex-col md:flex-row md:items-center gap-12">
        <div className="flex items-center gap-3 flex-grow">
          {backUrl && (
            <Link className="opacity-50 flex hover:opacity-70" href={backUrl}>
              <IoIosArrowBack size={30} />
            </Link>
          )}
          <button
            onClick={() => width < 1280 && setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-slate-300 md:hover:bg-transparent"
          >
            <div className="text-xl font-bold flex gap-3">{title}</div>
          </button>
        </div>
        <div
          className={`${
            showMenu ? "max-h-[500px] pb-2" : "max-h-0 pb-0 xl:max-h-fit"
          } overflow-hidden absolute top-full left-0 w-full md:w-fit md:static flex justify-end gap-3 bg-white xl:pb-0 px-8 shadow-md xl:shadow-none`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default function ContentHeader({
  children,
  title,
  backUrl,
}: Readonly<Props>) {
  const { ref: containerRef } = useIntersectionObserver({
    threshold: 0.5,
    root: null,
    initialIsIntersecting: false,
    onChange(isIntersecting) {
      setShowContent(!isIntersecting);
    },
  });

  const { setContentHeader, setShowContent } =
    useMeaningfulContext(HeaderContext);

  useEffect(() => {
    setContentHeader(
      <HeaderContent title={title} backUrl={backUrl}>
        {children}
      </HeaderContent>
    );

    return () => {
      setContentHeader(undefined);
      setShowContent(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, backUrl]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="w-full flex justify-between flex-col md:flex-row md:items-center gap-12">
        <div className="flex items-center gap-3 flex-grow">
          {backUrl && (
            <Link className="opacity-50 flex hover:opacity-70" href={backUrl}>
              <IoIosArrowBack size={30} />
            </Link>
          )}
          <div className="text-3xl font-bold div flex gap-2">{title}</div>
        </div>
        <div className="flex justify-end gap-3">{children}</div>
      </div>
    </div>
  );
}
