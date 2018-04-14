package api;

import services.CustomException;
import services.MongoDB;
import services.MySQL;
import services.User;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.List;

@Path("/")
public class Users {


    @Path("/signup")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response signup(User user) throws IOException {

        try {
            MySQL.getInstance().signUp(user);
            return Response.ok("Signup succesfully").build();
        } catch (CustomException e) {
            return Response.status(e.getCode(), e.getMessage()).build();
        }

    }

    @Path("/login")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@QueryParam("username") String username, @QueryParam("password") String password) throws IOException {

        try {
            MySQL.getInstance().logIn(username, password);
            return Response.ok("Login succesfully").build();
        } catch (CustomException e) {
            return Response.status(e.getCode(), e.getMessage()).build();
        }

    }

    @Path("/friendship")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response addFriendship(@QueryParam("f1") String username1, @QueryParam("f2") String username2) {

        try {
            MySQL.getInstance().addFriendShip(username1, username2);
            return Response.ok("Friendship added succesfully").build();
        } catch (CustomException e) {
            return Response.status(e.getCode(), e.getMessage()).build();
        }


    }

    //Get friends of a user
    @Path("/friends")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFriends(@QueryParam("username") String username) {

        return Response.ok().build();

    }

    @Path("/trips")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response tripForUser(@QueryParam("username") String username) {

        List trips = MongoDB.getConnection().getTripForUser(username);
        return Response.ok(trips).build();

    }
}
