package dev.texteditor.DataBaseControllers.UserDoc;


import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;




@Repository
public interface UserDocRepository extends MongoRepository<UserDoc,ObjectId> {
    
List<UserDoc> findByUserId(String userId);
List<UserDoc> findByDocId(String docId);
void deleteByDocId(String docId);
 
}
