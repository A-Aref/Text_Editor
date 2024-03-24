package dev.texteditor.UserDoc;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/userdoc")
@CrossOrigin
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
    
}
