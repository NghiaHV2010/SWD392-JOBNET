package swd.jobnet.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.genai.Client;
import com.google.genai.types.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import swd.jobnet.dto.CvDto;
import swd.jobnet.dto.MatchingDto;
import swd.jobnet.dto.Response;
import swd.jobnet.enums.StatusCode;
import swd.jobnet.model.Cv;
import swd.jobnet.model.Job;
import swd.jobnet.model.Matching;
import swd.jobnet.repository.CvRepository;
import swd.jobnet.repository.JobRepository;
import swd.jobnet.repository.MatchingRepository;
import swd.jobnet.util.CsvExporter;
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

    private final String TOP_3_JOBS_PROMPT = "Base on the following CV's information in cv.csv" +
            " and jobs' information in jobs.csv, give me the top 3 jobs that fit the CV's applying job most." +
            " The output must only return as a JSON format, contains the id of the jobs and the matching score" +
            " between the CV and the job from 1 to 100.";

    @Autowired
    private JobRepository jobRepository;

    @Value("${csv.path.job}")
    private String JOB_CSV_PATH;

    @Value("${csv.path.cv}")
    private String CV_CSV_PATH;

    @Value("${GEMINI_API_KEY}")
    private String GEMINI_API_KEY;

    @Autowired
    private CvRepository cvRepository;

    @Autowired
    private MatchingRepository matchingRepository;

    private String responseSchema = """
        {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "jobDto": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string"
                  }
                }
              },
              "score": {
                "type": "number"
              }
            }
          }
        }
      """;

    public Response getMatchingJob(String cvId, String jobId) {
        Response response = new Response();
        try {
            Job findJob = jobRepository.findJobById(jobId);
            Cv findCv = cvRepository.findCvById(cvId);

            if (findJob != null && findCv != null) {
                ObjectMapper objectMapper = new ObjectMapper();

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

    public Response getTopThreeJobs(String cvId) {
        Response response = new Response();
        try{
            Cv findCv = cvRepository.findCvById(cvId);
            if (findCv != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.enable(SerializationFeature.INDENT_OUTPUT)
                            .enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
                            .findAndRegisterModules()
                            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
                List<Cv> cvList = new ArrayList<>();
                cvList.add(findCv);
                String cvJson = objectMapper.writeValueAsString(cvList);

                CsvExporter.readJsonWriteCsv(cvJson, CV_CSV_PATH);
                String cvApplyJob = findCv.getApplyJob();

                String getDescriptionPrompt = "Base on a CV's apply job " + cvApplyJob +", " +
                        "give me at most 4 words in Vietnamese can contain in a job's description or hire " +
                        "title that is suitable for the apply job. Do not include any other text except the words";

                Client client = Client.builder().apiKey(GEMINI_API_KEY).build();

                GenerateContentConfig descriptionConfig = GenerateContentConfig.builder()
                        .temperature(0.1f)
                        .thinkingConfig(
                                ThinkingConfig.builder()
                                        .includeThoughts(false)
                                        .build()
                        )
                        .responseMimeType("application/json")
                        .build();

                GenerateContentResponse aiResponse = client.models.generateContent(
                        "gemini-2.5-flash",
                        getDescriptionPrompt,
                        descriptionConfig
                );
                if (aiResponse == null || aiResponse.text() == null) throw new Exception("AI không trả về kết quả");

                List<String> jobDescriptions = objectMapper.readValue(aiResponse.text(), new TypeReference<List<String>>(){});
                String stringQuery = String.join("|", jobDescriptions);

                List<Job> jobs = jobRepository.findByDescriptionWith(stringQuery);

                if  (jobs.isEmpty()) throw new Exception("Không tìm thấy job phù hợp");
                String jobsJson =  objectMapper.writeValueAsString(jobs);

                CsvExporter.readJsonWriteCsv(jobsJson, JOB_CSV_PATH);

                GenerateContentConfig responseConfig = GenerateContentConfig.builder()
                        .temperature(0.1f)
                        .thinkingConfig(
                                ThinkingConfig.builder()
                                        .includeThoughts(false)
                                        .build()
                        )
                        .responseMimeType("application/json")
                        .responseSchema(Schema.fromJson(responseSchema))
                        .build();

                List<Content> contents = new ArrayList<>();

                UploadFileConfig fileConfig = UploadFileConfig.builder()
                                            .mimeType("text/csv")
                                            .build();

                File jobFile = client.files.upload(JOB_CSV_PATH, fileConfig);
                File cvFile = client.files.upload(CV_CSV_PATH, fileConfig);

                contents.add(Content.fromParts(Part.fromUri(jobFile.uri().get(), "text/csv")));
                contents.add(Content.fromParts(Part.fromUri(cvFile.uri().get(), "text/csv")));
                contents.add(Content.fromParts(Part.fromText(TOP_3_JOBS_PROMPT)));

                GenerateContentResponse res = client.models.generateContent(
                        "gemini-2.5-flash",
                        contents,
                        responseConfig
                );
                if (res == null || res.text() == null) throw new Exception("AI không trả về kết quả");

                List<MatchingDto> matchingDtos =  objectMapper.readValue(res.text(), new TypeReference<List<MatchingDto>>(){});

                Matching matching;
                Job findJob;
                CvDto cvDto = new CvDto();
                cvDto.setId(findCv.getId());
                for (MatchingDto matchingDto : matchingDtos){
                    findJob = jobRepository.findJobById(matchingDto.getJobDto().getId());
                    if (findJob != null) {
                        matching = new Matching();
                        matching.setJob(findJob);
                        matching.setScore(matchingDto.getScore());
                        matching.setCv(findCv);
                        matchingRepository.save(matching);
                        matchingDto.setCvDto(cvDto);
                        matchingDto.setId(findJob.getId());
                    }
                }
                matchingDtos.removeIf(find -> find.getId().isEmpty());

                response.setStatusCode(StatusCode.OK);
                response.setMessage(StatusCode.OK.getDescription());
                response.setMatchingDtos(matchingDtos);
            } else {
                response.setStatusCode(StatusCode.NO_CONTENT);
                response.setMessage(StatusCode.NO_CONTENT.getDescription() + " cho CV");
            }
        }catch (Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage(StatusCode.INTERNAL_SERVER_ERROR.getDescription() + " khi tìm top 3 jobs: " + e.getMessage());
        }
        return response;
    }
}
