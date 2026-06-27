package com.examportal.controller;

import com.examportal.entity.EngineeringBranch;
import com.examportal.repository.EngineeringBranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    @Autowired
    private EngineeringBranchRepository branchRepository;

    @GetMapping
    public List<EngineeringBranch> getAllBranches() {
        return branchRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EngineeringBranch> getBranchById(@PathVariable Long id) {
        return branchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
