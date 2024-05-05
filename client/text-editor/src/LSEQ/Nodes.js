

class Node {
    constructor(Id, noCh, data) {
        this.id = Id;
        this.Data = data;
        this.noChildren = noCh;
        this.uuid = crypto.randomUUID();
        this.Children = new Array(noCh).fill(null);
        this.childrenPos = new Set();
        this.delete = false;
    }

    addChild(pos, A) {
        this.Children[pos] = A;
        this.childrenPos.add(pos);
    }

    getChild(pos) {
        return this.Children[pos];
    }

    setId(Id) {
        this.id = Id;
    }

    getId() {
        return this.id;
    }

    getUUID() {
        return this.uuid;
    }

    setUUID(id) {
        this.uuid = id;
    }

    setDeleted() {
        this.delete = true;
    }

    getDeleted() {
        return this.delete;
    }

    setData(data) {
        this.Data = data;
    }

    getData() {
        return this.Data;
    }

    getNoChildren() {
        return this.noChildren;
    }

    getChildren() {
        return Array.from(this.childrenPos).sort(function(a, b){return a-b});
    }
}

export default Node

