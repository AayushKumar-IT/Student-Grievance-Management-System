package com.grievance.management.config;

import com.grievance.management.entity.College;
import com.grievance.management.entity.Department;
import com.grievance.management.repository.CollegeRepository;
import com.grievance.management.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Inserts initial colleges and departments into the database.
 *
 * The data is inserted only when the corresponding college does not
 * already exist, so restarting the application will not create duplicates.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CollegeRepository collegeRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) {

        /*
         * ============================================================
         * COLLEGE 1
         * ============================================================
         */
        College abes = createCollege(
                "ABES Engineering College",
                "ABES",
                "19th KM Stone, NH-24",
                "Ghaziabad",
                "Uttar Pradesh",
                "info@abes.ac.in",
                "01207131000"
        );

        addDepartments(abes, List.of(
                new String[]{"Computer Science and Engineering", "CSE"},
                new String[]{"Information Technology", "IT"},
                new String[]{"Artificial Intelligence and Machine Learning", "AIML"},
                new String[]{"Data Science", "DS"},
                new String[]{"Electronics and Communication Engineering", "ECE"},
                new String[]{"Electrical and Electronics Engineering", "EEE"},
                new String[]{"Mechanical Engineering", "ME"}
        ));

        /*
         * ============================================================
         * COLLEGE 2
         * ============================================================
         */
        College kiet = createCollege(
                "KIET Group of Institutions",
                "KIET",
                "13-Km Stone, Ghaziabad-Meerut Road",
                "Ghaziabad",
                "Uttar Pradesh",
                "info@kiet.edu",
                "01232275000"
        );

        addDepartments(kiet, List.of(
                new String[]{"Computer Science and Engineering", "CSE"},
                new String[]{"Information Technology", "IT"},
                new String[]{"Artificial Intelligence and Machine Learning", "AIML"},
                new String[]{"Computer Science and Information Technology", "CSIT"},
                new String[]{"Electronics and Communication Engineering", "ECE"},
                new String[]{"Electrical and Electronics Engineering", "EEE"},
                new String[]{"Mechanical Engineering", "ME"}
        ));

        /*
         * ============================================================
         * COLLEGE 3
         * ============================================================
         */
        College glbitm = createCollege(
                "GL Bajaj Institute of Technology and Management",
                "GLBITM",
                "Plot No. 2, APJ Abdul Kalam Road",
                "Greater Noida",
                "Uttar Pradesh",
                "info@glbitm.org",
                "01202406000"
        );

        addDepartments(glbitm, List.of(
                new String[]{"Computer Science and Engineering", "CSE"},
                new String[]{"Information Technology", "IT"},
                new String[]{"Artificial Intelligence and Machine Learning", "AIML"},
                new String[]{"Artificial Intelligence and Data Science", "AIDS"},
                new String[]{"Electronics and Communication Engineering", "ECE"},
                new String[]{"Electrical Engineering", "EE"},
                new String[]{"Mechanical Engineering", "ME"}
        ));

        /*
         * ============================================================
         * COLLEGE 4
         * ============================================================
         */
        College niet = createCollege(
                "Noida Institute of Engineering and Technology",
                "NIET",
                "19 KM Stone, Knowledge Park-II",
                "Greater Noida",
                "Uttar Pradesh",
                "info@niet.co.in",
                "01202326100"
        );

        addDepartments(niet, List.of(
                new String[]{"Computer Science and Engineering", "CSE"},
                new String[]{"Information Technology", "IT"},
                new String[]{"Artificial Intelligence and Machine Learning", "AIML"},
                new String[]{"Data Science", "DS"},
                new String[]{"Electronics and Communication Engineering", "ECE"},
                new String[]{"Electrical Engineering", "EE"},
                new String[]{"Mechanical Engineering", "ME"}
        ));

        /*
         * ============================================================
         * COLLEGE 5
         * ============================================================
         */
        College galgotias = createCollege(
                "Galgotias University",
                "GU",
                "Plot No. 2, Yamuna Expressway",
                "Greater Noida",
                "Uttar Pradesh",
                "admissions@galgotiasuniversity.edu.in",
                "01207106000"
        );

        addDepartments(galgotias, List.of(
                new String[]{"Computer Science and Engineering", "CSE"},
                new String[]{"Information Technology", "IT"},
                new String[]{"Artificial Intelligence", "AI"},
                new String[]{"Data Science", "DS"},
                new String[]{"Electronics and Communication Engineering", "ECE"},
                new String[]{"Electrical Engineering", "EE"},
                new String[]{"Mechanical Engineering", "ME"},
                new String[]{"Civil Engineering", "CE"}
        ));

        System.out.println("==============================================");
        System.out.println("College and Department data initialization done.");
        System.out.println("Total colleges: " + collegeRepository.count());
        System.out.println("Total departments: " + departmentRepository.count());
        System.out.println("==============================================");
    }

    /**
     * Creates a college only if it does not already exist.
     */
    private College createCollege(
            String name,
            String code,
            String address,
            String city,
            String state,
            String email,
            String phoneNumber) {

        return collegeRepository.findByCode(code)
                .orElseGet(() -> {

                    College college = College.builder()
                            .name(name)
                            .code(code)
                            .address(address)
                            .city(city)
                            .state(state)
                            .email(email)
                            .phoneNumber(phoneNumber)
                            .build();

                    return collegeRepository.save(college);
                });
    }

    /**
     * Adds departments to a college.
     *
     * Existing departments are not duplicated.
     */
    private void addDepartments(
            College college,
            List<String[]> departmentData) {

        for (String[] data : departmentData) {

            String departmentName = data[0];
            String departmentCode = data[1];

            if (!departmentRepository
                    .existsByCollegeIdAndCode(college.getId(), departmentCode)) {

                Department department = Department.builder()
                        .name(departmentName)
                        .code(departmentCode)
                        .college(college)
                        .build();

                departmentRepository.save(department);
            }
        }
    }
}