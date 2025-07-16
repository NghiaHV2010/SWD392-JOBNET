package swd.jobnet.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.List;

@Getter
public enum JobTags {
    FRONTEND(Arrays.asList("ReactJS", "React", "Angular", "Vue.js", "Frontend", "Front-end", "Front end")),
    BACKEND(Arrays.asList("Python", "Java", "Node.js", "Golang", "PHP", "Ruby", "Backend", "Back-end", "Back end")),
    FULLSTACK(Arrays.asList("Full stack", "Full-stack", "Fullstack"));

    private final List<String> jobTags;

    JobTags(List<String> jobTags) {
        this.jobTags = jobTags;
    }

    public String getJobTag() {
        return String.join("|", jobTags);
    }
}
