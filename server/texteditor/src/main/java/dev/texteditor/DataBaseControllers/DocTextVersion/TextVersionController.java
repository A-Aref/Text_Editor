package dev.texteditor.DataBaseControllers.DocTextVersion;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.texteditor.DataBaseControllers.Users.UsersService;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/docHistory")
@CrossOrigin
public class TextVersionController {

    @Autowired
    private DocTextVersionRepository docTextVersionRepository;
 
    @Autowired
    private UsersService usersService;

    @PostMapping("/saveDoc")
    public ResponseEntity<Object> saveDocument(@RequestBody Map<String, Object> parameters) {
            DocTextVersion savedDoc = new DocTextVersion(
                    new ObjectId(),
                    (String) parameters.get("docId"),
                    (String) parameters.get("currentUserEmail"),
                   (Object) parameters.get("text") ,
                   (Object) parameters.get("text_Object") ,
                    new Date()   
            );
            // Save the document
            docTextVersionRepository.save(savedDoc);
            return new ResponseEntity<>("Document saved successfully", HttpStatus.OK);
    }
  
    @GetMapping("/{docId}")
    public ResponseEntity<List<ViewDocText>> getHistory(@PathVariable String docId) {
        // try {
            Optional<List<DocTextVersion>> 
            docHistoryOptional=docTextVersionRepository.findByDocId(docId);
            List<ViewDocText> viewDoc= new ArrayList<>();
            if(docHistoryOptional.isEmpty())
            {
                return new ResponseEntity<List<ViewDocText>>(viewDoc, HttpStatus.OK);
            }
            else
            {
                List<DocTextVersion> docHistory = docHistoryOptional.get();
                 // Sort the array by time
                 for (int i = 0; i < docHistory.size() - 1; i++) {
                    for (int j = i + 1; j < docHistory.size(); j++) {
                        DocTextVersion version1 = docHistory.get(i);
                        DocTextVersion version2 = docHistory.get(j);
                        // Compare the docHistory in descending order
                        if (version1.getVersion().compareTo(version2.getVersion()) < 0) {
                            // Swap if version1 < version2
                            docHistory.set(i, version2);
                            docHistory.set(j, version1);
                        }
                    }
                }
                for (DocTextVersion doc : docHistory ) {
                    String userName=usersService.getUserName(doc.getEditorEmail());                    
                    // Convert java.util.Date to java.time.LocalDateTime
                    LocalDateTime localDateTime = LocalDateTime.ofInstant( doc.getVersion().toInstant(), ZoneId.systemDefault());
                    // Define the desired format pattern
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd HH:mm");
                    // Format the LocalDateTime object into the desired format
                    String formattedDateTime = localDateTime.format(formatter);
                    ViewDocText version = new ViewDocText(userName,doc.getText(), formattedDateTime);
                    viewDoc.add(version);
                }
                return new ResponseEntity<List<ViewDocText>>(viewDoc, HttpStatus.OK);
            } 
    }
}
 

    

    
