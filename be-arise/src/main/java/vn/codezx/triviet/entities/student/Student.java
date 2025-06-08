package vn.codezx.triviet.entities.student;

import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.reporting.Enrollment;
import vn.codezx.triviet.entities.setting.Discount;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "student")
public class Student extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "code", unique = true)
  private String code;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "nickname")
  private String nickname;

  @Column(name = "date_of_birth")
  private Date dateOfBirth;

  @Column(name = "email_address")
  private String emailAddress;

  @Column(name = "phone_number")
  private String phoneNumber;

  @Column(name = "address")
  private String address;

  @Column(name = "avatar_url")
  private String avatarUrl;

  @Column(name = "note")
  private String note;

  @ManyToOne
  @JoinColumn(name = "discount_id")
  private Discount discount;
}
