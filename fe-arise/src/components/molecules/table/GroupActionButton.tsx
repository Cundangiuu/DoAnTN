import { SessionContext } from "@/contexts/SessionContext";
import { useMeaningfulContext } from "@/hooks";
import { Button, ButtonGroup } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaEye, FaPen } from "react-icons/fa";

const GroupActionButton = ({ detailId }: { detailId: string | number }) => {
  const pathname = usePathname();
  const { isTeacher } = useMeaningfulContext(SessionContext);
  return (
    <div className="w-full relative flex justify-center">
      <ButtonGroup>
        <Button as={Link} isIconOnly href={`${pathname}/${detailId}`}>
          <FaEye />
        </Button>

        <Button
          as={Link}
          disabled={isTeacher}
          isIconOnly
          href={`${pathname}/${detailId}/edit`}
        >
          <FaPen />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default GroupActionButton;
