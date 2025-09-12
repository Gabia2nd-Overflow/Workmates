package com.workmates.backend.web.dto;

import com.workmates.backend.domain.Schedule.Importance;
import java.util.EnumMap;
import java.util.Map;

public class ScheduleStatsDto {
    private long total;
    private long completedCount;
    private double completionRate; // 0.0 ~ 100.0
    private long dueSoonCount; // 7일 미만 남은 "미완료"
    private long overdueCount; // 마감 지났는데 미완료 (추가)
    private Map<Importance, Long> incompleteByImportance = new EnumMap<>(Importance.class);

    public ScheduleStatsDto() {}

    public ScheduleStatsDto(long total, long completedCount, double completionRate, long dueSoonCount, long overdueCount,
                            Map<Importance, Long> incompleteByImportance) {
        this.total = total;
        this.completedCount = completedCount;
        this.completionRate = completionRate;
        this.dueSoonCount = dueSoonCount;
        this.overdueCount = overdueCount;
        this.incompleteByImportance = incompleteByImportance != null ? incompleteByImportance : new EnumMap<>(Importance.class);
    }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public long getCompletedCount() { return completedCount; }
    public void setCompletedCount(long completedCount) { this.completedCount = completedCount; }

    public double getCompletionRate() { return completionRate; }
    public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }

    public long getDueSoonCount() { return dueSoonCount; }
    public void setDueSoonCount(long dueSoonCount) { this.dueSoonCount = dueSoonCount; }

    public long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }

    public Map<Importance, Long> getIncompleteByImportance() { return incompleteByImportance; }
    public void setIncompleteByImportance(Map<Importance, Long> incompleteByImportance) { this.incompleteByImportance = incompleteByImportance; }
}
