package vn.codezx.triviet.config;

import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import vn.codezx.triviet.constants.CommonConstants;

public class AuditorAwareImpl implements AuditorAware<String> {

    @SuppressWarnings("null")
    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Object object = authentication.getPrincipal();
            String account = ((String) object);
            if (StringUtils.hasText(account)) {
                return Optional.of(account);
            }
        }
        return Optional.of(CommonConstants.HeaderInfo.SYSTEM_AUTH);
    }
}
