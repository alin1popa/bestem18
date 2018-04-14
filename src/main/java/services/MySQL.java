package services;

import com.mysql.jdbc.StringUtils;
import org.glassfish.jersey.internal.inject.Custom;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class MySQL {

    private static final String DATABASE_DRIVER = "com.mysql.jdbc.Driver";
    private static final String DATABASE_URL = "jdbc:mysql://localhost:3306/bestem";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "radu123";

    private static MySQL instance;
    private Connection connection;
    private Properties properties;


    private Properties getProperties() {
        if (properties == null) {
            properties = new Properties();
            properties.setProperty("user", USERNAME);
            properties.setProperty("password", PASSWORD);
        }
        return properties;
    }

    private MySQL() {

        try {
            Class.forName(DATABASE_DRIVER);
            connection = DriverManager.getConnection(DATABASE_URL, getProperties());
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();

        }
    }

    public static MySQL getInstance() {

        if (instance == null) {
            instance = new MySQL();
        }

        return instance;
    }

    private static String getHashCodeFromString(String str) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-512");
                md.update(str.getBytes());
        byte byteData[] = md.digest();

        //convert the byte to hex format method 1
        StringBuffer hashCodeBuffer = new StringBuffer();
        for (int i = 0; i < byteData.length; i++) {
            hashCodeBuffer.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
        }
        return hashCodeBuffer.toString();
    }

    public void logIn(String username, String password) {

        String pass_hash;

        if (username == null || !username.matches("[A-Za-z0-9_]+")) {
            CustomException e = new CustomException("Invalid username", 400);
            throw e;
        }

        if (password == null) {
            CustomException e = new CustomException("Invalid password", 400);
            throw e;
        }

        try {
            pass_hash = getHashCodeFromString(password);
        } catch (NoSuchAlgorithmException e) {
            CustomException ce = new CustomException("No such algorithm", 500);
            throw ce;
        }

        String sql = "SELECT * from users where username = ?";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, username);

            ResultSet resultSet = statement.executeQuery();
            if (!resultSet.next()) {
                CustomException e = new CustomException("Bad request", 400);
                throw e;
            }

            if (!resultSet.getString("password").equals(pass_hash)) {
                CustomException e = new CustomException("Passwords dont match", 400);
                throw e;
            }

        } catch (SQLException e) {
            CustomException ce = new CustomException("Database exception", 500);
            throw ce;
        }

    }

    public void signUp(User user) {

        String pass_hash;
        if (user.getUsername() == null || user.getPassword() == null ||
                    user.getFirst_name() == null || user.getLast_name() == null ||
                    user.getEmail() == null || !user.getUsername().matches("[A-Za-z0-9_]+")) {
            CustomException e = new CustomException("Bad request", 400);
            throw e;
        }

        if (userExist(user)) {
            CustomException e = new CustomException("User exist", 400);
            throw e;
        }

        try {
            pass_hash = getHashCodeFromString(user.getPassword());
        } catch (NoSuchAlgorithmException e) {
            CustomException ce = new CustomException("No such algorithm", 500);
            throw ce;
        }

        String sql = "INSERT into users(username, password, email, last_name, first_name) values(?,?,?,?,?)";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, user.getUsername());
            statement.setString(2, pass_hash);
            statement.setString(3, user.getEmail());
            statement.setString(4, user.getLast_name());
            statement.setString(5, user.getFirst_name());

            statement.executeUpdate();

        } catch (SQLException e) {
            CustomException ce = new CustomException("Database exception", 500);
            throw ce;
        }

    }

    private boolean userExist(User user) {

        String sql = "SELECT * from users where username = ? or email = ?";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, user.getUsername());
            statement.setString(2, user.getEmail());
            ResultSet resultSet = statement.executeQuery();
            if (resultSet.next()) {
                return true;
            }

            return false;

        } catch (SQLException e) {
            CustomException ce = new CustomException("Database exception", 500);
            throw ce;
        }
    }

    public void addFriendShip(String username1, String username2) {

        if ( username1 == null || username2 == null || !username1.matches("[A-Za-z0-9_]+") ||
                !username2.matches("[A-Za-z0-9_]+")) {
            CustomException e = new CustomException("Username invalid", 400);
            throw e;

        }
        if (!userExist(username1) || !userExist(username2)) {
            CustomException e = new CustomException("User not found", 400);
            throw e;
        }

        String sql = "INSERT into friendships(user1, user2) values(?,?)";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, username1);
            statement.setString(2, username2);

            statement.executeUpdate();

        } catch (SQLException e) {
            CustomException ce = new CustomException("Database exception", 500);
            throw ce;
        }

    }

    private boolean userExist(String username) {

        String sql = "SELECT * from users where username = ?";
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, username);
            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {
                return true;
            }

            return false;

        } catch (SQLException e) {
            CustomException ce = new CustomException("Database exception", 500);
            throw ce;
        }

    }

    public List<String> getFriends(String username) {

        if (username == null || !username.matches("[A-Za-z0-9_]+")) {
            CustomException e = new CustomException("Invalid username", 400);
            throw e;
        }

        if (!userExist(username) ) {
            CustomException e = new CustomException("User not found", 400);
            throw e;
        }

        String sql = "SELECT * from friendships where user1 = ?";

        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, username);

            List<String> friends = new ArrayList<>();
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                friends.add(resultSet.getString("user2"));
            }

            return friends;

        } catch (SQLException e) {
            CustomException ce = new CustomException("Database exception", 500);
            throw ce;
        }

    }
}
