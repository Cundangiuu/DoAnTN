import { CriteriaRequestDTO } from "@/dtos/grade/CriteriaRequestDTO";
import {
  GradeRequestDTO,
  GradeUpdateRequestDTO,
} from "@/dtos/grade/GradeRequestDTO";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { SetStateAction, useState } from "react";
import { FaCommentAlt } from "react-icons/fa";

const Criteria = ({
  data,
  setData,
}: {
  data: GradeUpdateRequestDTO | GradeRequestDTO;
  setData: React.Dispatch<
    SetStateAction<GradeUpdateRequestDTO | GradeRequestDTO>
  >;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [criteria, setCriteria] = useState<CriteriaRequestDTO>(
    data?.criteria || {
      attitude: "",
      homeworkCompletion: "",
      listening: "",
      speaking: "",
      reading: "",
      writing: "",
      vocabulary: "",
      grammar: "",
      progress: "",
    }
  );

  const MAX_COMMENT_LENGTH = 500;
  const [commentLength, setCommentLength] = useState(
    data?.comment?.length || 0
  );

  const onUpdate = () => {
    setData((prev) => ({
      ...prev,
      criteria,
    }));
    onClose();
  };

  const handlePresetSelect = (selectedText: string) => {
    const newComment = data.comment
      ? `${data.comment} ${selectedText}`
      : selectedText;

    if (newComment.length <= MAX_COMMENT_LENGTH) {
      setData((prev) => ({
        ...prev,
        comment: newComment,
      }));
      setCommentLength(newComment.length);
    }
  };

  const handleCommentChange = (value: string) => {
    if (value.length <= MAX_COMMENT_LENGTH) {
      setData((prev) => ({
        ...prev,
        comment: value,
      }));
      setCommentLength(value.length);
    }
  };

  return (
    <>
      <Button isIconOnly onPress={onOpen}>
        <FaCommentAlt />
      </Button>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chỉnh sửa tiêu chí
              </ModalHeader>
              <ModalBody className="max-h-[80vh] overflow-y-scroll">
                <h1 className="font-bold">Thái độ học tập</h1>
                <Select
                  label="Thái độ học tập trên lớp"
                  labelPlacement="outside"
                  selectedKeys={[criteria.attitude]}
                  onSelectionChange={(keys) =>
                    setCriteria((prev) => ({
                      ...prev,
                      attitude: Array.from(keys)[0] as string,
                    }))
                  }
                >
                  <SelectItem key="Tích cực tham gia các hoạt động trên lớp">
                    Tích cực tham gia các hoạt động trên lớp
                  </SelectItem>
                  <SelectItem key="Bình thường cần sôi nổi hơn">
                    Bình thường cần sôi nổi hơn
                  </SelectItem>
                  <SelectItem key="Hiếm khi phát biểu hoặc tham gia vào hoạt động. Cần tích cực hơn">
                    Hiếm khi phát biểu hoặc tham gia vào hoạt động. Cần tích cực
                    hơn
                  </SelectItem>
                  <SelectItem key="Dễ mất tập trung">
                    Dễ mất tập trung
                  </SelectItem>
                  <SelectItem key="Còn gây mất trật tự làm ảnh hưởng đến giờ học">
                    Còn gây mất trật tự làm ảnh hưởng đến giờ học
                  </SelectItem>
                </Select>
                <Select
                  label="Chuyên cần làm bài tập về nhà"
                  labelPlacement="outside"
                  selectedKeys={
                    criteria.homeworkCompletion
                      ? [criteria.homeworkCompletion]
                      : []
                  }
                  onSelectionChange={(keys) =>
                    setCriteria((prev) => ({
                      ...prev,
                      homeworkCompletion: Array.from(keys)[0]?.toString() || "",
                    }))
                  }
                >
                  <SelectItem key="Thường xuyên hoàn thành đầy đủ với chất lượng tốt">
                    Thường xuyên hoàn thành đầy đủ với chất lượng tốt
                  </SelectItem>
                  <SelectItem key="Hoàn thành đầy đủ nhưng chất lượng chưa tốt. Cần làm bài cẩn thận hơn">
                    Hoàn thành đầy đủ nhưng chất lượng chưa tốt. Cần làm bài cẩn
                    thận hơn
                  </SelectItem>
                  <SelectItem key="Chưa hoàn thành đầy đủ. Cần chăm chỉ làm bài hơn">
                    Chưa hoàn thành đầy đủ. Cần chăm chỉ làm bài hơn
                  </SelectItem>
                  <SelectItem key="Thường xuyên không làm bài tập được giao. Cần chăm chỉ làm bài hơn">
                    Thường xuyên không làm bài tập đưuocj giao. Cần chăm chỉ làm
                    bài hơn
                  </SelectItem>
                </Select>

                <h1 className="font-bold">Kỹ năng thực hành ngôn ngữ</h1>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Kỹ năng nghe", key: "listening" },
                    { label: "Kỹ năng nói", key: "speaking" },
                    { label: "Kỹ năng đọc", key: "reading" },
                    { label: "Kỹ năng viết", key: "writing" },
                    { label: "Từ vựng", key: "vocabulary" },
                    { label: "Ngữ pháp", key: "grammar" },
                  ].map(({ label, key }) => (
                    <Select
                      key={key}
                      label={label}
                      labelPlacement="outside"
                      selectedKeys={[criteria[key as keyof CriteriaRequestDTO]]}
                      onSelectionChange={(keys) =>
                        setCriteria((prev) => ({
                          ...prev,
                          [key]: Array.from(keys)[0] as string,
                        }))
                      }
                    >
                      <SelectItem key="Giỏi">Giỏi</SelectItem>
                      <SelectItem key="Khá có thể tốt hơn">
                        Khá có thể tốt hơn
                      </SelectItem>
                      <SelectItem key="Cần cố gắng hơn">
                        Cần cố gắng hơn
                      </SelectItem>
                    </Select>
                  ))}

                  <Select
                    label="Tiến bộ trong học kỳ"
                    labelPlacement="outside"
                    selectedKeys={criteria.progress ? [criteria.progress] : []}
                    onSelectionChange={(keys) =>
                      setCriteria((prev) => ({
                        ...prev,
                        progress: Array.from(keys)[0]?.toString() || "",
                      }))
                    }
                  >
                    <SelectItem key="Có tiến bộ trong kỳ">
                      Có tiến bộ trong kỳ
                    </SelectItem>
                    <SelectItem key="Chưa tiến bộ trong kỳ">
                      Chưa tiến bộ trong kỳ
                    </SelectItem>
                  </Select>
                </div>

                <div className="space-y-4 mt-4">
                  <h1 className="font-bold">Preset Comments</h1>
                  <div className="flex flex-col gap-4">
                    <Select
                      label="Thái độ và thói quen học tập"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="Hạn chế phát biểu các nội dung không liên quan đến bài học.">
                        Hạn chế phát biểu các nội dung không liên quan đến bài
                        học.
                      </SelectItem>
                      <SelectItem key="Nên tập trung chú ý trong giờ học.">
                        Nên tập trung chú ý trong giờ học.
                      </SelectItem>
                      <SelectItem key="Nhớ mang đầy đủ các dụng cụ học tập.">
                        Nhớ mang đầy đủ các dụng cụ học tập.
                      </SelectItem>
                      <SelectItem key="Cần tham gia lớp học đúng giờ.">
                        Cần tham gia lớp học đúng giờ.
                      </SelectItem>
                      <SelectItem key="Hạn chế sử dụng tiếng Việt trong giờ học.">
                        Hạn chế sử dụng tiếng Việt trong giờ học.
                      </SelectItem>
                      <SelectItem key="Bạn nên tích cực phát biểu nhiều hơn.">
                        Bạn nên tích cực phát biểu nhiều hơn.
                      </SelectItem>
                      <SelectItem key="Bạn khá nhút nhát, nên tập tính mạnh dạn đặt câu hỏi và phát biểu ý kiến.">
                        Bạn khá nhút nhát, nên tập tính mạnh dạn đặt câu hỏi và
                        phát biểu ý kiến.
                      </SelectItem>
                      <SelectItem key="Bạn dễ mất tập trung và hay quên từ vựng.">
                        Bạn dễ mất tập trung và hay quên từ vựng.
                      </SelectItem>
                      <SelectItem key="Bạn còn hạn chế về việc ghi nhớ từ vựng và ngữ pháp do thiếu ghi chép, ôn tập cẩn thận.">
                        Bạn còn hạn chế về việc ghi nhớ từ vựng và ngữ pháp do
                        thiếu ghi chép, ôn tập cẩn thận.
                      </SelectItem>
                    </Select>

                    <Select
                      label="Kỹ năng và phương pháp học"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="Bạn nên luyện tập các dạng đề thi Cambridge ở cấp độ đang học và tìm tòi, mở rộng kiến thức qua sách, báo và internet.">
                        Bạn nên luyện tập các dạng đề thi Cambridge ở cấp độ
                        đang học và tìm tòi, mở rộng kiến thức qua sách, báo và
                        internet.
                      </SelectItem>
                      <SelectItem key="Bạn phản ứng không nhanh trong giao tiếp, cần tập nghe nhiều các đoạn hội thoại và luyện tập ở nhà.">
                        Bạn phản ứng không nhanh trong giao tiếp, cần tập nghe
                        nhiều các đoạn hội thoại và luyện tập ở nhà.
                      </SelectItem>
                      <SelectItem key="Bạn hay mắc lỗi khi làm bài tập, cần ghi chú cẩn thận và thường xuyên xem lại bài để tránh lặp lại các lỗi này.">
                        Bạn hay mắc lỗi khi làm bài tập, cần ghi chú cẩn thận và
                        thường xuyên xem lại bài để tránh lặp lại các lỗi này.
                      </SelectItem>
                      <SelectItem key="Bạn nên nghe nhiều hơn ở nhà và cố gắng ghi nhớ nhiều cụm từ và ý nghĩa của chúng.">
                        Bạn nên nghe nhiều hơn ở nhà và cố gắng ghi nhớ nhiều
                        cụm từ và ý nghĩa của chúng.
                      </SelectItem>
                      <SelectItem key="Bạn cần ôn tập thường xuyên và luyện tập vận dụng các cấu trúc ngữ pháp, từ vựng đã học và mở rộng vốn từ.">
                        Bạn cần ôn tập thường xuyên và luyện tập vận dụng các
                        cấu trúc ngữ pháp, từ vựng đã học và mở rộng vốn từ.
                      </SelectItem>
                      <SelectItem key="Bạn cần thường xuyên ôn tập từ vựng đã học, luyện đọc to và luyện viết lại nhiều lần để ghi nhớ tốt hơn.">
                        Bạn cần thường xuyên ôn tập từ vựng đã học, luyện đọc to
                        và luyện viết lại nhiều lần để ghi nhớ tốt hơn.
                      </SelectItem>
                      <SelectItem key="Thường xuyên luyện nghe và đọc lại các bài đã học trong sách, khuyến khích nghe và luyện đọc theo giọng bản ngữ thường xuyên để cải thiện phát âm.">
                        Thường xuyên luyện nghe và đọc lại các bài đã học trong
                        sách, khuyến khích nghe và luyện đọc theo giọng bản ngữ
                        thường xuyên để cải thiện phát âm.
                      </SelectItem>
                      <SelectItem key="Nên rèn luyện thói quen nghe và đọc tiếng Anh hàng ngày, làm quen và tiếp xúc với nhiều nguồn kiến thức để hành trình học tập sắp tới được thuận lợi hơn.">
                        Nên rèn luyện thói quen nghe và đọc tiếng Anh hàng ngày,
                        làm quen và tiếp xúc với nhiều nguồn kiến thức để hành
                        trình học tập sắp tới được thuận lợi hơn.
                      </SelectItem>
                    </Select>

                    <Select
                      label="Đánh giá chung"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="Bạn nhạy bén và thái độ học tập tích cực, nên tiếp tục phát huy.">
                        Bạn nhạy bén và thái độ học tập tích cực, nên tiếp tục
                        phát huy.
                      </SelectItem>
                      <SelectItem key="Kỹ năng thực hành ngôn ngữ của bạn có cải thiện.">
                        Kỹ năng thực hành ngôn ngữ của bạn có cải thiện.
                      </SelectItem>
                      <SelectItem key="Kỹ năng thực hành ngôn ngữ của bạn chưa có nhiều cải thiện. Bạn cần học nghiêm túc hơn và đầu tư thời gian tự học ở nhà hơn.">
                        Kỹ năng thực hành ngôn ngữ của bạn chưa có nhiều cải
                        thiện. Bạn cần học nghiêm túc hơn và đầu tư thời gian tự
                        học ở nhà hơn.
                      </SelectItem>
                      <SelectItem key="Kỹ năng thực hành ngôn ngữ của bạn có cải thiện.Tuy nhiên cần luyện tập kỹ năng nghe - nói nhiều hơn.">
                        Kỹ năng thực hành ngôn ngữ của bạn có cải thiện.Tuy
                        nhiên cần luyện tập kỹ năng nghe - nói nhiều hơn.
                      </SelectItem>
                      <SelectItem key="Bạn chăm ngoan, các kỹ năng khá tốt. Cần phát huy nhé!">
                        Bạn chăm ngoan, các kỹ năng khá tốt. Cần phát huy nhé!
                      </SelectItem>
                      <SelectItem key="Bạn có cố gắng nhưng các kỹ năng thực hành ngôn ngữ của bạn chưa có nhiều cải thiện. Bạn cần cố gắng luyện tập các kỹ năng nhiều hơn nữa nhé!">
                        Bạn có cố gắng nhưng các kỹ năng thực hành ngôn ngữ của
                        bạn chưa có nhiều cải thiện. Bạn cần cố gắng luyện tập
                        các kỹ năng nhiều hơn nữa nhé!
                      </SelectItem>
                      <SelectItem key="Bạn chưa có nhiều cố gắng trong học tập. Bạn cần học nghiêm túc hơn và đầu tư thời gian tự học ở nhà hơn. Bạn cần cố gắng nhiều hơn nữa nhé!">
                        Bạn chưa có nhiều cố gắng trong học tập. Bạn cần học
                        nghiêm túc hơn và đầu tư thời gian tự học ở nhà hơn. Bạn
                        cần cố gắng nhiều hơn nữa nhé!
                      </SelectItem>
                    </Select>

                    <Select
                      label="Khuyến nghị cụ thể"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="Bạn nên tập tính cẩn thận khi làm bài và kiểm tra kỹ lưỡng sau khi hoàn thành.">
                        Bạn nên tập tính cẩn thận khi làm bài và kiểm tra kỹ
                        lưỡng sau khi hoàn thành.
                      </SelectItem>
                      <SelectItem key="Bạn nên học từ vựng cẩn thận và thường xuyên xem lại bài, đặc biệt là các câu ví dụ trong bài học về ngữ pháp.">
                        Bạn nên học từ vựng cẩn thận và thường xuyên xem lại
                        bài, đặc biệt là các câu ví dụ trong bài học về ngữ
                        pháp.
                      </SelectItem>
                      <SelectItem key="Bạn nên tra từ vựng, đặc biệt học thật nhiều cụm từ, học cách ghi chép và áp dụng những gì đã học vào thực tế.">
                        Bạn nên tra từ vựng, đặc biệt học thật nhiều cụm từ, học
                        cách ghi chép và áp dụng những gì đã học vào thực tế.
                      </SelectItem>
                      <SelectItem key="Bạn hoàn toàn có năng lực phát triển ngôn ngữ nếu chịu khó rèn luyện và đặt mục tiêu phấn đấu cao hơn.">
                        Bạn hoàn toàn có năng lực phát triển ngôn ngữ nếu chịu
                        khó rèn luyện và đặt mục tiêu phấn đấu cao hơn.
                      </SelectItem>
                      <SelectItem key="Bạn nên tập trung hơn trong giờ học và nên tích cực phát biểu nhiều hơn.">
                        Bạn nên tập trung hơn trong giờ học và nên tích cực phát
                        biểu nhiều hơn.
                      </SelectItem>
                      <SelectItem key="Bạn nên tập trung hơn trong giờ học và nên hoàn thành bài tập giáo viên giao đầy đủ trước khi vào lớp.">
                        Bạn nên tập trung hơn trong giờ học và nên hoàn thành
                        bài tập giáo viên giao đầy đủ trước khi vào lớp.
                      </SelectItem>
                    </Select>
                  </div>

                  <Button
                    size="sm"
                    color="danger"
                    onPress={() => {
                      setData((prev) => ({ ...prev, comment: "" }));
                      setCommentLength(0);
                    }}
                  >
                    Clear Comment
                  </Button>

                  <div className="flex flex-col gap-2">
                    <Textarea
                      label="Comment"
                      type="text"
                      value={data.comment || ""}
                      onValueChange={handleCommentChange}
                      placeholder="You can edit the combined comment here"
                      minRows={4}
                      maxLength={MAX_COMMENT_LENGTH}
                    />
                    <div className="text-right text-sm text-gray-500">
                      {commentLength}/{MAX_COMMENT_LENGTH} ký tự
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={onUpdate}
                  isDisabled={commentLength > MAX_COMMENT_LENGTH}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Criteria;
