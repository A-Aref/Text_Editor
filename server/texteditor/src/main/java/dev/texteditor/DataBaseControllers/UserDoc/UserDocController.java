package dev.texteditor.DataBaseControllers.UserDoc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.texteditor.DataBaseControllers.Docs.Docs;
import dev.texteditor.DataBaseControllers.Docs.DocsRepository;
import dev.texteditor.DataBaseControllers.Docs.DocsService;

import org.bson.types.ObjectId;


@RestController
@CrossOrigin
@RequestMapping("/api/v1/userdoc")
public class UserDocController {

  @Autowired
  private UserDocService userDocService;
  
  @Autowired
  private DocsService docsService;

  @Autowired
  private UserDocRepository userDocRepository;
  
  @Autowired
  private DocsRepository docsRepository;


@SuppressWarnings("unused")
@PostMapping("/createDoc")
public ResponseEntity<Object> CreateDocument(@RequestBody Map<String,Object> Parameters)
{
  Docs newDoc = new Docs();
  newDoc.setDesc((String)Parameters.get("docDesc"));
  newDoc.setTitle((String)Parameters.get("docTitle"));
   
  ObjectId generatedId = new ObjectId();
  newDoc.setId(generatedId);
  newDoc.setDocId(generatedId.toString());
  
  Docs DocsRes= docsRepository.save(newDoc);
  if(DocsRes==null)
    return new ResponseEntity<Object>('1', HttpStatus.NOT_ACCEPTABLE);

  UserDoc newUserDocObjcet = new UserDoc();
  newUserDocObjcet.setUserId((String)Parameters.get("userId"));
  newUserDocObjcet.setRole("Owner");
  newUserDocObjcet.setDocId(generatedId.toString());
  UserDoc userDocRes = userDocRepository.save(newUserDocObjcet);
   

  if(userDocRes==null)
    return new ResponseEntity<Object>('1', HttpStatus.NOT_ACCEPTABLE);
  
  return new ResponseEntity<Object>('1', HttpStatus.OK);
 
}
  @GetMapping("/documents/{userId}")
  public ResponseEntity<List<DocViewInfo>> getDocuments(@PathVariable String userId) {
 
    List<UserDoc> UserDocInfo =userDocService.getUserDocs(userId);
    List<DocViewInfo> docViewInfo=new  ArrayList<>();
      
    for (UserDoc i: UserDocInfo)
    {
    Optional<Docs> doc=  docsService.getDoc(i.getDocId());
    Docs docObj=doc.orElse(new Docs());
    DocViewInfo newObj = new DocViewInfo(docObj.getTitle(),i.getRole(), docObj.getDesc(),i.getDocId());
    docViewInfo.add(newObj);
    }
    
    return new ResponseEntity<List<DocViewInfo>>(docViewInfo, HttpStatus.OK);

	}

  @GetMapping("/user")
  public ResponseEntity<List<UserDoc>> getUser(String docId) {
	  return new ResponseEntity<List<UserDoc>>(userDocService.getDocUsers(docId), HttpStatus.OK);
	}
    
  @PostMapping("/share")
  public ResponseEntity<Object> ShareDocument(@RequestBody Map<String,Object> payload) {
    @SuppressWarnings("unchecked")
    List<Map<String, String>> userRoles = (List<Map<String, String>>) payload.get("selectedRoles");
    String docId = (String)payload.get("docId");
    if(!userDocService.getDocUsers(docId).isEmpty()) {
      for (Map<String, String> userRole : userRoles) {
        String userId = userRole.get("userId");
        String role = userRole.get("role");
        userDocService.updateSharedAccess(userId, docId, role);
      }
      return new ResponseEntity<Object>('1', HttpStatus.OK);
    }
    return new ResponseEntity<Object>('1', HttpStatus.OK);
  }

}
