import { ModalContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ApiResponse } from "@/types";

type Props<T, P extends unknown[]> = {
  params: P; 
  action: (...params: P) => Promise<ApiResponse<T>>; 
  objectName: string;
};

const ModalContent = <T, P extends unknown[]>({
  props,
}: Readonly<{ props: Props<T, P> }>) => {
  const { hideModal } = useMeaningfulContext(ModalContext);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    setDisabled(true);
    const response = await props.action(...props.params);

    setDisabled(false);
    if (response.status !== 200) {
      toast.error(`Failed to delete ${props.objectName}`);
      return;
    }

    toast.success(
      `${props.objectName.charAt(0).toUpperCase() + props.objectName.slice(1)} deleted`
    );
    router.refresh();
    hideModal();
  };

  return (
    <div className="w-full flex flex-col text-xl font-bold pt-8">
      <p>{`Are you sure you want to delete this ${props.objectName}?`}</p>
      <div className="flex w-full justify-center gap-4 mt-10">
        <button
          disabled={disabled}
          onClick={onDelete}
          className="w-fit px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold disabled:opacity-50 rounded-md"
        >
          YES
        </button>
        <button
          className="w-fit px-6 py-2 bg-gray-600 hover:bg-gray-500 font-bold text-white rounded-md"
          onClick={hideModal}
        >
          NO
        </button>
      </div>
    </div>
  );
};

export default ModalContent;
