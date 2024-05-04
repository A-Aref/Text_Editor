package dev.texteditor.LSEQ;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class CRDT {

    private static final int width = 32;
    private static final int BOUNDARY = 10;
    private Map<Integer, Boolean> depthMap = new HashMap<>();
    private Node  Start = new Node(null, width, null);
    private Node  Begin;
    private Node  End;

    public CRDT() {
        List<Integer> id1 = new ArrayList<>();
        id1.add(0);
        Begin = new Node(id1, width*2, null);
        List<Integer> id2 = new ArrayList<>();
        id2.add(width-1);
        End = new Node(id2, width*2, null);
        Start.addChild(0, Begin);
        Start.addChild(width-1, End);
    }
    
    private Node addNode(Node P,Node Q,Map<String,Object> data) {
        List<Integer> id = allocate(P,Q);
        List<Integer> Copyid = new ArrayList<>(id);
        @SuppressWarnings("unchecked")
        Node newNode = new Node(id,width*(int)Math.pow(2,id.size()),(Map<String,Object>)data.get("data"));
        if(data.get("uuid") != null)
            newNode.setUUID(data.get("uuid").toString());
        int pos = Copyid.remove(Copyid.size()-1);
        Node current = getNode(Copyid);
        if(current.getChild(pos) == null)
            current.addChild(pos,newNode);
        else {
            int flag = (UUID.fromString(current.getChild(pos).getUUID())).compareTo(UUID.fromString(newNode.getUUID()));
            switch (flag) {
                case 1:
                    addNode(current.getChild(pos), Q, data);
                    break;
                case -1:
                    addNode(P, current.getChild(pos), data);
                    break;
                case 0:
                    break;
            }
        }
        
        return newNode;
    }

    private void deleteNode(Node delete) {
        Node current = getNode(delete.getId());
        current.setDeleted();
    }

    private Node getNode(List<Integer> id) {
        Node current = Start;
        for (int index = 0; index < id.size(); index++) {
            if(current.getChild(id.get(index)) != null)
            {
                current = current.getChild(id.get(index));
            }
            else
            {
                List<Integer> tempId = new ArrayList<>();
                for (int i = 0; i < index+1; i++) {
                    tempId.add(id.get(i));
                }
                Node newNode = new Node(tempId,width*(int)Math.pow(2,tempId.size()),null);
                current.addChild(id.get(index), newNode);
                current = current.getChild(id.get(index));
            }
        }
        return current;
    }

    public List<Map<String,Object>> traverseTree_node() {
        List<Node> Nodes = new ArrayList<>();
        List<Map<String,Object>> Data = new ArrayList<>();
        traverseTree(Start,Nodes);
        for (Node node : Nodes) {
            Map<String,Object> tempM = new HashMap<>();
            tempM.put("data",node.getData());
            tempM.put("uuid",node.getUUID());
            Data.add(tempM);  
        }
        return Data;
    }

    public List<Map<String,Object>> traverseTree_data() {
        List<Node> Nodes = new ArrayList<>();
        List<Map<String,Object>> Data = new ArrayList<>();
        traverseTree(Start,Nodes);
        for (Node node : Nodes) {
            Data.add(node.getData());  
        }
        return Data;
    }

    private  void traverseTree(Node NodeS,List<Node> Nodes) {
        
        for (Integer child : NodeS.getChildren()) {
            if(NodeS.getChild(child).getData() != null && !NodeS.getChild(child).getDeleted())
                Nodes.add(NodeS.getChild(child));
            traverseTree(NodeS.getChild(child),Nodes);
        }
    }

    private List<Integer> allocate(Node p, Node q) {
        int depth = 0;
        int interval = -1;
        int sumP = 0, sumQ = 0;
        
        while (interval < 1) {
            depth++;
            int[] P = prefix(p.getId(), depth);
            int[] Q = prefix(q.getId(), depth);
            for (int index = 0; index < depth; index++) {
                sumP = P[index];
                sumQ = Q[index];
                if(sumQ == 0 && interval == 0)
                {
                    sumQ = width*(int)Math.pow(2, index);
                }
            }
            interval = sumQ - sumP - 1;
        }

        int step = Math.min(BOUNDARY, interval);
        //int step = interval;

        if (!depthMap.containsKey(depth)) {
            boolean rand = Math.random() < 0.5;
            depthMap.put(depth, rand);
        }

        if (depthMap.get(depth)) {
            int addVal = (int) (Math.random() * step) + 1;  
            int value = sumP + addVal;
            List<Integer> values = new ArrayList<>();
            int[] P = prefix(p.getId(), depth);
            for (int index = 0; index < depth-1; index++) {
                values.add(P[index]);
            }
            values.add(value);
            return values;
        } else {
            int subVal = (int) (Math.random() * step) + 1;
            int value = sumQ - subVal;
            List<Integer> values = new ArrayList<>();
            int[] P = prefix(p.getId(), depth);
            for (int index = 0; index < depth-1; index++) {
                values.add(P[index]);
            }
            values.add(value);
            return values;
        }
    }

    private int[] prefix(List<Integer> id, int depth) {
        int[] idCopy = new int[depth];
        for (int cpt = 1; cpt <= depth; cpt++) {
            if (cpt < id.size()+1) {
                idCopy[cpt - 1] = id.get(cpt - 1);
            } else {
                idCopy[cpt - 1] = 0;
            }
        }
        return idCopy;
    }

    private void searchTree_Id(Node NodeS,String id,Map<String,Object> map,Node[] S) {
        for (Integer child : NodeS.getChildren()) {
            if(NodeS.getChild(child).getData() != null && !NodeS.getChild(child).getDeleted())
            {
                if(!(Boolean)map.get("flag")) {
                    S[1] = NodeS.getChild(child);
                    return;
                }
                if(NodeS.getChild(child).getUUID().equals(id))
                {
                    S[0] = NodeS.getChild(child);
                    map.put("flag",false);
                }
            }
            searchTree_Id(NodeS.getChild(child),id,map,S);
        }
    }
    
    private void searchTree(Node NodeS,int index,Map<String,Object> map,Node[] S) {
        for (Integer child : NodeS.getChildren()) {
            if(NodeS.getChild(child).getData() != null && !NodeS.getChild(child).getDeleted())
            {
                if(!(Boolean)map.get("flag")) {
                    S[1] = NodeS.getChild(child);
                    return;
                }
                if((Integer)map.get("counter") == index)
                {
                    S[0] = NodeS.getChild(child);
                    map.put("flag",false);
                }
                map.put("counter", (Integer)map.get("counter")+1);
            }
            searchTree(NodeS.getChild(child),index,map,S);
        }
    }

    public Node[] getRelativeIndex(int index) {
        Node[] S = new Node[2];
        S[0] = Begin;
        S[1] = End;
        Map<String,Object> test = new HashMap<>();
        test.put("flag", true);
        test.put("counter", 0);
        if(index == -1) {
            searchTree(Start, 0,test, S);
            if(S[1] != End || S[0] != Begin)
            {
                S[1] = S[0];
                S[0] = Begin;
            } 
        }
        else
        {
            searchTree(Start, index,test, S);
        }
        
        return S;
    }

    public Node[] getRelativeIndex_Id(String id) {
        Node[] S = new Node[2];
        S[0] = Begin;
        S[1] = End;
        Map<String,Object> test = new HashMap<>();
        test.put("flag", true);
        if(id.equals( "-1")) {
            test.put("counter", 0);
            searchTree(Start, 0,test, S);
            if(S[1] != End || S[0] != Begin)
            {
                S[1] = S[0];
                S[0] = Begin;
            } 
        }
        else
        {
            searchTree_Id(Start, id,test, S);
        }
        
        return S;
    }

    public Node[] addNode(int index,Map<String,Object> data) {
        Node[] S = getRelativeIndex(index);
        Node curr = addNode(S[0],S[1],data);
        Node[] temp = new Node[2];
        temp[0] = S[0];
        temp[1] = curr;
        return temp;
    }

    public Node[] addNode_Id(String id,Map<String,Object> data) {
        Node[] S = getRelativeIndex_Id(id);
        Node curr = addNode(S[0],S[1],data);
        Node[] temp = new Node[2];
        temp[0] = S[0];
        temp[1] = curr;
        return temp;
    }

    public Node deleteNode(int index) {
        Node[] S = getRelativeIndex(index);
        deleteNode(S[0]);
        return S[0];
    }

    public Node deleteNode_Id(String id) {
        Node[] S = getRelativeIndex_Id(id);
        deleteNode(S[0]);
        return S[0];
    }

    public Node update(int index,Map<String,Object> data) {
        Node[] S = getRelativeIndex(index);
        S[0].setData(data);
        return S[0];
    }

    public Node update_Id(String id,Map<String,Object> data) {
        Node[] S = getRelativeIndex_Id(id);
        S[0].setData(data);
        return S[0];
    }
    
    // public static void main(String[] args) {
    //     CRDT Struct = new CRDT();
    //     Map<String,Object> item = new HashMap<>();
    //     item.put("char","a");
    //     Map<String,Object> Mitem = new HashMap<>();
    //     Mitem.put("data",item);
    //     Mitem.put("uuid",null);
    //     for (int index = -1; index < 10000; index++) {
    //         Node a = Struct.addNode(index, Mitem)[1];
    //         System.out.println(a.getId());
    //     }
        
    // }
}
