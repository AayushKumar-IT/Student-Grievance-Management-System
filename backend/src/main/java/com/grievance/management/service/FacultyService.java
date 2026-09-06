package com.grievance.management.service;

import com.grievance.management.entity.Faculty;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.FacultyRepository;
import com.grievance.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Faculty getFacultyById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
    }

    public List<Faculty> getFacultyByCollege(Long collegeId) {
        return facultyRepository.findByCollegeId(collegeId);
    }

    public Faculty getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return facultyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty profile not found"));
    }

    public Faculty toggleResolverStatus(Long id, boolean isResolver) {
        Faculty faculty = getFacultyById(id);
        faculty.setGrievanceResolver(isResolver);
        return facultyRepository.save(faculty);
    }
}
