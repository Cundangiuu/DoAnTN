package vn.codezx.triviet.entities.staff.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "staff_class")
@Builder
public class StaffClassId {

  @Column(name = "staff_id")
  private Long staffId;

  @Column(name = "class_id")
  private Long classId;
}
