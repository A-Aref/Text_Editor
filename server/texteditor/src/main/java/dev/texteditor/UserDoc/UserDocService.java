package dev.texteditor.UserDoc;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;


@Service
public class UserDocService {

    @Autowired
    private UserDocRepository userDocRepository;

    
    public List<UserDoc> getUserDocs(String userId){
        return userDocRepository.findByUserId(userId);
    }

    public List<UserDoc> getDocUsers(String docId){
        return userDocRepository.findByDocId(docId);
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    public void updateSharedAccess(String UserId, String DocId, String Role) {
        Criteria criteria = Criteria.where("userId").is(UserId).and("docId").is(DocId);
        Query query = new Query(criteria);
        Update update = new Update().set("role", Role);
        //mongoTemplate.updateFirst(query, update, UserDoc.class);
    }

}
