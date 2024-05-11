package dev.texteditor.DataBaseControllers.DocTextVersion;

 
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Document(collection = "DocTextVersion")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewDocText {
    
    private String id;
    private String editor;
    private Object text;
    private String version;
}
 