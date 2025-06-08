package vn.codezx.triviet.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public abstract class EntityMapper<D, E> {

  public abstract E toEntity(D dto);

  public List<E> toListEntity(List<D> listDto) {
    List<E> listEntity = new ArrayList<>();
    for (D dto : listDto) {
      listEntity.add(toEntity(dto));
    }

    return listEntity;
  }

  public <R> List<E> toListEntity(Function<R, E> predicate, List<R> listDto) {
    List<E> listEntity = new ArrayList<>();
    for (R dto : listDto) {
      listEntity.add(predicate.apply(dto));
    }

    return listEntity;
  }
}