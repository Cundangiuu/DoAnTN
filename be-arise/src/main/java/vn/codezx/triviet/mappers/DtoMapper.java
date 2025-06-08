package vn.codezx.triviet.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

public abstract class DtoMapper<E, D> {

  public abstract D toDto(E entity);

  public List<D> toListDto(List<E> listEntity) {
    List<D> dtoList = new ArrayList<>();
    for (E entity : listEntity) {
      dtoList.add(toDto(entity));
    }

    return dtoList;
  }

  public <R> List<D> toListDto(Function<R, D> predicate, List<R> listEntity) {
    List<D> listDto = new ArrayList<>();
    for (R entity : listEntity) {
      listDto.add(predicate.apply(entity));
    }

    return listDto;
  }
}