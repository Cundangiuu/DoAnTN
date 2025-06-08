package vn.codezx.triviet.services;

import java.util.List;
import vn.codezx.triviet.dtos.fileexport.DownloadDTO;
import vn.codezx.triviet.dtos.reports.BaseReportType;

public interface FileExportService {
  <T extends BaseReportType> DownloadDTO exportXLSX(String requestId, List<T> data, String prefix);
}
