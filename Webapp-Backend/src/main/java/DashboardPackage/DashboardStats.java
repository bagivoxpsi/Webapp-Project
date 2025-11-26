package DashboardPackage;

public class DashboardStats {
    private int totalDevices;
    private int onlineDevices;
    private double energyConsumption;
    private int securityEvents;
    private double temperatureAvg;
    private double dailySavings;
    
    // Constructors
    public DashboardStats() {}
    
    public DashboardStats(int totalDevices, int onlineDevices, double energyConsumption, 
                         int securityEvents, double temperatureAvg, double dailySavings) {
        this.totalDevices = totalDevices;
        this.onlineDevices = onlineDevices;
        this.energyConsumption = energyConsumption;
        this.securityEvents = securityEvents;
        this.temperatureAvg = temperatureAvg;
        this.dailySavings = dailySavings;
    }
    
    // Getters and setters
    public int getTotalDevices() { return totalDevices; }
    public void setTotalDevices(int totalDevices) { this.totalDevices = totalDevices; }
    
    public int getOnlineDevices() { return onlineDevices; }
    public void setOnlineDevices(int onlineDevices) { this.onlineDevices = onlineDevices; }
    
    public double getEnergyConsumption() { return energyConsumption; }
    public void setEnergyConsumption(double energyConsumption) { this.energyConsumption = energyConsumption; }
    
    public int getSecurityEvents() { return securityEvents; }
    public void setSecurityEvents(int securityEvents) { this.securityEvents = securityEvents; }
    
    public double getTemperatureAvg() { return temperatureAvg; }
    public void setTemperatureAvg(double temperatureAvg) { this.temperatureAvg = temperatureAvg; }
    
    public double getDailySavings() { return dailySavings; }
    public void setDailySavings(double dailySavings) { this.dailySavings = dailySavings; }
}