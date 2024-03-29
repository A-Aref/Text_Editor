package dev.texteditor.UserDoc;

import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin
@RequestMapping("/api/v1/userdoc")
public class UserDocController {

  @Autowired
  private UserDocService userDocService;

  @GetMapping("document")
  public ResponseEntity<List<UserDoc>> getDocuments(String userId) {
	  return new ResponseEntity<List<UserDoc>>(userDocService.getUserDocs(userId), HttpStatus.OK);
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
