
import Node from './Nodes';

class CRDT {
    
    constructor() {
        this.width = 32;
        this.BOUNDARY = 10;
        this.depthMap = new Map();
        this.Start = new Node(null, this.width, null);
        const id1 = [0];
        this.Begin = new Node(id1, this.width * 2, null);
        const id2 = [this.width - 1];
        this.End = new Node(id2, this.width * 2, null);
        this.Start.addChild(0, this.Begin);
        this.Start.addChild(this.width - 1, this.End);
    }

    _addNode(P, Q, data) {
        const id = this.allocate(P, Q);
        const Copyid = [...id];
        const newNode = new Node(id, this.width * 2 ** id.length, data["data"]);
        if (data["uuid"] !== null) {
            newNode.setUUID(data["uuid"]);
        }
        const pos = Copyid.pop();
        const current = this.getNode(Copyid);
        if (!current.getChild(pos)) {
            current.addChild(pos, newNode);
        } else 
        {
            let flag;
            if(current.getChild(pos).getUUID() === newNode.getUUID())
            {
                flag = 0
            }
            else if(current.getChild(pos).getUUID() > newNode.getUUID())
            {
                flag = -1
            }
            else
            {
                flag = 1
            }
            switch (flag) {
                case 1:
                    this._addNode(current.getChild(pos), Q, data);
                    break;
                case -1:
                    this._addNode(P, current.getChild(pos), data);
                    break;
                case 0:
                    break;
            }
        }
        return newNode;
    }

    _deleteNode(deleteNode) {
        const current = this.getNode(deleteNode.getId());
        current.setDeleted();
    }

    getNode(id) {
        let current = this.Start;
        for (let index = 0; index < id.length; index++) {
            if (current.getChild(id[index]) !== null) {
                current = current.getChild(id[index]);
            } else {
                const tempId = id.slice(0, index + 1);
                const newNode = new Node(tempId, this.width * 2 ** tempId.length, null);
                current.addChild(id[index], newNode);
                current = current.getChild(id[index]);
            }
        }
        return current;
    }

    traverseTree() {
        const Nodes = [];
        const Data = [];
        this._traverseTree(this.Start, Nodes);
        for (const node of Nodes) {
            Data.push(node.getData());
        }
        return Data;
    }

    _traverseTree(NodeS, Nodes) {
        for (const child of NodeS.getChildren()) {
            if (NodeS.getChild(child).getData() !== null && !NodeS.getChild(child).getDeleted()) {
                Nodes.push(NodeS.getChild(child));
            }
            this._traverseTree(NodeS.getChild(child), Nodes);
        }
    }

    allocate(p, q) {
        let depth = 0;
        let interval = -1;
        let sumP = 0, sumQ = 0;

        while (interval < 1) {
            depth++;
            const P = this.prefix(p.getId(), depth);
            const Q = this.prefix(q.getId(), depth);
            for (let index = 0; index < depth; index++) {
                sumP = P[index];
                sumQ = Q[index];
                if (sumQ === 0 && interval === 0) {
                    sumQ = this.width * (2 ** index);
                }
            }
            interval = sumQ - sumP - 1;
        }

        const step = Math.min(this.BOUNDARY, interval);

        if (!this.depthMap.has(depth)) {
            const rand = Math.random() < 0.5;
            this.depthMap.set(depth, rand);
        }

        if (this.depthMap.get(depth)) {
            const addVal = Math.floor(Math.random() * step) + 1;
            const value = sumP + addVal;
            const values = [];
            const P = this.prefix(p.getId(), depth);
            for (let index = 0; index < depth - 1; index++) {
                values.push(P[index]);
            }
            values.push(value);
            return values;
        } else {
            const subVal = Math.floor(Math.random() * step) + 1;
            const value = sumQ - subVal;
            const values = [];
            const P = this.prefix(p.getId(), depth);
            for (let index = 0; index < depth - 1; index++) {
                values.push(P[index]);
            }
            values.push(value);
            return values;
        }
    }

    prefix(id, depth) {
        const idCopy = new Array(depth);
        for (let cpt = 1; cpt <= depth; cpt++) {
            if (cpt < id.length + 1) {
                idCopy[cpt - 1] = id[cpt - 1];
            } else {
                idCopy[cpt - 1] = 0;
            }
        }
        return idCopy;
    }

    searchTree_Id(NodeS, id, map, S) {
        for (const child of NodeS.getChildren()) {
            if (NodeS.getChild(child).getData() !== null) {
                if (!map.flag) {
                    S[1] = NodeS.getChild(child);
                    return;
                }
                if (NodeS.getChild(child).getUUID() === id) {
                    S[0] = NodeS.getChild(child);
                    map.flag = false;
                }
                if(!NodeS.getChild(child).getDeleted())
                {
                    map.counter++;
                }
            }
            this.searchTree_Id(NodeS.getChild(child), id, map, S);
        }
    }

    searchTree(NodeS, index, map, S) {
        for (const child of NodeS.getChildren()) {
            if (NodeS.getChild(child).getData() !== null) {
                if (!map.flag) {
                    S[1] = NodeS.getChild(child);
                    return;
                }
                if (map.counter === index) {
                    S[0] = NodeS.getChild(child);
                    map.flag = false;
                }
                if(!NodeS.getChild(child).getDeleted())
                {
                    map.counter++;
                }
            }
            this.searchTree(NodeS.getChild(child), index, map, S);
        }
    }

    getRelativeIndex(index) {
        const S = [this.Begin, this.End];
        const test = { flag: true, counter: 0 };
        if (index === -1) {
            this.searchTree(this.Start, 0, test, S);
            
            if (S[1] !== this.End || S[0] !== this.Begin) {
                S[1] = S[0];
                S[0] = this.Begin;
            }
        } else {
            this.searchTree(this.Start, index, test, S);
        }
        return S;
    }

    getRelativeIndex_Id(id) {
        const S = [this.Begin, this.End];
        const test = { flag: true, counter: 0 };
        if (id === "-1") {
            this.searchTree(this.Start, 0, test, S);
            if (S[1] !== this.End || S[0] !== this.Begin) {
                S[1] = S[0];
                S[0] = this.Begin;
            }
        } 
        else 
        {
            this.searchTree_Id(this.Start, id, test, S);        
        }
        return S;
    }

    addNode(index, data) {
        const S = this.getRelativeIndex(index);
        const curr = this._addNode(S[0], S[1], data);
        return [S[0], curr];
    }

    addNode_Id(id, data) {
        const S = this.getRelativeIndex_Id(id);
        const curr = this._addNode(S[0], S[1], data);
        return [S[0], curr];
    }

    deleteNode(index) {
        const Nodes = [];
        this._traverseTree(this.Start, Nodes);
        const S = Nodes[index]
        this._deleteNode(S);
        return S;
    }

    deleteNode_Id(id) {
        const S = this.getRelativeIndex_Id(id);
        this._deleteNode(S[0]);
        return S[0];
    }

    update(index, data) {
        const S = this.getRelativeIndex(index);
        S[0].setData(data);
        return S[0];
    }

    update_Id(id, data) {
        const S = this.getRelativeIndex_Id(id);
        S[0].setData(data);
        return S[0];
    }

    getInsertIndex_Id(id) {
        const S = [this.Begin, this.End];
        const test = { flag: true, counter: 0 };
        if (id === "-1") {
            this.searchTree(this.Start, 0, test, S);
            if(S[1] !== this.End || S[0] !== this.Begin)
            {
                S[1] = S[0];
                S[0] = this.Begin;
            }
        } else {
            this.searchTree_Id(this.Start, id, test, S);
        }
        return test["counter"];
    }

}

export default CRDT;