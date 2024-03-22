package dev.texteditor;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocsService {

    @Autowired
    private DocsRepository docsRepository;

    public Optional<Docs> getDoc(ObjectId id){
        if(id == null)
            return null;
        return docsRepository.findById(id);
    }

    public List<Docs> getAllDoc(){
        return docsRepository.findAll();
    }

}
