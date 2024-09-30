package fingertips.backend.member.mapper;

import fingertips.backend.member.dto.MemberDTO;
import fingertips.backend.member.dto.MemberIdFindDTO;
import fingertips.backend.member.dto.PasswordFindDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

    MemberDTO getMemberByMemberId(String memberId);
    void insertMember(MemberDTO memberDTO);
    void updateLockStatus(MemberDTO memberDTO);
    void deleteMember(String username);
    void setRefreshToken(MemberDTO memberDTO);
    String findByNameAndEmail(MemberIdFindDTO memberIdFindDTO);
    int existsMemberId(String memberId);
    void clearRefreshToken(String memberId);
    void withdrawMember(String memberId);
    void updatePasswordByEmail(PasswordFindDTO passwordFindDTO);
}
