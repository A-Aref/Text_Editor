package dev.texteditor.Docs;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Documents")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Docs {
    
    @Id
    private ObjectId id;

    private String docId;
    private String desc;
    private Object data;
    private String lastSave;
    private String Title;
}
