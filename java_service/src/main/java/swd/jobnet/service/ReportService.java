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
import swd.jobnet.dto.MatchingDto;
import swd.jobnet.dto.Report;
import swd.jobnet.dto.Response;
import swd.jobnet.enums.JobTags;
import swd.jobnet.enums.StatusCode;
import swd.jobnet.model.Job;
import swd.jobnet.repository.JobRepository;
import swd.jobnet.util.CsvExporter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ReportService {

    @Autowired
    private JobRepository jobRepository;

    @Value("${csv.path.it.job}")
    private String JOB_CSV_PATH;

    private final String responseSchema = """
        {
          "type": "object",
          "properties": {
            "jobInfoList": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "jobName": {
                    "type": "string"
                  },
                  "numberOfJobs": {
                    "type": "integer"
                  },
                  "averageSalary": {
                    "type": "number"
                  }
                },
                "required": [
                  "jobName",
                  "numberOfJobs",
                  "averageSalary"
                ],
                "propertyOrdering": [
                  "jobName",
                  "numberOfJobs",
                  "averageSalary"
                ]
              }
            },
            "predictedGrowth": {
              "type": "number"
            },
            "averageITSalary": {
              "type": "number"
            }
          },
          "required": [
            "jobInfoList",
            "predictedGrowth",
            "averageITSalary"
          ],
          "propertyOrdering": [
            "jobInfoList",
            "predictedGrowth",
            "averageITSalary"
          ]
        }
      """;

    @Value("${GEMINI_API_KEY}")
    private String GEMINI_API_KEY;

    private final String prompt = "Base on the IT jobs' title and salary in the file, categorize and return me" +
            " the job names (Front-end Developer, Back-end Developer, Full-stack Developer)" +
            " and its average salary per month in USD currency. " +
            "Moreover, return me your prediction about IT jobs' growth for the last 4 month of 2025 in double format and" +
            " average salary per month for all IT jobs";

    public Response getReport(){
        Response response = new Response();
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT)
                    .enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT)
                    .findAndRegisterModules()
                    .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
            String frontEndTags = JobTags.FRONTEND.getJobTag();
            String backEndTags = JobTags.BACKEND.getJobTag();
            String fullStackTags = JobTags.FULLSTACK.getJobTag();

            List<Object[]> frontEndJobs = jobRepository.findByDescriptionOrTitleWith(frontEndTags);
            List<Object[]> backEndJobs = jobRepository.findByDescriptionOrTitleWith(backEndTags);
            List<Object[]> fullStackJobs = jobRepository.findByDescriptionOrTitleWith(fullStackTags);

            List<Object[]> allJobs = Stream.of(frontEndJobs, backEndJobs, fullStackJobs)
                                    .flatMap(Collection::stream)
                                    .toList();

            String jobsJson = objectMapper.writeValueAsString(allJobs);
            CsvExporter.readJsonWriteCsvWithoutHeader(jobsJson, JOB_CSV_PATH);

            List<Content> contents = new ArrayList<>();
            Client client = Client.builder().apiKey(GEMINI_API_KEY).build();
            GenerateContentConfig contentConfig = GenerateContentConfig.builder()
                    .temperature(0f)
                    .thinkingConfig(
                            ThinkingConfig.builder()
                                    .includeThoughts(false)
                                    .build()
                    )
                    .responseMimeType("application/json")
                    .responseSchema(Schema.fromJson(responseSchema))
                    .build();
            UploadFileConfig fileConfig = UploadFileConfig.builder()
                    .mimeType("text/csv")
                    .build();

            File jobFile = client.files.upload(JOB_CSV_PATH, fileConfig);
            contents.add(Content.fromParts(Part.fromUri(jobFile.uri().get(), "text/csv")));
            contents.add(Content.fromParts(Part.fromText(prompt)));
            GenerateContentResponse aiResponse = client.models.generateContent(
                    "gemini-2.5-flash",
                    contents,
                    contentConfig
            );
            if (aiResponse == null || aiResponse.text() == null) throw new Exception("AI không trả về kết quả");

            Report report = objectMapper.readValue(aiResponse.text(), new TypeReference<Report>(){});

            report.setTotalITJobs(allJobs.size());

            response.setReport(report);
            response.setStatusCode(StatusCode.OK);
            response.setMessage(StatusCode.OK.getDescription());
        }catch(Exception e){
            response.setStatusCode(StatusCode.INTERNAL_SERVER_ERROR);
            response.setMessage( StatusCode.INTERNAL_SERVER_ERROR.getDescription() +" khi lấy report: " + e.getMessage());
        }
        return response;
    }
}
