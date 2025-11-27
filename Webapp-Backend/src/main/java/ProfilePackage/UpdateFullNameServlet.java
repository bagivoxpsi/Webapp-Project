package ProfilePackage;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

@WebServlet("/update-fullname")
public class UpdateFullNameServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    private ProfileDAO profileDAO = new ProfileDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        response.setContentType("application/json");

        try {
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Not authenticated\"}");
                return;
            }

            int userId = (int) session.getAttribute("userId");

            Map<String, Object> profileData = mapper.readValue(request.getReader(), Map.class);
            String fullName = (String) profileData.get("fullName");
            
            if (fullName == null || fullName.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Full name is required\"}");
                return;
            }

            boolean updated = profileDAO.updateFullName(userId, fullName);

            if (updated) {
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"status\":\"success\",\"message\":\"Profile updated successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Failed to update profile\"}");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}