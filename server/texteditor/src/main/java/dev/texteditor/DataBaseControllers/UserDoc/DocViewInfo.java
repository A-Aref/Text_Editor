package dev.texteditor.DataBaseControllers.UserDoc;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DocViewInfo {
    @JsonProperty("Title")
    private String Title;

    @JsonProperty("Role")
    private String Role;

    @JsonProperty("Desc")
    private String Desc;

    @JsonProperty("docId")
    private String docId;

    public DocViewInfo(String Tit, String Rol, String Des, String docI) {
         Title = Tit;
         Role = Rol;
         Desc = Des;
         docId = docI;
    }
     

}
