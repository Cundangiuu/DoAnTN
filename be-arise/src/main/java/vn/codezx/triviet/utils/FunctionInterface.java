package vn.codezx.triviet.utils;

public final class FunctionInterface {

  @FunctionalInterface
  public interface Function2<A, B, R> {

    R apply(A one, B two);
  }

}