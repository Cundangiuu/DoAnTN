import { SessionContext } from "@/contexts";
import { useMeaningfulContext } from "@/hooks";
import { ApiResponse } from "@/types";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

type Props<T, P extends unknown[]> = {
  id: number | string;
  action: (...params: P) => Promise<ApiResponse<T>>;
  objectName: string;
  afterDelete: () => void;
  isIconOnly?: boolean;
  disable?: boolean;
  overrideDisableForTeacher?: boolean; // Thêm prop mới
};

const DeleteActionButton = <T, P extends unknown[]>({
  id,
  action,
  objectName,
  afterDelete,
  isIconOnly,
  disable,
  overrideDisableForTeacher = false, // Giá trị mặc định là false
}: Props<T, P>) => {
  const { isTeacher } = useMeaningfulContext(SessionContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [disabled, setDisabled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    setDisabled(true);
    setIsDeleting(true);
    const response = await action(...([id] as P));

    setDisabled(false);
    setIsDeleting(false);
    if (response.status !== 200) {
      toast.error(`Failed to delete ${objectName}`);
      return;
    }

    toast.success(
      `${objectName.charAt(0).toUpperCase() + objectName.slice(1)} deleted`
    );
    onOpenChange();
    afterDelete();
  };

  return (
    <>
      <Button
        type="button"
        color="danger"
        startContent={<MdDelete />}
        onPress={onOpen}
        isDisabled={
          disabled || (!overrideDisableForTeacher && isTeacher) || disable
        }
        isIconOnly={isIconOnly}
      >
        {!isIconOnly && "Delete"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Delete {objectName}</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this {objectName}?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onDelete}
              isDisabled={disabled}
              isLoading={isDeleting}
            >
              Delete
            </Button>
            <Button color="primary" onPress={onOpenChange}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteActionButton;
