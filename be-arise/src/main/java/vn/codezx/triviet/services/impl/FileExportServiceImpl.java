package vn.codezx.triviet.services.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.fileexport.DownloadDTO;
import vn.codezx.triviet.dtos.reports.BaseReportType;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.services.FileExportService;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;


@Service
@Slf4j
public class FileExportServiceImpl implements FileExportService {
    final MessageUtil messageUtil;

    FileExportServiceImpl(MessageUtil messageUtil) {
        this.messageUtil = messageUtil;
    }

    private String dateToString(Date date) {
        String pattern = "ddMMyyyy_HHmmss";
        DateFormat df = new SimpleDateFormat(pattern);

        return df.format(date);
    }

    @Override
    public <T extends BaseReportType> DownloadDTO exportXLSX(String requestId, List<T> data,
            String prefix) {
        if (data == null || data.isEmpty()) {
            return createEmptyFile(requestId, prefix);
        }
        var headersMap = data.getFirst().getHeaders();
        var headers = headersMap.keySet();
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Sheet 1");
            var headerRow = sheet.createRow(0);
            int cellNum = 0;
            for (var cellData : headers) {
                var cell = headerRow.createCell(cellNum++);
                cell.setCellValue(cellData);
            }

            for (int i = 1; i < data.size() + 1; i++) {
                var row = sheet.createRow(i);
                cellNum = 0;

                for (var entry : headersMap.entrySet()) {
                    var field = data.get(i - 1).getClass().getDeclaredField(entry.getValue());

                    var canAccess = field.canAccess(data.get(i - 1));
                    field.setAccessible(true);
                    var cellData = field.get(data.get(i - 1));
                    field.setAccessible(canAccess);
                    var cell = row.createCell(cellNum++);

                    cell.setCellValue(Objects.isNull(cellData) ? null : cellData.toString());
                }
            }

            var bos = new ByteArrayOutputStream();
            Resource resource = null;
            workbook.write(bos);
            var barr = bos.toByteArray();

            var is = new ByteArrayInputStream(barr);
            resource = new InputStreamResource(is);

            return DownloadDTO.builder().resource(resource)
                    .filename(String.format("%s_%s.xlsx", prefix, dateToString(new Date())))
                    .build();
        } catch (SecurityException | IOException | IllegalArgumentException | IllegalAccessException
                | NoSuchFieldException e) {
            log.error(
                    LogUtil.buildFormatLog(requestId,
                            messageUtil.getMessage(MessageCode.MESSAGE_EXPORT_SYSTEM_ERROR)),
                    e.fillInStackTrace());
            throw new TveException(MessageCode.MESSAGE_EXPORT_SYSTEM_ERROR.getCode(),
                    messageUtil.getMessage(MessageCode.MESSAGE_EXPORT_SYSTEM_ERROR), requestId);
        }
    }
    private DownloadDTO createEmptyFile(String requestId, String prefix) {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            XSSFSheet sheet = workbook.createSheet("Sheet 1");
    
            var bos = new ByteArrayOutputStream();
            Resource resource = null;
            workbook.write(bos);
            var barr = bos.toByteArray();
    
            var is = new ByteArrayInputStream(barr);
            resource = new InputStreamResource(is);
    
            return DownloadDTO.builder().resource(resource)
                    .filename(String.format("%s_%s.xlsx", prefix, dateToString(new Date())))
                    .build();
        } catch (IOException e) {
            log.error(
                    LogUtil.buildFormatLog(requestId,
                            messageUtil.getMessage(MessageCode.MESSAGE_EXPORT_SYSTEM_ERROR)),
                    e.fillInStackTrace());
            throw new TveException(MessageCode.MESSAGE_EXPORT_SYSTEM_ERROR.getCode(),
                    messageUtil.getMessage(MessageCode.MESSAGE_EXPORT_SYSTEM_ERROR), requestId);
        }
    }
}
