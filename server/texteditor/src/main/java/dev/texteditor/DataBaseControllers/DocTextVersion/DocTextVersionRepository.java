package dev.texteditor.DataBaseControllers.DocTextVersion;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocTextVersionRepository extends MongoRepository<DocTextVersion,ObjectId> {
    @SuppressWarnings({ "null", "unchecked" })
    DocTextVersion save(DocTextVersion document);
    Optional<List<DocTextVersion>> findByDocId(String docId);
 
}
  

 
