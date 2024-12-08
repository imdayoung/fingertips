package fingertips.backend.transaction.controller;

import fingertips.backend.security.util.JwtProcessor;
import fingertips.backend.transaction.dto.*;
import fingertips.backend.transaction.service.TransactionService;
import fingertips.backend.exception.dto.JsonResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/transaction")
public class TransactionController {

    private final TransactionService transactionService;
    private final JwtProcessor jwtProcessor;

    @PostMapping
    public ResponseEntity<JsonResponse<String>> saveTransaction(@RequestHeader("Authorization") String token) {

        String accessToken = jwtProcessor.extractToken(token);
        Integer memberIdx = jwtProcessor.getMemberIdx(accessToken);
        transactionService.saveTransaction(memberIdx);
        return ResponseEntity.ok(JsonResponse.success("Save Transaction Success"));
    }

    @GetMapping("/summary")
    public ResponseEntity<JsonResponse<MonthlySummaryDTO>> getMonthlySummary(@RequestHeader("Authorization") String token,
                                                                             @RequestParam String startDate, @RequestParam String endDate) {

        String accessToken = jwtProcessor.extractToken(token);
        Integer memberIdx = jwtProcessor.getMemberIdx(accessToken);
        MonthlySummaryDTO response = transactionService.getMonthlySummary(memberIdx, startDate, endDate);
        return ResponseEntity.ok().body(JsonResponse.success(response));
    }

    @GetMapping("/fixed")
    public ResponseEntity<JsonResponse<List<String>>> getFixedExpense(@RequestHeader("Authorization") String token) {

        String accessToken = jwtProcessor.extractToken(token);
        Integer memberIdx = jwtProcessor.getMemberIdx(accessToken);
        List<String> response = transactionService.getFixedExpense(memberIdx);
        return ResponseEntity.ok().body(JsonResponse.success(response));
    }

    @GetMapping("/top-usage")
    public ResponseEntity<JsonResponse<String>> mostAndMaximumUsed(@RequestHeader("Authorization") String token,
                                                                   @RequestParam String startDate, @RequestParam String endDate) {

        String accessToken = jwtProcessor.extractToken(token);
        Integer memberIdx = jwtProcessor.getMemberIdx(accessToken);
        String response = transactionService.getMostAndMaximumUsed(memberIdx, startDate, endDate);
        return ResponseEntity.ok().body(JsonResponse.success(response));
    }

    @GetMapping("/recommendation")
    public ResponseEntity<JsonResponse<String>> getRecommendation(@RequestHeader("Authorization") String token) {

        String accessToken = jwtProcessor.extractToken(token);
        Integer memberIdx = jwtProcessor.getMemberIdx(accessToken);
        String response = transactionService.getRecommendation(memberIdx);
        return ResponseEntity.ok().body(JsonResponse.success(response));
    }

    @GetMapping("/category")
    public ResponseEntity<JsonResponse<List<CategoryTransactionCountDTO>>> getCategoryData(@RequestParam Map<String, String> params) {
        PeriodDTO period = makePeriodDTO(params);
        List<CategoryTransactionCountDTO> transactionCounts = transactionService.getCategoryData(period);
        return ResponseEntity.ok().body(JsonResponse.success(transactionCounts));
    }

    private PeriodDTO makePeriodDTO(@RequestParam Map<String, String> params) {
        Integer memberIdx = Integer.parseInt(params.get("memberIdx"));
        Integer startYear = Integer.parseInt(params.get("startYear"));
        Integer startMonth = Integer.parseInt(params.get("startMonth"));
        Integer startDay = Integer.parseInt(params.get("startDay"));
        Integer endYear = Integer.parseInt(params.get("endYear"));
        Integer endMonth = Integer.parseInt(params.get("endMonth"));
        Integer endDay = Integer.parseInt(params.get("endDay"));

        return PeriodDTO.builder()
                .memberIdx(memberIdx)
                .startYear(startYear)
                .startMonth(startMonth)
                .startDay(startDay)
                .endYear(endYear)
                .endMonth(endMonth)
                .endDay(endDay)
                .build();
    }
}
