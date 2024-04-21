package dev.texteditor.DataBaseControllers;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.texteditor.DataBaseControllers.UserDoc.UserDoc;
import dev.texteditor.DataBaseControllers.UserDoc.UserDocService;
import dev.texteditor.DataBaseControllers.Users.Users;
import dev.texteditor.DataBaseControllers.Users.UsersService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/mixed")
@CrossOrigin
public class MixedController {

  @Autowired
  private UsersService usersService;

  @Autowired
  private UserDocService userDocService;

  @PostMapping("/getUsers")
  public ResponseEntity<List<ShareUser>> getUsers(@RequestBody Map<String,String> payload) {
    List<Users> listUsers = usersService.getAllUsers();
    List<UserDoc> listAccess = userDocService.getDocUsers(payload.get("docId"));
    Map<String,Integer> map = new HashMap<String,Integer>();
    List<ShareUser> listNew = new ArrayList<ShareUser>();

    for (Users i : listUsers) {
      ShareUser x = new ShareUser();
      x.setEmail(i.getEmail());
      x.setName(i.getName());
      x.setRole("none");
      map.put(i.getEmail(), listNew.size());
      listNew.add(x);
    }
    
    for (UserDoc i : listAccess) {
      ShareUser x = listNew.get(map.get(i.getUserId()));
      x.setRole(i.getRole());
      listNew.set(map.get(i.getUserId()),x);
    }

      return new ResponseEntity<List<ShareUser>>(listNew, HttpStatus.OK);
  }

    
}

