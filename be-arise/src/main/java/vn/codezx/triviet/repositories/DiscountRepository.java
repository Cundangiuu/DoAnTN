package vn.codezx.triviet.repositories;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.setting.Discount;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Integer> {

    Page<Discount> findAllByIsDeleteIsFalse(Pageable pageable);

    Optional<Discount> findByIdAndIsDeleteIsFalse(Integer discountId);

}
