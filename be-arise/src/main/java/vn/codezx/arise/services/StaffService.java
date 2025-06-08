package vn.codezx.arise.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import vn.codezx.arise.dtos.staff.StaffDTO;
import vn.codezx.arise.dtos.staff.request.StaffRequest;
import vn.codezx.arise.entities.staff.Staff;

public interface StaffService {
	StaffDTO createStaff(String requestId, StaffRequest staffRequest, MultipartFile avatar);

	Page<StaffDTO> getStaffs(String requestId, String query, Pageable pageable);

	Page<StaffDTO> getStaffs(String requestId, String query, List<Integer> scheduleIds,
			List<Integer> roleIds, Pageable pageable);

	StaffDTO updateStaff(String requestId, Integer staffId, StaffRequest staffRequest,
			MultipartFile avatar);

	StaffDTO getStaff(String requestId, Integer staffId);

	StaffDTO deleteStaff(String requestId, Integer staffId);

	String storeAvatar(String requestId, Staff staff, MultipartFile file);
}
