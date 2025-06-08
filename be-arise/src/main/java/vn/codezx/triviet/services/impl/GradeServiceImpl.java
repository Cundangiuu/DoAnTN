package vn.codezx.triviet.services.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.constants.TypeOfTest;
import vn.codezx.triviet.dtos.grade.CriteriaRequest;
import vn.codezx.triviet.dtos.grade.GradeDTO;
import vn.codezx.triviet.dtos.grade.GradeRequest;
import vn.codezx.triviet.entities.course.ClassTvms;
import vn.codezx.triviet.entities.course.TestType;
import vn.codezx.triviet.entities.setting.Skill;
import vn.codezx.triviet.entities.student.Criteria;
import vn.codezx.triviet.entities.student.Grade;
import vn.codezx.triviet.entities.student.Student;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.grade.GradeToDTOMapper;
import vn.codezx.triviet.repositories.ClassTvmsRepository;
import vn.codezx.triviet.repositories.CriteriaRepository;
import vn.codezx.triviet.repositories.GradeRepository;
import vn.codezx.triviet.repositories.SkillRepository;
import vn.codezx.triviet.repositories.StudentRepository;
import vn.codezx.triviet.repositories.TestTypeRepository;
import vn.codezx.triviet.services.GradeService;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Service
public class GradeServiceImpl implements GradeService {

  private final GradeRepository gradeRepository;
  private final StudentRepository studentRepository;
  private final ClassTvmsRepository classTvmsRepository;
  private final TestTypeRepository testTypeRepository;
  private final GradeToDTOMapper gradeToDTOMapper;
  private final SkillRepository skillRepository;
  private final CriteriaRepository criteriaRepository;
  private final MessageUtil messageUtil;


  @Autowired
  public GradeServiceImpl(GradeRepository gradeRepository, StudentRepository studentRepository,
      ClassTvmsRepository classTvmsRepository, TestTypeRepository testTypeRepository,
      GradeToDTOMapper gradeToDTOMapper, MessageUtil messageUtil, SkillRepository skillRepository,
      CriteriaRepository criteriaRepository) {
    this.gradeRepository = gradeRepository;
    this.studentRepository = studentRepository;
    this.classTvmsRepository = classTvmsRepository;
    this.testTypeRepository = testTypeRepository;
    this.gradeToDTOMapper = gradeToDTOMapper;
    this.messageUtil = messageUtil;
    this.skillRepository = skillRepository;
    this.criteriaRepository = criteriaRepository;
  }

  @Override
  @Transactional
  public GradeDTO createGrade(String requestId, GradeRequest gradeRequest) {
    Student student = studentRepository.findByIdAndIsDeleteFalse(gradeRequest.getStudentId())
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
            messageUtil.getMessage(MessageCode.MESSAGE_STU_NOT_FOUND, gradeRequest.getStudentId()),
            requestId));

    ClassTvms classTvms = classTvmsRepository.findByIdAndIsDeleteFalse(gradeRequest.getClassId())
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_CLA_NOTFOUND.getCode(),
            LogUtil.buildFormatLog(requestId, messageUtil
                .getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, gradeRequest.getClassId()))));

    TestType testType = testTypeRepository.findByType(gradeRequest.getTypeOfTest())
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_TES_NOT_FOUND.getCode(),
            LogUtil.buildFormatLog(requestId, messageUtil
                .getMessage(MessageCode.MESSAGE_TES_NOT_FOUND, gradeRequest.getTypeOfTest()))));

    Grade grade = Grade.builder().student(student).classTvms(classTvms).testType(testType)
        .comment(gradeRequest.getComment()).score(gradeRequest.getScore())
        .sum(gradeRequest.getSum()).classification(gradeRequest.getClassification()).build();

    Grade savedGrade = gradeRepository.save(grade);

    List<Skill> skills = gradeRequest.getSkills().stream().map(skillRequest -> {
      Skill skill = Skill.builder().name(skillRequest.getName()).score(skillRequest.getScore())
          .grade(savedGrade).build();
      skillRepository.save(skill);
      return skill;
    }).toList();
    grade.getSkills().addAll(skills);

    CriteriaRequest criteriaRequest = gradeRequest.getCriteria();
    Criteria criteria = Criteria.builder().attitude(criteriaRequest.getAttitude())
        .homeworkCompletion(criteriaRequest.getHomeworkCompletion())
        .listening(criteriaRequest.getListening()).reading(criteriaRequest.getReading())
        .speaking(criteriaRequest.getSpeaking()).writing(criteriaRequest.getWriting())
        .vocabulary(criteriaRequest.getVocabulary()).grammar(criteriaRequest.getGrammar())
        .progress(criteriaRequest.getProgress()).grade(savedGrade).build();

    criteria = criteriaRepository.save(criteria);
    grade.setCriteria(criteria);
    grade = gradeRepository.saveAndFlush(grade);
    return gradeToDTOMapper.toDto(grade);
  }

  @Override
  public GradeDTO getGrade(String requestId, Integer gradeId) {
    Grade grade = gradeRepository.findByIdAndIsDeleteFalse(gradeId)
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
            messageUtil.getMessage(MessageCode.MESSAGE_GRA_NOT_FOUND, gradeId), requestId));

    return gradeToDTOMapper.toDto(grade);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<GradeDTO> getGradesByStudentId(String requestId, Integer studentId,
      TypeOfTest typeOfTest, Integer classId, Pageable pageable) {
    Student student = studentRepository.findByIdAndIsDeleteFalse(studentId)
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
            messageUtil.getMessage(MessageCode.MESSAGE_STU_NOT_FOUND, studentId), requestId));

    if (typeOfTest != null && classId != null) {
      ClassTvms classTvms = classTvmsRepository.findByIdAndIsDeleteFalse(classId)
          .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
              messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId), requestId));

      TestType testType = testTypeRepository.findByType(typeOfTest)
          .orElseThrow(() -> new TveException(MessageCode.MESSAGE_TES_NOT_FOUND.getCode(),
              LogUtil.buildFormatLog(requestId,
                  messageUtil.getMessage(MessageCode.MESSAGE_TES_NOT_FOUND, typeOfTest))));
      return gradeRepository.findByStudentAndClassTvmsAndTestTypeAndIsDeleteFalse(student,
          classTvms, testType, pageable).map(gradeToDTOMapper::toDto);
    }

    if (typeOfTest != null) {
      TestType testType = testTypeRepository.findByType(typeOfTest)
          .orElseThrow(() -> new TveException(MessageCode.MESSAGE_TES_NOT_FOUND.getCode(),
              LogUtil.buildFormatLog(requestId,
                  messageUtil.getMessage(MessageCode.MESSAGE_TES_NOT_FOUND, typeOfTest))));
      return gradeRepository.findByStudentAndTestTypeAndIsDeleteFalse(student, testType, pageable)
          .map(gradeToDTOMapper::toDto);
    }

    if (classId != null) {
      ClassTvms classTvms = classTvmsRepository.findByIdAndIsDeleteFalse(classId)
          .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
              messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId), requestId));

      return gradeRepository.findByStudentAndClassTvmsAndIsDeleteFalse(student, classTvms, pageable)
          .map(gradeToDTOMapper::toDto);
    }

    return gradeRepository.findByStudentAndIsDeleteFalse(student, pageable)
        .map(gradeToDTOMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<GradeDTO> getGradesByClassId(String requestId, Integer classId, TypeOfTest typeOfTest,
      Pageable pageable) {
    ClassTvms classTvms = classTvmsRepository.findByIdAndIsDeleteFalse(classId)
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
            messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND, classId), requestId));

    if (typeOfTest != null) {
      TestType testType = testTypeRepository.findByType(typeOfTest)
          .orElseThrow(() -> new TveException(MessageCode.MESSAGE_TES_NOT_FOUND.getCode(),
              LogUtil.buildFormatLog(requestId,
                  messageUtil.getMessage(MessageCode.MESSAGE_TES_NOT_FOUND, typeOfTest))));

      return gradeRepository
          .findByClassTvmsAndTestTypeAndIsDeleteFalse(classTvms, testType, pageable)
          .map(gradeToDTOMapper::toDto);
    }

    return gradeRepository.findByClassTvmsAndIsDeleteFalse(classTvms, pageable)
        .map(gradeToDTOMapper::toDto);
  }

  @Override
  @Transactional
  public GradeDTO updateGrade(String requestId, Integer gradeId, GradeRequest gradeRequest) {
    Grade grade = gradeRepository.findByIdAndIsDeleteFalse(gradeId)
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
            messageUtil.getMessage(MessageCode.MESSAGE_GRA_NOT_FOUND, gradeId), requestId));

    if (gradeRequest.getComment() != null) {
      grade.setComment(gradeRequest.getComment());
    }

    if (gradeRequest.getSum() != null) {
      grade.setSum(gradeRequest.getSum());
    }

    if (gradeRequest.getScore() != null) {
      grade.setScore(gradeRequest.getScore());
    }

    if (gradeRequest.getClassification() != null) {
      grade.setClassification(gradeRequest.getClassification());
    }

    if (gradeRequest.getSkills() != null) {
      grade.getSkills().clear();
      List<Skill> skills = gradeRequest.getSkills().stream().map(skillRequest -> {
        Skill skill = Skill.builder().name(skillRequest.getName()).score(skillRequest.getScore())
            .grade(grade).build();
        return skill;
      }).collect(Collectors.toList());

      grade.getSkills().addAll(skills);
    }

    if (gradeRequest.getCriteria() != null) {
      CriteriaRequest criteriaRequest = gradeRequest.getCriteria();
      Criteria criteria = grade.getCriteria();

      if (criteria == null) {
        criteria = new Criteria();
        grade.setCriteria(criteria);
      }

      criteria.setAttitude(criteriaRequest.getAttitude());
      criteria.setGrade(grade);
      criteria.setHomeworkCompletion(criteriaRequest.getHomeworkCompletion());
      criteria.setListening(criteriaRequest.getListening());
      criteria.setReading(criteriaRequest.getReading());
      criteria.setSpeaking(criteriaRequest.getSpeaking());
      criteria.setWriting(criteriaRequest.getWriting());
      criteria.setVocabulary(criteriaRequest.getVocabulary());
      criteria.setGrammar(criteriaRequest.getGrammar());
      criteria.setProgress(criteriaRequest.getProgress());
    }

    return gradeToDTOMapper.toDto(gradeRepository.save(grade));
  }

  @Override
  @Transactional
  public GradeDTO deleteGrade(String requestId, Integer gradeId) {
    Grade grade = gradeRepository.findByIdAndIsDeleteFalse(gradeId)
        .orElseThrow(() -> new TveException(MessageCode.MESSAGE_NOT_FOUND,
            messageUtil.getMessage(MessageCode.MESSAGE_GRA_NOT_FOUND, gradeId), requestId));

    GradeDTO gradeDTO = gradeToDTOMapper.toDto(grade);
    gradeRepository.delete(grade);

    return gradeDTO;
  }

  @Override
  @Transactional
  public List<GradeDTO> generateClassGrade(String requestId, String classCode,
      TypeOfTest testType) {
    List<Student> studentList = studentRepository.findByClassCode(classCode);
    if (ObjectUtils.isEmpty(studentList)) {
      throw new TveException(MessageCode.MESSAGE_NOT_FOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }
    Optional<TestType> testTypeOptional = testTypeRepository.findByType(testType);
    if (testTypeOptional.isEmpty()) {
      throw new TveException(MessageCode.MESSAGE_NOT_FOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }
    TestType testTypeEntity = testTypeOptional.get();
    Optional<ClassTvms> classTvmsOptional =
        classTvmsRepository.findByCodeAndIsDeleteFalse(classCode);
    if (classTvmsOptional.isEmpty()) {
      throw new TveException(MessageCode.MESSAGE_NOT_FOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_NOT_FOUND));
    }

    ClassTvms classTvms = classTvmsOptional.get();

    List<Grade> grades =
        gradeRepository.findByClassTvmsAndTestTypeAndIsDeleteFalse(classTvms, testTypeEntity);
    if (!grades.isEmpty()) {
      return Collections.emptyList();
    }
    List<Grade> newEntities = new ArrayList<>();
    for (Student student : studentList) {
      Grade entity =
          Grade.builder().testType(testTypeEntity).classTvms(classTvms).student(student).build();
      newEntities.add(entity);
    }

    return gradeToDTOMapper.toListDto(gradeRepository.saveAll(newEntities));
  }
}
