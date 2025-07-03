package swd.jobnet.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.api.client.json.Json;
import com.google.genai.Client;
import com.google.genai.types.*;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import swd.jobnet.dto.Response;
import swd.jobnet.enums.StatusCode;
import swd.jobnet.model.Cv;
import swd.jobnet.model.Job;
import swd.jobnet.model.Matching;
import swd.jobnet.repository.CvRepository;
import swd.jobnet.repository.JobRepository;
import swd.jobnet.repository.MatchingRepository;
import swd.jobnet.util.DtoConverter;

import java.io.FileWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MatchingService {

    private final String MATCHING_JOB_PROMPT = "Base on the following CV's information and job's information, " +
            "rate the matching score between CV and job from 1-100. " +
            "The output must only contain the matching score only.\n\n";

    @Autowired
    private JobRepository jobRepository;

    @Value("${file.path.job}")
    private String JOB_FILE_PATH;

    @Value("${file.path.cv}")
    private String CV_FILE_PATH;

    @Value("${GEMINI_API_KEY}")
    private String GEMINI_API_KEY;

    @Autowired
    private CvRepository cvRepository;

    @Autowired
    private MatchingRepository matchingRepository;

    public Response getMatchingJob(String cvId, String jobId) {
        Response response = new Response();
        try {
            Job findJob = jobRepository.findJobById(jobId);
            Cv findCv = cvRepository.findCvById(cvId);

            if (findJob != null && findCv != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.enable(SerializationFeature.INDENT_OUTPUT)
                        .findAndRegisterModules()
                        .writeValue(new FileWriter(JOB_FILE_PATH), findJob);
                objectMapper.writeValue(new FileWriter(CV_FILE_PATH), findCv);

                Client client = Client.builder().apiKey(GEMINI_API_KEY).build();

                // Read JSON content into strings
                String jobJson = objectMapper.writeValueAsString(findJob);
                String cvJson = objectMapper.writeValueAsString(findCv);

                String combinedContent = MATCHING_JOB_PROMPT +
                        "--- START CV JSON ---\n" +
                        cvJson + "\n" +
                        "--- END CV JSON ---\n\n" +
                        "--- START JOB JSON ---\n" +
                        jobJson + "\n" +
                        "--- END JOB JSON ---";

                List<Content> content = new ArrayList<Content>();
                content.add(Content.fromParts(Part.fromText(combinedContent)));

                GenerateContentConfig responseConfig = GenerateContentConfig.builder()
                        .temperature(0.1f)
                        .thinkingConfig(
                                ThinkingConfig.builder()
                                        .includeThoughts(false)
                                        .build()
                        )
                        .build();


                GenerateContentResponse aiResponse = client.models.generateContent(
                        "gemini-2.5-flash",
                        content,
                        responseConfig
                );
                if (aiResponse == null || aiResponse.text() == null) throw new Exception("AI không trả về kết quả");

                Matching matching = new Matching();
                matching.setJob(findJob);
                matching.setCv(findCv);
                matching.setScore(new BigDecimal(aiResponse.text()));
                matchingRepository.save(matching);

                if (!matching.getId().isEmpty()) response.setMatchingDto(DtoConverter.convertToMatchingDto(matching));

                response.setStatusCode(StatusCode.OK);
                response.setMessage(StatusCode.OK.getDescription());
            } else if (findJob == null) {
                response.setStatusCode(StatusCode.NO_CONTENT);
                response.setMessage(StatusCode.NO_CONTENT.getDescription() + " cho Job");
            } else {
                response.setStatusCode(StatusCode.NO_CONTENT);
                response.setMessage(StatusCode.NO_CONTENT.getDescription() + " cho CV");
            }
        } catch (Exception e) {
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage(StatusCode.INTERNAL_SERVER_ERROR.getDescription() + " khi tìm job phù hợp: " + e.getMessage());
        }
        return response;
    }
}
