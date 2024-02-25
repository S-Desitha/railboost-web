class Node {
    constructor (data) {
        this.data = data;
        this.next = null;
    }
}


class LinkedList {
    constructor (head = null, arr = null) {
        this.head = head;

        if (arr!=null) {
            arr.forEach(element => {
                this.push(new Node(element));
            });
        }
    }

    push (newNode) {
        if (this.head==null)
            this.head = newNode;
        else {
            let node = this.head;
            while(node.next!=null)
                node = node.next;
            node.next = newNode;
        }
    }

    update (newNode, tag) {
        let node = this.head;
        while(node!=null) {
            if (node.data.tag==tag) {
                node.data = newNode;
                delete node.data.tag;
                break;
            }
            node = node.next;
        }
    }

    move (currentIndex, endIndex) {
        let movedNode;

        if (currentIndex==1) {
            movedNode = this.head;
            this.head = movedNode.next;
        }
        else {
            let node = this.head;
            for (let i=1; i<currentIndex-1; i++) {
                node = node.next;
            }
            movedNode = node.next;
            node.next = movedNode.next;
        }

        if (endIndex==1) {
            movedNode.next = this.head;
            this.head = movedNode;

        }
        else {    
            let node = this.head;
            for (let i=1; i<endIndex-1; i++) {
                node = node.next;
            }
            movedNode.next = node.next;
            node.next = movedNode;
        }
    }

    removeNode(key, value) {
        // if (this.head!=null && this.head.next==null && this.head.data[key]==value)
        //     this.head.data = null;
        if (this.head.data[key]==value) {
            if (this.head.next==null)
                this.head = null;
            else
                this.head = this.head.next;
        }
        else {
            let prev = this.head;
            let node = prev.next;
            while(node!=null) {
                if (node.data[key]==value){
                    prev.next = node.next;
                    break;
                }
                prev = node;
                node = prev.next;
            }
        }
    }

    toArray() {
        let arr = [];
        
        let node = this.head;
        while(node!=null) {
            arr.push(node.data);
            node = node.next;
        }

        return arr;
    }

    tagNode(station, tag) {
        let node = this.head;
        while (node!=null) {
            if (node.data.station==station) {
                node.data.tag = tag;
                break;
            }
            node = node.next;
        }
    }
}

