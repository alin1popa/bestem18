import org.apache.log4j.Logger;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import javax.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.net.URI;

class App{
    final static Logger log = Logger.getLogger(App.class);

    public static void main(String[] args) throws IOException {
        URI baseUri = UriBuilder.fromUri("http://10.81.118.7/").port(8888).build();
        ResourceConfig resourceConfig = new ResourceConfig(api.Test.class,
                api.Users.class);
        HttpServer server = GrizzlyHttpServerFactory.createHttpServer(baseUri, resourceConfig);
        server.start();

        System.out.println("Hello World");
        log.info("Hello world logged!");
    }

}