package dev.texteditor;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/docs")
public class DocsController {

  @Autowired
  private DocsService docsService;

    @GetMapping
    public ResponseEntity<List<Docs>> getDocuments() {
		  return new ResponseEntity<List<Docs>>(docsService.getAllDoc(), HttpStatus.OK);
	  }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Docs>> getDocument(@PathVariable ObjectId id) {
		  return new ResponseEntity<Optional<Docs>>(docsService.getDoc(id), HttpStatus.OK);
	  }

    @GetMapping("/data")
    public ResponseEntity<String> getDocData(ObjectId id) {
      Docs d;
      if(docsService.getDoc(id).isPresent())
      {
        d = docsService.getDoc(id).get();
      }
      else
      {
        return null;
      }
		  return new ResponseEntity<String>(d.getData(), HttpStatus.OK);
	  }
    
}
