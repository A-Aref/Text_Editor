package dev.texteditor.DataBaseControllers.Docs;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;



@Service
public class DocsService {

    @Autowired
    private DocsRepository docsRepository;

    public Optional<Docs> getDoc(String id){
        if(id == null)
            return null;
        return docsRepository.findByDocId(id);
    }

    public String getTitle(String id){
        if(id == null)
            return null;
        Docs doc = docsRepository.findByDocId(id).get();
        return doc.getTitle();
    }

    public List<Docs> getAllDoc(){
        return docsRepository.findAll();
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    public void updateDocumentName(String id, String newValue) {
        Query query = new Query(Criteria.where("docId").is(id));
        Update update = new Update().set("Title", newValue);
        mongoTemplate.updateFirst(query, update, Docs.class);
    }


    public void DeleteDocumentById(String docId) {
        docsRepository.deleteByDocId(docId);
    }
}
