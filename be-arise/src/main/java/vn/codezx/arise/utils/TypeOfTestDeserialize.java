package vn.codezx.arise.utils;

import com.fasterxml.jackson.databind.util.StdConverter;
import vn.codezx.arise.constants.TypeOfTest;

public class TypeOfTestDeserialize extends StdConverter<String, TypeOfTest> {
    @Override
    public TypeOfTest convert(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null; 
        }
        try {
            return TypeOfTest.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; 
        }
    }
}
