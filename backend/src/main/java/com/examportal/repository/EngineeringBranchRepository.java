package com.examportal.repository;

import com.examportal.entity.EngineeringBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EngineeringBranchRepository extends JpaRepository<EngineeringBranch, Long> {
}
