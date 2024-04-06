package dev.texteditor.Users;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    public Optional<Users> getUser(ObjectId id){
        if(id == null)
            return null;
        return usersRepository.findById(id);
    }

    public List<Users> getAllUsers(){
        return usersRepository.findAll();
    }

    public boolean checkIfUserExists(String email) 
    {
        return usersRepository.existsByEmail(email);
    }

    public void registerUser(Users user) {
        // Perform additional validation if needed
        if (user == null || user.getName() == null || user.getEmail() == null || user.getPassword() == null) 
        {
            throw new IllegalArgumentException("User data is incomplete");
        }
        
        // Check if user with the same email already exists
        if (usersRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        
        // Save the user to the repository
        usersRepository.save(user);
    }

    public boolean validateUserCredentials(String email, String password) {
        // Retrieve the user record from the database based on the provided email
        Users user = usersRepository.findByEmail(email);

        // If no user found with the provided email, return false
        if (user == null) {
            return false;
        }

        // Check if the password matches the password stored in the database
        return password.equals(user.getPassword());
    }
}
    

