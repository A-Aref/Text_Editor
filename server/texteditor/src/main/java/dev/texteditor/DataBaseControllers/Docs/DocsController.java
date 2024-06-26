package dev.texteditor.DataBaseControllers.Docs;

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

import dev.texteditor.DataBaseControllers.UserDoc.UserDocService;


@RestController
@CrossOrigin
@RequestMapping("/api/v1/docs")
public class DocsController {

  @Autowired
  private DocsService docsService;

    @Autowired
  private UserDocService userDocService;

    @GetMapping
    public ResponseEntity<List<Docs>> getDocuments() {
		  return new ResponseEntity<List<Docs>>(docsService.getAllDoc(), HttpStatus.OK);
	  }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Docs>> getDocument(@PathVariable String id) {
		  return new ResponseEntity<Optional<Docs>>(docsService.getDoc(id), HttpStatus.OK);
	  }

    @GetMapping("/title/{id}")
    public ResponseEntity<Object> getTitle(@PathVariable String id) {
		  return new ResponseEntity<Object>(docsService.getTitle(id), HttpStatus.OK);
	  }

    @PostMapping("/data")
    public ResponseEntity<Object> getDocData(@RequestBody Map<String,Object> payload) {
      Docs d;
      if(docsService.getDoc((String)payload.get("docId")).isPresent())
      {
        d = docsService.getDoc((String)payload.get("docId")).get();
      }
      else
      {
        return null;
      }
      
		  return new ResponseEntity<Object>(d, HttpStatus.OK);
	  }

    @PostMapping("/rename")
    public ResponseEntity<Object> RenameDocument(@RequestBody Map<String,Object> payload) {
      String docId = (String) payload.get("docId");
      String title = (String) payload.get("Title");
      if(!docsService.getDoc(docId).isPresent()) {
       return ResponseEntity.badRequest().body("Document is not Found");
      }
      if (title == "") {
        return ResponseEntity.badRequest().body("Title cannot be Empty");
      }
      docsService.updateDocumentName(docId, title);
      return new ResponseEntity<Object>('1', HttpStatus.OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<Object> DeleteTheDocument(@RequestBody Map<String,Object> payload) {
      String docId = (String) payload.get("docId");
      if (!docsService.getDoc(docId).isPresent()) {
        return ResponseEntity.badRequest().body("Document is not Found");
      }
      docsService.DeleteDocumentById(docId);
      userDocService.DeleteDocumentById(docId);
      return new ResponseEntity<Object>('1', HttpStatus.OK);
    }
    

    public Object getDocDataBack(String id) {
      if(id != null)
      {
        return docsService.getDoc(id).get().getData();
      }
      else
      {
        return null;
      }
	  }

    public void setDocData(String id,Object Data) {
      if(id != null)
      {
        docsService.setDoc(id,Data);
      }
      else
      {
        return;
      }
	  }
    
}
