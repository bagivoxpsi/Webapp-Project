package ProfilePackage;

import java.sql.*;

public class ProfileDAO {
    
    private static final String UPDATE_USER_PROFILE =
        "UPDATE users SET full_name = ? WHERE id = ?";
    
    private static final String GET_USER_EMAIL =
    		"SELECT email FROM users WHERE id = ?";
    
    private static final String URL = "jdbc:mysql://localhost:3306/smart_home";
    private static final String USER = "root";
    private static final String PASSWORD = "0000";

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public boolean updateFullName(int userId, String fullName) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(UPDATE_USER_PROFILE)) {

            stmt.setString(1, fullName);
            stmt.setInt(2, userId);

            return stmt.executeUpdate() > 0;
        }
    }
    
    public String getUserEmail(int userId) throws SQLException {
        String email = null;
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(GET_USER_EMAIL)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                email = rs.getString("email");
            }
        }
        return email;
    }

}
