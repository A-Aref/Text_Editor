package dev.texteditor.Users;

import java.util.List;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UsersController {

  @Autowired
  private UsersService usersService;

    @GetMapping
    public ResponseEntity<List<Users>> getDocuments() {
		  return new ResponseEntity<List<Users>>(usersService.getAllUsers(), HttpStatus.OK);
	  }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Users>> getDocument(@PathVariable ObjectId id) {
		  return new ResponseEntity<Optional<Users>>(usersService.getUser(id), HttpStatus.OK);
	  }

    
}
