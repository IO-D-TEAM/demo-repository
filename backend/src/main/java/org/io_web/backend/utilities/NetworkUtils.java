package org.io_web.backend.utilities;

import java.io.IOException;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Enumeration;

public class NetworkUtils {

    public static String createUrl(String gameCode) {
        try {
            Enumeration<NetworkInterface> networkInterfaces = NetworkInterface.getNetworkInterfaces();

            // Host could have lots of network interfaces
            while (networkInterfaces.hasMoreElements()) {
                NetworkInterface networkInterface = networkInterfaces.nextElement();
                Enumeration<InetAddress> inetAddresses = networkInterface.getInetAddresses();

                while (inetAddresses.hasMoreElements()) {
                    InetAddress inetAddress = inetAddresses.nextElement();
                    if (inetAddress instanceof Inet4Address) {
                        String ipAddress = inetAddress.getHostAddress();

                        String valid_url = "";

                        if (classifyIP(ipAddress)) {

                            String url = "http://" + ipAddress + ":8080/lobby/" + gameCode + "/join_game";
                            valid_url = url;

                            HttpRequest request = HttpRequest.newBuilder()
                                    .uri(URI.create(url))
                                    .method("GET", HttpRequest.BodyPublishers.noBody())
                                    .build();

                            try {
                                HttpResponse<String> response = HttpClient.newHttpClient().
                                        send(request, HttpResponse.BodyHandlers.ofString());
                                if (response.statusCode() == 200) {
                                    return "http://" + ipAddress + ":3000/userView/joinGame/" + gameCode;
                                }
                            } catch (IOException | InterruptedException e) {
                                return valid_url;
                            }

                        }
                    }
                }
            }
        } catch (IOException ignored) {
        }
        return null;
    }


    public static boolean classifyIP(String ipAddress) {
        String[] parts = ipAddress.split("\\.");
        int[] ipComponents = new int[4];

        for (int i = 0; i < 4; i++) {
            ipComponents[i] = Integer.parseInt(parts[i]);
        }

        if (ipComponents[0] == 127) {
            return false;
        }

        if (ipComponents[0] == 169 && ipComponents[1] == 254) {
            return false;
        }

        if (ipComponents[0] >= 224 && ipComponents[0] <= 239) {
            return false;
        }

        return ipComponents[0] != 255 || ipComponents[1] != 255 || ipComponents[2] != 255 || ipComponents[3] != 255;
    }
}

