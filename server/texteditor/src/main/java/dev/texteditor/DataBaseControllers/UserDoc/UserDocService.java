package dev.texteditor.DataBaseControllers.UserDoc;

import java.util.List;

import org.bson.types.ObjectId;
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

    public void DeleteDocumentById(String docId) {
        userDocRepository.deleteByDocId(docId);
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    /* 2 --> owner , 1 --> update , 0 --> does not exists */
    public boolean checker(String UserID, String DocID) {
        List<UserDoc> doc = userDocRepository.findByDocId(DocID);
        for (int i = 0; i < doc.size(); i++) {
            String CurUser = doc.get(i).getUserId();
            if (UserID.equals(CurUser)) { return true; }
        }
        return false;
    }

    public void updateSharedAccess(String UserId, String DocId, String Role) {
        Criteria criteria = Criteria.where("userId").is(UserId).and("docId").is(DocId);
        Query query = new Query(criteria);
        Update update = new Update().set("role", Role);
        mongoTemplate.updateFirst(query, update, UserDoc.class);
    }

    public void createSharedAccess(String userId, String docId, String role) {
        ObjectId generatedId = new ObjectId();
        UserDoc userDoc = new UserDoc(generatedId, userId, docId, role);
        mongoTemplate.insert(userDoc);
    }

}
