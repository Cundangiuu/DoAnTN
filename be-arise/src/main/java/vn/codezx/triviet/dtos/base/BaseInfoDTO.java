package vn.codezx.triviet.dtos.base;


import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BaseInfoDTO {
    String createdBy;
    Date createdAt;
    String updatedBy;
    Date updatedAt;
    Boolean isDelete;
}
