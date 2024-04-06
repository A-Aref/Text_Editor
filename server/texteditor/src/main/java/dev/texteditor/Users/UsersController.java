package dev.texteditor.Users;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UsersController {

    @Autowired
    private UsersService usersService;

    @GetMapping
    public ResponseEntity<List<Users>> getDocuments() {
        return new ResponseEntity<List<Users>>(usersService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Users>> getDocument(@PathVariable ObjectId id) {
        return new ResponseEntity<Optional<Users>>(usersService.getUser(id), HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user) {
        try {
            boolean userExists = usersService.checkIfUserExists(user.getEmail());
            if (userExists) {
                return new ResponseEntity<>("User with this email already exists", HttpStatus.BAD_REQUEST);
            }

            usersService.registerUser(user);

            return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error registering user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login") // New endpoint for user login
    public ResponseEntity<String> loginUser(@RequestBody Users user) {
        try {
            boolean isValidCredentials = usersService.validateUserCredentials(user.getEmail(), user.getPassword());
            if (!isValidCredentials) {
                return new ResponseEntity<>("Invalid email or password", HttpStatus.UNAUTHORIZED);
            }

            // If credentials are valid, return success message or token
            // You can generate and return a JWT token for authenticated users

            return new ResponseEntity<>("Login successful", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error logging in: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
