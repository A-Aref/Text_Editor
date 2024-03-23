package dev.texteditor.Docs;

import java.util.List;
import java.util.Map;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<Optional<Docs>> getDocument(@PathVariable String id) {
		  return new ResponseEntity<Optional<Docs>>(docsService.getDoc(id), HttpStatus.OK);
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
		  return new ResponseEntity<Object>(d.getData(), HttpStatus.OK);
	  }
    
}
