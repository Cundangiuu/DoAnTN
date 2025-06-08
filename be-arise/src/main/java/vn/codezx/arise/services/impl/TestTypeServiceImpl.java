package vn.codezx.arise.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.codezx.arise.mappers.TestType.TestTypeToDTOMapper;
import vn.codezx.arise.repositories.TestTypeRepository;
import vn.codezx.arise.services.TestTypeService;

@Service
public class TestTypeServiceImpl implements TestTypeService {

  private final TestTypeRepository testTypeRepository;
  private final TestTypeToDTOMapper testTypeToDTOMapper;

  @Autowired
  public TestTypeServiceImpl(TestTypeToDTOMapper testTypeToDTOMapper,
      TestTypeRepository testTypeRepository) {
    this.testTypeRepository = testTypeRepository;
    this.testTypeToDTOMapper = testTypeToDTOMapper;
  }
}
