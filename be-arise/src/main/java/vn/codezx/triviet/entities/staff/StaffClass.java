package vn.codezx.triviet.entities.staff;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.course.ClassTvms;
import vn.codezx.triviet.entities.staff.id.StaffClassId;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "staff_class")
public class StaffClass extends BaseInfo {

  @EmbeddedId
  private StaffClassId bookId;


  @ManyToOne
  @MapsId("staffId")
  @JoinColumn(name = "staff_id", nullable = false)
  private Staff staff;


  @ManyToOne
  @MapsId("classId")
  @JoinColumn(name = "class_id", nullable = false)
  private ClassTvms classTVMS;
}
