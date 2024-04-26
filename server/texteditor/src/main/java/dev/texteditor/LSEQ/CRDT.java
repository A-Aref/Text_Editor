package dev.texteditor.LSEQ;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CRDT {

    private static final int width = 32;
    private static final int BOUNDARY = 10;
    private Map<Integer, Boolean> S = new HashMap<>();
    private Node  Start = new Node(null, width, null, false);
    
    public void addNode(Node P,Node Q,Map<String,Object> data) {
        P.getId();
        Q.getId();
        int pos = allocate(P,Q);
        List<Integer> N = null;
        Node A = new Node(N, P.getNoChildren()*2, data, false);
        Start.addChildren(A, pos);
    }

    

    public int allocate(Node p, Node q) {
        int depth = 0;
        int interval = 0;
        int sumP = 0, sumQ = 0;
        
        while (interval < 1) {
            depth++;
            int[] P = prefix(p.getId(), depth);
            int[] Q = prefix(q.getId(), depth);
            for (int index = 0; index < depth; index++) {
                sumP = sumP*(int)Math.pow(width, index+1);
                sumQ = sumQ*(int)Math.pow(width, index+1);
                sumP +=P[index];
                sumQ +=Q[index];
            }
            interval = sumQ - sumP - 1;
        }

        int step = Math.min(BOUNDARY, interval);

        if (!S.containsKey(depth)) {
            boolean rand = Math.random() < 0.5;
            S.put(depth, rand);
        }

        if (S.get(depth)) {
            int addVal = (int) (Math.random() * step) + 1;  
            int[] P = prefix(p.getId(), depth);
            int[] id = new int[depth];
            for (int index = 0; index < depth; index++) {
                id[index] = P[index];
            }
            return sumP + addVal;
        } else {
            int subVal = (int) (Math.random() * step) + 1;
            return sumQ - subVal;
        }
    }

    private int[] prefix(List<Integer> id, int depth) {
        int[] idCopy = new int[depth];
        for (int cpt = 1; cpt <= depth; cpt++) {
            if (cpt < idCopy.length) {
                idCopy[cpt - 1] = id.get(cpt - 1);
            } else {
                idCopy[cpt - 1] = 0; // Add 0 encoded in the right base
            }
        }
        return idCopy;
    }
}
