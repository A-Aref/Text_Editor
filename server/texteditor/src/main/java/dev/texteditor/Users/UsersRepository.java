package dev.texteditor.Users;


import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;




@Repository
public interface UsersRepository extends MongoRepository<Users,ObjectId> {
    
Optional<Users> findByUserId(String userId);
}
