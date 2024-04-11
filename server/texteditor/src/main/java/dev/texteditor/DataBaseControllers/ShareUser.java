package dev.texteditor.DataBaseControllers;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShareUser {

    private String name;
    private String role;
    private String email;
    
}
