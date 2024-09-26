package fingertips.backend.member.service;

import fingertips.backend.exception.error.ApplicationError;
import fingertips.backend.exception.error.ApplicationException;
import fingertips.backend.member.dto.MemberDTO;
import fingertips.backend.member.dto.MemberIdFindDTO;
import fingertips.backend.member.mapper.MemberMapper;
import fingertips.backend.security.util.JwtProcessor;
import lombok.extern.log4j.Log4j;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j
@RequiredArgsConstructor
@Service
public class MemberServiceImpl implements MemberService {

    private final MemberMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProcessor jwtProcessor;
    private final MemberMapper memberMapper;

    public String authenticate(String username, String password) {
        MemberDTO memberDTO = mapper.getMember(username);
        if (memberDTO != null && passwordEncoder.matches(password, memberDTO.getPassword())) {
            return jwtProcessor.generateAccessToken(username, memberDTO.getRole());
        }
        throw new ApplicationException(ApplicationError.MEMBER_NOT_FOUND);
    }

    public void joinMember(MemberDTO memberDTO) {

        String encodedPassword = passwordEncoder.encode(memberDTO.getPassword());
        memberDTO.setPassword(encodedPassword);

        mapper.insertMember(memberDTO);
    }

    public MemberDTO getMemberByMemberId(String memberId) {

        MemberDTO member = mapper.getMember(memberId);
        if (member == null) {
            throw new ApplicationException(ApplicationError.MEMBER_NOT_FOUND);
        }
        return member;
    }

    public void deleteMember(String username) {
        mapper.deleteMember(username);
    }

    public String findByNameAndEmail(MemberIdFindDTO memberIdFindDTO) {

        String memberId = mapper.findByNameAndEmail(memberIdFindDTO);

        if (memberId == null) {
            throw new ApplicationException(ApplicationError.MEMBER_NOT_FOUND);
        }

        return memberId;
    }

    @Override
    public void setRefreshToken(MemberDTO memberDTO) {

        mapper.setRefreshToken(memberDTO);
    }

    @Override
    public boolean isEmailTaken(String email) {

        int isTaken = mapper.isEmailTaken(email);
        return isTaken != 0;
    }

    @Override
    public boolean existsMemberId(String memberId) {
        return mapper.existsMemberId(memberId) != 0;
    }

    @Override
    public MemberDTO getMemberInfo(String memberId) {
        return memberMapper.getMemberInfo(memberId);
    }

    @Override
    public void updateMemberInfo(String memberId, MemberDTO memberDTO) {

        MemberDTO updateDTO = MemberDTO.builder()
                .memberId(memberId)
                .password(memberDTO.getPassword())
                .newEmail(memberDTO.getNewEmail())
                .imageUrl(memberDTO.getImageUrl())
                .build();

        memberMapper.updateMemberInfo(memberId, updateDTO);
    }
}
