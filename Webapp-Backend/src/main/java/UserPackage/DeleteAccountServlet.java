package UserPackage;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/deleteAccount")
public class DeleteAccountServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    private ProfileDAO userDAO = new ProfileDAO();

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

  
            boolean deleted = userDAO.deleteUser(userId);

            if (deleted) {

                session.invalidate();
                
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write("{\"status\":\"success\",\"message\":\"Account deleted successfully\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Failed to delete account\"}");
            }

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
