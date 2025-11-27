package GuestPackage;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/deleteGuest")
public class DeleteGuestServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private GuestDAO guestDAO = new GuestDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        int guestId = Integer.parseInt(request.getParameter("guestId"));

        try {
            boolean success = guestDAO.deleteGuest(guestId);
            response.getWriter().write("{\"status\":\"" + (success ? "success" : "error") + "\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
