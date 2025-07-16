package swd.jobnet.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Report implements Serializable {
    private List<JobInfo> jobInfoList;
    private double predictedGrowth;
    private int totalITJobs;
    private double averageITSalary;
}

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
class JobInfo implements Serializable{
    private String jobName;
    private int numberOfJobs;
    private double averageSalary;
}