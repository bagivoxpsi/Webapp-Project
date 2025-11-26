package DashboardPackage;

import java.sql.*;
import java.util.Random;

public class DashboardDAO {
    
    private Random random = new Random();
    private static final String URL = "jdbc:mysql://localhost:3306/smart_home";
    private static final String USER = "root";
    private static final String PASSWORD = "0000";
    
    private Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL driver not found", e);
        }
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
    
    // Check if user exists in users table
    public boolean userExists(int userId) throws SQLException {
        String sql = "SELECT id FROM users WHERE id = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            return rs.next();
        }
    }
    
    // Check if user has dashboard stats
    public boolean userHasStats(int userId) throws SQLException {
        String sql = "SELECT COUNT(*) as count FROM dashboard_stats WHERE user_id = ?";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("count") > 0;
            }
            return false;
        }
    }
    
    // Create random dashboard stats for existing user
    public void createDashboardStats(int userId) throws SQLException {
        System.out.println("Creating dashboard stats for user: " + userId);
        
        // Generate realistic random values
        int totalDevices = random.nextInt(8) + 3;  // 3-10 devices
        int onlineDevices = random.nextInt(totalDevices) + 1;  // At least 1 online
        double energyConsumption = 5 + (random.nextDouble() * 25);  // 5-30 kWh
        int securityEvents = random.nextInt(5);  // 0-4 events
        double temperatureAvg = 18 + (random.nextDouble() * 10);  // 18-28°C
        double dailySavings = 1 + (random.nextDouble() * 6);  // $1-7 savings
        
        String statsSql = "INSERT INTO dashboard_stats (user_id, total_devices, online_devices, energy_consumption, security_events, temperature_avg, daily_savings, stat_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(statsSql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, totalDevices);
            stmt.setInt(3, onlineDevices);
            stmt.setDouble(4, energyConsumption);
            stmt.setInt(5, securityEvents);
            stmt.setDouble(6, temperatureAvg);
            stmt.setDouble(7, dailySavings);
            stmt.setDate(8, new Date(System.currentTimeMillis()));
            stmt.executeUpdate();
            
            System.out.println("Created stats - Devices: " + totalDevices + ", Online: " + onlineDevices);
        }
    }
    
    // Get dashboard statistics for a user
    public DashboardStats getDashboardStats(int userId) throws SQLException {
        // First check if user exists
        if (!userExists(userId)) {
            System.out.println("User " + userId + " does not exist");
            return new DashboardStats();
        }
        
        // Check if user has stats, if not create them
        if (!userHasStats(userId)) {
            System.out.println("User " + userId + " has no dashboard stats");
            createDashboardStats(userId);
        }
        
        // Get the stats
        String sql = "SELECT total_devices, online_devices, energy_consumption, " +
                    "security_events, temperature_avg, daily_savings " +
                    "FROM dashboard_stats WHERE user_id = ? ORDER BY stat_date DESC LIMIT 1";
        
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                DashboardStats stats = new DashboardStats();
                stats.setTotalDevices(rs.getInt("total_devices"));
                stats.setOnlineDevices(rs.getInt("online_devices"));
                stats.setEnergyConsumption(rs.getDouble("energy_consumption"));
                stats.setSecurityEvents(rs.getInt("security_events"));
                stats.setTemperatureAvg(rs.getDouble("temperature_avg"));
                stats.setDailySavings(rs.getDouble("daily_savings"));
                
                System.out.println("Loaded stats for user " + userId);
                return stats;
            }
        }
        
        System.out.println("No stats found for user: " + userId);
        return new DashboardStats();
    }
}