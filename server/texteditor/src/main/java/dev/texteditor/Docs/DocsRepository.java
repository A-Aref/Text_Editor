package dev.texteditor.Docs;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;



@Repository
public interface DocsRepository extends MongoRepository<Docs,ObjectId> {
    
    Optional<Docs> findByDocId(String docId);

}
