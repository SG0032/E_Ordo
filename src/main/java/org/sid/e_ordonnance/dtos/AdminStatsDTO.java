package org.sid.e_ordonnance.dtos;

import lombok.Data;

@Data
public class AdminStatsDTO {
    private Long totalUsers;
    private Long totalStudents;
    private Long totalDoctors;
    private Long totalAdmins;
    private Long pendingVerifications;
    private Long approvedUsers;
    private Long rejectedUsers;

    public AdminStatsDTO() {
        this.totalUsers = 0L;
        this.totalStudents = 0L;
        this.totalDoctors = 0L;
        this.totalAdmins = 0L;
        this.pendingVerifications = 0L;
        this.approvedUsers = 0L;
        this.rejectedUsers = 0L;
    }
}