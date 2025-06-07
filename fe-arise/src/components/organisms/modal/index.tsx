"use client";

import { ModalContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import { useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useOnClickOutside } from "usehooks-ts";

export default function Modal() {
  const { modalContent, hideModal } = useMeaningfulContext(ModalContext);
  const modalRef = useRef(null);

  useOnClickOutside(modalRef, hideModal);

  return (
    <div
      className={`${
        modalContent ? "fixed" : "hidden"
      } inset-0 z-[99999] flex justify-center items-center w-full h-full bg-[#e2e8f0bb]`}
    >
      <div
        ref={modalRef}
        className="p-6 no-scrollbar bg-white max-h-[600px] overflow-y-auto overflow-x-hidden rounded-md shadow-lg max-w-5xl relative w-full flex flex-col"
      >
        <button
          title="close"
          onClick={hideModal}
          className="w-8 aspect-square sticky top-0 left-full rounded-md hover:bg-red-600 bg-red-400 flex justify-center items-center text-white"
        >
          <IoCloseSharp size={30} />
        </button>

        {modalContent}
      </div>
    </div>
  );
}
