package com.examportal.controller;

import com.examportal.entity.User;
import com.examportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    // Cache to hold generated OTPs: Email (lowercase) -> OtpData
    private static class OtpData {
        String otp;
        long expiryTime;
        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
    private final Map<String, OtpData> otpCache = new ConcurrentHashMap<>();

    // Blacklist of disposable/dummy email domains
    private static final Set<String> DISPOSABLE_DOMAINS = Set.of(
        "mailinator.com", "yopmail.com", "tempmail.com", "dispostable.com", 
        "guerrillamail.com", "sharklasers.com", "10minutemail.com", "trashmail.com", 
        "getairmail.com", "temp-mail.org", "maildrop.cc", "example.com", "test.com", "dummy.com"
    );

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Allow logging in with either username OR email address
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(username);
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return ResponseEntity.ok(user);
            }
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email address is required"));
        }
        email = email.trim();

        // Validate basic email format
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid email format"));
        }

        // Validate email domain is not dummy/disposable
        String domain = email.substring(email.indexOf("@") + 1).toLowerCase().trim();
        if (DISPOSABLE_DOMAINS.contains(domain)) {
            return ResponseEntity.status(400).body(Map.of("message", "Dummy/disposable email addresses are not allowed. Please use a valid email."));
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Save to cache (valid for 5 minutes)
        long expiry = System.currentTimeMillis() + (5 * 60 * 1000);
        otpCache.put(email.toLowerCase(), new OtpData(otp, expiry));

        boolean emailSent = false;
        String message = "OTP generated successfully.";

        // Attempt to send email via SMTP if configured
        if (mailSender != null) {
            try {
                org.springframework.mail.SimpleMailMessage mailMessage = new org.springframework.mail.SimpleMailMessage();
                mailMessage.setTo(email);
                mailMessage.setSubject("National Engineering Exam Portal - Registration OTP");
                mailMessage.setText("Your One-Time Password (OTP) for registering on the National Engineering Exam Portal is: " + otp + "\n\nThis OTP is valid for 5 minutes.");
                mailSender.send(mailMessage);
                emailSent = true;
                message = "Verification OTP has been sent to your email address.";
            } catch (Exception e) {
                System.err.println("SMTP Error sending email: " + e.getMessage());
            }
        }

        // Simulating the email delivery if JavaMailSender is not fully setup in application.properties
        if (!emailSent) {
            System.out.println("\n========================================================");
            System.out.println("SIMULATED EMAIL SYSTEM (SMTP NOT CONFIGURED OR FAILED)");
            System.out.println("Sending OTP to: " + email);
            System.out.println("Verification Code: " + otp);
            System.out.println("========================================================\n");
            message = "Verification OTP generated. Check the server console.";
        }

        return ResponseEntity.ok(Map.of(
            "message", message,
            "simulated", !emailSent,
            "otp", otp // Included in response for seamless UI testing/mock simulation
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "Username is required"));
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "Password is required"));
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email is required"));
        }
        if (otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "OTP verification code is required"));
        }

        email = email.trim();
        otp = otp.trim();

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Username already exists"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Email address is already registered"));
        }

        // Verify OTP from cache
        OtpData storedOtpData = otpCache.get(email.toLowerCase());
        if (storedOtpData == null) {
            return ResponseEntity.status(400).body(Map.of("message", "No OTP requested for this email. Please request an OTP first."));
        }

        if (System.currentTimeMillis() > storedOtpData.expiryTime) {
            otpCache.remove(email.toLowerCase());
            return ResponseEntity.status(400).body(Map.of("message", "OTP has expired. Please request a new one."));
        }

        if (!storedOtpData.otp.equals(otp)) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid OTP. Please check the code and try again."));
        }

        // Clear OTP on successful verification
        otpCache.remove(email.toLowerCase());

        String role = payload.get("role");
        if (role == null || role.trim().isEmpty()) {
            role = "USER"; // Default to USER
        }

        String course = payload.get("course");

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setEmail(email);
        newUser.setRole(role.toUpperCase());
        newUser.setCourse(course);

        userRepository.save(newUser);
        return ResponseEntity.ok(newUser);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
