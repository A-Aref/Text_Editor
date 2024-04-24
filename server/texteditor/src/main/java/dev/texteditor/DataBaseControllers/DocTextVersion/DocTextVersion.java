package dev.texteditor.DataBaseControllers.DocTextVersion;
 

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Document(collection = "DocTextVersion")
@Data
@NoArgsConstructor
@Getter
public class DocTextVersion {
    @Id
    private ObjectId id;

    private String docId;
    private  Object  text; // Use List instead of Array
    private String editorEmail;
    private java.util.Date version;

    public DocTextVersion(ObjectId id, String docId, String editorEmail, Object  text,  java.util.Date date) {
        this.id = id;
        this.docId = docId;
        this.text = text;  
        this.editorEmail = editorEmail;
        this.version = date;
    }
}



 
     


 