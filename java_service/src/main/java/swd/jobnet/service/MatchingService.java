package swd.jobnet.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import swd.jobnet.repository.CvRepository;
import swd.jobnet.repository.JobRepository;

@Service
class MatchingService {
    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CvRepository cvRepository;


}
