package services;

import java.util.List;

public class Trip {

    private String username;
    private List<TripLocation> trip;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<TripLocation> getTrip() {
        return trip;
    }

    public void setTrip(List<TripLocation> trip) {
        this.trip = trip;
    }

}
