package UserPackage;

import java.sql.*;

public class UserDAO {

    private static final String INSERT_USER =
        "INSERT INTO users (email, password, full_name, age) VALUES (?, ?, ?, ?)";
    
    private static final String SELECT_USER_BY_EMAIL =
        "SELECT * FROM users WHERE email = ?";
    
    private static final String SELECT_USER_BY_ID =
        "SELECT * FROM users WHERE id = ?";
    
    private static final String UPDATE_USER_PROFILE =
        "UPDATE users SET full_name = ?, age = ? WHERE id = ?";
    
    private static final String UPDATE_USER_EMAIL =
        "UPDATE users SET email = ? WHERE id = ?";
    
    private static final String UPDATE_USER_PASSWORD =
        "UPDATE users SET password = ? WHERE id = ?";
    
    private static final String CHECK_EMAIL_EXISTS =
        "SELECT COUNT(*) FROM users WHERE email = ? AND id != ?";
    
    private static final String DELETE_USER =
        "DELETE FROM users WHERE id = ?";
    
    private static final String URL = "jdbc:mysql://localhost:3306/smart_home";
    private static final String USER = "root";
    private static final String PASSWORD = "0000";

    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    public void registerUser(User user) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(INSERT_USER, Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, user.getEmail());
            stmt.setString(2, user.getPassword());
            stmt.setString(3, user.getFullName());
            stmt.setInt(4, user.getAge());

            stmt.executeUpdate();
            
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                user.setId(rs.getInt(1));
            }
        }
    }

    public User loginUser(String email, String password) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_USER_BY_EMAIL)) {

            stmt.setString(1, email);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String storedPassword = rs.getString("password");

                if (storedPassword.equals(password)) {
                    User user = new User();
                    user.setId(rs.getInt("id"));
                    user.setEmail(rs.getString("email"));
                    user.setFullName(rs.getString("full_name"));
                    user.setAge(rs.getInt("age"));
                    return user;
                }
            }
            return null;
        }
    }

    public User getUserById(int userId) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(SELECT_USER_BY_ID)) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setEmail(rs.getString("email"));
                user.setFullName(rs.getString("full_name"));
                user.setAge(rs.getInt("age"));
                return user;
            }
            return null;
        }
    }

    public boolean updateUserProfile(int userId, String fullName, int age) throws Exception {
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(UPDATE_USER_PROFILE)) {

            stmt.setString(1, fullName);
            stmt.setInt(2, age);
            stmt.setInt(3, userId);

            return stmt.executeUpdate() > 0;
        }
    }

    public boolean updateUserEmail(int userId, String newEmail) throws Exception {
        System.out.println("[v0] updateUserEmail called - userId: " + userId + ", newEmail: " + newEmail);
        
        try (Connection conn = getConnection()) {
            try (PreparedStatement checkStmt = conn.prepareStatement(CHECK_EMAIL_EXISTS)) {
                checkStmt.setString(1, newEmail);
                checkStmt.setInt(2, userId);
                ResultSet rs = checkStmt.executeQuery();

                if (rs.next() && rs.getInt(1) > 0) {
                    System.out.println("[v0] Email already exists, throwing exception");
                    throw new Exception("Email already exists");
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(UPDATE_USER_EMAIL)) {
                stmt.setString(1, newEmail);
                stmt.setInt(2, userId);

                int rowsAffected = stmt.executeUpdate();
                System.out.println("[v0] Email update - rows affected: " + rowsAffected);
                return rowsAffected > 0;
            }
        }
    }

    public boolean updateUserPassword(int userId, String oldPassword, String newPassword) throws Exception {
        System.out.println("[v0] updateUserPassword called - userId: " + userId);
        
        try (Connection conn = getConnection()) {
            try (PreparedStatement stmt = conn.prepareStatement(SELECT_USER_BY_ID)) {
                stmt.setInt(1, userId);
                ResultSet rs = stmt.executeQuery();

                if (rs.next()) {
                    String storedPassword = rs.getString("password");
                    System.out.println("[v0] Stored password: " + storedPassword + ", Old password provided: " + oldPassword);

                    if (!storedPassword.equals(oldPassword)) {
                        System.out.println("[v0] Password mismatch, throwing exception");
                        throw new Exception("Current password is incorrect");
                    }
                } else {
                    System.out.println("[v0] User not found");
                    throw new Exception("User not found");
                }
            }

            try (PreparedStatement stmt = conn.prepareStatement(UPDATE_USER_PASSWORD)) {
                stmt.setString(1, newPassword);
                stmt.setInt(2, userId);

                int rowsAffected = stmt.executeUpdate();
                System.out.println("[v0] Password update - rows affected: " + rowsAffected);
                return rowsAffected > 0;
            }
        }
    }
    
    public boolean deleteUser(int userId) {
        System.out.println("[v0] deleteUser called - userId: " + userId);
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(DELETE_USER)) {
            
            stmt.setInt(1, userId);
            int rowsAffected = stmt.executeUpdate();
            
            System.out.println("[v0] User deletion - rows affected: " + rowsAffected);
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            System.err.println("[v0] Error deleting user: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
