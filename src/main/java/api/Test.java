package api;

import javax.ws.rs.*;
import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.ServerAddress;
import com.mongodb.MongoCredential;
import com.mongodb.MongoClientOptions;
import services.MongoDB;


@Path("/")
public class Test{

    private static Test cartService = new Test();

    @Path("/test")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response testGet(@QueryParam("test") String test){


        MongoDB mongoDB = MongoDB.getConnection();
        mongoDB.getCollection();


        return Response.ok("Hello world " + test).build();
    }

}