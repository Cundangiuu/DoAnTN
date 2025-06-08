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
@Table(name = "staff")
@Builder
public class KeyPairId {
  @Column(name = "public_key")
  private String publicKey;
  @Column(name = "private_key")
  private String privateKey;
}
