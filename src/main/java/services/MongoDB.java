package services;

import com.google.gson.Gson;
import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import static com.mongodb.client.model.Filters.*;

import com.mongodb.util.JSON;
import org.bson.Document;

import javax.print.Doc;
import java.util.*;

public class MongoDB {

    private static MongoDB connection;
    private MongoClient mongoClient;
    MongoDatabase dataBase;



    private MongoDB() {

        mongoClient = new MongoClient();
        dataBase = mongoClient.getDatabase("bestem");

    }

    public static MongoDB getConnection() {

        if (connection == null) {
            connection = new MongoDB();
        }

        return connection;

    }

    public void getCollection() {

        MongoCollection<Document> collection = dataBase.getCollection("users");
        System.out.println("Collection myCollection selected successfully");
        FindIterable<Document> cursor = collection.find();

        collection.updateOne(Filters.eq("username", "radu"), Updates.set("username", "radubest"));
        System.out.println("Document update successfully...");

        // Getting the iterator
        Iterator it = cursor.iterator();

        while (it.hasNext()) {
            Document doc = (Document) it.next();
            System.out.println(doc.get("username"));
        }

    }

    public List<Document> getTripForUser(String username) {

        MongoCollection<Document> collection = dataBase.getCollection("trips");

        FindIterable<Document> cursor = collection.find(eq("username",username));
        Iterator it = cursor.iterator();
        List<Document> trips = new ArrayList<>();

        while(it.hasNext()) {
            Document doc = (Document) it.next();
            trips.add(doc);
            System.out.println(doc);
        }

        return trips;
    }

    public void addTripForUser(Trip trip) {

        Gson gson = new Gson();
        String json = gson.toJson(trip);

        MongoCollection<Document> dbCollection = dataBase.getCollection("trips");
        dbCollection.insertOne(Document.parse(json));
    }


//    public void addCityForTrip(String username, TripLocation city) {
//
//        Gson gson = new Gson();
//        String json = gson.toJson(city);
//
//        MongoCollection<Document> collection = dataBase.getCollection("trips");
//
//        FindIterable<Document> cursor = collection.find(eq("username" ,username ));
//
//    }
}
