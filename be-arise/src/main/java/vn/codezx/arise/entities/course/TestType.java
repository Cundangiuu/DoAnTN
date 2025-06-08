package vn.codezx.arise.entities.course;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.constants.TypeOfTest;
import vn.codezx.arise.entities.base.BaseInfo;
import vn.codezx.arise.utils.TypeOfTestDeserialize;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "test_type")
public class TestType extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "type", unique = true)
  @JsonDeserialize(converter = TypeOfTestDeserialize.class)
  @Enumerated(EnumType.STRING)
  private TypeOfTest type;

  @Column(name = "description")
  private String description;

}
