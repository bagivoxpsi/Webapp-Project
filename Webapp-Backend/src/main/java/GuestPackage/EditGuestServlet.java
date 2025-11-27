package GuestPackage;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@WebServlet("/editGuest")
public class EditGuestServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private GuestDAO guestDAO = new GuestDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        ObjectMapper mapper = new ObjectMapper();

        try {
            // Parse JSON body
            Map<String, Object> data = mapper.readValue(request.getInputStream(), Map.class);

            // Ensure proper number conversion
            Number guestIdNum = (Number) data.get("guestId");
            if (guestIdNum == null) {
                throw new IllegalArgumentException("guestId is required");
            }
            int guestId = guestIdNum.intValue();

            String guestEmail = (String) data.get("guestEmail");
            if (guestEmail == null || guestEmail.trim().isEmpty()) {
                throw new IllegalArgumentException("guestEmail cannot be empty");
            }

            // Update guest
            Guest guest = new Guest();
            guest.setGuestId(guestId);
            guest.setGuestEmail(guestEmail.trim());

            boolean updated = guestDAO.editGuest(guest);
            if (updated) {
                response.getWriter().write("{\"status\":\"success\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"status\":\"error\",\"message\":\"Guest not found or not updated\"}");
            }

        } catch (Exception e) {
            e.printStackTrace(); // logs the full stack trace in Tomcat logs
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}
