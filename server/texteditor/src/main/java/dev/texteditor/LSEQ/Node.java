package dev.texteditor.LSEQ;

import java.util.List;
import java.util.Map;

public class Node {

    private Map<String,Object> Data;
    private List<Node> Children;
    private int noChildren; 
    private List<Integer> id;
    private boolean boundary;
    private boolean delete = false;

    Node(List<Integer> Id,int noCh,Map<String,Object> data,boolean bound){
        id = Id;
        Data = data;
        boundary =bound;
        noChildren = noCh;
    }

    public void addChildren(Node A,int pos){
        Children.add(pos,A);
    }

    public List<Integer> getId(){
        return id;
    }

    public int getNoChildren(){
        return noChildren;
    }

    public void setDeleted(){
        delete = true;
    }

    public boolean getDeleted(){
        return delete;
    }

    public Node getNode(int pos){
        return Children.get(pos);
    }

}


