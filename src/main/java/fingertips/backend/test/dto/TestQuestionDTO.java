package fingertips.backend.test.dto;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestQuestionDTO {

    private Integer questionIdx;
    private String questionText;
}
