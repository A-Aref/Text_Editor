package dev.texteditor.UserDoc;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
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

    public List<UserDoc> getUserDoc(String userId,String docId){
        return userDocRepository.findByDocIdRepo(docId).findByUserId(userId);
    }


}
