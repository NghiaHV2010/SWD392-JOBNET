package swd.jobnet.enums;

import lombok.Getter;
import lombok.Setter;

@Getter
public enum StatusCode {
    // Success Status Codes
    OK(200, "Thành công, có dữ liệu trả về"),
    CREATED(201, "Tạo mới thành công (ví dụ: tạo user, blog, v.v.)"),
    ACCEPTED(202, "Đã nhận request nhưng chưa xử lý xong"),
    NO_CONTENT(204, "Thành công nhưng không có dữ liệu trả về"),

    // Error Status Codes
    BAD_REQUEST(400, "Yêu cầu không hợp lệ"),
    UNAUTHORIZED(401, "Chưa xác thực hoặc token sai"),
    FORBIDDEN(403, "Không có quyền truy cập"),
    NOT_FOUND(404, "Không tìm thấy tài nguyên"),
    METHOD_NOT_ALLOWED(405, "Phương thức không được hỗ trợ"),
    REQUEST_TIMEOUT(408, "Hết thời gian chờ"),
    CONFLICT(409, "Xung đột dữ liệu"),
    PAYLOAD_TOO_LARGE(413, "File hoặc dữ liệu quá lớn"),
    UNSUPPORTED_MEDIA_TYPE(415, "Loại dữ liệu không được hỗ trợ"),
    UNPROCESSABLE_ENTITY(422, "Không thể xử lý dữ liệu (thường là validation)"),
    TOO_MANY_REQUESTS(429, "Quá nhiều yêu cầu trong thời gian ngắn"),

    INTERNAL_SERVER_ERROR(500, "Lỗi server nội bộ"),
    NOT_IMPLEMENTED(501, "Server chưa hỗ trợ chức năng này"),
    BAD_GATEWAY(502, "Gateway nhận phản hồi không hợp lệ"),
    SERVICE_UNAVAILABLE(503, "Dịch vụ không khả dụng"),
    GATEWAY_TIMEOUT(504, "Gateway hết thời gian chờ");

    private final int code;
    private final String description;

    StatusCode(int code, String description) {
        this.code = code;
        this.description = description;
    }

    /**
     * Find StatusCode by code
     * @param code the HTTP status code
     * @return StatusCode enum or null if not found
     */
    public static StatusCode fromCode(int code) {
        for (StatusCode status : StatusCode.values()) {
            if (status.code == code) {
                return status;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return code + " - " + description;
    }
}
