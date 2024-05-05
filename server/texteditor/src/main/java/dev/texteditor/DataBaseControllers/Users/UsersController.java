package dev.texteditor.DataBaseControllers.Users;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UsersController {

    private static final String SECRET_KEY = "o9szYIOq1rRMiouNhNvaq96lqUvCekxR";
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
    public ResponseEntity<String> registerUser(@RequestBody Map<String,String> payload) {
        try {
            boolean userExists = usersService.checkIfUserExists(payload.get("email"));
            if (userExists) { return new ResponseEntity<>("User with this email already exists", HttpStatus.OK); }
            usersService.registerUser(payload.get("email"),payload.get("name"),payload.get("pass"));
            return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error registering user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private SecretKey getSecretKey(String secretKey) throws Exception {
        byte[] decodeSecretKey = Base64.getDecoder().decode(secretKey);
        return new SecretKeySpec(decodeSecretKey, 0, decodeSecretKey.length, "AES");
    } 
    
    private String decrypt(String encryptedPassword) throws Exception {
        SecretKey secretKey = getSecretKey(SECRET_KEY);
        Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKey);
        return new String(cipher.doFinal(Base64.getDecoder().decode(encryptedPassword)));
    }

    @PostMapping("/login") // New endpoint for user login
    public ResponseEntity<String> loginUser(@RequestBody Map<String,String> payload) throws Exception {
        String EncryptedPass = payload.get("password");
        String decrypted = decrypt(EncryptedPass);
        try {
            boolean isValidCredentials = usersService.validateUserCredentials(payload.get("email"), decrypted);
            if (!isValidCredentials) {
                return new ResponseEntity<String>("Invalid email or password", HttpStatus.UNAUTHORIZED);
            }
            return new ResponseEntity<String>("Login successful", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>("Error logging in: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
