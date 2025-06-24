package swd.jobnet.util;

import org.springframework.stereotype.Component;
import swd.jobnet.dto.UserDto;
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
}
