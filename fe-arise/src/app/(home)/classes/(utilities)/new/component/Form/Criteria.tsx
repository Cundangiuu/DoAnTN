"use client";

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
                Edit Criteria
              </ModalHeader>
              <ModalBody className="max-h-[80vh] overflow-y-scroll">
                <h1 className="font-bold">Learning Attitude</h1>
                <Select
                  label="Attitude in Class"
                  labelPlacement="outside"
                  selectedKeys={[criteria.attitude]}
                  onSelectionChange={(keys) =>
                    setCriteria((prev) => ({
                      ...prev,
                      attitude: Array.from(keys)[0] as string,
                    }))
                  }
                >
                  <SelectItem key="Actively participates in class activities">
                    Actively participates in class activities
                  </SelectItem>
                  <SelectItem key="Normal, needs to be more active">
                    Normal, needs to be more active
                  </SelectItem>
                  <SelectItem key="Rarely speaks or participates in activities. Needs to be more active">
                    Rarely speaks or participates in activities. Needs to be
                    more active
                  </SelectItem>
                  <SelectItem key="Easily distracted">
                    Easily distracted
                  </SelectItem>
                  <SelectItem key="Disruptive and affects class time">
                    Disruptive and affects class time
                  </SelectItem>
                </Select>
                <Select
                  label="Homework Completion"
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
                  <SelectItem key="Frequently completes fully with good quality">
                    Frequently completes fully with good quality
                  </SelectItem>
                  <SelectItem key="Completes fully but the quality is not good. Needs to do the homework more carefully">
                    Completes fully but the quality is not good. Needs to do
                    the homework more carefully
                  </SelectItem>
                  <SelectItem key="Does not complete fully. Needs to work harder on homework">
                    Does not complete fully. Needs to work harder on homework
                  </SelectItem>
                  <SelectItem key="Often does not do assigned homework. Needs to work harder on homework">
                    Often does not do assigned homework. Needs to work harder
                    on homework
                  </SelectItem>
                </Select>

                <h1 className="font-bold">Language Practice Skills</h1>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Listening Skill", key: "listening" },
                    { label: "Speaking Skill", key: "speaking" },
                    { label: "Reading Skill", key: "reading" },
                    { label: "Writing Skill", key: "writing" },
                    { label: "Vocabulary", key: "vocabulary" },
                    { label: "Grammar", key: "grammar" },
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
                      <SelectItem key="Good">Good</SelectItem>
                      <SelectItem key="Fair, could be better">
                        Fair, could be better
                      </SelectItem>
                      <SelectItem key="Needs to try harder">
                        Needs to try harder
                      </SelectItem>
                    </Select>
                  ))}

                  <Select
                    label="Progress in Semester"
                    labelPlacement="outside"
                    selectedKeys={criteria.progress ? [criteria.progress] : []}
                    onSelectionChange={(keys) =>
                      setCriteria((prev) => ({
                        ...prev,
                        progress: Array.from(keys)[0]?.toString() || "",
                      }))
                    }
                  >
                    <SelectItem key="Made progress during the semester">
                      Made progress during the semester
                    </SelectItem>
                    <SelectItem key="No progress during the semester">
                      No progress during the semester
                    </SelectItem>
                  </Select>
                </div>

                <div className="space-y-4 mt-4">
                  <h1 className="font-bold">Preset Comments</h1>
                  <div className="flex flex-col gap-4">
                    <Select
                      label="Attitude and learning habits"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="Limits expressing content unrelated to the lesson.">
                        Limits expressing content unrelated to the lesson.
                      </SelectItem>
                      <SelectItem key="Should focus attention during class.">
                        Should focus attention during class.
                      </SelectItem>
                      <SelectItem key="Remember to bring all learning tools.">
                        Remember to bring all learning tools.
                      </SelectItem>
                      <SelectItem key="Need to attend class on time.">
                        Need to attend class on time.
                      </SelectItem>
                      <SelectItem key="Limit the use of Vietnamese in class.">
                        Limit the use of Vietnamese in class.
                      </SelectItem>
                      <SelectItem key="You should actively speak up more.">
                        You should actively speak up more.
                      </SelectItem>
                      <SelectItem key="You are quite shy, so practice being bold to ask questions and express opinions.">
                        You are quite shy, so practice being bold to ask
                        questions and express opinions.
                      </SelectItem>
                      <SelectItem key="You are easily distracted and often forget vocabulary.">
                        You are easily distracted and often forget vocabulary.
                      </SelectItem>
                      <SelectItem key="You are limited in memorizing vocabulary and grammar due to lack of careful note-taking and review.">
                        You are limited in memorizing vocabulary and grammar due
                        to lack of careful note-taking and review.
                      </SelectItem>
                    </Select>

                    <Select
                      label="Skills and learning methods"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="You should practice Cambridge exam formats at the level you are studying and explore, expand your knowledge through books, newspapers and the internet.">
                        You should practice Cambridge exam formats at the level
                        you are studying and explore, expand your knowledge
                        through books, newspapers and the internet.
                      </SelectItem>
                      <SelectItem key="You don't react quickly in communication, need to listen to more conversations and practice at home.">
                        You do not react quickly in communication, need to listen
                        to more conversations and practice at home.
                      </SelectItem>
                      <SelectItem key="You often make mistakes when doing homework, need to take careful notes and frequently review the lesson to avoid repeating these mistakes.">
                        You often make mistakes when doing homework, need to
                        take careful notes and frequently review the lesson to
                        avoid repeating these mistakes.
                      </SelectItem>
                      <SelectItem key="You should listen more at home and try to memorize many phrases and their meanings.">
                        You should listen more at home and try to memorize many
                        phrases and their meanings.
                      </SelectItem>
                      <SelectItem key="You need to review regularly and practice applying the learned grammar structures, vocabulary and expand your vocabulary.">
                        You need to review regularly and practice applying the
                        learned grammar structures, vocabulary and expand your
                        vocabulary.
                      </SelectItem>
                      <SelectItem key="You need to review learned vocabulary regularly, practice reading aloud and rewrite many times to memorize better.">
                        You need to review learned vocabulary regularly, practice
                        reading aloud and rewrite many times to memorize better.
                      </SelectItem>
                      <SelectItem key="Regularly practice listening and rereading the lessons learned in the book, encouraging listening and practicing reading in native voices regularly to improve pronunciation.">
                        Regularly practice listening and rereading the lessons
                        learned in the book, encouraging listening and
                        practicing reading in native voices regularly to improve
                        pronunciation.
                      </SelectItem>
                      <SelectItem key="You should cultivate the habit of listening and reading English every day, get used to and be exposed to many sources of knowledge so that your upcoming learning journey will be smoother.">
                        You should cultivate the habit of listening and reading
                        English every day, get used to and be exposed to many
                        sources of knowledge so that your upcoming learning
                        journey will be smoother.
                      </SelectItem>
                    </Select>

                    <Select
                      label="General assessment"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="You are sharp and have a positive learning attitude, so continue to promote it.">
                        You are sharp and have a positive learning attitude, so
                        continue to promote it.
                      </SelectItem>
                      <SelectItem key="Your language practice skills have improved.">
                        Your language practice skills have improved.
                      </SelectItem>
                      <SelectItem key="Your language practice skills have not improved much. You need to study more seriously and invest more time in self-study at home.">
                        Your language practice skills have not improved much. You
                        need to study more seriously and invest more time in
                        self-study at home.
                      </SelectItem>
                      <SelectItem key="Your language practice skills have improved. However, you need to practice listening and speaking skills more.">
                        Your language practice skills have improved. However,
                        you need to practice listening and speaking skills more.
                      </SelectItem>
                      <SelectItem key="You are diligent, and your skills are quite good. Keep up the good work!">
                        You are diligent, and your skills are quite good. Keep up
                        the good work!
                      </SelectItem>
                      <SelectItem key="You have tried but your language practice skills have not improved much. You need to try to practice the skills more!">
                        You have tried but your language practice skills have not
                        improved much. You need to try to practice the skills
                        more!
                      </SelectItem>
                      <SelectItem key="You have not put much effort into studying. You need to study more seriously and invest more time in self-study at home. You need to try harder!">
                        You have not put much effort into studying. You need to
                        study more seriously and invest more time in self-study
                        at home. You need to try harder!
                      </SelectItem>
                    </Select>

                    <Select
                      label="Specific recommendations"
                      labelPlacement="outside"
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0]?.toString() || "";
                        handlePresetSelect(selected);
                      }}
                    >
                      <SelectItem key="You should practice being careful when doing exercises and check carefully after completion.">
                        You should practice being careful when doing exercises
                        and check carefully after completion.
                      </SelectItem>
                      <SelectItem key="You should learn vocabulary carefully and review the lesson often, especially the example sentences in the grammar lesson.">
                        You should learn vocabulary carefully and review the
                        lesson often, especially the example sentences in the
                        grammar lesson.
                      </SelectItem>
                      <SelectItem key="You should look up vocabulary, especially learn a lot of phrases, learn how to take notes and apply what you have learned to practice.">
                        You should look up vocabulary, especially learn a lot of
                        phrases, learn how to take notes and apply what you have
                        learned to practice.
                      </SelectItem>
                      <SelectItem key="You have the capacity to develop language if you are willing to practice hard and set higher goals.">
                        You have the capacity to develop language if you are
                        willing to practice hard and set higher goals.
                      </SelectItem>
                      <SelectItem key="You should focus more during class and actively speak up more.">
                        You should focus more during class and actively speak up
                        more.
                      </SelectItem>
                      <SelectItem key="You should focus more during class and complete the exercises assigned by the teacher fully before entering class.">
                        You should focus more during class and complete the
                        exercises assigned by the teacher fully before entering
                        class.
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
                      {commentLength}/{MAX_COMMENT_LENGTH} characters
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