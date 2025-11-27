package GuestPackage;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebServlet("/addGuest")
public class AddGuestServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private GuestDAO guestDAO = new GuestDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> data = mapper.readValue(request.getInputStream(), Map.class);

        int userId = (int) data.get("userId");
        String guestEmail = (String) data.get("guestEmail");

        try {
            Guest guest = new Guest();
            guest.setUserId(userId);
            guest.setGuestEmail(guestEmail);
            guestDAO.saveGuest(guest);

            response.getWriter().write("{\"status\":\"success\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
