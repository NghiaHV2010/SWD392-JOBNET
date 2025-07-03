package swd.jobnet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swd.jobnet.dto.CvDto;
import swd.jobnet.dto.Response;
import swd.jobnet.enums.StatusCode;
import swd.jobnet.model.Cv;
import swd.jobnet.model.User;
import swd.jobnet.repository.CvRepository;
import swd.jobnet.repository.UserRepository;

@Service
public class CvService {
    @Autowired
    private CvRepository cvRepository;

    @Autowired
    private UserRepository userRepository;

    public Response createNewCv(CvDto cvDto) {
        Response response = new Response();
        try{
            Cv newCv = new Cv();

            User setUser = userRepository.findById(cvDto.getUser().getId()).orElseThrow();
            newCv.setFullname(cvDto.getFullname());
            newCv.setPhone(cvDto.getPhone());
            newCv.setEmail(cvDto.getEmail());
            newCv.setAddress(cvDto.getAddress());
            newCv.setExperience(cvDto.getExperience());
            newCv.setDescription(cvDto.getDescription());
            newCv.setSkills(cvDto.getSkills());
            newCv.setEducation(cvDto.getEducation());
            newCv.setCertificates(cvDto.getCertificates());
            newCv.setApplyJob(cvDto.getApplyJob());
            newCv.setOthers(cvDto.getOthers());
            newCv.setHobbies(cvDto.getHobbies());
            newCv.setReferences(cvDto.getReferences());
            newCv.setUser(setUser);

            cvRepository.save(newCv);

            if (newCv.getId() != null) {
                response.setStatusCode(StatusCode.CREATED);
                response.setMessage(StatusCode.CREATED.getDescription());
            }else throw new Exception(" khi tạo mới CV.");

        }catch(Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage( StatusCode.INTERNAL_SERVER_ERROR.getDescription() + e.getMessage());
        }
        return response;
    }
}
