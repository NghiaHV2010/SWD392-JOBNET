package swd.jobnet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swd.jobnet.dto.Response;
import swd.jobnet.dto.UserDto;
import swd.jobnet.enums.StatusCode;
import swd.jobnet.model.User;
import swd.jobnet.repository.UserRepository;
import swd.jobnet.util.DtoConverter;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Response getAllUsers(){
        Response response = new Response();
        try {
            List<User> users = userRepository.findAll();
            List<UserDto> userDtos = new ArrayList<>();
            if (users.isEmpty()) {
                response.setStatusCode(StatusCode.NO_CONTENT);
            }else{
                userDtos = users.stream()
                        .map(DtoConverter::convertToUserDto)
                        .toList();
            }
            response.setUserDtos(userDtos);
            response.setStatusCode(StatusCode.OK);
        }catch (Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}