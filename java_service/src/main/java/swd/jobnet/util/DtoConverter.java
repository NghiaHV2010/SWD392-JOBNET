package swd.jobnet.util;

import org.springframework.stereotype.Component;
import swd.jobnet.dto.JobDto;
import swd.jobnet.dto.UserDto;
import swd.jobnet.model.Job;
import swd.jobnet.model.User;

@Component
public class DtoConverter {
    public static UserDto convertToUserDto(User user){
        UserDto userDto = new UserDto();

        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setDescription(user.getDescription());
        userDto.setImageUrl(user.getImageUrl());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setUpdatedAt(user.getUpdatedAt());

        return userDto;
    }

    public static JobDto convertToJobDto(Job job){
        JobDto jobDto = new JobDto();
        jobDto.setId(job.getId());
        jobDto.setDescription(job.getDescription());
        jobDto.setJobLevel(job.getJobLevel());
        jobDto.setEducation(job.getEducation());
        jobDto.setApplyLocation(job.getApplyLocation());
        jobDto.setEndDate(job.getEndDate());
        jobDto.setFormOfWork(job.getFormOfWork());
        jobDto.setSalary(job.getSalary());
        jobDto.setSourceUrl(job.getSourceUrl());
        jobDto.setCreatedAt(job.getCreatedAt());
        jobDto.setUpdatedAt(job.getUpdatedAt());
        jobDto.setTitle(job.getTitle());
        jobDto.setExperience(job.getExperience());
        jobDto.setQuantity(job.getQuantity());
        jobDto.setTags(job.getTags());

        return jobDto;
    }
}