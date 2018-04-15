package services;

import java.util.List;

public class Trip {

    private String username;
    private String tripname;
    private List<TripLocation> trip;

    public String getTripname() {
        return tripname;
    }

    public void setTripname(String tripname) {
        this.tripname = tripname;
    }

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
