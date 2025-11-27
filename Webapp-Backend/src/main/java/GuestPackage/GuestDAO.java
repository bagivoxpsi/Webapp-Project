package GuestPackage;

import java.sql.*;
import java.util.*;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GuestDAO {

    private static final String INSERT_GUEST =
        "INSERT INTO guests (user_id, guest_email) VALUES (?, ?)";
    
    private static final String SELECT_GUESTS_BY_USER =
        "SELECT * FROM guests WHERE user_id = ?";
    
    private static final String DELETE_GUEST =
        "DELETE FROM guests WHERE guest_id = ?";
    
    private static final String EDIT_GUEST_EMAIL =
        "UPDATE guests SET guest_email = ? WHERE guest_id = ?";
    
    private static final String URL = "jdbc:mysql://localhost:3306/smart_home";
    private static final String USER = "root";
    private static final String PASSWORD = "0000"; // replace with your DB password

    private Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL driver not found in Tomcat/lib", e);
        }
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    // Save a guest
    public void saveGuest(Guest guest) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(INSERT_GUEST, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setInt(1, guest.getUserId());
            stmt.setString(2, guest.getGuestEmail());

            stmt.executeUpdate();

            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                guest.setGuestId(rs.getInt(1));
            }
        }
    }

    // Get all guests for a user
    public List<Guest> getGuestsByUser(int userId) throws Exception {
        List<Guest> guests = new ArrayList<>();

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_GUESTS_BY_USER)) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Guest guest = new Guest();
                guest.setGuestId(rs.getInt("guest_id"));
                guest.setUserId(rs.getInt("user_id"));
                guest.setGuestEmail(rs.getString("guest_email"));

                guests.add(guest);
            }
        }
        return guests;
    }

    // Edit a guest email by guest_id
    public boolean editGuestEmail(int guestId, String newEmail) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(EDIT_GUEST_EMAIL)) {

            stmt.setString(1, newEmail);
            stmt.setInt(2, guestId);

            return stmt.executeUpdate() > 0;
        }
    }
    
    public boolean editGuest(Guest guest) throws Exception {
        String sql = "UPDATE guests SET guest_email = ? WHERE guest_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, guest.getGuestEmail());
            stmt.setInt(2, guest.getGuestId());

            return stmt.executeUpdate() > 0; // returns true if a row was updated
        }
    }


    // Delete a guest by guest_id
    public boolean deleteGuest(int guestId) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(DELETE_GUEST)) {

            stmt.setInt(1, guestId);
            return stmt.executeUpdate() > 0;
        }
    }

}
