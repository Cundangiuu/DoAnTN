"use client";

import DeleteActionButton from "@/components/molecules/table/DeleteButton";
import TableWrapper from "@/components/molecules/table/TableWrapper";
import { FilterOptionType, Rest } from "@/components/type";
import { SkillName } from "@/constants/skillName";
import { TypeOfTest } from "@/constants/typeOfTest";
import { GradeDTO, StudentDTO } from "@/dtos";
import { ClassDTO } from "@/dtos/classes/ClassDTO";
import { FormulaDTO } from "@/dtos/formula/FormulaDTO";
import { CriteriaRequestDTO } from "@/dtos/grade/CriteriaRequestDTO";
import {
  GradeRequestDTO,
  GradeUpdateRequestDTO,
} from "@/dtos/grade/GradeRequestDTO";
import { SkillRequestDTO } from "@/dtos/grade/SkillRequestDTO";
import { FormulaService, GradeService } from "@/services";
import { deleteGrade, generateDefaultGrades } from "@/services/GradeService";
import { updateSearchParams } from "@/utils/UrlUtil";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  ButtonGroup,
  Chip,
  Input,
  Selection,
  User,
} from "@nextui-org/react";
import { evaluate } from "mathjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Criteria from "./Criteria";

type Props = {
  classData?: ClassDTO | undefined;
  classCode?: string;
};

const GradesTable: React.FC<Props> = ({ classData, classCode }) => {
  const router = useRouter();
  const path = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<GradeDTO[] | undefined>();
  const [newData, setNewData] = useState<GradeRequestDTO | undefined>(
    undefined
  );
  const [editData, setEditData] = useState<GradeUpdateRequestDTO | undefined>(
    undefined
  );
  const [studentScores, setStudentScores] = useState<GradeDTO[]>([]);
  const [formula, setFormula] = useState<FormulaDTO | undefined>();
  const [loading, setLoading] = useState(false);
  const haveFormula = !!classData?.course?.formula?.id;
  const searchParams = useSearchParams();
  const testTypeParam = searchParams.get("testType")
    ? String(searchParams.get("testType"))
    : "MIDTERM";
  const [testType, setTestType] = useState<Selection>(
    new Set(testTypeParam?.split(", "))
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const getScoresOfStudent = async (studentId: number) => {
    const response = await GradeService.getAllGradesByStudentId(
      studentId,
      undefined,
      undefined,
      undefined,
      classData?.id as number
    );

    if (!response.data) {
      toast.error("This student don't have enough grade to calculate result");
      return;
    }

    setStudentScores(response.data.content);
  };

  useEffect(() => {
    if (testTypeParam == "COURSE" && newData?.studentId) {
      getScoresOfStudent(newData.studentId);
    }
  }, [testTypeParam, newData?.studentId]);

  useEffect(() => {
    if (testTypeParam == "COURSE" && editData?.studentId) {
      getScoresOfStudent(editData.studentId);
    }
  }, [testTypeParam, editData?.studentId]);

  useEffect(() => {
    if (newData?.skills && testTypeParam === "COURSE") {
      const midtermGrade = studentScores.find(
        (grade) => grade.testType.type === "MIDTERM"
      );
      const finaltermGrade = studentScores.find(
        (grade) => grade.testType.type === "FINAL"
      );

      setNewData((prev) => {
        if (!prev) return prev;
        const updatedSkills = prev.skills.map((skill) => {
          switch (skill.name) {
            case SkillName.MIDTERMSUM:
              return { ...skill, score: Number(midtermGrade?.sum || 0) };
            case SkillName.MIDTERMPER:
              return { ...skill, score: Number(midtermGrade?.score || 0) };
            case SkillName.FINALSUM:
              return { ...skill, score: Number(finaltermGrade?.sum || 0) };
            case SkillName.FINALPER:
              return { ...skill, score: Number(finaltermGrade?.score || 0) };
            default:
              return skill;
          }
        });

        return {
          ...prev,
          skills: updatedSkills,
        };
      });
    }
  }, [studentScores, testTypeParam]);

  useEffect(() => {
    if (editData?.skills && testTypeParam === "COURSE") {
      const midtermGrade = studentScores.find(
        (grade) => grade.testType.type === "MIDTERM"
      );
      const finaltermGrade = studentScores.find(
        (grade) => grade.testType.type === "FINAL"
      );

      setEditData((prev) => {
        if (!prev) return prev;

        const updatedSkills = prev.skills.map((skill) => {
          switch (skill.name) {
            case SkillName.MIDTERMSUM:
              return { ...skill, score: Number(midtermGrade?.sum || 0) };
            case SkillName.FINALSUM:
              return { ...skill, score: Number(finaltermGrade?.sum || 0) };
            case SkillName.MIDTERMPER:
              return { ...skill, score: Number(midtermGrade?.score || 0) };
            case SkillName.FINALPER:
              return { ...skill, score: Number(finaltermGrade?.score || 0) };
            default:
              return skill;
          }
        });

        return {
          ...prev,
          skills: updatedSkills,
        };
      });
    }
  }, [studentScores, testTypeParam]);

  useEffect(() => {
    if (newData?.skills && testTypeParam === "COURSE" && formula) {
      const midtermGrade =
        studentScores.find((grade) => grade.testType.type === "MIDTERM")
          ?.score || 0;
      const finaltermGrade =
        studentScores.find((grade) => grade.testType.type === "FINAL")?.score ||
        0;

      const bonus =
        newData.skills.find((skill) => skill.name == SkillName.BONUS)?.score ||
        0;

      const percentageScore = parseFloat(
        (
          formula.midtermGradeWeight * (midtermGrade || 0) +
          formula.finalGradeWeight * (finaltermGrade || 0) +
          (bonus || 0)
        ).toFixed(2)
      );

      const classification = evaluate(formula.classificationFormula, {
        percentageScore: percentageScore || 0,
      });

      setNewData(
        (prev) =>
          ({
            ...prev,
            score: percentageScore || 0,
            classification: classification || "N/A",
          } as GradeRequestDTO)
      );
    }
  }, [studentScores, newData?.skills, testTypeParam, formula]);

  useEffect(() => {
    if (editData?.skills && testTypeParam === "COURSE" && formula) {
      const midtermGrade =
        studentScores.find((grade) => grade.testType.type === "MIDTERM")
          ?.score || 0;
      const finaltermGrade =
        studentScores.find((grade) => grade.testType.type === "FINAL")?.score ||
        0;

      const bonus =
        editData.skills.find((skill) => skill.name == SkillName.BONUS)?.score ||
        0;

      const percentageScore = parseFloat(
        (
          formula.midtermGradeWeight * (midtermGrade || 0) +
          formula.finalGradeWeight * (finaltermGrade || 0) +
          (bonus || 0)
        ).toFixed(2)
      );

      const classification = evaluate(formula.classificationFormula || "", {
        percentageScore: percentageScore || 0,
      });

      setEditData(
        (prev) =>
          ({
            ...prev,
            score: percentageScore || 0,
            classification: classification || "N/A",
          } as GradeUpdateRequestDTO)
      );
    }
  }, [studentScores, editData?.skills, testTypeParam, formula]);

  useEffect(() => {
    if (newData?.skills && testTypeParam != "COURSE") {
      const percentageFormula =
        testTypeParam == "MIDTERM"
          ? formula?.midtermPercentageFormula
          : formula?.finalPercentageFormula;
      const classificationFormula =
        testTypeParam == "MIDTERM"
          ? formula?.midtermClassificationFormula
          : formula?.finalClassificationFormula;
      const midtermMaxScore =
        (formula?.midtermListeningMaxScore ?? 0) +
        (formula?.midtermReadingMaxScore ?? 0) +
        (formula?.midtermSpeakingMaxScore ?? 0) +
        (formula?.midtermWritingMaxScore ?? 0);
      const finalMaxScore =
        (formula?.finalListeningMaxScore ?? 0) +
        (formula?.finalReadingMaxScore ?? 0) +
        (formula?.finalSpeakingMaxScore ?? 0) +
        (formula?.finalWritingMaxScore ?? 0);
      const maxScore =
        testTypeParam == "MIDTERM" ? midtermMaxScore : finalMaxScore;

      const score = newData.skills.reduce(
        (accumulator, skill) => accumulator + (skill.score || 0),
        0
      );

      const percentage = maxScore ? (score / maxScore) * 100 : 0;

      const percentageScore = percentageFormula
        ? Math.round(
            evaluate(percentageFormula, {
              sum: percentage || 0,
            }) * 100
          ) / 100
        : 0;

      const classification = classificationFormula
        ? evaluate(classificationFormula, {
            percentageScore: percentageScore || 0,
          })
        : "N/A";

      setNewData(
        (prev) =>
          ({
            ...prev,
            sum: score ?? 0,
            score: percentageScore || 0,
            classification: classification || "N/A",
          } as GradeRequestDTO)
      );
    }
  }, [newData?.skills]);

  useEffect(() => {
    if (editData?.skills && testTypeParam != "COURSE") {
      const percentageFormula =
        testTypeParam == "MIDTERM"
          ? formula?.midtermPercentageFormula
          : formula?.finalPercentageFormula;
      const classificationFormula =
        testTypeParam == "MIDTERM"
          ? formula?.midtermClassificationFormula
          : formula?.finalClassificationFormula;
      const midtermMaxScore =
        (formula?.midtermListeningMaxScore ?? 0) +
        (formula?.midtermReadingMaxScore ?? 0) +
        (formula?.midtermSpeakingMaxScore ?? 0) +
        (formula?.midtermWritingMaxScore ?? 0);
      const finalMaxScore =
        (formula?.finalListeningMaxScore ?? 0) +
        (formula?.finalReadingMaxScore ?? 0) +
        (formula?.finalSpeakingMaxScore ?? 0) +
        (formula?.finalWritingMaxScore ?? 0);
      const maxScore =
        testTypeParam == "MIDTERM" ? midtermMaxScore : finalMaxScore;

      const score = editData.skills.reduce(
        (accumulator, skill) => accumulator + (skill.score || 0),
        0
      );

      const sum = maxScore ? (score / maxScore) * 100 : 0;

      const percentageScore = percentageFormula
        ? Math.round(
            evaluate(percentageFormula, {
              sum: sum || 0,
            }) * 100
          ) / 100
        : 0;

      const classification = classificationFormula
        ? evaluate(classificationFormula, {
            percentageScore: percentageScore || 0,
          })
        : "N/A";

      setEditData(
        (prev) =>
          ({
            ...prev,
            sum: score || 0,
            score: percentageScore || 0,
            classification: classification || "N/A",
          } as GradeUpdateRequestDTO)
      );
    }
  }, [editData?.skills]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dataResponse = await GradeService.getAllGradesByClassId({
        testType: testTypeParam,
        classId: classData?.id,
      });
      setData(dataResponse.data?.content);
      setLoading(false);
    };
    fetchData();
  }, [testTypeParam, classData?.id]);

  useEffect(() => {
    const fetchFormula = async () => {
      if (haveFormula) {
        setLoading(true);
        const formulaResponse = await FormulaService.getFormula(
          classData?.course.formula.id as number
        );

        setFormula(formulaResponse.data);
        setLoading(false);
      }
    };

    fetchFormula();
  }, []);

  const selectedStudent = useMemo(() => {
    return data?.map((grade) => grade.student.id);
  }, [data]);

  const skillSetEnable = useMemo(() => {
    if (testTypeParam === "COURSE") {
      return {
        bonus: true,
        "midterm sum": true,
        "midterm per": true,
        "final sum": true,
        "final per": true,
      };
    } else if (testTypeParam === "FINAL") {
      return {
        listening: formula?.finalListeningMaxScore,
        reading: formula?.finalReadingMaxScore,
        writing: formula?.finalWritingMaxScore,
        speaking: formula?.finalSpeakingMaxScore,
      };
    } else {
      return {
        listening: formula?.midtermListeningMaxScore,
        reading: formula?.midtermReadingMaxScore,
        writing: formula?.midtermWritingMaxScore,
        speaking: formula?.midtermSpeakingMaxScore,
      };
    }
    return {};
  }, [formula, testTypeParam]);

  const columns = useMemo(() => {
    const skillColumns = Object.entries(skillSetEnable)
      .filter((sk) => sk[1] != 0)
      .map(([skill, value]) => ({
        name: skill.charAt(0).toUpperCase() + skill.slice(1) + `${value != true ? `(${value})` : ''}`,
        key: skill,
      }));

    const baseColumns = [
      { name: "Student", key: "student", align: "start" },
      { name: "Comment", key: "comment" },
      ...skillColumns,
      { name: "Score", key: "score" },
      { name: "Classification", key: "classification" },
      { name: "Action", key: "action" },
    ];

    if (testTypeParam !== "COURSE") {
      baseColumns.splice(skillColumns.length + 2, 0, {
        name: "Sum",
        key: "sum",
      });
    }

    return baseColumns;
  }, [skillSetEnable]);

  const onCreate = async () => {
    if (!newData) return;
    try {
      setIsSubmitting(true);
      const response = await GradeService.createGrade(newData);

      if (!response.data) {
        toast.error("Failed to create grade");
      } else {
        setData([response.data, ...(data?.slice(1) as GradeDTO[])]);
        setNewData(undefined);
        toast.success("Grade created successfully!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to create grade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate = async () => {
    if (!editData) return;
    try {
      setIsSubmitting(true);
      const response = await GradeService.updateGrade(
        editData as GradeRequestDTO,
        editData.id
      );

      if (!response.data) {
        toast.error("Failed to update grade");
      } else {
        if (!data) return;
        const temp = structuredClone(data);
        const index = temp.findIndex((t) => t.id === editData.id);
        temp.splice(index, 1, response.data);
        setData(temp);
        setEditData(undefined);
        toast.success("Grade updated successfully!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to update grade");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCell = (key: string, data: GradeDTO) => {
    if (data.id == -1) {
      switch (key) {
        case "student":
          return (
            <Autocomplete
              className="max-w-xs"
              defaultItems={classData?.students.filter(
                (student) => !selectedStudent?.includes(student.id)
              )}
              label="Student"
              placeholder="Search an student"
              onSelectionChange={(id) => {
                setNewData(
                  (prev) => ({ ...prev, studentId: id } as GradeRequestDTO)
                );
              }}
            >
              {(student) => (
                <AutocompleteItem
                  key={student.id}
                  textValue={`${student.name} ${student.nickname}`}
                >
                  {student.name} ({student.nickname})
                </AutocompleteItem>
              )}
            </Autocomplete>
          );
        case "comment":
          return (
            <Criteria
              data={newData as GradeRequestDTO}
              setData={
                setNewData as Dispatch<
                  SetStateAction<GradeUpdateRequestDTO | GradeRequestDTO>
                >
              }
            />
          );
        case "bonus":
          return (
            <Input
              label="Bonus (%)"
              type="number"
              defaultValue={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.BONUS)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setNewData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.BONUS
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeRequestDTO)
                )
              }
            />
          );
        case "midterm sum":
          return (
            <Input
              label="Midterm Sum"
              type="number"
              value={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.MIDTERMSUM)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );
        case "midterm per":
          return (
            <Input
              label="Midterm Percentage"
              type="number"
              value={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.MIDTERMPER)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );
        case "final sum":
          return (
            <Input
              label="Final Sum"
              type="number"
              value={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.FINALSUM)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );
        case "final per":
          return (
            <Input
              label="Final Percentage"
              type="number"
              value={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.FINALPER)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );

        case "listening":
          return (
            <Input
              label={`Listening (${skillSetEnable.listening})`}
              type="number"
              defaultValue={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.LISTENING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setNewData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.LISTENING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.listening &&
                  parseFloat(value) > skillSetEnable.listening
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "reading":
          return (
            <Input
              label={`Reading (${skillSetEnable.reading})`}
              type="number"
              defaultValue={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.READING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setNewData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.READING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.reading &&
                  parseFloat(value) > skillSetEnable.reading
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "writing":
          return (
            <Input
              label={`Writing (${skillSetEnable.writing})`}
              type="number"
              defaultValue={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.WRITING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setNewData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.WRITING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.writing &&
                  parseFloat(value) > skillSetEnable.writing
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "speaking":
          return (
            <Input
              label={`Speaking (${skillSetEnable.speaking})`}
              type="number"
              defaultValue={
                newData?.skills
                  ?.find((skill) => skill.name === SkillName.SPEAKING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setNewData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.SPEAKING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.speaking &&
                  parseFloat(value) > skillSetEnable.speaking
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "sum":
          return (
            <Input
              label="Sum"
              type="number"
              isReadOnly
              value={newData?.sum?.toString() || ""}
            />
          );
        case "score":
          return (
            <Chip variant="solid" radius="sm">
              {newData?.score ?? 0}
            </Chip>
          );
        case "classification":
          return <Chip variant="solid">{newData?.classification}</Chip>;
        case "action":
          return (
            <ButtonGroup>
              <Button
                isDisabled={loading}
                isLoading={isSubmitting}
                isIconOnly
                color={"success"}
                onPress={async () => await onCreate()}
              >
                <FaSave />
              </Button>
              <Button
                isDisabled={loading}
                isIconOnly
                onPress={() => {
                  setNewData(undefined);
                  setData((prev) => prev?.slice(1));
                }}
              >
                <MdCancel />
              </Button>
            </ButtonGroup>
          );
      }
    } else if (editData?.id == data.id) {
      switch (key) {
        case "student":
          return (
            <Autocomplete
              className="max-w-xs"
              defaultItems={classData?.students}
              label="Student"
              defaultSelectedKey={editData.studentId.toString()}
              placeholder="Search an student"
              isReadOnly
            >
              {(student) => (
                <AutocompleteItem
                  key={student.id}
                  textValue={`${student.name} ${student.nickname}`}
                >
                  {student.name} ({student.nickname})
                </AutocompleteItem>
              )}
            </Autocomplete>
          );
        case "comment":
          return (
            <Criteria
              data={editData}
              setData={
                setEditData as Dispatch<
                  SetStateAction<GradeUpdateRequestDTO | GradeRequestDTO>
                >
              }
            />
          );
        case "bonus":
          return (
            <Input
              label="Bonus (%)"
              type="number"
              defaultValue={
                editData.skills
                  ?.find((skill) => skill.name === SkillName.BONUS)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setEditData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.BONUS
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeUpdateRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  formula?.bonusGradeWeight &&
                  parseFloat(value) > formula.bonusGradeWeight * 100
                ) {
                  return "Bonus grade weight is exceeded";
                }
              }}
            />
          );
        case "midterm sum":
          return (
            <Input
              label="Midterm Sum"
              type="number"
              value={
                editData?.skills
                  ?.find((skill) => skill.name === SkillName.MIDTERMSUM)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );
        case "midterm per":
          return (
            <Input
              label="Midterm Percentage"
              type="number"
              value={
                editData?.skills
                  ?.find((skill) => skill.name === SkillName.MIDTERMPER)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );
        case "final sum":
          return (
            <Input
              label="Final Sum"
              type="number"
              value={
                editData?.skills
                  ?.find((skill) => skill.name === SkillName.FINALSUM)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );
        case "final per":
          return (
            <Input
              label="Final Percentage"
              type="number"
              value={
                editData?.skills
                  ?.find((skill) => skill.name === SkillName.FINALPER)
                  ?.score?.toString() || ""
              }
              isReadOnly
            />
          );
        case "listening":
          return (
            <Input
              label={`Listening (${skillSetEnable.listening})`}
              type="number"
              defaultValue={
                editData.skills
                  ?.find((skill) => skill.name === SkillName.LISTENING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setEditData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.LISTENING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeUpdateRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.listening &&
                  parseFloat(value) > skillSetEnable.listening
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "reading":
          return (
            <Input
              label={`Reading (${skillSetEnable.reading})`}
              type="number"
              defaultValue={
                editData.skills
                  ?.find((skill) => skill.name === SkillName.READING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setEditData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.READING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeUpdateRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.reading &&
                  parseFloat(value) > skillSetEnable.reading
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "writing":
          return (
            <Input
              label={`Writing (${skillSetEnable.writing})`}
              type="number"
              defaultValue={
                editData.skills
                  ?.find((skill) => skill.name === SkillName.WRITING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setEditData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.WRITING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeUpdateRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.writing &&
                  parseFloat(value) > skillSetEnable.writing
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "speaking":
          return (
            <Input
              label={`Speaking (${skillSetEnable.speaking})`}
              type="number"
              defaultValue={
                editData.skills
                  ?.find((skill) => skill.name === SkillName.SPEAKING)
                  ?.score?.toString() || ""
              }
              onValueChange={(value) =>
                setEditData(
                  (prev) =>
                    ({
                      ...prev,
                      skills: prev?.skills.map((skill) =>
                        skill.name === SkillName.SPEAKING
                          ? { ...skill, score: Number(value) }
                          : skill
                      ),
                    } as GradeUpdateRequestDTO)
                )
              }
              validate={(value) => {
                if (
                  skillSetEnable.speaking &&
                  parseFloat(value) > skillSetEnable.speaking
                ) {
                  return "Score must be less than max score";
                }
              }}
            />
          );
        case "sum":
          return (
            <Input
              label="Sum"
              type="number"
              isReadOnly
              value={editData?.sum?.toString() || ""}
            />
          );
        case "score":
          return (
            <Chip variant="solid" radius="sm">
              {editData?.score ?? 0}
            </Chip>
          );
        case "classification":
          return <Chip variant="solid">{editData?.classification}</Chip>;
        case "action":
          return (
            <ButtonGroup>
              <Button
                isDisabled={loading}
                isIconOnly
                color={"success"}
                isLoading={isSubmitting}
                onPress={async () => await onUpdate()}
              >
                <FaSave />
              </Button>
              <Button
                isDisabled={loading}
                isIconOnly
                onPress={() => {
                  setEditData(undefined);
                }}
              >
                <MdCancel />
              </Button>
            </ButtonGroup>
          );
      }
    } else {
      switch (key) {
        case "student":
          return (
            <User
              avatarProps={
                data.student?.avatarUrl
                  ? { src: `/api/images?filePath=${data.student.avatarUrl}` }
                  : undefined
              }
              description={[data.student.nickname, data.student.emailAddress]
                .filter(Boolean)
                .join(" - ")}
              name={data.student?.name || ""}
            >
              {data.student?.emailAddress}
            </User>
          );
        case "comment":
          return (
            <div className="flex justify-center items-center">
              <div className="whitespace-pre-line text-left">
                {data.comment}
              </div>
            </div>
          );
        case "bonus":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.BONUS)
                ?.score ?? 0}
            </p>
          );
        case "midterm sum":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.MIDTERMSUM)
                ?.score ?? 0}
            </p>
          );
        case "midterm per":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.MIDTERMPER)
                ?.score ?? 0}
            </p>
          );
        case "final sum":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.FINALSUM)
                ?.score ?? 0}
            </p>
          );
        case "final per":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.FINALPER)
                ?.score ?? 0}
            </p>
          );
        case "listening":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.LISTENING)
                ?.score ?? 0}
            </p>
          );
        case "reading":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.READING)
                ?.score ?? 0}
            </p>
          );
        case "writing":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.WRITING)
                ?.score ?? 0}
            </p>
          );
        case "speaking":
          return (
            <p>
              {data.skills?.find((skill) => skill.name === SkillName.SPEAKING)
                ?.score ?? 0}
            </p>
          );
        case "sum":
          return <p>{data.sum ?? 0}</p>;
        case "score":
          return (
            <Chip variant="solid" radius="sm">
              {data.score ?? 0}
            </Chip>
          );
        case "classification":
          return <Chip variant="flat">{data.classification}</Chip>;
        case "action":
          return (
            <ButtonGroup>
              <Button
                isIconOnly
                startContent={<FaPen />}
                isDisabled={!haveFormula}
                onPress={() => {
                  setEditData({
                    id: data.id,
                    studentId: data.student.id,
                    classId: data.classArise.id,
                    typeOfTest: data.testType.type,
                    comment: data.comment,
                    score: data.score,
                    sum: data.sum,
                    classification: data.classification,
                    skills: Object.entries(skillSetEnable)
                      .filter(([isEnabled]) => isEnabled)
                      .map(([skill]) => ({
                        name: skill.replace(/\s+/g, "").toUpperCase(),
                        score:
                          data.skills?.find(
                            (k) =>
                              k.name.toString() ===
                              skill.replace(/\s+/g, "").toUpperCase()
                          )?.score || 0,
                      })) as SkillRequestDTO[],
                    criteria: data.criteria as CriteriaRequestDTO,
                  });
                }}
              />

              <DeleteActionButton
                id={data.id}
                disable={!haveFormula}
                action={deleteGrade}
                objectName={"Grade"}
                overrideDisableForTeacher={true}
                isIconOnly
                afterDelete={() => {
                  setData((prev) => {
                    return prev?.filter((grade) => grade.id != data.id);
                  });
                }}
              />
            </ButtonGroup>
          );
      }
    }
  };

  const addGrade = () => {
    const newEmptyGrade = {
      id: -1,
      student: {} as StudentDTO,
      comment: "",
      score: 0,
      skills: [{}],
      classification: "",
    } as GradeDTO;
    setNewData({
      studentId: undefined,
      classId: classData?.id as number,
      typeOfTest: Object.keys(TypeOfTest).filter(
        (key) => key == testTypeParam
      )[0] as TypeOfTest,
      comment: "",
      score: 0,
      sum: 0,
      classification: "",
      skills: Object.entries(skillSetEnable)
        .filter((sk) => sk[1])
        .map(([skill]) => ({
          name: skill.replace(/\s+/g, "").toUpperCase(),
          score: 0,
        })) as SkillRequestDTO[],
      criteria: {
        attitude: "Tích cực tham gia các hoạt động trên lớp",
        homeworkCompletion: "Thường xuyên hoàn thành đầy đủ với chất lượng tốt",
        listening: "Giỏi",
        reading: "Giỏi",
        writing: "Giỏi",
        speaking: "Giỏi",
        vocabulary: "Giỏi",
        grammar: "Giỏi",
        progress: "Có tiến bộ trong kỳ",
      } as CriteriaRequestDTO,
    });
    setData((prev) => (prev ? [newEmptyGrade, ...prev] : [newEmptyGrade]));
  };

  const rest: Rest | undefined = {
    totalElements: data?.length || 0,
    totalPages: 0,
    size: data?.length || 0,
    number: data?.length || 0,
    pageable: {
      pageNumber: 0,
      pageSize: data?.length || 0,
      offset: 0,
      sort: [],
      paged: true,
      unpaged: false,
    },
    sort: [],
    first: true,
    last: true,
    empty: false,
    numberOfElements: data?.length || 0,
  };
  const filterOptions: FilterOptionType = [
    {
      label: "Type",
      props: {
        disallowEmptySelection: true,
        selectedKeys: testType,
        selectionMode: "single",
        onSelectionChange: (selection: Selection) => {
          setLoading(true);
          setTestType(selection);
          setNewData(undefined);
          setEditData(undefined);
          const selectedKeys = Array.from(selection)
            .join(", ")
            .replace(/_/g, "");
          const updatedParams = updateSearchParams(
            new URLSearchParams(searchParams.toString()),
            {
              testType: selectedKeys,
            }
          );
          router.push(`${path}?${updatedParams}`);
          setLoading(false);
        },
      },
      options: Object.entries(TypeOfTest).map(([key, value]) => ({
        key: key,
        label: value,
      })),
    },
  ];

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }
    const formattedData = data.map((grade, index) => {
      const skills = grade.skills?.reduce((acc, skill) => {
        acc[skill.name] = skill.score || 0;
        return acc;
      }, {} as Record<string, number>);

      const baseData = {
        No: index + 1,
        Student: grade.student.name || "",
        Nickname: grade.student.nickname || "",
        Email: grade.student.emailAddress || "",
        Comment: grade.comment || "",
        ...skills,
        Score: grade.score ?? 0,
        Classification: grade.classification || "N/A",
      };

      if (testTypeParam !== "COURSE" && grade.sum !== undefined) {
        return {
          ...baseData,
          Sum: grade.sum || 0,
        };
      }

      return baseData;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `Grade-${classCode}-${testTypeParam}`
    );

    XLSX.writeFile(workbook, `Grade-${classCode}-${testTypeParam}.xlsx`);
  };

  const handleGenerateGrades = async () => {
    if (!classCode || typeof classCode !== "string") return;

    setIsGenerating(true);
    try {
      const response = await generateDefaultGrades(classCode, testTypeParam);

      if (response.data && response.data.length > 0) {
        toast.success("Default grades generated successfully!");
        // Refresh the data
        const fetchGrades = async () => {
          const dataResponse = await GradeService.getAllGradesByClassId({
            testType: testTypeParam,
            classId: classData?.id,
          });
          setData(dataResponse.data?.content);
        };
        await fetchGrades();
      } else {
        toast.error(response.message || "Failed to generate grades");
      }
    } catch (error) {
      toast.error("Error generating grades");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <TableWrapper<GradeDTO>
        rest={rest}
        data={data ?? []}
        columns={columns}
        renderCell={renderCell}
        isLoading={loading}
        filterOptions={filterOptions}
        isExport={exportToExcel}
        onPrintFunction={() =>
          router.push(
            `${path}/grade_print?testType=${testTypeParam}&classId=${classData?.id}`
          )
        }
        showControls={false}
      />
      <div className="flex gap-2 mt-4">
        {!loading && (!data || data.length === 0) && haveFormula && (
          <Button
            onPress={handleGenerateGrades}
            color="primary"
            isLoading={isGenerating}
            startContent={<IoMdAddCircleOutline />}
          >
            Generate Default Grades
          </Button>
        )}
        {!newData && !loading && haveFormula && (
          <Button
            onPress={addGrade}
            isIconOnly
            color="primary"
            aria-label="add-student"
          >
            <IoMdAddCircleOutline size={30} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default GradesTable;
