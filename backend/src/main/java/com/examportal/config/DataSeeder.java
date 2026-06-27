package com.examportal.config;

import com.examportal.entity.EngineeringBranch;
import com.examportal.entity.Exam;
import com.examportal.entity.User;
import com.examportal.repository.EngineeringBranchRepository;
import com.examportal.repository.ExamRepository;
import com.examportal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, EngineeringBranchRepository branchRepository, ExamRepository examRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setRole("ADMIN");
                admin.setEmail("admin@examportal.com");
                userRepository.save(admin);

                User user = new User();
                user.setUsername("user");
                user.setPassword("user123");
                user.setRole("USER");
                user.setCourse("Computer Science and Engineering");
                user.setEmail("user@examportal.com");
                userRepository.save(user);

                // Seed some additional student users for analytics
                createSeededStudent(userRepository, "rahul", "pass123", "Mechanical Engineering");
                createSeededStudent(userRepository, "amit", "pass123", "Computer Science and Engineering");
                createSeededStudent(userRepository, "sneha", "pass123", "Electronics and Communication Engineering");
                createSeededStudent(userRepository, "priya", "pass123", "Civil Engineering");
                createSeededStudent(userRepository, "aniket", "pass123", "Computer Science and Engineering");
                createSeededStudent(userRepository, "vikram", "pass123", "Mechanical Engineering");
                createSeededStudent(userRepository, "deepa", "pass123", "Electrical and Electronics Engineering");
                createSeededStudent(userRepository, "arjun", "pass123", "Computer Science and Engineering");
            }

            if (branchRepository.count() == 0) {
                // Create Exams
                Exam gate = createExam("GATE", "IISc/IITs", "Recruitment to PSUs and gateway for M.Tech/Ph.D.", "Central/PSU");
                Exam ese = createExam("ESE / IES", "UPSC", "Recruitment to Group A & B posts in Central Govt.", "Central");
                Exam sscJe = createExam("SSC JE", "SSC", "Junior Engineers for CPWD, MES, BRO", "Central");
                Exam rrbJe = createExam("RRB JE", "RRB", "Junior Engineer in Indian Railways", "Central");
                Exam isro = createExam("ISRO ICRB", "ISRO", "Recruitment of Scientist/Engineer 'SC'", "Space/Research");
                Exam drdo = createExam("DRDO RAC", "DRDO", "Recruitment of Scientist 'B'", "Defence/Research");
                Exam barc = createExam("BARC OCES/DGFS", "BARC", "Scientific Officers recruitment", "Nuclear/Research");
                Exam afcat = createExam("AFCAT", "IAF", "Technical Branch in Indian Air Force", "Defence");
                Exam cds = createExam("CDS", "UPSC", "Entry into IMA, INA, AFA", "Defence");
                Exam armyTech = createExam("Army SSC/TGC", "Indian Army", "Direct entry for engineering graduates", "Defence");
                Exam navyTech = createExam("Navy SSC", "Indian Navy", "Direct entry into IT/Tech branches", "Defence");
                Exam aai = createExam("AAI ATC", "AAI", "Junior Executive (ATC, Airport Ops)", "Central/PSU");
                Exam cil = createExam("CIL MT", "Coal India Limited", "Management Trainee recruitment", "Central/PSU");
                Exam nic = createExam("NIC / NIELIT", "MeitY", "Scientist 'B', Scientific Assistant", "Central");
                
                examRepository.saveAll(Arrays.asList(gate, ese, sscJe, rrbJe, isro, drdo, barc, afcat, cds, armyTech, navyTech, aai, cil, nic));

                // Create Branches and map Exams
                EngineeringBranch cse = createBranch("Computer Science and Engineering", "CSE", "Focuses on computer programming and networking.");
                cse.getExams().addAll(Arrays.asList(gate, rrbJe, isro, drdo, barc, afcat, cds, armyTech, navyTech, aai, cil, nic));

                EngineeringBranch me = createBranch("Mechanical Engineering", "ME", "Applies engineering, physics, and materials science principles.");
                me.getExams().addAll(Arrays.asList(gate, ese, sscJe, rrbJe, isro, drdo, barc, afcat, cds, armyTech, navyTech, aai, cil));

                EngineeringBranch ce = createBranch("Civil Engineering", "CE", "Deals with the design, construction, and maintenance of the physical and naturally built environment.");
                ce.getExams().addAll(Arrays.asList(gate, ese, sscJe, rrbJe, isro, drdo, barc, cds, armyTech, aai, cil));

                EngineeringBranch eee = createBranch("Electrical and Electronics Engineering", "EEE", "Focuses on the practical applications of electricity.");
                eee.getExams().addAll(Arrays.asList(gate, ese, sscJe, rrbJe, isro, drdo, barc, afcat, cds, armyTech, aai, cil));

                EngineeringBranch ece = createBranch("Electronics and Communication Engineering", "ECE", "Deals with electronic devices and circuits.");
                ece.getExams().addAll(Arrays.asList(gate, ese, rrbJe, isro, drdo, barc, afcat, cds, armyTech, aai, nic));

                EngineeringBranch it = createBranch("Information Technology", "IT", "Study, design, development of computer-based information systems.");
                it.getExams().addAll(Arrays.asList(gate, rrbJe, afcat, cds, armyTech, navyTech, cil, nic));

                EngineeringBranch ae = createBranch("Aerospace Engineering", "AE", "Concerned with the development of aircraft and spacecraft.");
                ae.getExams().addAll(Arrays.asList(gate, isro, drdo, afcat, cds));

                EngineeringBranch che = createBranch("Chemical Engineering", "ChemE", "Involves the production and manufacturing of products through chemical processes.");
                che.getExams().addAll(Arrays.asList(gate, drdo, barc, cds));

                EngineeringBranch biotech = createBranch("Biotechnology Engineering", "Biotech", "Involves the use of living systems to develop products.");
                biotech.getExams().addAll(Arrays.asList(gate, cds));

                EngineeringBranch auto = createBranch("Automobile Engineering", "AutoE", "Design, manufacture and operation of vehicles.");
                auto.getExams().addAll(Arrays.asList(gate, isro, drdo, cds));

                EngineeringBranch mte = createBranch("Mechatronics Engineering", "MTE", "Integration of mechanical, electronic and electrical engineering systems.");
                mte.getExams().addAll(Arrays.asList(gate, cds));

                EngineeringBranch mete = createBranch("Metallurgical Engineering", "MetE", "Study of metals and their properties.");
                mete.getExams().addAll(Arrays.asList(gate, drdo, barc, cds));

                EngineeringBranch mine = createBranch("Mining Engineering", "MinE", "Extracting and processing minerals.");
                mine.getExams().addAll(Arrays.asList(gate, cil, cds));

                EngineeringBranch mare = createBranch("Marine Engineering", "MarE", "Engineering of boats, ships, oil rigs.");
                mare.getExams().addAll(Arrays.asList(gate, navyTech, cds));

                EngineeringBranch pe = createBranch("Petroleum Engineering", "PE", "Production of hydrocarbons.");
                pe.getExams().addAll(Arrays.asList(gate, cds));
                
                branchRepository.saveAll(Arrays.asList(cse, me, ce, eee, ece, it, ae, che, biotech, auto, mte, mete, mine, mare, pe));
            }
        };
    }

    private EngineeringBranch createBranch(String name, String shortName, String description) {
        EngineeringBranch branch = new EngineeringBranch();
        branch.setName(name);
        branch.setShortName(shortName);
        branch.setDescription(description);
        branch.setDurationInYears(4);
        return branch;
    }

    private Exam createExam(String name, String conductingBody, String purpose, String category) {
        Exam exam = new Exam();
        exam.setName(name);
        exam.setConductingBody(conductingBody);
        exam.setPurpose(purpose);
        exam.setCategory(category);
        return exam;
    }

    private void createSeededStudent(UserRepository userRepository, String username, String password, String course) {
        User student = new User();
        student.setUsername(username);
        student.setPassword(password);
        student.setRole("USER");
        student.setCourse(course);
        student.setEmail(username + "@gmail.com");
        userRepository.save(student);
    }
}
