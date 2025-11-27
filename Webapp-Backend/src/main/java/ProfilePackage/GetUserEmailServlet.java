package ProfilePackage;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebServlet;
import java.io.*;
import java.sql.SQLException;

@WebServlet("/getUserEmail")
public class GetUserEmailServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private ProfileDAO profileDAO = new ProfileDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        response.setContentType("application/json");

        if (session == null || session.getAttribute("userId") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"Not logged in\"}");
            return;
        }

        int userId = (int) session.getAttribute("userId");

        try {
            String email = profileDAO.getUserEmail(userId);
            if (email == null) {
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Email not found\"}");
            } else {
                response.getWriter().write("{\"status\":\"success\",\"email\":\"" + email + "\"}");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
