package dev.texteditor.Docs;

import java.util.List;
import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocsService {

    @Autowired
    private DocsRepository docsRepository;

    public Optional<Docs> getDoc(String id){
        if(id == null)
            return null;
        return docsRepository.findByDocId(id);
    }

    public List<Docs> getAllDoc(){
        return docsRepository.findAll();
    }


}
