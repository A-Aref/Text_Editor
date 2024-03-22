package dev.texteditor;

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

    private String desc;
    private String data;
    private String lastSave;
    private String name;
}