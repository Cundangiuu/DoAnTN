// package vn.codezx.triviet.entities.staff;
// import jakarta.persistence.*;
// import vn.codezx.triviet.entities.base.BaseInfo;

// @Entity
// @Table(name = "staff_role", uniqueConstraints = @UniqueConstraint(columnNames = {"staff_id",
// "role_id"}))
// public class StaffRole extends BaseInfo {
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private int id;

// @ManyToOne
// @JoinColumn(name = "staff_id", nullable = false)
// private Staff staff;

// @ManyToOne
// @JoinColumn(name = "role_id", nullable = false)
// private Role role;
// }
