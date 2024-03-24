package dev.texteditor.Users;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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


}
