package fingertips.backend.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDTO {
    private Integer memberIdx;
    private String memberId;
    private String password;
    private String newPassword;
    private String checkNewPassword;
    private String memberName;
    private String birthday;
    private String gender;
    private String email;
    private String imageUrl;
    private String joinDate;
    private String region;
    private String job;
    private Integer testStatus;
    private Integer activeStatus;
    private String socialType;
    private String refreshToken;
    private String withdrawDate;
    private String role;
    private Integer loginLocked;
    private Long loginLockTime;
}
