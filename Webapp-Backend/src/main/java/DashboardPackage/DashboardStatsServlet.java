package DashboardPackage;

import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet("/api/dashboard/stats")
public class DashboardStatsServlet extends HttpServlet {
    
    private DashboardDAO dashboardDAO = new DashboardDAO();
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Get user ID from request parameter
        String userIdParam = request.getParameter("userId");
        int userId = 0;
        
        try {
            userId = Integer.parseInt(userIdParam);
            System.out.println("Dashboard request for user: " + userId);
        } catch (NumberFormatException e) {
            response.sendError(400, "Invalid user ID");
            return;
        }
        
        try {
            // Get dashboard stats
            DashboardStats stats = dashboardDAO.getDashboardStats(userId);
            String jsonResponse = convertStatsToJson(stats);
            
            System.out.println("Sending dashboard data: " + jsonResponse);
            
            PrintWriter out = response.getWriter();
            out.print(jsonResponse);
            out.flush();
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "Database error: " + e.getMessage());
        }
    }
    
    private String convertStatsToJson(DashboardStats stats) {
        return String.format(
            "{\"totalDevices\":%d, \"onlineDevices\":%d, \"energyConsumption\":%.2f, " +
            "\"securityEvents\":%d, \"temperatureAvg\":%.1f, \"dailySavings\":%.2f}",
            stats.getTotalDevices(), 
            stats.getOnlineDevices(), 
            stats.getEnergyConsumption(),
            stats.getSecurityEvents(), 
            stats.getTemperatureAvg(), 
            stats.getDailySavings()
        );
    }
}