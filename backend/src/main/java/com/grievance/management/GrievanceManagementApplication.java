package com.grievance.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class GrievanceManagementApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx =
                SpringApplication.run(GrievanceManagementApplication.class, args);

        Environment env = ctx.getEnvironment();
        String port    = env.getProperty("server.port", "2718");
        String profile = String.join(", ", env.getActiveProfiles().length > 0
                ? env.getActiveProfiles()
                : new String[]{"default"});

        String banner = "\n" +
            "╔══════════════════════════════════════════════════════════════╗\n" +
            "║      AI-Based Student Grievance Management System            ║\n" +
            "╠══════════════════════════════════════════════════════════════╣\n" +
            "║  [OK] Backend started SUCCESSFULLY                           ║\n" +
            "║                                                              ║\n" +
            "║  API Base URL  :  http://localhost:" + port + "/api               ║\n" +
            "║  Profile       :  " + padRight(profile, 42) + "║\n" +
            "║  AI Server     :  " + padRight(env.getProperty("ai.server.url", "http://localhost:8000"), 42) + "║\n" +
            "║                                                              ║\n" +
            "║  Frontend URL  :  http://localhost:2020                      ║\n" +
            "╚══════════════════════════════════════════════════════════════╝";

        System.out.println(banner);
    }

    private static String padRight(String s, int n) {
        if (s == null) s = "";
        if (s.length() >= n) return s.substring(0, n - 3) + "...";
        return s + " ".repeat(n - s.length());
    }
}
