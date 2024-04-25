package dev.texteditor.DataBaseControllers.Users;

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

    public void registerUser(String email,String name,String pass) {
        Users user = new Users();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(pass);
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

    public String getUserName(String email){
         
        Users user = usersRepository.findByEmail(email);
        return user.getName();
    }

   
}
    

