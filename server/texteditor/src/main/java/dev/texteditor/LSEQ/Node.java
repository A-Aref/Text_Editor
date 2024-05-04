package dev.texteditor.LSEQ;

import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;
import java.util.UUID;

public class Node {

    //{"Char": " " , "bold": false , "itlaic": false } 
    private Map<String,Object> Data;
    private Node[] Children;
    SortedSet<Integer> childrenPos = new TreeSet<Integer>();
    private int noChildren; 
    private String uuid;
    private List<Integer> id;
    private boolean delete = false;

    Node(List<Integer> Id,int noCh,Map<String,Object> data) {
        id = Id;
        Data = data;
        noChildren = noCh;
        uuid = UUID.randomUUID().toString();
        Children = new Node[noCh];
    }

    public void addChild(int pos, Node A) {
        Children[pos]=A;
        childrenPos.add(pos);
    }

    public List<Integer> getId() {
        return id;
    }

    public void setId(List<Integer> Id) {
        id = Id;
    }

    public String getUUID() {
        return uuid;
    }

    public void setUUID(String id) {
        uuid = id;
    }

    public int getNoChildren() {
        return noChildren;
    }

    public void setDeleted() {
        delete = true;
    }

    public void setData(Map<String,Object> data) {
        Data = data;
    }

    public Map<String,Object> getData() {
        return Data;
    }

    public boolean getDeleted() {
        return delete;
    }

    public Node getChild(int pos) {
        return Children[pos];
    }

    public SortedSet<Integer> getChildren() {
        return childrenPos;
    }

}


