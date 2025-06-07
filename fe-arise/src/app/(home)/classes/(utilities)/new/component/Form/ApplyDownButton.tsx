import { Button } from "@nextui-org/react";
import { FaArrowDown } from "react-icons/fa6";

type Props = {
  onApplyDownward?: () => void;
};

export default function ApplyDownButton(props: Readonly<Props>) {
  return (
    <div className="flex justify-center w-full">
      <Button
        onPress={props.onApplyDownward}
        size="sm"
        color="primary"
        className="flex items-center w-full justify-center gap-2"
      >
        <span>Apply downward</span>
        <FaArrowDown />
      </Button>
    </div>
  );
}
