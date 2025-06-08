"use client";

import { SkillName } from "@/constants/skillName";
import { TypeOfTest } from "@/constants/typeOfTest";
import { GradeDTO } from "@/dtos";
import { DateToStringWithoutTime } from "@/utils/DateUtils";
import { FaCheck } from "react-icons/fa";

const ReportContent = ({ grade }: { grade: GradeDTO }) => {
  const testType = grade.testType.type;
  const formula = grade.classArise.course.formula;
  const isReadingWriting =
    testType == TypeOfTest.MIDTERM
      ? formula.midtermReadingMaxScore == 0 ||
        formula.midtermWritingMaxScore == 0
      : formula.finalReadingMaxScore == 0 || formula.finalWritingMaxScore == 0;

  const midtermMaxSum =
    formula.midtermListeningMaxScore +
    formula.midtermSpeakingMaxScore +
    formula.midtermReadingMaxScore +
    formula.midtermWritingMaxScore;
  const finalMaxSum =
    formula.finalListeningMaxScore +
    formula.finalSpeakingMaxScore +
    formula.finalReadingMaxScore +
    formula.finalWritingMaxScore;

  function containsEnglishTest(input: string): boolean {
    const keywords = ["IELTS", "FINAL KET", "FINAL PET"];
    const normalizedInput = input.toUpperCase();

    return keywords.some((keyword) => normalizedInput.includes(keyword));
  }

  return (
    <div className="pdf-report bg-white p-8 rounded-lg shadow-md w-[210mm] h-[297mm] font-arial text-xs">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold">
            TRUNG TÂM NGOẠI NGỮ TRÍ VIỆT - CƠ SỞ 2
          </div>
          <div className="text-xs">
            Hoàng Diệu, Phường Trảng Bàng, TX Trảng Bàng, Tây Ninh
          </div>
        </div>
      </div>

      <div className="text-center mt-4 mb-4">
        <h1 className="text-xl font-bold">PHIẾU THÔNG BÁO KẾT QUẢ</h1>
        <h2 className="text-lg font-bold">
          CLASS REPORT - {grade.classArise.course.name.toUpperCase()} {testType} TEST RESULT
        </h2>
        <div className="text-sm mt-1">
          Ngày: {DateToStringWithoutTime(new Date())}
        </div>
      </div>

      <div className="mt-2 pl-4">
        <div className="flex">
          <div className="w-24 font-semibold text-xs">Học viên:</div>
          <div className="text-xs">
            {grade.student.name}{" "}
            {grade.student.nickname ? `(${grade.student.nickname})` : ""}
          </div>
        </div>
        <div className="flex">
          <div className="w-24 font-semibold text-xs">Lớp:</div>
          <div className="text-xs">
            {grade.classArise.name} - {grade.classArise.code}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <table className="w-full border-collapse border border-dashed border-gray-400 text-xs">
          <thead>
            <tr className="bg-[#DCE6F1]">
              {testType != TypeOfTest.COURSE && (
                <>
                  <th className="border-solid border  border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      Nghe (Listening)
                      {testType === TypeOfTest.MIDTERM &&
                        `(${formula.midtermListeningMaxScore})`}
                      {testType === TypeOfTest.FINAL &&
                        `(${formula.finalListeningMaxScore})`}
                    </p>
                  </th>
                  <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      Nói (Speaking)
                      {testType === TypeOfTest.MIDTERM &&
                        `(${formula.midtermSpeakingMaxScore})`}
                      {testType === TypeOfTest.FINAL &&
                        `(${formula.finalSpeakingMaxScore})`}
                    </p>
                  </th>
                  {isReadingWriting && (
                    <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                      <p className="mb-3">
                        Đọc-Viết (Reading-Writing)
                        {testType === TypeOfTest.MIDTERM &&
                          `(${Math.max(
                            formula.midtermReadingMaxScore,
                            formula.midtermWritingMaxScore
                          )})`}
                        {testType === TypeOfTest.FINAL &&
                          `(${Math.max(
                            formula.finalReadingMaxScore,
                            formula.finalWritingMaxScore
                          )})`}
                      </p>
                    </th>
                  )}
                  {!isReadingWriting && (
                    <>
                      <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                        <p className="mb-3">
                          Đọc (Reading)
                          {testType === TypeOfTest.MIDTERM &&
                            `(${formula.midtermReadingMaxScore})`}
                          {testType === TypeOfTest.FINAL &&
                            `(${formula.finalReadingMaxScore})`}
                        </p>
                      </th>
                      <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                        <p className="mb-3">
                          Viết (Writing)
                          {testType === TypeOfTest.MIDTERM &&
                            `(${formula.midtermWritingMaxScore})`}
                          {testType === TypeOfTest.FINAL &&
                            `(${formula.finalWritingMaxScore})`}
                        </p>
                      </th>
                    </>
                  )}
                  {!containsEnglishTest(grade.classArise.course.name) && (
                    <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                      <p className="mb-3">
                        Tổng điểm{" "}
                        {testType === TypeOfTest.MIDTERM
                          ? "giữa khoá"
                          : "cuối khoá"}
                        (
                        {testType
                          .toString()
                          .toLowerCase()
                          .charAt(0)
                          .toUpperCase() +
                          testType.toString().toLowerCase().slice(1)}{" "}
                        Test Score)
                      </p>
                    </th>
                  )}

                  {containsEnglishTest(grade.classArise.course.name) ? (
                    <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                      <p className="mb-3">
                        Điểm{" "}
                        {testType === TypeOfTest.MIDTERM
                          ? "giữa khoá "
                          : "cuối khoá "}
                        (
                        {testType
                          .toString()
                          .toLowerCase()
                          .charAt(0)
                          .toUpperCase() +
                          testType.toString().toLowerCase().slice(1)}
                        ) ({formula.finalWritingMaxScore})
                      </p>
                    </th>
                  ) : (
                    <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                      <p className="mb-3">
                        Điểm{" "}
                        {testType === TypeOfTest.MIDTERM
                          ? "giữa khoá"
                          : "cuối khoá"}
                        (
                        {testType
                          .toString()
                          .toLowerCase()
                          .charAt(0)
                          .toUpperCase() +
                          testType.toString().toLowerCase().slice(1)}{" "}
                        Percentage) (100%)
                      </p>
                    </th>
                  )}
                </>
              )}
              {testType == TypeOfTest.COURSE && (
                <>
                  <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      Tổng điểm giữa khoá (Midterm Test Score) ({midtermMaxSum})
                    </p>
                  </th>
                  <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      Tổng điểm cuối khoá (Final Test Score) ({finalMaxSum})
                    </p>
                  </th>
                  <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      Tỷ lệ giữa khoá (Midterm Percentage) (
                      {formula.midtermGradeWeight * 100}%)
                    </p>
                  </th>
                  <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      Tỷ lệ cuối khoá (Final Percentage) (
                      {formula.finalGradeWeight * 100}%)
                    </p>
                  </th>
                  <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      Điểm thưởng khoá học (Course Bonus) (
                      {formula.bonusGradeWeight * 100}%)
                    </p>
                  </th>
                  <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">Tỷ lệ khoá học (Course Bonus) (100%)</p>
                  </th>
                </>
              )}
              <th className="border-solid border border-gray-400 text-center px-0.5 py-0">
                <p className="mb-3">Xếp loại (Grade)</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {testType != TypeOfTest.COURSE && (
                <>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      {grade.skills.find(
                        (skill) => skill.name === SkillName.LISTENING
                      )?.score ?? "N/A"}
                    </p>
                  </td>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      {grade.skills.find(
                        (skill) => skill.name === SkillName.SPEAKING
                      )?.score ?? "N/A"}
                    </p>
                  </td>
                  {isReadingWriting && (
                    <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                      <p className="mb-3">
                        {grade.skills.find(
                          (skill) =>
                            skill.name === SkillName.READING ||
                            skill.name == SkillName.WRITING
                        )?.score ?? "N/A"}
                      </p>
                    </td>
                  )}
                  {!isReadingWriting && (
                    <>
                      <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                        <p className="mb-3">
                          {grade.skills.find(
                            (skill) => skill.name === SkillName.READING
                          )?.score ?? "N/A"}
                        </p>
                      </td>
                      <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                        <p className="mb-3">
                          {grade.skills.find(
                            (skill) => skill.name === SkillName.WRITING
                          )?.score ?? "N/A"}
                        </p>
                      </td>
                    </>
                  )}
                  {!containsEnglishTest(grade.classArise.course.name) && (
                    <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                      <p className="mb-3">
                        {grade.skills.reduce(
                          (accumulator, skill) => accumulator + skill.score,
                          0
                        )}
                      </p>
                    </td>
                  )}

                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">{grade.score}</p>
                  </td>
                </>
              )}
              {testType == TypeOfTest.COURSE && (
                <>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      {grade.skills.find(
                        (skill) => skill.name === SkillName.MIDTERMSUM
                      )?.score ?? "N/A"}
                    </p>
                  </td>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      {grade.skills.find(
                        (skill) => skill.name === SkillName.FINALSUM
                      )?.score ?? "N/A"}
                    </p>
                  </td>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      {grade.skills.find(
                        (skill) => skill.name === SkillName.MIDTERMPER
                      )?.score ?? "N/A"}
                    </p>
                  </td>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      {grade.skills.find(
                        (skill) => skill.name === SkillName.FINALPER
                      )?.score ?? "N/A"}
                    </p>
                  </td>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">
                      {grade.skills.find(
                        (skill) => skill.name === SkillName.BONUS
                      )?.score ?? "N/A"}
                    </p>
                  </td>
                  <td className="border-solid border border-gray-400 text-center px-0.5 py-0">
                    <p className="mb-3">{grade.score}</p>
                  </td>
                </>
              )}
              <td className="border-solid border border-gray-400 text-center font-bold px-0.5 py-0">
                <p className="mb-3">{grade.classification}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {grade.criteria && (
        <div className="mt-2">
          <table className="w-full border-collapse border border-dashed border-gray-400 text-[0.8rem]">
            <thead>
              <tr className="bg-[#DCE6F1]">
                <th className="border-solid border border-gray-400 text-center w-[30%] text-sm px-0.5 py-0">
                  <p className="mb-3">TIÊU CHÍ / CRITERIA</p>
                </th>
                <th className="border-solid border border-gray-400 text-center w-[70%] text-sm px-0.5 py-0">
                  <p className="mb-3">Nhận xét</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">
                    Thái độ học tập trên lớp / Attitude in class
                  </p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.attitude}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">
                    Chuyên cần làm bài tập về nhà / Homework Completion
                  </p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.homeworkCompletion}</p>
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className="border-solid border border-gray-400 px-0.5 py-0"
                >
                  <p className="mb-3">
                    Kỹ năng thực hành ngôn ngữ / Language elements and skills
                  </p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">Nghe / Listening</p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.listening}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">Nói / Speaking</p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.speaking}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">Đọc / Reading</p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.reading}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">Viết / Writing</p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.writing}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">Từ vựng / Vocabulary</p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.vocabulary}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">Ngữ pháp / Grammar</p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.grammar}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">
                    Tiến bộ trong kỳ học / Progress during the term
                  </p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <p className="mb-3">{grade.criteria.progress}</p>
                </td>
              </tr>
              <tr>
                <td className="border-solid border border-gray-400 align-top px-0.5 py-0">
                  <p className="mb-3">
                    Nhận xét khác / Đề xuất Other comments / Suggestions
                  </p>
                </td>
                <td className="border-solid border border-gray-400 px-0.5 py-0">
                  <div
                    className="break-words"
                    style={{
                      minHeight: "40px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    <p className="mb-3">{grade.comment}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between mt-2">
        <div className="flex flex-col items-center w-full">
          <div className="font-semibold text-center leading-tight">
            <div>Giáo viên giảng dạy</div>
            <div>Teacher in charge</div>
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="relative">
              <FaCheck className="text-red-600" />
            </div>
            <div>Đã duyệt</div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="font-semibold text-center leading-tight">
            <div>Phòng đào tạo</div>
            <div>Training dep</div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="relative">
              <FaCheck className="text-red-600" />
            </div>
            <div>Đã duyệt</div>
          </div>
          <div className="font-semibold mt-1">Phạm Thị Hoa Lài</div>
        </div>
      </div>
    </div>
  );
};

export default ReportContent;
