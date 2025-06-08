package vn.codezx.arise.services;

import java.util.List;
import vn.codezx.arise.dtos.fileexport.DownloadDTO;
import vn.codezx.arise.dtos.reports.BaseReportType;

public interface FileExportService {
  <T extends BaseReportType> DownloadDTO exportXLSX(String requestId, List<T> data, String prefix);
}
