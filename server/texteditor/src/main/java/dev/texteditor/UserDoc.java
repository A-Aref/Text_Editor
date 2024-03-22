package dev.texteditor;


import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Users_Docs")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDoc {
    
    @Id
    private ObjectId id;

    private String role;
    @DocumentReference
    private String doc;
    @DocumentReference
    private String user;
}

