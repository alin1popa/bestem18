package services;

import com.mongodb.DBCursor;
import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import static com.mongodb.client.model.Filters.*;
import org.bson.Document;

import javax.print.Doc;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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

        MongoCollection<Document> collection = dataBase.getCollection("users");
        List<String> a = new ArrayList<>();
        a.add("radu123");
        a.add("radu125");
        a.add("radubest");

        FindIterable<Document> cursor = collection.find(in("username",a));
        Iterator it = cursor.iterator();
        List<Document> trips = new ArrayList<>();

        while(it.hasNext()) {
            Document doc = (Document) it.next();
            trips.add(doc);
            System.out.println(doc);
        }

        return trips;
    }


}
