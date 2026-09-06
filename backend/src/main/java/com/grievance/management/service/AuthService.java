package com.grievance.management.service;

import com.grievance.management.dto.*;
import com.grievance.management.entity.*;
import com.grievance.management.enums.Role;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.*;
import com.grievance.management.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CollegeAdminRepository collegeAdminRepository;
    private final SuperAdminRepository superAdminRepository;
    private final CollegeRepository collegeRepository;
    private final DepartmentRepository departmentRepository;
    private final RegistrationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse login(LoginRequest request) {
        // Resolve the actual email if the user logged in with their college-issued ID
        String email = resolveEmail(request);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String jwtToken = jwtService.generateToken(user);
        return LoginResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .userId(user.getId())
                .build();
    }

    /**
     * Resolves the email address to use for authentication.
     * If {@code collegeId} is provided, looks it up as an enrollment number
     * (student) or employee ID (faculty) and returns the linked email.
     * Falls back to the {@code email} field if {@code collegeId} is blank.
     */
    private String resolveEmail(LoginRequest request) {
        String cid = request.getCollegeId();
        if (cid == null || cid.isBlank()) {
            return request.getEmail();
        }
        // Try student enrollment number first
        var studentOpt = studentRepository.findByEnrollmentNumber(cid);
        if (studentOpt.isPresent()) {
            return studentOpt.get().getUser().getEmail();
        }
        // Try faculty employee ID
        var facultyOpt = facultyRepository.findByEmployeeId(cid);
        if (facultyOpt.isPresent()) {
            return facultyOpt.get().getUser().getEmail();
        }
        throw new ResourceNotFoundException(
                "No account found for college ID: " + cid);
    }

    @Transactional
    public LoginResponse setupSuperAdmin(SuperAdminSetupRequest request) {
        if (superAdminRepository.count() > 0) {
            throw new IllegalStateException("Super admin already exists. Setup can only run once.");
        }
        User user = createUser(request.getEmail(), request.getPassword(),
                request.getFirstName(), request.getLastName(), Role.SUPER_ADMIN);
        SuperAdmin superAdmin = SuperAdmin.builder()
                .user(user)
                .phoneNumber(request.getPhoneNumber())
                .build();
        superAdminRepository.save(superAdmin);
        return buildLoginResponse(user);
    }

    @Transactional
    public LoginResponse registerStudent(StudentRegistrationRequest request) {
        // Students register openly — no token required
        User user = createUser(request.getEmail(), request.getPassword(),
                request.getFirstName(), request.getLastName(), Role.STUDENT);
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new ResourceNotFoundException("College not found"));
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Student student = Student.builder()
                .user(user)
                .enrollmentNumber(request.getEnrollmentNumber())
                .phoneNumber(request.getPhoneNumber())
                .college(college)
                .department(department)
                .year(request.getYear())
                .section(request.getSection())
                .build();
        studentRepository.save(student);
        return buildLoginResponse(user);
    }

    @Transactional
    public LoginResponse registerFaculty(FacultyRegistrationRequest request) {
        validateToken(request.getRegistrationToken(), Role.FACULTY);
        User user = createUser(request.getEmail(), request.getPassword(),
                request.getFirstName(), request.getLastName(), Role.FACULTY);
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new ResourceNotFoundException("College not found"));
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Faculty faculty = Faculty.builder()
                .user(user)
                .employeeId(request.getEmployeeId())
                .phoneNumber(request.getPhoneNumber())
                .college(college)
                .department(department)
                .designation(request.getDesignation())
                .build();
        facultyRepository.save(faculty);
        markTokenUsed(request.getRegistrationToken());
        return buildLoginResponse(user);
    }

    @Transactional
    public LoginResponse registerCollegeAdmin(AdminRegistrationRequest request) {
        validateToken(request.getRegistrationToken(), Role.COLLEGE_ADMIN);
        User user = createUser(request.getEmail(), request.getPassword(),
                request.getFirstName(), request.getLastName(), Role.COLLEGE_ADMIN);
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new ResourceNotFoundException("College not found"));
        CollegeAdmin admin = CollegeAdmin.builder()
                .user(user)
                .college(college)
                .phoneNumber(request.getPhoneNumber())
                .build();
        collegeAdminRepository.save(admin);
        markTokenUsed(request.getRegistrationToken());
        return buildLoginResponse(user);
    }

    private User createUser(String email, String password, String firstName, String lastName, Role role) {
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .enabled(true)
                .build();
        return userRepository.save(user);
    }

    private void validateToken(String tokenStr, Role role) {
        RegistrationToken token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid registration token"));
        if (token.isUsed()) throw new IllegalStateException("Token already used");
        if (token.getTargetRole() != role) throw new IllegalStateException("Token not valid for this role");
        if (token.getExpiresAt().isBefore(java.time.LocalDateTime.now()))
            throw new IllegalStateException("Token expired");
    }

    private void markTokenUsed(String tokenStr) {
        tokenRepository.findByToken(tokenStr).ifPresent(t -> {
            t.setUsed(true);
            t.setUsedAt(java.time.LocalDateTime.now());
            tokenRepository.save(t);
        });
    }

    private LoginResponse buildLoginResponse(User user) {
        String jwtToken = jwtService.generateToken(user);
        return LoginResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .userId(user.getId())
                .build();
    }
}
